import { sql } from "drizzle-orm";
import {
  decimal,
  integer,
  pgPolicy,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { authUid, authenticatedRole } from "drizzle-orm/supabase";

import { fittings } from "../fittings/schema";
import { photos } from "../photos/schema";
import { profiles } from "../users/schema";

export const payments = pgTable(
  "payments",
  {
    id: uuid().primaryKey().defaultRandom(),
    profile_id: uuid()
      .references(() => profiles.profile_id)
      .notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("KRW"),
    gems_purchased: integer().notNull(),
    payment_method: varchar({ length: 50 }).notNull(), // card, bank_transfer, etc.
    payment_provider: varchar({ length: 50 }), // stripe, toss, etc.
    provider_transaction_id: varchar({ length: 255 }),
    status: varchar("status", { length: 20 }).default("pending"), // pending, completed, failed, refunded
    createdAt: timestamp("created_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"),
  },
  (table) => [
    // 사용자는 자신의 결제 정보만 조회 가능
    pgPolicy("payments-select-own", {
      for: "select",
      to: authenticatedRole,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // 사용자는 자신의 결제 정보만 생성 가능
    pgPolicy("payments-insert-own", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
  ],
);

export const gemTransactions = pgTable(
  "gem_transactions",
  {
    id: uuid().primaryKey().defaultRandom(),
    profile_id: uuid()
      .references(() => profiles.profile_id)
      .notNull(),
    type: varchar({ length: 20 }).notNull(), // purchase(구매), earn(수익), spend(사용), bonus(보너스), refund(환불)
    amount: integer().notNull(), // 젬 수량 (양수: 획득, 음수: 사용)
    balance_before: integer().notNull(),
    balance_after: integer().notNull(),
    related_fitting_id: uuid().references(() => fittings.fitting_id),
    related_photo_id: uuid().references(() => photos.photo_id),
    related_payment_id: uuid().references(() => payments.id),
    created_at: timestamp().defaultNow().notNull(),
  },
  (table) => [
    pgPolicy("gem-transactions-select-own", {
      for: "select",
      to: authenticatedRole,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("gem-transactions-delete-none", {
      for: "delete",
      to: authenticatedRole,
      using: sql`false`,
    }),
  ],
);
