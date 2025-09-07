import type { Route } from "./+types/pricing";

import { HandCoinsIcon, LockIcon } from "lucide-react";

import GuideCard from "../components/guide-card";
import PackageCard from "../components/package-card";

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: `${import.meta.env.VITE_APP_NAME} 요금제 - 다이아 충전 및 AI 가상 피팅`,
    },
    {
      name: "description",
      content: `${import.meta.env.VITE_APP_NAME}의 다이아 요금제를 확인하고 충전하세요. AI 가상 피팅으로 다양한 패션 아이템을 입어볼 수 있습니다. 안전한 결제와 즉시 충전을 제공합니다.`,
    },
    {
      name: "keywords",
      content: `AI 피팅, 패션 AI, 가상 피팅, 요금제, 다이아 충전, ${import.meta.env.VITE_APP_NAME}, 온라인 패션, 패션 테크`,
    },
    {
      property: "og:title",
      content: `${import.meta.env.VITE_APP_NAME} 요금제`,
    },
    {
      property: "og:description",
      content:
        "AI 가상 피팅 서비스를 위한 다이아 요금제를 확인하고 원하는 만큼 충전하세요.",
    },
    {
      property: "og:image",
      content: "",
    },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
};

export default function Pricing({}: Route.ComponentProps) {
  return (
    <div className="h-full px-4">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
            Fit Me AI 요금제
          </h1>
          <h3>AI 가상 피팅으로 마음에 드는 옷을 마음껏 입어보세요.</h3>
        </div>
        <div className="space-y-10">
          <PackageCard count={10} price={330} type="normal" />
          <PackageCard count={50} price={190} type="best" />
          <PackageCard count={300} price={140} type="max-discount" />
          <div className="text-muted-foreground flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <LockIcon /> 안전한 결제
            </div>
            <div className="flex items-center gap-2">
              <HandCoinsIcon /> 즉시 충전
            </div>
          </div>
          <div className="space-y-4">
            <GuideCard
              title="다이아는 어떻게 사용하나요?"
              content="다이아는 AI 피팅 서비스를 이용할 때 사용됩니다."
            />
            <GuideCard
              title="다이아는 유효기간이 있나요?"
              content="구매한 다이아는 영구적으로 사용할 수 있으며 별도의 유효기간은 없습니다. 언제든지 원하는 시점에 사용하실 수 있습니다."
            />
            <GuideCard
              title="환불이 가능한가요?"
              content="구매 후 7일 이내, 사용하지 않은 다이아에 대해서 환불 요청이 가능합니다."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
