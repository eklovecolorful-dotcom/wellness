import type Stripe from "stripe";
import { requireEnv } from "@/lib/env";
import { sendEmail } from "@/lib/email";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await request.text(), signature, requireEnv("STRIPE_WEBHOOK_SECRET"));
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  const db = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const meta = session.metadata ?? {};
    if (meta.kind === "retreat") {
      await db.from("bookings").update({ status: "confirmed" }).eq("id", meta.booking_id).eq("status", "pending_payment");
      if (session.customer_details?.email) {
        await sendEmail(
          session.customer_details.email,
          "靜修預約完成 Your retreat is booked",
          "<p>感謝預約！活動前一週我們會寄送行前說明。</p><p>Thank you — we'll send details a week before.</p>",
        );
      }
    } else if (meta.kind === "program") {
      await db.from("entitlements").upsert({ user_id: meta.user_id, program_id: meta.program_id });
    }
  }

  if (event.type === "checkout.session.expired") {
    const meta = event.data.object.metadata ?? {};
    if (meta.kind === "retreat") {
      await db.from("bookings").update({ status: "cancelled" }).eq("id", meta.booking_id).eq("status", "pending_payment");
    }
  }

  return Response.json({ received: true });
}
