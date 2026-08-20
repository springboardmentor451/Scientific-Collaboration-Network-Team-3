import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/** Metric tile used on the dashboard and analytics pages. */
export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  tone?: "primary" | "info" | "success" | "warning";
}) {
  const toneMap = {
    primary: "text-primary bg-primary/10",
    info: "text-info bg-info/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/15",
  } as const;

  return (
    <div className="surface-card hover-lift group relative overflow-hidden p-5">
      <div className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100 md:opacity-60" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl", toneMap[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {delta ? <p className="mt-3 text-xs font-medium text-success">{delta}</p> : null}
    </div>
  );
}

/** Loading placeholder matching the StatCard footprint. */
export function StatCardSkeleton() {
  return (
    <div className="surface-card p-5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-8 w-20" />
      <Skeleton className="mt-4 h-3 w-16" />
    </div>
  );
}

/** Section wrapper with a title row and optional action slot. */
export function SectionCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("surface-card p-5 sm:p-6", className)}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold">{title}</h2>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** Friendly empty state for filtered lists and tables. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
