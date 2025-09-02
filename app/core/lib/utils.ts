import type { SupabaseClient } from "@supabase/supabase-js";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fileToBase64(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return buffer.toString("base64");
}

export async function streamToBase64(stream: ReadableStream) {
  const response = new Response(stream);
  const blob = await response.blob();

  const arrayBuffer = await blob.arrayBuffer();

  const buffer = Buffer.from(arrayBuffer);

  const base64 = buffer.toString("base64");

  return base64;
}

export async function uploadImageFileToStorage(
  client: SupabaseClient,
  file: File,
  userId: string,
  storage: string,
): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const arrayBuffer = await file.arrayBuffer();

  const { data, error } = await client.storage
    .from(storage)
    .upload(fileName, arrayBuffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Storage upload error:", error);
    throw new Error(`이미지 업로드에 실패했습니다: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = client.storage.from(storage).getPublicUrl(data.path);

  return publicUrl;
}

export async function uploadBase64ToStorage(
  client: SupabaseClient,
  base64Data: string,
  userId: string,
  storage: string,
): Promise<string> {
  try {
    // 1. base64Data에서 헤더 제거
    const base64 = base64Data.split(",")[1];
    const contentType =
      base64Data.match(/data:(.*?);base64/)?.[1] || "image/png";

    // 2. base64 → Uint8Array
    const binary = atob(base64);
    const arrayBuffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      arrayBuffer[i] = binary.charCodeAt(i);
    }

    // 3. 파일명 생성
    const fileExt = contentType.split("/")[1];
    const fileName = `${userId}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    // 4. Supabase Storage 업로드
    const { data, error } = await client.storage
      .from(storage) // 저장할 bucket 이름
      .upload(fileName, arrayBuffer, {
        contentType,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw new Error(error.message);

    // 5. 업로드한 파일의 public URL 반환
    const {
      data: { publicUrl },
    } = client.storage.from(storage).getPublicUrl(fileName);

    return publicUrl;
  } catch (err: any) {
    console.error(err);
    throw new Error(`이미지 업로드 실패: ${err.message}`);
  }
}
