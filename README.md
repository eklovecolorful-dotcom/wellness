# Wellness · 瑜伽 × 禪修 × 咖啡冥想

## 開始 Getting started
```bash
cp .env.example .env.local   # 先不填也能啟動，會使用靜態示範資料
npm run dev                  # http://localhost:3000
```

## Supabase
```bash
npx supabase init            # 或直接到 Dashboard → SQL Editor
npx supabase link --project-ref <ref>
npx supabase db push         # 套用 supabase/migrations/0001_wellness.sql
psql "$DB_URL" -f supabase/seed.sql
```
Auth → URL Configuration：加入 `http://localhost:3000/auth/callback`。

## Stripe
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe   # 把 whsec_... 填入 STRIPE_WEBHOOK_SECRET
```

## 文件 Docs
- `CLAUDE.md` — 專案規則與三條紅線
- `docs/ARCHITECTURE.md` — 模組、付款流程、上線閘門、路線圖
- `features/` — BDD 規格
- `.claude/commands/` — `/script-practice`、`/repurpose-practice`
