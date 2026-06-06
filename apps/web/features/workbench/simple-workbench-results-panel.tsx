"use client";

import React from "react";
import type { AssemblyCalculation, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { FileText, Microscope, NotebookText } from "lucide-react";

import { OutputCard, OutputCoverageSummary, OutputUnlockRail, PendingOutputRow } from "./simple-workbench-output-cards";
import { CalculationTraceDropdown, SectionLead, GuidedFactChip } from "./simple-workbench-primitives";
import { LayerStackDiagram } from "./simple-workbench-layer-diagram";
import { ResultAnswerChart } from "./result-answer-chart";
import { ResponseCurveFigureCard } from "./response-curve-figure-card";
import type { WorkbenchResponseCurveFigure } from "./response-curve-model";
import type { OutputCardModel } from "./simple-workbench-output-model";
import { outputStatusTextClass, statusLabel } from "./simple-workbench-output-model";
import { workbenchSectionMutedCardClass } from "./simple-workbench-layer-visuals";
import type { ReviewTabId } from "./simple-workbench-constants";
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
  onOpenAssembly: () => void;
  onSelectReviewTab: (tabId: ReviewTabId) => void;
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
    onOpenAssembly,
    onSelectReviewTab,
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
      ? `${formatCountLabel(liveRowCount, "live row")} used, ${formatCountLabel(parkedRowCount, "parked row")} outside the active read.`
      : collapsedLiveRowCount > 0
        ? `${formatCountLabel(liveRowCount, "live row")} collapse to ${formatCountLabel(solverLayerCount, "solver layer")} before solving.`
        : "Every visible row contributes to the active read.";
  const briefTargets = [
    targetRwDb && targetRwDb.trim().length > 0 ? `Rw >= ${targetRwDb.trim()} dB` : null,
    targetLnwDb && targetLnwDb.trim().length > 0 ? `Ln,w <= ${targetLnwDb.trim()} dB` : null
  ].filter((value): value is string => Boolean(value));
  const firstWarning = warnings[0] ?? null;
  const pendingOutputCount = needsInputCards.length + unsupportedCards.length;
  const reviewActions: ReadonlyArray<{
    icon: React.ComponentType<{ className?: string }>;
    id: ReviewTabId;
    label: string;
  }> = [
    { icon: NotebookText, id: "method", label: "Method" },
    { icon: FileText, id: "proposal", label: "Proposal" },
    { icon: Microscope, id: "diagnostics", label: "Diagnostics" }
  ];

  return (
    <div
      className={isDesktop
        ? `${activeWorkspacePanel === "setup" ? "col-start-3" : "col-start-2"} row-start-1 min-h-0 min-w-0 overflow-y-auto bg-[color:color-mix(in_oklch,var(--panel)_36%,var(--paper))] px-5 py-5`
        : `stage-enter-3 min-h-0 min-w-0 overflow-y-auto px-4 py-4 ${activeWorkspacePanel === "results" ? "block" : "hidden"}`
      }
    >
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
                <section className="rounded border border-[color:var(--line)] bg-[color:var(--panel)] px-4 py-4">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 max-w-3xl">
                        <div className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
                          Primary result
                        </div>
                        <h3 className="mt-1 text-[1.05rem] font-semibold text-[color:var(--ink)]">{heroHeadline}</h3>
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
                    <details className="mt-3 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-2">
                      <summary className="cursor-pointer text-[0.78rem] font-semibold text-[color:var(--ink)]">
                        Information
                      </summary>
                      <p className="mt-2 max-w-2xl text-[0.82rem] leading-5 text-[color:var(--ink-soft)]">{validationSummary.detail}</p>
                    </details>

                    <div className="mt-5 grid gap-4 3xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] 3xl:items-start">
                      <div className="grid gap-4">
                        <article className="rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-4 py-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                                {primaryReadyCard.label}
                              </div>
                              <div className="mt-2 text-[clamp(2.35rem,4vw,3.35rem)] font-semibold leading-none text-[color:var(--ink)]">
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
                            <div className="rounded border border-[color:var(--line)] bg-[color:var(--panel)] px-3 py-3">
                              <div className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Stack contribution</div>
                              <div className="mt-2 text-[0.95rem] font-semibold text-[color:var(--ink)]">{formatCountLabel(liveRowCount, "live row")} active</div>
                              <div className="mt-1 text-[0.76rem] leading-5 text-[color:var(--ink-soft)]">{liveStackDetail}</div>
                            </div>
                            <div className="rounded border border-[color:var(--line)] bg-[color:var(--panel)] px-3 py-3">
                              <div className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Brief thresholds</div>
                              <div className="mt-2 text-[0.95rem] font-semibold text-[color:var(--ink)]">
                                {briefTargets[0] ?? "No target armed"}
                              </div>
                              <div className="mt-1 text-[0.76rem] leading-5 text-[color:var(--ink-soft)]">
                                {briefTargets.length > 1 ? briefTargets.slice(1).join(" · ") : "Set brief thresholds to compare the active read."}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex min-w-0 flex-wrap items-center gap-2 border-t border-[color:var(--line)] pt-3">
                            <span className="mr-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
                              Review
                            </span>
                            {reviewActions.map((action) => {
                              const Icon = action.icon;

                              return (
                                <button
                                  className="focus-ring inline-flex h-8 items-center gap-1.5 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2.5 text-[0.78rem] font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
                                  key={action.id}
                                  onClick={() => onSelectReviewTab(action.id)}
                                  type="button"
                                >
                                  <Icon className="h-3.5 w-3.5" />
                                  {action.label}
                                </button>
                              );
                            })}
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
                        <ResultAnswerChart layout="stacked" result={result} targetLnwDb={targetLnwDb} targetRwDb={targetRwDb} />
                      </div>
                    </div>

                    {responseCurves.length > 0 ? (
                      <div className="mt-5 border-t border-[color:color-mix(in_oklch,var(--ink)_8%,var(--line))] pt-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Live frequency curves</div>
                            <p className="mt-1 max-w-2xl text-[0.8rem] leading-5 text-[color:var(--ink-soft)]">
                              Frequency-band trace for the weighted read.
                            </p>
                          </div>
                          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                            {responseCurves.length} live chart{responseCurves.length === 1 ? "" : "s"}
                          </div>
                        </div>

                        <div className={`mt-4 grid gap-4 ${responseCurves.length > 1 ? "2xl:grid-cols-2" : ""}`}>
                          {responseCurves.map((figure) => (
                            <ResponseCurveFigureCard figure={figure} key={figure.id} />
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {isDesktop ? (
                      <details className="mt-5 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-3">
                        <summary className="cursor-pointer list-none">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="text-sm font-semibold text-[color:var(--ink)]">Stack visual</div>
                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                              {formatCountLabel(rows.length, "row")}
                            </div>
                          </div>
                        </summary>
                        <div className="mt-3">
                          <LayerStackDiagram activeRowId={activeRowId} materials={materials} result={result} rows={rows} studyMode={studyMode} />
                        </div>
                      </details>
                    ) : null}
                  </div>
                </section>

              </>
            ) : (
            <div className={`rounded border border-dashed px-4 py-5 text-sm leading-6 text-[color:var(--ink-soft)] ${workbenchSectionMutedCardClass("results")}`}>
              <div className="font-semibold text-[color:var(--ink)]">No primary result yet</div>
              <p className="mt-1">Build a valid stack or fix parked layer inputs to see the primary output here.</p>
              <button
                className="focus-ring mt-4 inline-flex items-center justify-center rounded border border-[color:var(--accent)] bg-[color:var(--accent-soft)] px-3 py-2 text-[0.82rem] font-semibold text-[color:var(--accent-ink)] hover:brightness-95"
                onClick={onOpenAssembly}
                type="button"
              >
                Open assembly
              </button>
            </div>
          )}

          <CalculationTraceDropdown result={result} studyMode={studyMode} />

          <OutputUnlockRail groups={outputUnlockGroups} />

          {warnings.length ? (
            <details className="rounded border border-[color:var(--warning)] bg-[color:var(--warning-soft)] px-3 py-2.5 text-[color:var(--warning-ink)]">
              <summary className="cursor-pointer list-none">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold">Warnings</div>
                    {firstWarning ? <div className="mt-0.5 line-clamp-2 text-[0.78rem] font-medium leading-5">{firstWarning}</div> : null}
                  </div>
                  <GuidedFactChip tone="warning">{`${warnings.length} warning${warnings.length === 1 ? "" : "s"}`}</GuidedFactChip>
                </div>
              </summary>
              <div className="mt-3 grid gap-2 text-sm leading-6">
                {warnings.slice(0, 3).map((warning) => (
                  <div key={warning}>{warning}</div>
                ))}
                {warnings.length > 3 ? <div>{`+${warnings.length - 3} more warning${warnings.length - 3 === 1 ? "" : "s"} in diagnostics.`}</div> : null}
                <button
                  className="focus-ring mt-1 inline-flex w-fit items-center justify-center rounded border border-[color:var(--warning)] bg-[color:var(--paper)] px-3 py-1.5 text-[0.78rem] font-semibold text-[color:var(--warning-ink)] hover:brightness-95"
                  onClick={() => onSelectReviewTab("diagnostics")}
                  type="button"
                >
                  Open diagnostics
                </button>
              </div>
            </details>
          ) : null}

          {pendingOutputCount > 0 ? (
            <details className={`rounded border px-3 py-2.5 ${workbenchSectionMutedCardClass("results")}`}>
              <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--ink-faint)]">Pending outputs</span>
                  <span className="text-[0.72rem] font-semibold text-[color:var(--ink-soft)]">
                    {needsInputCards.length ? `${needsInputCards.length} parked` : null}
                    {needsInputCards.length && unsupportedCards.length ? " / " : null}
                    {unsupportedCards.length ? `${unsupportedCards.length} unsupported` : null}
                  </span>
                </div>
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
