import type { AirborneContext, ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

type ContextKind = "building" | "field" | "lab";

type CardSnapshot = {
  status: string;
  value: string;
};

type OriginSnapshot = {
  boundFloorSystemMatchId: string | null;
  candidateIds: readonly string[] | null;
  floorRatingsBasis: string | null;
  floorSystemMatchId: string | null;
  impactBasis: string | null;
  lowerBoundBasis: string | null;
  systemEstimateKind: string | null;
};

type RouteSnapshot = {
  cards: Partial<Record<RequestedOutputId, CardSnapshot>>;
  origin: OriginSnapshot;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

type RouteCase = {
  expected: Record<ContextKind, RouteSnapshot>;
  id: string;
  rows: readonly Omit<LayerDraft, "id">[];
};

const FLOOR_CONTINUATION_OUTPUTS = [
  "Rw",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "Ln,w",
  "Ln,w+CI",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

const FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 3000,
  panelWidthMm: 4200
};

const BUILDING_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const BUILDING_IMPACT_CONTEXT: ImpactFieldContext = {
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
};

const UBIQ_EXACT_OPEN_WEB_200_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "200" }
];

const KNAUF_ACOUSTIC_TIMBER_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: "28" },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
  { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: "240" }
];

const DATAHOLZ_CLT_DRY_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "25" },
  { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: "60" },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s40", thicknessMm: "30" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "140" }
];

const REINFORCED_CONCRETE_LOW_CONFIDENCE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: "180" },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: "8" },
  { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: "3" },
  { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: "120" },
  { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: "100" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" }
];

const RAW_TERMINAL_CONCRETE_HELPER_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "40" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "furring_channel", thicknessMm: "18" },
  { materialId: "furring_channel", thicknessMm: "18" },
  { materialId: "concrete", thicknessMm: "160" }
];

const RAW_BARE_OPEN_WEB_BLOCKED_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
];

const FIELD_OUTPUT_NEEDS_INPUT_CARDS = {
  "R'w": { status: "needs_input", value: "Not ready" },
  "Dn,w": { status: "needs_input", value: "Not ready" },
  "Dn,A": { status: "needs_input", value: "Not ready" },
  "DnT,w": { status: "needs_input", value: "Not ready" },
  "DnT,A": { status: "needs_input", value: "Not ready" }
} as const satisfies Partial<Record<RequestedOutputId, CardSnapshot>>;

const FIELD_IMPACT_NEEDS_INPUT_CARDS = {
  "L'n,w": { status: "needs_input", value: "Not ready" },
  "L'nT,w": { status: "needs_input", value: "Not ready" },
  "L'nT,50": { status: "needs_input", value: "Not ready" }
} as const satisfies Partial<Record<RequestedOutputId, CardSnapshot>>;

const LOW_CONFIDENCE_CANDIDATE_IDS = [
  "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
  "euracoustics_f1_rigid_ceiling_concrete_lab_2026",
  "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"
] as const;

function snapshot(testCase: RouteCase, context: ContextKind): RouteSnapshot {
  const scenario = evaluateScenario({
    airborneContext: context === "lab" ? null : context === "field" ? FIELD_CONTEXT : BUILDING_CONTEXT,
    id: `${testCase.id}-${context}`,
    impactFieldContext: context === "building" ? BUILDING_IMPACT_CONTEXT : null,
    name: testCase.id,
    rows: testCase.rows.map((row, index) => ({ ...row, id: `${testCase.id}-${context}-${index + 1}` })),
    source: "current",
    studyMode: "floor",
    targetOutputs: FLOOR_CONTINUATION_OUTPUTS
  });

  expect(scenario.result, `${testCase.id} ${context} should evaluate`).not.toBeNull();
  if (!scenario.result) {
    throw new Error(`${testCase.id} ${context} did not evaluate.`);
  }

  return {
    cards: Object.fromEntries(
      FLOOR_CONTINUATION_OUTPUTS.map((output) => {
        const card = buildOutputCard({
          output,
          result: scenario.result,
          studyMode: "floor"
        });

        return [output, { status: card.status, value: card.value }];
      })
    ) as Partial<Record<RequestedOutputId, CardSnapshot>>,
    origin: {
      boundFloorSystemMatchId: scenario.result.boundFloorSystemMatch?.system.id ?? null,
      candidateIds: scenario.result.impact?.estimateCandidateIds ?? scenario.result.floorSystemEstimate?.candidateIds ?? null,
      floorRatingsBasis: scenario.result.floorSystemRatings?.basis ?? null,
      floorSystemMatchId: scenario.result.floorSystemMatch?.system.id ?? null,
      impactBasis: scenario.result.impact?.basis ?? null,
      lowerBoundBasis: scenario.result.lowerBoundImpact?.basis ?? null,
      systemEstimateKind: scenario.result.floorSystemEstimate?.kind ?? null
    },
    supported: scenario.result.supportedTargetOutputs,
    unsupported: scenario.result.unsupportedTargetOutputs
  };
}

