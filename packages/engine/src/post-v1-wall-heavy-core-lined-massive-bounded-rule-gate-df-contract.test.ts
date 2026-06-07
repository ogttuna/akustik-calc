import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD,
  GATE_H_LINED_MASSIVE_WALL_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-h-lined-masonry-clt";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_GATE_DD_LIVE_ROUTE_PINS
} from "./post-v1-wall-heavy-core-lined-massive-accuracy-gate-dd";
import {
  POST_V1_GATE_DF_BOUNDED_RULE_ENVELOPE,
  POST_V1_GATE_DF_BOUNDED_RULE_OWNER_CANDIDATE_ID,
  POST_V1_GATE_DF_COUNTERS,
  POST_V1_GATE_DF_FIELD_ADAPTER_OUTPUTS,
  POST_V1_GATE_DF_LAB_BOUNDED_OUTPUTS,
  POST_V1_GATE_DF_NEGATIVE_BOUNDARIES,
  POST_V1_GATE_DF_TARGET_OUTPUTS,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_LANDED_GATE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_ACTION,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_FILE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_LABEL,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTION_STATUS,
  summarizePostV1WallHeavyCoreLinedMassiveBoundedRuleGateDF
} from "./post-v1-wall-heavy-core-lined-massive-bounded-rule-gate-df";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-de";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function generatedCase(id: string) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === id);

  if (!found) {
    throw new Error(`Missing generated case ${id}`);
  }

  return found;
}

