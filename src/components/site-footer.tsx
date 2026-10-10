import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto max-w-5xl space-y-3 px-5 py-10 text-sm text-muted">
        <p>
          本平台提供放鬆、專注與陪伴的練習，不構成醫療建議，也不取代心理諮商。若有心理危機或伴侶暴力，請立即聯繫專業人員（安心專線 1925、保護專線 113）。
        </p>
        <p className="italic">
          Practices for relaxation and focus — not medical advice or therapy. In a crisis or abusive situation, contact professionals (Taiwan: 1925 / 113).
        </p>
        <p className="flex gap-4">
          <Link href="/legal/disclaimer" className="underline">安全聲明 Disclaimer</Link>
          <Link href="/legal/privacy" className="underline">隱私權政策 Privacy</Link>
        </p>
      </div>
    </footer>
  );
}
