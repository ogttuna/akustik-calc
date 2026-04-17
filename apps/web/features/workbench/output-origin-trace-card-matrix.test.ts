import type { AirborneCalculatorId, AirborneContext, ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import type { StudyMode } from "./preset-definitions";
import type { LayerDraft } from "./workbench-store";

type CardSnapshot = {
  status: string;
  value: string;
};

type RouteSnapshot = {
  boundFloorSystemMatchId: string | null;
  calculatorId: string | null;
  cards: Partial<Record<RequestedOutputId, CardSnapshot>>;
  candidateIds: readonly string[] | null;
  floorSystemEstimateBasis: string | null;
  floorSystemEstimateKind: string | null;
  floorSystemMatchId: string | null;
  floorSystemRatingsBasis: string | null;
  impactBasis: string | null;
  lowerBoundBasis: string | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

type RouteCase = {
  airborneContext?: AirborneContext | null;
  calculator?: AirborneCalculatorId | null;
  expected: RouteSnapshot;
  id: string;
  impactFieldContext?: ImpactFieldContext | null;
  rows: readonly Omit<LayerDraft, "id">[];
  studyMode: StudyMode;
  targetOutputs: readonly RequestedOutputId[];
};

const FLOOR_FIELD_OUTPUTS = ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "Ln,w+CI", "L'nT,50", "Ctr"] as const;
const RAW_FIELD_OUTPUTS = ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"] as const;
const BOUND_FIELD_OUTPUTS = ["Rw", "Ln,w", "L'n,w", "L'nT,w", "Ln,w+CI"] as const;
const WALL_OUTPUTS = ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"] as const;

const AIRBORNE_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const AIRBORNE_PARTIAL_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 3000,
  panelWidthMm: 4200
};

const RAW_AIRBORNE_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const IMPACT_FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 50
};

