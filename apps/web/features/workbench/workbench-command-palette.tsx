"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import { CommandIcon, Download, FileText, Layers3, RotateCcw, Search, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CRITERIA_PACKS, type CriteriaPackId } from "./criteria-packs";
import { WORKBENCH_PRESETS } from "./preset-definitions";
import type { EvaluatedScenario } from "./scenario-analysis";
import {
  getScenarioCorridorSummary,
  getScenarioDecisionSummary,
  getValidationPostureTone
} from "./scenario-corridor-summary";
import { REQUESTED_OUTPUT_LABELS } from "./workbench-data";

type WorkbenchCommandPaletteProps = {
  activeCriteriaPackId: CriteriaPackId;
  currentPresetId: string;
  open: boolean;
  currentScenario: EvaluatedScenario;
  requestedOutputs: readonly (keyof typeof REQUESTED_OUTPUT_LABELS)[];
  savedScenarios: readonly EvaluatedScenario[];
  onApplyCriteriaPack: (criteriaPackId: CriteriaPackId) => void;
  onCopyReport: () => void | Promise<void>;
  onDownloadReport: () => void;
  onLoadPreset: (presetId: (typeof WORKBENCH_PRESETS)[number]["id"]) => void;
  onLoadScenario: (scenarioId: string) => void;
  onOpenChange: (open: boolean) => void;
  onReset: () => void;
  onSaveScenario: () => void;
  onToggleRequestedOutput: (output: keyof typeof REQUESTED_OUTPUT_LABELS) => void;
  projectName: string;
  targetLnwDb: string;
  targetRwDb: string;
};

function Shortcut({ children }: { children: string }) {
  return (
    <span className="rounded-full border hairline px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
      {children}
    </span>
  );
}

function PaletteTag({
  children,
  tone
}: {
  children: string;
  tone: "accent" | "neutral" | "success" | "warning";
}) {
  const toneClass =
    tone === "success"
      ? "bg-[color:var(--success-soft)] text-[color:var(--success-ink)]"
      : tone === "warning"
        ? "bg-[color:var(--warning-soft)] text-[color:var(--warning-ink)]"
        : tone === "accent"
          ? "bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]"
          : "bg-black/[0.04] text-[color:var(--ink-soft)]";

  return (
    <span
      className={`rounded-full px-2 py-1 text-[0.63rem] font-semibold uppercase tracking-[0.16em] ${toneClass}`}
    >
      {children}
    </span>
  );
}

function compactKeywords(values: Array<string | undefined>): string[] {
  return values.filter((value): value is string => Boolean(value && value.trim().length > 0));
}

