import Link from "next/link";
import { Bi } from "@/components/bi";
import { domains, evidenceLabel, products } from "@/content/practices";

export default function Home() {
  return (
    <div className="space-y-20">
      <section className="space-y-6 pt-6">
        <p className="text-sm tracking-widest text-amber-600">YOGA × ZEN × COFFEE MINDFULNESS</p>
        <h1 className="text-4xl font-semibold leading-tight text-forest-700 sm:text-5xl dark:text-forest-100">
          把練習帶進生活：<br />職場、伴侶、家庭的每一天
        </h1>
        <p className="max-w-2xl text-lg text-muted">
          Practice for life outcomes, not just “meditation”. Twenty minutes each morning — yoga, breath counting and a mindful cup of tea or coffee.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/practice" className="rounded-full bg-forest-700 px-6 py-3 text-cream hover:bg-forest-500">
            開始今日 20 分鐘 Start today
          </Link>
          <Link href="/retreats" className="rounded-full border border-forest-500 px-6 py-3 text-forest-700 hover:bg-forest-50 dark:text-forest-100 dark:hover:bg-forest-900">
            茶山靜修 Retreats
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold"><Bi zh="五大人生領域的實作處方" en="Protocols by life domain" /></h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {domains.map((d) => (
            <article key={d.key} className="rounded-2xl border border-line bg-surface p-5">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold">{d.zh} <span className="text-sm font-normal text-muted">{d.en}</span></h3>
                <span className="rounded-full bg-forest-50 px-2 py-0.5 text-xs text-forest-700 dark:bg-forest-900 dark:text-forest-100">
                  證據 {evidenceLabel[d.evidence].zh}
                </span>
              </div>
              <p className="text-sm">{d.practiceZh}</p>
              <p className="mt-1 text-xs italic text-muted">{d.practiceEn}</p>
              <p className="mt-3 text-xs text-amber-600">{d.doseZh} · {d.doseEn}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold"><Bi zh="從免費入門到茶山靜修" en="From a free starter to tea-mountain retreats" /></h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <Link key={p.zh} href={p.href} className="rounded-2xl border border-line bg-surface p-5 transition-colors duration-700 hover:border-amber-400">
              <Bi zh={<strong>{p.zh}</strong>} en={p.en} />
              <p className="mt-3 text-sm text-muted">{p.descZh}</p>
            </Link>
          ))}
        </div>
      </section>

      <aside className="rounded-2xl border border-amber-400/50 bg-amber-400/10 p-5 text-sm">
        <p>⚠️ 冥想不是零風險：約 8% 的練習者曾出現不良經驗。有創傷或精神疾病史者請先諮詢專業人員；任何時候都可以睜開眼睛、停下來。</p>
        <p className="mt-1 italic text-muted">Meditation isn&apos;t risk-free (~8% report adverse effects). You may open your eyes or stop at any time.</p>
      </aside>
    </div>
  );
}
