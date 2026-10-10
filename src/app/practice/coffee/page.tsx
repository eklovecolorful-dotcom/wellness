import type { Metadata } from "next";
import { Bi } from "@/components/bi";
import { LoggedTimer } from "@/components/logged-timer";
import { coffeeSteps } from "@/content/practices";

export const metadata: Metadata = { title: "咖啡冥想 Coffee meditation" };

export default function CoffeePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold"><Bi zh="咖啡冥想 7 步驟（15 分鐘）" en="Coffee meditation in 7 steps (15 min)" /></h1>
      <LoggedTimer steps={coffeeSteps} kind="coffee" />
      <aside className="rounded-2xl border border-line bg-surface p-5 text-sm">
        <p>☕ 咖啡因提醒：健康成人每日約 400 毫克以內（約 3–4 杯）一般不會造成危害；孕婦、焦慮或失眠者應減量。下午後可改用低咖啡因咖啡或茶。</p>
        <p className="mt-1 italic text-muted">Up to ~400 mg/day is generally fine for healthy adults (FDA). Use decaf or tea after midday.</p>
      </aside>
    </div>
  );
}
