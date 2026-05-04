import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type {
  AirborneContext,
  ExactFloorSystem,
  FloorRole,
  FloorSystemRoleCriteria,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import { getGuidedTopologyGap } from "./guided-topology-gap";
import { evaluateScenario } from "./scenario-analysis";
import {
  addOutputCardPosture,
  buildOutputCard,
  type OutputCardModel
} from "./simple-workbench-output-model";
import {
  buildWorkbenchWallTopology,
  type WorkbenchWallTopologyDraft
} from "./simple-workbench-wall-topology";
import type { StudyMode } from "./preset-definitions";
import type { LayerDraft } from "./workbench-store";

const REPO_ROOT = fileURLToPath(new URL("../../../..", import.meta.url));

const COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_B = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_b_add_company_internal_visible_route_output_snapshot_guard_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
  selectedNextFile:
    "packages/engine/src/post-company-internal-frequent-combination-lane-snapshot-guard-v1-next-slice-selection-contract.test.ts",
  selectedNextStatus: "company_internal_frequent_combination_visible_guard_landed_no_runtime_selected_gate_c_closeout",
  sliceId: "company_internal_frequent_combination_lane_snapshot_guard_v1",
  supportPromotion: false,
  thisGateFile:
    "apps/web/features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts",
  warningCopyChange: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_B_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_B_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
] as const;

const REQUIRED_GATE_B_DOC_TOKENS = [
  COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_B.landedGate,
  COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_B.selectedNextAction,
  COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_B.selectedNextFile,
  COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_B.selectedNextStatus,
  "company_internal_visible_route_output_snapshot_guard",
  "rockwool_triple_leaf_visible_screening_not_fixed",
  "flat_list_swap_visible_fail_closed",
  "near_source_alias_visible_context_only",
  "hostile_input_visible_no_numeric_estimate",
  "field_outputs_never_design_grade_without_owner",
  "standing_lane_misclassification_monitoring_mandate",
  "note_test_document_or_easy_fix"
] as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const FLOOR_ROLE_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI"] as const satisfies readonly RequestedOutputId[];

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const WALL_FIELD_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const SIMPLE_STUD_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
  connectionType: "line_connection",
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const COMPLETE_TRIPLE_LEAF_TOPOLOGY_DRAFT: WorkbenchWallTopologyDraft = {
  airborneWallCavity1AbsorptionClass: "porous_absorptive",
  airborneWallCavity1DepthMm: "50",
  airborneWallCavity1FillCoverage: "full",
  airborneWallCavity1LayerIndices: "4",
  airborneWallCavity2AbsorptionClass: "porous_absorptive",
  airborneWallCavity2DepthMm: "50",
  airborneWallCavity2FillCoverage: "full",
  airborneWallCavity2LayerIndices: "6",
  airborneWallInternalLeafCoupling: "independent",
  airborneWallInternalLeafLayerIndices: "5",
  airborneWallSideALeafLayerIndices: "1, 2, 3",
  airborneWallSideBLeafLayerIndices: "7, 8, 9",
  airborneWallSupportTopology: "independent_frames",
  airborneWallTopologyMode: "grouped_triple_leaf"
};

const FLOOR_ROLE_ORDER = [
  "ceiling_board",
  "ceiling_fill",
  "ceiling_cavity",
  "floor_covering",
  "resilient_layer",
  "upper_fill",
  "floating_screed",
  "base_structure"
] as const satisfies readonly FloorRole[];

const SPLIT_ROCKWOOL_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "mlv", thicknessMm: "4" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "gypsum_plaster", thicknessMm: "10" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
];

const SPLIT_ROCKWOOL_SWAPPED_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "mlv", thicknessMm: "4" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "gypsum_plaster", thicknessMm: "10" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
];

const ORDINARY_DOUBLE_LEAF_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "air_gap", thicknessMm: "50" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
];

const SIMPLE_STUD_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
];

const LINED_MASSIVE_BOUNDARY_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "ytong_aac_d700", thicknessMm: "100" },
  { materialId: "rockwool", thicknessMm: "25" },
  { materialId: "air_gap", thicknessMm: "50" },
  { materialId: "diamond_board", thicknessMm: "12.5" }
];

const NEAR_SOURCE_ALIAS_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "gypsum", thicknessMm: "12.5" },
  { materialId: "firestop_board", thicknessMm: "15" }
];

function readRepoFile(relativePath: string): string {
  return readFileSync(join(REPO_ROOT, relativePath), "utf8");
}

