"use client";

import type { ImpactCalculation } from "@dynecho/shared";
import { Pill } from "@dynecho/ui";
import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from "recharts";

import { formatDecimal } from "@/lib/format";

import { ChartSurface } from "./chart-surface";
import { buildImpactMetricChartPoints } from "./impact-metric-chart-model";

type ImpactMetricChartProps = {
  impact: ImpactCalculation | null;
};

const STAGE_COLORS = {
  field: "var(--warning)",
  lab: "var(--accent)",
  reference: "var(--line-strong)",
  standardized: "var(--success)"
} as const;

const STAGE_LABELS = {
  field: "Field carry-over",
  lab: "Lab weighted",
  reference: "Reference anchor",
  standardized: "Standardized field"
} as const;

export function ImpactMetricChart({ impact }: ImpactMetricChartProps) {
  const points = buildImpactMetricChartPoints(impact);

  if (points.length === 0) {
    return null;
  }

  const values = points.map((point) => point.value);
  const yDomain: [number, number] = [
    Math.max(0, Math.floor(Math.min(...values) / 5) * 5 - 5),
    Math.ceil(Math.max(...values) / 5) * 5 + 5
  ];
  const visibleKinds = Array.from(new Set(points.map((point) => point.kind)));

  return (
    <div className="mt-4 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-4 py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 max-w-2xl">
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Weighted trajectory</div>
          <h3 className="mt-1 text-sm font-semibold text-[color:var(--ink)]">Impact metric graph</h3>
          <p className="mt-2 text-[0.8rem] leading-5 text-[color:var(--ink-soft)]">
            Lower dB is better. Shows how the impact lane moves from reference values into live weighted results.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {visibleKinds.map((kind) => (
            <Pill key={kind} tone={kind === "reference" ? "neutral" : kind === "lab" ? "accent" : kind === "field" ? "warning" : "success"}>
              {STAGE_LABELS[kind]}
            </Pill>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-3 py-3">
        <ChartSurface className="h-[14rem] sm:h-[16rem]" placeholder="Preparing weighted impact graph...">
          {(size) => (
            <BarChart data={points} height={size.height} margin={{ left: 0, right: 8, top: 8, bottom: 0 }} width={size.width}>
              <CartesianGrid horizontal stroke="var(--line)" strokeDasharray="3 3" />
              <XAxis axisLine={false} dataKey="shortLabel" tickLine={false} tickMargin={8} style={{ fontSize: "0.7rem" }} />
              <YAxis axisLine={false} domain={yDomain} tickFormatter={(value) => `${value}`} tickLine={false} width={36} style={{ fontSize: "0.7rem" }} />
              <Tooltip
                contentStyle={{
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  borderRadius: "0.375rem",
                  color: "var(--ink)",
                  fontSize: "0.8rem"
                }}
                cursor={{ fill: "rgba(0, 0, 0, 0.03)" }}
                formatter={(value) => [`${formatDecimal(Number(value ?? 0))} dB`, "Weighted result"]}
                labelFormatter={(_, payload) => {
                  const point = payload?.[0]?.payload as (typeof points)[number] | undefined;

                  return point ? `${point.label} · ${point.detail}` : "";
                }}
              />
              <Bar dataKey="value" maxBarSize={48} radius={[4, 4, 0, 0]}>
                {points.map((point) => (
                  <Cell fill={STAGE_COLORS[point.kind]} key={point.id} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ChartSurface>
      </div>
    </div>
  );
}
