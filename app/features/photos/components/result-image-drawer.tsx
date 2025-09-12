import { useEffect, useState } from "react";
import { useFetcher } from "react-router";

import { Button } from "~/core/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/core/components/ui/drawer";

import StarRating from "./star-rating";

export default function ResultImageDrawer({
  fittingId,
  imgUrl,
  submitting,
}: {
  fittingId: string;
  imgUrl?: string;
  submitting: boolean;
}) {
  const fetcher = useFetcher();

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const handleClick = () => {
    if (!fittingId) return;
    const formData = new FormData();

    formData.set("rating", String(rating));

    fetcher.submit(formData, {
      method: "PUT",
      action: `/api/fittings/${fittingId}`,
    });
  };

  useEffect(() => {
    if (submitting) setOpen(true);
  }, [submitting]);

  return (
    <Drawer open={open} onOpenChange={(v) => setOpen(v)}>
      <DrawerTrigger className="w-full" asChild>
        <Button variant="outline" className="w-full" disabled={!imgUrl}>
          결과 확인
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>AI 피팅 결과</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div className="mx-auto max-h-80 max-w-80">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt="AI 피팅 결과 이미지"
              className="object-contain"
            />
          ) : (
            <div className="flex h-80 w-80 animate-pulse items-center justify-center bg-gradient-to-br from-indigo-200 to-pink-200 text-xl font-bold">
              🌈 변신 중
            </div>
          )}
        </div>
        <DrawerFooter className="space-y-2">
          <StarRating
            onChange={(star: number) => {
              setRating(star);
            }}
          />
          <Button onClick={handleClick}>확인</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