const RAW_IMPACT_FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const CASES: readonly RouteCase[] = [
  {
    id: "exact-dry-clt-source",
    studyMode: "floor",
    targetOutputs: FLOOR_FIELD_OUTPUTS,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    rows: [
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "140" },
      { floorRole: "resilient_layer", materialId: "mw_t_40_impact_layer", thicknessMm: "30" },
      { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: "60" },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "25" }
    ],
    expected: {
      boundFloorSystemMatchId: null,
      calculatorId: null,
      candidateIds: null,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: "dataholz_gdmtxn01_dry_clt_lab_2026",
      floorSystemRatingsBasis: "official_floor_system_exact_match",
      impactBasis: "mixed_exact_plus_estimated_local_guide",
      lowerBoundBasis: null,
      supported: ["Rw", "Ln,w", "L'n,w", "L'nT,w", "Ln,w+CI", "L'nT,50"],
      unsupported: ["R'w", "DnT,w", "Ctr"],
      cards: {
        Rw: { status: "live", value: "62 dB" },
        "R'w": { status: "needs_input", value: "Not ready" },
        "DnT,w": { status: "needs_input", value: "Not ready" },
        "Ln,w": { status: "live", value: "50 dB" },
        "L'n,w": { status: "live", value: "52 dB" },
        "L'nT,w": { status: "live", value: "50 dB" },
        "Ln,w+CI": { status: "live", value: "49 dB" },
        "L'nT,50": { status: "live", value: "49 dB" },
        Ctr: { status: "unsupported", value: "Not ready" }
      }
    }
  },
  {
    id: "gdmtxa04a-source-family-estimate",
    studyMode: "floor",
    targetOutputs: FLOOR_FIELD_OUTPUTS,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    rows: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "12.5" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "50" },
      { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: "70" },
      { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: "60" },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "65" },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "160" }
    ],
    expected: {
      boundFloorSystemMatchId: null,
      calculatorId: null,
      candidateIds: ["dataholz_gdmtxa01a_clt_lab_2026"],
      floorSystemEstimateBasis: "predictor_mass_timber_clt_dataholz_dry_estimate",
      floorSystemEstimateKind: "family_general",
      floorSystemMatchId: null,
      floorSystemRatingsBasis: "predictor_mass_timber_clt_dataholz_dry_estimate",
      impactBasis: "mixed_predicted_plus_estimated_local_guide",
      lowerBoundBasis: null,
      supported: ["Rw", "Ln,w", "L'n,w", "L'nT,w", "Ln,w+CI", "L'nT,50"],
      unsupported: ["R'w", "DnT,w", "Ctr"],
      cards: {
        Rw: { status: "live", value: "65 dB" },
        "R'w": { status: "needs_input", value: "Not ready" },
        "DnT,w": { status: "needs_input", value: "Not ready" },
        "Ln,w": { status: "live", value: "49 dB" },
        "L'n,w": { status: "live", value: "51 dB" },
        "L'nT,w": { status: "live", value: "49 dB" },
        "Ln,w+CI": { status: "live", value: "53 dB" },
        "L'nT,50": { status: "live", value: "53 dB" },
        Ctr: { status: "unsupported", value: "Not ready" }
      }
    }
  },
  {
    id: "raw-concrete-helper-formula-field",
    studyMode: "floor",
    targetOutputs: RAW_FIELD_OUTPUTS,
    airborneContext: RAW_AIRBORNE_FIELD_CONTEXT,
    impactFieldContext: RAW_IMPACT_FIELD_CONTEXT,
    rows: [
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "rockwool", thicknessMm: "40" },
      { materialId: "rockwool", thicknessMm: "50" },
      { materialId: "furring_channel", thicknessMm: "18" },
      { materialId: "furring_channel", thicknessMm: "18" },
      { materialId: "concrete", thicknessMm: "160" }
    ],
    expected: {
      boundFloorSystemMatchId: null,
      calculatorId: null,
      candidateIds: null,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      floorSystemRatingsBasis: "screening_mass_law_curve_seed_v3",
      impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      lowerBoundBasis: null,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: [],
      cards: {
        Rw: { status: "live", value: "57 dB" },
        "R'w": { status: "live", value: "57 dB" },
        "DnT,w": { status: "live", value: "60 dB" },
        "Ln,w": { status: "live", value: "72.7 dB" },
        "L'n,w": { status: "live", value: "74.7 dB" },
        "L'nT,w": { status: "live", value: "72.3 dB" }
      }
    }
  },
  {
    id: "ubiq-bound-only-source",
    studyMode: "floor",
    targetOutputs: BOUND_FIELD_OUTPUTS,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    rows: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
    ],
    expected: {
      boundFloorSystemMatchId: "ubiq_fl33_open_web_steel_300_lab_2026",
      calculatorId: null,
      candidateIds: null,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      floorSystemRatingsBasis: "official_floor_system_bound_support",
      impactBasis: null,
      lowerBoundBasis: "mixed_bound_plus_estimated_standardized_field_volume_normalization",
      supported: ["Rw", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: ["Ln,w+CI"],
      cards: {
        Rw: { status: "live", value: "63 dB" },
        "Ln,w": { status: "bound", value: "<= 51 dB" },
        "L'n,w": { status: "bound", value: "<= 53 dB" },
        "L'nT,w": { status: "bound", value: "<= 51 dB" },
        "Ln,w+CI": { status: "unsupported", value: "Not ready" }
      }
    }
  },
  {
    id: "wall-dynamic-airborne-field",
    studyMode: "wall",
    targetOutputs: WALL_OUTPUTS,
    calculator: "dynamic",
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    rows: [
      { materialId: "concrete", thicknessMm: "160" },
      { materialId: "rockwool", thicknessMm: "45" },
      { materialId: "gypsum_board", thicknessMm: "12.5" }
    ],
    expected: {
      boundFloorSystemMatchId: null,
      calculatorId: "dynamic",
      candidateIds: null,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      floorSystemRatingsBasis: "screening_mass_law_curve_seed_v3",
      impactBasis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
      lowerBoundBasis: null,
      supported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"],
      unsupported: ["Rw"],
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "59 dB" },
        "Dn,w": { status: "live", value: "58 dB" },
        "Dn,A": { status: "live", value: "56.9 dB" },
        "DnT,w": { status: "live", value: "61 dB" },
        "DnT,A": { status: "live", value: "59.4 dB" },
        STC: { status: "live", value: "59 dB" },
        C: { status: "live", value: "-1.1 dB" },
        Ctr: { status: "live", value: "-5.8 dB" }
      }
    }
  },
  {
    id: "wall-dynamic-airborne-needs-volume",
    studyMode: "wall",
    targetOutputs: WALL_OUTPUTS,
    calculator: "dynamic",
    airborneContext: AIRBORNE_PARTIAL_FIELD_CONTEXT,
    rows: [
      { materialId: "concrete", thicknessMm: "160" },
      { materialId: "rockwool", thicknessMm: "45" },
      { materialId: "gypsum_board", thicknessMm: "12.5" }
    ],
    expected: {
      boundFloorSystemMatchId: null,
      calculatorId: "dynamic",
      candidateIds: null,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      floorSystemRatingsBasis: "screening_mass_law_curve_seed_v3",
      impactBasis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
      lowerBoundBasis: null,
      supported: ["R'w", "Dn,w", "Dn,A", "STC", "C", "Ctr"],
      unsupported: ["Rw", "DnT,w", "DnT,A"],
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "59 dB" },
        "Dn,w": { status: "live", value: "58 dB" },
        "Dn,A": { status: "live", value: "56.9 dB" },
        "DnT,w": { status: "needs_input", value: "Not ready" },
        "DnT,A": { status: "needs_input", value: "Not ready" },
        STC: { status: "live", value: "59 dB" },
        C: { status: "live", value: "-1.1 dB" },
        Ctr: { status: "live", value: "-5.8 dB" }
      }
    }
  },
  {
    id: "steel-joist-impact-fail-closed",
    studyMode: "floor",
    targetOutputs: RAW_FIELD_OUTPUTS,
    airborneContext: RAW_AIRBORNE_FIELD_CONTEXT,
    impactFieldContext: RAW_IMPACT_FIELD_CONTEXT,
    rows: [
      { materialId: "gypsum_board", thicknessMm: "13" },
      { materialId: "rockwool", thicknessMm: "90" },
      { materialId: "gypsum_board", thicknessMm: "13" },
      { materialId: "steel_joist_floor", thicknessMm: "250" }
    ],
    expected: {
      boundFloorSystemMatchId: null,
      calculatorId: null,
      candidateIds: null,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      floorSystemRatingsBasis: "screening_mass_law_curve_seed_v3",
      impactBasis: null,
      lowerBoundBasis: null,
      supported: ["R'w", "DnT,w"],
      unsupported: ["Rw", "Ln,w", "L'n,w", "L'nT,w"],
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "70 dB" },
        "DnT,w": { status: "live", value: "73 dB" },
        "Ln,w": { status: "unsupported", value: "Not ready" },
        "L'n,w": { status: "needs_input", value: "Not ready" },
        "L'nT,w": { status: "needs_input", value: "Not ready" }
      }
    }
  }
];

