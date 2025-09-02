import { sql } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgPolicy,
  pgTable,
  text,
  timestamp,
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

export const photoViews = pgTable(
  "photo_views",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    photo_id: uuid()
      .references(() => photos.photo_id)
      .notNull(),
    user_id: uuid().references(() => profiles.profile_id), // null이면 비회원
    ip_address: varchar("ip_address", { length: 45 }), // IPv6 지원
    userAgent: text("user_agent"),
    viewed_at: timestamp("viewed_at").defaultNow().notNull(),
  },
  (table) => [
    index("photo_views_photo_idx").on(table.photo_id),
    index("photo_views_viewed_at_idx").on(table.viewed_at),
    // 같은 사용자가 24시간 내 중복 조회 방지를 위한 복합 인덱스
    index("photo_views_user_photo_date_idx").on(
      table.user_id,
      table.photo_id,
      table.viewed_at,
    ),
    pgPolicy("select-own-photo-views-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.user_id}`,
    }),
    pgPolicy("select-photo-owner-views-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`EXISTS (
        SELECT 1 FROM photos
        WHERE photos.photo_id = ${table.photo_id}
        AND photos.profile_id = ${authUid}
      )`,
    }),
    pgPolicy("insert-authenticated-photo-views-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.user_id}`,
    }),
    pgPolicy("insert-anonymous-photo-views-policy", {
      for: "insert",
      to: "anon",
      as: "permissive",
      withCheck: sql`${table.user_id} IS NULL`,
    }),
    pgPolicy("no-update-photo-views-policy", {
      for: "update",
      to: "public",
      as: "restrictive",
      using: sql`false`,
      withCheck: sql`false`,
    }),
    pgPolicy("delete-own-photo-views-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.user_id}`,
    }),
  ],
);
