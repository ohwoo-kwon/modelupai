import { LogOutIcon, MenuIcon, UserIcon } from "lucide-react";
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
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
    <>
      <SheetClose asChild>
        <Link
          to="/"
          viewTransition
          className="hover:text-muted-foreground transition-colors"
        >
          Link 1
        </Link>
      </SheetClose>
      <SheetClose asChild>
        <Link
          to="/"
          viewTransition
          className="hover:text-muted-foreground transition-colors"
        >
          Link 2
        </Link>
      </SheetClose>
      <SheetClose asChild>
        <Link
          to="/"
          viewTransition
          className="hover:text-muted-foreground transition-colors"
        >
          Link 3
        </Link>
      </SheetClose>
    </>
  );
}

function AuthButtons() {
  return (
    <>
      <Button asChild>
        <Link to="/login" viewTransition>
          로그인
        </Link>
      </Button>
    </>
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
      <div className="hidden items-center gap-5 text-sm md:flex">
        <Sheet>
          <MenuButtons />
          {loading ? (
            <div className="flex items-center">
              <div className="bg-muted-foreground/50 size-8 animate-pulse rounded-full" />
            </div>
          ) : name ? (
            <UserMenu name={name} email={email} avatarUrl={avatarUrl} />
          ) : (
            <AuthButtons />
          )}
        </Sheet>
      </div>

      {/* Mobile 화면 */}
      <Sheet>
        <SheetTrigger asChild className="size-6 md:hidden">
          <MenuIcon />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
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
