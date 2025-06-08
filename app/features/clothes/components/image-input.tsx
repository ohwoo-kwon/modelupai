import { ImageIcon } from "lucide-react";
import { useState } from "react";

import FormErrors from "~/core/components/form-errors";
import { Input } from "~/core/components/ui/input";
import { Label } from "~/core/components/ui/label";
import { cn } from "~/core/lib/utils";

export default function ImageInput({ errors }: { errors: string[] | null }) {
  const [image, setImage] = useState<string | null>(null);
  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };
  return (
    <div className="mb-6">
      <Label
        htmlFor="image"
        className={cn(
          `text-muted-foreground hover:bg-muted mx-auto flex aspect-square max-w-96 cursor-pointer items-center justify-center overflow-hidden rounded border`,
          image ? "border-1" : "border-muted-foreground border-4 border-dashed",
        )}
      >
        {image ? (
          <img className="object-fit w-full" src={image} />
        ) : (
          <ImageIcon size={50} />
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
        onChange={onChangeImage}
      />
    </div>
  );
}
