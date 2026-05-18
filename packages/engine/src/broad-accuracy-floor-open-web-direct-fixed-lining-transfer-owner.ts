import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { ExactFloorSystem } from "@dynecho/shared";

import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTION_STATUS
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-surface-parity";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_LANDED_GATE =
  "broad_accuracy_floor_open_web_direct_fixed_lining_transfer_owner_contract_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTION_STATUS =
  "broad_accuracy_floor_open_web_direct_fixed_lining_transfer_owner_landed_no_runtime_selected_formula_corridor";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_web_direct_fixed_lining_formula_corridor_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-formula-corridor-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_LABEL =
  "floor open-web direct-fixed lining formula corridor";

export type BroadAccuracyFloorOpenWebDirectFixedFamilyId = "fl23" | "fl25" | "fl27";

export type BroadAccuracyFloorOpenWebDirectFixedOwnerTermId =
  | "airborne_rw_mass_bridge_owner"
  | "carrier_geometry_owner"
  | "deck_panel_mass_owner"
  | "direct_lining_attachment_owner"
  | "exact_precedence_owner"
  | "impact_ci_semantics_owner"
  | "impact_lnw_transfer_owner"
  | "negative_boundary_owner"
  | "source_absent_budget_owner"
  | "upper_finish_delta_owner";

export type BroadAccuracyFloorOpenWebDirectFixedOwnerTerm = {
  id: BroadAccuracyFloorOpenWebDirectFixedOwnerTermId;
  requiredFields: readonly string[];
  runtimePromotionRole: string;
  status: "owned_for_formula_corridor" | "owned_for_negative_boundary";
};

export type BroadAccuracyFloorOpenWebDirectFixedFamilyPacket = {
  boardSchedule: "2x13" | "2x16" | "3x16";
  carrierDepthsMm: readonly number[];
  ciRange: readonly [number, number];
  deckThicknessesMm: readonly number[];
  exactRows: number;
  familyEstimateEligibleRows: number;
  familyId: BroadAccuracyFloorOpenWebDirectFixedFamilyId;
  finishPackages: readonly string[];
  lnWPlusCiRange: readonly [number, number];
  lnWRange: readonly [number, number];
  rwCtrRange: readonly [number, number];
  rwRange: readonly [number, number];
};

export type BroadAccuracyFloorOpenWebDirectFixedTransferOwnerContract = {
  blockedRuntimeBoundaries: readonly {
    id:
      | "astm_iic_aiic_alias_boundary"
      | "field_building_alias_boundary"
      | "open_box_timber_wrong_support_family"
      | "resilient_suspended_ceiling_wrong_lower_support";
    reason: string;
  }[];
  directFixedInventory: {
    carrierDepthsMm: readonly [200, 300, 400];
    deckThicknessesMm: readonly [16, 19];
    exactRows: number;
    familyEstimateEligibleRows: number;
    familyIds: readonly BroadAccuracyFloorOpenWebDirectFixedFamilyId[];
    finishPackages: readonly ["bare", "engineered_timber_with_acoustic_underlay", "carpet_with_foam_underlay"];
    lowerSupportClass: "direct_to_joists";
    supportForm: "open_web_or_rolled";
    supportMaterial: "open_web_steel_floor";
  };
  familyPackets: readonly BroadAccuracyFloorOpenWebDirectFixedFamilyPacket[];
  landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_LANDED_GATE;
  noRuntimeValueMovement: true;
  ownerTerms: readonly BroadAccuracyFloorOpenWebDirectFixedOwnerTerm[];
  previousSurfaceParity: {
    landedGate: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_LANDED_GATE;
    selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTED_NEXT_FILE;
    selectionStatus: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTION_STATUS;
  };
  runtimePromotionRequirements: readonly string[];
  selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_LABEL;
  selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTION_STATUS;
};

function isOpenWebSteelDirectFixed(system: ExactFloorSystem): boolean {
  return (
    system.match.baseStructure?.materialIds?.includes("open_web_steel_floor") === true &&
    system.estimateMatch?.lowerTreatment?.type === "direct_fixed_ceiling"
  );
}

function getFamilyId(system: ExactFloorSystem): BroadAccuracyFloorOpenWebDirectFixedFamilyId {
  const family = /^ubiq_(fl23|fl25|fl27)_/u.exec(system.id)?.[1];

  if (family === "fl23" || family === "fl25" || family === "fl27") {
    return family;
  }

  throw new Error(`Unexpected direct-fixed open-web family id for ${system.id}`);
}

