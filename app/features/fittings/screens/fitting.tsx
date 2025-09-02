import type { Route } from "./+types/fitting";

import makeServerClient from "~/core/lib/supa-client.server";
import { getPhoto } from "~/features/photos/queries";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const photoId = params.photoId;
  const [client] = makeServerClient(request);

  const photo = await getPhoto(client, photoId);

  return { photo };
};

export default function Fitting({ loaderData }: Route.ComponentProps) {
  const { photo } = loaderData;
  return <div>fitting</div>;
}
