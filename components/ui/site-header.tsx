import { HeaderClient } from "@/components/ui/header-client";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <HeaderClient isLoggedIn={Boolean(user)} />;
}
