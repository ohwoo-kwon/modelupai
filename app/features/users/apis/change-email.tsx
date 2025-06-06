import type { Route } from "./+types/change-email";

import { data } from "react-router";
import { z } from "zod";

import { requireAuthentication, requireMethod } from "~/core/lib/guards.server";
import makeServerClient from "~/core/lib/supa-client.server";

const schema = z.object({
  email: z.string().email(),
});

export async function action({ request }: Route.ActionArgs) {
  requireMethod("POST")(request);

  const [client] = makeServerClient(request);

  await requireAuthentication(client);

  const formData = await request.formData();
  const { success, data: validData } = schema.safeParse(
    Object.fromEntries(formData),
  );

  if (!success) {
    return data({ error: "유효하지 않은 이메일 형식입니다." }, { status: 400 });
  }

  const { error } = await client.auth.updateUser({
    email: validData.email,
  });

  if (error) {
    return data({ error: error.message }, { status: 400 });
  }

  return {
    success: true,
  };
}
