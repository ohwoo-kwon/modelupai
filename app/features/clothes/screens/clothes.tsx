import type { Route } from "./+types/clothes";

import makeServerClient from "~/core/lib/supa-client.server";

import ClothCard from "../components/cloth-card";
import { getClothes } from "../queries";

export const meta: Route.MetaFunction = () => {
  return [{ title: `옷 | ${import.meta.env.VITE_APP_NAME}` }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);

  const clothes = await getClothes(client);

  return { clothes };
};

export default function Clothes({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-10 px-5">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-bold md:text-2xl">
          Model Up AI 의 가상 AI 피팅
        </h1>
        <h3 className="text-center md:text-lg">
          Model Up AI 를 통해 원하는 옷을 가상 AI 피팅해볼 수 있어요.
        </h3>
      </div>
      {/* <div className="flex justify-end">
        <Button className="w-full md:w-fit" asChild>
          <Link to="/clothes/create">피팅하고 싶은 옷 추가</Link>
        </Button>
      </div> */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        {loaderData.clothes.map(({ cloth_id, name, category, image_url }) => (
          <ClothCard
            key={`cloth_${cloth_id}`}
            clothId={cloth_id}
            imgUrl={image_url}
            name={name}
            category={category}
          />
        ))}
      </div>
    </div>
  );
}
