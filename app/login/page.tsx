import { redirect } from "next/navigation";
import { AuthTabs } from "@/components/auth/auth-tabs";
import { SiteHeader } from "@/components/ui/site-header";
import { createClient } from "@/lib/supabase/server";

interface LoginPageProps {
  searchParams: Promise<{
    next?: string;
    error?: string;
    message?: string;
    tab?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next ?? "/dashboard";
  const isAdminLogin = nextPath.startsWith("/admin");
  const allowSignUp = !isAdminLogin;
  const defaultTab = params.tab === "signup" && allowSignUp ? "signup" : "login";

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
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-10">
        <AuthTabs
          allowSignUp={allowSignUp}
          defaultTab={defaultTab}
          nextPath={nextPath}
          error={params.error}
          message={params.message}
        />
      </main>
    </>
  );
}
