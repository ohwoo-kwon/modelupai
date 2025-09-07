import type { Route } from "./+types/payment-failure";

import { Link, useSearchParams } from "react-router";

import { Button } from "~/core/components/ui/button";

export const meta: Route.MetaFunction = () => {
  return [{ title: `결제 실패 | ${import.meta.env.VITE_APP_NAME}` }];
};

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get("message");

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <h1 className="text-center text-3xl font-semibold tracking-tight text-red-500 md:text-5xl dark:text-red-400">
        결제 실패
      </h1>
      {/* Error description display */}
      <p className="text-muted-foreground text-center">{errorMessage}</p>

      <Button asChild>
        <Link to="/billing/pricing">요금제로 돌아가기</Link>
      </Button>
    </div>
  );
}
