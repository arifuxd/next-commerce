export type PaymentWebhookPayload = {
  event_id: string;
  event_type: "payment.succeeded" | "payment.failed" | "payment.refunded";
  order_id: string;
  payment_method?: "bkash" | "sslcommerz";
  transaction_id?: string;
  amount?: number;
  currency?: string;
  raw?: Record<string, unknown>;
};

export function parsePaymentWebhookPayload(payload: unknown): PaymentWebhookPayload | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Record<string, unknown>;
  const eventId = String(candidate.event_id ?? "").trim();
  const eventType = String(candidate.event_type ?? "").trim();
  const orderId = String(candidate.order_id ?? "").trim();

  if (!eventId || !orderId) {
    return null;
  }

  if (![
    "payment.succeeded",
    "payment.failed",
    "payment.refunded",
  ].includes(eventType)) {
    return null;
  }

  const methodRaw = String(candidate.payment_method ?? "").trim();
  const paymentMethod = methodRaw === "bkash" || methodRaw === "sslcommerz" ? methodRaw : undefined;

  const amountNumber = Number(candidate.amount);

  return {
    event_id: eventId,
    event_type: eventType as PaymentWebhookPayload["event_type"],
    order_id: orderId,
    payment_method: paymentMethod,
    transaction_id: String(candidate.transaction_id ?? "").trim() || undefined,
    amount: Number.isNaN(amountNumber) ? undefined : amountNumber,
    currency: String(candidate.currency ?? "").trim() || undefined,
    raw: candidate,
  };
}
