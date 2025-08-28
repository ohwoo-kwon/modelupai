import type { Route } from "./+types/home";

import { redirect } from "react-router";

export const meta: Route.MetaFunction = () => {
  return [
    { title: `AI 가상 피팅 | ${import.meta.env.VITE_APP_NAME} 가상 피팅` },
    {
      name: "description",
      content: "AI 가상 피팅 서비스를 무료로 즐길 수 있는 Fit Me Ai 입니다.",
    },
  ];
};

// export const loader = async () => {
//   return redirect("/login")
// }

export default function Home() {
  return <div>Home</div>;
}
