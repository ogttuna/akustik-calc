"use client";

import type { AssemblyCalculation, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";

import { PrimaryResultCard, OutputCard, OutputCoverageSummary, OutputUnlockRail, PendingOutputRow } from "./simple-workbench-output-cards";
import { CalculationTraceDropdown, SectionLead, GuidedFactChip } from "./simple-workbench-primitives";
import { LayerStackDiagram } from "./simple-workbench-layer-diagram";
import type { OutputCardModel } from "./simple-workbench-output-model";
import { workbenchSectionMutedCardClass } from "./simple-workbench-layer-visuals";
import type { GuidedValidationSummary } from "./guided-validation-summary";
import type { StudyMode } from "./preset-definitions";
import type { LayerDraft } from "./workbench-store";

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
  routeCoverageLabel: string;
  rows: readonly LayerDraft[];
  secondaryReadyCards: readonly OutputCardModel[];
  solverLayerCount: number;
  studyMode: StudyMode;
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
    routeCoverageLabel,
    rows,
    secondaryReadyCards,
    solverLayerCount,
    studyMode,
    totalOutputCount,
    unsupportedCards,
    validationSummary,
    warnings,
  } = props;

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
                <PrimaryResultCard
                card={primaryReadyCard}
                collapsedLiveRowCount={collapsedLiveRowCount}
                contextLabel={contextLabel}
                heroHeadline={heroHeadline}
                liveRowCount={liveRowCount}
                parkedRowCount={parkedRowCount}
                solverLayerCount={solverLayerCount}
                studyMode={studyMode}
                validationSummary={validationSummary}
              />

              {secondaryReadyCards.length ? (
                <details className={`rounded border px-3 py-3 ${workbenchSectionMutedCardClass("results")}`}>
                  <summary className="cursor-pointer list-none">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-[color:var(--ink)]">Supporting metrics</div>
                      <div className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                        {secondaryReadyCards.length} companion values
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
