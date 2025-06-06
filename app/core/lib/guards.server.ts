import type { SupabaseClient } from "@supabase/supabase-js";

import { data } from "react-router";

export async function requireAuthentication(client: SupabaseClient) {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) {
    throw data(null, { status: 401 });
  }
}

export function requireMethod(method: string) {
  return (request: Request) => {
    if (request.method !== method) {
      throw data(null, { status: 405 });
    }
  };
}
