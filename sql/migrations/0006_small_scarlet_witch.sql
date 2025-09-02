CREATE TABLE "fittings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"photo_id" uuid NOT NULL,
	"user_photo_url" text NOT NULL,
	"result_image_url" text,
	"is_public" boolean DEFAULT true NOT NULL,
	"rating" integer,
	"feedback" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "fittings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "photo_views" RENAME COLUMN "user_id" TO "profile_id";--> statement-breakpoint
ALTER TABLE "photo_views" DROP CONSTRAINT "photo_views_user_id_profiles_profile_id_fk";
--> statement-breakpoint
DROP INDEX "photo_views_user_photo_date_idx";--> statement-breakpoint
ALTER TABLE "fittings" ADD CONSTRAINT "fittings_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fittings" ADD CONSTRAINT "fittings_photo_id_photos_photo_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."photos"("photo_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photo_views" ADD CONSTRAINT "photo_views_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "photo_views_user_photo_date_idx" ON "photo_views" USING btree ("profile_id","photo_id","viewed_at");--> statement-breakpoint
CREATE POLICY "select-fittings-policy" ON "fittings" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "insert-fittings-policy" ON "fittings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "fittings"."profile_id");--> statement-breakpoint
CREATE POLICY "edit-fittings-policy" ON "fittings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "fittings"."profile_id") WITH CHECK ((select auth.uid()) = "fittings"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-fittings-policy" ON "fittings" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "fittings"."profile_id");--> statement-breakpoint
ALTER POLICY "select-own-photo-views-policy" ON "photo_views" TO authenticated USING ((select auth.uid()) = "photo_views"."profile_id");--> statement-breakpoint
ALTER POLICY "insert-authenticated-photo-views-policy" ON "photo_views" TO authenticated WITH CHECK ((select auth.uid()) = "photo_views"."profile_id");--> statement-breakpoint
ALTER POLICY "insert-anonymous-photo-views-policy" ON "photo_views" TO anon WITH CHECK ("photo_views"."profile_id" IS NULL);--> statement-breakpoint
ALTER POLICY "delete-own-photo-views-policy" ON "photo_views" TO authenticated USING ((select auth.uid()) = "photo_views"."profile_id");