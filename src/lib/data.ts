import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { fallbackPrograms, fallbackRetreats, type Program, type Retreat } from "@/content/practices";

export async function getPrograms(): Promise<Program[]> {
  if (!isSupabaseConfigured) return fallbackPrograms;
  const supabase = await createClient();
  const { data } = await supabase.from("programs").select("*").order("days");
  return data ?? fallbackPrograms;
}

export async function getRetreats(): Promise<Retreat[]> {
  if (!isSupabaseConfigured) return fallbackRetreats;
  const supabase = await createClient();
  const { data } = await supabase.from("retreats").select("*").gte("starts_at", new Date().toISOString()).order("starts_at");
  return data ?? fallbackRetreats;
}

export async function getRetreat(id: string): Promise<Retreat | null> {
  if (!isSupabaseConfigured) return fallbackRetreats.find((r) => r.id === id) ?? null;
  const supabase = await createClient();
  const { data } = await supabase.from("retreats").select("*").eq("id", id).maybeSingle();
  return data;
}

export const twd = (n: number) => `NT$${n.toLocaleString("en-US")}`;

export const taipeiDate = (iso: string) =>
  new Date(iso).toLocaleString("zh-TW", { timeZone: "Asia/Taipei", dateStyle: "medium", timeStyle: "short" });
