"use client";

import type { AssemblyCalculation, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";

import { OutputCard, OutputCoverageSummary, OutputUnlockRail, PendingOutputRow } from "./simple-workbench-output-cards";
import { CalculationTraceDropdown, SectionLead, GuidedFactChip } from "./simple-workbench-primitives";
import { LayerStackDiagram } from "./simple-workbench-layer-diagram";
import { ResultAnswerChart } from "./result-answer-chart";
import { ResponseCurveFigureCard } from "./response-curve-figure-card";
import type { WorkbenchResponseCurveFigure } from "./response-curve-model";
import type { OutputCardModel } from "./simple-workbench-output-model";
import { outputStatusTextClass, statusLabel } from "./simple-workbench-output-model";
import { workbenchSectionMutedCardClass } from "./simple-workbench-layer-visuals";
import type { GuidedValidationSummary } from "./guided-validation-summary";
import type { StudyMode } from "./preset-definitions";
import { formatCountLabel } from "./simple-workbench-utils";
import type { LayerDraft } from "./workbench-store";

function getValidationHeroChipClass(tone: GuidedValidationSummary["tone"]): string {
  switch (tone) {
    case "ready":
      return "border-[color:color-mix(in_oklch,var(--success)_24%,var(--line))] bg-[color:color-mix(in_oklch,var(--success)_10%,var(--paper))] text-[color:var(--success-ink)]";
    case "warning":
      return "border-[color:color-mix(in_oklch,var(--warning)_28%,var(--line))] bg-[color:color-mix(in_oklch,var(--warning)_12%,var(--paper))] text-[color:var(--warning-ink)]";
    case "neutral":
    default:
      return "border-[color:color-mix(in_oklch,var(--accent)_22%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_10%,var(--paper))] text-[color:var(--accent-ink)]";
  }
}

export function SimpleWorkbenchResultsPanel(props: {
  activeRowId: string | null;
  activeWorkspacePanel: string;
  boundOutputCardCount: number;
  collapsedLiveRowCount: number;
  contextLabel: string;
  heroHeadline: string;
  isDesktop: boolean;
  liveOutputCardCount: number;
  liveRowCount: number;
  materials: readonly MaterialDefinition[];
  needsInputCards: readonly OutputCardModel[];
  outputUnlockGroups: readonly {
    detail: string;
    outputs: readonly RequestedOutputId[];
    title: string;
  }[];
  parkedRowCount: number;
  primaryReadyCard: OutputCardModel | null;
  readyCardCount: number;
  result: AssemblyCalculation | null;
  responseCurves: readonly WorkbenchResponseCurveFigure[];
  routeCoverageLabel: string;
  rows: readonly LayerDraft[];
  secondaryReadyCards: readonly OutputCardModel[];
  solverLayerCount: number;
  studyMode: StudyMode;
  targetLnwDb?: string | null;
  targetRwDb?: string | null;
  totalOutputCount: number;
  unsupportedCards: readonly OutputCardModel[];
  validationSummary: GuidedValidationSummary;
  warnings: readonly string[];
}) {
  const {
    activeRowId,
    activeWorkspacePanel,
    boundOutputCardCount,
    collapsedLiveRowCount,
    contextLabel,
    heroHeadline,
    isDesktop,
    liveOutputCardCount,
    liveRowCount,
    materials,
    needsInputCards,
    outputUnlockGroups,
    parkedRowCount,
    primaryReadyCard,
    readyCardCount,
    result,
    responseCurves,
    routeCoverageLabel,
    rows,
    secondaryReadyCards,
    solverLayerCount,
    studyMode,
    targetLnwDb,
    targetRwDb,
    totalOutputCount,
    unsupportedCards,
    validationSummary,
    warnings,
  } = props;
  const liveStackDetail =
    parkedRowCount > 0
      ? `${formatCountLabel(liveRowCount, "live row")} currently resolve to ${formatCountLabel(solverLayerCount, "solver layer")}. ${formatCountLabel(parkedRowCount, "parked row")} ${parkedRowCount === 1 ? "stays" : "stay"} outside the active read.`
      : collapsedLiveRowCount > 0
        ? `${formatCountLabel(liveRowCount, "live row")} collapse to ${formatCountLabel(solverLayerCount, "solver layer")} before the read is solved.`
        : "Every visible row currently contributes to the guided answer.";
  const briefTargets = [
    targetRwDb && targetRwDb.trim().length > 0 ? `Rw >= ${targetRwDb.trim()} dB` : null,
    targetLnwDb && targetLnwDb.trim().length > 0 ? `Ln,w <= ${targetLnwDb.trim()} dB` : null
  ].filter((value): value is string => Boolean(value));

  return (
    <div
      className={isDesktop
        ? "col-start-2 row-start-1 row-span-2 min-w-0 overflow-y-auto px-4 py-4 sticky top-0 self-start max-h-screen"
        : `stage-enter-3 min-w-0 overflow-hidden px-4 py-4 ${activeWorkspacePanel === "results" ? "block" : "hidden"}`
      }
    >
      {isDesktop ? (
        <div className="mb-4">
          <LayerStackDiagram activeRowId={activeRowId} materials={materials} result={result} rows={rows} studyMode={studyMode} />
        </div>
      ) : null}
      <div className="flex flex-col">
          <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
            <SectionLead title="Results" tone="results" />
        </div>

          <div className="mt-4 space-y-4">
            <OutputCoverageSummary
              boundCount={boundOutputCardCount}
              liveCount={liveOutputCardCount}
              parkedCount={needsInputCards.length}
              readyCount={readyCardCount}
              totalCount={totalOutputCount}
              unsupportedCount={unsupportedCards.length}
            />

            <div className="flex flex-wrap gap-2 text-[0.72rem] leading-5 text-[color:var(--ink-soft)]">
              <GuidedFactChip>{routeCoverageLabel}</GuidedFactChip>
              {warnings.length ? <GuidedFactChip tone="warning">{`${warnings.length} warning${warnings.length === 1 ? "" : "s"}`}</GuidedFactChip> : null}
            </div>

            {primaryReadyCard ? (
              <>
                <section className="relative overflow-hidden rounded-[1.4rem] border border-[color:color-mix(in_oklch,var(--ink)_8%,var(--line))] bg-[linear-gradient(180deg,color-mix(in_oklch,var(--paper)_96%,white)_0%,color-mix(in_oklch,var(--panel)_68%,white)_100%)] px-4 py-4 shadow-[0_26px_60px_-46px_rgba(12,23,33,0.56)]">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklch,var(--accent)_12%,transparent),transparent_68%)]" />
                  <div className="pointer-events-none absolute right-[-3rem] top-[-3rem] h-36 w-36 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--warning)_10%,transparent),transparent_68%)]" />
                  <div className="relative">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 max-w-3xl">
                        <div className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
                          {studyMode === "floor" ? "Guided floor answer" : "Guided wall answer"}
                        </div>
                        <h3 className="mt-1 text-[1.2rem] font-semibold tracking-[-0.03em] text-[color:var(--ink)]">{heroHeadline}</h3>
                        <p className="mt-2 max-w-2xl text-[0.82rem] leading-6 text-[color:var(--ink-soft)]">{validationSummary.detail}</p>
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${getValidationHeroChipClass(validationSummary.tone)}`}>
                          {validationSummary.value}
                        </span>
                        <GuidedFactChip>{contextLabel}</GuidedFactChip>
                        <GuidedFactChip>{routeCoverageLabel}</GuidedFactChip>
                        {warnings.length ? <GuidedFactChip tone="warning">{`${warnings.length} warning${warnings.length === 1 ? "" : "s"}`}</GuidedFactChip> : null}
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:items-start">
                      <div className="grid gap-4">
                        <article className="rounded-[1.15rem] border border-[color:color-mix(in_oklch,var(--ink)_8%,var(--line))] bg-[linear-gradient(180deg,color-mix(in_oklch,var(--paper)_92%,white)_0%,color-mix(in_oklch,var(--panel)_74%,white)_100%)] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.44)]">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                                {primaryReadyCard.label}
                              </div>
                              <div className="mt-2 text-[clamp(2.7rem,6vw,4rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-[color:var(--ink)]">
                                {primaryReadyCard.value}
                              </div>
                            </div>
                            <div className="grid justify-items-end gap-2 text-right">
                              <div className={`text-[0.72rem] font-semibold uppercase tracking-[0.16em] ${outputStatusTextClass(primaryReadyCard.status)}`}>
                                {statusLabel(primaryReadyCard.status)}
                              </div>
                              <div className="text-[0.72rem] font-semibold text-[color:var(--ink-soft)]">{primaryReadyCard.postureLabel}</div>
                            </div>
                          </div>

                          <p className="mt-3 max-w-xl text-[0.82rem] leading-6 text-[color:var(--ink-soft)]">{primaryReadyCard.detail}</p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <GuidedFactChip>{studyMode === "floor" ? "Primary floor read" : "Primary wall read"}</GuidedFactChip>
                            <GuidedFactChip>{formatCountLabel(liveRowCount, "live row")} in read</GuidedFactChip>
                            <GuidedFactChip>{formatCountLabel(solverLayerCount, "solver layer")}</GuidedFactChip>
                          </div>

                          <div className="mt-4 grid gap-2 sm:grid-cols-2">
                            <div className="rounded-[0.95rem] border border-[color:color-mix(in_oklch,var(--ink)_8%,var(--line))] bg-[color:var(--paper)]/82 px-3 py-3">
                              <div className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Stack contribution</div>
                              <div className="mt-2 text-[0.95rem] font-semibold text-[color:var(--ink)]">{formatCountLabel(liveRowCount, "live row")} active</div>
                              <div className="mt-1 text-[0.76rem] leading-5 text-[color:var(--ink-soft)]">{liveStackDetail}</div>
                            </div>
                            <div className="rounded-[0.95rem] border border-[color:color-mix(in_oklch,var(--ink)_8%,var(--line))] bg-[color:var(--paper)]/82 px-3 py-3">
                              <div className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Brief thresholds</div>
                              <div className="mt-2 text-[0.95rem] font-semibold text-[color:var(--ink)]">
                                {briefTargets[0] ?? "No target armed"}
                              </div>
                              <div className="mt-1 text-[0.76rem] leading-5 text-[color:var(--ink-soft)]">
                                {briefTargets.length > 1 ? briefTargets.slice(1).join(" · ") : "Set project thresholds in the brief to compare the live read against delivery intent."}
                              </div>
                            </div>
                          </div>
                        </article>

                        {secondaryReadyCards.length ? (
                          <details className={`rounded border px-3 py-3 ${workbenchSectionMutedCardClass("results")}`}>
                            <summary className="cursor-pointer list-none">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="text-sm font-semibold text-[color:var(--ink)]">Supporting metrics</div>
                              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                                  {secondaryReadyCards.length} supporting values
                                </div>
                              </div>
                            </summary>
                            <div className="mt-3 grid gap-2">
                              {secondaryReadyCards.map((card) => (
                                <OutputCard card={card} key={`ready-${card.label}`} />
                              ))}
                            </div>
                          </details>
                        ) : null}
                      </div>

                      <div className="grid gap-4">
                        <ResultAnswerChart result={result} targetLnwDb={targetLnwDb} targetRwDb={targetRwDb} />
                      </div>
                    </div>

                    {responseCurves.length > 0 ? (
                      <div className="mt-5 border-t border-[color:color-mix(in_oklch,var(--ink)_8%,var(--line))] pt-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Live frequency curves</div>
                            <p className="mt-1 max-w-2xl text-[0.8rem] leading-5 text-[color:var(--ink-soft)]">
                              Band-by-band evidence now sits directly under the weighted answer instead of reading like a separate diagnostics block.
                            </p>
                          </div>
                          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                            {responseCurves.length} live chart{responseCurves.length === 1 ? "" : "s"}
                          </div>
                        </div>

                        <div className="mt-4 grid gap-4 2xl:grid-cols-2">
                          {responseCurves.map((figure) => (
                            <ResponseCurveFigureCard figure={figure} key={figure.id} />
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </section>

              </>
            ) : (
            <div className={`rounded border border-dashed px-4 py-5 text-sm leading-6 text-[color:var(--ink-soft)] ${workbenchSectionMutedCardClass("results")}`}>
              Build a valid stack to see the primary output here.
            </div>
          )}

          <CalculationTraceDropdown result={result} studyMode={studyMode} />

          <OutputUnlockRail groups={outputUnlockGroups} />

          {warnings.length ? (
            <details className="rounded border border-[color:var(--warning)] bg-[color:var(--warning-soft)] px-4 py-3 text-[color:var(--warning-ink)]">
              <summary className="cursor-pointer list-none">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="font-semibold">Check these inputs before trusting the read.</div>
                  <GuidedFactChip tone="warning">{`${warnings.length} warning${warnings.length === 1 ? "" : "s"}`}</GuidedFactChip>
                </div>
              </summary>
              <div className="mt-3 grid gap-2 text-sm leading-6">
                {warnings.slice(0, 3).map((warning) => (
                  <div key={warning}>{warning}</div>
                ))}
                {warnings.length > 3 ? <div>{`+${warnings.length - 3} more warning${warnings.length - 3 === 1 ? "" : "s"} in diagnostics.`}</div> : null}
              </div>
            </details>
          ) : null}

          {(needsInputCards.length > 0 || unsupportedCards.length > 0) ? (
            <details className={`rounded border px-3 py-3 ${workbenchSectionMutedCardClass("results")}`}>
              <summary className="cursor-pointer list-none text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--ink-faint)] [&::-webkit-details-marker]:hidden">
                Pending outputs
                <span className="ml-2 font-normal">{needsInputCards.length + unsupportedCards.length} pending</span>
              </summary>
              <div className="mt-3 grid gap-3">
                {needsInputCards.length > 0 ? (
                  <div className="grid gap-2">
                    <div className="text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[color:var(--ink-faint)]">Parked by current route</div>
                    {needsInputCards.map((card) => <PendingOutputRow card={card} key={card.output} />)}
                  </div>
                ) : null}
                {unsupportedCards.length > 0 ? (
                  <div className="grid gap-2">
                    <div className="text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[color:var(--ink-faint)]">Unsupported on this lane</div>
                    {unsupportedCards.map((card) => <PendingOutputRow card={card} key={card.output} />)}
                  </div>
                ) : null}
              </div>
            </details>
          ) : null}

        </div>
      </div>
    </div>
  );
}
