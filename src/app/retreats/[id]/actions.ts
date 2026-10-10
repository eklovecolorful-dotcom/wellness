"use server";

import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { twdToStripe } from "@/lib/booking";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function bookRetreat(formData: FormData) {
  const retreatId = String(formData.get("retreatId"));
  const screening = formData.get("needsClearance");
  if (screening !== "yes" && screening !== "no") redirect(`/retreats/${retreatId}?error=screening`);

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect(`/login?next=/retreats/${retreatId}`);

  const { data, error } = await supabase
    .rpc("book_retreat", { rid: retreatId, needs_clearance: screening === "yes" })
    .single<{ booking_id: string; booking_status: string }>();
  if (error || !data) redirect(`/retreats/${retreatId}?error=booking`);

  // Waitlist and clearance-pending bookings are never charged.
  if (data.booking_status !== "pending_payment") {
    redirect(`/retreats/${retreatId}?status=${data.booking_status}`);
  }

  const { data: retreat } = await supabase.from("retreats").select("*").eq("id", retreatId).single();
  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    customer_email: auth.user.email,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // matches the 30-min hold in seats_taken()
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "twd",
        unit_amount: twdToStripe(retreat!.deposit_twd),
        product_data: { name: `訂金 Deposit · ${retreat!.title_zh}` },
      },
    }],
    metadata: { kind: "retreat", booking_id: data.booking_id, user_id: auth.user.id },
    success_url: `${env.siteUrl}/retreats/${retreatId}?status=confirmed`,
    cancel_url: `${env.siteUrl}/retreats/${retreatId}?status=cancelled`,
  });

  await createAdminClient().from("bookings").update({ stripe_session_id: session.id }).eq("id", data.booking_id);
  redirect(session.url!);
}
