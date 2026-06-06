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

import { ChartSurface } from "../workbench/chart-surface";
import type { WorkbenchResponseCurveFigure, WorkbenchResponseCurveSeries } from "../workbench/response-curve-model";

type ProfessionalResponseCurveProps = {
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

const CURVE_SERIES_COLORS: Record<string, string> = {
  airborne: "var(--curve-series-airborne)",
  field: "var(--curve-series-field)",
  source: "var(--curve-series-source)",
  standardized: "var(--curve-series-standardized)"
};

const CURVE_BANDS = [
  {
    className: "rebuild-curve-band-low",
    label: "Low",
    note: "63-250 Hz",
    x1: 63,
    x2: 250
  },
  {
    className: "rebuild-curve-band-speech",
    label: "Speech",
    note: "500-1k Hz",
    x1: 500,
    x2: 1000
  },
  {
    className: "rebuild-curve-band-high",
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

function getFigureFrequencies(figure: WorkbenchResponseCurveFigure): number[] {
  return Array.from(new Set(figure.series.flatMap((series) => series.frequenciesHz)))
    .filter((frequencyHz) => Number.isFinite(frequencyHz) && frequencyHz > 0)
    .sort((left, right) => left - right);
}

function buildChartRows(figure: WorkbenchResponseCurveFigure): Record<string, number | string | null>[] {
  return getFigureFrequencies(figure).map((frequencyHz) => {
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
  return CURVE_SERIES_COLORS[seriesId] ?? "var(--curve-series-default)";
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

function getDirectionLabel(figure: WorkbenchResponseCurveFigure): string {
  return figure.direction === "higher_better" ? "Higher is better" : "Lower is better";
}

function getEvidenceBadgeClass(figure: WorkbenchResponseCurveFigure): string {
  if (figure.evidenceTone === "trace") {
    return "ui-badge ui-badge-success ui-badge-compact";
  }

  if (figure.evidenceTone === "screening") {
    return "ui-badge ui-badge-warning ui-badge-compact";
  }

  if (figure.evidenceTone === "apparent") {
    return "ui-badge ui-badge-accent ui-badge-compact";
  }

  return "ui-badge ui-badge-compact";
}

function CurveTooltipContent({ active, label, payload }: CurveTooltipContentProps) {
  const frequencyHz = Number(label);

  if (!active || !payload || payload.length === 0 || !Number.isFinite(frequencyHz)) {
    return null;
  }

  return (
    <div className="rebuild-curve-tooltip">
      <div className="rebuild-curve-tooltip-label">{formatFrequencyLabel(frequencyHz)} Hz</div>
      <div className="rebuild-curve-tooltip-list">
        {payload.map((entry) => {
          const value = Number(entry.value);

          if (!Number.isFinite(value)) {
            return null;
          }

          return (
            <div className="rebuild-curve-tooltip-row" key={String(entry.dataKey ?? entry.name ?? value)}>
              <span className="rebuild-curve-tooltip-name">
                <span className="rebuild-curve-dot" style={{ background: entry.color ?? "var(--curve-series-default)" }} />
                {entry.name}
              </span>
              <span className="metric-number">{formatDecimal(value)} dB</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProfessionalResponseCurve({ figure }: ProfessionalResponseCurveProps) {
  const chartRows = buildChartRows(figure);
  const frequencies = getFigureFrequencies(figure);
  const frequencyDomain: [number, number] =
    frequencies.length > 0 ? [Math.min(...frequencies), Math.max(...frequencies)] : [63, 4000];
  const readouts = buildCurveReadouts(figure);
  const yDomain = buildYDomain(figure);

  return (
    <article className="rebuild-curve" data-curve-kind={figure.id}>
      <header className="rebuild-curve-header">
        <div>
          <div className="eyebrow">{figure.id === "impact" ? "Impact spectrum" : "Airborne spectrum"}</div>
          <h3 className="rebuild-curve-title">{figure.title}</h3>
        </div>
        <div className="rebuild-curve-meta">
          {figure.evidenceLabel ? <span className={getEvidenceBadgeClass(figure)}>{figure.evidenceLabel}</span> : null}
          <span className="ui-badge ui-badge-compact">{figure.domainLabel}</span>
          <span className="ui-badge ui-badge-accent ui-badge-compact">{getDirectionLabel(figure)}</span>
        </div>
      </header>

      <div className="rebuild-curve-band-row" aria-label="Frequency bands">
        {CURVE_BANDS.map((band) => (
          <span className="ui-badge ui-badge-compact" key={band.label}>
            {band.label}: {band.note}
          </span>
        ))}
      </div>

      <p className="rebuild-curve-note">{figure.note}</p>

      <div role="img" aria-label={`${figure.title}, ${getDirectionLabel(figure)}`}>
        <ChartSurface className="rebuild-curve-chart" placeholder="Preparing response curve...">
          {(size) => (
            <LineChart data={chartRows} height={size.height} margin={{ bottom: 8, left: 0, right: 12, top: 14 }} width={size.width}>
              {CURVE_BANDS.map((band) => (
                <ReferenceArea
                  className={band.className}
                  fill="var(--curve-band-fill)"
                  fillOpacity={1}
                  ifOverflow="extendDomain"
                  key={band.label}
                  x1={band.x1}
                  x2={band.x2}
                />
              ))}
              <CartesianGrid stroke="var(--curve-grid)" strokeDasharray="4 8" vertical />
              <XAxis
                allowDataOverflow
                axisLine={{ stroke: "var(--curve-axis)" }}
                dataKey="frequencyHz"
                domain={frequencyDomain}
                minTickGap={6}
                scale="log"
                tick={{ fill: "var(--text-muted)", fontSize: 12, fontWeight: 650 }}
                tickFormatter={(value) => formatFrequencyLabel(Number(value))}
                tickLine={false}
                ticks={frequencies}
                type="number"
              />
              <YAxis
                allowDataOverflow
                axisLine={{ stroke: "var(--curve-axis)" }}
                domain={yDomain}
                label={{
                  angle: -90,
                  fill: "var(--text-muted)",
                  fontSize: 12,
                  fontWeight: 700,
                  position: "insideLeft",
                  value: "Level (dB)"
                }}
                tick={{ fill: "var(--text-muted)", fontSize: 12, fontWeight: 650 }}
                tickLine={false}
                width={48}
              />
              <Tooltip
                content={<CurveTooltipContent />}
                cursor={{ stroke: "var(--curve-cursor)", strokeDasharray: "4 5" }}
                isAnimationActive={false}
              />
              {figure.series.map((series) => (
                <Line
                  connectNulls
                  dataKey={series.id}
                  dot={{
                    fill: "var(--surface-control)",
                    r: series.active ? 3.7 : 3,
                    stroke: getSeriesColor(series.id),
                    strokeWidth: series.active ? 2.6 : 2
                  }}
                  isAnimationActive={false}
                  key={series.id}
                  name={series.label}
                  stroke={getSeriesColor(series.id)}
                  strokeDasharray={series.active ? undefined : "7 5"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={series.active ? 3 : 2}
                  type="monotone"
                />
              ))}
            </LineChart>
          )}
        </ChartSurface>
      </div>

      {readouts.length > 0 ? (
        <div className="rebuild-curve-readouts">
          {readouts.map((readout) => (
            <div className="rebuild-curve-readout" key={readout.label}>
              <span>{readout.label}</span>
              <strong>{readout.valueLabel}</strong>
              <small>{readout.note}</small>
            </div>
          ))}
        </div>
      ) : null}

      <div className="rebuild-curve-series-list">
        {figure.series.map((series) => (
          <div className="rebuild-curve-series-row" data-active={series.active ? "true" : "false"} key={series.id}>
            <span className="rebuild-curve-series-swatch" style={{ background: getSeriesColor(series.id) }} />
            <span>{series.label}</span>
            <strong>{series.active ? "Active" : "Reference"}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}
