"use client";

import { useActionState } from "react";
import { requestProductDownloadAction, type DownloadState } from "@/app/dashboard/actions";

interface DownloadAccessFormProps {
  productId: string;
  title: string;
}

const initialDownloadState: DownloadState = {
  status: "idle",
  message: "",
};

export function DownloadAccessForm({ productId, title }: DownloadAccessFormProps) {
  const [state, formAction, isPending] = useActionState(
    requestProductDownloadAction,
    initialDownloadState,
  );

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>

      <form action={formAction} className="mt-3">
        <input type="hidden" name="productId" value={productId} />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-gradient-to-r from-[#ff7a18] to-[#ffb347] px-4 py-2 text-xs font-black text-slate-950 disabled:opacity-60"
        >
          {isPending ? "Generating Link..." : "Get Download Link"}
        </button>
      </form>

      {state.message ? (
        <p
          className={`mt-3 text-xs ${
            state.status === "success" ? "text-emerald-300" : "text-rose-300"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      {state.url ? (
        <a
          href={state.url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-xs font-semibold text-orange-200 underline"
        >
          Download now
        </a>
      ) : null}
    </div>
  );
}
