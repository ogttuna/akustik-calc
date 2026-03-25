"use client";

import type { ImpactGuideDerivation } from "@dynecho/engine";
import type { ReportProfile, RequestedOutputId, StudyContext } from "@dynecho/shared";
import { ClipboardList, Landmark, ScrollText, Target } from "lucide-react";

import { Pill, SurfacePanel } from "@dynecho/ui";

import { getTargetOutputCorridor, getTargetOutputStatus } from "./target-output-status";
import {
  describeAirborneValidationPosture,
  describeImpactValidationPosture,
  getActiveValidationFamily,
  getActiveValidationMode
} from "./validation-regime";
import {
  REPORT_PROFILE_LABELS,
  REQUESTED_OUTPUT_DESCRIPTIONS,
  REQUESTED_OUTPUT_LABELS,
  REQUESTED_OUTPUT_SUPPORT_NOTES,
  STUDY_CONTEXT_LABELS
} from "./workbench-data";

type ProjectBriefPanelProps = {
  activeCriteriaPackLabel: string;
  briefNote: string;
  clientName: string;
  guideResult: ImpactGuideDerivation | null;
  projectName: string;
  reportProfile: ReportProfile;
  result: import("@dynecho/shared").AssemblyCalculation | null;
  requestedOutputs: readonly RequestedOutputId[];
  studyContext: StudyContext;
  targetLnwDb: string;
  targetRwDb: string;
  onBriefNoteChange: (value: string) => void;
  onClientNameChange: (value: string) => void;
  onProjectNameChange: (value: string) => void;
  onReportProfileChange: (value: ReportProfile) => void;
  onStudyContextChange: (value: StudyContext) => void;
  onTargetLnwDbChange: (value: string) => void;
  onTargetRwDbChange: (value: string) => void;
  onToggleRequestedOutput: (output: RequestedOutputId) => void;
};

