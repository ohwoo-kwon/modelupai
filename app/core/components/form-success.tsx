import { CheckCircle2Icon } from "lucide-react";

export default function FormSuccess({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-sm text-green-500">
      <CheckCircle2Icon className="size-4" />
      <p>{message}</p>
    </div>
  );
}
