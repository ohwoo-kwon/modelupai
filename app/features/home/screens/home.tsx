import type { Route } from "./+types/home";

export const meta: Route.MetaFunction = () => {
  return [
    { title: import.meta.env.VITE_APP_NAME },
    { name: "description", content: "Just Start Making Your Project" },
  ];
};

export default function Home() {
  return (
    <div className="px-5 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
        {import.meta.env.VITE_APP_NAME}
      </h1>
      <h2 className="mt-4 text-2xl">Just Start Making Your Project</h2>
    </div>
  );
}
