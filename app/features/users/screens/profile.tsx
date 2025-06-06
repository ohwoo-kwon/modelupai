import type { Route } from "./+types/profile";

import { Suspense } from "react";
import { Await } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";

import ChangeEmailForm from "../components/change-email-form";
import ChangePasswordForm from "../components/change-password-form";
import DeleteAccountForm from "../components/delete-account-form";
import EditProfileForm from "../components/edit-profile-form";
import { getUserProfile } from "../queries";

export const meta: Route.MetaFunction = () => {
  return [{ title: `마이페이지 | ${import.meta.env.VITE_APP_NAME}` }];
};

export async function loader({ request }: Route.LoaderArgs) {
  const [client] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();
  const identities = client.auth.getUserIdentities();

  const profile = getUserProfile(client, { userId: user!.id });
  return {
    user,
    identities,
    profile,
  };
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  const { user, identities, profile } = loaderData;
  const hasEmailIdentity = user?.identities?.some(
    (identity) => identity.provider === "email",
  );

  return (
    <div className="flex w-full flex-col items-center gap-10 pt-0 pb-8">
      <Suspense
        fallback={
          <div className="bg-card animate-fast-pulse h-60 w-full max-w-screen-md rounded-xl border shadow-sm" />
        }
      >
        <Await
          resolve={profile}
          errorElement={
            <div className="text-red-500">
              프로필 정보를 가져올 수 없습니다.
            </div>
          }
        >
          {(profile) => {
            if (!profile) {
              return null;
            }
            return (
              <EditProfileForm
                name={profile.name}
                avatarUrl={profile.avatar_url}
              />
            );
          }}
        </Await>
      </Suspense>
      <ChangeEmailForm email={user?.email ?? ""} />
      <ChangePasswordForm hasPassword={hasEmailIdentity ?? false} />
      <DeleteAccountForm />
    </div>
  );
}
