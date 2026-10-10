"use client";

import { PracticeTimer } from "@/components/practice-timer";
import { logPractice } from "@/app/practice/actions";

type Step = { zh: string; en: string; seconds: number };

export function LoggedTimer({ steps, kind }: { steps: Step[]; kind: "daily_core" | "coffee" }) {
  const minutes = Math.round(steps.reduce((s, x) => s + x.seconds, 0) / 60);
  return <PracticeTimer steps={steps} onComplete={() => void logPractice(kind, minutes)} />;
}