function withIds(rows: readonly Omit<LayerDraft, "id">[], scenarioId: string): LayerDraft[] {
  return rows.map((row, index) => ({
    ...row,
    id: `${scenarioId}-${index + 1}`
  }));
}

function completeTripleLeafContext(base: AirborneContext): AirborneContext {
  const wallTopology = buildWorkbenchWallTopology(
    COMPLETE_TRIPLE_LEAF_TOPOLOGY_DRAFT,
    SPLIT_ROCKWOOL_ROWS.length
  );

  if (!wallTopology) {
    throw new Error("Complete triple-leaf wall topology did not build.");
  }

  return {
    ...base,
    wallTopology
  };
}

function exactSystem(id: string): ExactFloorSystem {
  const system = EXACT_FLOOR_SYSTEMS.find((entry) => entry.id === id);
  if (!system) {
    throw new Error(`Missing exact floor system ${id}`);
  }
  return system;
}

function criteriaForRole(system: ExactFloorSystem, role: FloorRole): FloorSystemRoleCriteria | undefined {
  switch (role) {
    case "base_structure":
      return system.match.baseStructure;
    case "ceiling_board":
      return system.match.ceilingBoard;
    case "ceiling_cavity":
      return system.match.ceilingCavity;
    case "ceiling_fill":
      return system.match.ceilingFill;
    case "floating_screed":
      return system.match.floatingScreed;
    case "floor_covering":
      return system.match.floorCovering;
    case "resilient_layer":
      return system.match.resilientLayer;
    case "upper_fill":
      return system.match.upperFill;
    default:
      return undefined;
  }
}

function criteriaToRows(
  role: FloorRole,
  criteria: FloorSystemRoleCriteria | undefined,
  mode: "raw" | "tagged"
): readonly Omit<LayerDraft, "id">[] {
  if (!criteria) {
    return [];
  }

  if (criteria.materialScheduleIds || criteria.thicknessScheduleMm) {
    const materialSchedule = criteria.materialScheduleIds ?? criteria.materialIds ?? [];
    const thicknessSchedule = criteria.thicknessScheduleMm ?? [];

    return thicknessSchedule.map((thicknessMm, index) => ({
      ...(mode === "tagged" ? { floorRole: role } : {}),
      materialId: materialSchedule[index] ?? materialSchedule[0] ?? criteria.materialIds?.[0] ?? "generic_fill",
      thicknessMm: String(thicknessMm)
    }));
  }

  const materialId = criteria.materialIds?.[0] ?? "generic_fill";
  const thicknessMm = String(criteria.thicknessMm ?? 1);

  return Array.from({ length: criteria.layerCount ?? 1 }).map(() => ({
    ...(mode === "tagged" ? { floorRole: role } : {}),
    materialId,
    thicknessMm
  }));
}

function rowsFromExactSystem(id: string, mode: "raw" | "tagged"): LayerDraft[] {
  const system = exactSystem(id);
  return FLOOR_ROLE_ORDER.flatMap((role) => criteriaToRows(role, criteriaForRole(system, role), mode)).map(
    (row, index) => ({
      ...row,
      id: `${id}-${mode}-${index + 1}`
    })
  );
}

function evaluate(input: {
  airborneContext?: AirborneContext | null;
  id: string;
  outputs: readonly RequestedOutputId[];
  rows: readonly LayerDraft[] | readonly Omit<LayerDraft, "id">[];
  studyMode: StudyMode;
}) {
  const rows = input.rows.every((row) => "id" in row)
    ? (input.rows as readonly LayerDraft[])
    : withIds(input.rows as readonly Omit<LayerDraft, "id">[], input.id);
  const scenario = evaluateScenario({
    airborneContext: input.airborneContext ?? null,
    calculator: "dynamic",
    id: input.id,
    name: input.id,
    rows,
    source: "current",
    studyMode: input.studyMode,
    targetOutputs: input.outputs
  });

  expect(scenario.result, `${input.id} should evaluate`).not.toBeNull();
  if (!scenario.result) {
    throw new Error(`${input.id} did not evaluate.`);
  }

  return {
    branch: getDynamicCalcBranchSummary({
      result: scenario.result,
      studyMode: input.studyMode
    }),
    result: scenario.result,
    rows,
    studyMode: input.studyMode,
    topologyGap: getGuidedTopologyGap({
      result: scenario.result,
      rows,
      studyMode: input.studyMode
    }),
    warnings: scenario.warnings
  };
}

