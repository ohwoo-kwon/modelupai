import { MessageCircleIcon } from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/core/components/ui/button";

import GoogleLogo from "./logos/google";

export default function AuthLoginButtons() {
  return (
    <>
      <div className="mb-2 flex w-full items-center gap-4">
        <span className="bg-input h-px w-full"></span>
        <span className="text-muted-foreground text-xs">OR</span>
        <span className="bg-input h-px w-full"></span>
      </div>
      <Button variant="outline" className="relative w-full" asChild>
        <Link to="/auth/social/start/google">
          <GoogleLogo className="absolute top-[9px] left-2" />
          구글 로그인
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="relative w-full bg-[#FEE500] text-black/85 hover:bg-[#FEE500]/70"
        asChild
      >
        <Link to="/auth/social/start/kakao">
          <MessageCircleIcon
            className="absolute top-[9px] left-2"
            fill="black"
            color="black"
          />
          카카오 로그인
        </Link>
      </Button>
    </>
  );
}
