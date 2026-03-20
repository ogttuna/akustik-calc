import { describe, expect, it } from "vitest";

import { getPresetById, type PresetId } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { getTargetOutputStatus } from "./target-output-status";

function evaluatePreset(presetId: PresetId) {
  const preset = getPresetById(presetId);
  const targetOutputs =
    preset.studyMode === "floor"
      ? (["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"] as const)
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

describe("getTargetOutputStatus", () => {
  it("keeps lightweight-steel crossover bounds explicit on both impact and airborne companion cards", () => {
    const scenario = evaluatePreset("ubiq_steel_300_unspecified_bound");

    const lnwStatus = getTargetOutputStatus({
      guideResult: null,
      output: "Ln,w",
      result: scenario.result
    });
    const rwStatus = getTargetOutputStatus({
      guideResult: null,
      output: "Rw",
      result: scenario.result
    });

    expect(lnwStatus.kind).toBe("engine_bound");
    expect(lnwStatus.label).toBe("Crossover bound");
    expect(lnwStatus.note).toContain("carrier is open");
    expect(rwStatus.kind).toBe("engine_live");
    expect(rwStatus.note).toContain("carrier stays unspecified");
  });

  it("keeps converged lightweight-steel bound interpolation off the crossover label", () => {
    const scenario = evaluatePreset("ubiq_steel_200_unspecified_bound");

    const lnwStatus = getTargetOutputStatus({
      guideResult: null,
      output: "Ln,w",
      result: scenario.result
    });
    const rwStatus = getTargetOutputStatus({
      guideResult: null,
      output: "Rw",
      result: scenario.result
    });

    expect(lnwStatus.kind).toBe("engine_bound");
    expect(lnwStatus.label).toBe("Bound support");
    expect(lnwStatus.note).not.toContain("carrier is open");
    expect(rwStatus.kind).toBe("engine_live");
    expect(rwStatus.note).not.toContain("carrier stays unspecified");
  });

  it("keeps timber bare-floor low-confidence airborne outputs explicit as separate screening companions", () => {
    const scenario = evaluatePreset("timber_bare_impact_only_fallback");

    const rwStatus = getTargetOutputStatus({
      guideResult: null,
      output: "Rw",
      result: scenario.result
    });
    const ctrStatus = getTargetOutputStatus({
      guideResult: null,
      output: "Ctr",
      result: scenario.result
    });
    const ciStatus = getTargetOutputStatus({
      guideResult: null,
      output: "CI",
      result: scenario.result
    });

    expect(rwStatus.kind).toBe("engine_live");
    expect(rwStatus.note).toContain("separate screening lane");
    expect(ctrStatus.kind).toBe("engine_live");
    expect(ctrStatus.note).toContain("impact-only");
    expect(ciStatus.kind).toBe("unavailable");
    expect(ciStatus.label).toBe("Impact-only fallback");
    expect(ciStatus.note).toContain("low-frequency companion terms are not defended");
  });
});
