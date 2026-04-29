import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const INTERNAL_USE_PILOT_HANDOFF_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_prepare_company_internal_pilot_handoff_pack_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  previousClosedSlice: "internal_use_acceptance_rehearsal_v1",
  reportCopyChange: false,
  routeCardValueChange: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "internal_use_pilot_handoff_v1_gate_c_pilot_release_closeout",
  selectedNextFile: "packages/engine/src/post-internal-use-pilot-handoff-v1-next-slice-selection-contract.test.ts",
  sliceId: "internal_use_pilot_handoff_v1",
  supportPromotion: false
} as const;

const REQUIRED_HANDOFF_ARTIFACTS = [
  "docs/calculator/INTERNAL_USE_PILOT_HANDOFF.md",
  "docs/calculator/INTERNAL_USE_PILOT_USAGE_NOTE.md",
  "docs/calculator/SLICE_INTERNAL_USE_PILOT_HANDOFF_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-04-29_INTERNAL_USE_ACCEPTANCE_REHEARSAL_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-29_INTERNAL_USE_PILOT_HANDOFF_GATE_A_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const ACCEPTANCE_BUCKETS = [
  "pilot_ready_with_standard_caveat",
  "pilot_allowed_with_visible_caveat",
  "not_defended_fail_closed_or_source_gated",
  "hostile_many_layer_reorder_and_missing_input_edges"
] as const;

const ACCEPTANCE_SCENARIOS = [
  "wall_lsf_exact_preset",
  "wall_aac_single_leaf_benchmark",
  "wall_masonry_single_leaf_benchmark",
  "floor_pliteq_exact_source_corridor",
  "floor_ubiq_bound_source_corridor",
  "wall_timber_double_board_generated",
  "wall_clt_local_generated",
  "wall_lined_heavy_core_screening",
  "floor_steel_fallback_generated",
  "floor_many_layer_exact_split_stack",
  "floor_many_layer_raw_fail_or_screening_stack",
  "floor_role_defined_reorder_exact_stack",
  "floor_raw_reorder_support_boundary",
  "wall_field_missing_geometry_needs_input",
  "invalid_thickness_all_callers_fail_closed",
  "api_missing_layers_next_field",
  "unsupported_target_output_partition",
  "wall_no_stud_double_leaf_source_gated",
  "historical_blocked_floor_families",
  "mixed_study_mode_save_load_replay_owner"
] as const;

const READY_VALUE_MARKERS = [
  "Rw=55",
  "R'w=48",
  "DnT,w=49",
  "Rw=47",
  "R'w=45",
  "DnT,w=46",
  "Rw=43",
  "R'w=41",
  "DnT,w=43"
] as const;

const HANDOFF_OPERATOR_REQUIREMENTS = [
  "Select `wall` or `floor` first",
  "Fill the inputs opened by that selection",
  "Add materials and thicknesses",
  "read the value, support status, confidence",
  "Copy the caveat",
  "`needs_input`, unsupported, fail-closed, or source-gated",
  "Do not infer broad arbitrary layer-order invariance"
] as const;

const REQUIRED_VALIDATION_COMMANDS = [
  "pnpm --filter @dynecho/engine exec vitest run src/internal-use-pilot-handoff-v1-gate-a-contract.test.ts --maxWorkers=1",
  "pnpm --filter @dynecho/engine exec vitest run src/post-internal-use-acceptance-rehearsal-v1-next-slice-selection-contract.test.ts --maxWorkers=1",
  "pnpm calculator:gate:current",
  "pnpm check",
  "git diff --check"
] as const;

const SOURCE_GATED_GAPS = [
  "timber_double_board_stud_wall",
  "clt_mass_timber_wall",
  "lined_massive_heavy_core_wall",
  "no_stud_double_leaf_wall",
  "generated_floor_fallback",
  "historical_blocked_families"
] as const;

