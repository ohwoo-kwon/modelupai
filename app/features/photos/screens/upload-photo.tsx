import type { SupabaseClient } from "@supabase/supabase-js";

import type { Route } from "./+types/upload-photo";

import { ImageIcon, UploadIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Form, data, redirect, useNavigation } from "react-router";
import { z } from "zod";

import FormErrors from "~/core/components/form-errors";
import FormSuccess from "~/core/components/form-success";
import { Badge } from "~/core/components/ui/badge";
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
import { Textarea } from "~/core/components/ui/textarea";
import makeServerClient from "~/core/lib/supa-client.server";

import { createPhoto } from "../mutations";

export const meta: Route.MetaFunction = () => {
  return [
    { title: `사진 업로드 | ${import.meta.env.VITE_APP_NAME} 가상 피팅` },
    {
      name: "description",
      content:
        "당신의 패션 아이템을 업로드하고 AI 가상 피팅을 통해 다른 사용자들과 공유하세요. 당신의 패션으로 가상 피팅이 이루어질 때마다 수익을 얻을 수 있습니다.",
    },

    // Open Graph tags
    {
      property: "og:title",
      content: `AI 가상 피팅으로 패션 아이템 공유하고 수익 창출하기 | ${import.meta.env.VITE_APP_NAME} 가상 피팅`,
    },
    {
      property: "og:description",
      content:
        "당신의 패션을 업로드하고 AI 가상 피팅 기술로 다른 사용자들이 입어볼 수 있게 하세요. 당신의 패션을 피팅할 때마다 수익이 발생합니다!",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://fitmeai.store/upload-photo" },
    { property: "og:image", content: "" },
    {
      property: "og:image:alt",
      content: `${import.meta.env.VITE_APP_NAME} 가상 피팅 사진 업로드 페이지`,
    },
    { property: "og:locale", content: "ko_KR" },
    { property: "og:site_name", content: import.meta.env.VITE_APP_NAME },

    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: `AI 가상 피팅으로 패션 아이템 공유하고 수익 창출하기 | ${import.meta.env.VITE_APP_NAME} 가상 피팅`,
    },
    {
      name: "twitter:description",
      content:
        "당신의 패션을 업로드하고 AI 가상 피팅 기술로 다른 사용자들이 입어볼 수 있게 하세요. 당신의 패션을 피팅할 때마다 수익이 발생합니다!",
    },
    { name: "twitter:image", content: "" },
    {
      name: "twitter:image:alt",
      content: `${import.meta.env.VITE_APP_NAME} 가상 피팅 사진 업로드 페이지`,
    },

    {
      name: "keywords",
      content:
        "AI 가상 피팅, 패션 아이템 업로드, 가상 착용, 패션 수익, AI 패션, 버추얼 피팅, 옷 입어보기, 패션 공유, 디지털 패션, AI 착용",
    },
    { name: "author", content: import.meta.env.VITE_APP_NAME },
    { name: "robots", content: "noindex, nofollow" },

    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "theme-color", content: "#8e51ff" },

    { name: "format-detection", content: "telephone=no" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "default" },

    { name: "monetization", content: "virtual-fitting-revenue" },
    { name: "category", content: "Fashion Technology" },

    { name: "product-type", content: "fashion-ai-platform" },
    { name: "revenue-model", content: "per-fitting-commission" },
    {
      name: "apple-mobile-web-app-title",
      content: `${import.meta.env.VITE_APP_NAME} 업로드`,
    },

    { "http-equiv": "X-Content-Type-Options", content: "nosniff" },
  ];
};

