interface TestimonialsSectionProps {
  testimonials: Array<{ name: string; role: string; quote: string }>;
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white px-6 py-10 md:px-10">
      <p className="text-xs font-semibold uppercase text-amber-700">à¦—à§à¦°à¦¾à¦¹à¦• à¦®à¦¤à¦¾à¦®à¦¤</p>
      <h2 className="mt-3 text-3xl font-black text-slate-900">à¦—à§à¦°à¦¾à¦¹à¦•à§‡à¦°à¦¾ à¦•à§€ à¦¬à¦²à¦›à§‡à¦¨</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {testimonials.map((item) => (
          <article key={item.name} className="rounded-xl border border-slate-100 bg-slate-50 p-5">
            <p className="text-sm text-slate-700">&ldquo;{item.quote}&rdquo;</p>
            <p className="mt-4 text-sm font-bold text-slate-900">{item.name}</p>
            <p className="text-xs text-slate-500">{item.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

