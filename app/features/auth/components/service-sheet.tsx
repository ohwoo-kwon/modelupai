import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "~/core/components/ui/sheet";

export default function ServiceSheet() {
  return (
    <Sheet>
      <SheetTrigger className="text-muted-foreground hover:text-foreground cursor-pointer underline transition-colors">
        서비스 이용약관
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-1/2 overflow-auto">
        <SheetHeader>서비스 이용약관</SheetHeader>
        <div className="space-y-8">
          <h1 className="pl-10 font-bold">
            본 약관은 {import.meta.env.VITE_APP_NAME}(이하 "회사")가 제공하는
            서비스 이용과 관련하여 회원과 회사 간의 권리, 의무 및 책임사항을
            규정합니다.
          </h1>
          <div className="space-y-4 px-10">
            <h3 className="text-lg font-bold">제1조 (목적)</h3>
            <ul className="list-decimal pl-5">
              <li>
                본 약관은 회사가 제공하는 AI 가상 피팅 서비스의 이용과 관련하여
                회사와 회원 간의 권리, 의무 및 책임사항, 이용조건 및 절차 등을
                규정합니다.
              </li>
            </ul>
          </div>
          <div className="space-y-4 px-10">
            <h3 className="text-lg font-bold">제2조 (회원가입 및 이용계약)</h3>
            <ul className="list-decimal pl-5">
              <li>
                회원은 회사가 정한 절차에 따라 회원가입을 완료함으로써 서비스
                이용계약을 체결합니다.
              </li>
              <li>회사는 필요한 경우 본인확인을 요청할 수 있습니다.</li>
            </ul>
          </div>
          <div className="space-y-4 px-10">
            <h3 className="text-lg font-bold">제3조 (서비스 내용)</h3>
            <ul className="list-decimal pl-5">
              <li>
                회원이 업로드한 전신 사진과 의류 이미지를 기반으로 AI가 피팅
                이미지를 생성
              </li>
            </ul>
          </div>
          <div className="space-y-4 px-10">
            <h3 className="text-lg font-bold">제4조 (회원의 의무)</h3>
            <ul className="list-decimal pl-5">
              <li>타인의 정보를 도용하거나 허위 정보를 등록해서는 안 됨</li>
              <li>
                저작권이 없는 의류 이미지 및 자신의 사진만을 업로드해야 함
              </li>
              <li>
                AI 이미지가 생성한 콘텐츠에 대해 제3자의 권리를 침해하지 않도록
                주의해야 함
              </li>
            </ul>
          </div>
          <div className="space-y-4 px-10">
            <h3 className="text-lg font-bold">제5조 (저작권 및 사용권)</h3>
            <ul className="list-decimal pl-5">
              <li>상업적 이용 시 회사의 사전 승인이 필요합니다.</li>
            </ul>
          </div>
          <div className="space-y-4 px-10">
            <h3 className="text-lg font-bold">제6조 (서비스의 변경 및 중단)</h3>
            <ul className="list-decimal pl-5">
              <li>
                회사는 서비스의 내용 또는 기능을 개선하거나 변경할 수 있습니다.
              </li>
              <li>
                부득이한 사정이 있을 경우 일부 또는 전체 서비스를 일시 중단할 수
                있습니다.
              </li>
            </ul>
          </div>
          <div className="space-y-4 px-10">
            <h3 className="text-lg font-bold">제7조 (면책 조항)</h3>
            <ul className="list-decimal pl-5">
              <li>
                회원이 입력하거나 업로드한 이미지로 인해 발생하는 문제에 대해
                회사는 책임을 지지 않습니다.
              </li>
              <li>
                AI가 생성한 이미지의 정확성, 완성도에 대해서는 보장하지
                않습니다.
              </li>
            </ul>
          </div>
          <div className="space-y-4 px-10">
            <h3 className="text-lg font-bold">제8조 (약관의 변경)</h3>
            <ul className="list-decimal pl-5">
              <li>
                회사는 관련 법령을 위반하지 않는 범위에서 약관을 개정할 수
                있으며, 변경 시 공지사항 또는 이메일로 고지합니다.
              </li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
