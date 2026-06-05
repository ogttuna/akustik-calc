import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_MISSING_FREQUENCY_WARNING,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID
} from "./company-internal-opening-leak-building-runtime-corridor";
import {
  COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_BUILDING_CONTEXT,
  COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_FIELD_CONTEXT
} from "./company-internal-opening-leak-building-runtime-corridor-contract";
import { GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD } from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";
import {
  POST_V1_GATE_CK_BUILDING_TARGET_OUTPUTS,
  POST_V1_GATE_CK_COUNTERS,
  POST_V1_GATE_CK_FIELD_TARGET_OUTPUTS,
  POST_V1_GATE_CK_VALUE_PINS,
  POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_LANDED_GATE,
  POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_ACTION,
  POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_FILE,
  POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_LABEL,
  POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTION_STATUS,
  summarizePostV1OpeningLeakCompositeWallAdaptersGateCK
} from "./post-v1-opening-leak-composite-wall-adapters-gate-ck";
import {
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_ACTION,
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_FILE,
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTION_STATUS
} from "./post-v1-wall-common-auto-topology-expansion-gate-cj";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const HOST_WALL = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const satisfies readonly LayerInput[];

const TOP_LEVEL_FIELD_OPENING_LEAK_CONTEXT = {
  ...COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_FIELD_CONTEXT,
  openingLeakFieldBuildingAdapterBoundary: undefined
} as const satisfies AirborneContext;

const TOP_LEVEL_BUILDING_OPENING_LEAK_CONTEXT = {
  ...COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_BUILDING_CONTEXT,
  openingLeakFieldBuildingAdapterBoundary: undefined
} as const satisfies AirborneContext;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 opening/leak composite wall adapters Gate CK", () => {
  it("lands Gate CK after Gate CJ and selects the next numeric coverage rerank", () => {
    const summary = summarizePostV1OpeningLeakCompositeWallAdaptersGateCK();

    expect(POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTION_STATUS).toBe(
      "post_v1_wall_common_auto_topology_expansion_gate_cj_landed_runtime_selected_opening_leak_composite_wall_adapters_gate_ck"
    );
    expect(POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_ACTION).toBe(
      POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_LANDED_GATE
    );
    expect(POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts"
    );
    expect(summary).toMatchObject({
      counters: POST_V1_GATE_CK_COUNTERS,
      landedGate: POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_LANDED_GATE,
      selectedNextAction: POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTION_STATUS,
      valuePins: POST_V1_GATE_CK_VALUE_PINS
    });
  });

  it("routes explicit top-level field opening/leak layers through the field area-energy adapter without a hidden boundary flag", () => {
    const result = calculateAssembly(HOST_WALL, {
      airborneContext: TOP_LEVEL_FIELD_OPENING_LEAK_CONTEXT,
      calculator: "dynamic",
      targetOutputs: POST_V1_GATE_CK_FIELD_TARGET_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual(["R'w", "Dn,w", "DnT,w"]);
    expect(result.unsupportedTargetOutputs).toEqual(["Dn,A"]);
    expect(result.metrics).toMatchObject({
      estimatedDnADb: undefined,
      estimatedDnTwDb: POST_V1_GATE_CK_VALUE_PINS.field.metrics["DnT,w"],
      estimatedDnWDb: POST_V1_GATE_CK_VALUE_PINS.field.metrics["Dn,w"],
      estimatedRwDb: 38.2,
      estimatedRwPrimeDb: POST_V1_GATE_CK_VALUE_PINS.field.metrics["R'w"]
    });
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: POST_V1_GATE_CK_VALUE_PINS.field.errorBudgetDb,
      method: COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(result.airborneBasis?.requiredInputs).not.toContain("openingLeakFieldBuildingAdapterBoundary");
    expect(result.airborneBasis?.requiredInputs).toContain("openingLeakElementsOrHostWallAreaRouteOwner");
    expect(result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.warnings).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_MISSING_FREQUENCY_WARNING);
  });

  it("routes explicit top-level building opening/leak layers through the building adapter without field/building metric aliases", () => {
    const result = calculateAssembly(HOST_WALL, {
      airborneContext: TOP_LEVEL_BUILDING_OPENING_LEAK_CONTEXT,
      calculator: "dynamic",
      targetOutputs: POST_V1_GATE_CK_BUILDING_TARGET_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(result.unsupportedTargetOutputs).toEqual(["DnT,A"]);
    expect(result.metrics).toMatchObject({
      estimatedDnTADb: undefined,
      estimatedDnTwDb: POST_V1_GATE_CK_VALUE_PINS.building.metrics["DnT,w"],
      estimatedDnWDb: undefined,
      estimatedRwDb: 38.2,
      estimatedRwPrimeDb: POST_V1_GATE_CK_VALUE_PINS.building.metrics["R'w"]
    });
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: POST_V1_GATE_CK_VALUE_PINS.building.errorBudgetDb,
      method: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
  });

  it("keeps missing physical inputs and lab alias boundaries fail-closed", () => {
    const missingRoomRt = calculateAssembly(HOST_WALL, {
      airborneContext: {
        ...TOP_LEVEL_FIELD_OPENING_LEAK_CONTEXT,
        receivingRoomRt60S: undefined
      },
      calculator: "dynamic",
      targetOutputs: ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[]
    });
    const labAlias = calculateAssembly(HOST_WALL, {
      airborneContext: {
        contextMode: "element_lab",
        hostWallAreaM2: 12,
        openingLeakElements: TOP_LEVEL_FIELD_OPENING_LEAK_CONTEXT.openingLeakElements
      },
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[]
    });

    expect(missingRoomRt.supportedTargetOutputs).toEqual([]);
    expect(missingRoomRt.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(missingRoomRt.airborneBasis).toMatchObject({
      method: COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
      missingPhysicalInputs: ["receivingRoomRt60S"],
      origin: "needs_input"
    });

    expect(labAlias.supportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(labAlias.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(labAlias.airborneBasis).toMatchObject({
      method: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
  });

  it("keeps docs and current-gate runner aligned with the landed Gate CK runtime move", () => {
    const docs = [
      "AGENTS.md",
      "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
      "docs/calculator/CURRENT_STATE.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
      "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
    ] as const;

    for (const path of docs) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("opening/leak");
      expect(contents, path).toContain("R'w 36.4");
      expect(contents, path).toContain("DnT,w 32.1");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts");
  });
});
