import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

import { DateTime } from "luxon";

export async function updatePaymentSuccess(
  client: SupabaseClient<Database>,
  {
    orderId,
    paymentKey,
    payment_method,
  }: { orderId: string; paymentKey: string; payment_method: string },
) {
  const { data, error: selectError } = await client
    .from("payments")
    .select("*")
    .eq("id", orderId)
    .single();

  if (selectError) throw selectError;

  if (!data) throw Error("존재하지 않은 거래입니다.");

  if (data.status === "completed") throw Error("이미 완료된 거래입니다.");

  const { error } = await client
    .from("payments")
    .update({
      status: "completed",
      provider_transaction_id: paymentKey,
      payment_method,
      completed_at: DateTime.now().toISO(),
    })
    .eq("id", orderId);
  if (error) throw error;
}

export async function insertTransaction(
  client: SupabaseClient<Database>,
  {
    profile_id,
    type,
    amount,
    balance_before,
    balance_after,
    related_fitting_id,
    related_photo_id,
    related_payment_id,
  }: {
    profile_id: string;
    type: string; // purchase(구매), earn(수익), spend(사용), bonus(보너스), refund(환불)
    amount: number;
    balance_before: number;
    balance_after: number;
    related_fitting_id?: string;
    related_photo_id?: string;
    related_payment_id?: string;
  },
) {
  const { error } = await client.from("gem_transactions").insert({
    profile_id,
    type,
    amount,
    balance_before,
    balance_after,
    related_fitting_id,
    related_photo_id,
    related_payment_id,
  });

  if (error) throw error;
}
