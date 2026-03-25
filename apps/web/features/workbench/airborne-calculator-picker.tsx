"use client";

import type { AirborneCalculatorId } from "@dynecho/shared";
import { Radar, SlidersHorizontal } from "lucide-react";
import { useId } from "react";

import { FieldGuide } from "./field-guide";
import type { StudyMode } from "./preset-definitions";

const CALCULATOR_OPTIONS: Array<{
  blurb: string;
  id: AirborneCalculatorId;
  label: string;
}> = [
  { id: "dynamic", label: "Dynamic", blurb: "Topology read, family blend, confidence trace" },
  { id: "ks_rw_calibrated", label: "KS", blurb: "Mass-calibrated reference lane" },
  { id: "mass_law", label: "Mass Law", blurb: "Transparent baseline by surface mass" },
  { id: "sharp", label: "Sharp", blurb: "Coincidence-aware panel curve" },
  { id: "kurtovic", label: "Kurtovic", blurb: "Alternative simple panel lane" }
];

function getButtonClasses(active: boolean, featured: boolean): string {
  if (active && featured) {
    return "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]";
  }

  if (active) {
    return "border-[color:var(--ink)] bg-[color:var(--panel-strong)] text-[color:var(--ink)]";
  }

  return "border-[color:var(--line)] bg-[color:var(--paper)] text-[color:var(--ink-soft)] hover:bg-black/[0.03]";
}

type AirborneCalculatorPickerProps = {
  activeCalculatorId: AirborneCalculatorId;
  onCalculatorChange: (calculatorId: AirborneCalculatorId) => void;
  studyMode: StudyMode;
};

export function AirborneCalculatorPicker({
  activeCalculatorId,
  onCalculatorChange,
  studyMode
}: AirborneCalculatorPickerProps) {
  const inputId = useId();
  const activeOption = CALCULATOR_OPTIONS.find((option) => option.id === activeCalculatorId) ?? CALCULATOR_OPTIONS[0];

  return (
    <article className="rounded-lg border hairline bg-[color:var(--panel-strong)] px-4 py-4">
      <FieldGuide
        guide={{
          currentUse:
            studyMode === "wall"
              ? `${activeOption.label} currently drives the visible Rw / C / Ctr / STC lane. Impact outputs stay on their own floor-side branch.`
              : `${activeOption.label} currently drives the companion airborne lane on this floor study while Ln,w logic stays separate.`,
          kind: studyMode === "wall" ? "active" : "conditional",
          meaning:
            "This selector chooses which local airborne calculator or family selector builds the transmission-loss curve before any leakage or field flanking overlays are applied."
        }}
        hint="Select the airborne lane. Dynamic is the main local path; the others stay available for comparison."
        inputId={inputId}
        label="Airborne calculator"
      >
        <div aria-label="Airborne calculator" className="grid gap-2 sm:grid-cols-2" id={inputId} role="group">
          {CALCULATOR_OPTIONS.map((option) => {
            const active = option.id === activeCalculatorId;
            const featured = option.id === "dynamic";

            return (
              <button
                className={`focus-ring rounded-md border px-4 py-3 text-left transition ${featured ? "sm:col-span-2" : ""} ${getButtonClasses(active, featured)}`}
                key={option.id}
                onClick={() => onCalculatorChange(option.id)}
                title={option.blurb}
                type="button"
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  {featured ? <Radar className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
                  {option.label}
                </div>
                <p className="mt-2 text-sm leading-6 opacity-80">{option.blurb}</p>
              </button>
            );
          })}
        </div>
      </FieldGuide>
    </article>
  );
}
