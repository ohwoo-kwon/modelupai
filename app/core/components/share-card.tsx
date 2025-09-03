import { CopyIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";

export default function ShareCard({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const [copySuccess, setCopySuccess] = useState(false);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    kakao: `https://story.kakao.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    line: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`,
  };

  const openShareWindow = (url: string) => {
    window.open(
      url,
      "share",
      "width=600,height=400,scrollbars=yes,resizable=yes",
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      // clipboard API가 실패한 경우 fallback
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>공유하기</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-muted-foreground text-sm">링크 복사</p>
          <div className="flex gap-2">
            <Input defaultValue={url} readOnly />
            <Button onClick={handleCopyLink}>
              <CopyIcon />
              {copySuccess ? "복사됨!" : "복사"}
            </Button>
          </div>
        </div>
        {/* <div>
          <p className="text-muted-foreground text-sm">소셜 미디어</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(shareUrls).map(([k, v]) => (
              <Button
                key={`share_button_${k}`}
                onClick={() => openShareWindow(v)}
              >
                {k}
              </Button>
            ))}
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}
