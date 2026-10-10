import type { Metadata } from "next";

export const metadata: Metadata = { title: "隱私權政策 Privacy" };

// TODO(launch gate): complete per Taiwan PDPA with legal review.
export default function PrivacyPage() {
  return (
    <article className="max-w-2xl space-y-4">
      <h1 className="text-3xl font-semibold">隱私權政策 Privacy policy</h1>
      <ul className="list-disc space-y-2 pl-5">
        <li>健康資料最小化：靜修篩檢只記錄「是否需要醫師同意」，不記錄病名，活動結束 30 天後自動刪除。</li>
        <li>練習紀錄的心情分數與筆記只有你本人看得到；伴侶模式只分享完成狀態。</li>
        <li>付款由 Stripe 處理，我們不儲存信用卡資料。</li>
        <li>你可以隨時刪除帳號與所有練習紀錄。</li>
      </ul>
      <p className="italic text-muted">Minimal health data (a clearance flag, purged after 30 days); private mood notes; completion-only couple sharing; card data handled by Stripe.</p>
    </article>
  );
}