function evaluateNullable(input: {
  airborneContext?: AirborneContext | null;
  id: string;
  outputs: readonly RequestedOutputId[];
  rows: readonly LayerDraft[] | readonly Omit<LayerDraft, "id">[];
  studyMode: StudyMode;
}) {
  const rows = input.rows.every((row) => "id" in row)
    ? (input.rows as readonly LayerDraft[])
    : withIds(input.rows as readonly Omit<LayerDraft, "id">[], input.id);

  return evaluateScenario({
    airborneContext: input.airborneContext ?? null,
    calculator: "dynamic",
    id: input.id,
    name: input.id,
    rows,
    source: "current",
    studyMode: input.studyMode,
    targetOutputs: input.outputs
  });
}

function outputCard(output: RequestedOutputId, snapshot: ReturnType<typeof evaluate>): OutputCardModel {
  return addOutputCardPosture(
    buildOutputCard({
      output,
      result: snapshot.result,
      studyMode: snapshot.studyMode
    }),
    {
      result: snapshot.result,
      studyMode: snapshot.studyMode
    }
  );
}

function nullableOutputCard(output: RequestedOutputId, scenario: ReturnType<typeof evaluateNullable>, studyMode: StudyMode) {
  return buildOutputCard({
    output,
    result: scenario.result,
    studyMode
  });
}

function expectNoExactSourceWarning(warnings: readonly string[], label: string): void {
  expect(
    warnings.some((warning) => /Curated exact airborne lab match active/i.test(warning)),
    `${label} must not inherit a curated exact source row`
  ).toBe(false);
}

