import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_DN_TIMBER_STUD_BOUNDED_RUNTIME_METHOD,
  GATE_DN_TIMBER_STUD_BOUNDED_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-dn-timber-stud-bounded";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_GATE_DM_BOUNDED_RULE_OWNER_CANDIDATE_ID,
  POST_V1_GATE_DM_FIELD_ADAPTER_OUTPUTS,
  POST_V1_GATE_DM_LAB_BOUNDED_OUTPUTS,
  POST_V1_GATE_DM_LIVE_ROUTE_PINS,
  POST_V1_GATE_DM_NEGATIVE_BOUNDARIES,
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_ACTION,
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_FILE,
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTION_STATUS
} from "./post-v1-wall-timber-stud-bounded-rule-gate-dm";
import {
  POST_V1_GATE_DN_COUNTERS,
  POST_V1_GATE_DN_FIELD_RUNTIME_BASIS,
  POST_V1_GATE_DN_LAB_RUNTIME_BASIS,
  POST_V1_GATE_DN_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DN_TARGET_OUTPUTS,
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_LANDED_GATE,
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_ACTION,
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_FILE,
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTION_STATUS,
  summarizePostV1WallTimberStudBoundedRuntimeBasisGateDN
} from "./post-v1-wall-timber-stud-bounded-runtime-basis-gate-dn";

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

