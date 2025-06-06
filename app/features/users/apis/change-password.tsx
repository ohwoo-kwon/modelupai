import type { Route } from "./+types/change-password";

import { data } from "react-router";
import { z } from "zod";

import { requireAuthentication, requireMethod } from "~/core/lib/guards.server";
import makeServerClient from "~/core/lib/supa-client.server";

const changePasswordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export async function action({ request }: Route.ActionArgs) {
  requireMethod("POST")(request);

  const [client] = makeServerClient(request);

  await requireAuthentication(client);

  const formData = await request.formData();
  const {
    success,
    data: validData,
    error,
  } = changePasswordSchema.safeParse(Object.fromEntries(formData));

  if (!success) {
    return data({ fieldErrors: error.flatten().fieldErrors }, { status: 400 });
  }

  const { error: updateError } = await client.auth.updateUser({
    password: validData.password,
  });

  if (updateError) {
    return data({ error: updateError.message }, { status: 400 });
  }

  return {
    success: true,
  };
}
