"use client";

import type { AssemblyCalculation } from "@dynecho/shared";
import { Layers3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from "recharts";

import { SurfacePanel } from "@dynecho/ui";

import { formatDecimal } from "@/lib/format";

import { ChartSurface } from "./chart-surface";

type LayerMassPanelProps = {
  result: AssemblyCalculation | null;
};

type LayerMassChartEntry = {
  label: string;
  value: number;
};

const BAR_COLORS = ["#c97342", "#2e8a7b", "#274a53", "#ccac66", "#7d8d64", "#865644"];

export function LayerMassPanel({ result }: LayerMassPanelProps) {
  const chartData: LayerMassChartEntry[] =
    result?.layers.map((layer: AssemblyCalculation["layers"][number], index: number) => ({
      label: `${index + 1}. ${layer.material.name}`,
      value: Number(layer.surfaceMassKgM2.toFixed(1))
    })) ?? [];

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border hairline bg-[color:var(--panel-strong)]">
          <Layers3 className="h-4 w-4 text-[color:var(--ink)]" />
        </div>
        <div>
          <div className="eyebrow">Mass readout</div>
          <h2 className="mt-1 font-display text-[1.85rem] leading-none tracking-[-0.04em]">Layer contribution</h2>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="mt-5">
          <ChartSurface
            className="chart-frame h-[18rem] rounded-[1.35rem] border hairline bg-[color:var(--paper)] px-3 py-3"
            placeholder="Preparing chart surface..."
          >
            {(size) => (
                <BarChart data={chartData} height={size.height} layout="vertical" margin={{ left: 12, right: 12, top: 8, bottom: 8 }} width={size.width}>
                  <CartesianGrid horizontal stroke="rgba(39, 74, 83, 0.08)" strokeDasharray="4 4" />
                  <XAxis axisLine={false} dataKey="value" tickLine={false} type="number" />
                  <YAxis axisLine={false} dataKey="label" tickLine={false} type="category" width={110} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(250, 247, 240, 0.97)",
                      border: "1px solid rgba(39, 74, 83, 0.16)",
                      borderRadius: "18px",
                      color: "var(--ink)"
                    }}
                    cursor={{ fill: "rgba(39, 74, 83, 0.05)" }}
                    formatter={(value) => [`${formatDecimal(Number(value ?? 0))} kg/m²`, "Surface mass"]}
                  />
                  <Bar dataKey="value" radius={[999, 999, 999, 999]}>
                    {chartData.map((entry: LayerMassChartEntry, index: number) => (
                      <Cell fill={BAR_COLORS[index % BAR_COLORS.length]} key={entry.label} />
                    ))}
                  </Bar>
                </BarChart>
            )}
          </ChartSurface>
          <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            Surface-mass contribution by layer helps show where the current Rw estimate is really coming from.
          </p>
        </div>
      ) : (
        <div className="mt-5 rounded-[1.35rem] border border-dashed hairline px-4 py-6 text-sm leading-7 text-[color:var(--ink-soft)]">
          Add a valid stack to inspect per-layer mass contribution.
        </div>
      )}
    </SurfacePanel>
  );
}
