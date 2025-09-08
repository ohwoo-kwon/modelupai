import type { Route } from "./+types/home";

import { Link } from "react-router";

import { Button } from "~/core/components/ui/button";
import { Card, CardHeader } from "~/core/components/ui/card";

export const meta: Route.MetaFunction = () => {
  return [
    { title: `AI 가상 피팅 | ${import.meta.env.VITE_APP_NAME} 가상 피팅` },
    {
      name: "description",
      content: "AI 가상 피팅 서비스를 즐길 수 있는 Fit Me Ai 입니다.",
    },
  ];
};

export default function Home() {
  return (
    <div>
      <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center gap-10 bg-gradient-to-br from-indigo-400 to-pink-400">
        <h1 className="text-3xl font-bold text-white">Fit Me AI</h1>
        <h3 className="text-lg text-white">
          피팅 서비스로 AI 시대 쇼핑을 경험해보세요.
        </h3>
        <Button variant="outline" className="p-6 text-base" asChild>
          <Link to="/photos/explore">무료로 체험하기</Link>
        </Button>
      </div>
      <div className="flex h-screen flex-col gap-4 px-4 py-8">
        <h1 className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-center text-3xl font-bold text-transparent">
          AI 가상 피팅
        </h1>
        <Card className="mx-auto flex h-full max-w-[400px] flex-col items-center justify-center gap-2 px-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <img
                className="mx-auto aspect-square w-50 max-w-[150px] rounded border"
                src="https://qajkaixegiieljkctzwy.supabase.co/storage/v1/object/public/lookbooks/40280d25-8dda-448b-89d3-c91c1217a411/1756767545077-pcxivog5t8c.jpeg"
                alt="원하는 옷 사진"
              />
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
                원하는 옷
              </span>
            </div>
            <div className="relative">
              <img
                className="mx-auto aspect-square w-50 max-w-[150px] rounded border"
                src="https://qajkaixegiieljkctzwy.supabase.co/storage/v1/object/public/fittings/40280d25-8dda-448b-89d3-c91c1217a411/1756812578882-02uvabp9kzqb.png"
                alt="내 사진"
              />
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
                내 사진
              </span>
            </div>
          </div>
          <div className="relative">
            <img
              className="mx-auto aspect-square w-full max-w-[300px] rounded border"
              src="https://qajkaixegiieljkctzwy.supabase.co/storage/v1/object/public/result-image/40280d25-8dda-448b-89d3-c91c1217a411/1756812596332-m9ahl42qags.jpeg"
              alt="AI 가상 피팅 사진"
            />
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2 py-1 text-sm text-white">
              ✨ 피팅 결과 ✨
            </span>
          </div>
        </Card>
      </div>
      <div className="flex h-screen flex-col items-center justify-center gap-40 bg-white">
        <div className="mx-auto flex w-3/4 flex-col items-center justify-center gap-4 rounded-md px-6">
          <div className="flex size-15 items-center justify-center rounded-md bg-gradient-to-br from-indigo-400 to-pink-400 text-3xl">
            📚
          </div>
          <h3 className="text-xl font-semibold">다양한 룩북</h3>
          <p className="text-muted-foreground">
            패션 인플루언서들의 옷을 입어보고 나의 스타일을 찾아보세요
          </p>
        </div>
        <div className="mx-auto flex w-3/4 flex-col items-center justify-center gap-4 rounded-md px-6">
          <div className="flex size-15 items-center justify-center rounded-md bg-gradient-to-br from-indigo-400 to-pink-400 text-3xl">
            📷
          </div>
          <h3 className="text-xl font-semibold">원하는 옷 피팅</h3>
          <p className="text-muted-foreground">
            마음에 드는 옷 사진을 등록해서 직접 입어볼 수 있어요
          </p>
        </div>
      </div>
    </div>
  );
}