function expectedOrigin(input: OriginSnapshot): OriginSnapshot {
  return input;
}

const CASES: readonly RouteCase[] = [
  {
    id: "ubiq exact supported-band open-web row",
    rows: UBIQ_EXACT_OPEN_WEB_200_ROWS,
    expected: {
      lab: {
        origin: expectedOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "official_floor_system_exact_match",
          floorSystemMatchId: "ubiq_fl28_open_web_steel_200_exact_lab_2026",
          impactBasis: "official_floor_system_exact_match",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "Ln,w", "Ln,w+CI", "Ctr"],
        unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
        cards: {
          ...FIELD_OUTPUT_NEEDS_INPUT_CARDS,
          ...FIELD_IMPACT_NEEDS_INPUT_CARDS,
          Rw: { status: "live", value: "63 dB" },
          "Ln,w": { status: "live", value: "52 dB" },
          "Ln,w+CI": { status: "live", value: "51 dB" },
          DeltaLw: { status: "unsupported", value: "Not ready" },
          Ctr: { status: "live", value: "-6 dB" }
        }
      },
      field: {
        origin: expectedOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "official_floor_system_exact_match",
          floorSystemMatchId: "ubiq_fl28_open_web_steel_200_exact_lab_2026",
          impactBasis: "official_floor_system_exact_match",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "R'w", "Dn,w", "Dn,A", "Ln,w", "Ln,w+CI", "Ctr"],
        unsupported: ["DnT,w", "DnT,A", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
        cards: {
          ...FIELD_IMPACT_NEEDS_INPUT_CARDS,
          Rw: { status: "live", value: "63 dB" },
          "R'w": { status: "live", value: "68 dB" },
          "Dn,w": { status: "live", value: "67 dB" },
          "Dn,A": { status: "live", value: "66 dB" },
          "DnT,w": { status: "needs_input", value: "Not ready" },
          "DnT,A": { status: "needs_input", value: "Not ready" },
          "Ln,w": { status: "live", value: "52 dB" },
          "Ln,w+CI": { status: "live", value: "51 dB" },
          DeltaLw: { status: "unsupported", value: "Not ready" },
          Ctr: { status: "live", value: "-6 dB" }
        }
      },
      building: {
        origin: expectedOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "official_floor_system_exact_match",
          floorSystemMatchId: "ubiq_fl28_open_web_steel_200_exact_lab_2026",
          impactBasis: "mixed_exact_plus_estimated_local_guide",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50", "Ctr"],
        unsupported: ["DeltaLw"],
        cards: {
          Rw: { status: "live", value: "63 dB" },
          "R'w": { status: "live", value: "68 dB" },
          "Dn,w": { status: "live", value: "67 dB" },
          "Dn,A": { status: "live", value: "66 dB" },
          "DnT,w": { status: "live", value: "70 dB" },
          "DnT,A": { status: "live", value: "68.5 dB" },
          "Ln,w": { status: "live", value: "52 dB" },
          "Ln,w+CI": { status: "live", value: "51 dB" },
          DeltaLw: { status: "unsupported", value: "Not ready" },
          "L'n,w": { status: "live", value: "55 dB" },
          "L'nT,w": { status: "live", value: "52.2 dB" },
          "L'nT,50": { status: "live", value: "52 dB" },
          Ctr: { status: "live", value: "-6 dB" }
        }
      }
    }
  },
  {
    id: "knauf acoustic timber exact row",
    rows: KNAUF_ACOUSTIC_TIMBER_EXACT_ROWS,
    expected: {
      lab: {
        origin: expectedOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "official_floor_system_exact_match",
          floorSystemMatchId: "knauf_ct120_1c_timber_lab_2026",
          impactBasis: "official_floor_system_exact_match",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "Ln,w", "Ctr"],
        unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
        cards: {
          ...FIELD_OUTPUT_NEEDS_INPUT_CARDS,
          ...FIELD_IMPACT_NEEDS_INPUT_CARDS,
          Rw: { status: "live", value: "60 dB" },
          "Ln,w": { status: "live", value: "61 dB" },
          "Ln,w+CI": { status: "unsupported", value: "Not ready" },
          DeltaLw: { status: "unsupported", value: "Not ready" },
          Ctr: { status: "live", value: "-7 dB" }
        }
      },
      field: {
        origin: expectedOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "official_floor_system_exact_match",
          floorSystemMatchId: "knauf_ct120_1c_timber_lab_2026",
          impactBasis: "official_floor_system_exact_match",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "R'w", "Dn,w", "Dn,A", "Ln,w", "Ctr"],
        unsupported: ["DnT,w", "DnT,A", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
        cards: {
          ...FIELD_IMPACT_NEEDS_INPUT_CARDS,
          Rw: { status: "live", value: "60 dB" },
          "R'w": { status: "live", value: "44 dB" },
          "Dn,w": { status: "live", value: "43 dB" },
          "Dn,A": { status: "live", value: "42 dB" },
          "DnT,w": { status: "needs_input", value: "Not ready" },
          "DnT,A": { status: "needs_input", value: "Not ready" },
          "Ln,w": { status: "live", value: "61 dB" },
          "Ln,w+CI": { status: "unsupported", value: "Not ready" },
          DeltaLw: { status: "unsupported", value: "Not ready" },
          Ctr: { status: "live", value: "-7 dB" }
        }
      },
      building: {
        origin: expectedOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "official_floor_system_exact_match",
          floorSystemMatchId: "knauf_ct120_1c_timber_lab_2026",
          impactBasis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "L'n,w", "L'nT,w", "Ctr"],
        unsupported: ["Ln,w+CI", "DeltaLw", "L'nT,50"],
        cards: {
          Rw: { status: "live", value: "60 dB" },
          "R'w": { status: "live", value: "44 dB" },
          "Dn,w": { status: "live", value: "43 dB" },
          "Dn,A": { status: "live", value: "42 dB" },
          "DnT,w": { status: "live", value: "46 dB" },
          "DnT,A": { status: "live", value: "44.5 dB" },
          "Ln,w": { status: "live", value: "61 dB" },
          "Ln,w+CI": { status: "unsupported", value: "Not ready" },
          DeltaLw: { status: "unsupported", value: "Not ready" },
          "L'n,w": { status: "live", value: "64 dB" },
          "L'nT,w": { status: "live", value: "61.2 dB" },
          "L'nT,50": { status: "unsupported", value: "Not ready" },
          Ctr: { status: "live", value: "-7 dB" }
        }
      }
    }
  },
  {
    id: "dataholz CLT dry exact row",
    rows: DATAHOLZ_CLT_DRY_EXACT_ROWS,
    expected: {
      lab: {
        origin: expectedOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "official_floor_system_exact_match",
          floorSystemMatchId: "dataholz_gdmtxn01_dry_clt_lab_2026",
          impactBasis: "official_floor_system_exact_match",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "Ln,w", "Ln,w+CI"],
        unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50", "Ctr"],
        cards: {
          ...FIELD_OUTPUT_NEEDS_INPUT_CARDS,
          ...FIELD_IMPACT_NEEDS_INPUT_CARDS,
          Rw: { status: "live", value: "62 dB" },
          "Ln,w": { status: "live", value: "50 dB" },
          "Ln,w+CI": { status: "live", value: "49 dB" },
          DeltaLw: { status: "unsupported", value: "Not ready" },
          Ctr: { status: "unsupported", value: "Not ready" }
        }
      },
      field: {
        origin: expectedOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "official_floor_system_exact_match",
          floorSystemMatchId: "dataholz_gdmtxn01_dry_clt_lab_2026",
          impactBasis: "official_floor_system_exact_match",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "R'w", "Dn,w", "Dn,A", "Ln,w", "Ln,w+CI"],
        unsupported: ["DnT,w", "DnT,A", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50", "Ctr"],
        cards: {
          ...FIELD_IMPACT_NEEDS_INPUT_CARDS,
          Rw: { status: "live", value: "62 dB" },
          "R'w": { status: "live", value: "46 dB" },
          "Dn,w": { status: "live", value: "45 dB" },
          "Dn,A": { status: "live", value: "43.7 dB" },
          "DnT,w": { status: "needs_input", value: "Not ready" },
          "DnT,A": { status: "needs_input", value: "Not ready" },
          "Ln,w": { status: "live", value: "50 dB" },
          "Ln,w+CI": { status: "live", value: "49 dB" },
          DeltaLw: { status: "unsupported", value: "Not ready" },
          Ctr: { status: "unsupported", value: "Not ready" }
        }
      },
      building: {
        origin: expectedOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "official_floor_system_exact_match",
          floorSystemMatchId: "dataholz_gdmtxn01_dry_clt_lab_2026",
          impactBasis: "mixed_exact_plus_estimated_local_guide",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
        unsupported: ["DeltaLw", "Ctr"],
        cards: {
          Rw: { status: "live", value: "62 dB" },
          "R'w": { status: "live", value: "46 dB" },
          "Dn,w": { status: "live", value: "45 dB" },
          "Dn,A": { status: "live", value: "43.7 dB" },
          "DnT,w": { status: "live", value: "47 dB" },
          "DnT,A": { status: "live", value: "46.2 dB" },
          "Ln,w": { status: "live", value: "50 dB" },
          "Ln,w+CI": { status: "live", value: "49 dB" },
          DeltaLw: { status: "unsupported", value: "Not ready" },
          "L'n,w": { status: "live", value: "53 dB" },
          "L'nT,w": { status: "live", value: "50.2 dB" },
          "L'nT,50": { status: "live", value: "50 dB" },
          Ctr: { status: "unsupported", value: "Not ready" }
        }
      }
    }
  },
  {
    id: "reinforced concrete low-confidence formula row",
    rows: REINFORCED_CONCRETE_LOW_CONFIDENCE_ROWS,
    expected: {
      lab: {
        origin: expectedOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: LOW_CONFIDENCE_CANDIDATE_IDS,
          floorRatingsBasis: "predictor_floor_system_low_confidence_estimate",
          floorSystemMatchId: null,
          impactBasis: "predictor_floor_system_low_confidence_estimate",
          lowerBoundBasis: null,
          systemEstimateKind: "low_confidence"
        }),
        supported: ["Rw", "Ln,w", "Ctr"],
        unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
        cards: {
          ...FIELD_OUTPUT_NEEDS_INPUT_CARDS,
          ...FIELD_IMPACT_NEEDS_INPUT_CARDS,
          Rw: { status: "live", value: "65.9 dB" },
          "Ln,w": { status: "live", value: "50 dB" },
          "Ln,w+CI": { status: "unsupported", value: "Not ready" },
          DeltaLw: { status: "unsupported", value: "Not ready" },
          Ctr: { status: "live", value: "-8.9 dB" }
        }
      },
      field: {
        origin: expectedOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: LOW_CONFIDENCE_CANDIDATE_IDS,
          floorRatingsBasis: "predictor_floor_system_low_confidence_estimate",
          floorSystemMatchId: null,
          impactBasis: "predictor_floor_system_low_confidence_estimate",
          lowerBoundBasis: null,
          systemEstimateKind: "low_confidence"
        }),
        supported: ["Rw", "R'w", "Dn,w", "Dn,A", "Ln,w", "Ctr"],
        unsupported: ["DnT,w", "DnT,A", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
        cards: {
          ...FIELD_IMPACT_NEEDS_INPUT_CARDS,
          Rw: { status: "live", value: "65.9 dB" },
          "R'w": { status: "live", value: "58 dB" },
          "Dn,w": { status: "live", value: "57 dB" },
          "Dn,A": { status: "live", value: "55.7 dB" },
          "DnT,w": { status: "needs_input", value: "Not ready" },
          "DnT,A": { status: "needs_input", value: "Not ready" },
          "Ln,w": { status: "live", value: "50 dB" },
          "Ln,w+CI": { status: "unsupported", value: "Not ready" },
          DeltaLw: { status: "unsupported", value: "Not ready" },
          Ctr: { status: "live", value: "-8.9 dB" }
        }
      },
      building: {
        origin: expectedOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: LOW_CONFIDENCE_CANDIDATE_IDS,
          floorRatingsBasis: "predictor_floor_system_low_confidence_estimate",
          floorSystemMatchId: null,
          impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
          lowerBoundBasis: null,
          systemEstimateKind: "low_confidence"
        }),
        supported: ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "L'n,w", "L'nT,w", "Ctr"],
        unsupported: ["Ln,w+CI", "DeltaLw", "L'nT,50"],
        cards: {
          Rw: { status: "live", value: "65.9 dB" },
          "R'w": { status: "live", value: "58 dB" },
          "Dn,w": { status: "live", value: "57 dB" },
          "Dn,A": { status: "live", value: "55.7 dB" },
          "DnT,w": { status: "live", value: "59 dB" },
          "DnT,A": { status: "live", value: "58.2 dB" },
          "Ln,w": { status: "live", value: "50 dB" },
          "Ln,w+CI": { status: "unsupported", value: "Not ready" },
          DeltaLw: { status: "unsupported", value: "Not ready" },
          "L'n,w": { status: "live", value: "53 dB" },
          "L'nT,w": { status: "live", value: "50.2 dB" },
          "L'nT,50": { status: "unsupported", value: "Not ready" },
          Ctr: { status: "live", value: "-8.9 dB" }
        }
      }
    }
  },
  {
    id: "raw terminal concrete helper row",
    rows: RAW_TERMINAL_CONCRETE_HELPER_ROWS,
    expected: {
      lab: {
        origin: expectedOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "screening_mass_law_curve_seed_v3",
          floorSystemMatchId: null,
          impactBasis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "Ln,w", "Ctr"],
        unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
        cards: {
          ...FIELD_OUTPUT_NEEDS_INPUT_CARDS,
          ...FIELD_IMPACT_NEEDS_INPUT_CARDS,
          Rw: { status: "live", value: "59 dB" },
          "Ln,w": { status: "live", value: "72.7 dB" },
          "Ln,w+CI": { status: "unsupported", value: "Not ready" },
          DeltaLw: { status: "unsupported", value: "Not ready" },
          Ctr: { status: "live", value: "-5.6 dB" }
        }
      },
      field: {
        origin: expectedOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "screening_mass_law_curve_seed_v3",
          floorSystemMatchId: null,
          impactBasis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "R'w", "Dn,w", "Dn,A", "Ln,w", "Ctr"],
        unsupported: ["DnT,w", "DnT,A", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
        cards: {
          ...FIELD_IMPACT_NEEDS_INPUT_CARDS,
          Rw: { status: "live", value: "57 dB" },
          "R'w": { status: "live", value: "57 dB" },
          "Dn,w": { status: "live", value: "56 dB" },
          "Dn,A": { status: "live", value: "55.3 dB" },
          "DnT,w": { status: "needs_input", value: "Not ready" },
          "DnT,A": { status: "needs_input", value: "Not ready" },
          "Ln,w": { status: "live", value: "72.7 dB" },
          "Ln,w+CI": { status: "unsupported", value: "Not ready" },
          DeltaLw: { status: "unsupported", value: "Not ready" },
          Ctr: { status: "live", value: "-5.4 dB" }
        }
      },
      building: {
        origin: expectedOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "screening_mass_law_curve_seed_v3",
          floorSystemMatchId: null,
          impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "L'n,w", "L'nT,w", "Ctr"],
        unsupported: ["Ln,w+CI", "DeltaLw", "L'nT,50"],
        cards: {
          Rw: { status: "live", value: "57 dB" },
          "R'w": { status: "live", value: "57 dB" },
          "Dn,w": { status: "live", value: "56 dB" },
          "Dn,A": { status: "live", value: "55.3 dB" },
          "DnT,w": { status: "live", value: "59 dB" },
          "DnT,A": { status: "live", value: "57.8 dB" },
          "Ln,w": { status: "live", value: "72.7 dB" },
          "Ln,w+CI": { status: "unsupported", value: "Not ready" },
          DeltaLw: { status: "unsupported", value: "Not ready" },
          "L'n,w": { status: "live", value: "75.7 dB" },
          "L'nT,w": { status: "live", value: "72.9 dB" },
          "L'nT,50": { status: "unsupported", value: "Not ready" },
          Ctr: { status: "live", value: "-5.4 dB" }
        }
      }
    }
  },
  {
    id: "raw bare open-web blocked impact representative",
    rows: RAW_BARE_OPEN_WEB_BLOCKED_ROWS,
    expected: {
      lab: {
        origin: expectedOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "screening_mass_law_curve_seed_v3",
          floorSystemMatchId: null,
          impactBasis: null,
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "Ctr"],
        unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
        cards: {
          ...FIELD_OUTPUT_NEEDS_INPUT_CARDS,
          ...FIELD_IMPACT_NEEDS_INPUT_CARDS,
          Rw: { status: "live", value: "72 dB" },
          "Ln,w": { status: "unsupported", value: "Not ready" },
          "Ln,w+CI": { status: "unsupported", value: "Not ready" },
          DeltaLw: { status: "unsupported", value: "Not ready" },
          Ctr: { status: "live", value: "-6.4 dB" }
        }
      },
      field: {
        origin: expectedOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "screening_mass_law_curve_seed_v3",
          floorSystemMatchId: null,
          impactBasis: null,
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["R'w", "Dn,w", "Dn,A", "Ctr"],
        unsupported: ["Rw", "DnT,w", "DnT,A", "Ln,w", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
        cards: {
          ...FIELD_IMPACT_NEEDS_INPUT_CARDS,
          Rw: { status: "unsupported", value: "Not ready" },
          "R'w": { status: "live", value: "70 dB" },
          "Dn,w": { status: "live", value: "69 dB" },
          "Dn,A": { status: "live", value: "67.5 dB" },
          "DnT,w": { status: "needs_input", value: "Not ready" },
          "DnT,A": { status: "needs_input", value: "Not ready" },
          "Ln,w": { status: "unsupported", value: "Not ready" },
          "Ln,w+CI": { status: "unsupported", value: "Not ready" },
          DeltaLw: { status: "unsupported", value: "Not ready" },
          Ctr: { status: "live", value: "-6.2 dB" }
        }
      },
      building: {
        origin: expectedOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "screening_mass_law_curve_seed_v3",
          floorSystemMatchId: null,
          impactBasis: null,
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ctr"],
        unsupported: ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
        cards: {
          Rw: { status: "unsupported", value: "Not ready" },
          "R'w": { status: "live", value: "70 dB" },
          "Dn,w": { status: "live", value: "69 dB" },
          "Dn,A": { status: "live", value: "67.5 dB" },
          "DnT,w": { status: "live", value: "71 dB" },
          "DnT,A": { status: "live", value: "70 dB" },
          "Ln,w": { status: "unsupported", value: "Not ready" },
          "Ln,w+CI": { status: "unsupported", value: "Not ready" },
          DeltaLw: { status: "unsupported", value: "Not ready" },
          "L'n,w": { status: "needs_input", value: "Not ready" },
          "L'nT,w": { status: "needs_input", value: "Not ready" },
          "L'nT,50": { status: "needs_input", value: "Not ready" },
          Ctr: { status: "live", value: "-6.2 dB" }
        }
      }
    }
  }
];

