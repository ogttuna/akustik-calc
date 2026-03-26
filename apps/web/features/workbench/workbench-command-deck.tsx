"use client";

import { BellRing, BookmarkPlus, BriefcaseBusiness, Command, Files, Layers2 } from "lucide-react";

import { Pill, SurfacePanel } from "@dynecho/ui";

import type { EvaluatedScenario } from "./scenario-analysis";
import {
  getScenarioCorridorSummary,
  getScenarioDecisionSummary,
  getValidationPostureTone
} from "./scenario-corridor-summary";
import { REQUESTED_OUTPUT_LABELS } from "./workbench-data";
import type { StudyMode } from "./preset-definitions";

type WorkbenchCommandDeckProps = {
  currentScenario: EvaluatedScenario;
  onOpenCommands: () => void;
  projectName: string;
  requestedOutputs: readonly (keyof typeof REQUESTED_OUTPUT_LABELS)[];
  savedScenarios: readonly EvaluatedScenario[];
  studyMode: StudyMode;
  onSaveScenario: () => void;
  targetLnwDb: string;
  targetRwDb: string;
};

export function WorkbenchCommandDeck({
  currentScenario,
  onOpenCommands,
  onSaveScenario,
  projectName,
  requestedOutputs,
  savedScenarios,
  studyMode,
  targetLnwDb,
  targetRwDb
}: WorkbenchCommandDeckProps) {
  const featuredScenarios = savedScenarios.slice(0, 2);

  return (
    <SurfacePanel className="stage-enter-2 panel-mesh overflow-hidden px-6 py-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Pill tone="accent">Operator desk</Pill>
            <Pill tone="neutral">{studyMode === "wall" ? "Wall track" : "Floor track"}</Pill>
            <Pill tone="warning">Controlled parity import</Pill>
          </div>
          <div className="max-w-3xl">
            <div className="eyebrow">Workspace brief</div>
            <h2 className="mt-2 font-display text-[clamp(2rem,3vw,3.1rem)] leading-[0.92] tracking-[-0.05em] text-balance">
              {projectName}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">
              A serious acoustic tool needs more than a single estimate. This desk now keeps brief, targets,
              scenarios, capability gaps, and reporting readiness in one place.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <article className="pointer-card rounded-lg border hairline bg-[color:var(--panel-strong)] px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <Layers2 className="h-4 w-4" />
              Requested outputs
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {requestedOutputs.map((output) => (
                <Pill key={output} tone="neutral">
                  {REQUESTED_OUTPUT_LABELS[output]}
                </Pill>
              ))}
            </div>
          </article>
          <article className="pointer-card rounded-lg border hairline bg-[color:var(--panel)] px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <Command className="h-4 w-4" />
              Command center
            </div>
            <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
              Keyboard-first operators can jump between presets, outputs, corridor-aware saved scenarios, and report
              actions instantly.
            </p>
            <button
              className="focus-ring touch-target mt-4 inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
              onClick={onOpenCommands}
              type="button"
            >
              <BriefcaseBusiness className="h-4 w-4" />
              Open command palette
            </button>
          </article>
          <article className="rounded-lg border hairline bg-[color:var(--accent-soft)] px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--accent-ink)]">
              <BellRing className="h-4 w-4" />
              Snapshot current scheme
            </div>
            <p className="mt-3 text-sm leading-7 text-[color:var(--accent-ink)]/85">
              Save the current assembly as a comparison candidate before you pivot the stack.
            </p>
            <button
              className="focus-ring ink-button-solid touch-target mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
              onClick={onSaveScenario}
              type="button"
            >
              <BookmarkPlus className="h-4 w-4" />
              Save scenario
            </button>
          </article>
          <article className="pointer-card rounded-lg border hairline bg-[color:var(--panel)] px-4 py-4 sm:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
                  <Files className="h-4 w-4" />
                  Saved corridors
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">
                  Load decisions should happen with evidence class in view, not from memory. The latest saved studies
                  stay visible here with their active impact lane, family corridor, and field carry-over state.
                </p>
              </div>
              <div className="metric-number font-display text-4xl tracking-[-0.05em]">{savedScenarios.length}</div>
            </div>

            {featuredScenarios.length > 0 ? (
              <>
                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  {featuredScenarios.map((scenario) => {
                    const summary = getScenarioCorridorSummary(scenario.result);
                    const decision = getScenarioDecisionSummary({
                      baselineResult: currentScenario.result,
                      candidateResult: scenario.result,
                      targetLnwDb,
                      targetRwDb
                    });

                    return (
                      <div className="rounded-md border hairline bg-[color:var(--paper)] px-3 py-3" key={scenario.id}>
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <div className="text-sm font-semibold text-[color:var(--ink)]">{scenario.name}</div>
                            <p className="mt-1 text-xs leading-6 text-[color:var(--ink-soft)]">{summary.impactHeadline}</p>
                          </div>
                          <Pill tone={getValidationPostureTone(summary.impactPosture.posture)}>{summary.impactLabel}</Pill>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {summary.activeFamilyLabel ? <Pill tone="neutral">{summary.activeFamilyLabel}</Pill> : null}
                          {summary.activeModeLabel ? <Pill tone="neutral">{summary.activeModeLabel}</Pill> : null}
                          <Pill tone={getValidationPostureTone(summary.airbornePosture.posture)}>{summary.airborneLabel}</Pill>
                          {summary.fieldContinuationLabel ? <Pill tone="accent">{summary.fieldContinuationLabel}</Pill> : null}
                        </div>
                        <div className="mt-3 rounded border hairline bg-[color:var(--panel)] px-3 py-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                              Decision snapshot
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Pill tone={decision.liveStatusTone}>{decision.liveStatusLabel}</Pill>
                              <Pill tone={decision.briefStatusTone}>{decision.briefStatusLabel}</Pill>
                            </div>
                          </div>
                          <p className="mt-2 text-xs leading-6 text-[color:var(--ink-soft)]">{decision.liveDeltaLabel}</p>
                          {decision.briefDeltaLabel ? (
                            <p className="text-xs leading-6 text-[color:var(--ink-faint)]">{decision.briefDeltaLabel}</p>
                          ) : (
                            <p className="text-xs leading-6 text-[color:var(--ink-faint)]">No brief target armed yet.</p>
                          )}
                        </div>
                        <p className="mt-3 text-xs leading-6 text-[color:var(--ink-soft)]">{summary.narrative}</p>
                      </div>
                    );
                  })}
                </div>
                {savedScenarios.length > featuredScenarios.length ? (
                  <p className="mt-3 text-xs leading-6 uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                    +{savedScenarios.length - featuredScenarios.length} more saved study
                    {savedScenarios.length - featuredScenarios.length === 1 ? "" : "ies"} remain in Scenario compare
                    and the command palette.
                  </p>
                ) : null}
              </>
            ) : (
              <p className="mt-4 text-sm leading-7 text-[color:var(--ink-soft)]">
                Save the live stack once it lands on a useful corridor so the operator desk can keep that evidence class
                visible during the next edit pass.
              </p>
            )}
          </article>
        </div>
      </div>
    </SurfacePanel>
  );
}
