"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { formatDecimal } from "@/lib/format";

import { ChartSurface } from "./chart-surface";
import type { WorkbenchResponseCurveFigure, WorkbenchResponseCurveSeries } from "./response-curve-model";

type ResponseCurveFigureCardProps = {
  figure: WorkbenchResponseCurveFigure;
};

type CurveReadout = {
  label: string;
  note: string;
  valueLabel: string;
};

type CurveTooltipContentProps = {
  active?: boolean;
  label?: number | string;
  payload?: readonly {
    color?: string;
    dataKey?: string | number;
    name?: string;
    value?: number | string | null;
  }[];
};

const SERIES_COLORS: Record<string, string> = {
  airborne: "var(--accent)",
  field: "var(--warning)",
  source: "var(--ink-soft)",
  standardized: "var(--success)"
};

const CURVE_BANDS = [
  {
    fill: "color-mix(in oklch, var(--accent) 7%, transparent)",
    label: "Low",
    note: "63-250 Hz",
    x1: 63,
    x2: 250
  },
  {
    fill: "color-mix(in oklch, var(--success) 7%, transparent)",
    label: "Speech",
    note: "500-1k Hz",
    x1: 500,
    x2: 1000
  },
  {
    fill: "color-mix(in oklch, var(--warning) 8%, transparent)",
    label: "High",
    note: "2k-4k Hz",
    x1: 2000,
    x2: 4000
  }
] as const;

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
  const values = figure.series.flatMap((series) => series.valuesDb.filter((value) => Number.isFinite(value)));

  if (values.length === 0) {
    return [0, 80];
  }

  return [
    Math.max(0, Math.floor(Math.min(...values) / 5) * 5 - 5),
    Math.ceil(Math.max(...values) / 5) * 5 + 5
  ];
}

function getSeriesColor(seriesId: string): string {
  return SERIES_COLORS[seriesId] ?? "var(--ink)";
}

function getActiveSeries(figure: WorkbenchResponseCurveFigure): WorkbenchResponseCurveSeries | null {
  return figure.series.find((series) => series.id === figure.activeSeriesId) ?? figure.series[0] ?? null;
}

function findClosestBandPoint(series: WorkbenchResponseCurveSeries, targetHz: number): { frequencyHz: number; valueDb: number } | null {
  const pairs = series.frequenciesHz
    .map((frequencyHz, index) => ({
      distance: Math.abs(frequencyHz - targetHz),
      frequencyHz,
      valueDb: series.valuesDb[index]
    }))
    .filter((pair) => Number.isFinite(pair.valueDb))
    .sort((left, right) => left.distance - right.distance);

  const first = pairs[0];

  if (!first || !Number.isFinite(first.valueDb)) {
    return null;
  }

  return {
    frequencyHz: first.frequencyHz,
    valueDb: first.valueDb
  };
}

function buildCurveReadouts(figure: WorkbenchResponseCurveFigure): CurveReadout[] {
  const activeSeries = getActiveSeries(figure);

  if (!activeSeries) {
    return [];
  }

  return [
    { label: "Low band", targetHz: 125 },
    { label: "Speech band", targetHz: 500 },
    { label: "High band", targetHz: 2000 }
  ]
    .map(({ label, targetHz }) => {
      const point = findClosestBandPoint(activeSeries, targetHz);

      if (!point) {
        return null;
      }

      return {
        label,
        note: `${formatFrequencyLabel(point.frequencyHz)} Hz anchor`,
        valueLabel: `${formatDecimal(point.valueDb)} dB`
      };
    })
    .filter((entry): entry is CurveReadout => entry !== null);
}

function getDirectionLabel(direction: WorkbenchResponseCurveFigure["direction"]): string {
  return direction === "higher_better" ? "Higher is better" : "Lower is better";
}

