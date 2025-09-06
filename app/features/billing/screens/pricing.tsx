import type { Route } from "./+types/pricing";

import { FlameIcon, GemIcon, WalletIcon } from "lucide-react";

import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";

export default function Pricing() {
  return (
    <div className="h-full px-4">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
            Fit Me AI 요금제
          </h1>
          <h3>AI 가상 피팅으로 새로운 쇼핑 경험을 만나보세요.</h3>
        </div>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                <GemIcon fill="skyblue" strokeWidth={1.5} /> 10개
              </CardTitle>
              <CardDescription className="text-center">
                다이아 1개 당 330원
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-3xl font-semibold">
              3,300 원
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full">
                지금 구매하기
              </Button>
            </CardFooter>
          </Card>
          <Card className="border-primary relative border-2">
            <div className="bg-primary text-primary-foreground absolute top-0 left-1/2 flex -translate-1/2 items-center justify-center gap-2 rounded-full px-4 py-1 font-bold">
              <FlameIcon fill="yellow" stroke="red" /> 가장 인기
            </div>
            <div className="absolute top-4 right-3 rounded-full bg-red-500 px-2 text-center text-white">
              45% 할인
            </div>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                <GemIcon fill="skyblue" strokeWidth={1.5} /> 50개
              </CardTitle>
              <CardDescription className="text-center">
                다이아 1개 당 180원
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col text-center">
              <span className="text-muted-foreground text-sm line-through">
                16,500 원
              </span>
              <span className="text-green-500">7,500 원 절약</span>
              <span className="text-3xl font-semibold">9,000 원</span>
            </CardContent>
            <CardFooter>
              <Button className="w-full">지금 구매하기</Button>
            </CardFooter>
          </Card>
          <Card className="border-primary relative border-2">
            <div className="bg-primary text-primary-foreground absolute top-0 left-1/2 flex -translate-1/2 items-center justify-center gap-2 rounded-full px-4 py-1 font-bold">
              <WalletIcon fill="brown" stroke="yellow" strokeWidth={1} /> 최대
              할인
            </div>
            <div className="absolute top-4 right-3 rounded-full bg-red-500 px-2 text-center text-white">
              64% 할인
            </div>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                <GemIcon fill="skyblue" strokeWidth={1.5} /> 300개
              </CardTitle>
              <CardDescription className="text-center">
                다이아 1개 당 120원
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col text-center">
              <span className="text-muted-foreground text-sm line-through">
                99,000 원
              </span>
              <span className="text-green-500">63,000 원 절약</span>
              <span className="text-3xl font-semibold">36,000 원</span>
            </CardContent>
            <CardFooter>
              <Button className="w-full">지금 구매하기</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