export function ProjectBriefPanel({
  activeCriteriaPackLabel,
  briefNote,
  clientName,
  guideResult,
  onBriefNoteChange,
  onClientNameChange,
  onProjectNameChange,
  onReportProfileChange,
  onStudyContextChange,
  onTargetLnwDbChange,
  onTargetRwDbChange,
  onToggleRequestedOutput,
  projectName,
  reportProfile,
  result,
  requestedOutputs,
  studyContext,
  targetLnwDb,
  targetRwDb
}: ProjectBriefPanelProps) {
  const airbornePosture = describeAirborneValidationPosture(result);
  const impactPosture = describeImpactValidationPosture(result);
  const activeValidationFamily = getActiveValidationFamily(result);
  const activeValidationMode = getActiveValidationMode(result);

  function getActiveButtonClass(
    tone: "accent" | "neutral" | "success" | "warning",
    isActive: boolean
  ): string {
    if (!isActive) {
      return "hairline bg-[color:var(--paper)] text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]";
    }

    switch (tone) {
      case "success":
        return "border-[color:var(--success-ink)]/35 bg-[color:var(--success-soft)]/55 text-[color:var(--success-ink)]";
      case "warning":
        return "border-[color:var(--warning-ink)]/28 bg-[color:var(--warning-soft)]/65 text-[color:var(--warning-ink)]";
      case "neutral":
        return "border-[color:var(--line)] bg-[color:var(--panel-strong)] text-[color:var(--ink)]";
      case "accent":
        return "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]";
    }
  }

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border hairline bg-[color:var(--panel-strong)]">
          <ClipboardList className="h-4 w-4 text-[color:var(--ink)]" />
        </div>
        <div>
          <div className="eyebrow">Project brief</div>
          <h2 className="mt-1 font-display text-[1.9rem] leading-none tracking-[-0.04em]">Context and targets</h2>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
            Project
          </span>
          <input
            className="focus-ring touch-target rounded-2xl border hairline bg-[color:var(--paper)] px-4 py-3"
            onChange={(event) => onProjectNameChange(event.target.value)}
            value={projectName}
          />
        </label>
        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
            Client / stream
          </span>
          <input
            className="focus-ring touch-target rounded-2xl border hairline bg-[color:var(--paper)] px-4 py-3"
            onChange={(event) => onClientNameChange(event.target.value)}
            value={clientName}
          />
        </label>
        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
            Assumptions and caveats
          </span>
          <textarea
            className="focus-ring min-h-32 rounded-lg border hairline bg-[color:var(--paper)] px-4 py-3"
            onChange={(event) => onBriefNoteChange(event.target.value)}
            placeholder="Capture scope assumptions, benchmark sources, flanking caveats, or delivery notes."
            value={briefNote}
          />
        </label>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
            Study context
          </span>
          <select
            className="focus-ring touch-target rounded-2xl border hairline bg-[color:var(--paper)] px-4 py-3"
            onChange={(event) => onStudyContextChange(event.target.value as StudyContext)}
            value={studyContext}
          >
            {Object.entries(STUDY_CONTEXT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
            Report profile
          </span>
          <select
            className="focus-ring touch-target rounded-2xl border hairline bg-[color:var(--paper)] px-4 py-3"
            onChange={(event) => onReportProfileChange(event.target.value as ReportProfile)}
            value={reportProfile}
          >
            {Object.entries(REPORT_PROFILE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 rounded-lg border hairline bg-[color:var(--panel)] px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <Target className="h-4 w-4" />
            Requested outputs
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill tone={airbornePosture.posture === "inactive" ? "neutral" : "accent"}>
              Airborne: {airbornePosture.label}
            </Pill>
            <Pill tone={impactPosture.posture === "exact" ? "success" : impactPosture.posture === "bound" ? "warning" : "accent"}>
              Impact: {activeValidationMode?.label ?? impactPosture.label}
            </Pill>
            {activeValidationFamily ? <Pill tone="neutral">{activeValidationFamily.label}</Pill> : null}
          </div>
        </div>
        <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
          Hover or focus any output to read its current solver lane, active family corridor, and whether it is live,
          bound, guide-driven, or still staged.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(REQUESTED_OUTPUT_LABELS).map(([value, label]) => {
            const outputId = value as RequestedOutputId;
            const isActive = requestedOutputs.includes(outputId);
            const coverage = getTargetOutputStatus({
              guideResult,
              output: outputId,
              result
            });
            const corridor = getTargetOutputCorridor({
              guideResult,
              output: outputId,
              result
            });
            const assistiveText = `${label}: ${REQUESTED_OUTPUT_DESCRIPTIONS[outputId]}. Current status: ${coverage.label}. Current lane: ${corridor.laneLabel}${corridor.modeLabel ? ` / ${corridor.modeLabel}` : ""}${corridor.familyLabel ? ` / ${corridor.familyLabel}` : ""}. ${corridor.detail}`;

            return (
              <button
                aria-label={assistiveText}
                className={`focus-ring touch-target rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                  getActiveButtonClass(coverage.tone, isActive)
                }`}
                key={value}
                onClick={() => onToggleRequestedOutput(outputId)}
                title={`${assistiveText} ${REQUESTED_OUTPUT_SUPPORT_NOTES[outputId]}`}
                type="button"
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
            Target Rw / STC
          </span>
          <input
            className="focus-ring touch-target rounded-2xl border hairline bg-[color:var(--paper)] px-4 py-3"
            inputMode="decimal"
            onChange={(event) => onTargetRwDbChange(event.target.value)}
            value={targetRwDb}
          />
        </label>
        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
            Target Ln,w
          </span>
          <input
            className="focus-ring touch-target rounded-2xl border hairline bg-[color:var(--paper)] px-4 py-3"
            inputMode="decimal"
            onChange={(event) => onTargetLnwDbChange(event.target.value)}
            value={targetLnwDb}
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Pill tone="accent">{activeCriteriaPackLabel}</Pill>
        <Pill tone="neutral">
          <span className="inline-flex items-center gap-2">
            <Landmark className="h-3.5 w-3.5" />
            {REPORT_PROFILE_LABELS[reportProfile]}
          </span>
        </Pill>
        <Pill tone="neutral">{STUDY_CONTEXT_LABELS[studyContext]}</Pill>
        <Pill tone="neutral">
          <span className="inline-flex items-center gap-2">
            <ScrollText className="h-3.5 w-3.5" />
            Assumption log active
          </span>
        </Pill>
      </div>
    </SurfacePanel>
  );
}
