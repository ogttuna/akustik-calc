"use client";

import type { AssemblyCalculation } from "@dynecho/shared";
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

const BAR_COLORS = ["var(--accent)", "var(--success)", "var(--ink)", "var(--warning)", "var(--line-strong)", "var(--accent-ink)"];

export function LayerMassPanel({ result }: LayerMassPanelProps) {
  const chartData: LayerMassChartEntry[] =
    result?.layers.map((layer: AssemblyCalculation["layers"][number], index: number) => ({
      label: `${index + 1}. ${layer.material.name}`,
      value: Number(layer.surfaceMassKgM2.toFixed(1))
    })) ?? [];

  return (
    <SurfacePanel className="px-4 py-4">
      <h2 className="text-sm font-semibold text-[color:var(--ink)]">Layer mass contribution</h2>

      {chartData.length > 0 ? (
        <div className="mt-4 rounded border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-3 py-3">
          <ChartSurface
            className="h-[16rem]"
            placeholder="Preparing chart..."
          >
            {(size) => (
                <BarChart data={chartData} height={size.height} layout="vertical" margin={{ left: 12, right: 12, top: 8, bottom: 8 }} width={size.width}>
                  <CartesianGrid horizontal stroke="var(--line)" strokeDasharray="3 3" />
                  <XAxis axisLine={false} dataKey="value" tickLine={false} type="number" style={{ fontSize: "0.7rem" }} />
                  <YAxis axisLine={false} dataKey="label" tickLine={false} type="category" width={110} style={{ fontSize: "0.7rem" }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--paper)",
                      border: "1px solid var(--line)",
                      borderRadius: "0.375rem",
                      color: "var(--ink)",
                      fontSize: "0.8rem"
                    }}
                    cursor={{ fill: "rgba(0, 0, 0, 0.03)" }}
                    formatter={(value) => [`${formatDecimal(Number(value ?? 0))} kg/m²`, "Surface mass"]}
                  />
                  <Bar dataKey="value" radius={[4, 4, 4, 4]} maxBarSize={24}>
                    {chartData.map((entry: LayerMassChartEntry, index: number) => (
                      <Cell fill={BAR_COLORS[index % BAR_COLORS.length]} key={entry.label} />
                    ))}
                  </Bar>
                </BarChart>
            )}
          </ChartSurface>
        </div>
      ) : (
        <div className="mt-4 rounded border border-dashed border-[color:var(--line)] px-4 py-5 text-sm text-[color:var(--ink-soft)]">
          Add a valid stack to see mass contribution.
        </div>
      )}
    </SurfacePanel>
  );
}