describe("post-V1 wall timber-stud bounded runtime-basis Gate DN", () => {
  it("lands after Gate DM and returns the chain to numeric coverage rerank without moving values", () => {
    const summary = summarizePostV1WallTimberStudBoundedRuntimeBasisGateDN();

    expect(POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTION_STATUS).toBe(
      "post_v1_wall_timber_stud_bounded_rule_gate_dm_landed_no_runtime_selected_timber_stud_bounded_runtime_basis_gate_dn"
    );
    expect(POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_ACTION).toBe(
      POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_LANDED_GATE
    );
    expect(POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-wall-timber-stud-bounded-runtime-basis-gate-dn-contract.test.ts"
    );
    expect(summary).toMatchObject({
      counters: POST_V1_GATE_DN_COUNTERS,
      fieldRuntimeBasis: POST_V1_GATE_DN_FIELD_RUNTIME_BASIS,
      labRuntimeBasis: POST_V1_GATE_DN_LAB_RUNTIME_BASIS,
      landedGate: POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_LANDED_GATE,
      negativeBoundaries: POST_V1_GATE_DM_NEGATIVE_BOUNDARIES,
      noNumericValueMovement: true,
      selectedCandidateId: POST_V1_GATE_DN_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_DN_TARGET_OUTPUTS
    });
    expect(POST_V1_GATE_DN_COUNTERS).toMatchObject({
      boundedRuntimeBasisPromotions: 1,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeValuesMoved: 0
    });
  });

  it("promotes the live timber-stud lab route to bounded_prediction without changing numeric pins", () => {
    const testCase = generatedCase(POST_V1_GATE_DM_LIVE_ROUTE_PINS.generatedCaseId);
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const labSnapshot = resultSnapshot(lab);
    const candidatesById = new Map(
      (lab.airborneCandidateResolution?.candidates ?? []).map((candidate: { id: string }) => [candidate.id, candidate])
    );

    expect(labSnapshot).toMatchObject({
      c: POST_V1_GATE_DM_LIVE_ROUTE_PINS.labPins.C,
      ctr: POST_V1_GATE_DM_LIVE_ROUTE_PINS.labPins.Ctr,
      rw: POST_V1_GATE_DM_LIVE_ROUTE_PINS.labPins.Rw,
      stc: POST_V1_GATE_DM_LIVE_ROUTE_PINS.labPins.STC,
      supportedTargetOutputs: [...POST_V1_GATE_DM_LAB_BOUNDED_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(lab.airborneBasis).toMatchObject({
      calculationStandard: "engine_double_leaf_cavity",
      curveBasis: "calculated_frequency_curve",
      errorBudgetDb: 8,
      family: "stud_wall_system",
      kind: "airborne_bound",
      method: GATE_DN_TIMBER_STUD_BOUNDED_RUNTIME_METHOD,
      origin: "bounded_prediction",
      ratingStandard: "ISO 717-1",
      toleranceClass: "bounded_prediction"
    });
    expect(lab.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining([
        "airborneContext.studType:wood_stud",
        "airborneContext.connectionType:line_connection",
        "airborneContext.studSpacingMm:600",
        "visibleLeafCount=2",
        "cavityCount=1",
        "boardSystem:double_board_2x2_plain_gypsum",
        "cavityDepthMm:100",
        "mineralFillThicknessMm:50",
        "gapThicknessMm:50",
        `boundedOwner:${POST_V1_GATE_DM_BOUNDED_RULE_OWNER_CANDIDATE_ID}`,
        "selectedDelegateCurve:surface_mass_law_delegate",
        "ISO717-1 rating adapter",
        "ASTM E413 STC adapter boundary"
      ])
    );
    expect(lab.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: GATE_DN_TIMBER_STUD_BOUNDED_SELECTED_CANDIDATE_ID,
      selectedOrigin: "bounded_prediction",
      selectedBasis: {
        kind: "airborne_bound",
        origin: "bounded_prediction",
        toleranceClass: "bounded_prediction"
      }
    });
    expect(candidatesById.get(GATE_DN_TIMBER_STUD_BOUNDED_SELECTED_CANDIDATE_ID)).toMatchObject({
      origin: "bounded_prediction",
      selected: true
    });
  });

  it("keeps field outputs on Gate I over the Gate DN base instead of aliasing lab metrics", () => {
    const testCase = generatedCase(POST_V1_GATE_DM_LIVE_ROUTE_PINS.generatedCaseId);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const fieldSnapshot = resultSnapshot(field);

    expect(fieldSnapshot).toMatchObject({
      dnTA: POST_V1_GATE_DM_LIVE_ROUTE_PINS.fieldPins.DnTADb,
      dnTw: POST_V1_GATE_DM_LIVE_ROUTE_PINS.fieldPins.DnTwDb,
      dnW: POST_V1_GATE_DM_LIVE_ROUTE_PINS.fieldPins.DnWDb,
      rwPrimeDb: POST_V1_GATE_DM_LIVE_ROUTE_PINS.fieldPins.RwPrimeDb,
      supportedTargetOutputs: [...POST_V1_GATE_DM_FIELD_ADAPTER_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(field.airborneBasis).toMatchObject({
      calculationStandard: "ISO 12354-1",
      curveBasis: "calculated_frequency_curve",
      errorBudgetDb: 10,
      family: "stud_wall_system",
      kind: "airborne_physics_prediction",
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      ratingStandard: "ISO 717-1",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(field.airborneBasis?.method).not.toBe(GATE_DN_TIMBER_STUD_BOUNDED_RUNTIME_METHOD);
    expect(field.airborneBasis?.assumptions).toEqual(
      expect.arrayContaining([
        `base lab-family method remains ${GATE_DN_TIMBER_STUD_BOUNDED_RUNTIME_METHOD}`
      ])
    );
    expect(field.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining([
        `boundedOwner:${POST_V1_GATE_DM_BOUNDED_RULE_OWNER_CANDIDATE_ID}`,
        "fieldContext.contextMode:field_between_rooms",
        "fieldContext.partitionAreaM2_or_panelWidthHeight",
        "fieldContext.receivingRoomVolumeM3",
        "fieldContext.receivingRoomRt60S",
        "fieldMetricAdapter:R'w/DnT,w"
      ])
    );
    expect(field.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
  });

  it("keeps adjacent LSF, CLT, and grouped multicavity boundaries outside the timber-stud runtime basis", () => {
    const lsfCase = generatedCase("wall-lsf-knauf");
    const cltCase = generatedCase("wall-clt-local");
    const heldAacCase = generatedCase("wall-held-aac");
    const lsf = calculateAssembly(lsfCase.rows, lsfCase.labOptions);
    const clt = calculateAssembly(cltCase.rows, cltCase.labOptions);
    const heldAac = calculateAssembly(heldAacCase.rows, {
      ...heldAacCase.fieldOptions,
      targetOutputs: ["Rw", "R'w", "DnT,w"]
    });

    expect(lsf.dynamicAirborneTrace?.detectedFamily).toBe("stud_wall_system");
    expect(lsf.airborneBasis?.method).not.toBe(GATE_DN_TIMBER_STUD_BOUNDED_RUNTIME_METHOD);
    expect(lsf.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      GATE_DN_TIMBER_STUD_BOUNDED_SELECTED_CANDIDATE_ID
    );
    expect(clt.dynamicAirborneTrace?.detectedFamily).not.toBe("stud_wall_system");
    expect(clt.airborneBasis?.family).not.toBe("stud_wall_system");
    expect(clt.airborneBasis?.method).not.toBe(GATE_DN_TIMBER_STUD_BOUNDED_RUNTIME_METHOD);
    expect(heldAac.airborneBasis).toMatchObject({
      origin: "needs_input"
    });
    expect(POST_V1_GATE_DM_NEGATIVE_BOUNDARIES.map((boundary) => boundary.boundaryId)).toEqual([
      "direct_value_retune",
      "exact_or_benchmark_source_promotion",
      "single_board_exact_imports",
      "light_steel_stud_or_resilient_bar",
      "field_or_building_metric_adapter",
      "split_double_stud_or_grouped_multicavity",
      "clt_or_mass_timber_panel"
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate DN closeout and Gate DO selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(GATE_DN_TIMBER_STUD_BOUNDED_RUNTIME_METHOD);
      expect(contents, path).toContain(GATE_DN_TIMBER_STUD_BOUNDED_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("runtimeValuesMoved 0");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-wall-timber-stud-bounded-runtime-basis-gate-dn.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-wall-timber-stud-bounded-runtime-basis-gate-dn-contract.test.ts");
  });
});
