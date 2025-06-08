import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export const getClothes = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.from("clothes").select("*");
  if (error) throw error;
  return data;
};
