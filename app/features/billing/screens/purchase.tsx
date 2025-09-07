import type { Route } from "./+types/purchase";

import { GemIcon } from "lucide-react";
import { redirect } from "react-router";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { Separator } from "~/core/components/ui/separator";
import makeServerClient from "~/core/lib/supa-client.server";
import { getUserProfile } from "~/features/users/queries";

import PackageCard from "../components/package-card";
import { TossCheckout } from "../components/toss-checkout";

const validateSearchParams = (searchParams: { [k: string]: string }) => {
  return (
    (searchParams.type === "normal" &&
      searchParams.count === "10" &&
      searchParams.price === "330") ||
    (searchParams.type === "best" &&
      searchParams.count === "50" &&
      searchParams.price === "190") ||
    (searchParams.type === "max-discount" &&
      searchParams.count === "300" &&
      searchParams.price === "140")
  );
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);
  const searchParams = Object.fromEntries(new URL(request.url).searchParams);

  if (!validateSearchParams(searchParams)) return redirect("/billing/pricing");

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) return redirect("/login");

  const profile = await getUserProfile(client, { userId: user.id });

  if (!profile) return redirect("/login");

  return {
    profile,
    type: searchParams.type,
    count: searchParams.count,
    price: searchParams.price,
  };
};

export default function Purchase({ loaderData }: Route.ComponentProps) {
  const { profile, type, count, price } = loaderData;

  return (
    <div className="h-full px-4">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
            다이아 구매
          </h1>
          <h3>다이아를 구매하고 마음에 드는 옷을 마음껏 입어보세요.</h3>
        </div>
        <div className="space-y-10">
          <Card>
            <CardHeader>
              <CardTitle>현재 보유 다이아</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <GemIcon fill="skyblue" strokeWidth={1.5} />{" "}
              <span className="text-2xl font-semibold">
                {profile.gem_balance}
              </span>
              <span>다이아</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>선택한 패키지</CardTitle>
            </CardHeader>
            <CardContent>
              <PackageCard
                type={type}
                count={Number(count)}
                price={Number(price)}
                isPurchasing
              />
            </CardContent>
          </Card>
          <Card className="bg-sky-100">
            <CardHeader>
              <CardTitle>구매 후 보유 다이아</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span>현재</span>
                <span>{profile.gem_balance} 다이아</span>
              </div>
              <div className="flex items-center justify-between">
                <span>구매</span>
                <span className="font-semibold text-green-600">
                  + {count} 다이아
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-lg font-bold">
                <span>총 보유</span>
                <span className="text-blue-600">
                  {profile.gem_balance
                    ? profile.gem_balance + Number(count)
                    : 0 + Number(count)}{" "}
                  다이아
                </span>
              </div>
            </CardContent>
          </Card>
          <TossCheckout
            price={Number(price)}
            count={Number(count)}
            orderName={`${count} 다이아`}
            name={profile.name}
            email={profile.email}
            userId={profile.profile_id}
          />
        </div>
      </div>
    </div>
  );
}
