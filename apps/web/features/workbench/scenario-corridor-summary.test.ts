import { describe, expect, it } from "vitest";

import type { AssemblyCalculation } from "@dynecho/shared";

import { getPresetById } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import {
  getScenarioCorridorSummary,
  getScenarioDecisionSummary
} from "./scenario-corridor-summary";

function makeRows(presetId: Parameters<typeof getPresetById>[0]) {
  return getPresetById(presetId).rows.map((row, index) => ({
    floorRole: row.floorRole,
    id: `${presetId}-${index + 1}`,
    materialId: row.materialId,
    thicknessMm: row.thicknessMm
  }));
}

describe("getScenarioCorridorSummary", () => {
  it("keeps saved floor scenarios readable through one corridor narrative", () => {
    const preset = getPresetById("heavy_concrete_impact_floor");
    const scenario = evaluateScenario({
      id: "impact-floor",
      name: preset.label,
      rows: makeRows("heavy_concrete_impact_floor"),
      source: "saved",
      studyMode: preset.studyMode
    });

    const summary = getScenarioCorridorSummary(scenario.result);

    expect(summary.impactHeadline).toMatch(/Ln,w/i);
    expect(summary.narrative).toMatch(/Impact corridor is/i);
    expect(summary.airborneLabel.length).toBeGreaterThan(0);
    expect(summary.impactPosture.posture).not.toBe("inactive");
  });

  it("surfaces a tracked family corridor when curated floor evidence lands", () => {
    const preset = getPresetById("dataholz_timber_frame_exact");
    const scenario = evaluateScenario({
      id: "timber-family",
      name: preset.label,
      rows: makeRows("dataholz_timber_frame_exact"),
      source: "saved",
      studyMode: preset.studyMode
    });

    const summary = getScenarioCorridorSummary(scenario.result);

    expect(summary.activeFamilyLabel).toBeTruthy();
    expect(summary.impactLabel.length).toBeGreaterThan(0);
  });

  it("reports missing-result state without inventing a lane", () => {
    const summary = getScenarioCorridorSummary(null);

    expect(summary.impactHeadline).toBe("Impact headline unavailable");
    expect(summary.narrative).toBe("No live scenario result yet.");
    expect(summary.impactPosture.posture).toBe("inactive");
  });

  it("builds a decision snapshot with live and brief deltas", () => {
    const preset = getPresetById("heavy_concrete_impact_floor");
    const baseline = evaluateScenario({
      id: "baseline",
      name: preset.label,
      rows: makeRows("heavy_concrete_impact_floor"),
      source: "current",
      studyMode: preset.studyMode
    });

    const decision = getScenarioDecisionSummary({
      baselineResult: baseline.result,
      candidateResult: baseline.result,
      targetLnwDb: "53",
      targetRwDb: "52"
    });

    expect(decision.liveDeltaLabel).toMatch(/Vs live: Rw \+0/i);
    expect(decision.liveDeltaLabel).toMatch(/Ln,w \+0/i);
    expect(decision.briefDeltaLabel).toMatch(/Brief gap:/i);
    expect(decision.liveStatusLabel).toBe("At live parity");
    expect(decision.briefStatusLabel).toBe("Ahead of brief");
  });

  it("stays fail-closed when impact basis changes against the live stack", () => {
    const baseline = {
      impact: { LnW: 55 },
      metrics: { estimatedRwDb: 56 }
    } as AssemblyCalculation;
    const candidate = {
      lowerBoundImpact: { LnWUpperBound: 52 },
      metrics: { estimatedRwDb: 58 }
    } as AssemblyCalculation;

    const decision = getScenarioDecisionSummary({
      baselineResult: baseline,
      candidateResult: candidate,
      targetLnwDb: "54",
      targetRwDb: "57"
    });

    expect(decision.liveDeltaLabel).toContain("Impact basis changed");
    expect(decision.liveStatusLabel).toBe("Partial live read");
    expect(decision.briefStatusLabel).toBe("Ahead of brief");
  });

  it("keeps upper-bound wording when only conservative impact support exists", () => {
    const candidate = {
      lowerBoundImpact: { LnWUpperBound: 49 },
      metrics: { estimatedRwDb: 54 }
    } as AssemblyCalculation;

    const decision = getScenarioDecisionSummary({
      baselineResult: null,
      candidateResult: candidate,
      targetLnwDb: "52",
      targetRwDb: "51"
    });

    expect(decision.briefDeltaLabel).toContain("Ln,w upper bound +3");
    expect(decision.briefStatusLabel).toBe("Ahead of brief");
  });
});
