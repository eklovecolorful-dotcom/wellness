"use server";

import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const KINDS = ["daily_core", "coffee", "stop_pause", "body_scan", "family_tea", "couple_talk"] as const;
type Kind = (typeof KINDS)[number];

/** Check-in: logs completion for signed-in users; silently no-ops for guests. */
export async function logPractice(kind: Kind, minutes: number) {
  if (!isSupabaseConfigured || !KINDS.includes(kind)) return { saved: false };
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { saved: false };
  const { error } = await supabase.from("practice_logs").insert({ practice_kind: kind, minutes });
  return { saved: !error };
}
