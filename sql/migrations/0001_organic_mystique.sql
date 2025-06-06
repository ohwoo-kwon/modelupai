CREATE TYPE "public"."age_range" AS ENUM('1-5', '6-10', '11-15', '16-20', '21-25', '26-30', '31-35', '36-40', '41-45', '46-50', '51-55', '56-60', '61-');--> statement-breakpoint
CREATE TYPE "public"."body_type" AS ENUM('slim', 'average', 'athletic', 'curvy', 'plus', 'muscular', 'petite', 'tall');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."race" AS ENUM('asian', 'black', 'white', 'latino', 'middle-eastern', 'indian', 'other');--> statement-breakpoint
CREATE TYPE "public"."style" AS ENUM('cute', 'sexy', 'casual', 'formal', 'street', 'sporty', 'elegant', 'vintage', 'punk', 'minimal', 'modern', 'goth');--> statement-breakpoint
CREATE TABLE "models" (
	"model_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "models_model_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"profile_id" uuid,
	"name" text NOT NULL,
	"description" text,
	"gender" "gender" DEFAULT 'female' NOT NULL,
	"age_range" "age_range" DEFAULT '21-25' NOT NULL,
	"body_type" "body_type" DEFAULT 'average' NOT NULL,
	"race" "race" DEFAULT 'asian' NOT NULL,
	"style" "style" DEFAULT 'casual' NOT NULL,
	"reference_model_id" bigint,
	"image_url" text NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "models" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "models" ADD CONSTRAINT "models_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "models" ADD CONSTRAINT "models_reference_model_id_models_model_id_fk" FOREIGN KEY ("reference_model_id") REFERENCES "public"."models"("model_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "edit-model-policy" ON "models" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "models"."profile_id") WITH CHECK ((select auth.uid()) = "models"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-model-policy" ON "models" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "models"."profile_id");--> statement-breakpoint
CREATE POLICY "select-model-policy" ON "models" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "insert-model-policy" ON "models" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "models"."profile_id");