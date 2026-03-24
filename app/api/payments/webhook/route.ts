import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { parsePaymentWebhookPayload } from "@/lib/payments/webhook";

const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET;

function statusFromEvent(eventType: "payment.succeeded" | "payment.failed" | "payment.refunded") {
  if (eventType === "payment.succeeded") {
    return "paid";
  }
  if (eventType === "payment.refunded") {
    return "refunded";
  }
  return "failed";
}

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret is not configured." }, { status: 500 });
  }

  const providedSecret = request.headers.get("x-webhook-secret");
  if (!providedSecret || providedSecret !== webhookSecret) {
    return NextResponse.json({ error: "Unauthorized webhook request." }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const payload = parsePaymentWebhookPayload(json);
  if (!payload) {
    return NextResponse.json({ error: "Invalid payment webhook payload." }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: existingEvent, error: existingError } = await admin
    .from("payment_events")
    .select("id")
    .eq("provider_event_id", payload.event_id)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  if (existingEvent) {
    return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
  }

  const targetStatus = statusFromEvent(payload.event_type);

  const { data: order, error: orderError } = await admin
    .from("orders")
    .select("id, payment_status")
    .eq("id", payload.order_id)
    .maybeSingle();

  if (orderError || !order) {
    return NextResponse.json({ error: orderError?.message ?? "Order not found." }, { status: 404 });
  }

  const { error: insertEventError } = await admin.from("payment_events").insert({
    provider_event_id: payload.event_id,
    order_id: payload.order_id,
    event_type: payload.event_type,
    payment_method: payload.payment_method ?? null,
    transaction_id: payload.transaction_id ?? null,
    amount: payload.amount ?? null,
    currency: payload.currency ?? null,
    payload: payload.raw ?? null,
  });

  if (insertEventError) {
    return NextResponse.json({ error: insertEventError.message }, { status: 500 });
  }

  const nowIso = new Date().toISOString();
  const orderUpdates: Record<string, string | null> = {
    payment_status: targetStatus,
    payment_method: payload.payment_method ?? null,
    payment_reference: payload.transaction_id ?? null,
    notes: `Webhook ${payload.event_type} processed at ${nowIso}`,
  };

  if (targetStatus === "paid") {
    orderUpdates.paid_at = nowIso;
  }

  const { error: updateError } = await admin.from("orders").update(orderUpdates).eq("id", payload.order_id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      ok: true,
      order_id: payload.order_id,
      previous_status: order.payment_status,
      current_status: targetStatus,
      event_id: payload.event_id,
    },
    { status: 200 },
  );
}
