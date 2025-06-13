import type { Route } from "./+types/model";

export const meta: Route.MetaFunction = ({ data }) => {
  return [
    { title: `모델 | ${import.meta.env.VITE_APP_NAME}` },
    { name: "description", content: "Just Start Making Your Project" },
  ];
};

export default function Model() {
  return <div className="space-y-10 px-5">model</div>;
}
