"use client";

import React from "react";
import type { AirborneContextMode } from "@dynecho/shared";
import { ChevronRight, CloudUpload, Download, FilePenLine, FolderOpen, Moon, RefreshCcw, RotateCcw, Sun } from "lucide-react";
import Link from "next/link";

import type { PresetDefinition, PresetId, StudyMode } from "./preset-definitions";
import { AIRBORNE_CONTEXT_OPTIONS } from "./simple-workbench-constants";
import { buildSimpleWorkbenchPresetGroups } from "./simple-workbench-preset-groups";
import { getStudyModeLabel } from "./simple-workbench-utils";

const EMPTY_EXAMPLE_VALUE = "__start_empty__";

type SimpleWorkbenchToolbarProps = {
  airborneContextMode: AirborneContextMode;
  exportReady: boolean;
  isExportingPdf: boolean;
  isServerProjectBusy: boolean;
  modePresets: readonly PresetDefinition[];
  onExportBrandedDocx: () => void;
  onContextModeChange: (mode: AirborneContextMode) => void;
  onExportBrandedPdf: () => void;
  onExportSimpleDocx: () => void;
  onExportSimplePdf: () => void;
  onLoadServerProject: () => void;
  onOpenPdfSetup: () => void;
  onPresetChange: (presetId: PresetId) => void;
  onRefreshServerProjects: () => void;
  onSelectedServerProjectChange: (projectId: string) => void;
  onStartEmpty: () => void;
  onReset: () => void;
  onStudyModeChange: (mode: StudyMode) => void;
  onSyncServerProject: () => void;
  onToggleTheme: () => void;
  readyOutputCount: number;
  rowCount: number;
  selectedPreset: PresetDefinition;
  selectedServerProjectId: string;
  serverProjectOptions: ReadonlyArray<{
    id: string;
    label: string;
  }>;
  serverProjectStatusLabel: string;
  studyMode: StudyMode;
  theme: "dark" | "light";
};

