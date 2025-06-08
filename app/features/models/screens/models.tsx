import type { Route } from "./+types/models";

import { Link } from "react-router";

import { Button } from "~/core/components/ui/button";
import { Input } from "~/core/components/ui/input";

import ModelCard from "../components/model-card";

export const meta: Route.MetaFunction = () => {
  return [{ title: `모델 | ${import.meta.env.VITE_APP_NAME}` }];
};

export default function Models() {
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
        {Array.from({ length: 10 })
          .fill(0)
          .map((_, i) => (
            <ModelCard
              key={`model_${i}`}
              modelId={i}
              imgUrl="https://cdn.pixabay.com/photo/2022/03/24/15/46/woman-7089304_1280.jpg"
              name="꽃다발을 든 여자"
              ageRange="21-25"
              bodyType="average"
              race="asian"
              style="cute"
            />
          ))}
      </div>
    </div>
  );
}
