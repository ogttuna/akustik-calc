"use client";

import type { ComponentProps } from "react";

import { GuidedDecisionBasisStrip, GuidedConstructionSnapshot } from "./simple-workbench-decision-cards";
import { ReviewTabButton } from "./simple-workbench-primitives";
import { REVIEW_TABS, type ReviewTabId } from "./simple-workbench-constants";
import type { WorkspacePanelId } from "./simple-workbench-constants";
import { SimpleWorkbenchMethodPanel } from "./simple-workbench-method-panel";
import { SimpleWorkbenchDiagnosticsPanel } from "./simple-workbench-diagnostics-panel";
import { SimpleWorkbenchProposalPanel } from "./simple-workbench-proposal-panel";

type SimpleWorkbenchReviewPanelProps = {
  /** Whether the review deck is expanded. */
  reviewExpanded: boolean;
  /** Whether the desktop layout is active. */
  isDesktop: boolean;
  /** The currently active workspace panel id (used for mobile visibility). */
  activeWorkspacePanel: WorkspacePanelId;
  /** The currently active review tab. */
  activeReviewTab: ReviewTabId;
  /** Computed panel id for the active review tab, e.g. "guided-review-panel-method". */
  activeReviewPanelId: string;
  /** Handler called when a review tab is selected. */
  selectReviewTab: (tabId: ReviewTabId) => void;
  /** Handler called when the "Hide review" button is clicked. */
  closeReviewPanel: () => void;

  // --- Stats ---
  /** Number of live proposal metrics. */
  proposalMetricsCount: number;
  /** Number of visible proposal layers. */
  proposalLayersCount: number;
  /** Scenario warnings. */
  warnings: readonly string[];

  // --- Rows gate (for conditional decision basis strip) ---
  /** Whether there are any assembly rows (rows.length > 0). */
  hasRows: boolean;

  // --- GuidedDecisionBasisStrip props ---
  corridorDossierCards: ComponentProps<typeof GuidedDecisionBasisStrip>["cards"];
  corridorDossierHeadline: string;
  selectedTraceNoteCount: number;
  traceGroupCount: number;

  // --- GuidedConstructionSnapshot props ---
  proposalLayers: ComponentProps<typeof GuidedConstructionSnapshot>["layers"];
  studyModeLabel: string;

  // --- SimpleWorkbenchMethodPanel props ---
  methodPanelProps: ComponentProps<typeof SimpleWorkbenchMethodPanel>;

  // --- SimpleWorkbenchDiagnosticsPanel props ---
  diagnosticsPanelProps: ComponentProps<typeof SimpleWorkbenchDiagnosticsPanel>;

  // --- SimpleWorkbenchProposalPanel props ---
  proposalPanelProps: ComponentProps<typeof SimpleWorkbenchProposalPanel>;
};

export function SimpleWorkbenchReviewPanel(props: SimpleWorkbenchReviewPanelProps) {
  const {
    reviewExpanded,
    isDesktop,
    activeWorkspacePanel,
    activeReviewTab,
    activeReviewPanelId,
    selectReviewTab,
    closeReviewPanel,
    proposalMetricsCount,
    proposalLayersCount,
    warnings,
    hasRows,
    corridorDossierCards,
    corridorDossierHeadline,
    selectedTraceNoteCount,
    traceGroupCount,
    proposalLayers,
    studyModeLabel,
    methodPanelProps,
    diagnosticsPanelProps,
    proposalPanelProps
  } = props;

  if (!reviewExpanded) {
    return null;
  }

  return (
    <section className={`${isDesktop || activeWorkspacePanel === "review" ? "grid" : "hidden"} gap-4 px-4 py-4`} id="guided-review-deck">
      <div className="border-b border-[color:var(--line)] pb-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h2 className="text-sm font-semibold text-[color:var(--ink)]">Review</h2>
          <div className="flex gap-3 text-[0.72rem] font-medium text-[color:var(--ink-faint)]">
            <div>{`${proposalMetricsCount} live metric${proposalMetricsCount === 1 ? "" : "s"}`}</div>
            <div>{`${proposalLayersCount} visible row${proposalLayersCount === 1 ? "" : "s"}`}</div>
            <div>{warnings.length > 0 ? `${warnings.length} warning${warnings.length === 1 ? "" : "s"}` : "No live warnings"}</div>
          </div>
        </div>

        <div
          aria-label="Guided review sections"
          className="mt-4 flex flex-wrap gap-2"
          role="tablist"
        >
          {REVIEW_TABS.map((tab) => (
            <ReviewTabButton
              active={tab.id === activeReviewTab}
              controlsId={`guided-review-panel-${tab.id}`}
              id={tab.id}
              key={tab.id}
              label={tab.label}
              onSelect={selectReviewTab}
            />
          ))}
        </div>

        <div className="mt-3 flex items-center justify-end">
          <button
            className="focus-ring inline-flex items-center justify-center rounded border border-[color:var(--line)] px-2.5 py-1.5 text-[0.8rem] font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
            onClick={closeReviewPanel}
            type="button"
          >
            Hide review
          </button>
        </div>
      </div>

      {reviewExpanded && hasRows ? (
        <GuidedDecisionBasisStrip
          cards={corridorDossierCards}
          headline={corridorDossierHeadline}
          selectedTraceNoteCount={selectedTraceNoteCount}
          traceGroupCount={traceGroupCount}
        />
      ) : null}

      {reviewExpanded && proposalLayers.length > 0 ? (
        <GuidedConstructionSnapshot
          layers={proposalLayers}
          studyModeLabel={studyModeLabel}
        />
      ) : null}

      {reviewExpanded && activeReviewTab === "method" ? (
        <div
          aria-labelledby="guided-review-tab-method"
          id={activeReviewPanelId}
          role="tabpanel"
        >
          <SimpleWorkbenchMethodPanel {...methodPanelProps} />
        </div>
      ) : null}

      {reviewExpanded && activeReviewTab === "diagnostics" ? (
        <div
          aria-labelledby="guided-review-tab-diagnostics"
          id={activeReviewPanelId}
          role="tabpanel"
        >
          <SimpleWorkbenchDiagnosticsPanel {...diagnosticsPanelProps} />
        </div>
      ) : null}

      {reviewExpanded && activeReviewTab === "proposal" ? (
        <div
          aria-labelledby="guided-review-tab-proposal"
          id={activeReviewPanelId}
          role="tabpanel"
        >
          <SimpleWorkbenchProposalPanel {...proposalPanelProps} />
        </div>
      ) : null}
    </section>
  );
}