describe("floor field continuation Gate A card matrix", () => {
  it("keeps workbench cards aligned with floor continuation origin and support states", () => {
    for (const testCase of CASES) {
      for (const context of ["lab", "field", "building"] as const) {
        const actual = snapshot(testCase, context);
        const expected = testCase.expected[context];

        expect(actual.origin, `${testCase.id} ${context} origin`).toEqual(expected.origin);
        expect(actual.supported, `${testCase.id} ${context} supported`).toEqual(expected.supported);
        expect(actual.unsupported, `${testCase.id} ${context} unsupported`).toEqual(expected.unsupported);
        expect(actual.cards, `${testCase.id} ${context} cards`).toMatchObject(expected.cards);
      }
    }
  });

  it("surfaces volume-gated DnT cards as needs-input before building context makes them live", () => {
    for (const testCase of CASES) {
      const fieldCards = snapshot(testCase, "field").cards;
      const buildingCards = snapshot(testCase, "building").cards;

      expect(fieldCards["DnT,w"]?.status, `${testCase.id} field DnT,w`).toBe("needs_input");
      expect(fieldCards["DnT,A"]?.status, `${testCase.id} field DnT,A`).toBe("needs_input");

      if (buildingCards["DnT,w"]?.value !== "Not ready") {
        expect(buildingCards["DnT,w"]?.status, `${testCase.id} building DnT,w`).toBe("live");
        expect(buildingCards["DnT,A"]?.status, `${testCase.id} building DnT,A`).toBe("live");
      }
    }
  });
});
