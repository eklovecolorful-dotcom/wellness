"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createInvite() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("couple_invites").insert({}).select("token").single();
  if (error) redirect("/couple?error=invite");
  redirect(`/couple?invite=${data.token}`);
}

export async function acceptInvite(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("accept_couple_invite", { invite_token: String(formData.get("token")) });
  if (error) redirect("/couple?error=accept");
  revalidatePath("/couple");
  redirect("/couple");
}

export async function unlink() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  await supabase.from("couples").delete().or(`user_a.eq.${data.user.id},user_b.eq.${data.user.id}`);
  revalidatePath("/couple");
}
