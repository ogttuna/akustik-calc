import { describe, expect, it } from "vitest";

import { getPresetById, type PresetId } from "./preset-definitions";
import { IMPACT_ONLY_LOW_CONFIDENCE_TOPOLOGY_GAP_VALUE } from "./impact-only-low-confidence-floor-lane";
import { evaluateScenario } from "./scenario-analysis";
import { getGuidedTopologyGap } from "./guided-topology-gap";
import { STEEL_BOUND_SUPPORT_FORM_GAP_VALUE } from "./steel-bound-support-form-lane";

function evaluatePreset(presetId: PresetId) {
  const preset = getPresetById(presetId);

  return {
    preset,
    scenario: evaluateScenario({
      id: preset.id,
      name: preset.label,
      rows: preset.rows.map((row, index) => ({ ...row, id: `${preset.id}-${index + 1}` })),
      source: "current",
      studyMode: preset.studyMode,
      targetOutputs: preset.studyMode === "floor" ? ["Rw", "Ln,w", "Ln,w+CI"] : ["Rw", "R'w", "DnT,w"]
    })
  };
}

describe("getGuidedTopologyGap", () => {
  it("explains which missing treatment details keep a timber bare-floor fallback on the low-confidence lane", () => {
    const { preset, scenario } = evaluatePreset("timber_bare_impact_only_fallback");

    const gap = getGuidedTopologyGap({
      result: scenario.result,
      rows: preset.rows.map((row, index) => ({ ...row, id: `${preset.id}-${index + 1}` })),
      studyMode: "floor"
    });

    expect(gap?.value).toBe(IMPACT_ONLY_LOW_CONFIDENCE_TOPOLOGY_GAP_VALUE);
    expect(gap?.detail).toContain("joist deck and floor finish");
    expect(gap?.detail).toContain("Add the ceiling board row");
    expect(gap?.detail).toContain("direct to the joists or on furring channels");
  });

  it("stays quiet for exact floor families", () => {
    const { preset, scenario } = evaluatePreset("dataholz_clt_dry_exact");

    const gap = getGuidedTopologyGap({
      result: scenario.result,
      rows: preset.rows.map((row, index) => ({ ...row, id: `${preset.id}-${index + 1}` })),
      studyMode: "floor"
    });

    expect(gap).toBeNull();
  });

  it("explains when lightweight steel stays on the missing-support-form crossover bound", () => {
    const { preset, scenario } = evaluatePreset("ubiq_steel_300_unspecified_bound");

    const gap = getGuidedTopologyGap({
      result: scenario.result,
      rows: preset.rows.map((row, index) => ({ ...row, id: `${preset.id}-${index + 1}` })),
      studyMode: "floor"
    });

    expect(gap?.value).toBe(STEEL_BOUND_SUPPORT_FORM_GAP_VALUE);
    expect(gap?.detail).toContain("steel joist / purlin");
    expect(gap?.detail).toContain("open-web / rolled steel");
  });

  it("stays quiet on wall routes", () => {
    const { preset, scenario } = evaluatePreset("concrete_wall");

    const gap = getGuidedTopologyGap({
      result: scenario.result,
      rows: preset.rows.map((row, index) => ({ ...row, id: `${preset.id}-${index + 1}` })),
      studyMode: "wall"
    });

    expect(gap).toBeNull();
  });
});
