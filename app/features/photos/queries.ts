import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export async function getPhotos(
  client: SupabaseClient<Database>,
  searchQuery: string,
) {
  const { data, error } = await client.rpc("search_photos", {
    search_term: searchQuery.trim() || "",
  });

  if (error) throw error;

  return data;
}

export async function getPhoto(
  client: SupabaseClient<Database>,
  photo_id: string,
) {
  const { data, error } = await client
    .from("photos")
    .select("*, profile:profile_id()")
    .eq("photo_id", photo_id)
    .single();
  if (error) throw error;

  return data;
}
