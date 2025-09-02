import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export async function insertFitting(
  client: SupabaseClient<Database>,
  {
    profile_id,
    photo_id,
    user_photo_url,
    result_image_url,
    is_public,
  }: {
    profile_id: string;
    photo_id: string;
    user_photo_url: string;
    result_image_url: string;
    is_public: boolean;
  },
) {
  const { error } = await client.from("fittings").insert({
    profile_id,
    photo_id,
    user_photo_url,
    result_image_url,
    is_public,
  });

  if (error) throw error;
}
