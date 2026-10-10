// Static content from the Integrated Wellness Playbook (§01, §02, §03).
// Bilingual: zh-TW first, English second.

export type Evidence = "strong" | "moderate" | "emerging";

export const evidenceLabel: Record<Evidence, { zh: string; en: string }> = {
  strong: { zh: "強", en: "Strong" },
  moderate: { zh: "中", en: "Moderate" },
  emerging: { zh: "初步", en: "Emerging" },
};

export const dailyCore = [
  { minutes: 5, zh: "瑜伽喚醒：貓牛式 → 下犬式 → 嬰兒式，配合鼻呼吸，不追求柔軟度", en: "Yoga wake-up: cat-cow → downward dog → child's pose, nasal breathing" },
  { minutes: 10, zh: "打坐數息：坐椅子或蒲團皆可，背直肩鬆；數到十再從一開始，分心就溫和回到一", en: "Zen breath counting: chair or cushion; count 1–10, return to 1 when distracted" },
  { minutes: 5, zh: "咖啡或茶正念：專注香氣、溫度、第一口味道，喝完寫下一句今天的意圖", en: "Coffee or tea mindfulness: aroma, warmth, first sip — then write one intention" },
];

export const coffeeSteps = [
  { zh: "看：觀察咖啡豆的顏色與形狀 30 秒", en: "See: observe the beans for 30 seconds", seconds: 30 },
  { zh: "聞：研磨前後各聞一次，留意香氣變化", en: "Smell: before and after grinding", seconds: 60 },
  { zh: "聽：專注研磨與水沸的聲音", en: "Listen: the grinder and the kettle", seconds: 120 },
  { zh: "注水：慢速畫圈，觀察悶蒸時同步慢呼吸", en: "Pour: slow circles; breathe slowly during the bloom", seconds: 180 },
  { zh: "等待：萃取期間不滑手機，感受雙腳與呼吸", en: "Wait: no phone; feel your feet and breath", seconds: 180 },
  { zh: "品飲三口：溫度、酸甜、餘韻", en: "Three sips: temperature, acidity/sweetness, finish", seconds: 180 },
  { zh: "感謝：想一位種植、烘焙或陪伴你的人", en: "Gratitude: think of a grower, roaster or loved one", seconds: 60 },
];

export const domains: {
  key: string; zh: string; en: string; practiceZh: string; practiceEn: string; doseZh: string; doseEn: string; evidence: Evidence;
}[] = [
  { key: "health", zh: "健康", en: "Health", practiceZh: "每日核心 20 分鐘；下背不適者每週 2–3 次溫和瑜伽；睡前 10 分鐘身體掃描", practiceEn: "Daily core; gentle yoga 2–3×/wk for back pain; 10-min bedtime body scan", doseZh: "每天", doseEn: "Daily", evidence: "strong" },
  { key: "career", zh: "事業", en: "Career", practiceZh: "STOP 暫停法（停、吸一口氣、觀察、再行動）；25 分鐘單一任務專注", practiceEn: "STOP pause before replies and meetings; 25-min single-tasking", doseZh: "每天 3 次", doseEn: "3×/day", evidence: "emerging" },
  { key: "family", zh: "家庭", en: "Family", practiceZh: "家庭茶時間 15 分鐘：手機放籃子，每人說一件感謝的事", practiceEn: "15-min family tea time: phones away, one gratitude each", doseZh: "每週 3 次", doseEn: "3×/week", evidence: "emerging" },
  { key: "relationship", zh: "伴侶關係", en: "Relationship", practiceZh: "每日 20 分鐘減壓對話：只傾聽、站在對方那一邊", practiceEn: "Daily 20-min stress-reducing conversation: listen, take their side", doseZh: "每天", doseEn: "Daily", evidence: "moderate" },
  { key: "conflict", zh: "婚姻衝突", en: "Marital conflict", practiceZh: "四騎士解藥：溫和開場、表達欣賞、承擔責任、暫停 20 分鐘自我安撫", practiceEn: "Four Horsemen antidotes: gentle start-up, appreciation, responsibility, 20-min break", doseZh: "衝突時", doseEn: "In conflict", evidence: "moderate" },
  { key: "bonding", zh: "伴侶連結", en: "Couple bonding", practiceZh: "週末雙人瑜伽 20 分鐘 + 一起手沖咖啡；慈心冥想", practiceEn: "Weekend partner yoga + brewing together; loving-kindness", doseZh: "每週 1 次", doseEn: "Weekly", evidence: "emerging" },
];

export const products = [
  { zh: "免費：7 天入門", en: "Free: 7-day starter", descZh: "每天 10 分鐘引導音檔 + 打卡", descEn: "10-min guided audio + check-in", href: "/programs" },
  { zh: "21 天主題計畫", en: "21-day programs", descZh: "職場專注、伴侶連結、好眠", descEn: "Focus, couple connection, better sleep", href: "/programs" },
  { zh: "會員", en: "Membership", descZh: "每月新內容 + 每週線上共修", descEn: "Monthly content + weekly live sit", href: "/programs" },
  { zh: "茶山靜修", en: "Tea-mountain retreats", descZh: "瑜伽 + 禪坐 + 茶與手沖咖啡儀式", descEn: "Yoga, sitting, tea & coffee ritual", href: "/retreats" },
];

export type Program = {
  id: string; title_zh: string; title_en: string; summary_zh: string | null; summary_en: string | null;
  days: number; tier: "free" | "paid" | "member"; price_twd: number | null;
};

export type Retreat = {
  id: string; title_zh: string; title_en: string; location: string | null;
  starts_at: string; capacity: number; price_twd: number; deposit_twd: number;
};

// Fallbacks so pages render before Supabase is connected (kept in sync with supabase/seed.sql)
export const fallbackPrograms: Program[] = [
  { id: "starter-7", title_zh: "7 天入門", title_en: "7-Day Starter", summary_zh: "每天 10 分鐘引導音檔 + 打卡", summary_en: "10-min guided audio + check-in", days: 7, tier: "free", price_twd: null },
  { id: "focus-21", title_zh: "21 天職場專注", title_en: "21-Day Workplace Focus", summary_zh: "STOP 暫停法與 25 分鐘單一任務", summary_en: "STOP pause and 25-min single-tasking", days: 21, tier: "paid", price_twd: 990 },
  { id: "couple-21", title_zh: "21 天伴侶連結", title_en: "21-Day Couple Connection", summary_zh: "減壓對話、四騎士解藥、雙人儀式", summary_en: "Stress-reducing talks, Four Horsemen antidotes, shared rituals", days: 21, tier: "paid", price_twd: 1290 },
  { id: "sleep-21", title_zh: "21 天好眠", title_en: "21-Day Better Sleep", summary_zh: "睡前身體掃描與低咖啡因儀式", summary_en: "Bedtime body scan and decaf rituals", days: 21, tier: "paid", price_twd: 990 },
];

export const fallbackRetreats: Retreat[] = [
  { id: "tea-mountain-half-2026-12-05", title_zh: "茶山半日靜修", title_en: "Tea Mountain Half-day Retreat", location: "坪林 Pinglin", starts_at: "2026-12-05T00:00:00Z", capacity: 12, price_twd: 2800, deposit_twd: 1000 },
  { id: "zen-tea-morning-2026-12-12", title_zh: "Taiwan Zen & Tea Morning（英文）", title_en: "Taiwan Zen & Tea Morning", location: "貓空 Maokong", starts_at: "2026-12-11T23:30:00Z", capacity: 10, price_twd: 3600, deposit_twd: 1200 },
];
