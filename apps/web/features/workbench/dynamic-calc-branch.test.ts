import { describe, expect, it } from "vitest";

import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import { getPresetById, type PresetId } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";

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

describe("getDynamicCalcBranchSummary", () => {
  it("surfaces the published family topology for the guided heavy floor sample", () => {
    const scenario = evaluatePreset("heavy_concrete_impact_floor");

    const summary = getDynamicCalcBranchSummary({
      result: scenario.result,
      studyMode: "floor"
    });

    expect(summary.value).toBe("Heavy floating floor");
    expect(summary.tone).toBe("neutral");
    expect(summary.detail).toContain("Published family estimate is active through Published family blend · reinforced concrete.");
    expect(summary.detail).toContain("Published heavy-concrete upper-treatment estimate");
  });

  it("surfaces exact floor-family mode when a curated exact preset lands", () => {
    const scenario = evaluatePreset("dataholz_clt_dry_exact");

    const summary = getDynamicCalcBranchSummary({
      result: scenario.result,
      studyMode: "floor"
    });

    expect(summary.value).toBe("Exact floor family");
    expect(summary.tone).toBe("ready");
    expect(summary.detail).toContain("Dataholz GDMTXN01 | CLT floor | dry screed | no lining");
    expect(summary.detail).toContain("Dry floating floor topology");
  });

  it("keeps the steel suspended sample on the narrower published family lane", () => {
    const scenario = evaluatePreset("steel_suspended_fallback");

    const summary = getDynamicCalcBranchSummary({
      result: scenario.result,
      studyMode: "floor"
    });

    expect(summary.value).toBe("Suspended ceiling only");
    expect(summary.tone).toBe("neutral");
    expect(summary.detail).toContain("Published family estimate is active through Published family blend · lightweight steel.");
    expect(summary.detail).toContain("Published family blend estimate");
  });

  it("surfaces impact-only low-confidence timber bare-floor fallback without claiming a floor-family airborne companion", () => {
    const scenario = evaluatePreset("timber_bare_impact_only_fallback");

    const summary = getDynamicCalcBranchSummary({
      result: scenario.result,
      studyMode: "floor"
    });

    expect(summary.value).toBe("Bare floor");
    expect(summary.tone).toBe("warning");
    expect(summary.detail).toContain("Low-confidence fallback · timber frame / joist is active.");
    expect(summary.detail).toContain("impact-only");
    expect(summary.detail).toContain("separate airborne screening lane");
  });

  it("keeps wall screening explicit when no dynamic airborne family has locked yet", () => {
    const scenario = evaluatePreset("concrete_wall");

    const summary = getDynamicCalcBranchSummary({
      result: scenario.result,
      studyMode: "wall"
    });

    expect(summary.value).toBe("Screening seed");
    expect(summary.tone).toBe("warning");
    expect(summary.detail).toContain("seed cavity-screening path");
  });
});
