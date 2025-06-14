import type { Route } from "./+types/model-create";

import OpenAI from "openai";
import { Form, data, redirect } from "react-router";
import { z } from "zod";

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
import { Switch } from "~/core/components/ui/switch";
import { Textarea } from "~/core/components/ui/textarea";
import makeServerClient from "~/core/lib/supa-client.server";

import {
  bodyTypeObject,
  genderObject,
  raceObject,
  styleObject,
} from "../\bconstants";
import { insertModel } from "../mutations";
import {
  ageRangeEnum,
  bodyTypeEnum,
  genderEnum,
  raceEnum,
  styleEnum,
} from "../schema";

export const meta: Route.MetaFunction = () => {
  return [{ title: `모델 생성 | ${import.meta.env.VITE_APP_NAME}` }];
};

const formSchema = z.object({
  referenceModelId: z.coerce.number().optional(),
  name: z
    .string()
    .min(1, "모델명을 작성해주세요.")
    .max(20, "20자 이하로 작성해주세요."),
  description: z.string(),
  gender: z.enum(genderEnum.enumValues),
  ageRange: z.enum(ageRangeEnum.enumValues),
  bodyType: z.enum(bodyTypeEnum.enumValues),
  race: z.enum(raceEnum.enumValues),
  style: z.enum(styleEnum.enumValues),
  prompt: z.string(),
  isPublic: z.coerce.boolean(),
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

  // gpt-image-1 으로 모델 이미지 생성
  const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY || "",
    baseURL: "https://api.openai.com/v1",
  });

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: `Pretty and handsome shopping mall model. A race of the model is ${validData.race}. ${validData.gender} model in ${validData.ageRange}, with a ${validData.bodyType} build, wearing ${validData.style} fashion. Additional prompt for model: ${validData.prompt}.Photographed for an online fashion store. He is standing or posing naturally as if modeling clothing for a product detail page or lookbook. Clean background, high-resolution, photo-realistic style. You need to make model always pretty and handsome.`,
    tools: [{ type: "image_generation", size: "1024x1536", quality: "low" }],
  });

  if (response.error)
    return data(
      { error: `${response.error.code}: ${response.error.message}` },
      { status: 400 },
    );

  // 모델 이미지 storage 에 저장
  const imageData = response.output
    .filter((output) => output.type === "image_generation_call")
    .map((output) => output.result);

  if (imageData.length > 0) {
    const imageBase64 = imageData[0];
    if (!imageBase64)
      return data(
        { error: "이미지 생성에 실패했습니다. 잠시 후 다시 시도해주세요." },
        { status: 400 },
      );
    const imageBuffer = Buffer.from(imageBase64, "base64");

    const date = new Date().toISOString();
    const { error: uploadError } = await client.storage
      .from("models")
      .upload(`/${user.id}/${date}`, imageBuffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      return data({ error: uploadError.message }, { status: 400 });
    }

    const {
      data: { publicUrl },
    } = client.storage.from("models").getPublicUrl(`/${user.id}/${date}`);

    await insertModel(client, {
      userId: user.id,
      ...validData,
      imageUrl: publicUrl,
    });
    return redirect("/models");
  } else
    return data(
      { error: "이미지 생성에 실패했습니다. 잠시 후 다시 시도해주세요." },
      { status: 400 },
    );
};

