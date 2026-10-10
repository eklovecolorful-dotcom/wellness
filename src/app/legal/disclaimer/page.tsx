import type { Metadata } from "next";

export const metadata: Metadata = { title: "安全聲明 Disclaimer" };

// TODO(launch gate): have a lawyer review before production.
export default function DisclaimerPage() {
  return (
    <article className="prose max-w-2xl space-y-4">
      <h1 className="text-3xl font-semibold">安全聲明 Safety disclaimer</h1>
      <p>本平台內容為放鬆、專注與生活練習之教育用途，不構成醫療建議、診斷或治療，亦不取代醫師或心理師。</p>
      <p>冥想並非零風險；若練習中出現不適，請隨時停止。有創傷、精神疾病史、懷孕或近期手術者，請先諮詢專業人員。</p>
      <p>心理危機請撥打安心專線 1925；家庭或伴侶暴力請撥打保護專線 113。</p>
      <p className="italic text-muted">Content is educational and not medical advice, diagnosis or treatment. Stop at any time if you feel unwell. In Taiwan, call 1925 (mental health) or 113 (abuse).</p>
    </article>
  );
}
