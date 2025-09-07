import {
  type TossPaymentsWidgets,
  loadTossPayments,
} from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";

import { Button } from "~/core/components/ui/button";
import { browserClient } from "~/core/db/client.broswer";

const clientKey = import.meta.env.VITE_TOSS_PAYMENTS_CLIENT_KEY;

export function TossCheckout({
  price,
  count,
  email,
  name,
  orderName,
  userId,
}: {
  price: number;
  count: number;
  email: string;
  name: string;
  orderName: string;
  userId: string;
}) {
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: price * count,
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      // ------  결제위젯 초기화 ------
      const tossPayments = await loadTossPayments(clientKey);
      // 회원 결제
      const widgets = tossPayments.widgets({
        customerKey: userId,
      });

      setWidgets(widgets);
    }

    fetchPaymentWidgets();
  }, [clientKey, userId]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        return;
      }
      // ------ 주문의 결제 금액 설정 ------
      await widgets.setAmount(amount);

      await Promise.all([
        // ------  결제 UI 렌더링 ------
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        }),
        // ------  이용약관 UI 렌더링 ------
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        }),
      ]);

      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets]);

  useEffect(() => {
    if (widgets == null) {
      return;
    }

    widgets.setAmount(amount);
  }, [widgets, amount]);

  return (
    <div className="wrapper">
      <div className="box_section">
        {/* 결제 UI */}
        <div id="payment-method" />
        {/* 이용약관 UI */}
        <div id="agreement" />

        {/* 결제하기 버튼 */}
        <Button
          className="button w-full"
          disabled={!ready}
          onClick={async () => {
            try {
              // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
              // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
              // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
              const { data, error } = await browserClient
                .from("payments")
                .insert({
                  profile_id: userId,
                  amount: amount.value,
                  currency: amount.currency,
                  gems_purchased: count,
                  payment_method: "toss",
                  status: "pending",
                })
                .select("id")
                .single();

              if (error) throw error;

              await widgets!.requestPayment({
                orderId: data.id,
                orderName: orderName,
                successUrl: window.location.origin + "/billing/success",
                failUrl: window.location.origin + "/billing/failure",
                customerEmail: email,
                customerName: name,
                metadata: {
                  price,
                  count,
                },
              });
            } catch (error) {
              // 에러 처리하기
              console.error(error);
            }
          }}
        >
          결제하기
        </Button>
      </div>
    </div>
  );
}
