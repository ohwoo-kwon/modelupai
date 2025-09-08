import type { Route } from "./+types/navigation.layout";

import { Suspense } from "react";
import { Await, Outlet, useLocation } from "react-router";

import { getUserProfile } from "~/features/users/queries";

import Footer from "../components/footer";
import NavigationBar from "../components/navigation-bar";
import makeServerClient from "../lib/supa-client.server";
import { cn } from "../lib/utils";

export async function loader({ request }: Route.LoaderArgs) {
  const [client] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();
  const userPromise = getUserProfile(client, { userId: user?.id || "" });
  return { userPromise };
}

export default function NavigationLayout({ loaderData }: Route.ComponentProps) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen">
      <Suspense fallback={<NavigationBar loading={true} />}>
        <Await resolve={loaderData.userPromise}>
          {(user) =>
            user === null ? (
              <NavigationBar loading={false} />
            ) : (
              <NavigationBar
                name={user.name || "익명의 사용자"}
                email={user.email}
                avatarUrl={user.avatar_url}
                loading={false}
              />
            )
          }
        </Await>
      </Suspense>
      <div
        className={cn(
          "min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 to-slate-100",
          pathname === "/" ? "" : "py-4 md:py-8",
        )}
      >
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
