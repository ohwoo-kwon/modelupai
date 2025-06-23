import type { Route } from "./+types/cloth";

import { Loader2Icon } from "lucide-react";
import OpenAI from "openai";
import { useEffect, useState } from "react";
import { Form, data, useNavigation } from "react-router";
import Replicate from "replicate";
import { z } from "zod";

import FormErrors from "~/core/components/form-errors";
import { Button } from "~/core/components/ui/button";
import { Card } from "~/core/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/core/components/ui/dialog";
import makeServerClient from "~/core/lib/supa-client.server";
import { fileToBase64, streamToBase64 } from "~/core/lib/utils";

import ImageInput from "../components/image-input";
import { clothingCategoryObject } from "../constants";
import { insertMakeImage } from "../mutations";
import { getClotheById, getMakeImageCount } from "../queries";

export const meta: Route.MetaFunction = ({ data }) => {
  return [
    {
      title: `${data?.cloth.name} | ${import.meta.env.VITE_APP_NAME} 가상 피팅`,
    },
    { name: "description", content: `${data?.cloth.name} 가상 피팅 해보기` },
  ];
};

const paramsSchema = z.object({ clothId: z.coerce.number() });

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);

  const { data: paramsData, success, error } = paramsSchema.safeParse(params);
  if (!success)
    throw data({ error: "유효하지 않은 clothId 입니다." }, { status: 400 });

  const cloth = await getClotheById(client, paramsData.clothId);

  return { cloth };
};

const formSchema = z.object({
  image: z.instanceof(File).superRefine((file, ctx) => {
    if (!file || file.size === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "사진을 업로드 해주세요.",
      });
    }
  }),
  clothImgUrl: z.string(),
  clothId: z.coerce.number(),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const [client] = makeServerClient(request);

  const {
    data: { user },
  } = await client.auth.getUser();

  const formData = await request.formData();

  const {
    data: validData,
    success,
    error,
  } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success)
    return data({ fieldErrors: error.flatten().fieldErrors }, { status: 400 });

  const imageBuffer = await fileToBase64(validData.image);

  const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

  const [clothRes, personRes] = await Promise.all([
    openai.responses.create({
      model: "gpt-4.1-nano",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Describe about the cloth. Output must be start with 'The cloth is' and just decribe about the cloth.",
            },
            {
              type: "input_image",
              image_url: validData.clothImgUrl,
              detail: "high",
            },
          ],
        },
      ],
    }),
    openai.responses.create({
      model: "gpt-4.1-nano",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Describe about the person. Output must be start with 'The person is' and just decribe about the person and background.",
            },
            {
              type: "input_image",
              image_url: `data:${validData.image.type};base64,${imageBuffer}`,
              detail: "high",
            },
          ],
        },
      ],
    }),
  ]);

  if (clothRes.error || personRes.error)
    return data(
      { error: clothRes.error?.message || personRes.error?.message },
      { status: 400 },
    );

  const replicate = new Replicate();

  const input = {
    prompt: `Me: ${personRes.output_text}
    Fitting cloth: ${clothRes.output_text}
    Make me wears the Fitting cloth. I want to take off my cloth and change the cloth to the garment. Keep everything same in my image except my cloth. Change my cloth only.`,
    aspect_ratio: "3:4",
    input_images: [
      `data:${validData.image.type};base64,${imageBuffer}`,
      validData.clothImgUrl,
    ],
  };

  const output = await replicate.run("flux-kontext-apps/multi-image-list", {
    input,
  });

  // const input = {
  //   part: "upper_body",
  //   image: `data:${validData.image.type};base64,${imageBuffer}`,
  //   garment: validData.clothImgUrl,
  // };

  // const output = await replicate.run(
  //   "subhash25rawat/flux-vton:a02643ce418c0e12bad371c4adbfaec0dd1cb34b034ef37650ef205f92ad6199",
  //   { input },
  // );

  const imageUrl = await streamToBase64(output as ReadableStream);

  if (user) {
    const resultImageBuffer = Buffer.from(imageUrl, "base64");
    const date = new Date().toISOString();
    const { error: uploadError } = await client.storage
      .from("result-image")
      .upload(`/${user.id}/${date}`, resultImageBuffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      return data({ error: uploadError.message }, { status: 400 });
    }

    const {
      data: { publicUrl },
    } = client.storage.from("result-image").getPublicUrl(`/${user.id}/${date}`);

    await insertMakeImage(client, {
      userId: user.id,
      clothId: validData.clothId,
      imageUrl: publicUrl,
    });
  }

  return { imageData: `data:img/png;base64,${imageUrl}` };
};

