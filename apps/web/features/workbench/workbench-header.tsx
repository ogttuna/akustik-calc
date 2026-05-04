"use client";

import Link from "next/link";
import { ArrowLeft, ChevronDown, Command } from "lucide-react";

import type { AirborneCalculatorId } from "@dynecho/shared";
import { Pill, SectionHeading, SurfacePanel } from "@dynecho/ui";

import { AirborneCalculatorPicker } from "./airborne-calculator-picker";
import type { PresetDefinition, StudyMode } from "./preset-definitions";
import { PresetStrip } from "./preset-strip";
import { STUDY_MODE_LABELS } from "./workbench-data";

type WorkbenchHeaderProps = {
  activePreset: PresetDefinition;
  activeCalculatorId: AirborneCalculatorId;
  onCalculatorChange: (calculatorId: AirborneCalculatorId) => void;
  onOpenCommands: () => void;
  projectName: string;
  savedScenarioCount: number;
  onPreset: (presetId: PresetDefinition["id"]) => void;
  onReset: () => void;
  studyMode: StudyMode;
};

export function WorkbenchHeader({
  activePreset,
  activeCalculatorId,
  onCalculatorChange,
  onOpenCommands,
  onPreset,
  onReset,
  projectName,
  savedScenarioCount,
  studyMode
}: WorkbenchHeaderProps) {
  const modeHeadline =
    studyMode === "wall"
      ? "Local wall-side solver for Rw, R'w, STC, and controlled field overlays."
      : "Local floor-side solver for Ln,w, L'n,w, L'nT,w, DeltaLw, and guide carry-over.";
  const modeDescription =
    studyMode === "wall"
      ? `${projectName}. ${activePreset.summary} Dynamic airborne stays local; wall field drift remains explicit.`
      : `${projectName}. ${activePreset.summary} Exact floor families, official product evidence, and dynamic impact trace stay visible in one deck.`;

  return (
    <SurfacePanel className="stage-enter px-4 py-3">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap gap-2">
          <Pill tone="accent">Workbench</Pill>
          <Pill tone="neutral">{STUDY_MODE_LABELS[studyMode]}</Pill>
          <Pill tone={activeCalculatorId === "dynamic" ? "success" : "warning"}>
            {activeCalculatorId === "dynamic" ? "Dynamic" : "Manual lane"}
          </Pill>
          <Pill tone="neutral">{savedScenarioCount} saved scenario{savedScenarioCount === 1 ? "" : "s"}</Pill>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <button
            aria-haspopup="dialog"
            className="focus-ring touch-target inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
            onClick={onOpenCommands}
            type="button"
          >
            <Command className="h-4 w-4" />
            Commands
            <span className="rounded-full border hairline px-2 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
              Ctrl K
            </span>
          </button>
          <Link className="focus-ring touch-target inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold hover:bg-[color:var(--panel)]" href="/">
            <ArrowLeft className="h-4 w-4" />
            Overview
          </Link>
        </div>
      </div>

      <details className="mt-3 rounded-lg border hairline bg-[color:var(--panel)]">
        <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-3 py-2 text-sm font-semibold text-[color:var(--ink)]">
          <span className="min-w-0">Advanced setup</span>
          <span className="inline-flex min-w-0 items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
            {activePreset.label}
            <ChevronDown className="h-4 w-4" />
          </span>
        </summary>
        <div className="grid min-w-0 gap-4 border-t border-[color:var(--line)] p-3 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]">
          <div className="min-w-0 space-y-4">
            <SectionHeading eyebrow="Solver shell" title={modeHeadline} description={modeDescription} />
            <PresetStrip activePresetId={activePreset.id} onPreset={onPreset} onReset={onReset} />
          </div>
          <div className="min-w-0">
            <AirborneCalculatorPicker
              activeCalculatorId={activeCalculatorId}
              onCalculatorChange={onCalculatorChange}
              studyMode={studyMode}
            />
          </div>
        </div>
      </details>
    </SurfacePanel>
  );
}
