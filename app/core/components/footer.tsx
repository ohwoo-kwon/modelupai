import { Link } from "react-router";

import PrivacyPolicySheet from "~/features/auth/components/privacy-policy-sheet";
import ServiceSheet from "~/features/auth/components/service-sheet";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-2 border-t p-3 text-sm md:flex-row md:py-5">
      <div className="order-2 md:order-none">
        <p>
          &copy; {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME}. All
          rights reserved.
        </p>
      </div>
      <div className="order-1 *:underline md:order-none">
        <Link to="/legal/policy">서비스 이용약관 및 개인정보처리방침</Link>
      </div>
    </footer>
  );
}