function snapshot(testCase: RouteCase): RouteSnapshot {
  const scenario = evaluateScenario({
    airborneContext: testCase.airborneContext ?? null,
    calculator: testCase.calculator ?? null,
    id: testCase.id,
    impactFieldContext: testCase.impactFieldContext ?? null,
    name: testCase.id,
    rows: testCase.rows.map((row, index) => ({ ...row, id: `${testCase.id}-${index + 1}` })),
    source: "current",
    studyMode: testCase.studyMode,
    targetOutputs: testCase.targetOutputs
  });

  expect(scenario.result, `${testCase.id} should evaluate`).not.toBeNull();
  if (!scenario.result) {
    throw new Error(`${testCase.id} did not evaluate.`);
  }

  return {
    boundFloorSystemMatchId: scenario.result.boundFloorSystemMatch?.system.id ?? null,
    calculatorId: scenario.result.calculatorId ?? null,
    cards: Object.fromEntries(
      testCase.targetOutputs.map((output) => {
        const card = buildOutputCard({
          output,
          result: scenario.result,
          studyMode: testCase.studyMode
        });

        return [output, { status: card.status, value: card.value }];
      })
    ) as Partial<Record<RequestedOutputId, CardSnapshot>>,
    candidateIds: scenario.result.impact?.estimateCandidateIds ?? scenario.result.floorSystemEstimate?.candidateIds ?? null,
    floorSystemEstimateBasis: scenario.result.floorSystemEstimate?.impact.basis ?? null,
    floorSystemEstimateKind: scenario.result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: scenario.result.floorSystemMatch?.system.id ?? null,
    floorSystemRatingsBasis: scenario.result.floorSystemRatings?.basis ?? null,
    impactBasis: scenario.result.impact?.basis ?? null,
    lowerBoundBasis: scenario.result.lowerBoundImpact?.basis ?? null,
    supported: scenario.result.supportedTargetOutputs,
    unsupported: scenario.result.unsupportedTargetOutputs
  };
}

describe("output origin trace card matrix", () => {
  it("keeps workbench cards aligned with representative answer origins", () => {
    for (const testCase of CASES) {
      const actual = snapshot(testCase);

      expect(actual, testCase.id).toEqual(testCase.expected);
    }
  });
});
