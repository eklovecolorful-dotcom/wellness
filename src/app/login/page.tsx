import type { Metadata } from "next";
import { Bi } from "@/components/bi";
import { isSupabaseConfigured } from "@/lib/env";
import { sendMagicLink } from "./actions";

export const metadata: Metadata = { title: "登入 Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { sent, error, next } = await searchParams;
  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-3xl font-semibold"><Bi zh="登入" en="Sign in" /></h1>
      {!isSupabaseConfigured && (
        <p className="rounded-xl bg-amber-400/15 p-4 text-sm">尚未設定 Supabase：請在 .env.local 填入 NEXT_PUBLIC_SUPABASE_URL 與 NEXT_PUBLIC_SUPABASE_ANON_KEY。</p>
      )}
      {sent ? (
        <p className="rounded-xl bg-forest-50 p-4 text-forest-700 dark:bg-forest-900 dark:text-forest-100">
          登入連結已寄出，請查看信箱。Check your inbox for the sign-in link.
        </p>
      ) : (
        <form action={sendMagicLink} className="space-y-4">
          <input type="hidden" name="next" value={typeof next === "string" ? next : "/practice"} />
          <input name="email" type="email" required placeholder="you@example.com"
            className="w-full rounded-xl border border-line bg-surface px-4 py-3" />
          {error && <p className="text-sm text-red-600">請再試一次。Please try again.</p>}
          <button className="w-full rounded-full bg-forest-700 py-3 text-cream hover:bg-forest-500">
            寄送登入連結 Email me a link
          </button>
        </form>
      )}
    </div>
  );
}
