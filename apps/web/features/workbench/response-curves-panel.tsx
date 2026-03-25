"use client";

import type { AssemblyCalculation } from "@dynecho/shared";
import { Pill, SurfacePanel } from "@dynecho/ui";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

import { formatDecimal } from "@/lib/format";

import { ChartSurface } from "./chart-surface";
import { buildWorkbenchResponseCurveFigures, type WorkbenchResponseCurveFigure } from "./response-curve-model";

type ResponseCurvesPanelProps = {
  result: AssemblyCalculation | null;
};

const SERIES_COLORS: Record<string, string> = {
  airborne: "var(--accent)",
  field: "var(--warning)",
  source: "var(--ink)",
  standardized: "var(--success)"
};

function formatFrequencyLabel(frequencyHz: number): string {
  if (frequencyHz >= 1000) {
    const kiloHertz = frequencyHz / 1000;
    return `${Number.isInteger(kiloHertz) ? kiloHertz : kiloHertz.toFixed(kiloHertz >= 2 ? 1 : 2)}k`;
  }

  return String(frequencyHz);
}

function buildChartRows(figure: WorkbenchResponseCurveFigure): Record<string, number | string | null>[] {
  const frequencies = Array.from(new Set(figure.series.flatMap((series) => series.frequenciesHz))).sort((left, right) => left - right);

  return frequencies.map((frequencyHz) => {
    const row: Record<string, number | string | null> = {
      frequencyHz,
      label: formatFrequencyLabel(frequencyHz)
    };

    for (const series of figure.series) {
      const valueIndex = series.frequenciesHz.findIndex((value) => value === frequencyHz);
      row[series.id] = valueIndex >= 0 ? series.valuesDb[valueIndex] ?? null : null;
    }

    return row;
  });
}

function buildYDomain(figure: WorkbenchResponseCurveFigure): [number, number] {
  const values = figure.series.flatMap((series) => series.valuesDb);

  if (values.length === 0) {
    return [0, 80];
  }

  return [
    Math.max(0, Math.floor(Math.min(...values) / 5) * 5 - 5),
    Math.ceil(Math.max(...values) / 5) * 5 + 5
  ];
}

export function ResponseCurvesPanel({ result }: ResponseCurvesPanelProps) {
  const figures = buildWorkbenchResponseCurveFigures(result);

  if (!result) {
    return null;
  }

  return (
    <SurfacePanel className="px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-[color:var(--ink)]">Response curves</h2>
        <div className="flex flex-wrap gap-2">
          <Pill tone="accent">Solver band data</Pill>
          {figures.some((figure) => figure.id === "impact") ? <Pill tone="success">Impact live</Pill> : <Pill tone="neutral">Impact unavailable</Pill>}
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {figures.map((figure) => {
          const chartRows = buildChartRows(figure);
          const yDomain = buildYDomain(figure);

          return (
            <article className="rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-4 py-3" key={figure.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-[0.84rem] font-semibold text-[color:var(--ink)]">{figure.title}</div>
                <div className="flex flex-wrap gap-2">
                  <Pill tone="neutral">{figure.domainLabel}</Pill>
                  <Pill tone={figure.direction === "higher_better" ? "success" : "warning"}>
                    {figure.direction === "higher_better" ? "Higher better" : "Lower better"}
                  </Pill>
                </div>
              </div>

              <div className="mt-3 rounded border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-3 py-3">
                <ChartSurface className="h-[14rem] sm:h-[16rem]" placeholder="Preparing response curve...">
                  {(size) => (
                    <LineChart data={chartRows} height={size.height} margin={{ left: 0, right: 8, top: 12, bottom: 0 }} width={size.width}>
                      <CartesianGrid horizontal stroke="var(--line)" strokeDasharray="3 3" />
                      <XAxis axisLine={false} dataKey="label" minTickGap={12} tickLine={false} tickMargin={8} style={{ fontSize: "0.7rem" }} />
                      <YAxis axisLine={false} domain={yDomain} tickFormatter={(value) => `${value}`} tickLine={false} width={36} style={{ fontSize: "0.7rem" }} />
                      <Tooltip
                        contentStyle={{
                          background: "var(--paper)",
                          border: "1px solid var(--line)",
                          borderRadius: "0.375rem",
                          color: "var(--ink)",
                          fontSize: "0.8rem"
                        }}
                        formatter={(value, name) => [`${formatDecimal(Number(value ?? 0))} dB`, String(name)]}
                        labelFormatter={(label) => `${label} Hz`}
                      />
                      {figure.series.map((series) => (
                        <Line
                          dataKey={series.id}
                          dot={{ fill: SERIES_COLORS[series.id] ?? "var(--ink)", r: 2, stroke: "var(--paper)", strokeWidth: 1.5 }}
                          key={series.id}
                          name={series.label}
                          stroke={SERIES_COLORS[series.id] ?? "var(--ink)"}
                          strokeDasharray={series.active ? undefined : "5 5"}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={series.active ? 2.5 : 1.5}
                          type="monotone"
                        />
                      ))}
                    </LineChart>
                  )}
                </ChartSurface>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {figure.series.map((series) => (
                  <Pill key={series.id} tone={series.active ? "accent" : "neutral"}>
                    {series.label}
                  </Pill>
                ))}
              </div>
            </article>
          );
        })}

        {!figures.some((figure) => figure.id === "impact") ? (
          <div className="rounded border border-dashed border-[color:var(--line)] px-4 py-3 text-[0.82rem] text-[color:var(--ink-soft)]">
            Impact band data not available on this lane.
          </div>
        ) : null}
      </div>
    </SurfacePanel>
  );
}
