"use client";

import { useEffect, useRef, useState } from "react";

type Step = { zh: string; en: string; seconds: number };

/** Soft bell via Web Audio — no asset needed, works offline. */
function ringBell() {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = 528;
  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 4);
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function PracticeTimer({ steps, onComplete }: { steps: Step[]; onComplete?: () => void }) {
  const [pos, setPos] = useState({ index: 0, remaining: steps[0].seconds });
  const [running, setRunning] = useState(false);
  const [bell, setBell] = useState(true);
  const [done, setDone] = useState(false);
  const latest = useRef({ pos, bell, onComplete });
  useEffect(() => {
    latest.current = { pos, bell, onComplete };
  });

  // Advances one second, or moves to the next step when the current one ends.
  function advance(skip = false) {
    const { pos, bell, onComplete } = latest.current;
    if (!skip && pos.remaining > 1) {
      setPos({ ...pos, remaining: pos.remaining - 1 });
      return;
    }
    if (bell) ringBell();
    if (pos.index < steps.length - 1) {
      setPos({ index: pos.index + 1, remaining: steps[pos.index + 1].seconds });
    } else {
      setPos({ ...pos, remaining: 0 });
      setRunning(false);
      setDone(true);
      onComplete?.();
    }
  }
  const advanceRef = useRef(advance);
  useEffect(() => {
    advanceRef.current = advance;
  });

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => advanceRef.current(), 1000);
    return () => clearInterval(id);
  }, [running]);

  const { index, remaining } = pos;
  const step = steps[index];

  return (
    <div className="rounded-3xl border border-line bg-surface p-8 text-center">
      <div className="mx-auto mb-6 flex size-40 items-center justify-center rounded-full bg-forest-100 dark:bg-forest-900">
        <div className={`size-28 rounded-full bg-forest-500/40 ${running ? "animate-breathe" : ""}`} />
      </div>
      <p className="font-mono text-4xl tabular-nums">{fmt(Math.max(remaining, 0))}</p>
      <p className="mt-2 text-sm text-muted">{index + 1} / {steps.length}</p>
      <p className="mt-4 text-lg">{step.zh}</p>
      <p className="text-sm italic text-muted">{step.en}</p>

      {done ? (
        <p className="mt-6 text-forest-500">完成了，謝謝你陪自己這段時間。 Well done.</p>
      ) : (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => setRunning(!running)} className="rounded-full bg-forest-700 px-6 py-2 text-cream hover:bg-forest-500">
            {running ? "暫停 Pause" : "開始 Start"}
          </button>
          <button onClick={() => advance(true)} className="rounded-full border border-line px-4 py-2 text-sm">
            下一步 Next
          </button>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" checked={bell} onChange={(e) => setBell(e.target.checked)} /> 鐘聲 Bell
          </label>
        </div>
      )}
      <p className="mt-6 text-xs text-muted">任何時候都可以睜開眼睛或停下來。You may open your eyes or stop at any time.</p>
    </div>
  );
}