describe("company-internal frequent-combination lane snapshot guard Gate B visible surface", () => {
  it("lands Gate B as a visible no-runtime guard and selects closeout / next-slice selection", () => {
    expect(COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_B).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_b_add_company_internal_visible_route_output_snapshot_guard_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
      supportPromotion: false,
      warningCopyChange: false,
      workbenchInputBehaviorChange: false
    });

    for (const relativePath of REQUIRED_GATE_B_DOCS) {
      expect(existsSync(join(REPO_ROOT, relativePath)), relativePath).toBe(true);
    }
  });

  it("keeps grouped rockwool triple-leaf visibly screening and not fixed", () => {
    const grouped = evaluate({
      airborneContext: completeTripleLeafContext(WALL_LAB_CONTEXT),
      id: "company-gate-b-grouped-rockwool",
      outputs: WALL_LAB_OUTPUTS,
      rows: SPLIT_ROCKWOOL_ROWS,
      studyMode: "wall"
    });
    const rwCard = outputCard("Rw", grouped);

    expect(grouped.result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "low",
      detectedFamily: "multileaf_multicavity",
      strategy: "multileaf_screening_blend"
    });
    expect(grouped.branch).toMatchObject({
      tone: "warning",
      value: "Multi-Leaf / Multi-Cavity"
    });
    expect(grouped.topologyGap).toMatchObject({
      value: "Source validation blocked"
    });
    expect(grouped.topologyGap?.detail).toContain("source-calibrated triple-leaf solver");
    expect(rwCard).toMatchObject({
      postureLabel: "Airborne screening lane",
      status: "live",
      value: "41 dB"
    });
    expect(rwCard.postureDetail).toContain("No exact wall source row is active");
    expect(grouped.warnings.join("\n")).toMatch(/Grouped triple-leaf topology is present/i);
    expectNoExactSourceWarning(grouped.warnings, "grouped rockwool");
  });

  it("keeps flat-list rockwool swaps visibly fail-closed rather than exact or double-leaf", () => {
    const swapped = evaluate({
      airborneContext: WALL_LAB_CONTEXT,
      id: "company-gate-b-flat-swap-rockwool",
      outputs: WALL_LAB_OUTPUTS,
      rows: SPLIT_ROCKWOOL_SWAPPED_ROWS,
      studyMode: "wall"
    });
    const rwCard = outputCard("Rw", swapped);

    expect(swapped.result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "low",
      detectedFamily: "multileaf_multicavity",
      strategy: "multileaf_screening_blend_fail_closed_until_grouped_topology"
    });
    expect(swapped.branch).toMatchObject({
      tone: "warning",
      value: "Multi-Leaf / Multi-Cavity"
    });
    expect(swapped.branch.detail).toContain("multileaf screening blend fail closed until grouped topology");
    expect(rwCard).toMatchObject({
      postureLabel: "Airborne screening lane",
      status: "live",
      value: "42 dB"
    });
    expect(rwCard.postureDetail).toContain("No exact wall source row is active");
    expect(swapped.warnings.join("\n")).toMatch(/Flat-list adjacent-swap sensitivity guard/i);
    expectNoExactSourceWarning(swapped.warnings, "flat-list rockwool swap");
  });

  it("keeps ordinary double-leaf, simple stud, and lined-massive boundary rows visibly out of the triple-leaf fix path", () => {
    const doubleLeaf = evaluate({
      airborneContext: WALL_LAB_CONTEXT,
      id: "company-gate-b-ordinary-double-leaf",
      outputs: WALL_LAB_OUTPUTS,
      rows: ORDINARY_DOUBLE_LEAF_ROWS,
      studyMode: "wall"
    });
    const simpleStud = evaluate({
      airborneContext: SIMPLE_STUD_CONTEXT,
      id: "company-gate-b-simple-stud",
      outputs: WALL_LAB_OUTPUTS,
      rows: SIMPLE_STUD_ROWS,
      studyMode: "wall"
    });
    const boundary = evaluate({
      airborneContext: WALL_LAB_CONTEXT,
      id: "company-gate-b-lined-massive-boundary",
      outputs: WALL_LAB_OUTPUTS,
      rows: LINED_MASSIVE_BOUNDARY_ROWS,
      studyMode: "wall"
    });

    expect(doubleLeaf.result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "double_leaf",
      strategy: "double_leaf_porous_fill_delegate"
    });
    expect(doubleLeaf.branch).toMatchObject({ tone: "neutral", value: "Double Leaf" });
    expect(outputCard("Rw", doubleLeaf)).toMatchObject({ status: "live", value: "41 dB" });

    expect(simpleStud.result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "low",
      detectedFamily: "stud_wall_system",
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    });
    expect(simpleStud.branch).toMatchObject({ tone: "warning", value: "Stud Wall Surrogate" });
    expect(outputCard("Rw", simpleStud)).toMatchObject({ postureLabel: "Airborne screening lane", value: "43 dB" });

    expect(boundary.result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "low",
      detectedFamily: "lined_massive_wall",
      strategy: "lined_massive_blend+reinforcement_monotonic_floor+family_boundary_hold"
    });
    expect(boundary.branch).toMatchObject({ tone: "warning", value: "Lined Massive Wall" });
    expect(boundary.branch.detail).toMatch(/family-boundary hold/i);
    expect(outputCard("Rw", boundary)).toMatchObject({
      postureLabel: "Airborne screening lane",
      status: "live",
      value: "49 dB"
    });

    for (const snapshot of [doubleLeaf, simpleStud, boundary]) {
      expect(snapshot.topologyGap).toBeNull();
      expect(
        snapshot.warnings.some((warning) => /Triple-leaf exact calculation needs grouped wall topology/i.test(warning)),
        `${snapshot.result.id ?? "negative"} should not ask for triple-leaf topology`
      ).toBe(false);
    }
  });

  it("keeps raw floor role prompts and exact raw parity rows visibly separated", () => {
    const exactOpenBox = evaluate({
      id: "company-gate-b-raw-open-box",
      outputs: FLOOR_ROLE_OUTPUTS,
      rows: rowsFromExactSystem("tuas_r5b_open_box_timber_measured_2026", "raw"),
      studyMode: "floor"
    });
    const ambiguousClt = evaluate({
      id: "company-gate-b-raw-clt-role-prompt",
      outputs: FLOOR_ROLE_OUTPUTS,
      rows: rowsFromExactSystem("tuas_x4_clt140_measured_2026", "raw"),
      studyMode: "floor"
    });

    expect(exactOpenBox.result.floorSystemMatch?.system.id).toBe("tuas_r5b_open_box_timber_measured_2026");
    expect(outputCard("Rw", exactOpenBox)).toMatchObject({
      postureLabel: "Companion airborne",
      status: "live",
      value: "75 dB"
    });
    expect(exactOpenBox.result.floorSystemRatings?.Rw).toBe(75);
    expect(outputCard("Ln,w", exactOpenBox)).toMatchObject({
      postureLabel: "Exact source row",
      status: "live",
      value: "44 dB"
    });
    expect(exactOpenBox.warnings.join("\n")).toMatch(/does not claim arbitrary raw floor reorder value invariance/i);

    expect(ambiguousClt.result.floorSystemMatch).toBeNull();
    expect(ambiguousClt.result.supportedTargetOutputs).toEqual(["Rw"]);
    expect(ambiguousClt.result.unsupportedTargetOutputs).toEqual(["Ln,w", "Ln,w+CI"]);
    expect(outputCard("Ln,w", ambiguousClt)).toMatchObject({
      detail: "Assign floor roles before treating this impact output as supported.",
      status: "unsupported",
      value: "Not ready"
    });
    expect(ambiguousClt.warnings.join("\n")).toMatch(/Floor roles needed before impact output promotion/i);
  });

  it("keeps near-source aliases and hostile API/import payloads visibly context-only or unsupported", () => {
    const nearSourceAlias = evaluate({
      airborneContext: WALL_LAB_CONTEXT,
      id: "company-gate-b-near-source-alias",
      outputs: WALL_LAB_OUTPUTS,
      rows: NEAR_SOURCE_ALIAS_ROWS,
      studyMode: "wall"
    });
    const unknownMaterial = evaluate({
      airborneContext: WALL_LAB_CONTEXT,
      id: "company-gate-b-unknown-material",
      outputs: WALL_LAB_OUTPUTS,
      rows: [{ materialId: "__company_unknown_import", thicknessMm: "12.5" }],
      studyMode: "wall"
    });
    const invalidThickness = evaluateNullable({
      airborneContext: WALL_LAB_CONTEXT,
      id: "company-gate-b-invalid-thickness",
      outputs: WALL_LAB_OUTPUTS,
      rows: [{ materialId: "gypsum_board", thicknessMm: "Infinity" }],
      studyMode: "wall"
    });

    expect(nearSourceAlias.result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "laminated_single_leaf",
      strategy: "laminated_leaf_sharp_delegate"
    });
    expect(outputCard("Rw", nearSourceAlias)).toMatchObject({
      postureLabel: "Airborne screening lane",
      status: "live",
      value: "37 dB"
    });
    expectNoExactSourceWarning(nearSourceAlias.warnings, "near-source alias");

    expect(unknownMaterial.result.supportedTargetOutputs).toEqual([]);
    expect(unknownMaterial.result.unsupportedTargetOutputs).toEqual(WALL_LAB_OUTPUTS);
    expect(outputCard("Rw", unknownMaterial)).toMatchObject({
      status: "unsupported",
      value: "Not ready"
    });

    expect(invalidThickness.result).toBeNull();
    expect(nullableOutputCard("Rw", invalidThickness, "wall")).toMatchObject({
      status: "needs_input",
      value: "Not ready"
    });
    expect(invalidThickness.warnings.join("\n")).toMatch(/missing a valid thickness/i);

    for (const snapshot of [unknownMaterial]) {
      expect(snapshot.result.supportedTargetOutputs).toEqual([]);
      expect(snapshot.result.unsupportedTargetOutputs).toEqual(WALL_LAB_OUTPUTS);
      expect(outputCard("Rw", snapshot)).toMatchObject({
        status: "unsupported",
        value: "Not ready"
      });
    }
    expect(unknownMaterial.warnings.join("\n")).toMatch(/unknown material/i);
  });

  it("keeps field outputs visibly as field continuations, not design-grade exact field measurements", () => {
    const field = evaluate({
      airborneContext: completeTripleLeafContext(WALL_FIELD_CONTEXT),
      id: "company-gate-b-field-continuation",
      outputs: WALL_FIELD_OUTPUTS,
      rows: SPLIT_ROCKWOOL_ROWS,
      studyMode: "wall"
    });
    const rwPrime = outputCard("R'w", field);
    const dnTw = outputCard("DnT,w", field);

    expect(field.result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "low",
      detectedFamily: "multileaf_multicavity",
      strategy: "multileaf_screening_blend"
    });
    expect(rwPrime).toMatchObject({
      postureLabel: "Field continuation",
      status: "live",
      value: "34 dB"
    });
    expect(dnTw).toMatchObject({
      postureLabel: "Field continuation",
      status: "live",
      value: "36 dB"
    });
    expect(rwPrime.postureDetail).toContain("not being framed as an independent exact source row");
    expect(dnTw.postureDetail).toContain("not being framed as an independent exact source row");
    expect(rwPrime.detail).toContain("not an independent exact field measurement");
    expect(dnTw.detail).toContain("not an independent exact field measurement");
  });

  it("keeps active docs aligned with Gate B visible guard and the selected closeout gate", () => {
    const docs = REQUIRED_GATE_B_DOCS.map((relativePath) => readRepoFile(relativePath)).join("\n\n");

    for (const token of REQUIRED_GATE_B_DOC_TOKENS) {
      expect(docs, token).toContain(token);
    }

    expect(docs).toContain("Rockwool triple-leaf remains not fixed");
    expect(docs).toContain("Rw 41");
    expect(docs).toContain("screening");
    expect(docs).toContain("no-runtime");
  });
});
