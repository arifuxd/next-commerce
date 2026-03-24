import { SiteHeader } from "@/components/ui/site-header";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-10 md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">About</p>
          <h1 className="mt-3 text-4xl font-black text-slate-900">Marketing-First Ecommerce Infrastructure</h1>
          <p className="mt-4 text-base text-slate-700">
            This system is built for direct response sales. Each product is presented as a dedicated landing funnel with
            focused messaging, urgency, social proof, and streamlined inline checkout.
          </p>
        </section>
      </main>
    </>
  );
}
