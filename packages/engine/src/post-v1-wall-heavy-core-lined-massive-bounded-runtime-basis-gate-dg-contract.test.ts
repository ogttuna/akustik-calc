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
  POST_V1_GATE_DF_BOUNDED_RULE_OWNER_CANDIDATE_ID,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_ACTION,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_FILE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTION_STATUS
} from "./post-v1-wall-heavy-core-lined-massive-bounded-rule-gate-df";
import {
  POST_V1_GATE_DG_COUNTERS,
  POST_V1_GATE_DG_FIELD_RUNTIME_BASIS,
  POST_V1_GATE_DG_LAB_RUNTIME_BASIS,
  POST_V1_GATE_DG_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DG_TARGET_OUTPUTS,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_LANDED_GATE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_ACTION,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_FILE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTION_STATUS,
  summarizePostV1WallHeavyCoreLinedMassiveBoundedRuntimeBasisGateDG
} from "./post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg";

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

describe("post-V1 wall heavy-core / lined-massive bounded runtime-basis Gate DG", () => {
  it("lands after Gate DF and returns the chain to numeric coverage rerank without moving values", () => {
    const summary = summarizePostV1WallHeavyCoreLinedMassiveBoundedRuntimeBasisGateDG();

    expect(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTION_STATUS).toBe(
      "post_v1_wall_heavy_core_lined_massive_bounded_rule_gate_df_landed_no_runtime_selected_bounded_runtime_basis_gate_dg"
    );
    expect(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_ACTION).toBe(
      POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_LANDED_GATE
    );
    expect(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts"
    );
    expect(summary).toMatchObject({
      counters: POST_V1_GATE_DG_COUNTERS,
      fieldRuntimeBasis: POST_V1_GATE_DG_FIELD_RUNTIME_BASIS,
      labRuntimeBasis: POST_V1_GATE_DG_LAB_RUNTIME_BASIS,
      landedGate: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_LANDED_GATE,
      noNumericValueMovement: true,
      selectedCandidateId: POST_V1_GATE_DG_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_DG_TARGET_OUTPUTS
    });
    expect(POST_V1_GATE_DG_COUNTERS).toMatchObject({
      boundedRuntimeBasisPromotions: 1,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeValuesMoved: 0
    });
  });

  it("promotes the live lined-massive lab route to bounded_prediction without changing numeric pins", () => {
    const testCase = generatedCase(POST_V1_GATE_DD_LIVE_ROUTE_PINS.generatedCaseId);
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const labSnapshot = resultSnapshot(lab);
    const candidatesById = new Map(lab.airborneCandidateResolution?.candidates.map((candidate) => [candidate.id, candidate]));

    expect(labSnapshot).toMatchObject({
      c: POST_V1_GATE_DD_LIVE_ROUTE_PINS.labPins.C,
      ctr: POST_V1_GATE_DD_LIVE_ROUTE_PINS.labPins.Ctr,
      rw: POST_V1_GATE_DD_LIVE_ROUTE_PINS.labPins.Rw,
      stc: POST_V1_GATE_DD_LIVE_ROUTE_PINS.labPins.STC,
      supportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
      unsupportedTargetOutputs: []
    });
    expect(lab.airborneBasis).toMatchObject({
      calculationStandard: "engine_double_leaf_cavity",
      curveBasis: "calculated_frequency_curve",
      errorBudgetDb: 6,
      family: "lined_massive_wall",
      kind: "airborne_bound",
      method: GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD,
      origin: "bounded_prediction",
      ratingStandard: "ISO 717-1",
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
        "selectedDelegateCurve:surface_mass_law_delegate"
      ])
    );
    expect(lab.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: GATE_H_LINED_MASSIVE_WALL_SELECTED_CANDIDATE_ID,
      selectedOrigin: "bounded_prediction",
      selectedBasis: {
        kind: "airborne_bound",
        origin: "bounded_prediction",
        toleranceClass: "bounded_prediction"
      }
    });
    expect(candidatesById.get(GATE_H_LINED_MASSIVE_WALL_SELECTED_CANDIDATE_ID)).toMatchObject({
      origin: "bounded_prediction",
      selected: true
    });
  });

  it("keeps field outputs on Gate I instead of aliasing the bounded lab basis", () => {
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
      supportedTargetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
      unsupportedTargetOutputs: []
    });
    expect(field.airborneBasis).toMatchObject({
      errorBudgetDb: 8,
      kind: "airborne_physics_prediction",
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(field.airborneBasis?.method).not.toBe(GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD);
    expect(field.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
  });

  it("keeps adjacent heavy-composite and AAC/multicavity boundaries outside the bounded lane", () => {
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
      supportedTargetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
      unsupportedTargetOutputs: []
    });

    expect(heldAac.supportedTargetOutputs).toEqual([]);
    expect(heldAac.unsupportedTargetOutputs).toEqual(["Rw", "R'w", "DnT,w"]);
    expect(heldAac.airborneBasis).toMatchObject({
      origin: "needs_input"
    });
  });

  it("keeps docs and current-gate runner aligned with Gate DG closeout and Gate DH selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("bounded_prediction");
      expect(contents, path).toContain("runtimeValuesMoved 0");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts");
  });
});
