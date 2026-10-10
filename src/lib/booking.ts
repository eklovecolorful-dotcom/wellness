// Retreat booking rules live in SQL (public.book_retreat) so capacity is
// enforced atomically. See features/retreat-booking.feature.

export type BookingStatus = "pending_payment" | "pending_clearance" | "confirmed" | "waitlist" | "cancelled";

export const CLEARANCE_MESSAGE = "請先取得醫師同意 Please get medical clearance first";

export const statusMessage: Record<BookingStatus, { zh: string; en: string }> = {
  pending_payment: { zh: "等待付款確認", en: "Awaiting payment confirmation" },
  pending_clearance: { zh: "請先取得醫師同意，我們收到後會再與你聯繫付款。", en: "Please get medical clearance first; we'll follow up for payment." },
  confirmed: { zh: "預約完成，期待在茶山見到你。", en: "You're booked — see you on the mountain." },
  waitlist: { zh: "名額已滿，已為你加入候補，不會收取任何費用。", en: "Full — you're on the waitlist and have not been charged." },
  cancelled: { zh: "已取消", en: "Cancelled" },
};

/** Stripe charges TWD in two-decimal units, and amounts must be whole dollars. */
export const twdToStripe = (twd: number) => twd * 100;
