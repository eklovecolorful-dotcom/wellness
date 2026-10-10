import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env, requireEnv } from "@/lib/env";

/** Service-role client: bypasses RLS. Only for webhooks, cron and booking writes. */
export function createAdminClient() {
  return createClient(env.supabaseUrl, requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
