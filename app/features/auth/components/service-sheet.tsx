import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "~/core/components/ui/sheet";

export default function ServiceSheet() {
  return (
    <Sheet>
      <SheetTrigger className="text-muted-foreground hover:text-foreground cursor-pointer underline transition-colors">
        서비스 이용약관
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>서비스 이용약관</SheetHeader>
        <div>서비스 설명</div>
      </SheetContent>
    </Sheet>
  );
}
