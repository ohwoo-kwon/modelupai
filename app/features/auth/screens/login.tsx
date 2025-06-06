import type { Route } from "./+types/login";

import { AlertCircle, CheckCircle2Icon, Loader2Icon } from "lucide-react";
import { useRef } from "react";
import { Form, Link, data, redirect, useFetcher } from "react-router";
import z from "zod";

import FormButton from "~/core/components/form-button";
import FormErrors from "~/core/components/form-errors";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/core/components/ui/alert";
import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { Input } from "~/core/components/ui/input";
import { Label } from "~/core/components/ui/label";
import makeServerClient from "~/core/lib/supa-client.server";

import AuthLoginButtons from "../components/auth-login-buttons";

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: `로그인 | ${import.meta.env.VITE_APP_NAME}`,
    },
  ];
};

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const isEmailVerified = url.searchParams.has("email-verified");

  return { isEmailVerified };
}

const loginSchema = z.object({
  email: z.string().email({ message: "유효하지 않은 이메일 형식입니다." }),
  password: z.string().min(8, { message: "비밀번호는 8자 이상입니다." }),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const {
    data: validData,
    success,
    error,
  } = loginSchema.safeParse(Object.fromEntries(formData));

  if (!success) {
    return data({ fieldErrors: error.flatten().fieldErrors }, { status: 400 });
  }

  const [client, headers] = makeServerClient(request);

  const { error: signInError } = await client.auth.signInWithPassword({
    ...validData,
  });

  if (signInError) {
    if (signInError.message === "Invalid login credentials")
      return data(
        { error: "이메일 및 비밀번호를 확인해주세요." },
        { status: 400 },
      );

    return data({ error: signInError.message }, { status: 400 });
  }

  return redirect("/", { headers });
}

export default function Login({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const fetcher = useFetcher();

  const onResendClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    formData.delete("password");
    fetcher.submit(formData, {
      method: "post",
      action: "/auth/api/resend",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>
            Starting Project 에 오신 것을 환영합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form className="flex flex-col gap-4" method="POST" ref={formRef}>
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
            <FormButton label="로그인" />
            {loaderData &&
              "isEmailVerified" in loaderData &&
              loaderData.isEmailVerified && (
                <Alert className="bg-green-600/20 text-green-700 dark:bg-green-950/20 dark:text-green-600">
                  <CheckCircle2Icon
                    className="size-4"
                    color="oklch(0.627 0.194 149.214)"
                  />
                  <AlertTitle>이메일 확인 완료</AlertTitle>
                </Alert>
              )}
            {actionData && "error" in actionData ? (
              actionData.error === "Email not confirmed" ? (
                <Alert variant="destructive" className="bg-destructive/10">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>이메일 확인이 완료되지 않았습니다.</AlertTitle>
                  <AlertDescription className="flex flex-col items-start gap-2">
                    로그인 전에 이메일을 확인해주세요.
                    <Button
                      variant="outline"
                      className="text-foreground flex items-center justify-between gap-2"
                      onClick={onResendClick}
                    >
                      이메일 재전송
                      {fetcher.state === "submitting" ? (
                        <Loader2Icon
                          data-testid="resend-confirmation-email-spinner"
                          className="size-4 animate-spin"
                        />
                      ) : null}
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : (
                <FormErrors errors={[actionData.error]} />
              )
            ) : null}
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <AuthLoginButtons />
        </CardFooter>
      </Card>
      <div className="flex flex-col items-center justify-center text-sm">
        <p className="text-muted-foreground">
          아직 회원이 아니신가요?{" "}
          <Link
            to="/join"
            viewTransition
            data-testid="form-signup-link"
            className="text-muted-foreground hover:text-foreground underline transition-colors"
          >
            가입하기
          </Link>
        </p>
      </div>
    </div>
  );
}
