import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./sql/migrations",
  schema: "./app/features/**/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
