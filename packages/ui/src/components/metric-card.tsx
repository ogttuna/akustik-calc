import type { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: string;
  detail?: ReactNode;
};

export function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <article className="pointer-card rounded-[1.35rem] border hairline bg-black/[0.025] p-4">
      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--ink-faint)]">
        {label}
      </div>
      <div className="metric-number mt-3 font-display text-3xl text-[color:var(--ink)]">{value}</div>
      {detail ? <div className="mt-2 text-sm text-[color:var(--ink-soft)]">{detail}</div> : null}
    </article>
  );
}
