import type { Route } from "./+types/start";

import { data, redirect } from "react-router";
import { z } from "zod";

import makeServerClient from "~/core/lib/supa-client.server";

const paramsSchema = z.object({
  provider: z.enum(["google", "kakao"]),
});

export async function loader({ params, request }: Route.LoaderArgs) {
  const { success, data: parsedParams } = paramsSchema.safeParse(params);
  if (!success) {
    return data({ error: "유효하지 않은 소셜 로그인입니다." }, { status: 400 });
  }

  const [client, headers] = makeServerClient(request);

  const { data: signInData, error: signInError } =
    await client.auth.signInWithOAuth({
      provider: parsedParams.provider,
      options: {
        redirectTo: `${process.env.SITE_URL}/auth/social/complete/${parsedParams.provider}`,
      },
    });

  if (signInError) {
    return data({ error: signInError.message }, { status: 400 });
  }

  return redirect(signInData.url, { headers });
}

export default function StartSocialLogin({ loaderData }: Route.ComponentProps) {
  const { error } = loaderData;

  return (
    <div className="flex flex-col items-center justify-center gap-2.5">
      <h1 className="text-2xl font-semibold">{error}</h1>
      <p className="text-muted-foreground">잠시 후 다시 시도해주세요.</p>
    </div>
  );
}
