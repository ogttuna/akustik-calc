import { describe, expect, it } from "vitest";

import { getPresetById, type PresetId } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { getGuidedValidationSummary } from "./guided-validation-summary";

function evaluatePreset(presetId: PresetId) {
  const preset = getPresetById(presetId);
  const targetOutputs =
    preset.studyMode === "floor"
      ? (["Rw", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w"] as const)
      : (["Rw", "R'w", "DnT,w", "Dn,w", "STC", "C", "Ctr"] as const);

  return evaluateScenario({
    id: preset.id,
    name: preset.label,
    rows: preset.rows.map((row, index) => ({ ...row, id: `${preset.id}-${index + 1}` })),
    source: "current",
    studyMode: preset.studyMode,
    targetOutputs
  });
}

describe("getGuidedValidationSummary", () => {
  it("keeps published family floors explicit as scoped estimates", () => {
    const scenario = evaluatePreset("heavy_concrete_impact_floor");

    const summary = getGuidedValidationSummary({
      result: scenario.result,
      studyMode: "floor"
    });

    expect(summary.value).toBe("Scoped estimate");
    expect(summary.tone).toBe("neutral");
    expect(summary.detail).toContain("Published family estimate is active.");
    expect(summary.detail).toContain("supported floor estimate");
  });

  it("marks curated exact floor families as exact evidence", () => {
    const scenario = evaluatePreset("dataholz_clt_dry_exact");

    const summary = getGuidedValidationSummary({
      result: scenario.result,
      studyMode: "floor"
    });

    expect(summary.value).toBe("Exact evidence");
    expect(summary.tone).toBe("ready");
    expect(summary.detail).toContain("Exact floor-system family is active.");
    expect(summary.detail).toContain("exact or official source evidence");
  });

  it("keeps wall screening lanes explicit as scoped estimates", () => {
    const scenario = evaluatePreset("concrete_wall");

    const summary = getGuidedValidationSummary({
      result: scenario.result,
      studyMode: "wall"
    });

    expect(summary.value).toBe("Scoped estimate");
    expect(summary.tone).toBe("neutral");
    expect(summary.detail).toContain("Screening seed is active.");
    expect(summary.detail).toContain("supported wall estimate");
  });

  it("keeps the steel suspended sample on a low-confidence fallback posture", () => {
    const scenario = evaluatePreset("steel_suspended_fallback");

    const summary = getGuidedValidationSummary({
      result: scenario.result,
      studyMode: "floor"
    });

    expect(summary.value).toBe("Low-confidence fallback");
    expect(summary.tone).toBe("warning");
    expect(summary.detail).toContain("final published-family fallback");
    expect(summary.detail).toContain("last-resort estimate");
  });

  it("calls out missing support-form detail on conservative steel crossover bounds", () => {
    const scenario = evaluatePreset("ubiq_steel_300_unspecified_bound");

    const summary = getGuidedValidationSummary({
      result: scenario.result,
      studyMode: "floor"
    });

    expect(summary.value).toBe("Conservative bound");
    expect(summary.tone).toBe("warning");
    expect(summary.detail).toContain("support form is still open");
    expect(summary.detail).toContain("steel joist / purlin");
  });

  it("calls out timber bare-floor low-confidence lanes as broad fallbacks that still need a ceiling package", () => {
    const scenario = evaluatePreset("timber_bare_impact_only_fallback");

    const summary = getGuidedValidationSummary({
      result: scenario.result,
      studyMode: "floor"
    });

    expect(summary.value).toBe("Low-confidence fallback");
    expect(summary.tone).toBe("warning");
    expect(summary.detail).toContain("same low-confidence lane");
    expect(summary.detail).toContain("ceiling package");
    expect(summary.detail).toContain("narrower Knauf corridor");
  });

  it("waits for a supported lane when no result exists yet", () => {
    const summary = getGuidedValidationSummary({
      result: null,
      studyMode: "floor"
    });

    expect(summary.value).toBe("Waiting for supported lane");
    expect(summary.tone).toBe("neutral");
    expect(summary.detail).toContain("Build a supported floor topology");
  });
});