export function WorkbenchCommandPalette({
  activeCriteriaPackId,
  currentScenario,
  currentPresetId,
  onApplyCriteriaPack,
  onCopyReport,
  onDownloadReport,
  onLoadPreset,
  onLoadScenario,
  onOpenChange,
  onReset,
  onSaveScenario,
  onToggleRequestedOutput,
  open,
  projectName,
  requestedOutputs,
  savedScenarios,
  targetLnwDb,
  targetRwDb
}: WorkbenchCommandPaletteProps) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  function closePalette() {
    onOpenChange(false);
  }

  function runAndClose(callback: () => void | Promise<void>) {
    void callback();
    closePalette();
  }

  return (
    <Command.Dialog label="Workbench command palette" loop onOpenChange={onOpenChange} open={open}>
      <Dialog.Title className="sr-only">Workbench command palette</Dialog.Title>
      <Dialog.Description className="sr-only">
        Search presets, outputs, saved scenarios, and reporting actions for the active acoustic study.
      </Dialog.Description>
      <div className="command-shell">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b hairline px-5 py-4">
          <div>
            <div className="eyebrow">Command center</div>
            <div className="mt-1 font-display text-[1.45rem] leading-none tracking-[-0.04em] text-[color:var(--ink)]">
              {projectName}
            </div>
          </div>
          <Shortcut>Ctrl K</Shortcut>
        </div>

        <div className="flex items-center gap-3 border-b hairline px-5 py-3">
          <Search className="h-4 w-4 text-[color:var(--ink-faint)]" />
          <Command.Input
            className="w-full bg-transparent text-sm text-[color:var(--ink)] outline-none placeholder:text-[color:var(--ink-faint)]"
            onValueChange={setSearch}
            placeholder="Search commands, presets, outputs, and saved scenarios..."
            value={search}
          />
        </div>

        <Command.List className="max-h-[24rem] overflow-y-auto px-3 py-3">
          <Command.Empty className="px-3 py-8 text-center text-sm text-[color:var(--ink-soft)]">
            No matching workbench command.
          </Command.Empty>

          <Command.Group heading="Workspace">
            <Command.Item keywords={["snapshot", "save", "compare"]} onSelect={() => runAndClose(onSaveScenario)} value="save current scenario">
              <Sparkles className="h-4 w-4" />
              <span>Save current scenario</span>
            </Command.Item>
            <Command.Item keywords={["reset", "clear", "workspace"]} onSelect={() => runAndClose(onReset)} value="reset workspace">
              <RotateCcw className="h-4 w-4" />
              <span>Reset workspace</span>
            </Command.Item>
            <Command.Item
              keywords={["copy", "markdown", "report"]} onSelect={() => runAndClose(onCopyReport)}
              value="copy markdown report"
            >
              <FileText className="h-4 w-4" />
              <span>Copy markdown report</span>
            </Command.Item>
            <Command.Item
              keywords={["download", "brief", "report"]} onSelect={() => runAndClose(onDownloadReport)}
              value="download markdown report"
            >
              <Download className="h-4 w-4" />
              <span>Download markdown report</span>
            </Command.Item>
            <Command.Item
              keywords={["overview", "home", "landing"]} onSelect={() => runAndClose(() => router.push("/"))}
              value="go to overview"
            >
              <CommandIcon className="h-4 w-4" />
              <span>Back to overview</span>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Presets">
            {WORKBENCH_PRESETS.map((preset) => (
              <Command.Item
                key={preset.id}
                keywords={[preset.note, preset.studyMode]}
                onSelect={() => runAndClose(() => onLoadPreset(preset.id))}
                value={preset.label}
              >
                <Layers3 className="h-4 w-4" />
                <div className="flex flex-1 items-center justify-between gap-3">
                  <span>{preset.label}</span>
                  {preset.id === currentPresetId ? <Shortcut>Live</Shortcut> : null}
                </div>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Brief templates">
            {CRITERIA_PACKS.map((criteriaPack) => (
              <Command.Item
                key={criteriaPack.id}
                keywords={[criteriaPack.audience, ...criteriaPack.emphasis]}
                onSelect={() => runAndClose(() => onApplyCriteriaPack(criteriaPack.id))}
                value={criteriaPack.label}
              >
                <Sparkles className="h-4 w-4" />
                <div className="flex flex-1 items-center justify-between gap-3">
                  <span>{criteriaPack.label}</span>
                  {criteriaPack.id === activeCriteriaPackId ? <Shortcut>Active</Shortcut> : null}
                </div>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Requested outputs">
            {Object.entries(REQUESTED_OUTPUT_LABELS).map(([value, label]) => {
              const isActive = requestedOutputs.includes(value as keyof typeof REQUESTED_OUTPUT_LABELS);

              return (
                <Command.Item
                  key={value}
                  keywords={["target", "output", isActive ? "active" : "inactive"]}
                  onSelect={() => runAndClose(() => onToggleRequestedOutput(value as keyof typeof REQUESTED_OUTPUT_LABELS))}
                  value={`toggle ${label}`}
                >
                  <Layers3 className="h-4 w-4" />
                  <div className="flex flex-1 items-center justify-between gap-3">
                    <span>{isActive ? `Disable ${label}` : `Enable ${label}`}</span>
                    <Shortcut>{isActive ? "On" : "Off"}</Shortcut>
                  </div>
                </Command.Item>
              );
            })}
          </Command.Group>

          {savedScenarios.length > 0 ? (
            <Command.Group heading="Saved scenarios">
              {savedScenarios.map((scenario) => {
                const summary = getScenarioCorridorSummary(scenario.result);
                const decision = getScenarioDecisionSummary({
                  baselineResult: currentScenario.result,
                  candidateResult: scenario.result,
                  targetLnwDb,
                  targetRwDb
                });
                const subline = [summary.impactHeadline, summary.activeModeLabel ?? summary.impactLabel, summary.activeFamilyLabel]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <Command.Item
                    key={scenario.id}
                    keywords={compactKeywords([
                      scenario.studyMode,
                      "saved",
                      "scenario",
                      summary.impactLabel,
                      summary.airborneLabel,
                      summary.activeFamilyLabel,
                      summary.activeModeLabel,
                      summary.fieldContinuationLabel,
                      summary.impactHeadline,
                      decision.liveStatusLabel,
                      decision.briefStatusLabel,
                      decision.liveDeltaLabel,
                      decision.briefDeltaLabel
                    ])}
                    onSelect={() => runAndClose(() => onLoadScenario(scenario.id))}
                    value={`${scenario.name} ${subline}`}
                  >
                    <RotateCcw className="mt-0.5 h-4 w-4 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-[color:var(--ink)]">{scenario.name}</div>
                          <p className="mt-1 truncate text-xs leading-6 text-[color:var(--ink-soft)]">{subline}</p>
                        </div>
                        <PaletteTag tone={getValidationPostureTone(summary.impactPosture.posture)}>
                          {summary.impactLabel}
                        </PaletteTag>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <PaletteTag tone={getValidationPostureTone(summary.airbornePosture.posture)}>
                          {summary.airborneLabel}
                        </PaletteTag>
                        <PaletteTag tone={decision.liveStatusTone}>{decision.liveStatusLabel}</PaletteTag>
                        <PaletteTag tone={decision.briefStatusTone}>{decision.briefStatusLabel}</PaletteTag>
                        {summary.fieldContinuationLabel ? (
                          <PaletteTag tone="accent">{summary.fieldContinuationLabel}</PaletteTag>
                        ) : null}
                      </div>
                      <p className="mt-2 text-[0.72rem] leading-6 text-[color:var(--ink-soft)]">{decision.liveDeltaLabel}</p>
                      {decision.briefDeltaLabel ? (
                        <p className="text-[0.72rem] leading-6 text-[color:var(--ink-faint)]">{decision.briefDeltaLabel}</p>
                      ) : null}
                    </div>
                  </Command.Item>
                );
              })}
            </Command.Group>
          ) : null}
        </Command.List>
      </div>
    </Command.Dialog>
  );
}
