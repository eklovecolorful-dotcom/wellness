import { notFound } from "next/navigation";
import { Bi } from "@/components/bi";
import { CLEARANCE_MESSAGE, statusMessage, type BookingStatus } from "@/lib/booking";
import { getRetreat, taipeiDate, twd } from "@/lib/data";
import { bookRetreat } from "./actions";

export default async function RetreatPage({ params, searchParams }: PageProps<"/retreats/[id]">) {
  const { id } = await params;
  const { status, error } = await searchParams;
  const retreat = await getRetreat(id);
  if (!retreat) notFound();

  const msg = typeof status === "string" && status in statusMessage ? statusMessage[status as BookingStatus] : null;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold"><Bi zh={retreat.title_zh} en={retreat.title_en} /></h1>
        <p className="text-muted">{taipeiDate(retreat.starts_at)} · {retreat.location}</p>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>溫和瑜伽（提供替代動作）Gentle yoga with pose alternatives</li>
          <li>打坐數息 Zen breath counting</li>
          <li>茶與手沖咖啡正念 Tea &amp; pour-over mindfulness</li>
        </ul>
        <p>{twd(retreat.price_twd)}（訂金 deposit {twd(retreat.deposit_twd)}）· 限 {retreat.capacity} 人</p>
      </section>

      <section className="rounded-3xl border border-line bg-surface p-6">
        {msg ? (
          <div className="space-y-2">
            {status === "pending_clearance" && <p className="font-semibold">{CLEARANCE_MESSAGE}</p>}
            <Bi zh={msg.zh} en={msg.en} />
          </div>
        ) : (
          <form action={bookRetreat} className="space-y-5">
            <input type="hidden" name="retreatId" value={retreat.id} />
            <fieldset className="space-y-2">
              <legend className="font-semibold">安全篩檢 Safety screening</legend>
              <p className="text-sm">你目前是否懷孕、近期動過手術，或有需要醫師同意才能運動／靜坐的狀況？</p>
              <p className="text-sm italic text-muted">Are you pregnant, recently had surgery, or have a condition that needs medical clearance?</p>
              <div className="flex gap-6 pt-1">
                <label className="flex items-center gap-2"><input type="radio" name="needsClearance" value="no" required /> 否 No</label>
                <label className="flex items-center gap-2"><input type="radio" name="needsClearance" value="yes" /> 是 Yes</label>
              </div>
              <p className="text-xs text-muted">我們只記錄「是否需要醫師同意」，不詢問病名；活動結束 30 天後自動刪除。We store only a yes/no flag, deleted 30 days after the retreat.</p>
            </fieldset>
            {error && <p className="text-sm text-red-600">預約失敗，請再試一次。Booking failed, please try again.</p>}
            <button className="w-full rounded-full bg-forest-700 py-3 text-cream hover:bg-forest-500">
              預約並支付訂金 Book &amp; pay deposit
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
