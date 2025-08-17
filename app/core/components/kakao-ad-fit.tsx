import { useEffect } from "react";

export default function KakaoAdfit() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <ins
      className="kakao_ad_area hidden"
      data-ad-unit="DAN-FuljBuv7XU5ha40H"
      data-ad-width="320"
      data-ad-height="100"
    />
  );
}