async function uploadImageToStorage(
  client: SupabaseClient,
  file: File,
  userId: string,
): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const arrayBuffer = await file.arrayBuffer();

  const { data, error } = await client.storage
    .from("photos")
    .upload(fileName, arrayBuffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Storage upload error:", error);
    throw new Error(`이미지 업로드에 실패했습니다: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = client.storage.from("photos").getPublicUrl(data.path);

  return publicUrl;
}

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
  title: z
    .string()
    .min(1, "제목을 입력해주세요.")
    .max(200, "제목은 200자 이하로 입력해주세요.")
    .trim(),
  description: z
    .string()
    .optional()
    .transform((val) => val?.trim() || null),
  tags: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
        : [],
    )
    .refine(
      (tags) => tags.length <= 20,
      "태그는 최대 20개까지 입력할 수 있습니다.",
    )
    .refine(
      (tags) => tags.every((tag) => tag.length <= 50),
      "각 태그는 50자 이하로 입력해주세요.",
    ),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const [client] = makeServerClient(request);
  const formData = await request.formData();

  try {
    const formDataValidation = formSchema.safeParse(
      Object.fromEntries(formData),
    );

    if (!formDataValidation.success) {
      return data({
        fieldErrors: formDataValidation.error.flatten().fieldErrors,
        error: undefined,
      });
    }

    const { image, title, description, tags } = formDataValidation.data;
    const {
      data: { user },
    } = await client.auth.getUser();

    if (!user) return redirect("/login");

    const imgUrl = await uploadImageToStorage(client, image, user.id);

    await createPhoto(client, {
      profile_id: user.id,
      image_url: imgUrl,
      title,
      description,
      tags,
    });

    return redirect("/photos/explore");
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
      },
      { status: 500 },
    );
  }
};

export default function UploadPhoto({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const [preview, setPreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const imgInputRef = useRef<HTMLInputElement>(null);

  const isSubmitting = navigation.state === "submitting";

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

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-slate-900">
            패션 업로드
          </h1>
          <p className="text-slate-600">
            당신의 패션을 업로드하고 AI 가상 피팅을 통해 다른 사용자들과
            공유하세요.
          </p>
        </div>

        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              사진 정보
            </CardTitle>
            <CardDescription>
              업로드할 사진의 정보를 입력해주세요
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form
              method="post"
              encType="multipart/form-data"
              className="space-y-6"
            >
              {/* Image Upload Section */}
              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm font-medium">
                  이미지 <span className="text-red-500">*</span>
                </Label>
                {actionData?.fieldErrors && actionData.fieldErrors.image && (
                  <FormErrors errors={actionData.fieldErrors.image} />
                )}
                <div className="aspect-square rounded-lg border-2 border-dashed border-slate-300 p-1 transition-colors hover:border-slate-400">
                  {preview ? (
                    <div className="space-y-4 text-center">
                      <img
                        src={preview}
                        alt="Preview"
                        className="mx-auto aspect-square w-full rounded-lg object-contain shadow-md"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="text-sm"
                        onClick={() => {
                          setPreview(null);
                          imgInputRef.current?.click();
                        }}
                      >
                        이미지 변경
                      </Button>
                    </div>
                  ) : (
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
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  제목 <span className="text-red-500">*</span>
                </Label>
                {actionData?.fieldErrors && actionData.fieldErrors.title && (
                  <FormErrors errors={actionData.fieldErrors.title} />
                )}
                <Input
                  id="title"
                  name="title"
                  placeholder="사진 제목을 입력하세요"
                  maxLength={200}
                  required
                  className="border-slate-300"
                />
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  설명
                </Label>
                {actionData?.fieldErrors &&
                  actionData.fieldErrors.description && (
                    <FormErrors errors={actionData.fieldErrors.description} />
                  )}
                <Textarea
                  id="description"
                  name="description"
                  placeholder="사진에 대한 설명을 입력하세요 (선택사항)"
                  rows={4}
                  className="resize-none border-slate-300"
                />
              </div>

              {/* Tags Input */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">태그</Label>
                {actionData?.fieldErrors && actionData.fieldErrors.tags && (
                  <FormErrors errors={actionData.fieldErrors.tags} />
                )}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      placeholder="태그를 입력하고 , 혹은 Enter를 누르세요"
                      className="border-slate-300"
                      maxLength={50}
                    />
                    {/* <Button
                      type="button"
                      variant="outline"
                      onClick={addTag}
                      disabled={!tagInput.trim()}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button> */}
                  </div>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <Badge key={index}>
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTag(tag)}
                            className="h-auto p-0! hover:bg-transparent hover:text-slate-300"
                          >
                            <XIcon className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hidden input for tags */}
                <input type="hidden" name="tags" value={tags.join(",")} />
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    업로드 중...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UploadIcon className="h-4 w-4" />
                    사진 업로드
                  </div>
                )}
              </Button>
              {actionData?.error && actionData.error && (
                <FormErrors errors={[actionData.error]} />
              )}
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