export default function Cloth({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { cloth } = loaderData;
  const navigation = useNavigation();

  const submitting = navigation.state === "submitting";

  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (submitting) window.open(cloth.shopping_url, "blank");
  }, [submitting]);

  useEffect(() => {
    if (actionData && "imageData" in actionData && actionData.imageData)
      setDialogOpen(true);
  }, [actionData]);

  return (
    <div className="space-y-10 px-5">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-bold md:text-2xl">🤖 AI 가상 피팅 체험</h1>
      </div>
      <Card className="mx-auto flex w-full items-center px-8">
        <div>
          <h3 className="text-muted-foreground text-sm md:text-base">
            {clothingCategoryObject[cloth.category]}
          </h3>
          <h3 className="text-center font-semibold md:text-lg">{cloth.name}</h3>
        </div>
        <Form method="POST" className="space-y-4" encType="multipart/form-data">
          <input type="hidden" name="clothId" defaultValue={cloth.cloth_id} />
          <input
            type="hidden"
            name="clothImgUrl"
            defaultValue={cloth.image_url}
          />
          <div className="gap-10 space-y-4 lg:flex lg:justify-center">
            <div className="space-y-1">
              <img
                src={cloth.image_url}
                alt={cloth.name}
                className="mx-auto w-full max-w-96 rounded border"
              />
              {cloth.shopping_url.startsWith("https://link.coupang.com/") && (
                <p className="text-muted-foreground max-w-96 text-xs">
                  "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
                  수수료를 제공받습니다."
                </p>
              )}
            </div>
            <div className="space-y-1">
              <ImageInput
                errors={
                  actionData &&
                  "fieldErrors" in actionData &&
                  actionData.fieldErrors.image
                    ? actionData.fieldErrors.image
                    : null
                }
              />
              <div className="bg-muted space-y-2 rounded p-2">
                <p className="max-w-96 text-xs">👤 인물 사진 촬영 가이드</p>
                <p className="ml-4 max-w-96 text-xs">
                  • 입고자 하는 상품에 따라 사진의 형태가 달라집니다.
                  <br /> (예시: 상의 - 상반신/전신, 하의 - 하반신/전신, 원피스 -
                  전신)
                </p>
                <p className="ml-4 max-w-96 text-xs">
                  • 인물 중심의 사진이 정확도가 높습니다.
                </p>
                <p className="ml-4 max-w-96 text-xs">
                  • 얼굴의 이목구비가 뚜렷하게 보일수록 인물 생성이 정확합니다.
                </p>
                <p className="ml-4 max-w-96 text-xs">
                  • 밝고 균일한 조명, 단순한 배경에서 촬영하면 정확도가
                  올라갑니다.
                </p>
                <p className="ml-4 max-w-96 text-xs">
                  • 흐릿하거나 픽셀이 깨진 저화질 사진은 사용을 권장하지
                  않습니다.
                </p>
              </div>
              <p className="mt-4 max-w-96 bg-yellow-300/30 p-2 text-xs">
                ⚠️ 본 이미지는 AI를 활용해 생성된 이미지로, 실제 인물이 해당
                의상을 착용한 모습과는 차이가 있을 수 있습니다. 착용 이미지는
                참고용으로만 사용해 주세요.
              </p>
              <p className="mt-4 max-w-96 bg-blue-300/30 p-2 text-xs">
                ⏰ 이미지 생성에 약 30초 소요됩니다.
              </p>
            </div>
          </div>
          {actionData && "imageData" in actionData && actionData.imageData && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>AI 가상 피팅 결과</DialogTitle>
                  <DialogDescription>
                    ⚠️ 본 이미지는 AI를 활용해 생성된 이미지로, 실제 인물이 해당
                    의상을 착용한 모습과는 차이가 있을 수 있습니다. 착용
                    이미지는 참고용으로만 사용해 주세요.
                  </DialogDescription>
                </DialogHeader>
                <img
                  className="mx-auto w-full max-w-96 rounded border"
                  src={actionData.imageData}
                  alt="결과 이미지"
                />
              </DialogContent>
            </Dialog>
          )}
          <div className="space-y-2 lg:self-end">
            {actionData && "error" in actionData && actionData.error ? (
              <FormErrors errors={[actionData.error]} />
            ) : null}
            <Button className="w-full" type="submit">
              {submitting ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                "상품 확인 및 AI 피팅"
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
