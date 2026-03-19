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

  it("prefers exact Dutch LnT,A as the impact headline when the narrow field-octave lane is active", () => {
    const summary = getScenarioCorridorSummary({
      impact: {
        availableOutputs: ["LnT,A", "L'nT,w"],
        basis: "exact_source_band_curve_iso7172",
        confidence: {
          level: "high",
          provenance: "exact_band_curve",
          score: 1,
          summary: "Exact field octave lane."
        },
        LnTA: 53.8,
        LPrimeNTw: 66,
        notes: ["Exact field octave lane."],
        scope: "exact_band_curve"
      }
    } as AssemblyCalculation);

    expect(summary.impactHeadline).toBe("LnT,A 53.8 dB");
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

  it("uses Dutch LnT,A as the live comparison basis when both scenarios carry the exact lane", () => {
    const baseline = {
      impact: { LnTA: 54.4 },
      metrics: { estimatedRwDb: 56 }
    } as AssemblyCalculation;
    const candidate = {
      impact: { LnTA: 53.8 },
      metrics: { estimatedRwDb: 57 }
    } as AssemblyCalculation;

    const decision = getScenarioDecisionSummary({
      baselineResult: baseline,
      candidateResult: candidate,
      targetLnwDb: "",
      targetRwDb: ""
    });

    expect(decision.liveDeltaLabel).toContain("LnT,A +0.6 dB");
    expect(decision.liveStatusLabel).toBe("Ahead of live");
  });

  it("keeps Dutch LnT,A out of the existing brief Ln,w target lane", () => {
    const candidate = {
      impact: { LnTA: 53.8, LPrimeNTw: 66 },
      metrics: { estimatedRwDb: 57 }
    } as AssemblyCalculation;

    const decision = getScenarioDecisionSummary({
      baselineResult: null,
      candidateResult: candidate,
      targetLnwDb: "67",
      targetRwDb: ""
    });

    expect(decision.briefDeltaLabel).toContain("L'nT,w +1 dB");
  });

  it("adds Dutch DnT,A,k reference signals when an exact field proxy anchor exists", () => {
    const candidate = {
      metrics: { estimatedRwDb: 54 },
      ratings: {
        field: {
          DnTAk: 53,
          basis: "screening_mass_law_curve_seed_v3+exact_verified_field_proxy_anchor"
        }
      }
    } as AssemblyCalculation;

    const decision = getScenarioDecisionSummary({
      baselineResult: null,
      candidateResult: candidate,
      targetLnwDb: "",
      targetRwDb: ""
    });

    expect(decision.dutchReferenceStatusLabel).toBe("BBL pass");
    expect(decision.dutchReferenceStatusTone).toBe("success");
    expect(decision.dutchReferenceDeltaLabel).toBe("BBL +1.0 dB · Comfort -4.0 dB");
  });

  it("keeps Dutch DnT,A,k companions on an indicative compare lane", () => {
    const candidate = {
      metrics: { estimatedRwDb: 54 },
      ratings: {
        field: {
          DnTAk: 58,
          basis: "screening_mass_law_curve_seed_v3+official_approximate_field_companion"
        }
      }
    } as AssemblyCalculation;

    const decision = getScenarioDecisionSummary({
      baselineResult: null,
      candidateResult: candidate,
      targetLnwDb: "",
      targetRwDb: ""
    });

    expect(decision.dutchReferenceStatusLabel).toBe("Indicative");
    expect(decision.dutchReferenceStatusTone).toBe("accent");
    expect(decision.dutchReferenceDeltaLabel).toBe("BBL indicative +6.0 dB · Comfort indicative +1.0 dB");
  });
});
