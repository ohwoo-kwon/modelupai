import type { Route } from "./+types/payment-success";

import { CheckIcon } from "lucide-react";
import { Link, redirect } from "react-router";
import z from "zod";

import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { requireAuthentication } from "~/core/lib/guards.server";
import adminClient from "~/core/lib/supa-admin-client.server";
import makeServerClient from "~/core/lib/supa-client.server";
import { updateDia } from "~/features/users/mutations";
import { getUserProfile } from "~/features/users/queries";

import { insertTransaction, updatePaymentSuccess } from "../mutations";

const getAddedGem = (price: number) => {
  switch (price) {
    case 3300:
      return 10;
    case 9500:
      return 50;
    case 42000:
      return 300;
    default:
      return 0;
  }
};

export const meta: Route.MetaFunction = () => [
  {
    title: `결제 성공 | ${import.meta.env.VITE_APP_NAME}`,
  },
];

const paramsSchema = z.object({
  orderId: z.string(),
  paymentKey: z.string(),
  amount: z.coerce.number(),
  paymentType: z.string(),
});

const paymentResponseSchema = z.object({
  paymentKey: z.string(),
  orderId: z.string(),
  orderName: z.string(),
  status: z.string(),
  requestedAt: z.string(),
  approvedAt: z.string(),
  receipt: z.object({
    url: z.string(),
  }),
  totalAmount: z.number(),
  metadata: z.record(z.string()),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);

  await requireAuthentication(client);

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    throw redirect("/billing/pricing");
  }
  const profile = await getUserProfile(client, { userId: user.id });
  if (!profile) {
    throw redirect("/billing/pricing");
  }

  const url = new URL(request.url);
  const result = paramsSchema.safeParse(Object.fromEntries(url.searchParams));

  if (!result.success) {
    return redirect(`/billing/failure?`);
  }

  // 결제 정보 유효성 확인
  const { orderId, paymentKey, amount } = result.data;

  const widgetSecretKey = process.env.TOSS_PAYMENTS_SECRET_KEY;
  const encryptedSecretKey =
    "Basic " + Buffer.from(widgetSecretKey + ":").toString("base64");

  const response = await fetch(
    "https://api.tosspayments.com/v1/payments/confirm",
    {
      method: "POST",
      headers: {
        Authorization: encryptedSecretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        amount,
        paymentKey,
      }),
    },
  );

  const data = await response.json();

  if (response.status !== 200 && data.code && data.message) {
    throw redirect(
      `/billing/failure?code=${encodeURIComponent(data.code)}&message=${encodeURIComponent(data.message)}`,
    );
  }

  const paymentResponse = paymentResponseSchema.safeParse(data);
  if (!paymentResponse.success) {
    throw redirect(
      `/billing/failure?code=${encodeURIComponent("validation-error")}&message=${encodeURIComponent("Invalid response from Toss")}`,
    );
  }

  if (paymentResponse.data.totalAmount !== amount) {
    throw redirect(
      `/billing/failure?code=${encodeURIComponent("validation-error")}&message=${encodeURIComponent("Invalid amount")}`,
    );
  }

  try {
    await updatePaymentSuccess(adminClient, {
      orderId,
      paymentKey,
      payment_method: data.method,
    });

    const addedGem = getAddedGem(amount);
    const total_spent = (profile.total_spent || 0) + amount;
    const gem_balance = (profile.gem_balance || 0) + addedGem;

    await updateDia(client, {
      profile_id: profile.profile_id,
      total_spent,
      gem_balance,
    });

    await insertTransaction(adminClient, {
      profile_id: profile.profile_id,
      type: "purchase",
      amount: addedGem,
      balance_before: profile.gem_balance || 0,
      balance_after: gem_balance,
      related_payment_id: orderId,
    });
  } catch (error) {
    let message = "룩북 제작 중 오류가 발생했습니다.";
    if (error instanceof Error) {
      message = error.message;
    }
    return redirect(`/billing/failure?message=${message}`);
  }

  return { data };
};

export default function PaymentSuccess({ loaderData }: Route.ComponentProps) {
  return (
    <div className="h-full px-4">
      <div className="mx-auto max-w-2xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-green-200 p-5">
                <div className="rounded-full bg-green-500 p-1">
                  <CheckIcon className="text-white" />
                </div>
              </div>
              <h2 className="text-3xl">결제가 완료되었습니다.</h2>
            </CardTitle>
            <CardDescription className="text-center">
              다이아가 성공적으로 충전되었습니다.
            </CardDescription>
          </CardHeader>
          <CardContent></CardContent>
          <CardFooter className="space-y-2">
            <Button className="w-full" asChild>
              <Link to="/photos/explore">AI 피팅 하러가기</Link>
            </Button>
            {loaderData.data?.receipt?.url && (
              <Button variant="secondary" className="w-full" asChild>
                <Link to={loaderData.data.receipt.url}>영수증</Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
