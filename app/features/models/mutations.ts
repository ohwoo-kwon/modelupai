import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

import type {
  ageRangeEnum,
  bodyTypeEnum,
  genderEnum,
  raceEnum,
  styleEnum,
} from "./schema";

export const insertModel = async (
  client: SupabaseClient<Database>,
  {
    userId,
    name,
    description,
    gender,
    ageRange,
    bodyType,
    race,
    style,
    referenceModelId,
    imageUrl,
    isPublic,
    prompt,
  }: {
    userId: string;
    name: string;
    description: string;
    gender: (typeof genderEnum.enumValues)[number];
    ageRange: (typeof ageRangeEnum.enumValues)[number];
    bodyType: (typeof bodyTypeEnum.enumValues)[number];
    race: (typeof raceEnum.enumValues)[number];
    style: (typeof styleEnum.enumValues)[number];
    referenceModelId?: number;
    imageUrl: string;
    isPublic: boolean;
    prompt?: string;
  },
) => {
  const { data, error } = await client.from("models").insert({
    profile_id: userId,
    name,
    description,
    gender,
    age_range: ageRange,
    body_type: bodyType,
    race,
    style,
    reference_model_id: referenceModelId,
    image_url: imageUrl,
    is_public: isPublic,
    prompt,
  });
  if (error) throw error;
  return data;
};
