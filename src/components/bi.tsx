/** Bilingual text: zh-TW first, English in a quieter second line. */
export function Bi({ zh, en, className = "" }: { zh: React.ReactNode; en: React.ReactNode; className?: string }) {
  return (
    <span className={className}>
      <span className="block">{zh}</span>
      <span className="block text-[0.85em] italic text-muted">{en}</span>
    </span>
  );
}
