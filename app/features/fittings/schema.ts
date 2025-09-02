import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgPolicy,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { authUid, authenticatedRole } from "drizzle-orm/supabase";

import { timestamps } from "~/core/db/timestamp";

import { photos } from "../photos/schema";
import { profiles } from "../users/schema";

export const fittings = pgTable(
  "fittings",
  {
    fitting_id: uuid().primaryKey().defaultRandom().notNull(),
    profile_id: uuid()
      .references(() => profiles.profile_id)
      .notNull(),
    photo_id: uuid()
      .references(() => photos.photo_id)
      .notNull(),
    user_photo_url: text().notNull(),
    result_image_url: text(),
    is_public: boolean().default(true).notNull(),
    rating: integer(),
    feedback: text(),
    ...timestamps,
  },
  (table) => [
    pgPolicy("select-fittings-policy", {
      for: "select",
      to: "public",
      as: "permissive",
      using: sql`true`,
    }),
    pgPolicy("insert-fittings-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("edit-fittings-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("delete-fittings-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
  ],
);
