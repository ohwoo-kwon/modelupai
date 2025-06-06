import type { Route } from "./+types/edit-profile";

import { data } from "react-router";
import { z } from "zod";

import makeServerClient from "~/core/lib/supa-client.server";

import { getUserProfile } from "../queries";

const schema = z.object({
  name: z.string().min(1),
  avatar: z.instanceof(File),
});

export async function action({ request }: Route.ActionArgs) {
  const [client] = makeServerClient(request);

  const {
    data: { user },
  } = await client.auth.getUser();

  if (request.method !== "POST") {
    return data(null, { status: 405 });
  }

  if (!user) {
    return data(null, { status: 401 });
  }

  const formData = await request.formData();
  const {
    success,
    data: validData,
    error,
  } = schema.safeParse(Object.fromEntries(formData));

  if (!success) {
    return data({ fieldErrors: error.flatten().fieldErrors }, { status: 400 });
  }

  const profile = await getUserProfile(client, { userId: user.id });
  let avatarUrl = profile?.avatar_url || null;

  if (
    validData.avatar &&
    validData.avatar instanceof File &&
    validData.avatar.size > 0 &&
    validData.avatar.size < 1024 * 1024 &&
    validData.avatar.type.startsWith("image/")
  ) {
    const { error: uploadError } = await client.storage
      .from("avatars")
      .upload(user.id, validData.avatar, {
        upsert: true,
      });

    if (uploadError) {
      return data({ error: uploadError.message }, { status: 400 });
    }

    const {
      data: { publicUrl },
    } = client.storage.from("avatars").getPublicUrl(user.id);
    avatarUrl = publicUrl;
  }

  const { error: updateProfileError } = await client
    .from("profiles")
    .update({
      name: validData.name,
      avatar_url: avatarUrl,
    })
    .eq("profile_id", user.id);

  const { error: updateError } = await client.auth.updateUser({
    data: {
      name: validData.name,
      display_name: validData.name,
      avatar_url: avatarUrl,
    },
  });

  if (updateError) {
    return data({ error: updateError.message }, { status: 400 });
  }

  if (updateProfileError) {
    return data({ error: updateProfileError.message }, { status: 400 });
  }

  return {
    success: true,
  };
}
