import { describe, expect, it } from "vitest";

import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import { buildSimpleWorkbenchDiagnosticsDossier } from "./simple-workbench-diagnostics-dossier";
import { buildSimpleWorkbenchEvidencePacket } from "./simple-workbench-evidence";
import { getPresetById } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { getGuidedValidationSummary } from "./guided-validation-summary";

describe("simple workbench diagnostics dossier", () => {
  it("summarizes validation, trace coverage, evidence, and warning posture for guided diagnostics", () => {
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
    const evidence = buildSimpleWorkbenchEvidencePacket({
      outputs: ["Rw", "Ln,w", "DnT,w", "L'n,w"],
      result: scenario.result,
      warnings: scenario.warnings
    });

    const dossier = buildSimpleWorkbenchDiagnosticsDossier({
      branchLabel: branchSummary.value,
      citations: evidence.citations,
      decisionTrailHeadline: evidence.decisionTrailHeadline,
      decisionTrailItems: evidence.decisionTrailItems,
      result: scenario.result,
      validationDetail: validationSummary.detail,
      validationLabel: validationSummary.value,
      warnings: scenario.warnings
    });

    expect(dossier.headline).toContain(branchSummary.value);
    expect(dossier.headline).toContain(validationSummary.value.toLowerCase());
    expect(dossier.cards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Validation posture", value: validationSummary.value }),
        expect.objectContaining({ label: "Trace coverage" }),
        expect.objectContaining({ label: "Evidence courier" }),
        expect.objectContaining({ label: "Warning board" })
      ])
    );
    expect(dossier.traceCount).toBeGreaterThan(0);
    expect(dossier.linkedCitationCount).toBeGreaterThanOrEqual(0);
    expect(dossier.warningCount).toBe(scenario.warnings.length);
  });

  it("keeps low-confidence diagnostics in screening posture even without a live warning", () => {
    const dossier = buildSimpleWorkbenchDiagnosticsDossier({
      branchLabel: "Low-confidence fallback",
      citations: [
        {
          detail: "Nearby published row remains attached for screening audit.",
          href: "https://example.com/nearby-row",
          label: "Nearby row 1 · elastic-ceiling anchor",
          tone: "warning"
        }
      ],
      decisionTrailHeadline: "Low-confidence fallback on reinforced concrete is the current floor-side screening posture.",
      decisionTrailItems: [
        {
          detail: "Low-confidence fallback remains active on the current floor-side route.",
          label: "Delivery posture",
          tone: "warning"
        }
      ],
      result: {
        dynamicAirborneTrace: {} as never,
        dynamicImpactTrace: {} as never
      } as never,
      validationDetail: "Low-confidence fallback remains explicit on a mixed nearby-row concrete lane.",
      validationLabel: "Low-confidence fallback",
      warnings: []
    });

    expect(dossier.headline).toContain("screening-route low-confidence posture");
    expect(dossier.cards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Trace coverage",
          tone: "accent",
          value: "2 screening"
        }),
        expect.objectContaining({
          label: "Warning board",
          tone: "warning",
          value: "Screening"
        })
      ])
    );
    expect(dossier.cards.find((card) => card.label === "Evidence courier")?.detail).toContain("screening package");
    expect(dossier.cards.find((card) => card.label === "Warning board")?.detail).toContain("screening posture");
  });
});