const FROZEN_SURFACES = [
  "runtime/support/confidence/evidence/API/route-card/output-card",
  "proposal/report/workbench-input"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("internal-use pilot handoff Gate A contract", () => {
  it("lands the pilot handoff pack without runtime or visible-surface movement", () => {
    expect(INTERNAL_USE_PILOT_HANDOFF_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_prepare_company_internal_pilot_handoff_pack_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      previousClosedSlice: "internal_use_acceptance_rehearsal_v1",
      reportCopyChange: false,
      routeCardValueChange: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedNextAction: "internal_use_pilot_handoff_v1_gate_c_pilot_release_closeout",
      selectedNextFile: "packages/engine/src/post-internal-use-pilot-handoff-v1-next-slice-selection-contract.test.ts",
      sliceId: "internal_use_pilot_handoff_v1",
      supportPromotion: false
    });

    for (const path of REQUIRED_HANDOFF_ARTIFACTS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("documents all acceptance buckets and all 20 executable scenario ids", () => {
    const handoff = readRepoFile("docs/calculator/INTERNAL_USE_PILOT_HANDOFF.md");
    const acceptanceGateA = readRepoFile("packages/engine/src/internal-use-acceptance-rehearsal-v1-gate-a-contract.test.ts");

    for (const bucket of ACCEPTANCE_BUCKETS) {
      expect(handoff).toContain(bucket);
      expect(acceptanceGateA).toContain(bucket);
    }

    for (const scenarioId of ACCEPTANCE_SCENARIOS) {
      expect(handoff).toContain(scenarioId);
      expect(acceptanceGateA).toContain(scenarioId);
    }
  });

  it("keeps ready lanes value-bearing and caveated or blocked lanes visibly caveated", () => {
    const handoff = readRepoFile("docs/calculator/INTERNAL_USE_PILOT_HANDOFF.md");

    for (const marker of READY_VALUE_MARKERS) {
      expect(handoff).toContain(marker);
    }

    for (const phrase of [
      "Do not write exact",
      "source-backed, or benchmark-backed",
      "low confidence, formula-owned, source-gated",
      "medium confidence, formula-owned, source-gated",
      "screening only",
      "`L'nT,50` unsupported",
      "`needs_input`",
      "fail-closed",
      "unsupported",
      "source-gated"
    ]) {
      expect(handoff).toContain(phrase);
    }
  });

  it("contains operator steps and validation commands needed for a release-candidate handoff", () => {
    const handoff = readRepoFile("docs/calculator/INTERNAL_USE_PILOT_HANDOFF.md");

    for (const requirement of HANDOFF_OPERATOR_REQUIREMENTS) {
      expect(handoff).toContain(requirement);
    }

    for (const command of REQUIRED_VALIDATION_COMMANDS) {
      expect(handoff).toContain(command);
    }

    expect(handoff).toContain("focused baseline before this Gate A");
    expect(handoff).toContain("engine: 138 files / 661 tests");
    expect(handoff).toContain("web: 45 files / 216 passed + 18 skipped");
  });

  it("keeps source-gated gaps blocked until a later source-ready accuracy pack exists", () => {
    const handoff = readRepoFile("docs/calculator/INTERNAL_USE_PILOT_HANDOFF.md");

    for (const gap of SOURCE_GATED_GAPS) {
      expect(handoff).toContain(gap);
    }

    for (const requirement of [
      "exact topology and material thickness mapping",
      "metric owner",
      "tolerance owner",
      "protected negative boundaries",
      "paired engine/web visible tests"
    ]) {
      expect(handoff).toContain(requirement);
    }
  });

  it("keeps docs aligned on the selected next Gate C closeout file", () => {
    const nextPlan = readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md");
    const slicePlan = readRepoFile("docs/calculator/SLICE_INTERNAL_USE_PILOT_HANDOFF_V1_PLAN.md");
    const currentState = readRepoFile("docs/calculator/CURRENT_STATE.md");
    const agents = readRepoFile("AGENTS.md");

    for (const doc of [nextPlan, slicePlan, currentState, agents]) {
      expect(doc).toContain("internal_use_pilot_handoff_v1");
      for (const surface of FROZEN_SURFACES) {
        expect(doc).toContain(surface);
      }
    }

    expect(slicePlan).toContain(INTERNAL_USE_PILOT_HANDOFF_GATE_A.selectedNextFile);
  });
});
