import { useEffect, useState } from "react";

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

export default function ResultImageDrawer({
  imgUrl,
  submitting,
}: {
  imgUrl?: string;
  submitting: boolean;
}) {
  const [open, setOpen] = useState(false);

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
        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
