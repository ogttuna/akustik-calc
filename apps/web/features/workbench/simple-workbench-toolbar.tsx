"use client";

import type { AirborneContextMode } from "@dynecho/shared";
import { ChevronRight, Download, Moon, RotateCcw, Sun } from "lucide-react";
import Link from "next/link";

import type { PresetDefinition, PresetId, StudyMode } from "./preset-definitions";
import { AIRBORNE_CONTEXT_OPTIONS } from "./simple-workbench-constants";
import { getStudyModeLabel } from "./simple-workbench-utils";

type SimpleWorkbenchToolbarProps = {
  airborneContextMode: AirborneContextMode;
  automaticOutputsLength: number;
  exportReady: boolean;
  isExportingPdf: boolean;
  modePresets: readonly PresetDefinition[];
  onContextModeChange: (mode: AirborneContextMode) => void;
  onExportBrandedPdf: () => void;
  onExportSimplePdf: () => void;
  onPresetChange: (presetId: PresetId) => void;
  onReset: () => void;
  onStudyModeChange: (mode: StudyMode) => void;
  onToggleTheme: () => void;
  readyOutputCount: number;
  rowCount: number;
  selectedPresetId: PresetId;
  studyMode: StudyMode;
  theme: "dark" | "light";
};

export function SimpleWorkbenchToolbar({
  airborneContextMode,
  automaticOutputsLength,
  exportReady,
  isExportingPdf,
  modePresets,
  onContextModeChange,
  onExportBrandedPdf,
  onExportSimplePdf,
  onPresetChange,
  onReset,
  onStudyModeChange,
  onToggleTheme,
  readyOutputCount,
  rowCount,
  selectedPresetId,
  studyMode,
  theme,
}: SimpleWorkbenchToolbarProps) {
  return (
    <div className="stage-enter border-b border-[color:var(--line)] bg-[color:var(--paper)] px-4 py-2.5">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h1 className="shrink-0 text-sm font-semibold text-[color:var(--ink)]">
          {`${getStudyModeLabel(studyMode)} calculator`}
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Study type"
            className="focus-ring touch-target h-8 min-w-0 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2 text-[0.8rem] text-[color:var(--ink)]"
            onChange={(event) => onStudyModeChange(event.target.value as StudyMode)}
            value={studyMode}
          >
            <option value="floor">Floor</option>
            <option value="wall">Wall</option>
          </select>

          <select
            aria-label="Project context"
            className="focus-ring touch-target h-8 min-w-0 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2 text-[0.8rem] text-[color:var(--ink)]"
            onChange={(event) => onContextModeChange(event.target.value as AirborneContextMode)}
            value={airborneContextMode}
          >
            {AIRBORNE_CONTEXT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            aria-label="Example stack"
            className="focus-ring touch-target h-8 min-w-0 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2 text-[0.8rem] text-[color:var(--ink)]"
            onChange={(event) => onPresetChange(event.target.value as PresetId)}
            value={selectedPresetId}
          >
            {modePresets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="focus-ring touch-target inline-flex h-8 items-center gap-1.5 rounded border border-[color:var(--accent)] bg-[color:var(--accent-soft)] px-2.5 text-[0.8rem] font-semibold text-[color:var(--accent-ink)] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!exportReady || isExportingPdf}
            onClick={onExportBrandedPdf}
            type="button"
          >
            <Download className="h-3.5 w-3.5" />
            {isExportingPdf ? "Exporting..." : "PDF"}
          </button>
          <button
            className="focus-ring touch-target inline-flex h-8 items-center gap-1.5 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2.5 text-[0.8rem] font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!exportReady || isExportingPdf}
            onClick={onExportSimplePdf}
            type="button"
          >
            {isExportingPdf ? "..." : "Simple PDF"}
          </button>

          <button
            className="focus-ring touch-target inline-flex h-8 items-center gap-1.5 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2.5 text-[0.8rem] font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
            onClick={onReset}
            type="button"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>

          <Link
            className="focus-ring touch-target inline-flex h-8 items-center gap-1.5 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2.5 text-[0.8rem] font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
            href="/workbench?view=advanced"
          >
            Advanced
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>

          <button
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="focus-ring touch-target inline-flex h-8 w-8 items-center justify-center rounded border border-[color:var(--line)] bg-[color:var(--paper)] text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
            onClick={onToggleTheme}
            type="button"
          >
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </div>

        <div className="ml-auto flex items-center gap-1.5 text-[0.72rem] text-[color:var(--ink-faint)]">
          <span>{`${readyOutputCount}/${automaticOutputsLength} ready`}</span>
          <span className="text-[color:var(--line)]">|</span>
          <span>{`${rowCount} row${rowCount === 1 ? "" : "s"}`}</span>
        </div>
      </div>
    </div>
  );
}
