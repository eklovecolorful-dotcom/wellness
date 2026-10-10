# Architecture & Roadmap

## Modules (playbook §04 P5)

| Module | Where | Status |
|---|---|---|
| Daily core + timer with bell | `src/app/practice`, `src/components/practice-timer.tsx` | ✅ |
| Coffee meditation 7 steps | `src/app/practice/coffee` | ✅ |
| Check-in logging | `src/app/practice/actions.ts` → `practice_logs` | ✅ (signed-in) |
| Programs + Stripe purchase | `src/app/programs` → `entitlements` via webhook | ✅ |
| Retreat booking + screening | `src/app/retreats/[id]`, `book_retreat()` | ✅ |
| Couple mode (invite link) | `src/app/couple`, `partner_progress()` | ✅ |
| Screening purge (30 days) | `/api/cron/purge-screening` + `vercel.json` | ✅ |
| Magic-link auth | `src/app/login`, `src/app/auth/callback` | ✅ |
| Guided audio player + offline PWA cache | Supabase Storage bucket `audio` (signed URLs) + service worker | ⏳ next |
| Streak calendar & push reminders | `practice_logs` + Web Push | ⏳ next |
| Membership subscription + weekly live sit | Stripe `mode: subscription` → `profiles.membership` | ⏳ next |
| TapPay / LINE Pay (Taiwan local) | `src/lib/payments/tappay.ts` alongside Stripe | ⏳ later |
| English locale routing | `/[lang]` segment once content is translated | ⏳ later |

## Payment flow (retreat)
1. User answers screening → `book_retreat(rid, needs_clearance)` locks the retreat row.
2. Full → `waitlist` (no charge). Flagged → `pending_clearance` (no charge, no advice).
3. Otherwise → `pending_payment`, Stripe Checkout for the deposit (expires in 30 min; seat held 30 min).
4. Webhook `checkout.session.completed` → `confirmed` + Resend email; `expired` → `cancelled`.

## Launch gate (P6–P7)
Liability insurance · safety disclaimer · privacy policy (PDPA) · teacher credentials (MBSR / RYT-200) · refund policy.
Tests: screening, capacity, offline audio, couple privacy, 30-day purge.

## 12-week roadmap
See playbook §07. W6–8: audio, streaks, couple mode → W9 pilot 12-person retreat → W10 launch.
