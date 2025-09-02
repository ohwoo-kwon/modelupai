import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export async function getFittingsByProfileId(
  client: SupabaseClient<Database>,
  profileId: string,
) {
  const { data, error } = await client
    .from("fittings")
    .select("*")
    .eq("profile_id", profileId);

  if (error) throw error;

  return data;
}