function CurveTooltipContent({ active, label, payload }: CurveTooltipContentProps) {
  if (!active || !payload || payload.length === 0 || typeof label !== "number") {
    return null;
  }

  return (
    <div className="min-w-[10rem] rounded-[0.9rem] border border-[color:color-mix(in_oklch,var(--ink)_10%,var(--line))] bg-[color:color-mix(in_oklch,var(--paper)_92%,white)] px-3 py-2.5 shadow-[0_14px_34px_-24px_rgba(18,25,33,0.45)]">
      <div className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Band</div>
      <div className="mt-1 text-sm font-semibold text-[color:var(--ink)]">{label} Hz</div>
      <div className="mt-2 grid gap-1.5">
        {payload.map((entry) => {
          if (!Number.isFinite(Number(entry.value))) {
            return null;
          }

          return (
            <div className="flex items-center justify-between gap-3 text-[0.78rem]" key={String(entry.dataKey ?? entry.name ?? entry.value)}>
              <div className="flex items-center gap-2 text-[color:var(--ink-soft)]">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: entry.color ?? "var(--ink)" }} />
                <span>{entry.name}</span>
              </div>
              <span className="font-semibold tabular-nums text-[color:var(--ink)]">{formatDecimal(Number(entry.value))} dB</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ResponseCurveFigureCard({ figure }: ResponseCurveFigureCardProps) {
  const chartRows = buildChartRows(figure);
  const yDomain = buildYDomain(figure);
  const frequencies = Array.from(new Set(figure.series.flatMap((series) => series.frequenciesHz))).sort((left, right) => left - right);
  const readouts = buildCurveReadouts(figure);
  const frequencyDomain: [number, number] =
    frequencies.length > 0 ? [Math.min(...frequencies), Math.max(...frequencies)] : [63, 4000];

  return (
    <article className="relative overflow-hidden rounded-[1.15rem] border border-[color:color-mix(in_oklch,var(--ink)_8%,var(--line))] bg-[linear-gradient(180deg,color-mix(in_oklch,var(--paper)_92%,white)_0%,color-mix(in_oklch,var(--panel)_56%,white)_100%)] px-4 py-4 shadow-[0_20px_50px_-38px_rgba(12,23,33,0.55)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklch,var(--accent)_12%,transparent),transparent_68%)]" />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
              {figure.id === "impact" ? "Impact spectrum" : "Airborne spectrum"}
            </div>
            <h3 className="mt-1 text-[1rem] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">{figure.title}</h3>
            <p className="mt-2 max-w-2xl text-[0.82rem] leading-6 text-[color:var(--ink-soft)]">{figure.note}</p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <span className="inline-flex items-center rounded-full border border-[color:color-mix(in_oklch,var(--accent)_22%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_10%,var(--paper))] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--accent-ink)]">
              {figure.domainLabel}
            </span>
            <span className="inline-flex items-center rounded-full border border-[color:var(--line)] bg-[color:var(--paper)] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-soft)]">
              {getDirectionLabel(figure.direction)}
            </span>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-[1rem] border border-[color:color-mix(in_oklch,var(--ink)_8%,var(--line))] bg-[linear-gradient(180deg,color-mix(in_oklch,var(--paper)_86%,white)_0%,color-mix(in_oklch,var(--panel)_72%,white)_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Log-spaced band view</div>
            <div className="flex flex-wrap gap-1.5">
              {CURVE_BANDS.map((band) => (
                <span
                  className="inline-flex items-center rounded-full border border-[color:var(--line)] bg-[color:var(--paper)] px-2 py-0.5 text-[0.66rem] font-medium text-[color:var(--ink-soft)]"
                  key={band.label}
                >
                  {band.label} · {band.note}
                </span>
              ))}
            </div>
          </div>

          <ChartSurface className="h-[15.5rem] sm:h-[17rem]" placeholder="Preparing response curve...">
            {(size) => (
              <LineChart data={chartRows} height={size.height} margin={{ left: 0, right: 10, top: 8, bottom: 10 }} width={size.width}>
                {CURVE_BANDS.map((band) => (
                  <ReferenceArea fill={band.fill} fillOpacity={1} ifOverflow="extendDomain" key={band.label} x1={band.x1} x2={band.x2} />
                ))}
                <CartesianGrid stroke="color-mix(in_oklch,var(--ink)_10%,var(--line))" strokeDasharray="3 7" vertical={false} />
                <XAxis
                  allowDataOverflow
                  axisLine={false}
                  dataKey="frequencyHz"
                  domain={frequencyDomain}
                  minTickGap={8}
                  scale="log"
                  tick={{ fill: "var(--ink-faint)", fontSize: 11, fontWeight: 600 }}
                  tickFormatter={(value) => formatFrequencyLabel(Number(value))}
                  tickLine={false}
                  ticks={frequencies}
                  type="number"
                />
                <YAxis
                  axisLine={false}
                  domain={yDomain}
                  tick={{ fill: "var(--ink-faint)", fontSize: 11, fontWeight: 600 }}
                  tickFormatter={(value) => `${value}`}
                  tickLine={false}
                  width={38}
                />
                <Tooltip content={<CurveTooltipContent />} cursor={{ stroke: "color-mix(in_oklch,var(--ink)_18%,var(--line))", strokeDasharray: "4 5" }} />
                {figure.series.map((series) => (
                  <Line
                    connectNulls
                    dataKey={series.id}
                    dot={{
                      fill: getSeriesColor(series.id),
                      r: series.active ? 2.8 : 2.2,
                      stroke: "color-mix(in_oklch,var(--paper)_92%,white)",
                      strokeWidth: 1.6
                    }}
                    isAnimationActive={false}
                    key={series.id}
                    name={series.label}
                    stroke={getSeriesColor(series.id)}
                    strokeDasharray={series.active ? undefined : "6 5"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={series.active ? 2.75 : 1.75}
                    type="monotone"
                  />
                ))}
              </LineChart>
            )}
          </ChartSurface>
        </div>

        {readouts.length > 0 ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {readouts.map((readout) => (
              <div className="rounded-[0.9rem] border border-[color:color-mix(in_oklch,var(--ink)_8%,var(--line))] bg-[color:var(--paper)]/80 px-3 py-3" key={readout.label}>
                <div className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{readout.label}</div>
                <div className="mt-2 text-[0.94rem] font-semibold tabular-nums text-[color:var(--ink)]">{readout.valueLabel}</div>
                <div className="mt-1 text-[0.76rem] leading-5 text-[color:var(--ink-soft)]">{readout.note}</div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-3 grid gap-2">
          {figure.series.map((series) => (
            <div
              className="flex flex-wrap items-start justify-between gap-3 rounded-[0.9rem] border border-[color:color-mix(in_oklch,var(--ink)_8%,var(--line))] bg-[color:var(--paper)]/72 px-3 py-3"
              key={series.id}
            >
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className="mt-1 h-2.5 w-8 rounded-full"
                  style={{
                    background: getSeriesColor(series.id),
                    opacity: series.active ? 1 : 0.64
                  }}
                />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[color:var(--ink)]">{series.label}</div>
                  <div className="mt-1 text-[0.78rem] leading-5 text-[color:var(--ink-soft)]">
                    {series.active ? "Active solver curve on the current lane." : "Supporting comparison trace for context."}
                  </div>
                </div>
              </div>
              <div className="rounded-full border border-[color:var(--line)] bg-[color:var(--paper)] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-soft)]">
                {series.active ? "Active" : "Reference"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
