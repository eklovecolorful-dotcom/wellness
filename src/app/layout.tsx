import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Wellness · 瑜伽 × 禪修 × 咖啡冥想", template: "%s · Wellness" },
  description: "把瑜伽、打坐與茶／咖啡正念，對應到健康、事業、家庭與伴侶的日常練習。",
  applicationName: "Wellness",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3ea" },
    { media: "(prefers-color-scheme: dark)", color: "#141a16" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-Hant-TW" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">
          {/* Pages reading cookies/searchParams stream in behind the static header/footer shell */}
          <Suspense fallback={<p className="text-muted">載入中… Loading…</p>}>{children}</Suspense>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
