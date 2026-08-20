import { cn } from "@/lib/utils";

/** Colored pill for publication / project / registration states. */
const toneStyles = {
  success: "bg-success/12 text-success border-success/25",
  info: "bg-info/12 text-info border-info/25",
  warning: "bg-warning/18 text-warning border-warning/30",
  neutral: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary/10 text-primary border-primary/25",
} as const;

export type BadgeTone = keyof typeof toneStyles;

export function StatusBadge({
  label,
  tone = "neutral",
  className,
}: {
  label: string;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        toneStyles[tone],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

/** Maps domain statuses to badge tones so colors stay consistent app-wide. */
export function toneForStatus(status: string): BadgeTone {
  switch (status) {
    case "Published":
    case "Active":
    case "Registered":
    case "Completed":
      return "success";
    case "Under Review":
    case "Analysis":
    case "Abstract Submitted":
    case "Visiting":
      return "info";
    case "Preprint":
    case "Invited Speaker":
      return "primary";
    case "Pending":
    case "On Leave":
    case "Proposal":
      return "warning";
    default:
      return "neutral";
  }
}
