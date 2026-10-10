import Link from "next/link";

const nav = [
  { href: "/practice", zh: "今日練習", en: "Practice" },
  { href: "/programs", zh: "計畫", en: "Programs" },
  { href: "/retreats", zh: "靜修", en: "Retreats" },
  { href: "/couple", zh: "伴侶", en: "Couple" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="font-semibold tracking-wide text-forest-700 dark:text-forest-100">
          Wellness <span className="text-amber-600">·</span> 身心整合
        </Link>
        <nav className="flex flex-wrap gap-4 text-sm">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted transition-colors duration-500 hover:text-forest-500">
              {item.zh} <span className="hidden sm:inline">{item.en}</span>
            </Link>
          ))}
          <Link href="/login" className="rounded-full bg-forest-700 px-3 py-1 text-cream hover:bg-forest-500">
            登入
          </Link>
        </nav>
      </div>
    </header>
  );
}
