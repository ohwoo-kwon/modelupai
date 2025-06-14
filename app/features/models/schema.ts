import { sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  bigint,
  boolean,
  pgEnum,
  pgPolicy,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { authUid, authenticatedRole } from "drizzle-orm/supabase";

import { timestamps } from "~/core/db/timestamp";

import { profiles } from "../users/schema";

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);
export const ageRangeEnum = pgEnum("age_range", [
  "1-5",
  "6-10",
  "11-15",
  "16-20",
  "21-25",
  "26-30",
  "31-35",
  "36-40",
  "41-45",
  "46-50",
  "51-55",
  "56-60",
  "61-",
]);
export const bodyTypeEnum = pgEnum("body_type", [
  "slim",
  "average",
  "athletic",
  "curvy",
  "plus",
  "muscular",
  "petite",
  "tall",
]);
export const raceEnum = pgEnum("race", [
  "asian",
  "black",
  "white",
  "latino",
  "middle-eastern",
  "indian",
  "other",
]);
export const styleEnum = pgEnum("style", [
  "cute",
  "sexy",
  "casual",
  "formal",
  "street",
  "sporty",
  "elegant",
  "vintage",
  "punk",
  "minimal",
  "modern",
  "goth",
]);

export const models = pgTable(
  "models",
  {
    model_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    profile_id: uuid().references(() => profiles.profile_id),
    name: text().notNull(),
    description: text(),
    gender: genderEnum().default("female").notNull(),
    age_range: ageRangeEnum().default("21-25").notNull(),
    body_type: bodyTypeEnum().default("average").notNull(),
    race: raceEnum().default("asian").notNull(),
    style: styleEnum().default("casual").notNull(),
    reference_model_id: bigint({ mode: "number" }).references(
      (): AnyPgColumn => models.model_id,
    ),
    image_url: text().notNull(),
    is_public: boolean().default(true).notNull(),
    prompt: text(),
    ...timestamps,
  },
  (table) => [
    pgPolicy("edit-model-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("delete-model-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("select-model-policy", {
      for: "select",
      to: "public",
      as: "permissive",
      using: sql`true`,
    }),
    pgPolicy("insert-model-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
  ],
);
