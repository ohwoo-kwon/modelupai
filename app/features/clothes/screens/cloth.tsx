import type { Route } from "./+types/cloth";

import { Link, data } from "react-router";
import { z } from "zod";

import { Button } from "~/core/components/ui/button";
import { Card } from "~/core/components/ui/card";
import makeServerClient from "~/core/lib/supa-client.server";

import { clothingCategoryObject } from "../constants";
import { getClotheById } from "../queries";

export const meta: Route.MetaFunction = ({ data }) => {
  return [
    { title: `${data?.cloth.name} | ${import.meta.env.VITE_APP_NAME}` },
    { name: "description", content: data?.cloth.name },
  ];
};

const paramsSchema = z.object({ clothId: z.coerce.number() });

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);

  const { data: paramsData, success, error } = paramsSchema.safeParse(params);
  if (!success)
    throw data({ error: "유효하지 않은 clothId 입니다." }, { status: 400 });

  const cloth = await getClotheById(client, paramsData.clothId);

  return { cloth };
};

export default function Cloth({ loaderData }: Route.ComponentProps) {
  const { cloth } = loaderData;
  return (
    <div className="space-y-10 px-5">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-bold md:text-2xl">{cloth.name}</h1>
        <h3 className="text-center md:text-lg">
          {clothingCategoryObject[cloth.category]}
        </h3>
      </div>
      <Card className="mx-auto w-fit max-w-screen-md px-8">
        <div className="space-y-4">
          <img
            src={cloth.image_url}
            alt={cloth.name}
            className="mx-auto w-full max-w-96"
          />
          <div className="space-y-2">
            <Button className="w-full">
              <Link
                className="w-full"
                to={`/fitting?clothId=${cloth.cloth_id}`}
              >
                피팅 해보기
              </Link>
            </Button>
            <Button className="w-full" variant="secondary">
              <Link className="w-full" to={cloth.shopping_url} target="_blank">
                구매하러 가기
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
