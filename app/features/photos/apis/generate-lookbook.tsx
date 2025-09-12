import type { Route } from "./+types/generate-lookbook";

import { data } from "react-router";
import Replicate from "replicate";
import z from "zod";

import { requireAuthentication, requireMethod } from "~/core/lib/guards.server";
import makeServerClient from "~/core/lib/supa-client.server";
import { fileToBase64, streamToBase64 } from "~/core/lib/utils";

const formSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, "이미지를 선택해주세요.")
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "이미지 크기는 10MB 이하여야 합니다.",
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          file.type,
        ),
      "지원되는 이미지 형식: JPEG, PNG, GIF, WebP",
    ),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const [client] = makeServerClient(request);

  await requireAuthentication(client);
  requireMethod("POST")(request);

  const formData = await request.formData();

  try {
    const formDataValidation = formSchema.safeParse(
      Object.fromEntries(formData),
    );

    if (!formDataValidation.success) {
      return data({
        error: formDataValidation.error.flatten().fieldErrors.image,
        imgUrl: undefined,
      });
    }

    const { image } = formDataValidation.data;

    const imageBuffer = await fileToBase64(image);
    const base64Image = `data:${image.type};base64,${imageBuffer}`;

    const replicate = new Replicate();

    const output = await replicate.run("google/nano-banana", {
      input: {
        prompt: `Analyze the given photo of a person and detect every visible fashion item they are wearing (e.g., tops, bottoms, shoes, accessories). 
Extract clear product-like images of each item on a plain white background. 
Arrange these items in a clean, minimalistic fashion lookbook layout without labels for each item. 
High-resolution, editorial photography style, soft studio lighting, modern fashion magazine aesthetic.
`,
        image_input: [base64Image],
      },
    });
    const imageUrl = await streamToBase64(output as ReadableStream);

    return data({
      error: undefined,
      imageUrl: `data:image/jpeg;base64,${imageUrl}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    let message = "룩북 제작 중 오류가 발생했습니다.";
    if (error instanceof Error) {
      message = error.message;
    }
    return data(
      {
        error: [message],
        imgUrl: undefined,
      },
      { status: 500 },
    );
  }
};
