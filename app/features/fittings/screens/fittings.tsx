import type { Route } from "./+types/fittings";

import { Suspense } from "react";
import { Await, Link, redirect } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";

import { getFittingsByProfileId } from "../queries";

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: `AI 가상 피팅 내역 | ${import.meta.env.VITE_APP_NAME} 가상 피팅`,
    },
    {
      name: "description",
      content:
        "내가 시도한 모든 AI 가상 피팅 내역을 한눈에 확인하세요. 이전에 착용한 룩과 코디를 다시 보고 스타일을 참고할 수 있습니다.",
    },
    {
      name: "keywords",
      content: `AI 패션, AI 가상 피팅, 스타일링, 코디, ${import.meta.env.VITE_APP_NAME}`,
    },
    {
      property: "og:title",
      content: `AI 가상 피팅 내역 | ${import.meta.env.VITE_APP_NAME} 가상 피팅`,
    },
    {
      property: "og:description",
      content:
        "내가 시도한 모든 AI 가상 피팅 결과를 모아보세요. 스타일 참고에 딱!",
    },
    {
      property: "og:image",
      content: "",
    },
  ];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) return redirect("/login");

  const fittings = getFittingsByProfileId(client, user.id);
  return { fittings };
};

export default function Fittings({ loaderData }: Route.ComponentProps) {
  const { fittings } = loaderData;
  return (
    <div className="-translate-y-4 md:-translate-y-8">
      <div className="w-full p-4">
        {/* <div className="flex items-center justify-center gap-4"> */}
        <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-center text-2xl font-bold text-transparent">
          AI 가상 피팅 내역
        </h1>
        {/* </div> */}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-1 p-4 pb-0">
        <Suspense
          fallback={
            <>
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={`skeleton_${i}`}
                  className="aspect-square w-full animate-pulse rounded bg-slate-200"
                />
              ))}
            </>
          }
        >
          <Await
            resolve={fittings}
            errorElement={
              <div className="col-span-full text-center text-red-500">
                피팅 내역을 가져올 수 없습니다.
              </div>
            }
          >
            {(fittings) =>
              fittings.length > 0 ? (
                fittings.map((fitting) => (
                  <Link
                    key={fitting.fitting_id}
                    className="cursor-pointer overflow-hidden shadow transition-all hover:scale-105"
                    to={`/fittings/${fitting.fitting_id}`}
                  >
                    <img
                      className="aspect-square object-cover"
                      src={fitting.result_image_url || ""}
                    />
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center text-lg">
                  피팅 내역이 없습니다.
                </div>
              )
            }
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
