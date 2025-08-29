CREATE TABLE "photos" (
	"photo_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"image_url" varchar(500) NOT NULL,
	"title" varchar(200),
	"description" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"views" integer DEFAULT 0,
	"fittings" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "photos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "photos" ADD CONSTRAINT "photos_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "select-photo-policy" ON "photos" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "insert-photos-policy" ON "photos" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "photos"."profile_id");--> statement-breakpoint
CREATE POLICY "edit-photo-policy" ON "photos" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "photos"."profile_id") WITH CHECK ((select auth.uid()) = "photos"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-photo-policy" ON "photos" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "photos"."profile_id");

CREATE TRIGGER set_photos_updated_at
BEFORE UPDATE ON public.photos
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();