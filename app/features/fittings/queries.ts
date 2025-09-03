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

export async function getFittingById(
  client: SupabaseClient<Database>,
  fittingId: string,
) {
  const { data, error } = await client
    .from("fittings")
    .select("*, photo:photo_id(*)")
    .eq("fitting_id", fittingId)
    .single();

  if (error) throw error;

  return data;
}

export async function getFittingByPhotoId(
  client: SupabaseClient<Database>,
  photoId: string,
) {
  const { data, error } = await client
    .from("fittings")
    .select("*")
    .eq("photo_id", photoId)
    .eq("is_public", true)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data;
}