function getFinishPackage(system: ExactFloorSystem):
  "bare" | "carpet_with_foam_underlay" | "engineered_timber_with_acoustic_underlay" {
  const finish = system.match.floorCovering?.materialIds?.[0];

  if (finish === "carpet_with_foam_underlay" || finish === "engineered_timber_with_acoustic_underlay") {
    return finish;
  }

  return "bare";
}

function numericRange(values: readonly number[]): readonly [number, number] {
  return [Math.min(...values), Math.max(...values)] as const;
}

function uniqueSortedNumbers(values: readonly number[]): readonly number[] {
  return [...new Set(values)].sort((a, b) => a - b);
}

function uniqueSortedStrings<T extends string>(values: readonly T[]): readonly T[] {
  return [...new Set(values)].sort();
}

function buildDirectFixedRows(): readonly ExactFloorSystem[] {
  return EXACT_FLOOR_SYSTEMS.filter(isOpenWebSteelDirectFixed);
}

export function buildBroadAccuracyFloorOpenWebDirectFixedFamilyPackets(
  rows: readonly ExactFloorSystem[] = buildDirectFixedRows()
): readonly BroadAccuracyFloorOpenWebDirectFixedFamilyPacket[] {
  return (["fl23", "fl25", "fl27"] as const).map((familyId) => {
    const familyRows = rows.filter((row) => getFamilyId(row) === familyId);
    const boardSchedules = uniqueSortedStrings(
      familyRows.map((row) => {
        const board = row.match.ceilingBoard;
        return `${String(board?.layerCount ?? 0)}x${String(board?.thicknessMm ?? 0)}` as
          | "2x13"
          | "2x16"
          | "3x16";
      })
    );

    if (boardSchedules.length !== 1) {
      throw new Error(`Unexpected board schedules for ${familyId}: ${boardSchedules.join(", ")}`);
    }
    const boardSchedule = boardSchedules[0];
    if (!boardSchedule) {
      throw new Error(`Missing board schedule for ${familyId}`);
    }

    return {
      boardSchedule,
      carrierDepthsMm: uniqueSortedNumbers(familyRows.map((row) => row.match.baseStructure?.thicknessMm ?? 0)),
      ciRange: numericRange(familyRows.map((row) => row.impactRatings?.CI ?? 0)),
      deckThicknessesMm: uniqueSortedNumbers(familyRows.map((row) => row.match.floatingScreed?.thicknessMm ?? 0)),
      exactRows: familyRows.length,
      familyEstimateEligibleRows: familyRows.filter((row) => row.familyEstimateEligible !== false).length,
      familyId,
      finishPackages: uniqueSortedStrings(familyRows.map(getFinishPackage)),
      lnWPlusCiRange: numericRange(familyRows.map((row) => row.impactRatings?.LnWPlusCI ?? 0)),
      lnWRange: numericRange(familyRows.map((row) => row.impactRatings?.LnW ?? 0)),
      rwCtrRange: numericRange(familyRows.map((row) => row.airborneRatings?.RwCtr ?? 0)),
      rwRange: numericRange(familyRows.map((row) => row.airborneRatings?.Rw ?? 0))
    };
  });
}

