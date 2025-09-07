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
  const { data, error } = await client
    .from("fittings")
    .insert({
      profile_id,
      photo_id,
      user_photo_url,
      result_image_url,
      is_public,
    })
    .select("*")
    .single();

  if (error) throw error;
  if (!data) throw new Error("데이터를 찾아 오는데 실패했습니다.");
  return data;
}
