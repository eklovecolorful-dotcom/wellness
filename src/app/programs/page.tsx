import type { Metadata } from "next";
import { Bi } from "@/components/bi";
import { getPrograms, twd } from "@/lib/data";
import { buyProgram } from "./actions";

export const metadata: Metadata = { title: "計畫 Programs" };

const tierLabel = { free: "免費 Free", paid: "付費 Paid", member: "會員 Members" } as const;

export default async function ProgramsPage({ searchParams }: PageProps<"/programs">) {
  const { purchased } = await searchParams;
  const programs = await getPrograms();
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold"><Bi zh="主題計畫" en="Programs" /></h1>
      {purchased && (
        <p className="rounded-xl bg-forest-50 p-4 text-forest-700 dark:bg-forest-900 dark:text-forest-100">
          感謝購買！計畫已加入你的帳號。Thank you — the program is now in your account.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {programs.map((p) => (
          <article key={p.id} className="flex flex-col rounded-2xl border border-line bg-surface p-6">
            <p className="text-xs text-amber-600">{tierLabel[p.tier]} · {p.days} 天 days</p>
            <h2 className="mt-2 text-xl font-semibold"><Bi zh={p.title_zh} en={p.title_en} /></h2>
            <p className="mt-3 flex-1 text-sm text-muted">{p.summary_zh}</p>
            {p.tier === "paid" && p.price_twd ? (
              <form action={buyProgram} className="mt-4">
                <input type="hidden" name="programId" value={p.id} />
                <button className="rounded-full bg-forest-700 px-5 py-2 text-cream hover:bg-forest-500">
                  {twd(p.price_twd)} 購買 Buy
                </button>
              </form>
            ) : (
              <a href="/practice" className="mt-4 text-forest-500 underline">開始 Start →</a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
