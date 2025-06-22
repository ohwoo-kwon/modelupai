import type { Route } from "./+types/clothes";

import { SearchIcon } from "lucide-react";
import { type MouseEvent, Suspense, useRef } from "react";
import { Await, useSearchParams } from "react-router";
import { z } from "zod";

import CustomPagination from "~/core/components/custom-pagination";
import { Button } from "~/core/components/ui/button";
import { Card } from "~/core/components/ui/card";
import { Input } from "~/core/components/ui/input";
import makeServerClient from "~/core/lib/supa-client.server";

import ClothCard from "../components/cloth-card";
import { clothingCategoryObject } from "../constants";
import { getClothes, getClothesPage } from "../queries";
import { clothingCategoryEnum } from "../schema";

export const meta: Route.MetaFunction = () => {
  return [{ title: `옷 | ${import.meta.env.VITE_APP_NAME} 가상 피팅` }];
};

const searchParamsSchema = z.object({
  page: z.coerce
    .number()
    .default(1)
    .superRefine((value, ctx) => {
      if (value < 1)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "page 는 1 이상의 값이어야 합니다.",
        });
    }),
  search: z.string().optional(),
  category: z.enum(clothingCategoryEnum.enumValues).optional(),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);

  const {
    data: searchParamsData,
    success,
    error,
  } = searchParamsSchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams),
  );

  if (!success) throw error;

  const { page, search, category } = searchParamsData;

  const clothes = getClothes(client, { page, search, category });
  const totalPages = await getClothesPage(client, { search, category });

  return { clothes, totalPages };
};

export default function Clothes({ loaderData }: Route.ComponentProps) {
  const { clothes, totalPages } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const search = searchParams.get("search");

  const handleClickSearch = () => {
    if (!inputRef.current) return;
    searchParams.delete("page");
    searchParams.set("search", inputRef.current.value);
    setSearchParams(searchParams);
  };

  const handleCategoryClick = (e: MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { value },
    } = e;
    searchParams.delete("page");
    searchParams.set("category", value);
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-10 px-5">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-bold md:text-2xl">
          Model Up AI 의 AI 가상 피팅
        </h1>
        <h3 className="text-center md:text-lg">
          Model Up AI 를 통해 원하는 옷을 AI 가상 피팅해볼 수 있어요.
        </h3>
      </div>
      {/* <div className="flex justify-end">
        <Button className="w-full md:w-fit" asChild>
          <Link to="/clothes/create">피팅하고 싶은 옷 추가</Link>
        </Button>
      </div> */}
      <Card className="bg-accent px-8 shadow-none">
        <div className="relative">
          <Input
            ref={inputRef}
            placeholder="원하는 옷을 검색해보세요..."
            defaultValue={search || ""}
            className="bg-background"
          />
          <Button
            className="absolute top-1 right-1 size-7"
            size="icon"
            onClick={handleClickSearch}
          >
            <SearchIcon />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {clothingCategoryEnum.enumValues.map((category) => (
            <Button
              key={category}
              size="sm"
              variant="outline"
              onClick={handleCategoryClick}
              value={category}
            >
              {clothingCategoryObject[category]}
            </Button>
          ))}
        </div>
      </Card>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        <Suspense
          fallback={
            <>
              <div className="bg-accent flex h-80 animate-pulse flex-col rounded" />
              <div className="bg-accent flex h-80 animate-pulse flex-col rounded" />
              <div className="bg-accent flex h-80 animate-pulse flex-col rounded" />
              <div className="bg-accent flex h-80 animate-pulse flex-col rounded" />
            </>
          }
        >
          <Await
            resolve={clothes}
            children={(clothes) =>
              clothes.length > 0 ? (
                clothes.map(({ cloth_id, name, category, image_url }) => (
                  <ClothCard
                    key={`cloth_${cloth_id}`}
                    clothId={cloth_id}
                    imgUrl={image_url}
                    name={name}
                    category={category}
                  />
                ))
              ) : (
                <div className="text-center text-xl">
                  상품 준비 중 입니다...
                </div>
              )
            }
          ></Await>
        </Suspense>
      </div>
      <CustomPagination totalPages={totalPages} />
    </div>
  );
}