export function SimpleWorkbenchToolbar({
  airborneContextMode,
  exportReady,
  isExportingPdf,
  isServerProjectBusy,
  modePresets,
  onExportBrandedDocx,
  onContextModeChange,
  onExportBrandedPdf,
  onExportSimpleDocx,
  onExportSimplePdf,
  onLoadServerProject,
  onOpenPdfSetup,
  onPresetChange,
  onRefreshServerProjects,
  onSelectedServerProjectChange,
  onStartEmpty,
  onReset,
  onStudyModeChange,
  onSyncServerProject,
  onToggleTheme,
  readyOutputCount,
  rowCount,
  selectedPreset,
  selectedServerProjectId,
  serverProjectOptions,
  serverProjectStatusLabel,
  studyMode,
  theme,
}: SimpleWorkbenchToolbarProps) {
  const presetGroups = buildSimpleWorkbenchPresetGroups(modePresets);
  const selectedExampleValue = rowCount === 0 ? EMPTY_EXAMPLE_VALUE : selectedPreset.id;

  return (
    <div className="stage-enter border-b border-[color:var(--line)] bg-[color:var(--paper)] px-4 py-3">
      <div className="grid gap-3">
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="shrink-0 text-sm font-semibold text-[color:var(--ink)]">
              {`${getStudyModeLabel(studyMode)} calculator`}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[0.72rem] text-[color:var(--ink-faint)]">
              <span className="rounded-full border border-[color:var(--line)] bg-[color:var(--paper)] px-2 py-0.5 font-semibold text-[color:var(--ink-soft)]">
                {`${readyOutputCount} ready`}
              </span>
              <span>{`${rowCount} row${rowCount === 1 ? "" : "s"}`}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
              onClick={onExportBrandedDocx}
              type="button"
            >
              {isExportingPdf ? "..." : "DOCX"}
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
              className="focus-ring touch-target inline-flex h-8 items-center gap-1.5 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2.5 text-[0.8rem] font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!exportReady || isExportingPdf}
              onClick={onExportSimpleDocx}
              type="button"
            >
              {isExportingPdf ? "..." : "Simple DOCX"}
            </button>
            <button
              className="focus-ring touch-target inline-flex h-8 items-center gap-1.5 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2.5 text-[0.8rem] font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!exportReady || isExportingPdf}
              onClick={onOpenPdfSetup}
              type="button"
            >
              <FilePenLine className="h-3.5 w-3.5" />
              Edit Simple PDF
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
        </div>

        <div className="grid gap-2 md:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1.1fr)]">
          <label className="grid gap-1">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--ink-faint)]">Mode</span>
            <select
              aria-label="Study type"
              className="focus-ring touch-target h-10 min-w-0 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2 text-[0.95rem] text-[color:var(--ink)]"
              onChange={(event) => onStudyModeChange(event.target.value as StudyMode)}
              value={studyMode}
            >
              <option value="floor">Floor</option>
              <option value="wall">Wall</option>
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--ink-faint)]">Context</span>
            <select
              aria-label="Project context"
              className="focus-ring touch-target h-10 min-w-0 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2 text-[0.95rem] text-[color:var(--ink)]"
              onChange={(event) => onContextModeChange(event.target.value as AirborneContextMode)}
              value={airborneContextMode}
            >
              {AIRBORNE_CONTEXT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--ink-faint)]">Example Rows (Optional)</span>
            <select
              aria-label="Load sample rows"
              className="focus-ring touch-target h-10 min-w-0 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2 text-[0.95rem] text-[color:var(--ink)]"
              onChange={(event) => {
                const nextValue = event.target.value;

                if (nextValue === EMPTY_EXAMPLE_VALUE) {
                  onStartEmpty();
                  return;
                }

                onPresetChange(nextValue as PresetId);
              }}
              value={selectedExampleValue}
            >
              <option value={EMPTY_EXAMPLE_VALUE}>Start empty</option>
              {presetGroups.map((group) => (
                <optgroup key={group.id} label={group.label}>
                  {group.options.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>

          <div className="grid min-w-0 gap-1">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--ink-faint)]">Server Project</span>
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_auto_auto] gap-1.5">
              <select
                aria-label="Server project"
                className="focus-ring touch-target h-10 min-w-0 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2 text-[0.95rem] text-[color:var(--ink)]"
                disabled={isServerProjectBusy}
                onChange={(event) => onSelectedServerProjectChange(event.target.value)}
                value={selectedServerProjectId}
              >
                <option value="">Browser-local</option>
                {serverProjectOptions.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.label}
                  </option>
                ))}
              </select>
              <button
                aria-label="Refresh server projects"
                className="focus-ring touch-target inline-flex h-10 w-10 items-center justify-center rounded border border-[color:var(--line)] bg-[color:var(--paper)] text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isServerProjectBusy}
                onClick={onRefreshServerProjects}
                title="Refresh server projects"
                type="button"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
              </button>
              <button
                aria-label="Load server project"
                className="focus-ring touch-target inline-flex h-10 w-10 items-center justify-center rounded border border-[color:var(--line)] bg-[color:var(--paper)] text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isServerProjectBusy || selectedServerProjectId.length === 0}
                onClick={onLoadServerProject}
                title="Load server project"
                type="button"
              >
                <FolderOpen className="h-3.5 w-3.5" />
              </button>
              <button
                aria-label="Sync current project to server"
                className="focus-ring touch-target inline-flex h-10 w-10 items-center justify-center rounded border border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isServerProjectBusy || rowCount === 0}
                onClick={onSyncServerProject}
                title="Sync current project to server"
                type="button"
              >
                <CloudUpload className="h-3.5 w-3.5" />
              </button>
            </div>
            <span className="min-h-4 truncate text-[0.72rem] text-[color:var(--ink-faint)]">{serverProjectStatusLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
