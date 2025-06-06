import { XCircleIcon } from "lucide-react";

export default function FormErrors({ errors }: { errors: string[] }) {
  return (
    <div className="space-y-2 text-sm text-red-500">
      {errors.map((error, index) => (
        <p key={index} className="flex items-center gap-2">
          <XCircleIcon className="size-4" />
          {error}
        </p>
      ))}
    </div>
  );
}
