import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "~/core/components/ui/sheet";

export default function PrivacyPolicySheet() {
  return (
    <Sheet>
      <SheetTrigger className="text-muted-foreground hover:text-foreground cursor-pointer underline transition-colors">
        개인정보처리방침
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-1/2 overflow-auto">
        <SheetHeader>개인정보처리방침</SheetHeader>
        <div className="space-y-8">
          <div className="space-y-4 px-10">
            <h3 className="text-lg font-bold">1. 수집하는 개인정보 항목</h3>
            <ul className="list-disc pl-5">
              <li>필수 항목: 이름, 이메일</li>
              <li>
                이미지 정보: 사용자 아바타, 사용자 업로드 사진, 피팅 결과 사진
              </li>
              <li>서비스 이용기록, 접속 IP, 쿠키, 기기 정보 등</li>
            </ul>
          </div>
          <div className="space-y-4 px-10">
            <h3 className="text-lg font-bold">2. 개인정보 수집 목적</h3>
            <ul className="list-disc pl-5">
              <li>피팅 이미지 생성</li>
              <li>회원 식별 및 인증</li>
              <li>서비스 개선 및 개인 맞춤 추천</li>
              <li>고객 문의 응대 및 공지사항 전달</li>
            </ul>
          </div>
          <div className="space-y-4 px-10">
            <h3 className="text-lg font-bold">3. 개인정보 보유 및 이용 기간</h3>
            <ul className="list-disc pl-5">
              <li>회원 탈퇴 시까지 또는 수집 동의 목적 달성 시까지</li>
              <li>
                단, 관련 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관
              </li>
            </ul>
          </div>
          <div className="space-y-4 px-10">
            <h3 className="text-lg font-bold">4. 제3자 제공 및 위탁</h3>
            <ul className="list-disc pl-5">
              <li>
                원칙적으로 제3자에게 제공하지 않으며, 외부 위탁 시 별도 고지 및
                동의 절차를 거침
              </li>
            </ul>
          </div>
          <div className="space-y-4 px-10">
            <h3 className="text-lg font-bold">5. 이용자의 권리 및 행사 방법</h3>
            <ul className="list-disc pl-5">
              <li>자신의 개인정보 열람, 수정, 삭제, 처리정지 요청 가능</li>
            </ul>
          </div>
          <div className="space-y-4 px-10">
            <h3 className="text-lg font-bold">6. 개인정보 보호 책임자</h3>
            <ul className="list-disc pl-5">
              <li>이름: 권오우</li>
              <li>연락처: lammong0118@gmail.com</li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
