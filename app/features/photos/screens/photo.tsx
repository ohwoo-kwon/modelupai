import type { Route } from "./+types/photo";

import { EyeIcon, GemIcon, HeartIcon, ShirtIcon } from "lucide-react";
import { useEffect } from "react";
import { useFetcher } from "react-router";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/core/components/ui/avatar";
import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import { Separator } from "~/core/components/ui/separator";
import makeServerClient from "~/core/lib/supa-client.server";

import { getPhoto } from "../queries";

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data?.photo) {
    return [
      { title: "사진을 찾을 수 없습니다 | MyFashion" },
      {
        name: "description",
        content: "요청하신 사진을 찾을 수 없습니다.",
      },
    ];
  }

  const { photo } = data;

  return [
    {
      title: `${photo.title} | ${import.meta.env.VITE_APP_NAME} 가상 피팅`,
    },
    {
      name: "description",
      content:
        photo.description?.slice(0, 150) ||
        `${photo.title}의 상세 이미지와 정보를 확인해보세요.`,
    },
    {
      name: "keywords",
      content:
        photo.tags?.join(", ") || "패션, 코디, AI 피팅, AI 가상 피팅, FitMeAI",
    },
    {
      property: "og:title",
      content: `${photo.title} | ${import.meta.env.VITE_APP_NAME} 가상 피팅`,
    },
    {
      property: "og:description",
      content:
        photo.description?.slice(0, 100) ||
        `${photo.title} 이미지와 룩북을 확인하세요.`,
    },
    {
      property: "og:image",
      content: photo.image_url,
    },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: `${photo.title} | ${import.meta.env.VITE_APP_NAME} 가상 피팅`,
    },
    {
      name: "twitter:description",
      content:
        photo.description?.slice(0, 100) ||
        `${photo.title} 이미지와 룩북을 확인하세요.`,
    },
    { name: "twitter:image", content: photo.image_url },
  ];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const photo_id = params.photo_id;
  const [client] = makeServerClient(request);

  const photo = await getPhoto(client, photo_id);

  return { photo };
};

export default function Photo({ loaderData }: Route.ComponentProps) {
  const { photo } = loaderData;

  const fetcher = useFetcher();

  // 페이지 로드 시 조회수 증가
  useEffect(() => {
    const recordView = async () => {
      // 짧은 지연 후 조회수 기록 (페이지가 완전히 로드된 후)
      setTimeout(() => {
        fetcher.submit(
          {
            user_agent: navigator.userAgent,
          },
          {
            method: "POST",
            action: `/api/photos/${photo.photo_id}/view`,
            encType: "application/json",
          },
        );
      }, 1000);
    };

    recordView();
  }, [photo.photo_id]);

  return (
    <div className="h-full px-4">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="sm:grid sm:grid-cols-2 sm:gap-2">
          <img
            src={photo.image_url}
            alt={photo.title}
            className="rounded shadow-md"
          />
          <img
            src={photo.lookbook_url}
            alt={`룩북: ${photo.title}`}
            className="rounded shadow-md"
          />
        </div>
        <Button className="w-full">
          <GemIcon /> <span>AI 피팅</span>
        </Button>
        <Separator />
        <div className="space-y-2">
          <div>
            <div className="flex items-center gap-2 text-xs">
              <div className="text-muted-foreground flex items-center gap-1">
                <EyeIcon size={14} /> {photo.views}
              </div>
              <div className="text-muted-foreground flex items-center gap-1">
                <ShirtIcon size={14} /> {photo.fittings}
              </div>
            </div>
            <div className="flex items-center justify-between font-bold sm:text-lg">
              <h3>{photo.title}</h3>
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <HeartIcon />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {photo.tags
                ? photo.tags.map((tag) => (
                    <Badge key={tag} className="bg-blue-400">
                      {tag}
                    </Badge>
                  ))
                : null}
            </div>
          </div>
          <div className="whitespace-pre-line">{photo.description}</div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="size-8 cursor-pointer">
              <AvatarImage src={photo.profile.avatar_url ?? undefined} />
              <AvatarFallback>{photo.profile.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <h5>{photo.profile.name}</h5>
          </div>
          <Button size="sm" variant="outline">
            팔로우
          </Button>
        </div>
      </div>
    </div>
  );
}
