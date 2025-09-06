import type { Route } from "./+types/purchase";

import { Form, redirect, useNavigation } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";
import { getUserProfile } from "~/features/users/queries";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) return redirect("/login");

  const profile = await getUserProfile(client, { userId: user.id });

  if (!profile) return redirect("/login");

  return { profile };
};

export default function Purchase({ loaderData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const { profile } = loaderData;
  const isSubmitting = navigation.state === "submitting";

  return <div className=""></div>;
}
