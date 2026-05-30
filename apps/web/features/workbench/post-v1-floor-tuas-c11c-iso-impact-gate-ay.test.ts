import { calculateAssembly } from "@dynecho/engine";
import type { AssemblyCalculation, ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { formatConfidenceProvenanceForImpact } from "./impact-confidence-view";
import { getActiveImpactMetricBasisRows } from "./impact-metric-basis-view";
import { getPresetById } from "./preset-definitions";
import { buildResultAnswerChartLanes } from "./result-answer-chart-model";
import type { EvaluatedScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import { getTargetOutputStatus } from "./target-output-status";
import type { LayerDraft } from "./workbench-store";

const TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "DnT,w",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "DeltaLw",
  "IIC"
] as const satisfies readonly RequestedOutputId[];

const C11C_FIELD_CONTEXT = {
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
} as const satisfies ImpactFieldContext;

const C11C_ROWS = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: "70" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: "30" },
  { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: "1" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "40" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
] as const satisfies readonly Omit<LayerDraft, "id">[];

function buildResult(): AssemblyCalculation {
  return calculateAssembly(
    C11C_ROWS.map((row) => ({
      floorRole: row.floorRole,
      materialId: row.materialId,
      thicknessMm: Number(row.thicknessMm)
    })),
    {
      airborneContext: {
        contextMode: "building_prediction",
        panelHeightMm: 3000,
        panelWidthMm: 4200,
        receivingRoomRt60S: 0.7,
        receivingRoomVolumeM3: 55
      },
      impactFieldContext: C11C_FIELD_CONTEXT,
      targetOutputs: TARGET_OUTPUTS
    }
  );
}

function buildScenario(): EvaluatedScenario {
  return {
    id: "gate-ay-tuas-c11c-iso-impact",
    name: "Gate AY TUAS C11c ISO impact",
    result: buildResult(),
    rows: C11C_ROWS.map((row, index) => ({ ...row, id: `gate-ay-c11c-${index + 1}` })),
    source: "current",
    studyMode: "floor",
    warnings: []
  };
}

function buildReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("tuas_clt_260_exact"),
    briefNote: "",
    clientName: "Gate AY Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate AY TUAS C11c",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "60",
    targetRwDb: "47"
  });
}

describe("post-V1 floor TUAS C11c ISO impact Gate AY surface parity", () => {
  it("shows guarded C11c lab and field impact outputs across cards, status, chart, basis rows, and report", () => {
    const scenario = buildScenario();
    const result = scenario.result;

    expect(result?.impact).toMatchObject({
      CI: 1,
      CI50_2500: 1,
      LPrimeNT50: 60.2,
      LPrimeNTw: 59.2,
      LPrimeNW: 62,
      LnW: 59,
      LnWPlusCI: 60,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(result?.impact?.metricBasis).toMatchObject({
      CI: "tuas_c11c_visible_iso_weighted_impact_tuple_guarded",
      CI50_2500: "tuas_c11c_visible_iso_weighted_impact_tuple_guarded",
      LPrimeNT50: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500",
      LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
      LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
      LnW: "tuas_c11c_visible_iso_weighted_impact_tuple_guarded",
      LnWPlusCI: "tuas_c11c_visible_iso_weighted_impact_tuple_guarded"
    });
    expect(result?.supportedTargetOutputs).toEqual([
      "Rw",
      "STC",
      "C",
      "Ctr",
      "R'w",
      "DnT,w",
      "Ln,w",
      "CI",
      "CI,50-2500",
      "Ln,w+CI",
      "L'n,w",
      "L'nT,w",
      "L'nT,50"
    ]);
    expect(result?.unsupportedTargetOutputs).toEqual(["DeltaLw", "IIC"]);

    expect(buildOutputCard({ output: "Ln,w", result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "59 dB"
    });
    expect(buildOutputCard({ output: "L'nT,w", result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "59.2 dB"
    });
    expect(buildOutputCard({ output: "L'nT,50", result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "60.2 dB"
    });
    expect(buildOutputCard({ output: "DeltaLw", result, studyMode: "floor" }).status).toBe("unsupported");
    expect(buildOutputCard({ output: "IIC", result, studyMode: "floor" }).status).toBe("unsupported");

    expect(getTargetOutputStatus({ guideResult: null, output: "L'nT,50", result })).toMatchObject({
      kind: "engine_live"
    });
    expect(formatConfidenceProvenanceForImpact({
      basis: result?.impact?.metricBasis?.LnW,
      provenance: result?.impact?.confidence.provenance ?? "published_family_estimate"
    })).toBe("TUAS C11c guarded ISO tuple");
    expect(getActiveImpactMetricBasisRows(result?.impact).map((row) => row.label)).toEqual(
      expect.arrayContaining(["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"])
    );

    expect(buildResultAnswerChartLanes({ result })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          companions: expect.arrayContaining([
            { label: "CI", valueLabel: "+1 dB" },
            { label: "CI,50-2500", valueLabel: "+1 dB" },
            { label: "Ln,w+CI", valueLabel: "60 dB" },
            { label: "L'n,w", valueLabel: "62 dB" },
            { label: "L'nT,w", valueLabel: "59.2 dB" },
            { label: "L'nT,50", valueLabel: "60.2 dB" }
          ]),
          id: "impact",
          label: "Ln,w",
          valueLabel: "59 dB"
        })
      ])
    );

    const report = buildReport(scenario);
    expect(report).toContain("- Engine-live now: Rw, STC, C, Ctr, R'w, DnT,w, Ln,w, CI, CI,50-2500, Ln,w+CI, L'n,w, L'nT,w, L'nT,50");
    expect(report).toContain("- Impact Ln,w: 59.0 dB");
    expect(report).toContain("- Impact L'n,w: 62.0 dB");
    expect(report).toContain("- Impact L'nT,w: 59.2 dB");
    expect(report).toContain("- Impact L'nT,50: 60.2 dB");
    expect(report).toContain("- Impact CI,50-2500: +1.0 dB");
    expect(report).not.toContain("Unsupported target outputs: Ln,w");
  });
});