export default function ModelCreate({ actionData }: Route.ComponentProps) {
  return (
    <div className="space-y-10 px-5">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-bold md:text-2xl">모델 생성</h1>
        <h3 className="md:text-lg">원하는 스타일의 모델을 만들어보세요.</h3>
      </div>
      <Card className="mx-auto max-w-screen-md px-8">
        <Form className="w-full space-y-16" method="POST">
          {/* <div className="hidden space-y-1">
            <Label htmlFor="referenceModelId">참고 모델ID</Label>
            <Input id="referenceModelId" name="referenceModelId" />
          </div> */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">모델명</Label>
              <Input id="name" name="name" />
              {actionData &&
              "fieldErrors" in actionData &&
              actionData.fieldErrors?.name ? (
                <FormErrors errors={actionData.fieldErrors.name} />
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">설명(선택)</Label>
              <Textarea
                className="h-28 resize-none"
                id="description"
                name="description"
              />
              {actionData &&
              "fieldErrors" in actionData &&
              actionData.fieldErrors?.description ? (
                <FormErrors errors={actionData.fieldErrors.description} />
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">성별</Label>
              <Select name="gender" defaultValue={genderEnum.enumValues[1]}>
                <SelectTrigger id="gender" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {genderEnum.enumValues.map((value) => (
                    <SelectItem key={`gender_${value}`} value={value}>
                      {genderObject[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {actionData &&
              "fieldErrors" in actionData &&
              actionData.fieldErrors?.gender ? (
                <FormErrors errors={actionData.fieldErrors.gender} />
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ageRange">나이</Label>
              <Select name="ageRange" defaultValue={ageRangeEnum.enumValues[4]}>
                <SelectTrigger id="ageRange" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ageRangeEnum.enumValues.map((value) => (
                    <SelectItem key={`age_range_${value}`} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {actionData &&
              "fieldErrors" in actionData &&
              actionData.fieldErrors?.ageRange ? (
                <FormErrors errors={actionData.fieldErrors.ageRange} />
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bodyType">체형</Label>
              <Select name="bodyType" defaultValue={bodyTypeEnum.enumValues[1]}>
                <SelectTrigger id="bodyType" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bodyTypeEnum.enumValues.map((value) => (
                    <SelectItem key={`body_type_${value}`} value={value}>
                      {bodyTypeObject[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {actionData &&
              "fieldErrors" in actionData &&
              actionData.fieldErrors?.bodyType ? (
                <FormErrors errors={actionData.fieldErrors.bodyType} />
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="race">인종</Label>
              <Select name="race" defaultValue={raceEnum.enumValues[0]}>
                <SelectTrigger id="race" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {raceEnum.enumValues.map((value) => (
                    <SelectItem key={`race_${value}`} value={value}>
                      {raceObject[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {actionData &&
              "fieldErrors" in actionData &&
              actionData.fieldErrors?.race ? (
                <FormErrors errors={actionData.fieldErrors.race} />
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="style">스타일</Label>
              <Select name="style" defaultValue={styleEnum.enumValues[0]}>
                <SelectTrigger id="style" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {styleEnum.enumValues.map((value) => (
                    <SelectItem key={`style_${value}`} value={value}>
                      {styleObject[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {actionData &&
              "fieldErrors" in actionData &&
              actionData.fieldErrors?.style ? (
                <FormErrors errors={actionData.fieldErrors.style} />
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="prompt">추가 정보(선택)</Label>
              <Textarea
                className="h-28 resize-none"
                id="prompt"
                name="prompt"
                placeholder="예시) 키는 180cm, 인사동 카페거리에서 걷는 모습, 전신 사진"
              />
              {actionData &&
              "fieldErrors" in actionData &&
              actionData.fieldErrors?.prompt ? (
                <FormErrors errors={actionData.fieldErrors.prompt} />
              ) : null}
            </div>
            <div className="flex gap-2">
              <Label htmlFor="isPublic">공개여부</Label>
              <Switch id="isPublic" name="isPublic" defaultChecked={true} />
              {actionData &&
              "fieldErrors" in actionData &&
              actionData.fieldErrors?.isPublic ? (
                <FormErrors errors={actionData.fieldErrors.isPublic} />
              ) : null}
            </div>
          </div>
          <FormButton label="모델 생성" className="w-full" />
          {actionData && "error" in actionData && actionData.error ? (
            <FormErrors errors={[actionData.error]} />
          ) : null}
        </Form>
      </Card>
    </div>
  );
}
