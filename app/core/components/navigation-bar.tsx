import {
  HeartIcon,
  LogOutIcon,
  MenuIcon,
  SearchIcon,
  ShirtIcon,
  TrendingUpIcon,
  UploadIcon,
  UserIcon,
} from "lucide-react";
import { Link } from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

function UserMenu({
  name,
  email,
  avatarUrl,
}: {
  name: string;
  email?: string;
  avatarUrl?: string | null;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-8 cursor-pointer">
          <AvatarImage src={avatarUrl ?? undefined} />
          <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{name}</span>
          <span className="truncate text-xs">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SheetClose asChild>
            <Link to="/profile" viewTransition>
              <UserIcon className="size-4" />
              마이페이지
            </Link>
          </SheetClose>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <SheetClose asChild>
            <Link to="/logout" viewTransition>
              <LogOutIcon className="size-4" />
              로그아웃
            </Link>
          </SheetClose>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MenuButtons() {
  return (
    <div className="flex h-full flex-col justify-between lg:flex-row lg:items-center lg:justify-center lg:gap-4">
      <div className="space-y-4 lg:flex lg:items-center lg:gap-4 lg:space-y-0">
        {/* <SheetClose asChild>
          <Link
            to="/trending"
            viewTransition
            className="hover:text-muted-foreground flex items-center gap-2 transition-colors"
          >
            <TrendingUpIcon size={20} /> 인기 사진
          </Link>
        </SheetClose> */}
        <SheetClose asChild>
          <Link
            to="/photos/explore"
            viewTransition
            className="hover:text-muted-foreground flex items-center gap-2 transition-colors"
          >
            <SearchIcon size={20} /> 탐색
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link
            to="/fittings"
            viewTransition
            className="hover:text-muted-foreground flex items-center gap-2 transition-colors"
          >
            <ShirtIcon size={20} /> 피팅 룸
          </Link>
        </SheetClose>
        {/* <SheetClose asChild>
          <Link
            to="/like"
            viewTransition
            className="hover:text-muted-foreground flex items-center gap-2 transition-colors"
          >
            <HeartIcon size={20} /> 즐겨찾기
          </Link>
        </SheetClose> */}
      </div>
      <SheetClose asChild>
        <Button asChild>
          <Link
            to="/photos/upload"
            viewTransition
            className="flex items-center gap-2 font-bold transition-colors"
          >
            <UploadIcon size={20} /> 패션 업로드
          </Link>
        </Button>
      </SheetClose>
    </div>
  );
}

function AuthButtons() {
  return (
    <SheetClose asChild>
      <Button asChild>
        <Link to="/login" viewTransition>
          로그인
        </Link>
      </Button>
    </SheetClose>
  );
}

export default function NavigationBar({
  name,
  email,
  avatarUrl,
  loading,
}: {
  name?: string;
  email?: string;
  avatarUrl?: string | null;
  loading: boolean;
}) {
  return (
    <nav className="flex h-16 items-center justify-between border-b px-5 shadow-xs md:px-10">
      <Link to="/">
        <h1 className="text-lg font-extrabold">
          {import.meta.env.VITE_APP_NAME}
        </h1>
      </Link>

      {/* PC 화면 */}
      <Sheet>
        <div className="hidden items-center gap-6 text-sm lg:flex">
          <MenuButtons />
          <Separator orientation="vertical" className="h-8!" />
          {loading ? (
            <div className="flex items-center">
              <div className="bg-muted-foreground/50 size-8 animate-pulse rounded-full" />
            </div>
          ) : name ? (
            <UserMenu name={name} email={email} avatarUrl={avatarUrl} />
          ) : (
            <AuthButtons />
          )}
        </div>

        {/* Mobile 화면 */}
        <SheetTrigger asChild className="size-6 lg:hidden">
          <MenuIcon />
        </SheetTrigger>
        <SheetContent className="h-full">
          <SheetHeader className="h-full space-y-4 pb-0">
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>
            <MenuButtons />
          </SheetHeader>
          <SheetFooter>
            {loading ? (
              <div className="flex items-center">
                <div className="bg-muted-foreground/50 mx-auto h-10 w-full animate-pulse rounded-lg" />
              </div>
            ) : name ? (
              <UserMenu name={name} email={email} avatarUrl={avatarUrl} />
            ) : (
              <AuthButtons />
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
