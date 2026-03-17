"use client";

import type { AssemblyCalculation } from "@dynecho/shared";
import { AudioLines, SlidersHorizontal, Waves } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Pill, SurfacePanel } from "@dynecho/ui";

import { formatDecimal } from "@/lib/format";

import { useHasMounted } from "./use-has-mounted";

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
  const hasMounted = useHasMounted();
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
    <SurfacePanel className="px-5 py-5">
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone="accent">Frequency domain</Pill>
        <Pill tone="neutral">63-4000 Hz</Pill>
      </div>

      <div className="mt-5">
        <div className="eyebrow">Curve view</div>
        <h2 className="mt-1 font-display text-[1.95rem] leading-none tracking-[-0.04em]">Transmission-loss trace</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">
          Acoustic decisions need band behavior, not only a headline rating. This trace shows how the current stack is
          screening across the main octave points used in consultant review.
        </p>
      </div>

      {result ? (
        <>
          <div className="mt-5 chart-frame rounded-[1.35rem] border hairline bg-[color:var(--paper)] px-3 py-3">
            <div className="h-[18rem] sm:h-[20rem]">
              {hasMounted ? (
                <ResponsiveContainer height="100%" width="100%">
                  <LineChart data={chartData} margin={{ left: 0, right: 8, top: 12, bottom: 0 }}>
                    <CartesianGrid horizontal stroke="rgba(39, 74, 83, 0.08)" strokeDasharray="4 4" />
                    <XAxis
                      axisLine={false}
                      dataKey="label"
                      minTickGap={12}
                      tickLine={false}
                      tickMargin={10}
                    />
                    <YAxis axisLine={false} domain={yDomain} tickFormatter={(value) => `${value}`} tickLine={false} width={40} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(250, 247, 240, 0.97)",
                        border: "1px solid rgba(39, 74, 83, 0.16)",
                        borderRadius: "18px",
                        color: "var(--ink)"
                      }}
                      formatter={(value) => [`${formatDecimal(Number(value ?? 0))} dB`, "Transmission loss"]}
                      labelFormatter={(label) => `${label} Hz`}
                    />
                    <Line
                      dataKey="transmissionLossDb"
                      dot={{ fill: "#c97342", r: 3, stroke: "#faf7f0", strokeWidth: 1.5 }}
                      stroke="#c97342"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      type="monotone"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-[1rem] bg-black/[0.02] text-sm text-[color:var(--ink-soft)]">
                  Preparing curve surface...
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <article className="rounded-[1.2rem] border hairline bg-[color:var(--panel-strong)] px-4 py-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
                <Waves className="h-4 w-4" />
                Low-band check
              </div>
              <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
                {lowBand
                  ? `${lowBand.label} Hz point sits at ${formatDecimal(lowBand.transmissionLossDb)} dB.`
                  : "Low-band screening point not available in the live curve."}
              </p>
            </article>
            <article className="rounded-[1.2rem] border hairline bg-black/[0.03] px-4 py-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
                <AudioLines className="h-4 w-4" />
                Rating package
              </div>
              <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
                {result.ratings.iso717.composite} with STC {formatDecimal(result.metrics.estimatedStc)} dB and C/Ctr{" "}
                {formatSignedDb(result.metrics.estimatedCDb)} / {formatSignedDb(result.metrics.estimatedCtrDb)}.
              </p>
            </article>
            <article className="rounded-[1.2rem] border hairline bg-black/[0.025] px-4 py-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
                <SlidersHorizontal className="h-4 w-4" />
                Screening note
              </div>
              <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
                {speechBand && highBand
                  ? `Speech band reaches ${formatDecimal(speechBand.transmissionLossDb)} dB at 500 Hz and upper-band screening reaches ${formatDecimal(highBand.transmissionLossDb)} dB by ${highBand.label} Hz.`
                  : "Curve-backed screening is available, but some commentary points are not populated yet."}
              </p>
            </article>
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-[1.35rem] border border-dashed hairline px-4 py-6 text-sm leading-7 text-[color:var(--ink-soft)]">
          Add a valid assembly to unlock the live transmission-loss trace and derived rating package.
        </div>
      )}
    </SurfacePanel>
  );
}