export function buildBroadAccuracyFloorOpenWebDirectFixedTransferOwnerContract():
  BroadAccuracyFloorOpenWebDirectFixedTransferOwnerContract {
  const directFixedRows = buildDirectFixedRows();

  return {
    blockedRuntimeBoundaries: [
      {
        id: "resilient_suspended_ceiling_wrong_lower_support",
        reason:
          "elastic suspended-ceiling FL-24/FL-26 rows cannot transfer to direct-fixed linings without a direct-coupling loss term"
      },
      {
        id: "open_box_timber_wrong_support_family",
        reason: "open-box timber remains a separate support-family lane and cannot calibrate open-web steel transfer"
      },
      {
        id: "field_building_alias_boundary",
        reason: "lab Ln,w/Rw direct-fixed rows cannot become field or building impact outputs without separate owners"
      },
      {
        id: "astm_iic_aiic_alias_boundary",
        reason: "ISO lab Ln,w/CI rows cannot be relabelled as ASTM IIC or AIIC"
      }
    ],
    directFixedInventory: {
      carrierDepthsMm: [200, 300, 400],
      deckThicknessesMm: [16, 19],
      exactRows: directFixedRows.length,
      familyEstimateEligibleRows: directFixedRows.filter((row) => row.familyEstimateEligible !== false).length,
      familyIds: ["fl23", "fl25", "fl27"],
      finishPackages: ["bare", "engineered_timber_with_acoustic_underlay", "carpet_with_foam_underlay"],
      lowerSupportClass: "direct_to_joists",
      supportForm: "open_web_or_rolled",
      supportMaterial: "open_web_steel_floor"
    },
    familyPackets: buildBroadAccuracyFloorOpenWebDirectFixedFamilyPackets(directFixedRows),
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_LANDED_GATE,
    noRuntimeValueMovement: true,
    ownerTerms: [
      {
        id: "carrier_geometry_owner",
        requiredFields: ["supportForm", "carrierDepthMm", "carrierSpacingMm"],
        runtimePromotionRole: "interpolate open-web depth and keep steel support form explicit",
        status: "owned_for_formula_corridor"
      },
      {
        id: "deck_panel_mass_owner",
        requiredFields: ["floatingScreed.materialClass", "floatingScreed.thicknessMm"],
        runtimePromotionRole: "separate 16 mm and 19 mm INEX deck mass terms",
        status: "owned_for_formula_corridor"
      },
      {
        id: "upper_finish_delta_owner",
        requiredFields: ["floorCovering.mode", "floorCovering.materialClass"],
        runtimePromotionRole: "apply bare, timber-underlay, and carpet finish deltas without mixing bound semantics",
        status: "owned_for_formula_corridor"
      },
      {
        id: "direct_lining_attachment_owner",
        requiredFields: ["lowerTreatment.type", "lowerTreatment.supportClass", "lowerTreatment.boardLayerCount", "lowerTreatment.boardThicknessMm"],
        runtimePromotionRole: "model direct-to-joist board schedules separately from resilient suspended ceilings",
        status: "owned_for_formula_corridor"
      },
      {
        id: "impact_lnw_transfer_owner",
        requiredFields: ["Ln,w", "CI", "Ln,w+CI", "directCouplingPenalty"],
        runtimePromotionRole: "own the direct-fixed impact transfer surface before source-absent runtime",
        status: "owned_for_formula_corridor"
      },
      {
        id: "airborne_rw_mass_bridge_owner",
        requiredFields: ["Rw", "Rw+Ctr", "directLiningBridgePenalty"],
        runtimePromotionRole: "own the direct-fixed airborne bridge term separately from impact",
        status: "owned_for_formula_corridor"
      },
      {
        id: "impact_ci_semantics_owner",
        requiredFields: ["CI", "Ln,w+CI", "metricBasis"],
        runtimePromotionRole: "keep CI and Ln,w+CI as ISO lab metrics and avoid ASTM aliases",
        status: "owned_for_formula_corridor"
      },
      {
        id: "source_absent_budget_owner",
        requiredFields: ["holdoutFamily", "residualThresholdDb", "errorBudgetDb"],
        runtimePromotionRole: "attach a visible source-absent error budget to any formula corridor",
        status: "owned_for_formula_corridor"
      },
      {
        id: "exact_precedence_owner",
        requiredFields: ["sameStackExactSourceId", "metricBasis", "supportFamily"],
        runtimePromotionRole: "keep exact UBIQ direct-fixed rows ahead of source-absent formulas",
        status: "owned_for_negative_boundary"
      },
      {
        id: "negative_boundary_owner",
        requiredFields: ["wrongLowerSupportClass", "wrongSupportFamily", "wrongMetricBasis"],
        runtimePromotionRole: "block resilient ceiling, open-box timber, field/building, and ASTM aliases",
        status: "owned_for_negative_boundary"
      }
    ],
    previousSurfaceParity: {
      landedGate:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_LANDED_GATE,
      selectedNextAction:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectionStatus:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTION_STATUS
    },
    runtimePromotionRequirements: [
      "exact_source_precedence_stays_first",
      "supportForm_open_web_or_rolled_required",
      "lowerTreatment_type_direct_fixed_ceiling_required",
      "direct_to_joists_support_class_required",
      "carrier_depth_interpolation_limited_to_200_400_mm_until_extrapolation_owner_lands",
      "16mm_and_19mm_deck_terms_must_be_separate",
      "bare_timber_underlay_and_carpet_finish_deltas_must_be_explicit",
      "resilient_suspended_ceiling_rows_are_negative_boundaries_not_transfer_anchors",
      "open_box_timber_rows_are_negative_boundaries_not_transfer_anchors",
      "field_building_and_astm_outputs_stay_unsupported_until_separate_metric_owners_land"
    ],
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTION_STATUS
  };
}
