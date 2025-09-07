import type { Route } from "./+types/photo-fitting";

import { GemIcon, Loader2Icon, UploadIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Form, data, redirect, useNavigation } from "react-router";
import Replicate from "replicate";
import { z } from "zod";

import FormErrors from "~/core/components/form-errors";
import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { Input } from "~/core/components/ui/input";
import { Label } from "~/core/components/ui/label";
import adminClient from "~/core/lib/supa-admin-client.server";
import makeServerClient from "~/core/lib/supa-client.server";
import {
  streamToBase64,
  uploadBase64ToStorage,
  uploadImageFileToStorage,
} from "~/core/lib/utils";
import { insertTransaction } from "~/features/billing/mutations";
import { insertFitting } from "~/features/fittings/mutations";
import { useDia } from "~/features/users/mutations";
import { getUserProfile } from "~/features/users/queries";

import { increaseFittings } from "../mutations";
import { getPhoto } from "../queries";

export const meta: Route.MetaFunction = ({ data }) => {
  const photo = data?.photo;

  if (!photo) {
    return [
      {
        title: `AI 가상 피팅 | ${import.meta.env.VITE_APP_NAME} 가상 피팅`,
      },
      {
        name: "description",
        content: "사진을 업로드하고 원하는 옷을 AI로 가상 피팅해보세요.",
      },
    ];
  }

  return [
    {
      title: `${photo.title} | ${import.meta.env.VITE_APP_NAME} 가상 피팅`,
    },
    {
      name: "description",
      content:
        "룩북과 내 사진으로 AI가 새로운 스타일을 입혀줍니다. 지금 가상 피팅을 체험해보세요!",
    },
    {
      name: "keywords",
      content: `AI 가상 피팅, 스타일링, 패션 코디, 룩북, 패션 AI, ${import.meta.env.VITE_APP_NAME}`,
    },
    {
      property: "og:title",
      content: `${photo.title} | ${import.meta.env.VITE_APP_NAME} 가상 피팅`,
    },
    {
      property: "og:description",
      content: "AI가 내 사진에 룩북 속 패션 아이템을 입혀주는 놀라운 체험!",
    },
    {
      property: "og:image",
      content: photo.image_url,
    },
  ];
};

