@AGENTS.md

# Wellness — Yoga × Zen × Coffee Mindfulness

Bilingual (zh-TW first, English second) practice platform + retreat booking.
Source plan: integrated-wellness-playbook.md (Playbook 03). Architecture: docs/ARCHITECTURE.md.

## Stack
Next.js 16 App Router (`src/proxy.ts`, not middleware) · Tailwind v4 (`@theme` in globals.css) · Supabase (auth, Postgres + RLS, Storage) · Stripe Checkout · Resend.

## Red lines (enforce in code, copy and review)
1. No treatment/cure claims — describe relaxation, focus, companionship.
2. Health data: store only `screening.needs_clearance`; never the condition; purged 30 days after retreat.
3. Couple mode shares completion only — never `mood_*` or `note`. Read partner data only via `partner_progress()`.
4. Crises/abuse → refer to professionals (1925 / 113).

## Conventions
- Business rules that need atomicity live in SQL functions (`book_retreat`, `accept_couple_invite`).
- Service-role client (`src/lib/supabase/admin.ts`) only in webhooks, cron, and post-checkout updates.
- Pages fall back to `src/content/practices.ts` when Supabase env is missing.
- Spec first: update `features/*.feature` before changing booking/privacy logic.
