import { Loader2Icon } from "lucide-react";
import { useNavigation } from "react-router";

import { cn } from "../lib/utils";
import { Button } from "./ui/button";

export default function FormButton({
  label,
  className,
  ...props
}: { label: string; className?: string } & React.ComponentProps<"button">) {
  const navigation = useNavigation();

  const submitting = navigation.state === "submitting";

  return (
    <Button
      className={cn(className)}
      type="submit"
      disabled={submitting} // 연속 클릭 방지
      {...props}
    >
      {submitting ? <Loader2Icon className="size-4 animate-spin" /> : label}
    </Button>
  );
}
