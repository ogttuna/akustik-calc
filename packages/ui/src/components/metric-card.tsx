import type { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: string;
  detail?: ReactNode;
};

export function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <article className="rounded-md border hairline bg-[color:var(--paper)] px-3 py-2.5">
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
        {label}
      </div>
      <div className="metric-number mt-1.5 text-2xl font-semibold text-[color:var(--ink)]">{value}</div>
      {detail ? <div className="mt-1 text-[0.8rem] leading-5 text-[color:var(--ink-soft)]">{detail}</div> : null}
    </article>
  );
}
