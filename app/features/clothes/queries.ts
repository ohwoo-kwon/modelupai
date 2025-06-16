import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export const getClothes = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.from("clothes").select("*");
  if (error) throw error;
  return data;
};

export const getClotheById = async (
  client: SupabaseClient<Database>,
  clothId: number,
) => {
  const { data, error } = await client
    .from("clothes")
    .select("*")
    .eq("cloth_id", clothId)
    .single();
  if (error) throw error;
  return data;
};

export const getMakeImageCount = async (
  client: SupabaseClient<Database>,
  {
    profileId,
    startDate,
    endDate,
  }: { profileId: string; startDate: string; endDate: string },
) => {
  const { data, error, count } = await client
    .from("profiles_clothes_rel")
    .select("*", { count: "exact" })
    .eq("profile_id", profileId)
    .gte("created_at", startDate)
    .lte("created_at", endDate);
  if (error) throw error;
  return count;
};
