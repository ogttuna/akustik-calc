import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactPredictorInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  COMPOSITE_PANEL_PUBLISHED_INTERACTION_DELTA_LW_TOLERANCE_DB,
  COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS,
  COMPOSITE_PANEL_PUBLISHED_INTERACTION_SELECTED_CANDIDATE_ID
} from "./composite-panel-published-interaction-runtime-constants";
import { buildLayerCombinationResolverRegistryContract } from "./layer-combination-resolver-registry";
import {
  POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_LANDED_GATE,
  POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTION_STATUS,
  POST_V1_GATE_CY_COUNTERS,
  POST_V1_GATE_CY_TARGET_OUTPUTS,
  POST_V1_GATE_CY_VALUE_PINS,
  summarizePostV1FloorCompositePanelDeltaLwOwnerGateCY
} from "./post-v1-floor-composite-panel-delta-lw-owner-gate-cy";
import {
  POST_V1_GATE_L_COMPOSITE_COMBINED_INPUT,
  POST_V1_GATE_L_COMPOSITE_DRY_FLOATING_INPUT,
  POST_V1_GATE_L_COMPOSITE_SUSPENDED_CEILING_INPUT
} from "./post-v1-floor-composite-panel-family-solver-owner-gate-l";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-cx";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const COMPOSITE_TRACE_LAYERS = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 90 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const MIXED_LAB_OUTPUTS = [
  "Rw",
  "Ln,w",
  "DeltaLw",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

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

