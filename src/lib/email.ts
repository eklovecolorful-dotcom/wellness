import "server-only";
import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM ?? "Wellness <hello@example.com>";

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set; skipped:", subject);
    return;
  }
  await new Resend(process.env.RESEND_API_KEY).emails.send({ from: FROM, to, subject, html });
}
