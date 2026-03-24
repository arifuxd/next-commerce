"use client";

import { useActionState } from "react";
import { createOrderAction, type CheckoutState } from "@/app/product/[slug]/actions";

interface InlineCheckoutFormProps {
  product: {
    id: string;
    slug: string;
    price: number;
  };
  initialCustomer?: {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
}

const initialCheckoutState: CheckoutState = {
  status: "idle",
  message: "",
};

function SubmitButton({ disabled }: { disabled: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {disabled ? "অর্ডার করা হচ্ছে..." : "অর্ডার করুন"}
    </button>
  );
}

export function InlineCheckoutForm({ product, initialCustomer }: InlineCheckoutFormProps) {
  const [state, formAction, isPending] = useActionState(createOrderAction, initialCheckoutState);

  return (
    <section id="checkout" className="rounded-3xl border border-slate-200 bg-white p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">গেস্ট চেকআউট</p>
          <h2 className="mt-2 text-2xl font-black text-slate-900">গেস্ট চেকআউট - আপনার ইমেইল দিন</h2>
          <p className="mt-2 text-sm text-slate-600">
            আরও দ্রুত করতে চান?{" "}
            <a href={`/login?next=/product/${product.slug}`} className="font-semibold underline">
              এখানে লগইন করুন
            </a>
            .
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">মোট</p>
          <p className="text-xl font-black text-slate-900">${Number(product.price).toFixed(2)}</p>
        </div>
      </div>

      <form action={formAction} className="grid gap-4 md:grid-cols-2">
        <input type="hidden" name="productId" value={product.id} />
        <input type="hidden" name="productSlug" value={product.slug} />

        <label className="text-sm font-medium text-slate-700">
          পূর্ণ নাম
          <input
            name="fullName"
            required
            defaultValue={initialCustomer?.fullName ?? ""}
            className="mt-1 w-full rounded-xl border px-3 py-2"
            placeholder="আপনার পূর্ণ নাম"
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          ইমেইল (আবশ্যক)
          <input
            name="email"
            type="email"
            required
            defaultValue={initialCustomer?.email ?? ""}
            className="mt-1 w-full rounded-xl border px-3 py-2"
            placeholder="you@example.com"
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          ফোন নম্বর
          <input
            name="phone"
            defaultValue={initialCustomer?.phone ?? ""}
            className="mt-1 w-full rounded-xl border px-3 py-2"
            placeholder="+8801XXXXXXXXX"
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          ঠিকানা (ঐচ্ছিক)
          <input
            name="address"
            defaultValue={initialCustomer?.address ?? ""}
            className="mt-1 w-full rounded-xl border px-3 py-2"
            placeholder="রোড, শহর, পোস্টকোড"
          />
        </label>

        <fieldset className="md:col-span-2">
          <legend className="text-sm font-medium text-slate-700">পেমেন্ট পদ্ধতি</legend>
          <div className="mt-2 flex flex-wrap gap-3">
            <label className="flex items-center gap-2 rounded-full border px-3 py-2 text-sm">
              <input type="radio" name="paymentMethod" value="cod" defaultChecked />
              ক্যাশ অন ডেলিভারি
            </label>
            <label className="flex items-center gap-2 rounded-full border px-3 py-2 text-sm">
              <input type="radio" name="paymentMethod" value="bkash" />
              bKash
            </label>
          </div>
        </fieldset>

        <div className="md:col-span-2">
          <SubmitButton disabled={isPending} />
        </div>
      </form>

      {state.accountMessage ? (
        <p className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
          {state.accountMessage}
        </p>
      ) : null}

      {state.message ? (
        <p
          className={`mt-3 rounded-xl border px-4 py-3 text-sm ${
            state.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </section>
  );
}
