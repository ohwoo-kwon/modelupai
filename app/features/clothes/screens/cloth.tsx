import type { Route } from "./+types/cloth";

import OpenAI from "openai";
import { Form, Link, data } from "react-router";
import { z } from "zod";

import FormButton from "~/core/components/form-button";
import { Button } from "~/core/components/ui/button";
import { Card } from "~/core/components/ui/card";
import makeServerClient from "~/core/lib/supa-client.server";
import { fileToBase64 } from "~/core/lib/utils";

import ImageInput from "../components/image-input";
import { clothingCategoryObject } from "../constants";
import { getClotheById } from "../queries";

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
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();

  const {
    data: validData,
    success,
    error,
  } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success)
    return data({ fieldErrors: error.flatten().fieldErrors }, { status: 400 });

  // for (let i = 0; i < validData.image.length; i++) {
  //   const img = validData.image[i];
  //   const buffer = await fileToBase64(img);
  //   imageBuffers.push(`data:${img.type};base64,${buffer}`);
  // }

  // const types: { type: "input_image"; image_url: string; detail: "high" }[] =
  //   imageBuffers.map((v) => ({
  //     type: "input_image",
  //     image_url: v,
  //     detail: "high",
  //   }));

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
            text: `
            Act as a clothing stylist.
Replace only the outfit in the second image with the one from the first image.
Do not alter the model’s pose, face, body shape, expression, hairstyle, hands, or any background elements.

Overlay the clothing from the first image onto the person in the second image.
Keep the second image entirely unchanged except for the outfit. This includes pose, face, proportions, lighting, and background.

Negative Prompt (implicit):
Do not change the person's face, pose, body, hands, background, camera angle, or lighting.
This is not a recreation — just change the clothes.`,
          },
          {
            type: "input_image",
            image_url: validData.clothImgUrl,
            detail: "high",
          },
          // ...types,
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

  console.log(response.usage?.input_tokens);
  console.log(response.usage?.output_tokens);

  if (response.error)
    return data(
      { error: `${response.error.code}: ${response.error.message}` },
      { status: 400 },
    );

  const imageData = response.output
    .filter((output) => output.type === "image_generation_call")
    .map((output) => output.result);

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
          <input
            type="hidden"
            name="clothImgUrl"
            defaultValue={cloth.image_url}
          />
          <img
            src={cloth.image_url}
            alt={cloth.name}
            className="mx-auto w-full max-w-96 rounded border"
          />
          <ImageInput
            errors={
              actionData &&
              "fieldErrors" in actionData &&
              actionData.fieldErrors.image
                ? actionData.fieldErrors.image
                : null
            }
          />
          {actionData && "imageData" in actionData && actionData.imageData && (
            <img
              className="mx-auto max-w-96 rounded border"
              src={actionData.imageData}
              alt="결과 이미지"
            />
          )}
          <div className="space-y-2">
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
