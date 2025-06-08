import { sql } from "drizzle-orm";
import {
  bigint,
  pgEnum,
  pgPolicy,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { authUid, authenticatedRole } from "drizzle-orm/supabase";

import { timestamps } from "~/core/db/timestamp";

import { profiles } from "../users/schema";

export const clothingCategoryEnum = pgEnum("clothingCategoryEnum", [
  "top",
  "bottom",
  "one-piece",
  "outer",
  "shoes",
  "accessory",
]);

export const clothes = pgTable(
  "clothes",
  {
    cloth_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    profile_id: uuid().references(() => profiles.profile_id),
    name: text().notNull(),
    category: clothingCategoryEnum().notNull(),
    shopping_url: text().notNull(),
    image_url: text().notNull(),
    ...timestamps,
  },
  (table) => [
    pgPolicy("edit-cloth-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("delete-cloth-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("select-cloth-policy", {
      for: "select",
      to: "public",
      as: "permissive",
      using: sql`true`,
    }),
    pgPolicy("insert-cloth-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
  ],
);
