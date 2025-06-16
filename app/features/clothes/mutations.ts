import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

import type { clothingCategoryEnum } from "./schema";

export const insertCloth = async (
  client: SupabaseClient<Database>,
  {
    userId,
    name,
    category,
    shoppingUrl,
    imageUrl,
  }: {
    userId: string;
    name: string;
    category: (typeof clothingCategoryEnum.enumValues)[number];
    shoppingUrl: string;
    imageUrl: string;
  },
) => {
  const { data, error } = await client.from("clothes").insert({
    profile_id: userId,
    name,
    category,
    shopping_url: shoppingUrl,
    image_url: imageUrl,
  });
  if (error) throw error;
  return data;
};

export const insertMakeImage = async (
  client: SupabaseClient<Database>,
  {
    userId,
    clothId,
    imageUrl,
  }: {
    userId: string;
    clothId: number;
    imageUrl: string;
  },
) => {
  const { data, error } = await client.from("profiles_clothes_rel").insert({
    profile_id: userId,
    cloth_id: clothId,
    image_url: imageUrl,
  });
  if (error) throw error;
  return data;
};
