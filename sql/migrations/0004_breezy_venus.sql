CREATE TABLE "profiles_clothes_rel" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "profiles_clothes_rel_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"profile_id" uuid,
	"cloth_id" bigint,
	"image_url" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles_clothes_rel" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles_clothes_rel" ADD CONSTRAINT "profiles_clothes_rel_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles_clothes_rel" ADD CONSTRAINT "profiles_clothes_rel_cloth_id_clothes_cloth_id_fk" FOREIGN KEY ("cloth_id") REFERENCES "public"."clothes"("cloth_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "edit-profile-cloth-policy" ON "profiles_clothes_rel" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "profiles_clothes_rel"."profile_id") WITH CHECK ((select auth.uid()) = "profiles_clothes_rel"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-profile-cloth-policy" ON "profiles_clothes_rel" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "profiles_clothes_rel"."profile_id");--> statement-breakpoint
CREATE POLICY "select-profile-cloth-policy" ON "profiles_clothes_rel" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "insert-profile-cloth-policy" ON "profiles_clothes_rel" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "profiles_clothes_rel"."profile_id");