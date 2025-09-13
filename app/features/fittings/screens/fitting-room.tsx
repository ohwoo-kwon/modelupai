import type { Route } from "./+types/fitting-room";

import { GemIcon, Loader2Icon, UploadIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Form, data, redirect, useNavigation } from "react-router";
import Replicate from "replicate";
import z from "zod";

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
import ResultImageDrawer from "~/features/photos/components/result-image-drawer";
import { useDia } from "~/features/users/mutations";
import { getUserProfile } from "~/features/users/queries";

import { insertFitting } from "../mutations";

const formSchema = z.object({
  clothImage: z
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
  const formData = await request.formData();

  const formDataValidation = formSchema.safeParse(Object.fromEntries(formData));

  if (!formDataValidation.success) {
    return data({
      fieldErrors: formDataValidation.error.flatten().fieldErrors,
      error: undefined,
      imageUrl: undefined,
      fittingId: undefined,
    });
  }

  const { image, clothImage } = formDataValidation.data;

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

    const clothImgUrl = await uploadImageFileToStorage(
      client,
      clothImage,
      user.id,
      "clothes",
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
        image_input: [imgUrl, clothImgUrl],
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
      cloth_photo_url: clothImgUrl,
      user_photo_url: imgUrl,
      result_image_url: resultUrl,
      is_public: false,
    });

    // // 다이아 소비
    await useDia(client, { profile_id: user.id, gem_balance: remainGem - 10 });

    // // 다이아 거래 저장
    await insertTransaction(adminClient, {
      profile_id: user.id,
      type: "spend",
      amount: -10,
      balance_before: remainGem,
      balance_after: remainGem - 10,
      related_fitting_id: fittingData.fitting_id,
    });

    return data({
      fieldErrors: undefined,
      error: undefined,
      imageUrl: resultUrl,
      fittingId: fittingData.fitting_id,
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
        fittingId: undefined,
      },
      { status: 500 },
    );
  }
};

export default function FittingRoom({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();

  const submitting = navigation.state === "submitting";

  const [clothPreview, setClothPreview] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const clothImgInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  const handleClothImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setClothPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
            AI 피팅
          </h1>
          <h3>사진을 업로드하고 원하는 옷을 AI 피팅해보세요.</h3>
        </div>
        <Form method="post" encType="multipart/form-data" className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle>옷 사진 업로드</CardTitle>
              <CardDescription>
                {actionData?.fieldErrors &&
                  actionData.fieldErrors.clothImage && (
                    <FormErrors errors={actionData.fieldErrors.clothImage} />
                  )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {clothPreview ? (
                  <Label htmlFor="clothImage" className="cursor-pointer">
                    <img
                      src={clothPreview}
                      alt="cloth-preview"
                      className="mx-auto aspect-square w-full rounded-lg object-contain shadow-md"
                    />
                  </Label>
                ) : (
                  <div className="aspect-square rounded-lg border-2 border-dashed border-slate-300 p-1 transition-colors hover:border-slate-400">
                    <Label
                      htmlFor="clothImage"
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
                  ref={clothImgInputRef}
                  id="clothImage"
                  name="clothImage"
                  type="file"
                  accept="image/*"
                  onChange={handleClothImageChange}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
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
        <ResultImageDrawer
          fittingId={actionData?.fittingId || ""}
          imgUrl={actionData?.imageUrl}
          submitting={submitting}
        />
      </div>
    </div>
  );
}
