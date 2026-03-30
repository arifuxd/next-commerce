interface ProductFormValues {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  price?: number;
  stock_quantity?: number;
  is_active?: boolean;
  image_url?: string | null;
  file_url?: string | null;
}

interface ProductFormProps {
  title: string;
  submitLabel: string;
  action: (formData: FormData) => void | Promise<void>;
  values?: ProductFormValues;
}

export function ProductForm({ title, submitLabel, action, values }: ProductFormProps) {
  return (
    <section className="p-1">
      <h3 className="text-lg font-bold text-white">{title}</h3>

      <form action={action} className="mt-4 grid gap-4 md:grid-cols-2">
        {values?.id ? <input type="hidden" name="productId" value={values.id} /> : null}

        <label className="text-sm font-medium text-slate-200">
          Title
          <input
            name="title"
            required
            defaultValue={values?.title ?? ""}
            className="mt-1 w-full rounded-xl border border-white/15 bg-slate-950/60 px-3 py-2 text-slate-100"
            placeholder="Product name"
          />
        </label>

        <label className="text-sm font-medium text-slate-200">
          Slug
          <input
            name="slug"
            defaultValue={values?.slug ?? ""}
            className="mt-1 w-full rounded-xl border border-white/15 bg-slate-950/60 px-3 py-2 text-slate-100"
            placeholder="Leave blank to auto-generate"
          />
        </label>

        <label className="text-sm font-medium text-slate-200 md:col-span-2">
          Description
          <textarea
            name="description"
            required
            defaultValue={values?.description ?? ""}
            rows={4}
            className="mt-1 w-full rounded-xl border border-white/15 bg-slate-950/60 px-3 py-2 text-slate-100"
            placeholder="Write a sales-focused description"
          />
        </label>

        <label className="text-sm font-medium text-slate-200">
          Price
          <input
            name="price"
            required
            type="number"
            min="0"
            step="0.01"
            defaultValue={values?.price ?? 0}
            className="mt-1 w-full rounded-xl border border-white/15 bg-slate-950/60 px-3 py-2 text-slate-100"
          />
        </label>

        <label className="text-sm font-medium text-slate-200">
          Stock quantity
          <input
            name="stockQuantity"
            type="number"
            min="0"
            step="1"
            defaultValue={values?.stock_quantity ?? 0}
            className="mt-1 w-full rounded-xl border border-white/15 bg-slate-950/60 px-3 py-2 text-slate-100"
          />
        </label>

        <label className="text-sm font-medium text-slate-200">
          Product image (optional)
          <input name="imageFile" type="file" accept="image/*" className="mt-1 block w-full text-sm text-slate-300" />
        </label>

        <label className="text-sm font-medium text-slate-200">
          Downloadable file (optional)
          <input name="downloadFile" type="file" className="mt-1 block w-full text-sm text-slate-300" />
        </label>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-200 md:col-span-2">
          <input type="checkbox" name="isActive" defaultChecked={values?.is_active ?? true} />
          Active (visible in the public store)
        </label>

        <div className="md:col-span-2">
          <button type="submit" className="rounded-full bg-gradient-to-r from-[#ff7a18] to-[#ffb347] px-5 py-2 text-sm font-black text-slate-950">
            {submitLabel}
          </button>
        </div>
      </form>

      {values?.image_url ? (
        <p className="mt-2 text-xs text-slate-400">Current image path: {values.image_url}</p>
      ) : null}
      {values?.file_url ? (
        <p className="mt-1 text-xs text-slate-400">Current file path: {values.file_url}</p>
      ) : null}
    </section>
  );
}
