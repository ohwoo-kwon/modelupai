CREATE TABLE "gem_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"type" varchar(20) NOT NULL,
	"amount" integer NOT NULL,
	"balance_before" integer NOT NULL,
	"balance_after" integer NOT NULL,
	"related_fitting_id" uuid,
	"related_photo_id" uuid,
	"related_payment_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gem_transactions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'KRW',
	"gems_purchased" integer NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"payment_provider" varchar(50),
	"provider_transaction_id" varchar(255),
	"status" varchar(20) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "gem_blance" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "total_gems_earned" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "total_gems_spent" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "gem_transactions" ADD CONSTRAINT "gem_transactions_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gem_transactions" ADD CONSTRAINT "gem_transactions_related_fitting_id_fittings_fitting_id_fk" FOREIGN KEY ("related_fitting_id") REFERENCES "public"."fittings"("fitting_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gem_transactions" ADD CONSTRAINT "gem_transactions_related_photo_id_photos_photo_id_fk" FOREIGN KEY ("related_photo_id") REFERENCES "public"."photos"("photo_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gem_transactions" ADD CONSTRAINT "gem_transactions_related_payment_id_payments_id_fk" FOREIGN KEY ("related_payment_id") REFERENCES "public"."payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "gem-transactions-select-own" ON "gem_transactions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "gem_transactions"."profile_id");--> statement-breakpoint
CREATE POLICY "gem-transactions-delete-none" ON "gem_transactions" AS PERMISSIVE FOR DELETE TO "authenticated" USING (false);--> statement-breakpoint
CREATE POLICY "payments-select-own" ON "payments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "payments"."profile_id");--> statement-breakpoint
CREATE POLICY "payments-insert-own" ON "payments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "payments"."profile_id");