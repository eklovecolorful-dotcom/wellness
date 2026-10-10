import type { Metadata } from "next";
import Link from "next/link";
import { Bi } from "@/components/bi";
import { LoggedTimer } from "@/components/logged-timer";
import { dailyCore } from "@/content/practices";

export const metadata: Metadata = { title: "今日練習 Today" };

export default function PracticePage() {
  const steps = dailyCore.map((s) => ({ zh: s.zh, en: s.en, seconds: s.minutes * 60 }));
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
      <section className="space-y-6">
        <h1 className="text-3xl font-semibold"><Bi zh="晨間 20 分鐘整合練習" en="Daily core: 20-minute morning sequence" /></h1>
        <ol className="space-y-4">
          {dailyCore.map((s, i) => (
            <li key={i} className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-xs text-amber-600">{s.minutes} 分 min</p>
              <Bi zh={s.zh} en={s.en} />
            </li>
          ))}
        </ol>
        <Link href="/practice/coffee" className="inline-block text-forest-500 underline">
          咖啡冥想 7 步驟 → Coffee meditation in 7 steps
        </Link>
      </section>
      <LoggedTimer steps={steps} kind="daily_core" />
    </div>
  );
}
