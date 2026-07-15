import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin/auth";
import { AppNav } from "@/components/app-nav";

export async function AppNavShell() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AppNav showAdmin={isAdminUser(user)} />;
}
