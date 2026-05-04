import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildFloorTestLayersFromCriteria } from "./floor-system-test-layer-builders";
import { maybeInferFloorRoleLayerStack } from "./impact-predictor-input";

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

const FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_inventory_raw_floor_role_inference_guardrail_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "gate_b_design_raw_floor_role_prompt_and_negative_boundary_guard_no_runtime",
  selectedNextFile: "packages/engine/src/floor-raw-role-inference-guardrail-gate-b-design-contract.test.ts",
  selectionStatus:
    "floor_raw_role_inference_inventory_landed_no_runtime_selected_gate_b_prompt_guard_design",
  sliceId: "floor_raw_role_inference_guardrail_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/floor-raw-role-inference-guardrail-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v16-gate-a-contract.test.ts",
  "docs/calculator/SLICE_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_GATE_A_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const CURRENT_RAW_EXACT_DRIFT_IDS = [
  "tuas_x3_clt140_measured_2026",
  "tuas_x4_clt140_measured_2026",
  "tuas_r7b_open_box_timber_measured_2026",
  "tuas_r8b_open_box_timber_measured_2026",
  "tuas_r10a_open_box_timber_measured_2026",
  "tuas_c3_clt260_measured_2026",
  "tuas_c4_clt260_measured_2026",
  "tuas_c5_clt260_measured_2026",
  "tuas_c7_clt260_measured_2026",
  "tuas_c7c_clt260_measured_2026",
  "tuas_c3c_clt260_measured_2026",
  "tuas_c4c_clt260_measured_2026"
] as const;

const ROLE_TAGGED_EXACT_FLOOR_ROW_INVENTORY = {
  exactFloorRows: 173,
  manualExactRows: 167,
  rawInferenceRows: 166,
  rawNoSafeInferenceIds: ["dataholz_gdsnxn01a_timber_frame_lab_2026"],
  rawTaggedDriftIds: CURRENT_RAW_EXACT_DRIFT_IDS,
  boundFloorRows: 23,
  promotedPath: "role_tagged_exact_floor_rows"
} as const;

const RAW_FLOOR_INFERENCE_PROMPT_POLICY = [
  {
    id: "fully_role_tagged_exact_row",
    promptOrGuard:
      "allow_exact_floor_system_match_when_roles_materials_thicknesses_and_tolerance_match_source_row",
    runtimeMovementNow: false
  },
  {
    id: "raw_row_matches_known_exact_snapshot_today",
    promptOrGuard:
      "keep_current_answer_but_do_not_claim_arbitrary_raw_floor_reorder_value_invariance",
    runtimeMovementNow: false
  },
  {
    id: "raw_row_hits_known_raw_tagged_drift_inventory",
    promptOrGuard:
      "prompt_for_floor_roles_before_support_confidence_route_card_or_exact_output_copy_can_promote",
    runtimeMovementNow: false
  },
  {
    id: "duplicate_or_disjoint_single_entry_role",
    promptOrGuard:
      "keep_visible_layer_predictor_matching_parked_and_surface_duplicate_role_warning_before_any_visible_movement",
    runtimeMovementNow: false
  }
] as const;

const NEXT_CLOSEOUT_OR_BOUNDED_RUNTIME_GUARD_DECISION = {
  reason:
    "gate_a_found_current_guards_for_duplicate_roles_but_also_found_12_manual_exact_rows_where_raw_vs_role_tagged_outputs_drift_so_a_runtime_or_visible_fix_needs_gate_b_design_before_movement",
  selectedNextAction: FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_A.selectedNextAction,
  selectedNextFile: FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_A.selectedNextFile,
  selectedStatus: FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_A.selectionStatus
} as const;

