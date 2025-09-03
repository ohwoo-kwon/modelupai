import type { Route } from "./+types/view";

import { DateTime } from "luxon";
import { data } from "react-router";

import { requireMethod } from "~/core/lib/guards.server";
import makeServerClient from "~/core/lib/supa-client.server";

import { increaseViews } from "../mutations";

export const action = async ({ request, params }: Route.ActionArgs) => {
  requireMethod("POST");
  const [client, headers] = makeServerClient(request);
  const { photoId } = params;

  try {
    // 클라이언트 IP 주소 가져오기
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : realIp ||
        request.headers.get("cf-connecting-ip") || // Cloudflare
        request.headers.get("x-client-ip") ||
        "127.0.0.1";

    // 요청 본문에서 user_agent 가져오기
    const body = await request.json();
    const userAgent = body.user_agent || request.headers.get("user-agent");

    const currentUserId = (await client.auth.getUser()).data.user?.id || null;

    //   중복 조회 확인 (24시간 내)
    const now = DateTime.now().setZone("utc");
    if (currentUserId) {
      const { data: existingView } = await client
        .from("photo_views")
        .select("id")
        .eq("photo_id", photoId)
        .eq("profile_id", currentUserId)
        .gte("viewed_at", now.minus({ days: 1 }))
        .maybeSingle();

      if (existingView) {
        return data({
          success: false,
          message: "Duplicate view within 24 hours",
        });
      }
    } // 비회원의 경우 IP 기반 중복 확인
    else {
      const { data: existingIpView } = await client
        .from("photo_views")
        .select("id")
        .eq("photo_id", photoId)
        .is("profile_id", null)
        .eq("ip_address", ip)
        .gte("viewed_at", now.minus({ days: 1 }))
        .maybeSingle();

      if (existingIpView) {
        return data({
          success: false,
          message: "Duplicate view within 24 hours",
        });
      }
    }

    // 조회 기록 추가
    const { error: insertError } = await client.from("photo_views").insert({
      photo_id: photoId,
      profile_id: currentUserId,
      ip_address: ip,
      user_agent: userAgent,
    });

    if (insertError) {
      console.error("Error inserting photo view:", insertError);
      return data(
        {
          success: false,
          error: insertError.message,
        },
        { status: 500 },
      );
    }

    // photos 테이블의 views 카운트 증가
    await increaseViews(client, photoId);

    return data({
      success: true,
      message: "Photo view recorded successfully",
    });
  } catch (error) {
    console.error("Error in photo view action:", error);
    return data(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
};
