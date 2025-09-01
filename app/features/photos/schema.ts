import { sql } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgPolicy,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { authUid, authenticatedRole } from "drizzle-orm/supabase";

import { timestamps } from "~/core/db/timestamp";

import { profiles } from "../users/schema";

export const photos = pgTable(
  "photos",
  {
    photo_id: uuid().defaultRandom().primaryKey(),
    profile_id: uuid()
      .references(() => profiles.profile_id, { onDelete: "cascade" })
      .notNull(),
    image_url: varchar({ length: 500 }).notNull(),
    lookbook_url: varchar({ length: 500 }).notNull(),
    title: varchar({ length: 200 }).notNull(),
    description: text(),
    tags: jsonb("tags").$type<string[]>().default([]),
    views: integer().notNull().default(0),
    fittings: integer().notNull().default(0),
    ...timestamps,
  },
  (table) => [
    pgPolicy("select-photo-policy", {
      for: "select",
      to: "public",
      as: "permissive",
      using: sql`true`,
    }),
    pgPolicy("insert-photos-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("edit-photo-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("delete-photo-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
  ],
);
