import { describe, expect, it } from "vitest";

import type { AssemblyCalculation, ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";

import { getPresetById } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { buildSimpleWorkbenchEvidencePacket } from "./simple-workbench-evidence";
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

function buildReinforcedConcreteLowConfidenceResult(): AssemblyCalculation {
  return {
    dynamicImpactTrace: {
      candidateRowCount: 3,
      detectedSupportFamily: "reinforced_concrete",
      estimateTier: "low_confidence",
      estimateTierLabel: "Low-confidence fallback · reinforced concrete",
      evidenceTier: "estimate",
      evidenceTierLabel: "Estimated evidence",
      fitPercent: 29,
      impactBasisLabel: "Published family low-confidence estimate",
      selectedLabel: "Low-confidence fallback · reinforced concrete",
      selectionKindLabel: "Low-confidence fallback",
      systemType: "combined_upper_lower_system",
      systemTypeLabel: "Combined upper and lower system"
    } as AssemblyCalculation["dynamicImpactTrace"],
    floorSystemEstimate: {
      fitPercent: 29,
      kind: "low_confidence",
      sourceSystems: [
        {
          id: "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
          label: "Euracoustics F2 elastic ceiling concrete",
          sourceLabel: "Euracoustics laboratory row",
          sourceType: "open_measured_dataset",
          sourceUrl: "https://example.com/euracoustics-f2",
          trustTier: "peer_reviewed_open_access"
        },
        {
          id: "euracoustics_f1_rigid_ceiling_concrete_lab_2026",
          label: "Euracoustics F1 rigid ceiling concrete",
          sourceLabel: "Euracoustics laboratory row",
          sourceType: "open_measured_dataset",
          sourceUrl: "https://example.com/euracoustics-f1",
          trustTier: "peer_reviewed_open_access"
        },
        {
          id: "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026",
          label: "Knauf CC60 1A concrete 150 timber acoustic underlay",
          sourceLabel: "Knauf laboratory table",
          sourceType: "official_manufacturer_system_table",
          sourceUrl: "https://example.com/knauf",
          trustTier: "official_manufacturer"
        },
        {
          id: "euracoustics_f3_vinyl_elastic_ceiling_concrete_lab_2026",
          label: "Euracoustics F3 vinyl elastic ceiling concrete",
          sourceLabel: "Euracoustics laboratory row",
          sourceType: "open_measured_dataset",
          sourceUrl: "https://example.com/euracoustics-f3",
          trustTier: "peer_reviewed_open_access"
        }
      ]
    } as AssemblyCalculation["floorSystemEstimate"],
    floorSystemRatings: {
      Rw: 65.9,
      RwCtr: 57,
      RwCtrSemantic: "rw_plus_ctr",
      basis: "predictor_floor_system_low_confidence_estimate"
    },
    impact: {
      basis: "predictor_floor_system_low_confidence_estimate",
      estimateCandidateIds: [
        "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
        "euracoustics_f1_rigid_ceiling_concrete_lab_2026",
        "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"
      ],
      LnW: 50
    } as AssemblyCalculation["impact"],
    layers: [],
    metrics: {
      airGapCount: 1,
      estimatedCDb: -2,
      estimatedCtrDb: -8.9,
      estimatedRwDb: 65.9,
      estimatedStc: 65,
      insulationCount: 1,
      method: "screening_mass_law_curve_seed_v3",
      surfaceMassKgM2: 410,
      totalThicknessMm: 446
    },
    ok: true,
    ratings: {
      iso717: {
        composite: "Rw 66 (-2;-9)",
        descriptor: "Rw"
      }
    },
    supportedTargetOutputs: ["Rw", "Ctr", "Ln,w"],
    unsupportedTargetOutputs: [],
    warnings: []
  } as AssemblyCalculation;
}

describe("simple workbench evidence packet", () => {
  it("surfaces decision-trail and exact-family citation data for an exact floor preset", () => {
    const preset = getPresetById("dataholz_clt_dry_exact");
    const rows = preset.rows.map((row, index) => ({
      ...row,
      id: `row-${index + 1}`
    }));
    const scenario = evaluateScenario({
      id: "evidence-test",
      name: "Evidence test",
      rows,
      source: "current",
      studyMode: preset.studyMode,
      targetOutputs: ["Rw", "Ln,w"]
    });

    const packet = buildSimpleWorkbenchEvidencePacket({
      briefNote: "Keep exact-family lineage explicit in the brief.",
      outputs: ["Rw", "Ln,w"],
      result: scenario.result,
      warnings: scenario.warnings
    });

    expect(packet.decisionTrailHeadline).toMatch(/current floor-side posture|active/i);
    expect(packet.decisionTrailItems.some((item) => item.label === "Impact corridor")).toBe(true);
    expect(packet.citations.some((citation) => citation.label.includes("Exact floor family"))).toBe(true);
    expect(packet.citations.some((citation) => /system id/i.test(citation.detail))).toBe(true);
    expect(packet.citations.some((citation) => citation.href?.includes("dataholz.eu"))).toBe(true);
  });

  it("keeps dynamic airborne citations explicit on protected wall boundary holds", () => {
    const scenario = evaluateScenario({
      airborneContext: {
        contextMode: "field_between_rooms",
        airtightness: "good",
        panelHeightMm: 2700,
        panelWidthMm: 3000,
        receivingRoomRt60S: 0.5,
        receivingRoomVolumeM3: 30,
        sharedTrack: "independent"
      },
      calculator: "dynamic",
      id: "evidence-wall-boundary",
      name: "Evidence wall boundary",
      rows: [
        { id: "wall-1", materialId: "ytong_aac_d700", thicknessMm: "100" },
        { id: "wall-2", materialId: "air_gap", thicknessMm: "50" },
        { id: "wall-3", materialId: "gypsum_board", thicknessMm: "12.5" }
      ],
      source: "current",
      studyMode: "wall",
      targetOutputs: ["R'w", "DnT,w"]
    });

    const packet = buildSimpleWorkbenchEvidencePacket({
      outputs: ["R'w", "DnT,w"],
      result: scenario.result,
      warnings: scenario.warnings
    });

    const dynamicCitation = packet.citations.find((citation) => citation.label === "Dynamic airborne anchor");

    expect(dynamicCitation).toBeTruthy();
    expect(dynamicCitation?.detail).toContain("Ambiguous boundary with Double Leaf");
    expect(dynamicCitation?.detail).toContain("protected corridor hold");
  });

  it("keeps heavy concrete formula provenance explicit in dynamic impact citations", () => {
    const scenario = evaluateScenario({
      id: "evidence-heavy-floating-formula",
      impactFieldContext: FORMULA_IMPACT_FIELD_CONTEXT,
      name: "Evidence heavy floating formula",
      rows: buildRows(HEAVY_FLOATING_FORMULA_ROWS, "evidence-heavy-floating-formula"),
      source: "current",
      studyMode: "floor",
      targetOutputs: FORMULA_TARGET_OUTPUTS
    });

    const packet = buildSimpleWorkbenchEvidencePacket({
      outputs: FORMULA_TARGET_OUTPUTS,
      result: scenario.result,
      warnings: scenario.warnings
    });
    const dynamicCitation = packet.citations.find((citation) => citation.label === "Dynamic impact anchor");

    expect(dynamicCitation).toEqual(
      expect.objectContaining({
        detail: "Heavy floating-floor formula · Estimated evidence · Standardized field-volume carry-over.",
        tone: "accent"
      })
    );
  });

  it("keeps reinforced-concrete low-confidence trace and estimate citations explicit as mixed-row fallbacks", () => {
    const packet = buildSimpleWorkbenchEvidencePacket({
      outputs: ["Rw", "Ctr", "Ln,w"],
      result: buildReinforcedConcreteLowConfidenceResult(),
      warnings: []
    });

    const dynamicCitation = packet.citations.find((citation) => citation.label === "Dynamic impact anchor");
    const fallbackRationaleCitation = packet.citations.find((citation) => citation.label === "Nearby-row fallback rationale");
    const firstEstimateAnchor = packet.citations.find(
      (citation) => citation.label === "Nearby row 1 · elastic-ceiling anchor: Euracoustics F2 elastic ceiling concrete"
    );

    expect(packet.citations[0]?.label).toBe("Dynamic impact anchor");
    expect(packet.citations[1]?.label).toBe("Nearby-row fallback rationale");
    expect(dynamicCitation?.detail).toContain("29% fit inside the active low-confidence ceiling");
    expect(dynamicCitation?.detail).toContain("mixed nearby-row concrete lane");
    expect(dynamicCitation?.detail).toContain("elastic-ceiling nearby row first");
    expect(fallbackRationaleCitation?.detail).toContain("Nearby published rows ranked for the current mixed-row fallback");
    expect(fallbackRationaleCitation?.detail).toContain("elastic-ceiling nearby row first");
    expect(firstEstimateAnchor?.detail).toContain("Low-confidence reinforced-concrete mixed-row estimate at 29% fit");
    expect(firstEstimateAnchor?.detail).toContain("proxy airborne companions");
    expect(firstEstimateAnchor?.detail).toContain("timber-underlay row as a farther fallback");
    expect(packet.citations.some((citation) => citation.label === "Nearby row 2 · rigid-ceiling cross-check: Euracoustics F1 rigid ceiling concrete")).toBe(
      true
    );
    expect(packet.citations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "1 more nearby published row remains in the current mixed-row fallback corridor.",
          label: "Additional nearby published rows"
        })
      ])
    );
  });
});
