import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export async function createPhoto(
  client: SupabaseClient<Database>,
  {
    profile_id,
    image_url,
    lookbook_url,
    title,
    description,
    tags,
  }: {
    profile_id: string;
    image_url: string;
    lookbook_url: string;
    title: string;
    description: string | null;
    tags: string[];
  },
) {
  const { error } = await client.from("photos").insert({
    profile_id,
    image_url,
    lookbook_url,
    title,
    description,
    tags,
  });
  if (error) throw error;
}

export async function insertView(
  client: SupabaseClient<Database>,
  {
    profile_id,
    image_url,
    lookbook_url,
    title,
    description,
    tags,
  }: {
    profile_id: string;
    image_url: string;
    lookbook_url: string;
    title: string;
    description: string | null;
    tags: string[];
  },
) {}
