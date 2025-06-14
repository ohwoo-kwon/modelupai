import type { Route } from "./+types/model";

import { Link, data } from "react-router";
import z from "zod";

import { Button } from "~/core/components/ui/button";
import { Card } from "~/core/components/ui/card";
import { Label } from "~/core/components/ui/label";
import makeServerClient from "~/core/lib/supa-client.server";

import {
  bodyTypeObject,
  genderObject,
  raceObject,
  styleObject,
} from "../\bconstants";
import { getModelById } from "../queries";

export const meta: Route.MetaFunction = ({ data }) => {
  return [
    { title: `${data?.model.name} | ${import.meta.env.VITE_APP_NAME}` },
    {
      name: "description",
      content: `${data?.model.name}, ${data?.model.description}, ${data?.model.gender}, ${data?.model.age_range}, ${data?.model.body_type}, ${data?.model.race}, ${data?.model.style}, ${data?.model.prompt}`,
    },
  ];
};

const paramsSchema = z.object({ modelId: z.coerce.number() });

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);

  const { data: paramsData, success, error } = paramsSchema.safeParse(params);
  if (!success)
    throw data({ error: "유효하지 않은 clothId 입니다." }, { status: 400 });

  const model = await getModelById(client, paramsData.modelId);

  return { model };
};

export default function Model({ loaderData }: Route.ComponentProps) {
  const { model } = loaderData;

  return (
    <div className="space-y-10 px-5">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-bold md:text-2xl">
          {loaderData.model.name}
        </h1>
        <h3 className="md:text-lg">{loaderData.model.description}</h3>
      </div>
      <Card className="mx-auto w-fit max-w-screen-md px-8">
        <div className="space-y-4">
          <img
            src={model.image_url}
            alt={model.name}
            className="mx-auto w-full max-w-96"
          />
          <div className="flex gap-2">
            <Label className="w-20">성별</Label>
            <p className="font-bold">{genderObject[model.gender]}</p>
          </div>
          <div className="flex gap-2">
            <Label className="w-20">나이</Label>
            <p className="font-bold">{model.age_range}</p>
          </div>
          <div className="flex gap-2">
            <Label className="w-20">체형</Label>
            <p className="font-bold">{bodyTypeObject[model.body_type]}</p>
          </div>
          <div className="flex gap-2">
            <Label className="w-20">인종</Label>
            <p className="font-bold">{raceObject[model.race]}</p>
          </div>
          <div className="flex gap-2">
            <Label className="w-20">스타일</Label>
            <p className="font-bold">{styleObject[model.style]}</p>
          </div>
          <div className="flex gap-2">
            <Label className="w-20">추가 정보</Label>
            <p className="font-bold">{model.prompt}</p>
          </div>
          <div className="space-y-2">
            <Button className="w-full">
              <Link
                className="w-full"
                to={`/fitting?modelId=${model.model_id}`}
              >
                피팅 해보기
              </Link>
            </Button>
            <Button className="w-full" variant="secondary">
              <Link
                className="w-full"
                to={`/models/create?modelId=${model.model_id}`}
              >
                유사 모델 만들기
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
