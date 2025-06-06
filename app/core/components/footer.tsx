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
      <div className="order-1 flex gap-5 *:underline md:order-none">
        <PrivacyPolicySheet />
        <ServiceSheet />
      </div>
    </footer>
  );
}
