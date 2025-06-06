import type { Route } from "./+types/join";

import { CheckCircle2Icon } from "lucide-react";
import { useEffect, useRef } from "react";
import { Form, data } from "react-router";
import { z } from "zod";

import FormButton from "~/core/components/form-button";
import FormErrors from "~/core/components/form-errors";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/core/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { Checkbox } from "~/core/components/ui/checkbox";
import { Input } from "~/core/components/ui/input";
import { Label } from "~/core/components/ui/label";
import makeServerClient from "~/core/lib/supa-client.server";

import AuthLoginButtons from "../components/auth-login-buttons";
import PrivacyPolicySheet from "../components/privacy-policy-sheet";
import ServiceSheet from "../components/service-sheet";
import { doesUserExist } from "../queries";

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: `회원가입 | ${import.meta.env.VITE_APP_NAME}`,
    },
  ];
};

const joinSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "이름은 필수값 입니다." })
      .max(15, { message: "이름은 15자 미만입니다." }),
    email: z.string().email({ message: "유효하지 않은 이메일 형식입니다." }),
    password: z.string().min(8, { message: "비밀번호는 8자 이상입니다." }),
    confirmPassword: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상입니다." }),
    terms: z.coerce.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const {
    data: validData,
    success,
    error,
  } = joinSchema.safeParse(Object.fromEntries(formData));

  if (!success) {
    return data({ fieldErrors: error.flatten().fieldErrors }, { status: 400 });
  }

  if (!validData.terms) {
    return data(
      { error: "서비스 이용약관 및 개인정보처리방침에 동의해주세요." },
      { status: 400 },
    );
  }

  const userExists = await doesUserExist(validData.email);

  if (userExists) {
    return data({ error: "이미 존재하는 이메일입니다." }, { status: 400 });
  }

  const [client] = makeServerClient(request);
  const { error: signInError } = await client.auth.signUp({
    ...validData,
    options: {
      data: {
        name: validData.name,
      },
    },
  });

  if (signInError) {
    return data({ error: signInError.message }, { status: 400 });
  }
  return {
    success: true,
  };
};

export default function Join({ actionData }: Route.ComponentProps) {
  const formRef = useRef<HTMLFormElement>(null);

  // 회원가입 성공 시 reset
  useEffect(() => {
    if (actionData && "success" in actionData && actionData.success) {
      formRef.current?.reset();
      formRef.current?.blur();
    }
  }, [actionData]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>회원가입</CardTitle>
          <CardDescription>
            Starting Project 에 오신 것을 환영합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form className="flex flex-col gap-4" method="POST" ref={formRef}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                name="name"
                required
                type="text"
                placeholder="홍길동"
              />
              {actionData &&
              "fieldErrors" in actionData &&
              actionData.fieldErrors?.name ? (
                <FormErrors errors={actionData.fieldErrors.name} />
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="honggilldong@startingproject.com"
                required
              />
              {actionData &&
              "fieldErrors" in actionData &&
              actionData.fieldErrors?.email ? (
                <FormErrors errors={actionData.fieldErrors.email} />
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input id="password" name="password" type="password" required />
              {actionData &&
              "fieldErrors" in actionData &&
              actionData.fieldErrors?.password ? (
                <FormErrors errors={actionData.fieldErrors.password} />
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
              />
              {actionData &&
              "fieldErrors" in actionData &&
              actionData.fieldErrors?.confirmPassword ? (
                <FormErrors errors={actionData.fieldErrors.confirmPassword} />
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="terms" name="terms" defaultChecked />
              <div className="flex gap-1 text-xs">
                [필수]
                <ServiceSheet />및
                <PrivacyPolicySheet />
                동의
              </div>
            </div>
            <FormButton label="가입하기" />
            {actionData && "error" in actionData && actionData.error ? (
              <FormErrors errors={[actionData.error]} />
            ) : null}
            {actionData && "success" in actionData && actionData.success ? (
              <Alert className="bg-green-600/20 text-green-700 dark:bg-green-950/20 dark:text-green-600">
                <CheckCircle2Icon
                  className="size-4"
                  color="oklch(0.627 0.194 149.214)"
                />
                <AlertTitle>회원가입 성공</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-600">
                  이메일을 확인해주세요. 첫 로그인 시에만 이메일이 유효한지
                  확인합니다. 해당 탭은 닫으셔도 됩니다.
                </AlertDescription>
              </Alert>
            ) : null}
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <AuthLoginButtons />
        </CardFooter>
      </Card>
    </div>
  );
}
