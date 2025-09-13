import type { Route } from "./+types/fitting";

import { redirect } from "react-router";
import { z } from "zod";

import { requireAuthentication, requireMethod } from "~/core/lib/guards.server";
import makeServerClient from "~/core/lib/supa-client.server";

import { updateFitting } from "../mutations";

const formSchema = z.object({
  is_public: z.preprocess((val) => {
    if (val === "true") return true;
    if (val === "false") return false;
    return val;
  }, z.boolean().optional()),
  rating: z.coerce.number(),
});

export const action = async ({ request, params }: Route.ActionArgs) => {
  const [client] = makeServerClient(request);
  requireAuthentication(client);
  requireMethod("PUT")(request);

  const { fittingId } = params;
  const formData = await request.formData();

  const { data, success, error } = formSchema.safeParse(
    Object.fromEntries(formData),
  );

  if (!success) return { fieldErrors: error.flatten().fieldErrors };

  const { rating, is_public } = data;

  await updateFitting(client, { is_public, fittingId, rating });

  return redirect(`/fittings/${fittingId}`);
};
