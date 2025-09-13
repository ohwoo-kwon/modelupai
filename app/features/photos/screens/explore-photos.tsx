import type { Route } from "./+types/explore-photos";

import { SearchIcon, XIcon } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Await, Link, useSearchParams } from "react-router";

import { Button } from "~/core/components/ui/button";
import { Input } from "~/core/components/ui/input";
import makeServerClient from "~/core/lib/supa-client.server";

import { getPhotos } from "../queries";

export const meta: Route.MetaFunction = ({ data }) => {
  const searchQuery = data?.initSearchQuery || "";
  const baseTitle = `패션 탐색 | ${import.meta.env.VITE_APP_NAME} 피팅`;
  const title = searchQuery
    ? `"${searchQuery}" 관련 패션 이미지 검색 | ${import.meta.env.VITE_APP_NAME} 피팅`
    : baseTitle;
  const description = searchQuery
    ? `"${searchQuery}"와 관련된 최신 패션 사진을 둘러보세요. AI 피팅으로 직접 입어볼 수도 있습니다.`
    : "최신 패션 트렌드를 한눈에! 마음에 드는 스타일을 탐색하고, AI 피팅으로 직접 입어보세요.";

  const image = "";

  return [
    { title },
    { name: "description", content: description },

    // SEO keywords
    {
      name: "keywords",
      content: "패션, 패션 탐색, 옷 추천, 스타일, AI 피팅, 피팅, 코디, 트렌드",
    },

    // Open Graph
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://fitmeai.store" },

    // Twitter Cards
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);

  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("q") || "";

  const photos = getPhotos(client, searchQuery);

  return { photos, initSearchQuery: searchQuery };
};

export default function ExplorePhotos({ loaderData }: Route.ComponentProps) {
  const { photos, initSearchQuery } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(initSearchQuery);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState(initSearchQuery);

  // 검색어 디바운싱 (500ms 지연)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);

      // URL 파라미터 업데이트
      if (searchTerm.trim()) {
        setSearchParams({ q: searchTerm.trim() });
      } else {
        setSearchParams({});
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, setSearchParams]);

  // 검색 초기화
  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSearchParams({});
  };

  return (
    <div className="-translate-y-4 md:-translate-y-8">
      <div className="sticky top-4 z-10 border-b bg-white shadow-sm">
        <div className="w-full p-4">
          <div className="flex items-center justify-center gap-4">
            <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
              패션 탐색
            </h1>
            <div className="relative max-w-md flex-1">
              <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                type="text"
                placeholder="제목, 태그, 사용자명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 pl-10 text-xs"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="hover:bg-muted absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 transform p-0"
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* 검색 결과 표시 */}
          {debouncedSearchTerm && (
            <div className="text-muted-foreground mt-3 text-sm">
              "
              <span className="text-foreground font-medium">
                {debouncedSearchTerm}
              </span>
              " 검색 결과
            </div>
          )}
        </div>
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
            resolve={photos}
            errorElement={
              <div className="col-span-full text-center text-red-500">
                패션 이미지를 가져올 수 없습니다.
              </div>
            }
          >
            {(photos) =>
              photos.map((photo) => (
                <Link
                  key={photo.photo_id}
                  className="cursor-pointer overflow-hidden shadow transition-all hover:scale-105"
                  to={`/photos/${photo.photo_id}`}
                >
                  <img
                    className="aspect-square object-cover"
                    src={photo.image_url}
                  />
                </Link>
              ))
            }
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
