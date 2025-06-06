import type { Route } from "./+types/resend";

import { data } from "react-router";
import { z } from "zod";

import makeServerClient from "~/core/lib/supa-client.server";

const resendSchema = z.object({
  email: z.string().email({ message: "유효하지 않은 이메일 형식입니다." }),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const { success, data: validData } = resendSchema.safeParse(
    Object.fromEntries(formData),
  );
  if (!success) {
    return data({ error: "유효하지 않은 이메일 형식입니다." }, { status: 400 });
  }

  const [client] = makeServerClient(request);

  const { error } = await client.auth.resend({
    type: "signup",
    email: validData.email,
  });

  if (error) {
    return data({ error: error.message }, { status: 400 });
  }

  return data({ success: true }, { status: 200 });
}
