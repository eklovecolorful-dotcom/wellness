"use server";

import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { twdToStripe } from "@/lib/booking";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function buyProgram(formData: FormData) {
  const programId = String(formData.get("programId"));
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect(`/login?next=/programs`);

  const { data: program } = await supabase.from("programs").select("*").eq("id", programId).single();
  if (!program || program.tier !== "paid" || !program.price_twd) redirect("/programs");

  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    customer_email: auth.user.email,
    line_items: [
      program.stripe_price_id
        ? { price: program.stripe_price_id, quantity: 1 }
        : {
            quantity: 1,
            price_data: {
              currency: "twd",
              unit_amount: twdToStripe(program.price_twd),
              product_data: { name: `${program.title_zh} ${program.title_en}` },
            },
          },
    ],
    metadata: { kind: "program", program_id: program.id, user_id: auth.user.id },
    success_url: `${env.siteUrl}/programs?purchased=${program.id}`,
    cancel_url: `${env.siteUrl}/programs`,
  });
  redirect(session.url!);
}
