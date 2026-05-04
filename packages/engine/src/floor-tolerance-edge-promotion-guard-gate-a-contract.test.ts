import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { FloorRole, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { THICKNESS_TOLERANCE_MM } from "./floor-system-evaluation";
import { buildFloorTestLayersFromCriteria } from "./floor-system-test-layer-builders";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const TARGET_OUTPUTS = [
  "Rw",
  "R'w",
  "DnT,w",
  "Ln,w",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w"
] as const satisfies readonly RequestedOutputId[];

const FIELD_CONTEXT = {
  airborneContext: {
    contextMode: "building_prediction",
    panelHeightMm: 3000,
    panelWidthMm: 4200,
    receivingRoomRt60S: 0.7,
    receivingRoomVolumeM3: 55
  },
  impactFieldContext: {
    fieldKDb: 3,
    receivingRoomVolumeM3: 60
  }
} as const;

const FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_inventory_exact_floor_tolerance_edges_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "gate_b_no_runtime_closeout_and_next_slice_selection",
  selectedNextFile: "packages/engine/src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts",
  selectionStatus:
    "floor_tolerance_edge_inventory_landed_no_runtime_selected_closeout_next_slice_selection",
  sliceId: "floor_tolerance_edge_promotion_guard_v1",
  supportPromotion: false,
  warningCopyChange: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-04_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_GATE_A_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const ROLE_TAGGED_EXACT_FLOOR_TOLERANCE_EDGE_INVENTORY = {
  boundFloorRows: 23,
  boundRowsWithNumericThicknessCriteria: 23,
  exactFloorRows: 173,
  manualExactRows: 167,
  manualExactRowsWithNumericThicknessCriteria: 167,
  protectedBoundRepresentatives: [
    "ubiq_fl33_open_web_steel_300_lab_2026",
    "ubiq_fl32_steel_300_lab_2026"
  ],
  protectedExactRepresentatives: [
    "tuas_x3_clt140_measured_2026",
    "tuas_r5b_open_box_timber_measured_2026",
    "ubiq_fl28_open_web_steel_200_exact_lab_2026"
  ],
  promotedPath: "none_gate_a_inventory_only",
  thicknessToleranceMm: 2
} as const;

const BOUND_FLOOR_NEAR_MISS_AND_EXACT_DROP_SNAPSHOT_MATRIX = [
  {
    outsideDeltaMm: 2.1,
    protectedExpectedDrop: "exact_floor_match_drops_to_family_general_estimate",
    representativeId: "tuas_x3_clt140_measured_2026",
    role: "base_structure",
    toleratedDeltaMm: 2
  },
  {
    outsideDeltaMm: 2.1,
    protectedExpectedDrop: "bound_floor_match_drops_to_bound_interpolation_estimate",
    representativeId: "ubiq_fl33_open_web_steel_300_lab_2026",
    role: "base_structure",
    toleratedDeltaMm: 2
  }
] as const;

const VISIBLE_EXACT_BOUND_SCREENING_SUPPORT_WORDING_REQUIREMENTS = [
  "visible_support_wording_must_distinguish_exact_bound_and_screening_floor_outputs",
  "exact_floor_match_wording_must_say_curated_exact_floor_system_match_active",
  "bound_floor_match_wording_must_say_impact_stays_conservative_upper_bound",
  "just_outside_bound_wording_must_say_family_estimate_not_exact_bound_row",
  "field_output_leakage_policy_required_before_rprime_dnt_lprime_copy"
] as const;

const NEXT_GUARD_OR_CLOSEOUT_DECISION_BEFORE_ANY_FLOOR_SUPPORT_PROMOTION = {
  reason:
    "gate_a_pins_exact_and_bound_floor_thickness_edges_raw_role_negatives_and_visible_wording_requirements_without_finding_a_safe_support_promotion",
  selectedNextAction: FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_A.selectedNextAction,
  selectedNextFile: FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_A.selectedNextFile,
  selectedStatus: FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_A.selectionStatus
} as const;

type FloorEdgeSnapshot = {
  boundId: string | null;
  estimateKind: string | null;
  floorRw: number | null;
  impactBasis: string | null;
  lnW: number | null;
  lowerBoundBasis: string | null;
  matchId: string | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function exactSystem(id: string): (typeof EXACT_FLOOR_SYSTEMS)[number] {
  const system = EXACT_FLOOR_SYSTEMS.find((entry) => entry.id === id);
  if (!system) {
    throw new Error(`Missing exact floor system ${id}`);
  }

  return system;
}

function boundSystem(id: string): (typeof BOUND_FLOOR_SYSTEMS)[number] {
  const system = BOUND_FLOOR_SYSTEMS.find((entry) => entry.id === id);
  if (!system) {
    throw new Error(`Missing bound floor system ${id}`);
  }

  return system;
}

function buildExactLayers(id: string, mode: "raw" | "tagged" = "tagged"): LayerInput[] {
  return buildFloorTestLayersFromCriteria(exactSystem(id).match, mode);
}

function buildBoundLayers(id: string): LayerInput[] {
  return buildFloorTestLayersFromCriteria(boundSystem(id).match, "tagged");
}

function mutateFirstRoleThickness(layers: readonly LayerInput[], role: FloorRole, deltaMm: number): LayerInput[] {
  let mutated = false;

  return layers.map((layer) => {
    if (!mutated && layer.floorRole === role) {
      mutated = true;
      return { ...layer, thicknessMm: layer.thicknessMm + deltaMm };
    }

    return { ...layer };
  });
}

function snapshot(layers: readonly LayerInput[]): FloorEdgeSnapshot {
  const result = calculateAssembly(layers, { targetOutputs: TARGET_OUTPUTS });

  return {
    boundId: result.boundFloorSystemMatch?.system.id ?? null,
    estimateKind: result.floorSystemEstimate?.kind ?? result.boundFloorSystemEstimate?.kind ?? null,
    floorRw: result.floorSystemRatings?.Rw ?? result.floorCarrier?.Rw ?? null,
    impactBasis: result.impact?.basis ?? null,
    lnW: result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound ?? null,
    lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
    matchId: result.floorSystemMatch?.system.id ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

function warningsFor(layers: readonly LayerInput[], withFieldContext = false): readonly string[] {
  return calculateAssembly(layers, {
    ...(withFieldContext ? FIELD_CONTEXT : {}),
    targetOutputs: TARGET_OUTPUTS
  }).warnings;
}

function warningsContain(warnings: readonly string[], pattern: RegExp): boolean {
  return warnings.some((warning) => pattern.test(warning));
}

function hasNumericThicknessCriteria(system: (typeof EXACT_FLOOR_SYSTEMS)[number] | (typeof BOUND_FLOOR_SYSTEMS)[number]): boolean {
  const criteria = [
    system.match.baseStructure,
    system.match.ceilingBoard,
    system.match.ceilingCavity,
    system.match.ceilingFill,
    system.match.floatingScreed,
    system.match.floorCovering,
    system.match.resilientLayer,
    system.match.upperFill
  ];

  return criteria.some(
    (entry) =>
      typeof entry?.thicknessMm === "number" ||
      (Array.isArray(entry?.thicknessScheduleMm) && entry.thicknessScheduleMm.length > 0)
  );
}

describe("floor tolerance-edge promotion guard Gate A contract", () => {
  it("lands Gate A without runtime or visible surface movement", () => {
    expect(FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_inventory_exact_floor_tolerance_edges_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedNextAction: "gate_b_no_runtime_closeout_and_next_slice_selection",
      selectedNextFile: "packages/engine/src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts",
      selectionStatus:
        "floor_tolerance_edge_inventory_landed_no_runtime_selected_closeout_next_slice_selection",
      sliceId: "floor_tolerance_edge_promotion_guard_v1",
      supportPromotion: false,
      warningCopyChange: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("inventories role-tagged exact and bound floor rows that use thickness tolerance checks", () => {
    const manualExactRows = EXACT_FLOOR_SYSTEMS.filter((system) => system.manualMatch !== false);

    expect(ROLE_TAGGED_EXACT_FLOOR_TOLERANCE_EDGE_INVENTORY).toEqual({
      boundFloorRows: BOUND_FLOOR_SYSTEMS.length,
      boundRowsWithNumericThicknessCriteria: BOUND_FLOOR_SYSTEMS.filter(hasNumericThicknessCriteria).length,
      exactFloorRows: EXACT_FLOOR_SYSTEMS.length,
      manualExactRows: manualExactRows.length,
      manualExactRowsWithNumericThicknessCriteria: manualExactRows.filter(hasNumericThicknessCriteria).length,
      protectedBoundRepresentatives: [
        "ubiq_fl33_open_web_steel_300_lab_2026",
        "ubiq_fl32_steel_300_lab_2026"
      ],
      protectedExactRepresentatives: [
        "tuas_x3_clt140_measured_2026",
        "tuas_r5b_open_box_timber_measured_2026",
        "ubiq_fl28_open_web_steel_200_exact_lab_2026"
      ],
      promotedPath: "none_gate_a_inventory_only",
      thicknessToleranceMm: THICKNESS_TOLERANCE_MM
    });
  });

  it("pins just-inside and just-outside thickness corridors for exact and bound floor rows", () => {
    expect(BOUND_FLOOR_NEAR_MISS_AND_EXACT_DROP_SNAPSHOT_MATRIX).toEqual([
      {
        outsideDeltaMm: 2.1,
        protectedExpectedDrop: "exact_floor_match_drops_to_family_general_estimate",
        representativeId: "tuas_x3_clt140_measured_2026",
        role: "base_structure",
        toleratedDeltaMm: THICKNESS_TOLERANCE_MM
      },
      {
        outsideDeltaMm: 2.1,
        protectedExpectedDrop: "bound_floor_match_drops_to_bound_interpolation_estimate",
        representativeId: "ubiq_fl33_open_web_steel_300_lab_2026",
        role: "base_structure",
        toleratedDeltaMm: THICKNESS_TOLERANCE_MM
      }
    ]);

    const exactLayers = buildExactLayers("tuas_x3_clt140_measured_2026");
    const exactInside = snapshot(mutateFirstRoleThickness(exactLayers, "base_structure", THICKNESS_TOLERANCE_MM));
    const exactOutside = snapshot(mutateFirstRoleThickness(exactLayers, "base_structure", THICKNESS_TOLERANCE_MM + 0.1));

    expect(exactInside).toMatchObject({
      estimateKind: null,
      floorRw: 49,
      impactBasis: "open_measured_floor_system_exact_match",
      lnW: 52,
      matchId: "tuas_x3_clt140_measured_2026"
    });
    expect(exactOutside).toMatchObject({
      boundId: null,
      estimateKind: "family_general",
      floorRw: 51.7,
      impactBasis: "predictor_floor_system_family_general_estimate",
      lnW: 49.5,
      matchId: null
    });

    const boundLayers = buildBoundLayers("ubiq_fl33_open_web_steel_300_lab_2026");
    const boundInside = snapshot(mutateFirstRoleThickness(boundLayers, "base_structure", THICKNESS_TOLERANCE_MM));
    const boundOutside = snapshot(mutateFirstRoleThickness(boundLayers, "base_structure", THICKNESS_TOLERANCE_MM + 0.1));

    expect(boundInside).toMatchObject({
      boundId: "ubiq_fl33_open_web_steel_300_lab_2026",
      estimateKind: null,
      floorRw: 63,
      lnW: 51,
      lowerBoundBasis: "official_floor_system_bound_support",
      matchId: null
    });
    expect(boundOutside).toMatchObject({
      boundId: null,
      estimateKind: "bound_interpolation",
      floorRw: 63,
      lnW: 51,
      lowerBoundBasis: "predictor_lightweight_steel_bound_interpolation_estimate",
      matchId: null
    });
  });

  it("keeps raw role prompt, duplicate role, and hostile input negative boundaries active", () => {
    const rawDrift = calculateAssembly(buildExactLayers("tuas_x4_clt140_measured_2026", "raw"), {
      targetOutputs: TARGET_OUTPUTS
    });

    expect(rawDrift.floorSystemMatch ?? null).toBeNull();
    expect(rawDrift.impact ?? null).toBeNull();
    expect(rawDrift.supportedTargetOutputs).toEqual(["Rw"]);
    expect(rawDrift.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w"]);
    expect(warningsContain(rawDrift.warnings, /Floor roles needed before impact output promotion/i)).toBe(true);

    const duplicateRaw = calculateAssembly(buildExactLayers("tuas_r7b_open_box_timber_measured_2026", "raw"), {
      targetOutputs: TARGET_OUTPUTS
    });

    expect(duplicateRaw.floorSystemMatch ?? null).toBeNull();
    expect(duplicateRaw.floorSystemEstimate?.kind).toBe("family_general");
    expect(warningsContain(duplicateRaw.warnings, /single-entry floor roles are duplicated/i)).toBe(true);
    expect(warningsContain(duplicateRaw.warnings, /Floor roles needed before exact floor-family promotion/i)).toBe(true);

    const hostile = calculateAssembly(
      [{ materialId: "unknown_floor_tolerance_edge_probe", thicknessMm: Number.POSITIVE_INFINITY }],
      { targetOutputs: TARGET_OUTPUTS }
    );

    expect(hostile.floorSystemMatch ?? null).toBeNull();
    expect(hostile.boundFloorSystemMatch ?? null).toBeNull();
    expect(hostile.supportedTargetOutputs).toEqual([]);
    expect(hostile.unsupportedTargetOutputs).toEqual(TARGET_OUTPUTS);
    expect(warningsContain(hostile.warnings, /invalid|unknown|finite|thickness/i)).toBe(true);
  });

  it("requires visible wording to distinguish exact, bound, and screening floor outputs", () => {
    expect(VISIBLE_EXACT_BOUND_SCREENING_SUPPORT_WORDING_REQUIREMENTS).toEqual([
      "visible_support_wording_must_distinguish_exact_bound_and_screening_floor_outputs",
      "exact_floor_match_wording_must_say_curated_exact_floor_system_match_active",
      "bound_floor_match_wording_must_say_impact_stays_conservative_upper_bound",
      "just_outside_bound_wording_must_say_family_estimate_not_exact_bound_row",
      "field_output_leakage_policy_required_before_rprime_dnt_lprime_copy"
    ]);

    const exactWarnings = warningsFor(buildExactLayers("tuas_x3_clt140_measured_2026"), true);
    expect(warningsContain(exactWarnings, /Curated exact floor-system match active/i)).toBe(true);
    expect(warningsContain(exactWarnings, /Live field-side supplement is active/i)).toBe(true);

    const boundLayers = buildBoundLayers("ubiq_fl33_open_web_steel_300_lab_2026");
    const boundWarnings = warningsFor(boundLayers, true);
    expect(warningsContain(boundWarnings, /Curated bound-only floor-system match active/i)).toBe(true);
    expect(warningsContain(boundWarnings, /impact stays conservative as an upper-bound lane/i)).toBe(true);
    expect(warningsContain(boundWarnings, /without fabricating an exact Ln,w/i)).toBe(true);

    const justOutsideBoundWarnings = warningsFor(
      mutateFirstRoleThickness(boundLayers, "base_structure", THICKNESS_TOLERANCE_MM + 0.1),
      true
    );
    expect(warningsContain(justOutsideBoundWarnings, /Published bound-only family estimate active/i)).toBe(true);
    expect(warningsContain(justOutsideBoundWarnings, /without fabricating an exact Ln,w value/i)).toBe(true);
  });

  it("selects no-runtime closeout before any floor support promotion", () => {
    expect(NEXT_GUARD_OR_CLOSEOUT_DECISION_BEFORE_ANY_FLOOR_SUPPORT_PROMOTION).toEqual({
      reason:
        "gate_a_pins_exact_and_bound_floor_thickness_edges_raw_role_negatives_and_visible_wording_requirements_without_finding_a_safe_support_promotion",
      selectedNextAction: "gate_b_no_runtime_closeout_and_next_slice_selection",
      selectedNextFile: "packages/engine/src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts",
      selectedStatus:
        "floor_tolerance_edge_inventory_landed_no_runtime_selected_closeout_next_slice_selection"
    });
  });

  it("keeps active docs aligned on floor tolerance edges and original rockwool posture", () => {
    const docs = REQUIRED_PLANNING_SURFACES.map(readRepoFile);

    for (const doc of docs) {
      expect(doc).toContain(FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_A.selectionStatus);
      expect(doc).toContain(FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_A.selectedNextFile);
      expect(doc).toContain(FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_A.selectedNextAction);
      expect(doc).toContain("role_tagged_exact_floor_tolerance_edge_inventory");
      expect(doc).toContain("bound_floor_near_miss_and_exact_drop_snapshot_matrix");
      expect(doc).toContain("just_inside_just_outside_thickness_corridor_tests");
      expect(doc).toContain("raw_role_prompt_and_duplicate_role_negative_boundaries");
      expect(doc).toContain("visible_exact_bound_screening_support_wording_requirements");
      expect(doc).toContain("next_guard_or_closeout_decision_before_any_floor_support_promotion");
      expect(doc).toContain("standing_lane_misclassification_monitoring_mandate");
      expect(doc).toContain("note_test_document_or_easy_fix");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("multileaf_screening_blend_fail_closed_until_grouped_topology");
      expect(doc).toContain("raw_floor_role_inference");
      expect(doc).toContain("arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed");
    }
  });
});
