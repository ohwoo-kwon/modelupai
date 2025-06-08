CREATE TYPE "public"."clothingCategoryEnum" AS ENUM('top', 'bottom', 'one-piece', 'outer', 'shoes', 'accessory');--> statement-breakpoint
CREATE TABLE "clothes" (
	"cloth_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "clothes_cloth_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"profile_id" uuid,
	"name" text NOT NULL,
	"category" "clothingCategoryEnum" NOT NULL,
	"shopping_url" text NOT NULL,
	"image_url" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clothes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "clothes" ADD CONSTRAINT "clothes_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "edit-cloth-policy" ON "clothes" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "clothes"."profile_id") WITH CHECK ((select auth.uid()) = "clothes"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-cloth-policy" ON "clothes" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "clothes"."profile_id");--> statement-breakpoint
CREATE POLICY "select-cloth-policy" ON "clothes" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "insert-cloth-policy" ON "clothes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "clothes"."profile_id");

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.models
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.clothes
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();