const formSchema = z.object({
  lookbookUrl: z.string().min(1, "룩북이 존재하지 않습니다."),
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

export const action = async ({ request, params }: Route.ActionArgs) => {
  const [client] = makeServerClient(request);
  const { photoId } = params;
  const formData = await request.formData();

  const formDataValidation = formSchema.safeParse(Object.fromEntries(formData));

  if (!formDataValidation.success) {
    return data({
      fieldErrors: formDataValidation.error.flatten().fieldErrors,
      error: undefined,
      imageUrl: undefined,
    });
  }

  const { image, lookbookUrl } = formDataValidation.data;

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) return redirect("/login");

  // 다이아 소비
  const profile = await getUserProfile(client, { userId: user.id });
  if (!profile) return redirect("/login");
  const remainGem = profile.gem_balance || 0;
  if (remainGem < 10) return redirect("/billing/pricing");

  try {
    const imgUrl = await uploadImageFileToStorage(
      client,
      image,
      user.id,
      "fittings",
    );

    const replicate = new Replicate();

    const output = await replicate.run("google/nano-banana", {
      input: {
        prompt: `Take the input of:
1) A clear portrait or full-body photo of a person (subject image).
2) A lookbook image or collage of all desired fashion items (clothing, accessories, shoes, etc.).

Output:
A single, high-quality, realistic fashion photo of the same person, now wearing every item shown in the lookbook. 
Ensure:
- The model's face, body shape, pose, and lighting from the original portrait remain consistent.
- Each clothing piece and accessory is faithfully recreated and fitted to the subject's proportions.
- The final image looks like a professional fashion photoshoot, with natural shadows, correct fabric texture, and photo-realistic rendering.
- No duplication of items or extra artifacts.
- Style: editorial, clean, fashion magazine aesthetic.

Focus on photorealism, accurate layering of clothes, and a seamless integration of all items from the lookbook.
`,
        image_input: [imgUrl, lookbookUrl],
      },
    });
    const imageUrl = await streamToBase64(output as ReadableStream);

    const resultUrl = await uploadBase64ToStorage(
      client,
      `data:image/jpeg;base64,${imageUrl}`,
      user.id,
      "result-image",
    );

    const fittingData = await insertFitting(client, {
      profile_id: user.id,
      photo_id: photoId,
      user_photo_url: imgUrl,
      result_image_url: resultUrl,
      is_public: true,
    });

    await increaseFittings(client, photoId);

    // 다이아 소비
    await useDia(client, { profile_id: user.id, gem_balance: remainGem - 10 });

    // 다이아 거래 저장
    await insertTransaction(adminClient, {
      profile_id: user.id,
      type: "spend",
      amount: -10,
      balance_before: remainGem,
      balance_after: remainGem - 10,
      related_fitting_id: fittingData.fitting_id,
      related_photo_id: photoId,
    });

    return data({
      fieldErrors: undefined,
      error: undefined,
      imageUrl: resultUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    let message = "업로드 중 오류가 발생했습니다.";
    if (error instanceof Error) {
      message = error.message;
    }
    return data(
      {
        fieldErrors: undefined,
        error: message,
        imageUrl: undefined,
      },
      { status: 500 },
    );
  }
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const photoId = params.photoId;
  const [client] = makeServerClient(request);

  const photo = await getPhoto(client, photoId);

  return { photo };
};

export default function PhotoFitting({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { photo } = loaderData;
  const navigation = useNavigation();

  const submitting = navigation.state === "submitting";

  const [preview, setPreview] = useState<string | null>(null);

  const imgInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full px-4">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
            AI 가상 피팅
          </h1>
          <h3>사진을 업로드하고 원하는 옷을 AI 가상 피팅해보세요.</h3>
        </div>
        <Form method="post" encType="multipart/form-data" className="space-y-2">
          {actionData?.fieldErrors && actionData.fieldErrors.lookbookUrl && (
            <FormErrors errors={actionData.fieldErrors.lookbookUrl} />
          )}
          <div className="grid grid-cols-2 gap-2">
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
            <Input
              type="hidden"
              name="lookbookUrl"
              defaultValue={photo.lookbook_url}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>내 사진 업로드</CardTitle>
              <CardDescription>
                {actionData?.fieldErrors && actionData.fieldErrors.image && (
                  <FormErrors errors={actionData.fieldErrors.image} />
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {preview ? (
                  <Label htmlFor="image" className="cursor-pointer">
                    <img
                      src={preview}
                      alt="Preview"
                      className="mx-auto aspect-square w-full rounded-lg object-contain shadow-md"
                    />
                  </Label>
                ) : (
                  <div className="aspect-square rounded-lg border-2 border-dashed border-slate-300 p-1 transition-colors hover:border-slate-400">
                    <Label
                      htmlFor="image"
                      className="flex h-full cursor-pointer flex-col items-center justify-center gap-4"
                    >
                      <UploadIcon className="text-primary mx-auto h-12 w-12" />
                      <span className="text-primary font-medium">
                        클릭하여 이미지 선택
                      </span>
                      <p className="text-muted-foreground text-sm">
                        PNG, JPG, GIF (최대 5MB)
                      </p>
                    </Label>
                  </div>
                )}
                <Input
                  ref={imgInputRef}
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
          <Button className="relative w-full" disabled={!preview || submitting}>
            {submitting ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <>
                <p className="absolute top-2 left-10 flex items-center gap-1">
                  <GemIcon />
                  10
                </p>
                <span>AI 피팅</span>
              </>
            )}
          </Button>
          {actionData && actionData.error && (
            <FormErrors errors={[actionData.error]} />
          )}
        </Form>
        {/* @ts-ignore */}
        {actionData && actionData.imageUrl ? (
          <div>
            {/* @ts-ignore */}
            <img src={actionData.imageUrl} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
