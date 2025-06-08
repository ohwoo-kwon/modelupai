import type { Route } from "./+types/cloth-create";

export const meta: Route.MetaFunction = () => {
  return [{ title: `옷 생성 | ${import.meta.env.VITE_APP_NAME}` }];
};

export default function ClothCreate() {
  return <div className="space-y-10 px-5">cloth create</div>;
}
