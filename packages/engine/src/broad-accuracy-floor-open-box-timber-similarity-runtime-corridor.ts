import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTION_STATUS
} from "./broad-accuracy-floor-open-box-timber-similarity-formula-corridor";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_LANDED_GATE =
  "broad_accuracy_floor_open_box_timber_similarity_runtime_corridor_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTION_STATUS =
  "broad_accuracy_floor_open_box_timber_similarity_runtime_corridor_landed_selected_surface_parity";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_box_timber_similarity_surface_parity_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-surface-parity-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_LABEL =
  "floor open-box timber similarity surface parity";

export type BroadAccuracyFloorOpenBoxTimberRuntimeScenario = {
  readonly anchorSourceIds: readonly string[];
  readonly expectedAirborne: {
    readonly Rw: number;
    readonly RwPlusC: number;
  };
  readonly expectedImpact: {
    readonly CI: number;
    readonly CI50_2500: number;
    readonly LnW: number;
    readonly LnWPlusCI: number;
    readonly basis: typeof OPEN_BOX_TIMBER_SIMILARITY_BASIS;
  };
  readonly id: string;
  readonly packageId: string;
  readonly requiredInputs: readonly string[];
};

export type BroadAccuracyFloorOpenBoxTimberRuntimeCorridorContract = {
  readonly basis: typeof OPEN_BOX_TIMBER_SIMILARITY_BASIS;
  readonly exactRowsStayFirst: true;
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_LANDED_GATE;
  readonly negativeBoundaries: readonly string[];
  readonly previousFormulaCorridor: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTION_STATUS;
  };
  readonly runtimeMovementThisGate: true;
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTION_STATUS;
  readonly supportedScenarios: readonly BroadAccuracyFloorOpenBoxTimberRuntimeScenario[];
};

export function buildBroadAccuracyFloorOpenBoxTimberSimilarityRuntimeCorridorContract():
  BroadAccuracyFloorOpenBoxTimberRuntimeCorridorContract {
  return {
    basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
    exactRowsStayFirst: true,
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_LANDED_GATE,
    negativeBoundaries: [
      "exact_tuas_rows_must_return_open_measured_floor_system_exact_match_before_formula_runtime",
      "raw_bare_open_box_timber_must_not_promote_impact_without_finish_and_lower_treatment",
      "partial_laminate_eps_finish_must_not_promote_formula_runtime",
      "eps_screed_or_hybrid_upper_packets_remain_exact_only_until_fragmented_equivalence_policy_lands",
      "mixed_staged_upper_packets_remain_blocked_without_predictor_owned_rows",
      "open_web_steel_and_other_support_families_must_not_borrow_tuas_open_box_rows",
      "field_building_and_astm_iic_outputs_remain_unpromoted_by_this_lab_runtime_corridor"
    ],
    previousFormulaCorridor: {
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTION_STATUS
    },
    runtimeMovementThisGate: true,
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTION_STATUS,
    supportedScenarios: [
      {
        anchorSourceIds: [
          "tuas_r3a_open_box_timber_measured_2026",
          "tuas_r3b_open_box_timber_measured_2026",
          "tuas_r5a_open_box_timber_measured_2026",
          "tuas_r5b_open_box_timber_measured_2026"
        ],
        expectedAirborne: { Rw: 66, RwPlusC: 62.1 },
        expectedImpact: {
          CI: 1.3,
          CI50_2500: 3.3,
          LnW: 50.8,
          LnWPlusCI: 52,
          basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
        },
        id: "source_absent_dry_gypsum_fiber_upper_mid_packet",
        packageId: "dry_gypsum_fiber_upper",
        requiredInputs: [
          "open_box_timber_slab_370mm",
          "laminate_flooring_8mm",
          "eps_underlay_3mm",
          "generic_fill_13_to_55mm",
          "dry_floating_gypsum_fiberboard_30_to_65mm",
          "tuas_open_box_lower_family_a_or_b"
        ]
      },
      {
        anchorSourceIds: [
          "tuas_r2a_open_box_timber_measured_2026",
          "tuas_r2b_open_box_timber_measured_2026"
        ],
        expectedAirborne: { Rw: 55.5, RwPlusC: 52.3 },
        expectedImpact: {
          CI: 1.5,
          CI50_2500: 3.5,
          LnW: 53.5,
          LnWPlusCI: 55,
          basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
        },
        id: "source_absent_thin_laminate_eps_no_upper_packet",
        packageId: "thin_laminate_eps_no_upper",
        requiredInputs: [
          "open_box_timber_slab_370mm",
          "laminate_flooring_8mm",
          "eps_underlay_3mm",
          "tuas_open_box_lower_family_a_or_b"
        ]
      },
      {
        anchorSourceIds: [
          "tuas_r6a_open_box_timber_measured_2026",
          "tuas_r6b_open_box_timber_measured_2026"
        ],
        expectedAirborne: { Rw: 63.5, RwPlusC: 61.6 },
        expectedImpact: {
          CI: 0.5,
          CI50_2500: 2,
          LnW: 53.5,
          LnWPlusCI: 54,
          basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
        },
        id: "source_absent_reinforced_ceiling_laminate_packet",
        packageId: "reinforced_ceiling_laminate",
        requiredInputs: [
          "open_box_timber_slab_370mm",
          "laminate_flooring_8mm",
          "eps_underlay_3mm",
          "reinforced_gypsum_lower_board_schedule",
          "lower_cavity_and_100mm_rockwool"
        ]
      }
    ]
  };
}
