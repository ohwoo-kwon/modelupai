ALTER TABLE "fittings" ALTER COLUMN "photo_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "fittings" ADD COLUMN "cloth_photo_url" text;