import { describe, expect, it } from "vitest";

import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import { getPresetById } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { buildSimpleWorkbenchMethodDossier } from "./simple-workbench-method-dossier";
import { getGuidedValidationSummary } from "./guided-validation-summary";

describe("simple workbench method dossier", () => {
  it("packages live lane notes, stack reading, and output posture from the active dynamic result", () => {
    const preset = getPresetById("heavy_concrete_impact_floor");
    const scenario = evaluateScenario({
      id: preset.id,
      name: preset.label,
      rows: preset.rows.map((row, index) => ({ ...row, id: `${preset.id}-${index + 1}` })),
      source: "current",
      studyMode: preset.studyMode,
      targetOutputs: ["Rw", "Ln,w", "DnT,w", "L'n,w"]
    });
    const branchSummary = getDynamicCalcBranchSummary({
      result: scenario.result,
      studyMode: preset.studyMode
    });
    const validationSummary = getGuidedValidationSummary({
      result: scenario.result,
      studyMode: preset.studyMode
    });

    expect(scenario.result).not.toBeNull();

    const dossier = buildSimpleWorkbenchMethodDossier({
      branchDetail: branchSummary.detail,
      branchLabel: branchSummary.value,
      contextLabel: "Building prediction",
      coverageItems: [
        {
          detail: "Weighted airborne element rating from the active airborne lane.",
          label: "Rw",
          status: "live",
          value: "61 dB"
        },
        {
          detail: "Weighted impact metric from the active impact lane.",
          label: "Ln,w",
          status: "live",
          value: "49 dB"
        },
        {
          detail: "Standardized airborne output still needs receiving-room volume.",
          label: "DnT,w",
          nextStep: "Enter airborne room volume",
          status: "needs_input",
          value: "Not ready"
        },
        {
          detail: "The current lane cannot defend this companion on the active topology.",
          label: "LnT,A",
          status: "unsupported",
          value: "Not ready"
        }
      ],
      layers: preset.rows.map((row, index) => ({
        categoryLabel: "Test layer",
        index: index + 1,
        label: row.materialId,
        roleLabel: row.floorRole,
        thicknessLabel: `${row.thicknessMm} mm`
      })),
      result: scenario.result,
      stackDetail: "4 live rows feed 4 solver layers directly on the active route.",
      studyModeLabel: "Floor",
      validationDetail: validationSummary.detail,
      validationLabel: validationSummary.value,
      warnings: scenario.warnings
    });

    expect(dossier.headline).toContain("Floor calculation is currently reading the stack through");
    expect(dossier.headline).toContain("2 outputs are already defensible");
    expect(dossier.headline).toContain("1 output remains parked");
    expect(dossier.cards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Route choice", value: branchSummary.value }),
        expect.objectContaining({ label: "Output posture", value: "2 ready / 1 parked" }),
        expect.objectContaining({ label: "Reading confidence", value: validationSummary.value }),
        expect.objectContaining({ label: "Stack reading" })
      ])
    );
    expect(dossier.traceGroups.some((group) => group.label === "Airborne lane")).toBe(true);
    expect(dossier.traceGroups.some((group) => group.label === "Impact lane")).toBe(true);
    expect(dossier.traceGroups.every((group) => group.notes.length > 0)).toBe(true);
    expect(dossier.traceGroups.every((group) => group.notes.length <= 4)).toBe(true);
    expect(dossier.traceGroups.find((group) => group.label === "Impact lane")?.notes).toContain(
      "Published family estimate is active on the current impact lane."
    );
    expect(dossier.readyCoverageCount).toBe(2);
    expect(dossier.parkedCoverageCount).toBe(1);
    expect(dossier.unsupportedCoverageCount).toBe(1);
  });
});
