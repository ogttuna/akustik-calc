import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_COMPANION_NOTE,
  MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_BASIS,
  MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_PAIRS,
  MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SELECTED_CANDIDATE_ID,
  buildMassTimberCltUpperPackageDeltaLwCompanion
} from "./mass-timber-clt-upper-package-delta-lw-runtime";
import { resultSnapshot } from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_LANDED_GATE,
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTION_STATUS,
  POST_V1_GATE_DZ_ACCEPTED_SAME_SOURCE_PAIRS,
  POST_V1_GATE_DZ_COUNTERS,
  POST_V1_GATE_DZ_OWNER_ID
} from "./post-v1-floor-mass-timber-clt-upper-package-delta-lw-owner-gate-dz";
import {
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_LANDED_GATE,
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTION_STATUS,
  POST_V1_GATE_EA_COUNTERS,
  summarizePostV1GateEAMassTimberCltUpperPackageDeltaLwRuntime
} from "./post-v1-floor-mass-timber-clt-upper-package-delta-lw-runtime-gate-ea";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

const GATE_EA_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

const GATE_EA_ACCEPTED_LAYER_FIXTURES = {
  tuas_c3_clt260_measured_2026: [
    { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
    { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
    { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 13 },
    { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
    { floorRole: "floating_screed", materialId: "screed", thicknessMm: 3 },
    { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
    { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
  ],
  tuas_c4_clt260_measured_2026: [
    { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
    { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
    { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 50 },
    { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
    { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
    { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
  ],
  tuas_c7_clt260_measured_2026: [
    { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
    { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
    { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: 1 },
    { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
    { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 35 },
    { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
  ],
  tuas_x3_clt140_measured_2026: [
    { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
    { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
    { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 13 },
    { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
    { floorRole: "floating_screed", materialId: "screed", thicknessMm: 3 },
    { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
    { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
  ],
  tuas_x4_clt140_measured_2026: [
    { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
    { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
    { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 50 },
    { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
    { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
    { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
  ]
} as const satisfies Record<string, readonly LayerInput[]>;

const REJECTED_EXACT_SYSTEM_IDS = [
  "tuas_x2_clt140_measured_2026",
  "tuas_x5_clt140_measured_2026",
  "tuas_c2_clt260_measured_2026",
  "tuas_c5_clt260_measured_2026",
  "tuas_c2c_clt260_measured_2026",
  "tuas_c3c_clt260_measured_2026",
  "tuas_c4c_clt260_measured_2026",
  "tuas_c5c_clt260_measured_2026",
  "tuas_c7c_clt260_measured_2026"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor mass-timber CLT upper-package DeltaLw runtime Gate EA", () => {
  it("lands after Gate DZ and selects the Gate EB numeric coverage rerank", () => {
    const summary = summarizePostV1GateEAMassTimberCltUpperPackageDeltaLwRuntime();

    expect(POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTION_STATUS).toBe(
      "post_v1_floor_mass_timber_clt_upper_package_delta_lw_owner_gate_dz_landed_no_runtime_selected_mass_timber_clt_upper_package_delta_lw_runtime_gate_ea"
    );
    expect(POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_ACTION).toBe(
      POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_LANDED_GATE
    );
    expect(summary).toMatchObject({
      acceptedSameSourcePairs: MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_PAIRS,
      counters: POST_V1_GATE_EA_COUNTERS,
      landedGate: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_LANDED_GATE,
      previousGateDZ: {
        acceptedSameSourcePairs: POST_V1_GATE_DZ_ACCEPTED_SAME_SOURCE_PAIRS,
        counters: POST_V1_GATE_DZ_COUNTERS,
        landedGate: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_LANDED_GATE,
        ownerId: POST_V1_GATE_DZ_OWNER_ID,
        selectedNextAction: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTION_STATUS
      },
      runtimeBasisId: MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_BASIS,
      selectedCandidateId: MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTION_STATUS,
      sourceRowsAreAnchorsNotProductCatalog: true,
      targetOutputs: GATE_EA_TARGET_OUTPUTS
    });
    expect(POST_V1_GATE_EA_COUNTERS).toMatchObject({
      astmAliasesPromoted: 0,
      formulaCorridorGuardsWeakened: 0,
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 5,
      newCalculableRequestShapes: 5,
      runtimeCorrectedLayerTemplates: 5,
      runtimeCorrectedRequestShapes: 5,
      sourceRowsImported: 0
    });
  });

  it("calculates DeltaLw beside exact Ln,w for the five accepted visible CLT upper-package stacks", () => {
    for (const pair of MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_PAIRS) {
      const result = calculateAssembly(GATE_EA_ACCEPTED_LAYER_FIXTURES[pair.treatedSystemId], {
        targetOutputs: GATE_EA_TARGET_OUTPUTS
      });

      expect(resultSnapshot(result)).toMatchObject({
        floorSystemEstimateBasis: null,
        floorSystemMatchId: pair.treatedSystemId,
        impactBasis: MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_BASIS,
        lnW: pair.treatedLnW,
        supportedTargetOutputs: ["Ln,w", "DeltaLw"],
        unsupportedTargetOutputs: []
      });
      expect(result.impact).toMatchObject({
        DeltaLw: pair.deltaLw,
        LnW: pair.treatedLnW,
        bareReferenceLnW: pair.referenceLnW,
        metricBasis: {
          DeltaLw: MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_BASIS,
          LnW: MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_BASIS
        },
        referenceFloorType: pair.referenceSystemId,
        treatedReferenceLnW: pair.treatedLnW
      });
      expect(result.impact?.availableOutputs).toEqual(
        expect.arrayContaining(["Ln,w", "DeltaLw"])
      );
      expect(result.impact?.estimateCandidateIds).toEqual(
        expect.arrayContaining([
          MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SELECTED_CANDIDATE_ID,
          pair.referenceSystemId,
          pair.treatedSystemId,
          pair.eligibleRuntimeTemplateId
        ])
      );
      expect(result.impact?.notes).toContain(MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_COMPANION_NOTE);
    }
  });

  it("keeps accepted DeltaLw alive for single-output and impact-only exact-system requests", () => {
    for (const pair of MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_PAIRS) {
      const singleOutput = calculateAssembly(GATE_EA_ACCEPTED_LAYER_FIXTURES[pair.treatedSystemId], {
        targetOutputs: ["DeltaLw"]
      });
      const impactOnly = calculateImpactOnly([], {
        officialFloorSystemId: pair.treatedSystemId,
        targetOutputs: GATE_EA_TARGET_OUTPUTS
      });
      const companion = buildMassTimberCltUpperPackageDeltaLwCompanion(impactOnly.floorSystemMatch?.system);

      expect(singleOutput.impact).toMatchObject({
        DeltaLw: pair.deltaLw,
        LnW: pair.treatedLnW,
        basis: MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_BASIS
      });
      expect(singleOutput.supportedTargetOutputs).toEqual(["DeltaLw"]);
      expect(singleOutput.unsupportedTargetOutputs).toEqual([]);

      expect(impactOnly.floorSystemMatch?.system.id).toBe(pair.treatedSystemId);
      expect(impactOnly.impact).toMatchObject({
        DeltaLw: pair.deltaLw,
        LnW: pair.treatedLnW,
        basis: MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_BASIS
      });
      expect(impactOnly.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
      expect(impactOnly.unsupportedTargetOutputs).toEqual([]);
      expect(companion).toMatchObject({
        DeltaLw: pair.deltaLw,
        bareReferenceLnW: pair.referenceLnW,
        treatedReferenceLnW: pair.treatedLnW
      });
    }
  });

  it("does not promote baselines, negative deltas, lower-treatment combined rows, or ASTM aliases", () => {
    for (const id of REJECTED_EXACT_SYSTEM_IDS) {
      const result = calculateImpactOnly([], {
        officialFloorSystemId: id,
        targetOutputs: ["Ln,w", "DeltaLw"]
      });

      expect(result.impact?.LnW).toBeTypeOf("number");
      expect(result.impact?.DeltaLw, id).toBeUndefined();
      expect(result.supportedTargetOutputs, id).toEqual(["Ln,w"]);
      expect(result.unsupportedTargetOutputs, id).toEqual(["DeltaLw"]);
      expect(buildMassTimberCltUpperPackageDeltaLwCompanion(result.floorSystemMatch?.system), id).toBeNull();
    }

    const acceptedAstmAlias = calculateAssembly(
      GATE_EA_ACCEPTED_LAYER_FIXTURES.tuas_x3_clt140_measured_2026,
      { targetOutputs: ["DeltaLw", "IIC", "AIIC"] }
    );

    expect(acceptedAstmAlias.impact).toMatchObject({ DeltaLw: 9 });
    expect(acceptedAstmAlias.impact?.IIC).toBeUndefined();
    expect(acceptedAstmAlias.impact?.AIIC).toBeUndefined();
    expect(acceptedAstmAlias.supportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(acceptedAstmAlias.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
  });

  it("keeps docs and current-gate runner aligned with Gate EA closeout and Gate EB selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(
        POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTION_STATUS
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_ACTION
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_FILE
      );
      expect(contents, path).toContain(MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("newCalculableLayerTemplates: 5");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-v1-floor-mass-timber-clt-upper-package-delta-lw-runtime-gate-ea-contract.test.ts"
    );
  });
});