type FloorSnapshot = {
  basis: string | null;
  boundId: string | null;
  estimateKind: string | null;
  matchId: string | null;
  lnW: number | null;
  lnWPlusCI: number | null;
  rw: number | null;
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

function buildExactLayers(id: string, mode: "raw" | "tagged"): LayerInput[] {
  return buildFloorTestLayersFromCriteria(exactSystem(id).match, mode);
}

function snapshot(layers: readonly LayerInput[]): FloorSnapshot {
  const result = calculateAssembly(layers, { targetOutputs: TARGET_OUTPUTS });

  return {
    basis: result.impact?.basis ?? result.lowerBoundImpact?.basis ?? null,
    boundId: result.boundFloorSystemMatch?.system.id ?? null,
    estimateKind: result.floorSystemEstimate?.kind ?? result.boundFloorSystemEstimate?.kind ?? null,
    matchId: result.floorSystemMatch?.system.id ?? null,
    lnW: result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? result.lowerBoundImpact?.LnWPlusCIUpperBound ?? null,
    rw: result.floorSystemRatings?.Rw ?? result.metrics.estimatedRwDb,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

function warningIncludes(layers: readonly LayerInput[], pattern: RegExp): boolean {
  return calculateAssembly(layers, { targetOutputs: TARGET_OUTPUTS }).warnings.some((warning: string) =>
    pattern.test(warning)
  );
}

function rawInferenceIds(): string[] {
  return EXACT_FLOOR_SYSTEMS.filter((system) => system.manualMatch !== false)
    .filter((system) => maybeInferFloorRoleLayerStack(buildFloorTestLayersFromCriteria(system.match, "raw")))
    .map((system) => system.id);
}

function rawNoSafeInferenceIds(): string[] {
  return EXACT_FLOOR_SYSTEMS.filter((system) => system.manualMatch !== false)
    .filter((system) => !maybeInferFloorRoleLayerStack(buildFloorTestLayersFromCriteria(system.match, "raw")))
    .map((system) => system.id);
}

function rawTaggedDriftIds(): string[] {
  return EXACT_FLOOR_SYSTEMS.filter((system) => system.manualMatch !== false)
    .filter((system) => maybeInferFloorRoleLayerStack(buildFloorTestLayersFromCriteria(system.match, "raw")))
    .filter((system) => {
      const tagged = snapshot(buildFloorTestLayersFromCriteria(system.match, "tagged"));
      const raw = snapshot(buildFloorTestLayersFromCriteria(system.match, "raw"));

      return JSON.stringify(tagged) !== JSON.stringify(raw);
    })
    .map((system) => system.id);
}

describe("floor raw role inference guardrail Gate A contract", () => {
  it("lands Gate A without runtime or visible surface movement", () => {
    expect(FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_inventory_raw_floor_role_inference_guardrail_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedNextAction: "gate_b_design_raw_floor_role_prompt_and_negative_boundary_guard_no_runtime",
      selectedNextFile: "packages/engine/src/floor-raw-role-inference-guardrail-gate-b-design-contract.test.ts",
      selectionStatus:
        "floor_raw_role_inference_inventory_landed_no_runtime_selected_gate_b_prompt_guard_design",
      sliceId: "floor_raw_role_inference_guardrail_v1",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("inventories role-tagged exact rows and current raw-inference drift boundaries", () => {
    const manualExactRows = EXACT_FLOOR_SYSTEMS.filter((system) => system.manualMatch !== false);

    expect(ROLE_TAGGED_EXACT_FLOOR_ROW_INVENTORY).toEqual({
      exactFloorRows: EXACT_FLOOR_SYSTEMS.length,
      manualExactRows: manualExactRows.length,
      rawInferenceRows: rawInferenceIds().length,
      rawNoSafeInferenceIds: rawNoSafeInferenceIds(),
      rawTaggedDriftIds: rawTaggedDriftIds(),
      boundFloorRows: BOUND_FLOOR_SYSTEMS.length,
      promotedPath: "role_tagged_exact_floor_rows"
    });
    expect(rawTaggedDriftIds()).toEqual([...CURRENT_RAW_EXACT_DRIFT_IDS]);
  });

  it("pins a raw floor inference snapshot matrix with green, drift, and blocked representatives", () => {
    const openBoxTagged = snapshot(buildExactLayers("tuas_r5b_open_box_timber_measured_2026", "tagged"));
    const openBoxRaw = snapshot(buildExactLayers("tuas_r5b_open_box_timber_measured_2026", "raw"));
    const cltTagged = snapshot(buildExactLayers("tuas_x3_clt140_measured_2026", "tagged"));
    const cltRaw = snapshot(buildExactLayers("tuas_x3_clt140_measured_2026", "raw"));
    const noInferenceRaw = snapshot(buildExactLayers("dataholz_gdsnxn01a_timber_frame_lab_2026", "raw"));

    expect(openBoxRaw).toEqual(openBoxTagged);
    expect(openBoxRaw).toMatchObject({
      basis: "open_measured_floor_system_exact_match",
      matchId: "tuas_r5b_open_box_timber_measured_2026",
      lnW: 44,
      rw: 75,
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: ["R'w", "DnT,w", "L'n,w", "L'nT,w"]
    });

    expect(cltTagged).toMatchObject({
      basis: "open_measured_floor_system_exact_match",
      matchId: "tuas_x3_clt140_measured_2026",
      lnW: 52,
      lnWPlusCI: 52,
      rw: 49,
      supported: ["Rw", "Ln,w", "Ln,w+CI"]
    });
    expect(cltRaw).toMatchObject({
      basis: null,
      matchId: null,
      lnW: null,
      rw: 41,
      supported: ["Rw"],
      unsupported: ["R'w", "DnT,w", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w"]
    });
    expect(warningIncludes(buildExactLayers("tuas_x3_clt140_measured_2026", "raw"), /ceiling board x2/i)).toBe(true);

    expect(noInferenceRaw).toMatchObject({
      basis: null,
      matchId: null,
      lnW: null,
      rw: 56,
      supported: ["Rw"]
    });
    expect(maybeInferFloorRoleLayerStack(buildExactLayers("dataholz_gdsnxn01a_timber_frame_lab_2026", "raw"))).toBeNull();
  });

  it("keeps duplicate-role and arbitrary raw-order claims fail-closed", () => {
    const rawDriftLayers = buildExactLayers("tuas_r7b_open_box_timber_measured_2026", "raw");
    const rawDrift = snapshot(rawDriftLayers);
    const taggedExact = snapshot(buildExactLayers("tuas_r7b_open_box_timber_measured_2026", "tagged"));

    expect(taggedExact).toMatchObject({
      basis: "open_measured_floor_system_exact_match",
      matchId: "tuas_r7b_open_box_timber_measured_2026",
      lnW: 47,
      rw: 72
    });
    expect(rawDrift).toMatchObject({
      basis: "predictor_floor_system_family_general_estimate",
      estimateKind: "family_general",
      matchId: null,
      lnW: 49.7,
      rw: 67.1
    });
    expect(warningIncludes(rawDriftLayers, /ceiling cavity x2/i)).toBe(true);
    expect(warningIncludes(rawDriftLayers, /floor covering x2/i)).toBe(true);
    expect(ROLE_TAGGED_EXACT_FLOOR_ROW_INVENTORY.rawTaggedDriftIds).toContain(
      "tuas_r7b_open_box_timber_measured_2026"
    );
    expect(ROLE_TAGGED_EXACT_FLOOR_ROW_INVENTORY.rawTaggedDriftIds.length).toBeGreaterThan(0);
  });

  it("defines missing-role prompt policy before exact floor output promotion", () => {
    expect(RAW_FLOOR_INFERENCE_PROMPT_POLICY).toEqual([
      {
        id: "fully_role_tagged_exact_row",
        promptOrGuard:
          "allow_exact_floor_system_match_when_roles_materials_thicknesses_and_tolerance_match_source_row",
        runtimeMovementNow: false
      },
      {
        id: "raw_row_matches_known_exact_snapshot_today",
        promptOrGuard:
          "keep_current_answer_but_do_not_claim_arbitrary_raw_floor_reorder_value_invariance",
        runtimeMovementNow: false
      },
      {
        id: "raw_row_hits_known_raw_tagged_drift_inventory",
        promptOrGuard:
          "prompt_for_floor_roles_before_support_confidence_route_card_or_exact_output_copy_can_promote",
        runtimeMovementNow: false
      },
      {
        id: "duplicate_or_disjoint_single_entry_role",
        promptOrGuard:
          "keep_visible_layer_predictor_matching_parked_and_surface_duplicate_role_warning_before_any_visible_movement",
        runtimeMovementNow: false
      }
    ]);
  });

  it("selects Gate B design instead of a runtime movement from Gate A", () => {
    expect(NEXT_CLOSEOUT_OR_BOUNDED_RUNTIME_GUARD_DECISION).toEqual({
      reason:
        "gate_a_found_current_guards_for_duplicate_roles_but_also_found_12_manual_exact_rows_where_raw_vs_role_tagged_outputs_drift_so_a_runtime_or_visible_fix_needs_gate_b_design_before_movement",
      selectedNextAction: "gate_b_design_raw_floor_role_prompt_and_negative_boundary_guard_no_runtime",
      selectedNextFile: "packages/engine/src/floor-raw-role-inference-guardrail-gate-b-design-contract.test.ts",
      selectedStatus:
        "floor_raw_role_inference_inventory_landed_no_runtime_selected_gate_b_prompt_guard_design"
    });
  });

  it("keeps active docs aligned on the raw-floor guardrail and original rockwool posture", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_A.selectionStatus);
      expect(doc).toContain(FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_A.selectedNextFile);
      expect(doc).toContain(FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_A.selectedNextAction);
      expect(doc).toContain("raw_floor_role_inference");
      expect(doc).toContain("arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed");
      expect(doc).toContain("standing_lane_misclassification_monitoring_mandate");
      expect(doc).toContain("note_test_document_or_easy_fix");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("multileaf_screening_blend_fail_closed_until_grouped_topology");
    }
  });
});
