import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bv";

export const POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_LANDED_GATE =
  "post_v1_floor_or_wall_next_formula_gap_gate_e_plan";

export const POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_SELECTION_STATUS =
  "post_v1_floor_or_wall_next_formula_gap_gate_e_landed_selected_gate_f_floor_astm_iic_aiic_contour_runtime";

export const POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_SELECTED_NEXT_ACTION =
  "post_v1_floor_astm_iic_aiic_contour_rating_gate_f_plan";

export const POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-astm-iic-aiic-contour-rating-gate-f-contract.test.ts";

export const POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_SELECTED_NEXT_LABEL =
  "floor ASTM IIC/AIIC exact-band contour runtime";

export type PostV1FormulaGapCandidateId =
  | "astm_iic_aiic_exact_band_contour_runtime"
  | "floor_formula_expansion"
  | "iso_12354_1_wall_building_prediction"
  | "iso_12354_2_floor_field_building_impact"
  | "ui_ergonomics_only";

export type PostV1FormulaGapCandidate = {
  readonly broadSourceCrawl: boolean;
  readonly directCalculationCapacityGain: boolean;
  readonly id: PostV1FormulaGapCandidateId;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
};

export type PostV1FormulaGapGateEContract = {
  readonly landedGate: typeof POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_LANDED_GATE;
  readonly previousAstmScaffold: {
    readonly landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_LANDED_GATE;
    readonly selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTION_STATUS;
  };
  readonly rankedCandidates: readonly PostV1FormulaGapCandidate[];
  readonly selectedNextAction: typeof POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_SELECTION_STATUS;
};

const RANKED_CANDIDATES = [
  {
    broadSourceCrawl: false,
    directCalculationCapacityGain: true,
    id: "astm_iic_aiic_exact_band_contour_runtime",
    reason:
      "Gate 0 ranked ASTM IIC/AIIC next after wall generalized formula and compatible anchor-delta; the old Gate BV scaffold already owns the curve grid and leaves the executable contour runtime as the narrow blocker.",
    score: 4.6,
    selected: true
  },
  {
    broadSourceCrawl: false,
    directCalculationCapacityGain: true,
    id: "floor_formula_expansion",
    reason:
      "Floor formula expansion is still high-ROI, but it is broader than the ASTM exact-band runtime and should follow after the ready scaffold is converted into calculated outputs.",
    score: 3.8,
    selected: false
  },
  {
    broadSourceCrawl: false,
    directCalculationCapacityGain: true,
    id: "iso_12354_2_floor_field_building_impact",
    reason:
      "Floor field/building impact expansion needs more physical context owners than the ASTM exact-band bridge and is not the immediate smallest useful runtime move.",
    score: 3.2,
    selected: false
  },
  {
    broadSourceCrawl: false,
    directCalculationCapacityGain: true,
    id: "iso_12354_1_wall_building_prediction",
    reason:
      "Wall building prediction remains valuable but requires flanking/junction ownership and must not precede the ready exact impact-rating owner.",
    score: 2.7,
    selected: false
  },
  {
    broadSourceCrawl: false,
    directCalculationCapacityGain: false,
    id: "ui_ergonomics_only",
    reason:
      "UI ergonomics can improve operation, but this gate must increase calculation coverage and correctness first.",
    score: 0.8,
    selected: false
  }
] as const satisfies readonly PostV1FormulaGapCandidate[];

export function buildPostV1FormulaGapGateEContract(): PostV1FormulaGapGateEContract {
  return {
    landedGate: POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_LANDED_GATE,
    previousAstmScaffold: {
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_LANDED_GATE,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTION_STATUS
    },
    rankedCandidates: RANKED_CANDIDATES,
    selectedNextAction: POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_SELECTION_STATUS
  };
}
