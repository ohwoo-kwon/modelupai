import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("core/layouts/navigation.layout.tsx", [
    index("features/home/screens/home.tsx"),
    route("/error", "core/screens/error.tsx"),
    layout("core/layouts/public.layout.tsx", [
      route("/login", "features/auth/screens/login.tsx"),
      route("/join", "features/auth/screens/join.tsx"),
      ...prefix("/auth", [
        route("/api/resend", "features/auth/apis/resend.tsx"),
        ...prefix("/social", [
          route("/start/:provider", "features/auth/screens/social/start.tsx"),
          route(
            "/complete/:provider",
            "features/auth/screens/social/complete.tsx",
          ),
        ]),
      ]),
    ]),
    layout("core/layouts/private.layout.tsx", { id: "private-auth" }, [
      route("/profile", "features/users/screens/profile.tsx"),
      route("/logout", "features/auth/screens/logout.tsx"),
    ]),
    layout("core/layouts/private.layout.tsx", { id: "private-photo" }, [
      ...prefix("/photos", [
        route("/upload", "features/photos/screens/upload-photo.tsx"),
        route("/:photo_id", "features/photos/screens/photo.tsx"),
      ]),
    ]),
    route("/photos/explore", "features/photos/screens/explore-photos.tsx"),
  ]),
  ...prefix("/api", [
    ...prefix("/users", [
      index("features/users/apis/delete-profile.tsx"),
      route("/password", "features/users/apis/change-password.tsx"),
      route("/email", "features/users/apis/change-email.tsx"),
      route("/profile", "features/users/apis/edit-profile.tsx"),
    ]),
    route("/photos/lookbook", "features/photos/apis/generate-lookbook.tsx"),
  ]),
] satisfies RouteConfig;
