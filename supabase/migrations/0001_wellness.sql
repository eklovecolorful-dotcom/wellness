-- Wellness platform schema (playbook §04 P3 data model, expanded with RLS)
-- Red lines: no treatment claims · minimal health data · couples share completion only

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  locale text not null default 'zh-TW' check (locale in ('zh-TW', 'en')),
  membership text not null default 'free' check (membership in ('free', 'member')),
  stripe_customer_id text unique,
  created_at timestamptz not null default now()
);

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Programs & sessions (content catalogue)
-- ---------------------------------------------------------------------------
create table public.programs (
  id text primary key,
  title_zh text not null,
  title_en text not null,
  summary_zh text,
  summary_en text,
  domain text check (domain in ('health', 'career', 'family', 'relationship', 'sleep')),
  days int not null,
  tier text not null check (tier in ('free', 'paid', 'member')),
  price_twd int,
  stripe_price_id text
);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  program_id text not null references public.programs on delete cascade,
  day int not null,
  title_zh text not null,
  title_en text not null,
  audio_path text,            -- Supabase Storage: bucket "audio"
  transcript_path text,       -- accessibility: every audio ships a transcript
  minutes int not null,
  unique (program_id, day)
);

-- Which paid programs a user owns (written by the Stripe webhook only)
create table public.entitlements (
  user_id uuid references auth.users on delete cascade,
  program_id text references public.programs on delete cascade,
  granted_at timestamptz not null default now(),
  primary key (user_id, program_id)
);

-- ---------------------------------------------------------------------------
-- Practice logs & streaks
-- ---------------------------------------------------------------------------
create table public.practice_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  session_id uuid references public.sessions on delete set null,
  practice_kind text not null default 'session'
    check (practice_kind in ('session', 'daily_core', 'coffee', 'stop_pause', 'body_scan', 'family_tea', 'couple_talk')),
  done_at timestamptz not null default now(),
  minutes int,
  mood_before int check (mood_before between 1 and 5),
  mood_after int check (mood_after between 1 and 5),
  note text                    -- private: never shared with partner
);
create index practice_logs_user_day on public.practice_logs (user_id, done_at desc);

-- ---------------------------------------------------------------------------
-- Couple mode: invite link pairing, completion-only sharing
-- ---------------------------------------------------------------------------
create table public.couple_invites (
  token text primary key default encode(gen_random_bytes(16), 'hex'),
  inviter uuid not null references auth.users on delete cascade default auth.uid(),
  expires_at timestamptz not null default now() + interval '7 days',
  accepted_by uuid references auth.users on delete set null
);

create table public.couples (
  user_a uuid references auth.users on delete cascade,
  user_b uuid references auth.users on delete cascade,
  linked_at timestamptz not null default now(),
  primary key (user_a, user_b),
  check (user_a < user_b)
);

create function public.partner_of(uid uuid) returns uuid
language sql stable security definer set search_path = '' as $$
  select case when user_a = uid then user_b else user_a end
  from public.couples where user_a = uid or user_b = uid limit 1
$$;

-- Partner sees ONLY dates + kinds of completed practice, never mood or notes
create function public.partner_progress(since date default current_date - 6)
returns table (day date, practice_kind text)
language sql stable security definer set search_path = '' as $$
  select distinct (l.done_at at time zone 'Asia/Taipei')::date, l.practice_kind
  from public.practice_logs l
  where l.user_id = public.partner_of(auth.uid())
    and l.done_at >= since
$$;

create function public.accept_couple_invite(invite_token text) returns void
language plpgsql security definer set search_path = '' as $$
declare inv public.couple_invites;
begin
  select * into inv from public.couple_invites
  where token = invite_token and accepted_by is null and expires_at > now()
  for update;
  if inv is null then raise exception 'invalid_or_expired_invite'; end if;
  if inv.inviter = auth.uid() then raise exception 'cannot_pair_with_self'; end if;
  if public.partner_of(auth.uid()) is not null or public.partner_of(inv.inviter) is not null then
    raise exception 'already_paired';
  end if;
  update public.couple_invites set accepted_by = auth.uid() where token = invite_token;
  insert into public.couples (user_a, user_b)
  values (least(inv.inviter, auth.uid()), greatest(inv.inviter, auth.uid()));
end $$;

