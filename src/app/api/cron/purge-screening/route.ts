import { requireEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

// Daily job (vercel.json cron): delete screening flags 30 days after each retreat.
export async function GET(request: Request) {
  if (request.headers.get("authorization") !== `Bearer ${requireEnv("CRON_SECRET")}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { data, error } = await createAdminClient().rpc("purge_expired_screening");
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ purged: data });
}
