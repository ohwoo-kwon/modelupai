import { Loader2Icon } from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "./ui/button";

export default function FetcherFormButton({
  label,
  className,
  submitting,
  ...props
}: {
  label: string;
  className?: string;
  submitting: boolean;
} & React.ComponentProps<"button">) {
  return (
    <Button
      className={cn(className)}
      type="submit"
      disabled={submitting}
      {...props}
    >
      {submitting ? <Loader2Icon className="size-4 animate-spin" /> : label}
    </Button>
  );
}
