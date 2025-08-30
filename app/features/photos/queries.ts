import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export async function getPhotos(
  client: SupabaseClient<Database>,
  searchQuery: string,
) {
  const { data, error } = await client.rpc("search_photos", {
    search_term: searchQuery.trim() || "",
  });

  if (error) {
    throw error;
  }

  return data;
}
