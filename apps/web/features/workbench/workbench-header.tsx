"use client";

import Link from "next/link";
import { ArrowLeft, Command, LaptopMinimalCheck, ShieldBan, Waypoints } from "lucide-react";

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
    <SurfacePanel className="stage-enter overflow-hidden px-6 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <Pill tone="accent">Workbench</Pill>
          <Pill tone="neutral">{STUDY_MODE_LABELS[studyMode]}</Pill>
          <Pill tone={activeCalculatorId === "dynamic" ? "success" : "warning"}>
            {activeCalculatorId === "dynamic" ? "Dynamic lane active" : "Manual airborne lane"}
          </Pill>
          <Pill tone="neutral">{savedScenarioCount} saved scenario{savedScenarioCount === 1 ? "" : "s"}</Pill>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            aria-haspopup="dialog"
            className="focus-ring touch-target inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
            onClick={onOpenCommands}
            type="button"
          >
            <Command className="h-4 w-4" />
            Open commands
            <span className="rounded-full border hairline px-2 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
              Ctrl K
            </span>
          </button>
          <Link className="focus-ring touch-target inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold hover:bg-[color:var(--panel)]" href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to overview
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <SectionHeading
            eyebrow="Interactive shell"
            title={modeHeadline}
            description={modeDescription}
          />
          <PresetStrip activePresetId={activePreset.id} onPreset={onPreset} onReset={onReset} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <AirborneCalculatorPicker
            activeCalculatorId={activeCalculatorId}
            onCalculatorChange={onCalculatorChange}
            studyMode={studyMode}
          />
          <article className="rounded-lg border hairline bg-[color:var(--panel-strong)] px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <LaptopMinimalCheck className="h-4 w-4" />
              Live shell
            </div>
            <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">
              Responsive editor, local solver selection, curated exact families, explicit field carry-over, and export-ready reporting in one workspace.
            </p>
          </article>
          <article className="rounded-lg border hairline bg-[color:var(--panel)] px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <Waypoints className="h-4 w-4" />
              Current preset
            </div>
            <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">
              {activePreset.label}: {activePreset.note}
            </p>
          </article>
          <article className="rounded-lg border hairline bg-[color:var(--panel)] px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <ShieldBan className="h-4 w-4" />
              Upstream lock
            </div>
            <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">
              `Acoustic2` stays read-only reference material. Local engine code owns the live lane; upstream only informs parity and missing coverage.
            </p>
          </article>
        </div>
      </div>
    </SurfacePanel>
  );
}
