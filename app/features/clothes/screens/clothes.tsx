import type { Route } from "./+types/clothes";

import { Link } from "react-router";

import { Button } from "~/core/components/ui/button";
import { Input } from "~/core/components/ui/input";

import ClothCard from "../components/cloth-card";

export const meta: Route.MetaFunction = () => {
  return [{ title: `옷 | ${import.meta.env.VITE_APP_NAME}` }];
};

export default function Clothes() {
  return (
    <div className="space-y-10 px-5">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-bold md:text-2xl">
          Model Up AI 의 온라인 피팅
        </h1>
        <h3 className="text-center md:text-lg">
          Model Up AI 를 통해 원하는 옷을 피팅해볼ㄴ 수 있어요.
        </h3>
        <h5>원하는 옷이 없다면 옷을 추가해보세요.</h5>
      </div>
      <div className="flex justify-end">
        <Button className="w-full md:w-fit" asChild>
          <Link to="/models/create">피팅하고 싶은 옷 추가</Link>
        </Button>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        {Array.from({ length: 10 })
          .fill(0)
          .map((_, i) => (
            <ClothCard
              key={`cloth_${i}`}
              clothId={i}
              imgUrl="https://thumbnail6.coupangcdn.com/thumbnails/remote/492x492ex/image/retail/images/2024/02/19/18/8/a445d59a-62c3-4e1d-bc2f-6db5c8f324c1.jpg"
              name="꽃다발을 든 여자"
              category="top"
            />
          ))}
      </div>
    </div>
  );
}
