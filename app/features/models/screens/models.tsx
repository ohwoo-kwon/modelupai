import type { Route } from "./+types/models";

import { DotIcon } from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/core/components/ui/button";
import { Input } from "~/core/components/ui/input";

export const meta: Route.MetaFunction = () => {
  return [{ title: `모델 | ${import.meta.env.VITE_APP_NAME}` }];
};

export default function Models() {
  return (
    <div className="space-y-10 px-5">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-bold md:text-2xl">Model Up AI 의 모델</h1>
        <h3 className="text-center md:text-lg">
          Model Up AI 를 통해 신규 모델을 만들거나 기존 모델에 다른 옷, 배경
          혹은 포즈를 바꿔볼 수 있습니다.
        </h3>
        <Button asChild>
          <Link to="/models/create">나만의 모델 생성 &rarr;</Link>
        </Button>
      </div>
      <div className="flex flex-col items-center gap-2 md:flex-row md:justify-between">
        <div>
          <Input name="name" placeholder="모델명" />
        </div>
        <Button variant="outline" asChild>
          <Link to="/models/create">모델 생성</Link>
        </Button>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        <div className="flex h-fit flex-col rounded border">
          <img
            className="w-full object-cover"
            src="https://cdn.pixabay.com/photo/2022/03/24/15/46/woman-7089304_1280.jpg"
          />
          <div className="flex flex-col px-4 py-2">
            <h3 className="text-lg font-bold">꽃다발 든 여자</h3>
            <div className="text-muted-foreground flex items-center text-sm">
              <span>21-25</span>
              <DotIcon size={14} />
              <span>평범</span>
              <DotIcon size={14} />
              <span>아시아인</span>
              <DotIcon size={14} />
              <span>큐트</span>
            </div>
          </div>
        </div>
        <div className="flex h-fit flex-col rounded border">
          <img
            className="w-full object-cover"
            src="https://cdn.pixabay.com/photo/2024/03/20/12/36/tokyo-skytree-8645455_1280.jpg"
          />
          <div className="flex flex-col px-4 py-2">
            <h3 className="text-lg font-bold">꽃다발 든 여자</h3>
            <div className="text-muted-foreground flex items-center text-sm">
              <span>21-25</span>
              <DotIcon size={14} />
              <span>평범</span>
              <DotIcon size={14} />
              <span>아시아인</span>
              <DotIcon size={14} />
              <span>큐트</span>
            </div>
          </div>
        </div>
        <div className="flex h-fit flex-col rounded border">
          <img
            className="w-full object-cover"
            src="https://cdn.pixabay.com/photo/2023/09/21/14/17/italy-8266783_1280.jpg"
          />
          <div className="flex flex-col px-4 py-2">
            <h3 className="text-lg font-bold">꽃다발 든 여자</h3>
            <div className="text-muted-foreground flex items-center text-sm">
              <span>21-25</span>
              <DotIcon size={14} />
              <span>평범</span>
              <DotIcon size={14} />
              <span>아시아인</span>
              <DotIcon size={14} />
              <span>큐트</span>
            </div>
          </div>
        </div>
        <div className="flex h-fit flex-col rounded border">
          <img
            className="w-full object-cover"
            src="https://cdn.pixabay.com/photo/2022/01/22/13/14/baby-6957222_1280.jpg"
          />
          <div className="flex flex-col px-4 py-2">
            <h3 className="text-lg font-bold">꽃다발 든 여자</h3>
            <div className="text-muted-foreground flex items-center text-sm">
              <span>21-25</span>
              <DotIcon size={14} />
              <span>평범</span>
              <DotIcon size={14} />
              <span>아시아인</span>
              <DotIcon size={14} />
              <span>큐트</span>
            </div>
          </div>
        </div>
        <div className="flex h-fit flex-col rounded border">
          <img
            className="w-full object-cover"
            src="https://cdn.pixabay.com/photo/2025/05/23/08/54/girl-9617241_1280.png"
          />
          <div className="flex flex-col px-4 py-2">
            <h3 className="text-lg font-bold">꽃다발 든 여자</h3>
            <div className="text-muted-foreground flex items-center text-sm">
              <span>21-25</span>
              <DotIcon size={14} />
              <span>평범</span>
              <DotIcon size={14} />
              <span>아시아인</span>
              <DotIcon size={14} />
              <span>큐트</span>
            </div>
          </div>
        </div>
        <div className="flex h-fit flex-col rounded border">
          <img
            className="w-full object-cover"
            src="https://cdn.pixabay.com/photo/2025/03/12/09/59/fashion-9464875_1280.jpg"
          />
          <div className="flex flex-col px-4 py-2">
            <h3 className="text-lg font-bold">꽃다발 든 여자</h3>
            <div className="text-muted-foreground flex items-center text-sm">
              <span>21-25</span>
              <DotIcon size={14} />
              <span>평범</span>
              <DotIcon size={14} />
              <span>아시아인</span>
              <DotIcon size={14} />
              <span>큐트</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
