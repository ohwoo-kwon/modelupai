import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

const PAGE_SIZE = 20;

export const getClothes = async (
  client: SupabaseClient<Database>,
  { page }: { page: number },
) => {
  const { data, error } = await client
    .from("clothes")
    .select("*")
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
    .order("created_at", { ascending: false });
  if (error) throw Error(error.message);
  return data;
};

export const getClothesPage = async (client: SupabaseClient<Database>) => {
  const { count, error: countError } = await client
    .from("clothes")
    .select("cloth_id", { count: "exact", head: true });
  if (countError) throw Error(countError.message);
  if (!count) return 1;
  return Math.ceil(count / PAGE_SIZE);
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
