import type { Route } from "./+types/delete-profile";

import { data, redirect } from "react-router";

import { requireAuthentication, requireMethod } from "~/core/lib/guards.server";
import adminClient from "~/core/lib/supa-admin-client.server";
import makeServerClient from "~/core/lib/supa-client.server";

export async function action({ request }: Route.ActionArgs) {
  requireMethod("DELETE")(request);

  const [client] = makeServerClient(request);

  await requireAuthentication(client);

  const {
    data: { user },
  } = await client.auth.getUser();

  const { error } = await adminClient.auth.admin.deleteUser(user!.id);

  if (error) {
    return data(
      {
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }

  try {
    await adminClient.storage.from("avatars").remove([user!.id]);
  } catch (error) {}

  return redirect("/");
}
