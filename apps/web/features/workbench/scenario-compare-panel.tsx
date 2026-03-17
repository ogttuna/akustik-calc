"use client";

import { useEffect, useState } from "react";

import { BookmarkPlus, RotateCcw, Trash2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Pill, SurfacePanel } from "@dynecho/ui";

import { formatDecimal } from "@/lib/format";

import type { ValidationPosture } from "./validation-regime";
import type { EvaluatedScenario } from "./scenario-analysis";
import {
  getScenarioCorridorSummary,
  getScenarioDecisionSummary,
  getValidationPostureTone
} from "./scenario-corridor-summary";
import { useHasMounted } from "./use-has-mounted";

type MetricKey = "estimatedRwDb" | "estimatedStc" | "estimatedLnwDb" | "surfaceMassKgM2" | "totalThicknessMm";

type ScenarioComparePanelProps = {
  currentScenario: EvaluatedScenario;
  savedScenarios: readonly EvaluatedScenario[];
  onDeleteScenario: (scenarioId: string) => void;
  onLoadScenario: (scenarioId: string) => void;
  onSaveScenario: () => void;
  targetLnwDb: string;
  targetRwDb: string;
};

const METRIC_COPY: Record<MetricKey, { label: string; suffix: string }> = {
  estimatedRwDb: { label: "Rw estimate", suffix: "dB" },
  estimatedStc: { label: "STC", suffix: "dB" },
  estimatedLnwDb: { label: "Ln,w", suffix: "dB" },
  surfaceMassKgM2: { label: "Surface mass", suffix: "kg/m²" },
  totalThicknessMm: { label: "Thickness", suffix: "mm" }
};

const CHART_COLORS = {
  current: "#c97342",
  saved: "#2e8a7b"
};

function formatImpactSnippet(scenario: EvaluatedScenario): string {
  if (typeof scenario.result?.impact?.LnW === "number") {
    return ` · Ln,w ${formatDecimal(scenario.result.impact.LnW)} dB`;
  }

  if (typeof scenario.result?.impact?.LPrimeNTw === "number") {
    return ` · L'nT,w ${formatDecimal(scenario.result.impact.LPrimeNTw)} dB`;
  }

  if (typeof scenario.result?.lowerBoundImpact?.LnWUpperBound === "number") {
    return ` · Ln,w <= ${formatDecimal(scenario.result.lowerBoundImpact.LnWUpperBound)} dB`;
  }

  return "";
}

function getScenarioSurfaceClass(
  scenario: EvaluatedScenario,
  posture: ValidationPosture["posture"]
): string {
  if (scenario.source === "current") {
    return "border-[color:var(--accent)]/25 bg-[color:var(--panel-strong)]";
  }

  switch (posture) {
    case "exact":
      return "border-[color:var(--success)]/25 bg-[color:var(--success-soft)]/32";
    case "bound":
      return "border-[color:var(--warning)]/25 bg-[color:var(--warning-soft)]/40";
    case "estimate":
      return "border-[color:var(--accent)]/18 bg-black/[0.02]";
    case "low_confidence":
      return "border-[color:var(--warning)]/18 bg-[color:var(--warning-soft)]/28";
    case "inactive":
      return "hairline bg-[color:var(--paper)]";
  }
}

