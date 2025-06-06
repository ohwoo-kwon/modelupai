import type { Database } from "database.types";

import { createClient } from "@supabase/supabase-js";

const adminClient = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export default adminClient;
