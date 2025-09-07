import { FlameIcon, GemIcon, WalletIcon } from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { cn } from "~/core/lib/utils";

export default function PackageCard({
  count,
  price,
  type,
  isPurchasing = false,
}: {
  count: number;
  price: number;
  type: string;
  isPurchasing?: boolean;
}) {
  return (
    <Card
      className={cn(
        type !== "normal" ? "border-primary relative border-2" : "",
      )}
    >
      {type !== "normal" && (
        <>
          <div className="bg-primary text-primary-foreground absolute top-0 left-1/2 flex -translate-1/2 items-center justify-center gap-2 rounded-full px-4 py-1 font-bold">
            {type === "best" ? (
              <>
                <FlameIcon fill="yellow" stroke="red" /> 가장 인기
              </>
            ) : (
              <>
                <WalletIcon fill="brown" stroke="yellow" strokeWidth={1} /> 최대
                할인
              </>
            )}
          </div>
          <div className="absolute top-4 right-3 rounded-full bg-red-500 px-2 text-center text-white">
            {Math.ceil(((330 - price) / 330) * 100)}% 할인
          </div>
        </>
      )}
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2 text-xl">
          <GemIcon fill="skyblue" strokeWidth={1.5} /> {count.toLocaleString()}
          개
        </CardTitle>
        <CardDescription className="text-center">
          다이아 1개 당 {price.toLocaleString()}원
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col text-center">
        {type !== "normal" && (
          <>
            <span className="text-muted-foreground text-sm line-through">
              {(count * 330).toLocaleString()} 원
            </span>
            <span className="text-green-500">
              {(count * (330 - price)).toLocaleString()} 원 절약
            </span>
          </>
        )}
        <span className="text-3xl font-semibold">
          {(price * count).toLocaleString()} 원
        </span>
      </CardContent>
      {!isPurchasing && (
        <CardFooter>
          <Button
            variant={type !== "normal" ? "default" : "secondary"}
            className="w-full"
            asChild
          >
            <Link
              to={`/billing/purchase?type=${type}&count=${count}&price=${price}`}
            >
              지금 구매하기
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
