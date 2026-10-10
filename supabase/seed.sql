insert into public.programs (id, title_zh, title_en, summary_zh, summary_en, domain, days, tier, price_twd) values
  ('starter-7', '7 天入門', '7-Day Starter', '每天 10 分鐘引導音檔 + 打卡', '10-min guided audio + check-in', 'health', 7, 'free', null),
  ('focus-21', '21 天職場專注', '21-Day Workplace Focus', 'STOP 暫停法與 25 分鐘單一任務', 'STOP pause and 25-min single-tasking', 'career', 21, 'paid', 990),
  ('couple-21', '21 天伴侶連結', '21-Day Couple Connection', '減壓對話、四騎士解藥、雙人儀式', 'Stress-reducing talks, Four Horsemen antidotes, shared rituals', 'relationship', 21, 'paid', 1290),
  ('sleep-21', '21 天好眠', '21-Day Better Sleep', '睡前身體掃描與低咖啡因儀式', 'Bedtime body scan and decaf rituals', 'sleep', 21, 'paid', 990)
on conflict (id) do nothing;

insert into public.sessions (program_id, day, title_zh, title_en, minutes)
select 'starter-7', d, '第 ' || d || ' 天', 'Day ' || d, 10 from generate_series(1, 7) d
on conflict do nothing;

insert into public.retreats (id, title_zh, title_en, location, starts_at, capacity, price_twd, deposit_twd) values
  ('tea-mountain-half-2026-12-05', '茶山半日靜修', 'Tea Mountain Half-day Retreat', '坪林 Pinglin', '2026-12-05 08:00+08', 12, 2800, 1000),
  ('zen-tea-morning-2026-12-12', 'Taiwan Zen & Tea Morning（英文）', 'Taiwan Zen & Tea Morning', '貓空 Maokong', '2026-12-12 07:30+08', 10, 3600, 1200)
on conflict (id) do nothing;