describe("post-V1 wall heavy-core / lined-massive bounded-rule Gate DF", () => {
  it("lands after Gate DE and selects the bounded runtime-basis Gate DG without moving values", () => {
    const summary = summarizePostV1WallHeavyCoreLinedMassiveBoundedRuleGateDF();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_de_landed_no_runtime_selected_wall_heavy_core_lined_massive_bounded_rule_gate_df"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_ACTION).toBe(
      POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-rule-gate-df-contract.test.ts"
    );
    expect(summary).toMatchObject({
      boundedRuleEnvelope: POST_V1_GATE_DF_BOUNDED_RULE_ENVELOPE,
      counters: POST_V1_GATE_DF_COUNTERS,
      existingFieldAdapterCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      existingFieldAdapterRuntimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      existingLabRuntimeBasisId: GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD,
      existingLabSelectedCandidateId: GATE_H_LINED_MASSIVE_WALL_SELECTED_CANDIDATE_ID,
      landedGate: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_LANDED_GATE,
      labBoundedOutputs: POST_V1_GATE_DF_LAB_BOUNDED_OUTPUTS,
      negativeBoundaries: POST_V1_GATE_DF_NEGATIVE_BOUNDARIES,
      noRuntimeValueMovement: true,
      selectedCandidateId: POST_V1_GATE_DF_BOUNDED_RULE_OWNER_CANDIDATE_ID,
      selectedNextAction: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_DF_TARGET_OUTPUTS
    });
  });

  it("defines the bounded owner envelope on the existing Gate H lab route without retuning the live pins", () => {
    const testCase = generatedCase(POST_V1_GATE_DD_LIVE_ROUTE_PINS.generatedCaseId);
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const labSnapshot = resultSnapshot(lab);

    expect(lab.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "lined_massive_wall",
      selectedMethod: "mass_law",
      strategy: "lined_massive_blend"
    });
    expect(labSnapshot).toMatchObject({
      c: POST_V1_GATE_DD_LIVE_ROUTE_PINS.labPins.C,
      ctr: POST_V1_GATE_DD_LIVE_ROUTE_PINS.labPins.Ctr,
      rw: POST_V1_GATE_DD_LIVE_ROUTE_PINS.labPins.Rw,
      stc: POST_V1_GATE_DD_LIVE_ROUTE_PINS.labPins.STC,
      supportedTargetOutputs: [...POST_V1_GATE_DF_LAB_BOUNDED_OUTPUTS]
    });
    expect(lab.airborneBasis).toMatchObject({
      calculationStandard: "engine_double_leaf_cavity",
      errorBudgetDb: 6,
      family: "lined_massive_wall",
      kind: "airborne_bound",
      method: GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD,
      origin: "bounded_prediction",
      toleranceClass: "bounded_prediction"
    });
    expect(lab.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining([
        "lightLiningLeafMassKgM2",
        "heavyMasonryLeafMassKgM2",
        "cavityDepthMm",
        "cavityFillCoverage",
        "absorberClass",
        `boundedOwner:${POST_V1_GATE_DF_BOUNDED_RULE_OWNER_CANDIDATE_ID}`,
        "selectedDelegateCurve:surface_mass_law_delegate",
        "ISO717-1 rating adapter",
        "ASTM E413 STC adapter boundary"
      ])
    );
    expect(lab.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: GATE_H_LINED_MASSIVE_WALL_SELECTED_CANDIDATE_ID,
      selectedOrigin: "bounded_prediction"
    });
    expect(POST_V1_GATE_DF_BOUNDED_RULE_ENVELOPE.map((field) => field.fieldId)).toEqual([
      "wallTopologyFamily",
      "lightLiningLeafMassKgM2",
      "heavyMasonryLeafMassKgM2",
      "cavityDepthMm",
      "cavityFillCoverage",
      "absorberClass",
      "selectedDelegateCurve"
    ]);
    expect(POST_V1_GATE_DF_COUNTERS.runtimeValuesMoved).toBe(0);
    expect(POST_V1_GATE_DF_COUNTERS.boundedRuntimeBasisPromotions).toBe(0);
  });

  it("keeps field outputs on the explicit field adapter instead of aliasing the lab bounded rule", () => {
    const testCase = generatedCase(POST_V1_GATE_DD_LIVE_ROUTE_PINS.generatedCaseId);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const fieldSnapshot = resultSnapshot(field);

    expect(fieldSnapshot).toMatchObject({
      c: POST_V1_GATE_DD_LIVE_ROUTE_PINS.fieldPins.C,
      ctr: POST_V1_GATE_DD_LIVE_ROUTE_PINS.fieldPins.Ctr,
      dnTA: POST_V1_GATE_DD_LIVE_ROUTE_PINS.fieldPins.DnTADb,
      dnTw: POST_V1_GATE_DD_LIVE_ROUTE_PINS.fieldPins.DnTwDb,
      dnW: POST_V1_GATE_DD_LIVE_ROUTE_PINS.fieldPins.DnWDb,
      rwPrimeDb: POST_V1_GATE_DD_LIVE_ROUTE_PINS.fieldPins.RwPrimeDb,
      supportedTargetOutputs: [...POST_V1_GATE_DF_FIELD_ADAPTER_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(field.airborneBasis).toMatchObject({
      errorBudgetDb: 8,
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(field.airborneBasis?.method).not.toBe(GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD);
    expect(field.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining([
        "fieldContext.contextMode:field_between_rooms",
        "fieldContext.partitionAreaM2_or_panelWidthHeight",
        "fieldContext.receivingRoomVolumeM3",
        "fieldContext.receivingRoomRt60S",
        "fieldMetricAdapter:R'w/DnT,w"
      ])
    );
  });

  it("keeps adjacent heavy composite and AAC/multicavity boundaries outside the bounded owner", () => {
    const heavyComposite = calculateAssembly(
      generatedCase("wall-heavy-composite-hint-suppression").rows,
      generatedCase("wall-heavy-composite-hint-suppression").fieldOptions
    );
    const heldAac = calculateAssembly(generatedCase("wall-held-aac").rows, {
      ...generatedCase("wall-held-aac").fieldOptions,
      targetOutputs: ["Rw", "R'w", "DnT,w"]
    });

    expect(heavyComposite.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "double_leaf",
      strategy: "double_leaf_empty_cavity_delegate+heavy_unframed_cavity_cap"
    });
    expect(heavyComposite.airborneBasis?.method).not.toBe(GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD);
    expect(resultSnapshot(heavyComposite)).toMatchObject({
      rwPrimeDb: 60,
      supportedTargetOutputs: [...POST_V1_GATE_DF_FIELD_ADAPTER_OUTPUTS],
      unsupportedTargetOutputs: []
    });

    expect(heldAac.supportedTargetOutputs).toEqual([]);
    expect(heldAac.unsupportedTargetOutputs).toEqual(["Rw", "R'w", "DnT,w"]);
    expect(heldAac.airborneBasis).toMatchObject({
      origin: "needs_input"
    });
    expect(heldAac.airborneBasis?.missingPhysicalInputs).toEqual([
      "sideALeafGroup",
      "cavity1DepthMm",
      "internalLeafGroup",
      "internalLeafCoupling",
      "cavity2DepthMm",
      "sideBLeafGroup",
      "supportTopology"
    ]);

    expect(POST_V1_GATE_DF_NEGATIVE_BOUNDARIES.map((boundary) => boundary.boundaryId)).toEqual([
      "direct_value_retune",
      "source_or_exact_promotion",
      "field_or_building_metric_adapter",
      "heavy_composite_double_leaf_sibling",
      "aac_or_multicavity_grouped_topology",
      "floor_rows_or_workbench_presets"
    ]);
    expect(POST_V1_GATE_DF_NEGATIVE_BOUNDARIES.every((boundary) => boundary.runtimeMovementAllowedNow === false))
      .toBe(true);
  });

  it("keeps docs and current-gate runner aligned with Gate DF closeout and Gate DG selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_DF_BOUNDED_RULE_OWNER_CANDIDATE_ID);
      expect(contents, path).toContain("0.75 mass_law + 0.25 screening seed");
      expect(contents, path).toContain("heavy_composite_double_leaf_sibling");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-rule-gate-df.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-wall-heavy-core-lined-massive-bounded-rule-gate-df-contract.test.ts");
  });
});
