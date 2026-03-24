interface OrderStatusFormProps {
  orderId: string;
  currentStatus: "pending" | "paid" | "failed" | "refunded";
  action: (formData: FormData) => void | Promise<void>;
}

const statuses = ["pending", "paid", "failed", "refunded"] as const;

function statusLabel(status: (typeof statuses)[number]) {
  if (status === "pending") return "অপেক্ষমাণ";
  if (status === "paid") return "পরিশোধিত";
  if (status === "failed") return "ব্যর্থ";
  return "ফেরত";
}

export function OrderStatusForm({ orderId, currentStatus, action }: OrderStatusFormProps) {
  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="orderId" value={orderId} />
      <select
        name="paymentStatus"
        defaultValue={currentStatus}
        className="rounded-full border border-white/20 bg-slate-900 px-3 py-1 text-xs text-slate-100"
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {statusLabel(status)}
          </option>
        ))}
      </select>
      <button type="submit" className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-slate-100">
        আপডেট
      </button>
    </form>
  );
}
