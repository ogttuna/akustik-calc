import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactFieldContext, LayerInput, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { getDefaultMaterialCatalog } from "./material-catalog";
import {
  POST_V1_GATE_CN_NO_RUNTIME_COUNTERS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-cn";
import {
  POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_LANDED_GATE,
  POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTION_STATUS,
  POST_V1_GATE_CO_COUNTERS,
  POST_V1_GATE_CO_TARGET_OUTPUTS,
  POST_V1_GATE_CO_VALUE_PINS,
  summarizePostV1FloorVisibleLayerUpperPackageDeltaLwGateCO
} from "./post-v1-floor-visible-layer-upper-package-delta-lw-gate-co";
import {
  POST_V1_GATE_K_MASS_TIMBER_CLT_COMPLETE_INPUT,
  POST_V1_GATE_K_TIMBER_JOIST_COMPLETE_INPUT
} from "./post-v1-floor-timber-clt-delta-lw-resolver-gate-k";
import {
  GATE_B_CLT_LAYERS,
  GATE_B_TIMBER_JOIST_LAYERS
} from "./timber-clt-floor-impact-delta-lw-input-contract";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const LAB_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const FIELD_CONTEXT = {
  ci50_2500Db: 3,
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;
const MISSING_DYNAMIC_UNDERLAY_ID = "gate_co_underlay_missing_dynamic";
const TIMBER_MISSING_DYNAMIC_LAYERS = GATE_B_TIMBER_JOIST_LAYERS.map((layer) =>
  layer.floorRole === "resilient_layer"
    ? { ...layer, materialId: MISSING_DYNAMIC_UNDERLAY_ID }
    : layer
) as readonly LayerInput[];

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

function catalogWithMissingDynamicUnderlay(): readonly MaterialDefinition[] {
  const catalog = getDefaultMaterialCatalog();
  const base = catalog.find((material) => material.id === "generic_resilient_underlay");

  if (!base) {
    throw new Error("Gate CO requires generic_resilient_underlay in the default catalog.");
  }

  return [
    ...catalog,
    {
      ...base,
      id: MISSING_DYNAMIC_UNDERLAY_ID,
      impact: {},
      name: "Gate CO underlay without dynamic stiffness owner"
    }
  ];
}

describe("post-V1 floor visible-layer upper-package DeltaLw Gate CO", () => {
  it("lands Gate CO after Gate CN and selects the next numeric coverage rerank", () => {
    const summary = summarizePostV1FloorVisibleLayerUpperPackageDeltaLwGateCO();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_cn_landed_no_runtime_selected_floor_visible_layer_upper_package_delta_lw_gate_co"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_ACTION).toBe(
      POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-floor-visible-layer-upper-package-delta-lw-gate-co-contract.test.ts"
    );
    expect(summary).toMatchObject({
      counters: POST_V1_GATE_CO_COUNTERS,
      landedGate: POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_CO_TARGET_OUTPUTS,
      valuePins: POST_V1_GATE_CO_VALUE_PINS
    });
  });

  it("routes visible timber and CLT upper packages to the existing DeltaLw formula owner", () => {
    const cases = [
      {
        context: {
          loadBasisKgM2: POST_V1_GATE_K_TIMBER_JOIST_COMPLETE_INPUT.loadBasisKgM2,
          resilientLayerDynamicStiffnessMNm3:
            POST_V1_GATE_K_TIMBER_JOIST_COMPLETE_INPUT.resilientLayer.dynamicStiffnessMNm3
        },
        layers: GATE_B_TIMBER_JOIST_LAYERS,
        pin: POST_V1_GATE_CO_VALUE_PINS.timberVisibleUpperPackage
      },
      {
        context: {
          loadBasisKgM2: POST_V1_GATE_K_MASS_TIMBER_CLT_COMPLETE_INPUT.loadBasisKgM2,
          resilientLayerDynamicStiffnessMNm3:
            POST_V1_GATE_K_MASS_TIMBER_CLT_COMPLETE_INPUT.resilientLayer.dynamicStiffnessMNm3
        },
        layers: GATE_B_CLT_LAYERS,
        pin: POST_V1_GATE_CO_VALUE_PINS.cltVisibleUpperPackage
      }
    ] as const;

    for (const testCase of cases) {
      const result = calculateAssembly(testCase.layers, {
        floorImpactContext: testCase.context,
        impactFieldContext: FIELD_CONTEXT,
        targetOutputs: POST_V1_GATE_CO_TARGET_OUTPUTS
      });

      expect(result.supportedTargetOutputs, testCase.pin.family).toEqual([...POST_V1_GATE_CO_TARGET_OUTPUTS]);
      expect(result.unsupportedTargetOutputs, testCase.pin.family).toEqual([]);
      expect(result.impact).toMatchObject({
        DeltaLw: testCase.pin.metrics["DeltaLw"],
        LPrimeNT50: testCase.pin.metrics["L'nT,50"],
        LPrimeNTw: testCase.pin.metrics["L'nT,w"],
        LPrimeNW: testCase.pin.metrics["L'n,w"],
        LnW: testCase.pin.metrics["Ln,w"],
        metricBasis: {
          DeltaLw: testCase.pin.metricBasis
        }
      });
      expect(result.impact?.metricBasis?.LnW, testCase.pin.family).not.toBe(testCase.pin.metricBasis);
      expect(result.impact?.notes, testCase.pin.family).toContain(
        "DeltaLw companion was carried from the timber/CLT formula corridor while Ln,w stayed on its exact or published-family lane."
      );
      expect(result.impactPredictorStatus, testCase.pin.family).toMatchObject({
        active: true,
        implementedFormulaEstimate: true,
        inputMode: "derived_from_visible_layers"
      });
    }
  });

  it("keeps missing physical inputs as needs_input instead of guessing DeltaLw", () => {
    const missingLoad = calculateAssembly(GATE_B_CLT_LAYERS, {
      floorImpactContext: {
        resilientLayerDynamicStiffnessMNm3:
          POST_V1_GATE_K_MASS_TIMBER_CLT_COMPLETE_INPUT.resilientLayer.dynamicStiffnessMNm3
      },
      targetOutputs: ["DeltaLw"] as const satisfies readonly RequestedOutputId[]
    });
    const missingDynamic = calculateAssembly(TIMBER_MISSING_DYNAMIC_LAYERS, {
      catalog: catalogWithMissingDynamicUnderlay(),
      floorImpactContext: {
        loadBasisKgM2: POST_V1_GATE_K_TIMBER_JOIST_COMPLETE_INPUT.loadBasisKgM2
      },
      targetOutputs: ["DeltaLw"] as const satisfies readonly RequestedOutputId[]
    });

    expect(missingLoad.supportedTargetOutputs).toEqual([]);
    expect(missingLoad.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(missingLoad.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["loadBasisKgM2"],
      origin: "needs_input",
      unsupportedOutputs: ["DeltaLw"]
    });
    expect(missingLoad.impact?.DeltaLw).toBeUndefined();

    expect(missingDynamic.supportedTargetOutputs).toEqual([]);
    expect(missingDynamic.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(missingDynamic.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["resilientLayerDynamicStiffnessMNm3"],
      origin: "needs_input",
      unsupportedOutputs: ["DeltaLw"]
    });
    expect(missingDynamic.impact?.DeltaLw).toBeUndefined();
  });

  it("does not alias ISO DeltaLw to ASTM IIC or AIIC", () => {
    const result = calculateAssembly(GATE_B_TIMBER_JOIST_LAYERS, {
      floorImpactContext: {
        loadBasisKgM2: POST_V1_GATE_K_TIMBER_JOIST_COMPLETE_INPUT.loadBasisKgM2,
        resilientLayerDynamicStiffnessMNm3:
          POST_V1_GATE_K_TIMBER_JOIST_COMPLETE_INPUT.resilientLayer.dynamicStiffnessMNm3
      },
      targetOutputs: ASTM_OUTPUTS
    });
    const lab = calculateAssembly(GATE_B_TIMBER_JOIST_LAYERS, {
      floorImpactContext: {
        loadBasisKgM2: POST_V1_GATE_K_TIMBER_JOIST_COMPLETE_INPUT.loadBasisKgM2,
        resilientLayerDynamicStiffnessMNm3:
          POST_V1_GATE_K_TIMBER_JOIST_COMPLETE_INPUT.resilientLayer.dynamicStiffnessMNm3
      },
      targetOutputs: LAB_OUTPUTS
    });

    expect(lab.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(lab.impact?.DeltaLw).toBe(POST_V1_GATE_CO_VALUE_PINS.timberVisibleUpperPackage.metrics["DeltaLw"]);
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(result.acousticAnswerBoundary).toMatchObject({
      origin: "unsupported",
      unsupportedOutputs: ["IIC", "AIIC"]
    });
    expect(result.impact?.IIC).toBeUndefined();
    expect(result.impact?.AIIC).toBeUndefined();
  });

  it("keeps docs and current-gate runner aligned with the landed Gate CO runtime move", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("DeltaLw 25.2");
      expect(contents, path).toContain("DeltaLw 22.6");
    }

    expect(POST_V1_GATE_CN_NO_RUNTIME_COUNTERS.estimatedNextNewCalculableLayerTemplates).toBe(
      POST_V1_GATE_CO_COUNTERS.newCalculableLayerTemplates
    );
    expect(POST_V1_GATE_CN_NO_RUNTIME_COUNTERS.estimatedNextNewCalculableRequestShapes).toBe(
      POST_V1_GATE_CO_COUNTERS.newCalculableRequestShapes
    );
    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-floor-visible-layer-upper-package-delta-lw-gate-co.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-floor-visible-layer-upper-package-delta-lw-gate-co-contract.test.ts");
  });
});
