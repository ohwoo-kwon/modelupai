// app/routes/terms.tsx
import type { Route } from "./+types/policy";

import { useState } from "react";

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: `서비스 이용약관 및 개인정보처리방침 | ${import.meta.env.VITE_APP_NAME}`,
    },
    {
      name: "description",
      content: `${import.meta.env.VITE_APP_NAME}의 이용약관과 개인정보처리방침을 확인하세요.`,
    },
  ];
};

export default function Policy() {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <h1 className="text-xl font-bold text-gray-900">
            서비스 이용약관 및 개인정보처리방침
          </h1>
          <p className="mt-2 text-gray-600">
            {import.meta.env.VITE_APP_NAME} 이용에 관한 약관과 개인정보 보호
            정책입니다.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Tab Navigation */}
        <div className="mb-6 rounded-lg bg-white shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab("terms")}
                className={`w-full border-b-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "terms"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                서비스 이용약관
              </button>
              <button
                onClick={() => setActiveTab("privacy")}
                className={`w-full border-b-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "privacy"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                개인정보처리방침
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === "terms" ? <TermsContent /> : <PrivacyContent />}
          </div>
        </div>
      </div>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="prose prose-gray max-w-none">
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          서비스 이용약관
        </h2>
        <p className="text-sm text-gray-600">최종 업데이트: 2025년 9월 15일</p>
      </div>

      <section className="mb-8">
        <h3 className="mb-3 text-xl font-semibold text-gray-900">
          제1조 (목적)
        </h3>
        <p className="leading-relaxed text-gray-700">
          이 약관은 [회사명](이하 "회사")이 제공하는 $
          {import.meta.env.VITE_APP_NAME}(이하 "서비스")의 이용과 관련하여
          회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을
          목적으로 합니다.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="mb-3 text-xl font-semibold text-gray-900">
          제2조 (정의)
        </h3>
        <div className="space-y-3">
          <div>
            <span className="font-medium">1. "서비스"</span>
            <span className="text-gray-700">
              란 회사가 제공하는 AI를 활용한 가상 의류 피팅 서비스를 말합니다.
            </span>
          </div>
          <div>
            <span className="font-medium">2. "이용자"</span>
            <span className="text-gray-700">
              란 회사의 서비스에 접속하여 이 약관에 따라 회사가 제공하는
              서비스를 받는 회원 및 비회원을 말합니다.
            </span>
          </div>
          <div>
            <span className="font-medium">3. "회원"</span>
            <span className="text-gray-700">
              이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의
              정보를 지속적으로 제공받으며 회사가 제공하는 서비스를 계속적으로
              이용할 수 있는 자를 말합니다.
            </span>
          </div>
          <div>
            <span className="font-medium">4. "다이아"</span>
            <span className="text-gray-700">
              란 서비스 내에서 사용되는 가상화폐로, 현금으로 충전하여 AI 피팅
              서비스 이용 시 차감되는 포인트를 말합니다.
            </span>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="mb-3 text-xl font-semibold text-gray-900">
          제3조 (약관의 명시와 설명 및 개정)
        </h3>
        <div className="space-y-3 text-gray-700">
          <p>
            1. 회사는 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소,
            전화번호, 모사전송번호, 전자우편주소, 사업자등록번호 등을 이용자가
            쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.
          </p>
          <p>
            2. 회사는 약관의 규제에 관한 법률, 전자상거래 등에서의 소비자보호에
            관한 법률, 전자문서 및 전자거래기본법, 전자금융거래법, 전자서명법,
            정보통신망 이용촉진 및 정보보호 등에 관한 법률, 방문판매 등에 관한
            법률, 소비자기본법 등 관련 법을 위배하지 않는 범위에서 이 약관을
            개정할 수 있습니다.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="mb-3 text-xl font-semibold text-gray-900">
          제4조 (서비스의 제공 및 변경)
        </h3>
        <div className="space-y-3 text-gray-700">
          <p>1. 회사는 다음과 같은 업무를 수행합니다.</p>
          <ul className="ml-4 list-inside list-disc space-y-1">
            <li>AI를 활용한 가상 의류 피팅 서비스 제공</li>
            <li>사용자 업로드 이미지와 의류 이미지를 합성한 결과물 생성</li>
            <li>다이아 충전 및 결제 서비스 제공</li>
            <li>기타 회사가 정하는 업무</li>
          </ul>
          <p>
            2. 회사는 운영상, 기술상의 필요에 따라 제공하고 있는 전부 또는 일부
            서비스를 변경할 수 있습니다.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="mb-3 text-xl font-semibold text-gray-900">
          제8조 (다이아 충전 및 사용)
        </h3>
        <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="text-gray-700">
            <span className="font-medium text-blue-800">1.</span> 회원은 현금을
            이용하여 다이아를 충전할 수 있습니다.
          </div>
          <div className="text-gray-700">
            <span className="font-medium text-blue-800">2.</span> 충전된
            다이아는 AI 가상 피팅 이용 시 차감됩니다.
          </div>
          <div className="text-gray-700">
            <span className="font-medium text-blue-800">3.</span> 다이아는
            현금으로 환불되지 않으며, 계정 삭제 시 소멸됩니다.
          </div>
          <div className="text-gray-700">
            <span className="font-medium text-blue-800">4.</span> 다이아의
            유효기간은 무제한입니다.
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="mb-3 text-xl font-semibold text-gray-900">
          제9조 (이용자의 의무)
        </h3>
        <p className="mb-3 text-gray-700">
          이용자는 다음 행위를 하여서는 안 됩니다.
        </p>
        <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700">
          <li>신청 또는 변경 시 허위 내용의 등록</li>
          <li>타인의 정보 도용</li>
          <li>회사가 게시한 정보의 변경</li>
          <li>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
          <li>
            외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를
            회사에 공개 또는 게시하는 행위
          </li>
          <li className="font-medium text-red-600">
            타인의 개인정보나 사진을 무단으로 업로드하는 행위
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="mb-3 text-xl font-semibold text-gray-900">
          제10조 (저작권의 귀속 및 이용제한)
        </h3>
        <div className="space-y-3 text-gray-700">
          <p>
            1. 회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에
            귀속합니다.
          </p>
          <p>
            2. 이용자는 서비스를 이용함으로써 얻은 정보 중 회사에게 지적재산권이
            귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송
            기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게
            하여서는 안됩니다.
          </p>
          <p className="rounded border border-yellow-200 bg-yellow-50 p-3">
            <span className="font-medium">3.</span> 이용자가 업로드한 사진 및
            생성된 피팅 결과물에 대한 저작권은 이용자에게 있으나, 회사는 서비스
            개선 및 품질 향상을 위해 해당 데이터를 익명화하여 활용할 수
            있습니다.
          </p>
        </div>
      </section>

      <div className="mt-12 border-t border-gray-200 pt-8">
        <p className="text-sm text-gray-600">
          <strong>부칙:</strong> 이 약관은 2025년 9월 15일부터 적용됩니다.
        </p>
      </div>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div className="prose prose-gray max-w-none">
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          개인정보처리방침
        </h2>
        <p className="text-sm text-gray-600">최종 업데이트: 2025년 9월 15일</p>
      </div>

      <section className="mb-8">
        <h3 className="mb-3 text-xl font-semibold text-gray-900">
          1. 개인정보의 처리목적
        </h3>
        <p className="mb-3 text-gray-700">
          회사는 다음의 목적을 위하여 개인정보를 처리하고 있으며, 다음의 목적
          이외의 용도로는 이용하지 않습니다.
        </p>
        <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700">
          <li>회원가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</li>
          <li>AI 피팅 서비스 제공 및 맞춤형 서비스 제공</li>
          <li>다이아(가상화폐) 충전 및 결제 서비스 제공</li>
          <li>서비스 이용에 따른 정산 및 요금결제</li>
          <li>고충처리, 분쟁조정을 위한 기록보존</li>
          <li>법령 및 회사약관을 위반하는 회원에 대한 이용제한 조치</li>
          <li>서비스 개선 및 신규 서비스 개발</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="mb-3 text-xl font-semibold text-gray-900">
          2. 개인정보의 처리 및 보유 기간
        </h3>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-2 font-semibold text-gray-900">회원정보</h4>
            <p className="mb-1 text-sm text-gray-700">
              <span className="font-medium">수집항목:</span> 이메일, 이름,
              프로필 사진
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">보유기간:</span> 회원탈퇴 시까지
              (단, 관계법령에 따라 보존이 필요한 경우 해당 기간까지)
            </p>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="mb-2 font-semibold text-gray-900">
              서비스 이용정보
            </h4>
            <p className="mb-1 text-sm text-gray-700">
              <span className="font-medium">수집항목:</span> 업로드된 사진, 피팅
              결과물, 이용 기록, 다이아 충전/사용 내역
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">보유기간:</span> 서비스 제공을 위해
              필요한 기간 (사용자가 삭제 요청 시 즉시 삭제)
            </p>
          </div>

          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h4 className="mb-2 font-semibold text-gray-900">결제정보</h4>
            <p className="mb-1 text-sm text-gray-700">
              <span className="font-medium">수집항목:</span> 결제 금액, 결제
              방법, 거래 내역
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">보유기간:</span> 전자상거래법에 따라
              5년
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="mb-3 text-xl font-semibold text-gray-900">
          3. 개인정보의 제3자 제공
        </h3>
        <p className="mb-3 text-gray-700">
          회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만,
          아래의 경우에는 예외로 합니다.
        </p>
        <ul className="ml-4 list-inside list-disc space-y-1 text-gray-700">
          <li>이용자들이 사전에 동의한 경우</li>
          <li>
            법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에
            따라 수사기관의 요구가 있는 경우
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="mb-3 text-xl font-semibold text-gray-900">
          4. 개인정보처리 위탁
        </h3>
        <p className="mb-4 text-gray-700">
          회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보
          처리업무를 위탁하고 있습니다.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <h4 className="mb-2 font-semibold text-purple-900">
              AI 이미지 처리 서비스
            </h4>
            <p className="mb-1 text-sm text-gray-700">
              <span className="font-medium">위탁받는 자:</span> AI 서비스
              제공업체
            </p>
            <p className="mb-1 text-sm text-gray-700">
              <span className="font-medium">위탁업무:</span> 이미지 AI 처리 및
              피팅 결과 생성
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">보유 및 이용기간:</span> 처리 완료
              후 즉시 삭제
            </p>
          </div>

          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
            <h4 className="mb-2 font-semibold text-orange-900">결제 서비스</h4>
            <p className="mb-1 text-sm text-gray-700">
              <span className="font-medium">위탁받는 자:</span> 전자결제업체
            </p>
            <p className="mb-1 text-sm text-gray-700">
              <span className="font-medium">위탁업무:</span> 다이아 충전 결제
              처리
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">보유 및 이용기간:</span> 거래 완료
              후 법정 보관기간
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="mb-3 text-xl font-semibold text-gray-900">
          5. 정보주체의 권리·의무 및 그 행사방법
        </h3>
        <p className="mb-3 text-gray-700">
          이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.
        </p>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <ul className="list-inside list-disc space-y-1 text-gray-700">
            <li>개인정보 처리현황 통지요구</li>
            <li>개인정보 열람요구</li>
            <li>개인정보 정정·삭제요구</li>
            <li>개인정보 처리정지요구</li>
          </ul>
        </div>
        <p className="mt-3 text-gray-700">
          권리 행사는 개인정보보호법 시행령 제41조제1항에 따라 서면, 전자우편
          등을 통하여 하실 수 있으며, 회사는 이에 대해 지체 없이 조치하겠습니다.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="mb-3 text-xl font-semibold text-gray-900">
          6. 개인정보의 안전성 확보조치
        </h3>
        <p className="mb-3 text-gray-700">
          회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한
          기술적/관리적 및 물리적 조치를 하고 있습니다.
        </p>
        <ul className="ml-4 list-inside list-disc space-y-1 text-gray-700">
          <li>개인정보 취급 직원의 최소화 및 교육</li>
          <li>개인정보에 대한 접근 제한</li>
          <li>접속기록의 보관 및 위변조 방지</li>
          <li>개인정보의 암호화</li>
          <li>보안프로그램 설치 및 갱신</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="mb-3 text-xl font-semibold text-gray-900">
          8. 개인정보보호책임자
        </h3>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="mb-3 text-gray-700">
            회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
            처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와
            같이 개인정보보호책임자를 지정하고 있습니다.
          </p>
          <div className="space-y-2">
            <p>
              <span className="font-medium">성명:</span> [담당자 이름]
            </p>
            <p>
              <span className="font-medium">연락처:</span> [이메일 주소],
              [전화번호]
            </p>
          </div>
        </div>
      </section>

      <div className="mt-12 border-t border-gray-200 pt-8">
        <p className="text-sm text-gray-600">
          이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른
          변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일
          전부터 공지사항을 통하여 고지할 것입니다.
        </p>
      </div>
    </div>
  );
}
