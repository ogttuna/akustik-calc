import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { FLAT_LIST_MULTILEAF_GUARD_STRATEGY } from "./dynamic-airborne-flat-list-multileaf-guard";
import {
  isFlatListSplitInternalRockwoolDiagnostic,
  ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING,
  ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_B
} from "./rockwool-split-triple-leaf-numeric-source-closure";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

const WALL_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const GROUPED_TRIPLE_LEAF_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"] as const satisfies readonly RequestedOutputId[];

const PDF_LIKE_ADJACENT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const PDF_LIKE_SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function wallResult(input: {
  airborneContext: AirborneContext;
  layers: readonly LayerInput[];
  outputs: readonly RequestedOutputId[];
}) {
  return calculateAssembly(input.layers, {
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    targetOutputs: input.outputs
  });
}

describe("Rockwool split triple-leaf numeric source closure Gate B", () => {
  it("lands Gate B as output-support withholding, not a numeric retune", () => {
    expect(ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_B).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate:
        "gate_b_withheld_flat_list_split_internal_leaf_exact_outputs_until_grouped_topology_or_source_owned_model",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: true,
      proposalReportCopyChange: false,
      proposalReportValueChange: true,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeSupportBehaviorChange: true,
      selectedNextAction:
        "gate_c_closeout_split_triple_leaf_numeric_source_closure_and_select_next_accuracy_slice",
      selectedNextFile:
        "packages/engine/src/post-rockwool-split-triple-leaf-numeric-source-closure-v1-next-slice-selection-contract.test.ts",
      selectionStatus:
        "gate_b_withheld_flat_list_split_internal_leaf_supported_outputs_selected_closeout",
      sliceId: "rockwool_split_triple_leaf_numeric_source_closure_v1",
      supportDemotion: true,
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });
  });

  it("withholds flat-list split/internal Rockwool target outputs while preserving diagnostic metrics", () => {
    const lab = wallResult({
      airborneContext: WALL_LAB_CONTEXT,
      layers: PDF_LIKE_SPLIT_ROCKWOOL_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const field = wallResult({
      airborneContext: WALL_FIELD_CONTEXT,
      layers: PDF_LIKE_SPLIT_ROCKWOOL_STACK,
      outputs: WALL_FIELD_OUTPUTS
    });

    expect(lab.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "low",
      detectedFamily: "multileaf_multicavity",
      strategy: "multileaf_screening_blend"
    });
    expect(lab.metrics).toMatchObject({
      estimatedRwDb: 41,
      estimatedStc: 41
    });
    expect(lab.supportedTargetOutputs).toEqual([]);
    expect(lab.unsupportedTargetOutputs).toEqual([...WALL_LAB_OUTPUTS]);
    expect(lab.warnings).toContain(ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING);
    expect(lab.warnings.join("\n")).toContain("Unsupported target outputs: Rw, STC, C, Ctr");
    expect(
      isFlatListSplitInternalRockwoolDiagnostic({
        airborneContext: WALL_LAB_CONTEXT,
        layers: lab.layers,
        trace: lab.dynamicAirborneTrace
      })
    ).toBe(true);

    expect(field.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "low",
      detectedFamily: "multileaf_multicavity",
      strategy: "multileaf_screening_blend"
    });
    expect(field.metrics).toMatchObject({
      estimatedDnTwDb: 40,
      estimatedRwPrimeDb: 39
    });
    expect(field.supportedTargetOutputs).toEqual([]);
    expect(field.unsupportedTargetOutputs).toEqual([...WALL_FIELD_OUTPUTS]);
    expect(field.warnings).toContain(ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING);
  });

  it("keeps adjacent Rockwool on the corrected double-leaf output lane", () => {
    const lab = wallResult({
      airborneContext: WALL_LAB_CONTEXT,
      layers: PDF_LIKE_ADJACENT_ROCKWOOL_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const field = wallResult({
      airborneContext: WALL_FIELD_CONTEXT,
      layers: PDF_LIKE_ADJACENT_ROCKWOOL_STACK,
      outputs: WALL_FIELD_OUTPUTS
    });

    expect(lab.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "double_leaf",
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY
    });
    expect(lab.metrics).toMatchObject({
      estimatedRwDb: 51,
      estimatedStc: 51
    });
    expect(lab.supportedTargetOutputs).toEqual([...WALL_LAB_OUTPUTS]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(lab.warnings).not.toContain(ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING);

    expect(field.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "double_leaf",
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY
    });
    expect(field.metrics).toMatchObject({
      estimatedDnTwDb: 51,
      estimatedRwPrimeDb: 49
    });
    expect(field.supportedTargetOutputs).toEqual([...WALL_FIELD_OUTPUTS]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
  });

  it("does not apply the flat-list withholding guard once grouped topology is explicit", () => {
    const grouped = wallResult({
      airborneContext: GROUPED_TRIPLE_LEAF_LAB_CONTEXT,
      layers: PDF_LIKE_SPLIT_ROCKWOOL_STACK,
      outputs: WALL_LAB_OUTPUTS
    });

    expect(grouped.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "multileaf_multicavity",
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor"
    });
    expect(grouped.metrics).toMatchObject({
      estimatedRwDb: 53,
      estimatedStc: 64
    });
    expect(grouped.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(grouped.unsupportedTargetOutputs).toEqual([]);
    expect(grouped.warnings).not.toContain(ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING);
    expect(grouped.warnings.join("\n")).toContain("lab spectrum adapter is active");
    expect(
      isFlatListSplitInternalRockwoolDiagnostic({
        airborneContext: GROUPED_TRIPLE_LEAF_LAB_CONTEXT,
        layers: grouped.layers,
        trace: grouped.dynamicAirborneTrace
      })
    ).toBe(false);
  });

  it("keeps active docs aligned with the selected Gate C closeout", () => {
    const requiredFiles = [
      "AGENTS.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md",
      "docs/calculator/SLICE_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_V1_PLAN.md",
      "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
      "docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_B_HANDOFF.md"
    ] as const;

    for (const path of requiredFiles) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }

    const docs = requiredFiles.map(readRepoFile);

    for (const doc of docs) {
      expect(doc).toContain(ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_B.landedGate);
      expect(doc).toContain(ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_B.selectionStatus);
      expect(doc).toContain(ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_B.selectedNextFile);
      expect(doc).toContain(ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_B.selectedNextAction);
      expect(doc).toContain("supportedTargetOutputs");
      expect(doc).toContain("Rw 41 / R'w 39 / DnT,w 40");
      expect(doc).toContain("Rw 51 / R'w 49 / DnT,w 51");
    }
  });
});
