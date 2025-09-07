import { createBrowserClient } from "@supabase/ssr";
import { type Database } from "database.types";

export const browserClient = createBrowserClient<Database>(
  "https://qajkaixegiieljkctzwy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhamthaXhlZ2lpZWxqa2N0end5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MDc3MTAsImV4cCI6MjA2NDQ4MzcxMH0.zghVAWkjlDnQ9AwhK8G_7CP5J0SkDWp6LXEfhrNHu3Y",
);