export function ScenarioComparePanel({
  currentScenario,
  onDeleteScenario,
  onLoadScenario,
  onSaveScenario,
  savedScenarios,
  targetLnwDb,
  targetRwDb
}: ScenarioComparePanelProps) {
  const hasMounted = useHasMounted();
  const [metric, setMetric] = useState<MetricKey>("estimatedRwDb");
  const scenarios = [currentScenario, ...savedScenarios];
  const hasImpactScenario = scenarios.some((scenario) => typeof scenario.result?.impact?.LnW === "number");
  const metricOptions = (Object.keys(METRIC_COPY) as MetricKey[]).filter((entry) =>
    entry === "estimatedLnwDb" ? hasImpactScenario : true
  );

  useEffect(() => {
    if (!metricOptions.includes(metric)) {
      setMetric("estimatedRwDb");
    }
  }, [metric, metricOptions]);

  const getMetricValue = (scenario: EvaluatedScenario, key: MetricKey) => {
    if (!scenario.result) {
      return 0;
    }

    switch (key) {
      case "estimatedLnwDb":
        return scenario.result.impact?.LnW ?? 0;
      case "estimatedRwDb":
        return scenario.result.metrics.estimatedRwDb;
      case "estimatedStc":
        return scenario.result.metrics.estimatedStc;
      case "surfaceMassKgM2":
        return scenario.result.metrics.surfaceMassKgM2;
      case "totalThicknessMm":
        return scenario.result.metrics.totalThicknessMm;
      default:
        return 0;
    }
  };
  const chartData = scenarios.map((scenario) => ({
    accent: scenario.source === "current" ? CHART_COLORS.current : CHART_COLORS.saved,
    label: scenario.source === "current" ? "Live stack" : scenario.name,
    value: getMetricValue(scenario, metric)
  }));
  const activeBriefTargets = [
    targetRwDb.trim().length > 0 ? `Rw ${targetRwDb.trim()} dB min` : null,
    targetLnwDb.trim().length > 0 ? `Ln,w ${targetLnwDb.trim()} dB max` : null
  ].filter((target): target is string => Boolean(target));
  const liveDecision = getScenarioDecisionSummary({
    baselineResult: currentScenario.result,
    candidateResult: currentScenario.result,
    targetLnwDb,
    targetRwDb
  });

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="eyebrow">Option studies</div>
          <h2 className="mt-1 font-display text-[2rem] leading-none tracking-[-0.04em]">Scenario compare</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">
            Acoustic workflows need saved options and clear deltas. Keep candidate stacks visible while you iterate, and
            compare their evidence class instead of ranking every number as if it came from the same solver corridor.
          </p>
        </div>
        <button
          className="focus-ring touch-target inline-flex items-center gap-2 rounded-full bg-[color:var(--ink)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)]"
          onClick={onSaveScenario}
          type="button"
        >
          <BookmarkPlus className="h-4 w-4" />
          Save live stack
        </button>
      </div>

      <div className="mt-5 rounded-[1.25rem] border hairline bg-black/[0.03] px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
              Comparison rule
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">
              Scenario deltas now carry solver corridor labels. Exact floor rows, benchmark-guarded estimates, bound-only
              support, and airborne comparison anchors stay visible directly on the scenario cards below.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {activeBriefTargets.length > 0 ? (
                activeBriefTargets.map((target) => (
                  <Pill key={target} tone="accent">
                    {target}
                  </Pill>
                ))
              ) : (
                <Pill tone="neutral">No brief target armed</Pill>
              )}
            </div>
          </div>
          <Pill tone="neutral">{metricOptions.length} compare lenses</Pill>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {metricOptions.map((entry) => (
          <button
            className={`focus-ring touch-target rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
              metric === entry
                ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]"
                : "hairline bg-[color:var(--paper)] text-[color:var(--ink-soft)] hover:bg-black/[0.03]"
            }`}
            key={entry}
            onClick={() => setMetric(entry)}
            type="button"
          >
            {METRIC_COPY[entry].label}
          </button>
        ))}
      </div>

      <div className="mt-5 chart-frame rounded-[1.35rem] border hairline bg-[color:var(--paper)] px-3 py-3">
        <div className="h-[19rem]">
          {hasMounted ? (
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid horizontal stroke="rgba(39, 74, 83, 0.08)" strokeDasharray="4 4" />
                <XAxis axisLine={false} tickLine={false} type="number" />
                <YAxis axisLine={false} dataKey="label" tickLine={false} type="category" width={140} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(250, 247, 240, 0.97)",
                    border: "1px solid rgba(39, 74, 83, 0.16)",
                    borderRadius: "18px",
                    color: "var(--ink)"
                  }}
                  formatter={(value) => [
                    `${formatDecimal(Number(value ?? 0))} ${METRIC_COPY[metric].suffix}`,
                    METRIC_COPY[metric].label
                  ]}
                />
                <Bar dataKey="value" radius={[999, 999, 999, 999]}>
                  {chartData.map((entry) => (
                    <Cell fill={entry.accent} key={entry.label} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center rounded-[1rem] bg-black/[0.02] text-sm text-[color:var(--ink-soft)]">
              Preparing chart surface...
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {(() => {
          const summary = getScenarioCorridorSummary(currentScenario.result);

          return (
            <article className={`rounded-[1.3rem] border px-4 py-4 ${getScenarioSurfaceClass(currentScenario, summary.impactPosture.posture)}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-[color:var(--ink)]">Live stack</div>
                  <p className="mt-1 text-sm leading-7 text-[color:var(--ink-soft)]">
                    {currentScenario.result
                      ? `${currentScenario.result.ratings.iso717.composite} · STC ${formatDecimal(currentScenario.result.metrics.estimatedStc)} dB${formatImpactSnippet(currentScenario)} · ${formatDecimal(currentScenario.result.metrics.surfaceMassKgM2)} kg/m²`
                      : "Needs at least one valid layer."}
                  </p>
                  {currentScenario.result ? (
                    <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">{summary.narrative}</p>
                  ) : null}
                </div>
                <Pill tone="accent">Current</Pill>
              </div>

              {currentScenario.result ? (
                <>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Pill tone={getValidationPostureTone(summary.impactPosture.posture)}>{summary.impactLabel}</Pill>
                    <Pill tone={getValidationPostureTone(summary.airbornePosture.posture)}>{summary.airborneLabel}</Pill>
                    {summary.activeFamilyLabel ? <Pill tone="neutral">{summary.activeFamilyLabel}</Pill> : null}
                    {summary.activeModeLabel ? <Pill tone="neutral">{summary.activeModeLabel}</Pill> : null}
                    {summary.fieldContinuationLabel ? <Pill tone="accent">{summary.fieldContinuationLabel}</Pill> : null}
                  </div>
                  <div className="mt-4 rounded-[1rem] border hairline bg-black/[0.025] px-3 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                        Current brief line
                      </div>
                      <Pill tone={liveDecision.briefStatusTone}>{liveDecision.briefStatusLabel}</Pill>
                    </div>
                    <p className="mt-2 text-xs leading-6 text-[color:var(--ink-soft)]">
                      {liveDecision.briefDeltaLabel ?? "Set Rw or Ln,w brief targets to turn the compare deck into a load decision surface."}
                    </p>
                  </div>
                </>
              ) : null}
            </article>
          );
        })()}

        {savedScenarios.length > 0 ? (
          savedScenarios.map((scenario) => {
            const summary = getScenarioCorridorSummary(scenario.result);
            const decision = getScenarioDecisionSummary({
              baselineResult: currentScenario.result,
              candidateResult: scenario.result,
              targetLnwDb,
              targetRwDb
            });

            return (
              <article
                className={`pointer-card rounded-[1.3rem] border px-4 py-4 ${getScenarioSurfaceClass(scenario, summary.impactPosture.posture)}`}
                key={scenario.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-[color:var(--ink)]">{scenario.name}</div>
                    <p className="mt-1 text-sm leading-7 text-[color:var(--ink-soft)]">
                      {scenario.result
                        ? `${scenario.result.ratings.iso717.composite} · STC ${formatDecimal(scenario.result.metrics.estimatedStc)} dB${formatImpactSnippet(scenario)} · ${formatDecimal(scenario.result.metrics.surfaceMassKgM2)} kg/m²`
                        : "Invalid scenario snapshot."}
                    </p>
                    {scenario.result ? (
                      <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">{summary.narrative}</p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="focus-ring touch-target inline-flex items-center gap-2 rounded-full border hairline px-3 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-black/[0.03]"
                      onClick={() => onLoadScenario(scenario.id)}
                      type="button"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Load
                    </button>
                    <button
                      aria-label={`Delete ${scenario.name}`}
                      className="focus-ring touch-target inline-flex items-center justify-center rounded-full border hairline px-3 py-2 text-[color:var(--ink-soft)] hover:bg-black/[0.03]"
                      onClick={() => onDeleteScenario(scenario.id)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {scenario.result ? (
                  <>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Pill tone={getValidationPostureTone(summary.impactPosture.posture)}>{summary.impactLabel}</Pill>
                      <Pill tone={getValidationPostureTone(summary.airbornePosture.posture)}>{summary.airborneLabel}</Pill>
                      {summary.activeFamilyLabel ? <Pill tone="neutral">{summary.activeFamilyLabel}</Pill> : null}
                      {summary.activeModeLabel ? <Pill tone="neutral">{summary.activeModeLabel}</Pill> : null}
                      {summary.fieldContinuationLabel ? <Pill tone="accent">{summary.fieldContinuationLabel}</Pill> : null}
                    </div>
                    <div className="mt-4 grid gap-3 lg:grid-cols-2">
                      <div className="rounded-[1rem] border hairline bg-black/[0.025] px-3 py-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                            Load effect
                          </div>
                          <Pill tone={decision.liveStatusTone}>{decision.liveStatusLabel}</Pill>
                        </div>
                        <p className="mt-2 text-xs leading-6 text-[color:var(--ink-soft)]">{decision.liveDeltaLabel}</p>
                      </div>
                      <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/70 px-3 py-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                            Brief fit
                          </div>
                          <Pill tone={decision.briefStatusTone}>{decision.briefStatusLabel}</Pill>
                        </div>
                        <p className="mt-2 text-xs leading-6 text-[color:var(--ink-soft)]">
                          {decision.briefDeltaLabel ?? "No brief target armed for this comparison."}
                        </p>
                      </div>
                    </div>
                  </>
                ) : null}
              </article>
            );
          })
        ) : (
          <div className="rounded-[1.3rem] border border-dashed hairline px-4 py-6 text-sm leading-7 text-[color:var(--ink-soft)]">
            Save at least one scenario to compare option studies, preserve consultant alternatives, and prep report-ready
            recommendations.
          </div>
        )}
      </div>
    </SurfacePanel>
  );
}
