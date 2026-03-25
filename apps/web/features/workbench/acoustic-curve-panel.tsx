"use client";

import type { AssemblyCalculation } from "@dynecho/shared";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Pill, SurfacePanel } from "@dynecho/ui";

import { formatDecimal } from "@/lib/format";

import { ChartSurface } from "./chart-surface";

type AcousticCurvePanelProps = {
  result: AssemblyCalculation | null;
};

type CurvePoint = {
  frequencyHz: number;
  label: string;
  transmissionLossDb: number;
};

function formatSignedDb(value: number): string {
  return `${value >= 0 ? "+" : ""}${formatDecimal(value)} dB`;
}

function formatFrequencyLabel(frequencyHz: number): string {
  if (frequencyHz >= 1000) {
    const kiloHertz = frequencyHz / 1000;
    return `${Number.isInteger(kiloHertz) ? kiloHertz : kiloHertz.toFixed(kiloHertz >= 2 ? 1 : 2)}k`;
  }

  return String(frequencyHz);
}

export function AcousticCurvePanel({ result }: AcousticCurvePanelProps) {
  const chartData: CurvePoint[] =
    result?.curve.frequenciesHz.map((frequencyHz: number, index: number) => ({
      frequencyHz,
      label: formatFrequencyLabel(frequencyHz),
      transmissionLossDb: result.curve.transmissionLossDb[index]
    })) ?? [];
  const chartValues = chartData.map((entry: CurvePoint) => entry.transmissionLossDb);
  const yDomain = chartValues.length
    ? [
        Math.max(0, Math.floor(Math.min(...chartValues) / 5) * 5 - 5),
        Math.ceil(Math.max(...chartValues) / 5) * 5 + 5
      ]
    : [0, 80];

  const lowBand = chartData.find((entry: CurvePoint) => entry.frequencyHz >= 125 && entry.frequencyHz <= 250);
  const speechBand = chartData.find((entry: CurvePoint) => entry.frequencyHz === 500);
  const highBand = chartData.find((entry: CurvePoint) => entry.frequencyHz >= 2000);

  return (
    <SurfacePanel className="px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-[color:var(--ink)]">Transmission-loss trace</h2>
        <div className="flex flex-wrap gap-2">
          <Pill tone="accent">Frequency domain</Pill>
          <Pill tone="neutral">63 – 4000 Hz</Pill>
        </div>
      </div>

      {result ? (
        <>
          <div className="mt-4 rounded border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-3 py-3">
            <ChartSurface className="h-[16rem] sm:h-[18rem]" placeholder="Preparing curve...">
              {(size) => (
                  <LineChart data={chartData} height={size.height} margin={{ left: 0, right: 8, top: 12, bottom: 0 }} width={size.width}>
                    <CartesianGrid horizontal stroke="var(--line)" strokeDasharray="3 3" />
                    <XAxis
                      axisLine={false}
                      dataKey="label"
                      minTickGap={12}
                      tickLine={false}
                      tickMargin={8}
                      style={{ fontSize: "0.7rem" }}
                    />
                    <YAxis axisLine={false} domain={yDomain} tickFormatter={(value) => `${value}`} tickLine={false} width={36} style={{ fontSize: "0.7rem" }} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--paper)",
                        border: "1px solid var(--line)",
                        borderRadius: "0.375rem",
                        color: "var(--ink)",
                        fontSize: "0.8rem"
                      }}
                      formatter={(value) => [`${formatDecimal(Number(value ?? 0))} dB`, "Transmission loss"]}
                      labelFormatter={(label) => `${label} Hz`}
                    />
                    <Line
                      dataKey="transmissionLossDb"
                      dot={{ fill: "var(--accent)", r: 2.5, stroke: "var(--paper)", strokeWidth: 1.5 }}
                      stroke="var(--accent)"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      type="monotone"
                    />
                  </LineChart>
              )}
            </ChartSurface>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="rounded border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-3 py-2.5">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Low band</div>
              <div className="mt-1 text-[0.82rem] font-semibold tabular-nums text-[color:var(--ink)]">
                {lowBand ? `${formatDecimal(lowBand.transmissionLossDb)} dB @ ${lowBand.label} Hz` : "—"}
              </div>
            </div>
            <div className="rounded border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-3 py-2.5">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Rating</div>
              <div className="mt-1 text-[0.82rem] font-semibold tabular-nums text-[color:var(--ink)]">
                {result.ratings.iso717.composite}
              </div>
            </div>
            <div className="rounded border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-3 py-2.5">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Speech band</div>
              <div className="mt-1 text-[0.82rem] font-semibold tabular-nums text-[color:var(--ink)]">
                {speechBand ? `${formatDecimal(speechBand.transmissionLossDb)} dB @ 500 Hz` : "—"}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-4 rounded border border-dashed border-[color:var(--line)] px-4 py-5 text-sm text-[color:var(--ink-soft)]">
          Add a valid assembly to see the transmission-loss curve.
        </div>
      )}
    </SurfacePanel>
  );
}
