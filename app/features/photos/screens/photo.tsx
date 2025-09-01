import type { Route } from "./+types/photo";

import makeServerClient from "~/core/lib/supa-client.server";

import { getPhoto } from "../queries";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const photo_id = params.photo_id;
  const [client] = makeServerClient(request);

  const photo = await getPhoto(client, photo_id);

  return { photo };
};

export default function Photo({ loaderData }: Route.ComponentProps) {
  const { photo } = loaderData;
  return (
    <div>
      <img src={photo.image_url} />
    </div>
  );
}
