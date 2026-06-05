import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateImpactOnly } from "./calculate-impact-only";
import {
  GATE_BO_REINFORCED_CONCRETE_COMPLETE_INPUT,
  GATE_BO_REINFORCED_CONCRETE_INCOMPLETE_INPUT
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bo";
import {
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB,
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_LN_W_TOLERANCE_DB
} from "./heavy-concrete-combined-impact-formula-corridor";
import { buildLayerCombinationResolverRegistryContract } from "./layer-combination-resolver-registry";
import { buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract } from "./layer-combination-resolver-runtime-candidate-surface-parity";
import {
  POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_LANDED_GATE,
  POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTION_STATUS
} from "./post-v1-floor-formula-gap-refresh-gate-i";
import {
  POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_CANDIDATE_ID,
  POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_LANDED_GATE,
  POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTION_STATUS,
  buildPostV1FloorReinforcedConcreteCombinedResolverGateJContract
} from "./post-v1-floor-reinforced-concrete-combined-resolver-gate-j";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

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

describe("post-V1 floor reinforced-concrete combined resolver Gate J", () => {
  it("maps the existing reinforced-concrete combined upper/lower formula into the shared resolver", () => {
    const contract = buildPostV1FloorReinforcedConcreteCombinedResolverGateJContract();
    const registry = buildLayerCombinationResolverRegistryContract();
    const surface = buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract();
    const candidate = registry.candidateDeclarations.find(
      (entry) => entry.id === POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_CANDIDATE_ID
    );
    const surfaceRow = surface.surfaceRows.find(
      (row) => row.selectedCandidateId === POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_CANDIDATE_ID
    );

    expect(contract).toMatchObject({
      candidateId: POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_CANDIDATE_ID,
      exactSourceRowsRemainFirst: true,
      landedGate: POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_LANDED_GATE,
      numericRuntimeValueMovement: false,
      previousGateI: {
        landedGate: POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_LANDED_GATE,
        selectedNextAction: POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTION_STATUS
      },
      runtimeBasisId: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      selectedNextAction: POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      supportedMetrics: ["Ln,w", "DeltaLw"],
      valuePins: [
        { metric: "Ln,w", value: 58.1 },
        { metric: "DeltaLw", value: 13.7 }
      ],
      visibleBoundaryPolicy: {
        missingPhysicalInputsBecomeNeedsInput: true,
        unsupportedAliases: ["IIC", "AIIC"]
      }
    });
    expect(contract.rejectedDefaultMoves).toEqual([
      "broad_source_crawl",
      "confidence_wording_pass",
      "docs_only_cleanup",
      "finite_scenario_pack",
      "astm_alias_promotion"
    ]);
    expect(contract.toleranceDb).toEqual({
      "DeltaLw": HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB,
      "Ln,w": HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_LN_W_TOLERANCE_DB
    });

    expect(registry.summary).toMatchObject({
      activeRuntimeCandidateCount: 43,
      candidateCount: 46
    });
    expect(candidate).toMatchObject({
      basis: "element_lab",
      errorBudgetTerms: [
        { metric: "Ln,w", notMeasuredEvidence: true, toleranceDb: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_LN_W_TOLERANCE_DB },
        {
          metric: "DeltaLw",
          notMeasuredEvidence: true,
          toleranceDb: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB
        }
      ],
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      route: "floor",
      runtimeSelectionState: "active_runtime_existing",
      supportedMetrics: ["Ln,w", "DeltaLw"]
    });
    expect(surfaceRow).toMatchObject({
      candidateKind: "source_absent_family_solver",
      runtimeBasisId: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Ln,w", "DeltaLw"]
    });
  });

  it("publishes complete reinforced-concrete combined lab values through the selected trace without ASTM aliasing", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: GATE_BO_REINFORCED_CONCRETE_COMPLETE_INPUT,
      targetOutputs: ["Ln,w", "DeltaLw", "IIC", "AIIC"]
    });

    expect(result.impact).toMatchObject({
      DeltaLw: 13.7,
      LnW: 58.1,
      basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      labOrField: "lab"
    });
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(result.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
      requestedBasis: "element_lab",
      runtimeBasisId: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      selectedCandidateId: POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_CANDIDATE_ID,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Ln,w", "DeltaLw"],
      valuePins: expect.arrayContaining([
        { metric: "Ln,w", value: 58.1 },
        { metric: "DeltaLw", value: 13.7 }
      ])
    });
  });

  it("keeps incomplete reinforced-concrete combined requests behind needs_input instead of publishing guesses", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: GATE_BO_REINFORCED_CONCRETE_INCOMPLETE_INPUT,
      targetOutputs: ["Ln,w", "DeltaLw", "IIC", "AIIC"]
    });

    expect(result.impact).toBeNull();
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ln,w", "DeltaLw", "IIC", "AIIC"]);
    expect(result.acousticAnswerBoundary).toMatchObject({
      method: "acoustic_calculator_answer_engine_v1_floor_impact_missing_physical_inputs",
      missingPhysicalInputs: ["loadBasisKgM2", "ceilingOrLowerAssembly"],
      origin: "needs_input",
      route: "floor",
      unsupportedOutputs: ["Ln,w", "DeltaLw"]
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
      requiredInputs: ["loadBasisKgM2", "ceilingOrLowerAssembly"],
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input",
      supportedMetrics: [],
      valuePins: []
    });
  });

  it("keeps docs and the current gate runner aligned on Gate J closeout and Gate K selection", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readRepoFile(relativePath);

      expect(contents, `${relativePath} records landed Gate I`).toContain(
        POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_LANDED_GATE
      );
      expect(contents, `${relativePath} records selected Gate J from Gate I`).toContain(
        POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_ACTION
      );
      expect(contents, `${relativePath} records landed Gate J`).toContain(
        POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_LANDED_GATE
      );
      expect(contents, `${relativePath} records Gate J status`).toContain(
        POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTION_STATUS
      );
      expect(contents, `${relativePath} records selected Gate K`).toContain(
        POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_ACTION
      );
      expect(contents, `${relativePath} records selected Gate K file`).toContain(
        POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_FILE
      );
      expect(contents, `${relativePath} records selected Gate K label`).toContain(
        POST_V1_FLOOR_REINFORCED_CONCRETE_COMBINED_RESOLVER_GATE_J_SELECTED_NEXT_LABEL
      );
      expect(contents, `${relativePath} records resolver counts`).toContain(
        "42 declared candidates and 39 active runtime-basis mappings"
      );
      expect(contents, `${relativePath} records reinforced-concrete values`).toContain("Ln,w 58.1");
      expect(contents, `${relativePath} records reinforced-concrete DeltaLw`).toContain("DeltaLw 13.7");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-floor-reinforced-concrete-combined-resolver-gate-j-contract.test.ts");
  });
});