function expectCompositeDeltaProfile(input: {
  deltaLw: number;
  lnw: number;
  predictorInput: ImpactPredictorInput;
  rw: number;
  supportedTargetOutputs: readonly RequestedOutputId[];
}): void {
  const result = calculateAssembly(COMPOSITE_TRACE_LAYERS, {
    impactPredictorInput: input.predictorInput,
    targetOutputs: MIXED_LAB_OUTPUTS
  });

  expect(result.impact).toMatchObject({
    DeltaLw: input.deltaLw,
    LnW: input.lnw,
    basis: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS
  });
  expect(result.impact?.metricBasis).toMatchObject({
    DeltaLw: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS,
    LnW: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS
  });
  expect(result.floorSystemRatings?.Rw).toBe(input.rw);
  expect(result.supportedTargetOutputs).toEqual(input.supportedTargetOutputs);
  expect(result.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
  expect(result.layerCombinationResolverTrace).toMatchObject({
    boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
    runtimeBasisId: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS,
    selectedCandidateId: COMPOSITE_PANEL_PUBLISHED_INTERACTION_SELECTED_CANDIDATE_ID,
    supportedMetrics: input.supportedTargetOutputs,
    valuePins: [
      { metric: "Rw", value: input.rw },
      { metric: "Ln,w", value: input.lnw },
      { metric: "DeltaLw", value: input.deltaLw }
    ]
  });
}

describe("post-V1 floor composite-panel DeltaLw owner Gate CY", () => {
  it("lands after Gate CX and selects the next numeric coverage rerank Gate CZ", () => {
    const summary = summarizePostV1FloorCompositePanelDeltaLwOwnerGateCY();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_cx_landed_no_runtime_selected_floor_composite_panel_delta_lw_owner_gate_cy"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_ACTION).toBe(
      POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-floor-composite-panel-delta-lw-owner-gate-cy-contract.test.ts"
    );
    expect(summary).toMatchObject({
      counters: POST_V1_GATE_CY_COUNTERS,
      landedGate: POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_CY_TARGET_OUTPUTS,
      valuePins: POST_V1_GATE_CY_VALUE_PINS
    });
  });

  it("calculates ISO DeltaLw for dry, suspended, and combined composite-panel profiles", () => {
    expectCompositeDeltaProfile({
      deltaLw: 14.6,
      lnw: 69.4,
      predictorInput: POST_V1_GATE_L_COMPOSITE_DRY_FLOATING_INPUT,
      rw: 45.1,
      supportedTargetOutputs: ["Rw", "Ln,w", "DeltaLw"]
    });
    expectCompositeDeltaProfile({
      deltaLw: 20.7,
      lnw: 63.3,
      predictorInput: POST_V1_GATE_L_COMPOSITE_SUSPENDED_CEILING_INPUT,
      rw: 48.6,
      supportedTargetOutputs: ["Rw", "Ln,w", "DeltaLw"]
    });
    expectCompositeDeltaProfile({
      deltaLw: 35.5,
      lnw: 48.5,
      predictorInput: POST_V1_GATE_L_COMPOSITE_COMBINED_INPUT,
      rw: 60.6,
      supportedTargetOutputs: ["Rw", "Ln,w", "DeltaLw"]
    });
  });

  it("keeps impact-only parity and the resolver registry on the composite-panel owner", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: POST_V1_GATE_L_COMPOSITE_COMBINED_INPUT,
      targetOutputs: ["Ln,w", "DeltaLw", "Rw"]
    });
    const registry = buildLayerCombinationResolverRegistryContract();
    const candidate = registry.candidateDeclarations.find(
      (entry) => entry.id === COMPOSITE_PANEL_PUBLISHED_INTERACTION_SELECTED_CANDIDATE_ID
    );

    expect(result.impact).toMatchObject({
      DeltaLw: 35.5,
      LnW: 48.5,
      basis: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS
    });
    expect(result.impact?.metricBasis).toMatchObject({
      DeltaLw: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS,
      LnW: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS
    });
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw", "Rw"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(candidate).toMatchObject({
      ownedRuntimeBasisId: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS,
      supportedMetrics: ["Rw", "Ln,w", "DeltaLw"]
    });
    expect(candidate?.errorBudgetTerms).toEqual(
      expect.arrayContaining([
        {
          metric: "DeltaLw",
          notMeasuredEvidence: true,
          toleranceDb: COMPOSITE_PANEL_PUBLISHED_INTERACTION_DELTA_LW_TOLERANCE_DB
        }
      ])
    );
  });

  it("preserves missing-input, exact-row, and ASTM boundaries", () => {
    const missingResilient = calculateImpactOnly([], {
      impactPredictorInput: {
        baseSlab: { thicknessMm: 65 },
        floorCovering: {
          densityKgM3: 900,
          materialClass: "dry_floating_gypsum_fiberboard",
          mode: "material_layer",
          thicknessMm: 20
        },
        impactSystemType: "dry_floating_floor",
        structuralSupportType: "composite_panel"
      },
      targetOutputs: ["DeltaLw"]
    });
    const exactDryRow = calculateImpactOnly([], {
      officialFloorSystemId: "pmc_m1_dry_floating_floor_lab_2026",
      targetOutputs: ["Ln,w", "DeltaLw"]
    });
    const astmAliases = calculateImpactOnly([], {
      impactPredictorInput: POST_V1_GATE_L_COMPOSITE_DRY_FLOATING_INPUT,
      targetOutputs: ["DeltaLw", "IIC", "AIIC"]
    });

    expect(missingResilient.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["resilientLayerThicknessMm_or_equivalent_family_row"],
      origin: "needs_input",
      unsupportedOutputs: ["DeltaLw"]
    });
    expect(missingResilient.supportedTargetOutputs).toEqual([]);
    expect(missingResilient.unsupportedTargetOutputs).toEqual(["DeltaLw"]);

    expect(exactDryRow.impact).toMatchObject({
      LnW: 68,
      basis: "peer_reviewed_floor_system_exact_match"
    });
    expect(exactDryRow.impact?.DeltaLw).toBeUndefined();
    expect(exactDryRow.supportedTargetOutputs).toEqual(["Ln,w"]);
    expect(exactDryRow.unsupportedTargetOutputs).toEqual(["DeltaLw"]);

    expect(astmAliases.impact?.DeltaLw).toBe(14.6);
    expect(astmAliases.supportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(astmAliases.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
  });

  it("keeps docs and current-gate runner aligned with Gate CY", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("DeltaLw 14.6");
      expect(contents, path).toContain("DeltaLw 20.7");
      expect(contents, path).toContain("DeltaLw 35.5");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-floor-composite-panel-delta-lw-owner-gate-cy-contract.test.ts");
  });
});
