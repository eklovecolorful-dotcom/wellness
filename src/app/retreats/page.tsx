import type { Metadata } from "next";
import Link from "next/link";
import { Bi } from "@/components/bi";
import { getRetreats, taipeiDate, twd } from "@/lib/data";

export const metadata: Metadata = { title: "靜修 Retreats" };

export default async function RetreatsPage() {
  const retreats = await getRetreats();
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold"><Bi zh="茶山靜修" en="Tea-mountain retreats" /></h1>
      <p className="max-w-2xl text-muted">瑜伽 + 禪坐 + 茶與手沖咖啡儀式。世俗化、短時數，適合上班族與外國旅客。Secular, short and visitor-friendly — linked with Tea × Lens tours.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {retreats.map((r) => (
          <Link key={r.id} href={`/retreats/${r.id}`} className="rounded-2xl border border-line bg-surface p-6 transition-colors duration-700 hover:border-amber-400">
            <h2 className="text-xl font-semibold"><Bi zh={r.title_zh} en={r.title_en} /></h2>
            <p className="mt-3 text-sm text-muted">{taipeiDate(r.starts_at)} · {r.location}</p>
            <p className="mt-1 text-sm">{twd(r.price_twd)} · 訂金 deposit {twd(r.deposit_twd)} · {r.capacity} 人 seats</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
