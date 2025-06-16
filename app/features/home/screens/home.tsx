import type { Route } from "./+types/home";

import { Link } from "react-router";

import { Button } from "~/core/components/ui/button";

export const meta: Route.MetaFunction = () => {
  return [
    { title: import.meta.env.VITE_APP_NAME },
    { name: "description", content: "Just Start Making Your Project" },
  ];
};

export default function Home() {
  return (
    <div>
      <section className="relative flex min-h-screen items-center justify-center">
        <div className="space-y-10">
          <h1 className="text-5xl font-bold">
            {import.meta.env.VITE_APP_NAME} 로 옷을
            <br /> 미리 입어보세요.
          </h1>
          <div>
            <h3 className="text-2xl">
              실제 구매 전 나에게 어떻게 맞는지 미리 확인하세요.
            </h3>
            <h3 className="text-2xl">
              첨단 AI 기술로 가상 피팅을 경험할 수 있습니다.
            </h3>
          </div>
          <Button size="lg" className="p-10 text-xl">
            <Link to="/clothes">지금 시작하기</Link>
          </Button>
        </div>
      </section>
      <section className="bg-accent text-muted-accent flex min-h-screen items-center justify-center py-10">
        <div className="space-y-10 text-center">
          <h1 className="text-5xl font-bold">
            {import.meta.env.VITE_APP_NAME} 기능
          </h1>
          <h3 className="text-2xl">AI 기술로 더 똑똑한 쇼핑을 경험하세요.</h3>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="bg-accent-foreground text-accent mx-auto flex aspect-square w-84 flex-col items-center justify-center gap-10 p-5">
              <div className="bg-accent text-accent-foreground flex size-10 items-center justify-center rounded text-lg font-bold">
                AI
              </div>
              <h3 className="text-2xl font-bold">AI 가상 피팅</h3>
              <p className="text-left">
                최신 인공지능 기술을 활용하여 실제와 같은 피팅 경험을
                제공합니다. 내 몸에 옷이 어떻게 맞는지 확인할 수 있습니다.
              </p>
            </div>
            <div className="bg-accent-foreground text-accent mx-auto flex aspect-square w-84 flex-col items-center justify-center gap-10 p-5">
              <div className="bg-accent flex size-10 items-center justify-center rounded text-lg">
                💰
              </div>
              <h3 className="text-2xl font-bold">스마트 쇼핑</h3>
              <p className="text-left">
                구매 전 미리 확인하여 사이즈 불일치로 인한 반품을 줄이고, 더
                만족스러운 쇼핑을 할 수 있습니다.
              </p>
            </div>
            <div className="bg-accent-foreground text-accent mx-auto flex aspect-square w-84 flex-col items-center justify-center gap-10 p-5">
              <div className="bg-accent flex size-10 items-center justify-center rounded text-lg">
                🔒
              </div>
              <h3 className="text-2xl font-bold">개인정보보호</h3>
              <p className="text-left">
                업로드된 사진은 안전하게 처리되며, 개인정보는 철저히 보호됩니다.
                안심하고 사용할 수 있습니다.
              </p>
            </div>
            <div className="bg-accent-foreground text-accent mx-auto flex aspect-square w-84 flex-col items-center justify-center gap-10 p-5">
              <div className="bg-accent flex size-10 items-center justify-center rounded text-lg">
                📱
              </div>
              <h3 className="text-2xl font-bold">간편한 사용</h3>
              <p className="text-left">
                복잡한 설정 없이 사진만 업로드하면 끝! 누구나 쉽게 사용할 수
                있는 직관적인 인터페이스를 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="flex min-h-screen items-center justify-center p-10">
        <div className="space-y-10 text-center">
          <h1 className="text-5xl font-bold">
            {import.meta.env.VITE_APP_NAME} 사용방법
          </h1>
          <h3 className="text-2xl">3단계로 간단하게 가상 피팅을 경험하세요.</h3>
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 xl:grid-cols-3">
            <div className="mx-auto w-84 space-y-2">
              <img src={"/images/cloth.png"} className="w-84" />
              <h3 className="text-2xl font-bold">1. 옷 선택</h3>
              <p className="text-muted-foreground">
                마음에 드는 옷을 선택하세요.
              </p>
            </div>
            <div className="mx-auto w-84 space-y-2">
              <img src={"/images/user.png"} className="w-84" />
              <h3 className="text-2xl font-bold">2. 사진 업로드</h3>
              <p className="text-muted-foreground">
                본인의 사진을 업로드하세요. 정면을 보고 촬영한 사진이 가장 좋은
                결과를 만들어냅니다.
              </p>
            </div>
            <div className="mx-auto w-84 space-y-2">
              <img src={"/images/result.png"} className="w-84" />
              <h3 className="text-2xl font-bold">3. 결과 확인</h3>
              <p className="text-muted-foreground">
                AI가 생성한 가상 피팅 결과를 확인하고, 마음에 든다면 바로 구매
                페이지로 이동할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-accent text-muted-accent relative flex min-h-screen items-center justify-center text-center">
        <div className="space-y-10">
          <h1 className="text-5xl font-bold">
            지금 바로 {import.meta.env.VITE_APP_NAME} 를 체험해보세요.
          </h1>
          <h3 className="text-2xl">
            매일 3회 무료로 AI 가상 피팅 서비스를 이용해보세요.
          </h3>
          <Button size="lg" className="p-10 text-xl">
            <Link to="/clothes">무료로 시작하기</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
