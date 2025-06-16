import type { Route } from "./+types/cloth";

import { DateTime } from "luxon";
import OpenAI from "openai";
import { Form, Link, data } from "react-router";
import { z } from "zod";

import FormButton from "~/core/components/form-button";
import FormErrors from "~/core/components/form-errors";
import { Button } from "~/core/components/ui/button";
import { Card } from "~/core/components/ui/card";
import makeServerClient from "~/core/lib/supa-client.server";
import { fileToBase64 } from "~/core/lib/utils";

import ImageInput from "../components/image-input";
import { clothingCategoryObject } from "../constants";
import { insertMakeImage } from "../mutations";
import { getClotheById, getMakeImageCount } from "../queries";

export const meta: Route.MetaFunction = ({ data }) => {
  return [
    { title: `${data?.cloth.name} | ${import.meta.env.VITE_APP_NAME}` },
    { name: "description", content: data?.cloth.name },
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
  image: z.instanceof(File),
  clothImgUrl: z.string(),
  clothId: z.coerce.number(),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const [client] = makeServerClient(request);

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    throw data(null, { status: 401 });
  }

  const formData = await request.formData();

  const {
    data: validData,
    success,
    error,
  } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success)
    return data({ fieldErrors: error.flatten().fieldErrors }, { status: 400 });

  const startDate = DateTime.now().startOf("day").toISO();
  const endDate = DateTime.now().endOf("day").toISO();

  const makeImageCount = await getMakeImageCount(client, {
    profileId: user.id,
    startDate,
    endDate,
  });
  if (makeImageCount && makeImageCount > 2) {
    return data({ error: "일일 사용 제한을 초과했습니다" }, { status: 400 });
  }

  const imageBuffer = await fileToBase64(validData.image);

  const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY || "",
    baseURL: "https://api.openai.com/v1",
  });

  const response = await openai.responses.create({
    model: "gpt-4.1",
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: "Replace the outfit of the model in the photo with a new outfit.",
            //             `Keep the person's original face and body shape exactly the same. Change only the clothes. Do not alter the skin tone, facial structure, or proportions

            // Clothing Reference (First Image): Use this outfit as-is, including fabric, design, color, texture, and fit.
            // Model Reference (Second Image): DO NOT change the model’s pose, face, lighting, body shape, background, or proportions. Only modify the outfit.

            // Overlay the clothing from the first image onto the model in the second image as if the person is realistically wearing it.

            // Positive Prompt:
            // A realistic, high-quality photo of the model wearing the exact clothes from the first image. The clothing is naturally fitted to the model’s body. Details such as fabric folds, textures, color accuracy, and pattern alignment are preserved. The lighting, shadows, and angles match the original model photo to ensure seamless integration.

            // Negative Prompt:
            // blurry, poorly fitted clothes, wrong outfit, incorrect fabric, low-resolution textures, mismatched colors, deformed limbs, distorted face, added or missing body parts, unnatural pose, inconsistent lighting, unrealistic blending, bad anatomy, outfit artifacts.`,
          },
          {
            type: "input_image",
            image_url: validData.clothImgUrl,
            detail: "high",
          },
          {
            type: "input_image",
            image_url: `data:${validData.image.type};base64,${imageBuffer}`,
            detail: "high",
          },
        ],
      },
    ],
    tools: [
      {
        type: "image_generation",
        quality: "high",
        model: "gpt-image-1",
        size: "1024x1536",
        output_format: "png",
      },
    ],
  });

  // console.log(response.usage?.input_tokens);
  // console.log(response.usage?.output_tokens);

  if (response.error)
    return data(
      { error: `${response.error.code}: ${response.error.message}` },
      { status: 400 },
    );

  const imageData = response.output
    .filter((output) => output.type === "image_generation_call")
    .map((output) => output.result);

  const imageBase64 = imageData[0];
  if (!imageBase64)
    return data(
      { error: "이미지 생성에 실패했습니다. 잠시 후 다시 시도해주세요." },
      { status: 400 },
    );

  const resultImageBuffer = Buffer.from(imageBase64, "base64");

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

  return { imageData: `data:image/png;base64,${imageData[0]}` };
};

export default function Cloth({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { cloth } = loaderData;
  return (
    <div className="space-y-10 px-5">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-bold md:text-2xl">{cloth.name}</h1>
        <h3 className="text-center md:text-lg">
          {clothingCategoryObject[cloth.category]}
        </h3>
      </div>
      <Card className="mx-auto w-fit max-w-screen-md px-8">
        <Form method="POST" className="space-y-4" encType="multipart/form-data">
          <input type="hidden" name="clothId" defaultValue={cloth.cloth_id} />
          <input
            type="hidden"
            name="clothImgUrl"
            defaultValue={cloth.image_url}
          />
          <div className="space-y-1">
            <h5 className="font-bold">옷 사진</h5>
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
            <h5 className="font-bold">내 사진</h5>
            <ImageInput
              errors={
                actionData &&
                "fieldErrors" in actionData &&
                actionData.fieldErrors.image
                  ? actionData.fieldErrors.image
                  : null
              }
            />
            <p className="text-muted-foreground max-w-96 text-xs">
              👤 인물 사진 촬영 가이드
            </p>
            <p className="text-muted-foreground ml-4 max-w-96 text-xs">
              • 정면을 바라보는 상반신 사진이 가장 이상적입니다.
            </p>
            <p className="text-muted-foreground ml-4 max-w-96 text-xs">
              • 얼굴의 이목구비가 뚜렷하게 보일수록 인물 생성이 정확합니다.
            </p>
            <p className="text-muted-foreground ml-4 max-w-96 text-xs">
              • 어깨부터 머리까지 잘리는 부분 없이 전체가 보이도록 촬영해
              주세요.
            </p>
            <p className="text-muted-foreground ml-4 max-w-96 text-xs">
              • 밝고 균일한 조명, 단순한 배경에서 촬영하면 정확도가 올라갑니다.
            </p>
            <p className="text-muted-foreground ml-4 max-w-96 text-xs">
              • 흐릿하거나 픽셀이 깨진 저화질 사진은 사용을 권장하지 않습니다.
            </p>
            <p className="text-muted-foreground mt-4 max-w-96 text-xs">
              ⚠️ 본 이미지는 AI를 활용해 생성된 합성 이미지로, 실제 인물이 해당
              의상을 착용한 모습과는 차이가 있을 수 있습니다. 착용 이미지는
              참고용으로만 사용해 주세요.
            </p>
            <p className="text-muted-foreground mt-4 max-w-96 text-xs">
              ⏰ 이미지 생성에 약 1분이 소요됩니다.
            </p>
          </div>
          {actionData && "imageData" in actionData && actionData.imageData && (
            <div className="space-y-1">
              <h5 className="font-bold">결과</h5>
              <img
                className="mx-auto max-w-96 rounded border"
                src={actionData.imageData}
                alt="결과 이미지"
              />
            </div>
          )}
          <div className="space-y-2">
            {actionData && "error" in actionData && actionData.error ? (
              <FormErrors errors={[actionData.error]} />
            ) : null}
            <FormButton label="입어보기" className="w-full" />
            <Button className="w-full" variant="secondary">
              <Link className="w-full" to={cloth.shopping_url} target="_blank">
                구매하러 가기
              </Link>
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
