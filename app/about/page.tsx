import { SiteHeader } from "@/components/ui/site-header";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-10 md:px-10">
          <p className="text-xs font-semibold uppercase text-cyan-700">About Us</p>
          <h1 className="mt-3 text-4xl font-black text-slate-900">Marketing-first ecommerce platform</h1>
          <p className="mt-4 text-base text-slate-700">
            This platform is built for conversion-focused selling. Every product gets a dedicated landing page
            with social proof, urgency, clear messaging, and inline checkout to reduce friction and improve
            purchase completion.
          </p>
        </section>
      </main>
    </>
  );
}
