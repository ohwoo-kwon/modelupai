import { ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import FormErrors from "~/core/components/form-errors";
import { Input } from "~/core/components/ui/input";
import { Label } from "~/core/components/ui/label";
import { cn } from "~/core/lib/utils";

export default function ImageInput({ errors }: { errors: string[] | null }) {
  const [image, setImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
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
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            if (inputRef.current) {
              inputRef.current.files = dataTransfer.files;
            }
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
            <ImageIcon size={50} className="mx-auto" />
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
