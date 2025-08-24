import { ImageIcon } from "lucide-react";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

import FormErrors from "~/core/components/form-errors";
import { Input } from "~/core/components/ui/input";
import { Label } from "~/core/components/ui/label";
import { cn } from "~/core/lib/utils";

export default function ImageInput({
  errors,
  setCroppedFile,
}: {
  errors: string[] | null;
  setCroppedFile?: Dispatch<SetStateAction<File | null>>;
}) {
  const [image, setImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > 10000 * 1024) {
        alert("파일 크기는 10MB를 초과할 수 없습니다.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const targetRatio = 4 / 5;
          const width = img.width;
          const height = img.height;
          const currentRatio = width / height;

          let cropWidth: number,
            cropHeight: number,
            offsetX: number,
            offsetY: number;

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
            offsetY = 0;
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
          setImage(croppedDataUrl);

          // ✅ 파일 자체도 새로운 File 로 변환
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const croppedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                });
                if (setCroppedFile) setCroppedFile(croppedFile);

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
      };

      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();

          if (file) {
            if (file.size > 10000 * 1024) {
              alert("파일 크기는 10MB를 초과할 수 없습니다.");
              return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
              const img = new Image();
              img.onload = () => {
                const targetRatio = 4 / 5;
                const width = img.width;
                const height = img.height;
                const currentRatio = width / height;

                let cropWidth: number,
                  cropHeight: number,
                  offsetX: number,
                  offsetY: number;

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
                  offsetY = 0;
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
                setImage(croppedDataUrl);

                // ✅ 파일 자체도 새로운 File 로 변환
                canvas.toBlob(
                  (blob) => {
                    if (blob) {
                      const croppedFile = new File([blob], file.name, {
                        type: "image/jpeg",
                      });
                      if (setCroppedFile) setCroppedFile(croppedFile);

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
            };

            reader.readAsDataURL(file);
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <div className="mb-6">
      <Label
        htmlFor="image"
        className={cn(
          `text-muted-foreground hover:bg-muted mx-auto flex max-w-96 cursor-pointer items-center justify-center overflow-hidden rounded border`,
          image
            ? "border-1"
            : "border-muted-foreground aspect-square border-4 border-dashed",
        )}
      >
        {image ? (
          <img className="object-fit w-full" src={image} />
        ) : (
          <div className="space-y-1 text-center">
            <p className="text-5xl">📷</p>
            <p>드래그 & 드롭 가능</p>
            <p>CTRL+C, CTRL+V 가능</p>
          </div>
        )}
      </Label>
      {errors && (
        <div className="mx-auto max-w-96">
          <FormErrors errors={errors} />
        </div>
      )}
      <Input
        id="image"
        name="image"
        type="file"
        className="hidden"
        accept="image/*"
        ref={inputRef}
        onChange={onChangeImage}
      />
    </div>
  );
}
