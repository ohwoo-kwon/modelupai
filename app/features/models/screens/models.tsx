import type { Route } from "./+types/models";

import { Link } from "react-router";

import { Button } from "~/core/components/ui/button";
import { Input } from "~/core/components/ui/input";
import makeServerClient from "~/core/lib/supa-client.server";

import ModelCard from "../components/model-card";
import { getModels } from "../queries";

export const meta: Route.MetaFunction = () => {
  return [{ title: `모델 | ${import.meta.env.VITE_APP_NAME}` }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);

  const models = await getModels(client);

  return { models };
};

export default function Models({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-10 px-5">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-bold md:text-2xl">Model Up AI 의 모델</h1>
        <h3 className="text-center md:text-lg">
          Model Up AI 에서는 신규 모델을 생성하거나 기존 모델을 기반으로 변형도
          가능해요.
        </h3>
      </div>
      <div className="flex flex-col items-center gap-2 md:flex-row md:justify-between">
        <div>
          <Input name="name" placeholder="모델명" />
        </div>
        <Button className="w-full md:w-fit" asChild>
          <Link to="/models/create">모델 생성</Link>
        </Button>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        {loaderData.models.map(
          ({
            model_id,
            image_url,
            name,
            age_range,
            body_type,
            race,
            style,
          }) => (
            <ModelCard
              key={`model_${model_id}`}
              modelId={model_id}
              imgUrl={image_url}
              name={name}
              ageRange={age_range}
              bodyType={body_type}
              race={race}
              style={style}
            />
          ),
        )}
      </div>
    </div>
  );
}
