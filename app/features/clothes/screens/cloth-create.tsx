import type { Route } from "./+types/cloth-create";

import { Form, data, redirect } from "react-router";
import z from "zod";

import FormButton from "~/core/components/form-button";
import FormErrors from "~/core/components/form-errors";
import { Card } from "~/core/components/ui/card";
import { Input } from "~/core/components/ui/input";
import { Label } from "~/core/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/core/components/ui/select";
import makeServerClient from "~/core/lib/supa-client.server";

import ImageInput from "../components/image-input";
import { clothingCategoryObject } from "../constants";
import { insertCloth } from "../mutations";
import { clothingCategoryEnum } from "../schema";

export const meta: Route.MetaFunction = () => {
  return [{ title: `옷 추가 | ${import.meta.env.VITE_APP_NAME}` }];
};

const formSchema = z.object({
  image: z.instanceof(File),
  name: z
    .string()
    .min(1, "상품명을 작성해주세요.")
    .max(100, "100자 이하로 작성해주세요."),
  category: z.enum(clothingCategoryEnum.enumValues),
  shopping_url: z.string().min(1, "상품링크를 작성해주세요."),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const [client] = makeServerClient(request);

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return data(null, { status: 401 });
  }

  const formData = await request.formData();
  const {
    data: validData,
    success,
    error,
  } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success) {
    return data({ fieldErrors: error.flatten().fieldErrors }, { status: 400 });
  }

  // 상품 이미지 storage 에 저장
  let clothImageUrl = "";
  if (
    validData.image &&
    validData.image instanceof File &&
    validData.image.size > 0 &&
    validData.image.size < 1024 * 1024 &&
    validData.image.type.startsWith("image/")
  ) {
    const date = new Date().toISOString();
    const { error: uploadError } = await client.storage
      .from("clothes")
      .upload(`/${user.id}/${date}`, validData.image, {
        upsert: true,
      });

    if (uploadError) {
      return data({ error: uploadError.message }, { status: 400 });
    }

    const {
      data: { publicUrl },
    } = client.storage.from("clothes").getPublicUrl(`/${user.id}/${date}`);
    clothImageUrl = publicUrl;
  }

  // 상품 테이블에 저장
  await insertCloth(client, {
    userId: user.id,
    name: validData.name,
    category: validData.category,
    shoppingUrl: validData.shopping_url,
    imageUrl: clothImageUrl,
  });

  return redirect("/clothes");
};

export default function ClothCreate({ actionData }: Route.ComponentProps) {
  return (
    <div className="space-y-10 px-5">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-bold md:text-2xl">옷 추가</h1>
        <h3 className="md:text-lg">피팅해보고 싶은 옷을 추가해보세요.</h3>
      </div>
      <Card className="mx-auto max-w-screen-md px-8">
        <Form
          className="w-full space-y-16"
          method="POST"
          encType="multipart/form-data"
        >
          <div className="space-y-4">
            <ImageInput
              errors={
                actionData &&
                "fieldErrors" in actionData &&
                actionData.fieldErrors.image
                  ? actionData.fieldErrors.image
                  : null
              }
            />
            <div className="space-y-2">
              <Label htmlFor="name">상품명</Label>
              <Input id="name" name="name" />
              {actionData &&
              "fieldErrors" in actionData &&
              actionData.fieldErrors?.name ? (
                <FormErrors errors={actionData.fieldErrors.name} />
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select
                name="category"
                defaultValue={clothingCategoryEnum.enumValues[0]}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {clothingCategoryEnum.enumValues.map((value) => (
                    <SelectItem
                      key={`clothing_category_${value}`}
                      value={value}
                    >
                      {clothingCategoryObject[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {actionData &&
              "fieldErrors" in actionData &&
              actionData.fieldErrors?.category ? (
                <FormErrors errors={actionData.fieldErrors.category} />
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="shopping_url">상품 링크</Label>
              <Input
                id="shopping_url"
                name="shopping_url"
                placeholder="상품 설명 링크 혹은 구매 링크를 작성해주세요."
              />
              {actionData &&
              "fieldErrors" in actionData &&
              actionData.fieldErrors?.shopping_url ? (
                <FormErrors errors={actionData.fieldErrors.shopping_url} />
              ) : null}
            </div>
          </div>
          <div className="space-y-2">
            <FormButton label="옷 추가" className="w-full" />
            {actionData && "error" in actionData && actionData.error ? (
              <FormErrors errors={[actionData.error]} />
            ) : null}
          </div>
        </Form>
      </Card>
    </div>
  );
}
