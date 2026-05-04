import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
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

const FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_C = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_c_implemented_raw_floor_role_prompt_guard_with_engine_web_visible_tests",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: true,
  outputSupportChange: false,
  previousGate: "gate_b_design_raw_floor_role_prompt_and_negative_boundary_guard_no_runtime",
  proposalReportCopyChange: false,
  routeCardValueChange: true,
  runtimeImportSelectedNow: false,
  runtimeTightening: true,
  runtimeWidening: false,
  selectedNextAction: "gate_a_revalidate_source_accuracy_gap_order_after_floor_raw_role_prompt_guard_landing",
  selectedNextFile: "packages/engine/src/calculator-source-gap-revalidation-v17-gate-a-contract.test.ts",
  selectionStatus:
    "floor_raw_role_prompt_guard_runtime_landed_selected_source_gap_revalidation_v17",
  sliceId: "floor_raw_role_inference_guardrail_v1",
  supportPromotion: false,
  warningCopyChange: true,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_C_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_C_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

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

function resultFor(layers: readonly LayerInput[]) {
  return calculateAssembly(layers, { targetOutputs: TARGET_OUTPUTS });
}

function warningsContain(warnings: readonly string[], pattern: RegExp): boolean {
  return warnings.some((warning) => pattern.test(warning));
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("floor raw role inference guardrail Gate C implementation", () => {
  it("lands Gate C as a bounded prompt-guard runtime tightening with no source or support promotion", () => {
    expect(FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_C).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_c_implemented_raw_floor_role_prompt_guard_with_engine_web_visible_tests",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: true,
      outputSupportChange: false,
      previousGate: "gate_b_design_raw_floor_role_prompt_and_negative_boundary_guard_no_runtime",
      proposalReportCopyChange: false,
      routeCardValueChange: true,
      runtimeImportSelectedNow: false,
      runtimeTightening: true,
      runtimeWidening: false,
      selectedNextAction: "gate_a_revalidate_source_accuracy_gap_order_after_floor_raw_role_prompt_guard_landing",
      selectedNextFile: "packages/engine/src/calculator-source-gap-revalidation-v17-gate-a-contract.test.ts",
      selectionStatus: "floor_raw_role_prompt_guard_runtime_landed_selected_source_gap_revalidation_v17",
      sliceId: "floor_raw_role_inference_guardrail_v1",
      supportPromotion: false,
      warningCopyChange: true,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_C_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps role-tagged exact floor rows on the exact path without a prompt warning", () => {
    const result = resultFor(buildExactLayers("tuas_x3_clt140_measured_2026", "tagged"));

    expect(result.floorSystemMatch?.system.id).toBe("tuas_x3_clt140_measured_2026");
    expect(result.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(warningsContain(result.warnings, /floor roles needed/i)).toBe(false);
    expect(warningsContain(result.warnings, /arbitrary raw floor reorder/i)).toBe(false);
  });

  it("keeps raw parity-green exact rows live while refusing arbitrary raw reorder invariance", () => {
    const result = resultFor(buildExactLayers("tuas_r5b_open_box_timber_measured_2026", "raw"));

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r5b_open_box_timber_measured_2026");
    expect(result.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(warningsContain(result.warnings, /does not claim arbitrary raw floor reorder value invariance/i)).toBe(true);
    expect(warningsContain(result.warnings, /floor roles needed/i)).toBe(false);
  });

  it("requires a floor-role prompt when raw tagged-drift inventory cannot promote impact outputs", () => {
    const result = resultFor(buildExactLayers("tuas_x4_clt140_measured_2026", "raw"));

    expect(result.floorSystemMatch ?? null).toBeNull();
    expect(result.impact ?? null).toBeNull();
    expect(result.supportedTargetOutputs).toEqual(["Rw"]);
    expect(result.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w"]);
    expect(warningsContain(result.warnings, /Floor roles needed before impact output promotion/i)).toBe(true);
    expect(warningsContain(result.warnings, /untagged order does not land on a defended exact impact row/i)).toBe(true);
  });

  it("requires a floor-role prompt when raw input has no safe role inference path", () => {
    const result = resultFor(buildExactLayers("dataholz_gdsnxn01a_timber_frame_lab_2026", "raw"));

    expect(result.floorSystemMatch ?? null).toBeNull();
    expect(result.impact ?? null).toBeNull();
    expect(result.supportedTargetOutputs).toEqual(["Rw"]);
    expect(result.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w"]);
    expect(warningsContain(result.warnings, /could not safely infer the base, ceiling, and upper-floor roles/i)).toBe(true);
  });

  it("keeps duplicate single-entry raw roles visible and away from exact promotion", () => {
    const result = resultFor(buildExactLayers("tuas_r7b_open_box_timber_measured_2026", "raw"));

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_general");
    expect(result.impact?.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(warningsContain(result.warnings, /single-entry floor roles are duplicated/i)).toBe(true);
    expect(warningsContain(result.warnings, /Floor roles needed before exact floor-family promotion/i)).toBe(true);
  });

  it("keeps a many-layer duplicate raw stack finite without exact promotion", () => {
    const raw = buildExactLayers("tuas_r7b_open_box_timber_measured_2026", "raw");
    const manyLayerDuplicate = [...raw, ...raw, ...raw].map((layer) => ({ ...layer }));
    const result = resultFor(manyLayerDuplicate);

    expect(Number.isFinite(result.metrics.estimatedRwDb)).toBe(true);
    expect(result.floorSystemMatch).toBeNull();
    expect(warningsContain(result.warnings, /Floor roles needed before exact floor-family promotion/i)).toBe(true);
  });

  it("keeps hostile API input fail-closed before prompt guard classification", () => {
    const result = resultFor([
      { materialId: "unknown_floor_role_prompt_guard_probe", thicknessMm: Number.POSITIVE_INFINITY }
    ]);

    expect(result.floorSystemMatch ?? null).toBeNull();
    expect(result.impact ?? null).toBeNull();
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(TARGET_OUTPUTS);
    expect(warningsContain(result.warnings, /invalid|unknown|finite|thickness/i)).toBe(true);
    expect(warningsContain(result.warnings, /floor roles needed/i)).toBe(false);
  });

  it("keeps docs aligned on Gate C landing, next source-gap revalidation, and standing wrong-lane monitoring", () => {
    const docs = REQUIRED_GATE_C_DOCS.map(readRepoFile);

    for (const doc of docs) {
      expect(doc).toContain(FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_C.selectionStatus);
      expect(doc).toContain(FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_C.selectedNextFile);
      expect(doc).toContain(FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_C.selectedNextAction);
      expect(doc).toContain("raw_floor_role_inference");
      expect(doc).toContain("arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed");
      expect(doc).toContain("raw_tagged_drift_requires_floor_role_prompt");
      expect(doc).toContain("raw_no_safe_inference_requires_floor_role_prompt");
      expect(doc).toContain("duplicate_single_entry_role_requires_floor_role_prompt");
      expect(doc).toContain("standing_lane_misclassification_monitoring_mandate");
      expect(doc).toContain("note_test_document_or_easy_fix");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("multileaf_screening_blend_fail_closed_until_grouped_topology");
    }
  });
});
