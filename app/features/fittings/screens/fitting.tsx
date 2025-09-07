import type { Route } from "./+types/fitting";

import { Link } from "react-router";

import ShareCard from "~/core/components/share-card";
import makeServerClient from "~/core/lib/supa-client.server";

import { getFittingById } from "../queries";

export const meta: Route.MetaFunction = ({ data }) => {
  const fitting = data?.fitting;

  if (!fitting) {
    return [
      {
        title: `AI 가상 피팅 결과| ${import.meta.env.VITE_APP_NAME} 가상 피팅`,
      },
      {
        name: "description",
        content: "AI로 가상 피팅한 결과를 확인해보세요.",
      },
    ];
  }

  return [
    {
      title: `AI 가상 피팅 결과 | ${fitting.photo.title}`,
    },
    {
      name: "description",
      content: `${fitting.photo.title} 에 대한 AI 가상 피팅 결과를 확인해보세요.`,
    },
    {
      name: "keywords",
      content: `AI 가상 피팅, 스타일링, 패션 코디, 룩북, 패션 AI, ${import.meta.env.VITE_APP_NAME}`,
    },
    {
      property: "og:title",
      content: `AI 가상 피팅 결과 | ${fitting.photo.title}`,
    },
    {
      property: "og:description",
      content: `${fitting.photo.title} 에 대한 AI 가상 피팅 결과를 확인해보세요.`,
    },
    {
      property: "og:image",
      content: fitting.result_image_url,
    },
  ];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { fittingId } = params;
  const [client] = makeServerClient(request);

  const {
    data: { user },
  } = await client.auth.getUser();

  const fitting = await getFittingById(client, fittingId);

  const isOwner = user ? fitting.profile_id === user.id : false;

  return { fitting, isOwner };
};

export default function Fitting({ loaderData }: Route.ComponentProps) {
  const { fitting, isOwner } = loaderData;
  return (
    <div className="h-full px-4">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
            AI 가상 피팅 결과
          </h1>
          <Link
            to={`/photos/${fitting.photo_id}`}
            className="text-center underline sm:text-lg"
          >
            <h3>{fitting.photo.title}</h3>
          </Link>
        </div>
        {fitting.result_image_url ? (
          <div>
            <h3>결과 이미지</h3>
            <img
              src={fitting.result_image_url}
              alt="AI 가상 피팅 결과 이미지"
              className="rounded shadow-md"
            />
          </div>
        ) : null}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <h3>내 이미지</h3>
            <img
              src={fitting.user_photo_url}
              alt="나의 이미지"
              className="rounded shadow-md"
            />
          </div>
          <div>
            <h3>룩북 이미지</h3>
            <img
              src={fitting.photo.lookbook_url}
              alt="룩북 이미지"
              className="rounded shadow-md"
            />
          </div>
        </div>
        {isOwner && (
          <ShareCard
            title={`${import.meta.env.VITE_APP_NAME} 가상 피팅`}
            url={`https://fitmeai.store/fittings/${fitting.fitting_id}`}
          />
        )}
      </div>
    </div>
  );
}
