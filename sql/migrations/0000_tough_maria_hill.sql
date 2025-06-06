CREATE TABLE "profiles" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"avatar_url" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "edit-profile-policy" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "profiles"."profile_id") WITH CHECK ((select auth.uid()) = "profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-profile-policy" ON "profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "select-profile-policy" ON "profiles" AS PERMISSIVE FOR SELECT TO public USING (true);

CREATE OR REPLACE FUNCTION handle_sign_up()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET SEARCH_PATH = ''
AS $$
BEGIN
    IF new.raw_app_meta_data IS NOT NULL AND new.raw_app_meta_data ? 'provider' THEN
        IF new.raw_app_meta_data ->> 'provider' = 'email' OR new.raw_app_meta_data ->> 'provider' = 'phone' THEN
            IF new.raw_user_meta_data ? 'name' THEN
                INSERT INTO public.profiles (profile_id, name)
                VALUES (new.id, new.raw_user_meta_data ->> 'name');
            ELSE
                INSERT INTO public.profiles (profile_id, name)
                VALUES (new.id, '익명의 사용자');
            END IF;
        ELSE
            INSERT INTO public.profiles (profile_id, name, avatar_url)
            VALUES (new.id, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'avatar_url');
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER handle_sign_up
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_sign_up();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET SEARCH_PATH = ''
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'UTC';
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();