import type { Dispatch, SetStateAction } from "react";

export function resizePhotoClient(
  e: ProgressEvent<FileReader>,
  file: File,
  setPreview: Dispatch<SetStateAction<string | null>>,
  setCroppedFile: Dispatch<SetStateAction<File | null>>,
) {
  const img = new Image();
  img.onload = () => {
    const targetRatio = 1 / 1;
    const width = img.width;
    const height = img.height;
    const currentRatio = width / height;

    let cropWidth: number, cropHeight: number, offsetX: number, offsetY: number;

    if (currentRatio > targetRatio) {
      // 가로가 더 긴 경우 → 좌우 잘라냄
      cropHeight = height;
      cropWidth = height * targetRatio;
      offsetX = (width - cropWidth) / 2;
      offsetY = 0; // 위쪽 기준
    } else {
      // 세로가 더 긴 경우 → 위쪽 기준으로 아래 잘라냄
      cropWidth = width;
      cropHeight = width / targetRatio;
      offsetX = 0;
      offsetY = (height - cropHeight) / 2;
    }

    const canvas = document.createElement("canvas");
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(
      img,
      offsetX,
      offsetY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight,
    );

    // ✅ preview 설정 (DataURL)
    const croppedDataUrl = canvas.toDataURL("image/jpeg");
    setPreview(croppedDataUrl);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const croppedFile = new File([blob], file.name, {
            type: "image/jpeg",
          });
          setCroppedFile(croppedFile);

          // 👉 서버 업로드 시에는 croppedFile을 사용하세요
          // 예: formData.append("myImg", croppedFile);
        }
      },
      "image/jpeg",
      0.95,
    );
  };

  if (e.target?.result) {
    img.src = e.target.result as string;
  }
}
