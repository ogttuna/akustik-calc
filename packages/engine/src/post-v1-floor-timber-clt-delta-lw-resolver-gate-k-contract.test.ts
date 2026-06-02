import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactPredictorInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_B_CLT_LAYERS,
  GATE_B_TIMBER_JOIST_LAYERS
} from "./timber-clt-floor-impact-delta-lw-input-contract";
import {
  MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS,
  TIMBER_CLT_DELTA_LW_FORMULA_REQUIRED_FIELDS,
  TIMBER_CLT_DELTA_LW_FORMULA_TOLERANCE_DB,
  TIMBER_JOIST_DELTA_LW_FORMULA_BASIS
} from "./timber-clt-floor-impact-delta-lw-runtime-corridor";
import { buildLayerCombinationResolverRegistryContract } from "./layer-combination-resolver-registry";
import { buildLayerCombinationResolverRuntimeCandidateAdapterContract } from "./layer-combination-resolver-runtime-candidate-adapter";
import { buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract } from "./layer-combination-resolver-runtime-candidate-surface-parity";
import {
  POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_LANDED_GATE,
  POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTION_STATUS
} from "./post-v1-floor-reinforced-concrete-combined-resolver-gate-j";
import {
  POST_V1_FLOOR_MASS_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_CANDIDATE_ID,
  POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_LANDED_GATE,
  POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTION_STATUS,
  POST_V1_FLOOR_TIMBER_JOIST_DELTA_LW_RESOLVER_GATE_K_CANDIDATE_ID,
  POST_V1_GATE_K_MASS_TIMBER_CLT_COMPLETE_INPUT,
  POST_V1_GATE_K_TIMBER_JOIST_COMPLETE_INPUT,
  buildPostV1FloorTimberCltDeltaLwResolverGateKContract
} from "./post-v1-floor-timber-clt-delta-lw-resolver-gate-k";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const LAB_OUTPUTS = ["Ln,w", "DeltaLw", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const INCOMPLETE_CLT_INPUT = {
  baseSlab: {
    densityKgM3: 470,
    materialClass: "clt_panel",
    thicknessMm: 145
  },
  floorCovering: {
    densityKgM3: 1150,
    materialClass: "dry_floating_gypsum_fiberboard",
    mode: "material_layer",
    thicknessMm: 22
  },
  impactSystemType: "dry_floating_floor",
  lowerTreatment: {
    type: "none"
  },
  resilientLayer: {
    thicknessMm: 20
  },
  structuralSupportType: "mass_timber_clt",
  upperFill: {
    densityKgM3: 500,
    materialClass: "dry_granular_fill",
    thicknessMm: 70
  }
} as const satisfies ImpactPredictorInput;

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor timber/CLT DeltaLw resolver Gate K", () => {
  it("maps the existing timber and CLT DeltaLw formula bases into the shared resolver", () => {
    const contract = buildPostV1FloorTimberCltDeltaLwResolverGateKContract();
    const registry = buildLayerCombinationResolverRegistryContract();
    const adapter = buildLayerCombinationResolverRuntimeCandidateAdapterContract();
    const surface = buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract();
    const timberCandidate = registry.candidateDeclarations.find(
      (entry) => entry.id === POST_V1_FLOOR_TIMBER_JOIST_DELTA_LW_RESOLVER_GATE_K_CANDIDATE_ID
    );
    const cltCandidate = registry.candidateDeclarations.find(
      (entry) => entry.id === POST_V1_FLOOR_MASS_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_CANDIDATE_ID
    );

    expect(contract).toMatchObject({
      candidateIds: [
        POST_V1_FLOOR_TIMBER_JOIST_DELTA_LW_RESOLVER_GATE_K_CANDIDATE_ID,
        POST_V1_FLOOR_MASS_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_CANDIDATE_ID
      ],
      exactOrPublishedLnWCompanionsRemainSeparate: true,
      landedGate: POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_LANDED_GATE,
      numericRuntimeValueMovement: false,
      previousGateJ: {
        landedGate: POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_LANDED_GATE,
        selectedNextAction: POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTION_STATUS
      },
      requiredPhysicalInputs: TIMBER_CLT_DELTA_LW_FORMULA_REQUIRED_FIELDS,
      runtimeBasisIds: [
        TIMBER_JOIST_DELTA_LW_FORMULA_BASIS,
        MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS
      ],
      selectedNextAction: POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      supportedMetrics: ["DeltaLw"],
      valuePins: [
        { family: "timber_joists", metric: "DeltaLw", value: 25.2 },
        { family: "mass_timber_clt", metric: "DeltaLw", value: 22.6 }
      ],
      visibleBoundaryPolicy: {
        missingPhysicalInputsBecomeNeedsInput: true,
        unsupportedAliases: ["IIC", "AIIC", "L'n,w", "L'nT,w"]
      }
    });
    expect(contract.rejectedDefaultMoves).toEqual([
      "broad_source_crawl",
      "confidence_wording_pass",
      "docs_only_cleanup",
      "finite_scenario_pack",
      "astm_alias_promotion"
    ]);
    expect(contract.toleranceDb).toBe(TIMBER_CLT_DELTA_LW_FORMULA_TOLERANCE_DB);
    expect(registry.summary).toMatchObject({
      activeRuntimeCandidateCount: 39,
      candidateCount: 42
    });
    expect(adapter.summary.adaptedRuntimeBasisCount).toBe(39);
    expect(surface.summary.surfaceRowCount).toBe(42);

    for (const [candidate, basis] of [
      [timberCandidate, TIMBER_JOIST_DELTA_LW_FORMULA_BASIS],
      [cltCandidate, MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS]
    ] as const) {
      expect(candidate).toMatchObject({
        basis: "element_lab",
        errorBudgetTerms: [
          { metric: "DeltaLw", notMeasuredEvidence: true, toleranceDb: TIMBER_CLT_DELTA_LW_FORMULA_TOLERANCE_DB }
        ],
        kind: "source_absent_family_solver",
        ownedRuntimeBasisId: basis,
        route: "floor",
        runtimeSelectionState: "active_runtime_existing",
        supportedMetrics: ["DeltaLw"]
      });
    }
  });

  it("selects the timber and CLT DeltaLw candidates without relabeling Ln,w companions", () => {
    const timber = calculateAssembly(GATE_B_TIMBER_JOIST_LAYERS, {
      impactPredictorInput: POST_V1_GATE_K_TIMBER_JOIST_COMPLETE_INPUT,
      targetOutputs: LAB_OUTPUTS
    });
    const clt = calculateAssembly(GATE_B_CLT_LAYERS, {
      impactPredictorInput: POST_V1_GATE_K_MASS_TIMBER_CLT_COMPLETE_INPUT,
      targetOutputs: LAB_OUTPUTS
    });

    expect(timber.impact).toMatchObject({
      DeltaLw: 25.2,
      LnW: 51,
      metricBasis: {
        DeltaLw: TIMBER_JOIST_DELTA_LW_FORMULA_BASIS
      }
    });
    expect(timber.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(timber.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(timber.layerCombinationResolverTrace).toMatchObject({
      boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
      runtimeBasisId: TIMBER_JOIST_DELTA_LW_FORMULA_BASIS,
      selectedCandidateId: POST_V1_FLOOR_TIMBER_JOIST_DELTA_LW_RESOLVER_GATE_K_CANDIDATE_ID,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["DeltaLw"],
      valuePins: [{ metric: "DeltaLw", value: 25.2 }]
    });

    expect(clt.impact).toMatchObject({
      DeltaLw: 22.6,
      LnW: 50,
      metricBasis: {
        DeltaLw: MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS
      }
    });
    expect(clt.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(clt.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(clt.layerCombinationResolverTrace).toMatchObject({
      boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
      runtimeBasisId: MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS,
      selectedCandidateId: POST_V1_FLOOR_MASS_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_CANDIDATE_ID,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["DeltaLw"],
      valuePins: [{ metric: "DeltaLw", value: 22.6 }]
    });
  });

  it("keeps incomplete timber/CLT DeltaLw requests behind needs_input instead of publishing guesses", () => {
    const result = calculateAssembly(GATE_B_CLT_LAYERS, {
      impactPredictorInput: INCOMPLETE_CLT_INPUT,
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.impact?.LnW).toBe(50);
    expect(result.impact?.DeltaLw).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual(["Ln,w"]);
    expect(result.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(result.acousticAnswerBoundary).toMatchObject({
      method: "acoustic_calculator_answer_engine_v1_floor_impact_missing_physical_inputs",
      missingPhysicalInputs: ["resilientLayerDynamicStiffnessMNm3", "loadBasisKgM2"],
      origin: "needs_input",
      route: "floor",
      unsupportedOutputs: ["DeltaLw"]
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requiredInputs: ["resilientLayerDynamicStiffnessMNm3", "loadBasisKgM2"],
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input",
      supportedMetrics: [],
      valuePins: []
    });
  });

  it("keeps docs and the current gate runner aligned on Gate K closeout and Gate L selection", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readRepoFile(relativePath);

      expect(contents, `${relativePath} records landed Gate J`).toContain(
        POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_LANDED_GATE
      );
      expect(contents, `${relativePath} records selected Gate K from Gate J`).toContain(
        POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_ACTION
      );
      expect(contents, `${relativePath} records landed Gate K`).toContain(
        POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_LANDED_GATE
      );
      expect(contents, `${relativePath} records Gate K status`).toContain(
        POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTION_STATUS
      );
      expect(contents, `${relativePath} records selected Gate L`).toContain(
        POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_ACTION
      );
      expect(contents, `${relativePath} records selected Gate L file`).toContain(
        POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_FILE
      );
      expect(contents, `${relativePath} records selected Gate L label`).toContain(
        POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_LABEL
      );
      expect(contents, `${relativePath} records resolver counts`).toContain(
        "42 declared candidates and 39 active runtime-basis mappings"
      );
      expect(contents, `${relativePath} records timber DeltaLw`).toContain("DeltaLw 25.2");
      expect(contents, `${relativePath} records CLT DeltaLw`).toContain("DeltaLw 22.6");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-floor-timber-clt-delta-lw-resolver-gate-k-contract.test.ts");
  });
});
