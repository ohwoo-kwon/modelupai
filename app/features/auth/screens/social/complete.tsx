import type { Route } from "./+types/complete";

import { data, redirect } from "react-router";
import { z } from "zod";

import makeServerClient from "~/core/lib/supa-client.server";

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: `소셜 로그인 성공 | ${import.meta.env.VITE_APP_NAME}`,
    },
  ];
};

const searchParamsSchema = z.object({
  code: z.string(),
});

const errorSchema = z.object({
  error: z.string(),
  error_code: z.string(),
  error_description: z.string(),
});

export async function loader({ request }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url);

  const { success, data: validData } = searchParamsSchema.safeParse(
    Object.fromEntries(searchParams),
  );

  if (!success) {
    const { data: errorData, success: errorSuccess } = errorSchema.safeParse(
      Object.fromEntries(searchParams),
    );

    if (!errorSuccess) {
      return data({ error: "유효하지 않은 코드입니다." }, { status: 400 });
    }

    return data({ error: errorData.error_description }, { status: 400 });
  }

  const [client, headers] = makeServerClient(request);

  const { error } = await client.auth.exchangeCodeForSession(validData.code);

  if (error) {
    return data({ error: error.message }, { status: 400 });
  }

  return redirect("/", { headers });
}

export default function Confirm({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2.5">
      <h1 className="text-2xl font-semibold">로그인 실패</h1>
      <p className="text-muted-foreground">{loaderData.error}</p>
    </div>
  );
}
