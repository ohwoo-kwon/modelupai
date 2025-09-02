CREATE TABLE "photo_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"photo_id" uuid NOT NULL,
	"user_id" uuid,
	"ip_address" varchar(45),
	"user_agent" text,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "photo_views" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "photo_views" ADD CONSTRAINT "photo_views_photo_id_photos_photo_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."photos"("photo_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photo_views" ADD CONSTRAINT "photo_views_user_id_profiles_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "photo_views_photo_idx" ON "photo_views" USING btree ("photo_id");--> statement-breakpoint
CREATE INDEX "photo_views_viewed_at_idx" ON "photo_views" USING btree ("viewed_at");--> statement-breakpoint
CREATE INDEX "photo_views_user_photo_date_idx" ON "photo_views" USING btree ("user_id","photo_id","viewed_at");--> statement-breakpoint
CREATE POLICY "select-own-photo-views-policy" ON "photo_views" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "photo_views"."user_id");--> statement-breakpoint
CREATE POLICY "select-photo-owner-views-policy" ON "photo_views" AS PERMISSIVE FOR SELECT TO "authenticated" USING (EXISTS (
        SELECT 1 FROM photos
        WHERE photos.photo_id = "photo_views"."photo_id"
        AND photos.profile_id = (select auth.uid())
      ));--> statement-breakpoint
CREATE POLICY "insert-authenticated-photo-views-policy" ON "photo_views" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "photo_views"."user_id");--> statement-breakpoint
CREATE POLICY "insert-anonymous-photo-views-policy" ON "photo_views" AS PERMISSIVE FOR INSERT TO "anon" WITH CHECK ("photo_views"."user_id" IS NULL);--> statement-breakpoint
CREATE POLICY "no-update-photo-views-policy" ON "photo_views" AS RESTRICTIVE FOR UPDATE TO public USING (false) WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "delete-own-photo-views-policy" ON "photo_views" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "photo_views"."user_id");--> statement-breakpoint
CREATE POLICY "delete-admin-photo-views-policy" ON "photo_views" AS PERMISSIVE FOR DELETE TO "authenticated" USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.profile_id = (select auth.uid())
        AND profiles.role = 'admin'
      ));