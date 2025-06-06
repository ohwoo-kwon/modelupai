import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "~/core/components/ui/sheet";

export default function PrivacyPolicySheet() {
  return (
    <Sheet>
      <SheetTrigger className="text-muted-foreground hover:text-foreground cursor-pointer underline transition-colors">
        개인정보처리방침
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>개인정보처리방침</SheetHeader>
        <div>개인정보처리방침 설명</div>
      </SheetContent>
    </Sheet>
  );
}
