import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/ui/site-header";
import { createClient } from "@/lib/supabase/server";
import { signInAction, signUpAction } from "./actions";

interface LoginPageProps {
  searchParams: Promise<{
    next?: string;
    error?: string;
    message?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next ?? "/dashboard";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(nextPath);
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold">Login</h1>
            <p className="mt-2 text-sm text-slate-600">Sign in to access your dashboard and purchases.</p>

            <form action={signInAction} className="mt-6 space-y-4">
              <input type="hidden" name="next" value={nextPath} />
              <div>
                <label htmlFor="signin-email" className="mb-1 block text-sm font-medium">
                  Email
                </label>
                <input
                  id="signin-email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-lg border px-3 py-2"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="signin-password" className="mb-1 block text-sm font-medium">
                  Password
                </label>
                <input
                  id="signin-password"
                  name="password"
                  type="password"
                  required
                  className="w-full rounded-lg border px-3 py-2"
                  placeholder="********"
                />
              </div>
              <button type="submit" className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white">
                Sign In
              </button>
            </form>
          </section>

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Create account</h2>
            <p className="mt-2 text-sm text-slate-600">Create an account for faster checkout and order tracking.</p>

            <form action={signUpAction} className="mt-6 space-y-4">
              <input type="hidden" name="next" value={nextPath} />
              <div>
                <label htmlFor="signup-name" className="mb-1 block text-sm font-medium">
                  Full name
                </label>
                <input
                  id="signup-name"
                  name="fullName"
                  type="text"
                  className="w-full rounded-lg border px-3 py-2"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="signup-email" className="mb-1 block text-sm font-medium">
                  Email
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-lg border px-3 py-2"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="signup-password" className="mb-1 block text-sm font-medium">
                  Password
                </label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="w-full rounded-lg border px-3 py-2"
                  placeholder="At least 6 characters"
                />
              </div>
              <button type="submit" className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-white">
                Create Account
              </button>
            </form>
          </section>
        </div>

        {params.error ? <p className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{params.error}</p> : null}
        {params.message ? <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{params.message}</p> : null}

        <p className="mt-8 text-sm text-slate-600">
          Don&apos;t want to login now? You can still place orders in guest checkout on product pages.
          <Link href="/" className="ml-1 font-medium underline">
            Browse products
          </Link>
        </p>
      </main>
    </>
  );
}
