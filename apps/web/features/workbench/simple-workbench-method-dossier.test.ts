import { describe, expect, it } from "vitest";

import type { ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";

import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import { getPresetById } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { buildSimpleWorkbenchMethodDossier } from "./simple-workbench-method-dossier";
import { getGuidedValidationSummary } from "./guided-validation-summary";
import type { LayerDraft } from "./workbench-store";

const FORMULA_TARGET_OUTPUTS = ["Rw", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

const FORMULA_IMPACT_FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const HEAVY_FLOATING_FORMULA_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: "180" }
];

function buildRows(rows: readonly Omit<LayerDraft, "id">[], id: string): LayerDraft[] {
  return rows.map((row, index) => ({ ...row, id: `${id}-${index + 1}` }));
}

function buildHeavyFloatingFormulaScenario() {
  return evaluateScenario({
    id: "method-dossier-heavy-floating-formula",
    impactFieldContext: FORMULA_IMPACT_FIELD_CONTEXT,
    name: "Method dossier heavy floating formula",
    rows: buildRows(HEAVY_FLOATING_FORMULA_ROWS, "method-dossier-heavy-floating-formula"),
    source: "current",
    studyMode: "floor",
    targetOutputs: FORMULA_TARGET_OUTPUTS
  });
}

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
          postureDetail: "The active floor lane is a benchmark-backed estimate.",
          postureLabel: "Benchmark-backed estimate",
          postureTone: "accent",
          status: "live",
          value: "61 dB"
        },
        {
          detail: "Weighted impact metric from the active impact lane.",
          label: "Ln,w",
          postureDetail: "The active floor lane is a benchmark-backed estimate.",
          postureLabel: "Benchmark-backed estimate",
          postureTone: "accent",
          status: "live",
          value: "49 dB"
        },
        {
          detail: "Standardized airborne output still needs receiving-room volume.",
          label: "DnT,w",
          nextStep: "Enter airborne room volume",
          postureDetail: "The field route is recognized, but it still needs project-specific field inputs.",
          postureLabel: "Awaiting field input",
          postureTone: "warning",
          status: "needs_input",
          value: "Not ready"
        },
        {
          detail: "The current lane cannot defend this companion on the active topology.",
          label: "LnT,A",
          postureDetail: "The active topology does not expose a defensible solver lane for this metric.",
          postureLabel: "Unsupported on route",
          postureTone: "neutral",
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

  it("keeps heavy concrete formula derivation notes inside the proposal method dossier", () => {
    const scenario = buildHeavyFloatingFormulaScenario();
    const result = scenario.result;

    expect(result, "formula scenario should evaluate").not.toBeNull();
    if (!result) {
      throw new Error("Expected formula scenario to evaluate.");
    }

    const branchSummary = getDynamicCalcBranchSummary({
      result,
      studyMode: "floor"
    });
    const validationSummary = getGuidedValidationSummary({
      result,
      studyMode: "floor"
    });

    const dossier = buildSimpleWorkbenchMethodDossier({
      branchDetail: branchSummary.detail,
      branchLabel: branchSummary.value,
      contextLabel: "Building prediction",
      coverageItems: [
        {
          detail: "Heavy floating formula result on the active impact lane.",
          label: "Ln,w",
          postureDetail: "The active route is a scoped heavy-concrete formula estimate.",
          postureLabel: "Scoped live",
          postureTone: "accent",
          status: "live",
          value: "65.8 dB"
        },
        {
          detail: "Standardized field continuation from the same formula-owned lane.",
          label: "L'nT,w",
          postureDetail: "Field K and room volume are explicit.",
          postureLabel: "Scoped live",
          postureTone: "accent",
          status: "live",
          value: "65.4 dB"
        }
      ],
      layers: HEAVY_FLOATING_FORMULA_ROWS.map((row, index) => ({
        categoryLabel: "Test layer",
        index: index + 1,
        label: row.materialId,
        roleLabel: row.floorRole,
        thicknessLabel: `${row.thicknessMm} mm`
      })),
      result,
      stackDetail: "3 live rows feed 3 solver layers directly on the active route.",
      studyModeLabel: "Floor",
      validationDetail: validationSummary.detail,
      validationLabel: validationSummary.value,
      warnings: scenario.warnings
    });

    const impactTraceGroup = dossier.traceGroups.find((group) => group.label === "Impact lane");

    expect(impactTraceGroup).toEqual(
      expect.objectContaining({
        tone: "accent",
        value: "Heavy floating-floor formula"
      })
    );
    expect(impactTraceGroup?.detail).toContain("Estimated evidence using Standardized field-volume carry-over.");
    expect(impactTraceGroup?.detail).toContain("Standardized room-volume carry-over.");
    expect(impactTraceGroup?.notes).toHaveLength(4);
    expect(impactTraceGroup?.notes).toContain("Scoped formula estimate is active on the current impact lane.");
    expect(impactTraceGroup?.notes).toContain("Annex C style estimate remains a narrow heavy-floor screening path.");
    expect(impactTraceGroup?.notes).toContain(
      "Floating-floor branch applies 13 log10(m'load) - 14.2 log10(s') + 20.8 for the treatment term."
    );
  });
});