-- ---------------------------------------------------------------------------
-- Retreats, bookings, screening
-- ---------------------------------------------------------------------------
create table public.retreats (
  id text primary key,
  title_zh text not null,
  title_en text not null,
  location text,
  starts_at timestamptz not null,
  capacity int not null check (capacity > 0),
  price_twd int not null,
  deposit_twd int not null
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  retreat_id text not null references public.retreats,
  user_id uuid not null references auth.users on delete cascade,
  status text not null check (status in ('pending_payment', 'pending_clearance', 'confirmed', 'waitlist', 'cancelled')),
  stripe_session_id text unique,
  created_at timestamptz not null default now()
);
create index bookings_retreat on public.bookings (retreat_id, status);

-- Sensitive: keep screening separate & minimal. Store ONLY a boolean, never the condition.
create table public.screening (
  booking_id uuid primary key references public.bookings on delete cascade,
  needs_clearance boolean not null,
  purge_after date not null
);

-- Seats taken = confirmed + clearance-pending + recently started checkouts
create function public.seats_taken(rid text) returns int
language sql stable security definer set search_path = '' as $$
  select count(*)::int from public.bookings
  where retreat_id = rid
    and (status in ('confirmed', 'pending_clearance')
         or (status = 'pending_payment' and created_at > now() - interval '30 minutes'))
$$;

create unique index bookings_one_active_per_user
  on public.bookings (retreat_id, user_id) where status <> 'cancelled';

-- Atomic booking (features/retreat-booking.feature): locks the retreat row so
-- two people can't take the last seat. Full → waitlist (never charged);
-- flagged → pending_clearance (never charged, no medical advice);
-- otherwise → pending_payment until the Stripe webhook confirms.
create function public.book_retreat(rid text, needs_clearance boolean)
returns table (booking_id uuid, booking_status text)
language plpgsql security definer set search_path = '' as $$
declare
  r public.retreats;
  new_status text;
  bid uuid;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  select * into r from public.retreats where id = rid for update;
  if r is null then raise exception 'retreat_not_found'; end if;

  if public.seats_taken(rid) >= r.capacity then new_status := 'waitlist';
  elsif needs_clearance then new_status := 'pending_clearance';
  else new_status := 'pending_payment';
  end if;

  insert into public.bookings (retreat_id, user_id, status)
  values (rid, auth.uid(), new_status) returning id into bid;
  insert into public.screening (booking_id, needs_clearance, purge_after)
  values (bid, needs_clearance, (r.starts_at + interval '30 days')::date);

  return query select bid, new_status;
end $$;

-- Purge job (called daily by /api/cron/purge-screening or pg_cron)
create function public.purge_expired_screening() returns int
language sql security definer set search_path = '' as $$
  with d as (delete from public.screening where purge_after < current_date returning 1)
  select count(*)::int from d
$$;

revoke execute on function public.purge_expired_screening() from public, anon, authenticated;
revoke execute on function public.book_retreat(text, boolean) from public, anon;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.programs enable row level security;
alter table public.sessions enable row level security;
alter table public.entitlements enable row level security;
alter table public.practice_logs enable row level security;
alter table public.couple_invites enable row level security;
alter table public.couples enable row level security;
alter table public.retreats enable row level security;
alter table public.bookings enable row level security;
alter table public.screening enable row level security;   -- no policies: service role only

create policy "own profile" on public.profiles for select using (id = auth.uid());
create policy "update own profile" on public.profiles for update using (id = auth.uid());

create policy "catalogue is public" on public.programs for select using (true);
create policy "sessions are public" on public.sessions for select using (true);
create policy "retreats are public" on public.retreats for select using (true);

create policy "own entitlements" on public.entitlements for select using (user_id = auth.uid());

create policy "own logs read" on public.practice_logs for select using (user_id = auth.uid());
create policy "own logs write" on public.practice_logs for insert with check (user_id = auth.uid());
create policy "own logs delete" on public.practice_logs for delete using (user_id = auth.uid());

create policy "own invites" on public.couple_invites for select using (inviter = auth.uid());
create policy "create invite" on public.couple_invites for insert with check (inviter = auth.uid());

create policy "own couple" on public.couples for select using (auth.uid() in (user_a, user_b));
create policy "unlink couple" on public.couples for delete using (auth.uid() in (user_a, user_b));

create policy "own bookings" on public.bookings for select using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Storage: guided audio (members/paid gating is done via signed URLs server-side)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public) values ('audio', 'audio', false)
on conflict (id) do nothing;
