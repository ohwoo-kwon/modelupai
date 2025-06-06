import type { Route } from "@rr/app/features/users/apis/+types/change-email";

import { useEffect, useRef } from "react";
import { useFetcher } from "react-router";

import FetcherFormButton from "~/core/components/fetcher-form-button";
import FormErrors from "~/core/components/form-errors";
import FormSuccess from "~/core/components/form-success";
import { CardContent, CardFooter } from "~/core/components/ui/card";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { Input } from "~/core/components/ui/input";
import { Label } from "~/core/components/ui/label";

export default function ChangeEmailForm({ email }: { email: string }) {
  const fetcher = useFetcher<Route.ComponentProps["actionData"]>();
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (fetcher.data && "success" in fetcher.data && fetcher.data.success) {
      formRef.current?.reset();
      formRef.current?.blur();
      formRef.current?.querySelectorAll("input").forEach((input) => {
        if (!input.disabled) {
          input.blur();
        }
      });
    }
  }, [fetcher.data]);
  return (
    <fetcher.Form
      ref={formRef}
      method="post"
      className="w-full max-w-screen-md"
      action="/api/users/email"
    >
      <Card className="justify-between">
        <CardHeader>
          <CardTitle>{email ? "이메일 변경" : "이메일 추가"}</CardTitle>
          <CardDescription>
            {email ? "이메일을 변경하세요." : "이메일을 추가하세요."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full flex-col gap-7">
            <div className="flex cursor-not-allowed flex-col items-start space-y-2">
              <Label
                htmlFor="currentEmail"
                className="flex flex-col items-start gap-1"
              >
                현재 이메일
              </Label>
              <Input
                id="currentEmail"
                name="currentEmail"
                required
                type="email"
                disabled
                value={email}
              />
            </div>
            <div className="flex flex-col items-start space-y-2">
              <Label
                htmlFor="email"
                className="flex flex-col items-start gap-1"
              >
                신규 이메일
              </Label>
              <Input id="email" name="email" required type="email" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <FetcherFormButton
            label={email ? "이메일 변경" : "이메일 추가"}
            className="w-full"
            submitting={fetcher.state === "submitting"}
            disabled={fetcher.state === "submitting"}
          />
          {fetcher.data && "success" in fetcher.data && fetcher.data.success ? (
            <FormSuccess message="기존 이메일과 신규 이메일에서 확인 링크를 클릭하세요." />
          ) : null}
          {fetcher.data && "error" in fetcher.data && fetcher.data.error ? (
            <FormErrors errors={[fetcher.data.error]} />
          ) : null}
        </CardFooter>
      </Card>
    </fetcher.Form>
  );
}
