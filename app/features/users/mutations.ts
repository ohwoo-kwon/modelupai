import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export async function updateDia(
  client: SupabaseClient<Database>,
  {
    profile_id,
    total_spent,
    gem_balance,
  }: { profile_id: string; total_spent: number; gem_balance: number },
) {
  const { error } = await client
    .from("profiles")
    .update({
      total_spent,
      gem_balance,
    })
    .eq("profile_id", profile_id);
  if (error) throw error;
}

export async function useDia(
  client: SupabaseClient<Database>,
  { profile_id, gem_balance }: { profile_id: string; gem_balance: number },
) {
  const { error } = await client
    .from("profiles")
    .update({
      gem_balance,
    })
    .eq("profile_id", profile_id);
  if (error) throw error;
}
