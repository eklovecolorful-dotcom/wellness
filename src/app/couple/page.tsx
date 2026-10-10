import type { Metadata } from "next";
import { Bi } from "@/components/bi";
import { env, isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { acceptInvite, createInvite, unlink } from "./actions";

export const metadata: Metadata = { title: "伴侶模式 Couple mode" };

const kindLabel: Record<string, string> = {
  daily_core: "晨間練習", coffee: "咖啡冥想", couple_talk: "減壓對話", family_tea: "家庭茶時間",
  stop_pause: "STOP", body_scan: "身體掃描", session: "引導練習",
};

export default async function CouplePage({ searchParams }: PageProps<"/couple">) {
  const { invite, accept, error } = await searchParams;
  if (!isSupabaseConfigured) {
    return <p className="text-muted">伴侶模式需要先連接 Supabase。Couple mode requires Supabase.</p>;
  }

  const supabase = await createClient();
  const { data: couple } = await supabase.from("couples").select("linked_at").maybeSingle();
  const { data: progress } = couple ? await supabase.rpc("partner_progress") : { data: null };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-3xl font-semibold"><Bi zh="伴侶模式" en="Couple mode" /></h1>
      <p className="text-sm text-muted">只分享「完成了哪些練習」，不分享心情分數或筆記。Only completion is shared — never mood scores or notes.</p>
      {error && <p className="text-sm text-red-600">操作失敗（連結可能已過期）。Something went wrong — the link may have expired.</p>}

      {couple ? (
        <section className="space-y-4 rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-semibold">對方最近 7 天 Partner&apos;s last 7 days</h2>
          <ul className="space-y-1 text-sm">
            {(progress ?? []).length === 0 && <li className="text-muted">還沒有紀錄 No practice yet</li>}
            {(progress ?? []).map((p: { day: string; practice_kind: string }) => (
              <li key={p.day + p.practice_kind}>✓ {p.day} · {kindLabel[p.practice_kind] ?? p.practice_kind}</li>
            ))}
          </ul>
          <form action={unlink}><button className="text-sm text-muted underline">解除配對 Unlink</button></form>
        </section>
      ) : typeof accept === "string" ? (
        <form action={acceptInvite} className="space-y-3 rounded-2xl border border-line bg-surface p-6">
          <input type="hidden" name="token" value={accept} />
          <p>接受伴侶邀請？Accept your partner&apos;s invite?</p>
          <button className="rounded-full bg-forest-700 px-6 py-2 text-cream">接受 Accept</button>
        </form>
      ) : (
        <section className="space-y-3 rounded-2xl border border-line bg-surface p-6">
          {typeof invite === "string" ? (
            <>
              <p>把這個連結傳給伴侶（7 天內有效）Send this link to your partner (valid 7 days):</p>
              <code className="block break-all rounded-lg bg-background p-3 text-sm">{`${env.siteUrl}/couple?accept=${invite}`}</code>
            </>
          ) : (
            <form action={createInvite}>
              <button className="rounded-full bg-forest-700 px-6 py-2 text-cream">建立邀請連結 Create invite link</button>
            </form>
          )}
        </section>
      )}

      <aside className="rounded-2xl border border-amber-400/50 bg-amber-400/10 p-5 text-sm">
        伴侶練習不能取代諮商：若有暴力、威脅或長期冷暴力，請直接尋求專業協助（保護專線 113）。
        <span className="block italic text-muted">Couple practices don&apos;t replace counseling. For violence or threats, contact professionals.</span>
      </aside>
    </div>
  );
}
