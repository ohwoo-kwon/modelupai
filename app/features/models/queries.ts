import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export const getModels = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.from("models").select("*");
  if (error) throw error;
  return data;
};

export const getModelById = async (
  client: SupabaseClient<Database>,
  modelId: number,
) => {
  const { data, error } = await client
    .from("models")
    .select("*")
    .eq("model_id", modelId)
    .single();
  if (error) throw error;
  return data;
};
