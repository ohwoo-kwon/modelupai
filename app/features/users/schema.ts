import { sql } from "drizzle-orm";
import {
  boolean,
  decimal,
  pgPolicy,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { authUid, authUsers, authenticatedRole } from "drizzle-orm/supabase";

import { timestamps } from "~/core/db/timestamp";

export const profiles = pgTable(
  "profiles",
  {
    profile_id: uuid()
      .primaryKey()
      .references(() => authUsers.id, {
        onDelete: "cascade",
      }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar({ length: 50 }).notNull().unique(),
    avatar_url: text(),
    is_active: boolean().default(true),
    total_earnings: decimal({ precision: 10, scale: 2 }).default("0.00"),
    total_spent: decimal({ precision: 10, scale: 2 }).default("0.00"),
    ...timestamps,
  },
  (table) => [
    pgPolicy("edit-profile-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("delete-profile-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("select-profile-policy", {
      for: "select",
      to: "public",
      as: "permissive",
      using: sql`true`,
    }),
  ],
);
