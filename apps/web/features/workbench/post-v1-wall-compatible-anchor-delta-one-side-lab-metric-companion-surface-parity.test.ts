import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, AssemblyCalculation, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { getLayerCombinationResolverCandidateSurface } from "./layer-combination-resolver-candidate-surface";
import { getPresetById } from "./preset-definitions";
import { evaluateScenario, type EvaluatedScenario } from "./scenario-analysis";
import {
  buildServerProjectWorkbenchSnapshot,
  parseServerProjectWorkbenchSnapshot
} from "./server-project-workbench-snapshot";
import { addOutputCardPosture, buildOutputCard } from "./simple-workbench-output-model";
import type { LayerDraft, ScenarioSnapshot } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const REPO_ROOT = fileURLToPath(new URL("../../../..", import.meta.url));
const TARGET_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const DIRECT_RW_OUTPUT = ["Rw"] as const satisfies readonly RequestedOutputId[];
const STC_ONLY_OUTPUT = ["STC"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_WITH_LAB_COMPANIONS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = ["R'w", "Dn,w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const SURFACE_PARITY_ACTION =
  "post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_surface_parity_plan";
const SURFACE_PARITY_FILE =
  "apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-surface-parity.test.ts";
const SURFACE_PARITY_STATUS =
  "post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_surface_parity_landed_no_runtime_selected_coverage_refresh";
const PREVIOUS_ONE_SIDE_OWNER_ACTION =
  "post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_owner_plan";
const PREVIOUS_ONE_SIDE_OWNER_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-owner-contract.test.ts";
const PREVIOUS_ONE_SIDE_OWNER_STATUS =
  "post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_owner_landed_runtime_selected_surface_parity";
const SELECTED_NEXT_ACTION =
  "post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_LABEL = "post-V1 wall compatible anchor-delta one-side lab metric companion coverage refresh";
const LAB_COMPANION_SELECTED_CANDIDATE_ID = "wall.compatible_anchor_delta.calculated_lab_companions";
const LAB_COMPANION_RUNTIME_BASIS = "post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime";
const DIRECT_ANCHOR_DELTA_SELECTED_CANDIDATE_ID = "wall.compatible_anchor_delta.extra_board_on_verified_lsf";
const DIRECT_ANCHOR_DELTA_RUNTIME_BASIS = "exact_subassembly_source_plus_calculated_delta";
const LAB_COMPANION_WARNING_PREFIX = "Compatible anchor-delta lab companion owner active";
const DIRECT_ANCHOR_DELTA_WARNING_PREFIX = "Compatible measured-anchor delta active";
const REQUIRED_DOCS = [
  "AGENTS.md",
  "README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SYSTEM_MAP.md"
] as const;

const SURFACE_PARITY_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0,
  webSurfaceParityContractFilesTouched: 1
} as const;

let originalEnv: Record<string, string | undefined>;

const REDUCED_LSF_ROWS: readonly LayerDraft[] = [
  { id: "side-a-1", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { id: "side-a-2", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { id: "gap", materialId: "air_gap", thicknessMm: "5" },
  { id: "fill", materialId: "glasswool", thicknessMm: "70" },
  { id: "side-b-1", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { id: "side-b-2", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" }
];

const ONE_SIDE_EXTERIOR_BOARD_START_LSF_ROWS: readonly LayerDraft[] = [
  { id: "outer-start", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  ...REDUCED_LSF_ROWS
];

const ONE_SIDE_EXTERIOR_BOARD_END_LSF_ROWS: readonly LayerDraft[] = [
  ...REDUCED_LSF_ROWS,
  { id: "outer-end", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" }
];

const NON_KNAUF_ONE_SIDE_BOARD_ROWS: readonly LayerDraft[] = [
  { id: "generic-a-outer", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "generic-a-1", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "generic-a-2", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "generic-gap", materialId: "air_gap", thicknessMm: "5" },
  { id: "generic-fill", materialId: "glasswool", thicknessMm: "70" },
  { id: "generic-b-1", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "generic-b-2", materialId: "gypsum_board", thicknessMm: "12.5" }
];

const ELEMENT_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const BUILDING_CONTEXT: AirborneContext = {
  ...ELEMENT_LAB_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 48
};

function createMemoryStorage(): Storage {
  const entries = new Map<string, string>();

  return {
    clear: () => entries.clear(),
    getItem: (key) => entries.get(key) ?? null,
    key: (index) => Array.from(entries.keys())[index] ?? null,
    get length() {
      return entries.size;
    },
    removeItem: (key) => {
      entries.delete(key);
    },
    setItem: (key, value) => {
      entries.set(key, value);
    }
  };
}

function jsonRequest(url: string, payload: unknown) {
  return new Request(url, {
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
  });
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function withoutIds(rows: readonly LayerDraft[]): Array<Omit<LayerDraft, "id">> {
  return rows.map((row) => ({
    materialId: row.materialId,
    thicknessMm: row.thicknessMm
  }));
}

function toLayerInputs(rows: readonly LayerDraft[]): LayerInput[] {
  return rows.map((row) => ({
    materialId: row.materialId,
    thicknessMm: Number.parseFloat(row.thicknessMm)
  }));
}

function parsePositiveNumber(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function elementLabContextFromSnapshot(snapshot: ScenarioSnapshot): AirborneContext {
  return {
    airtightness: snapshot.airborneAirtightness,
    connectionType: snapshot.airborneConnectionType,
    contextMode: "element_lab",
    studSpacingMm: parsePositiveNumber(snapshot.airborneStudSpacingMm),
    studType: snapshot.airborneStudType
  };
}

function buildScenario(input: {
  airborneContext?: AirborneContext;
  id: string;
  rows?: readonly LayerDraft[];
  source?: "current" | "saved";
  targetOutputs?: readonly RequestedOutputId[];
}): EvaluatedScenario & { result: AssemblyCalculation } {
  const scenario = evaluateScenario({
    airborneContext: input.airborneContext ?? ELEMENT_LAB_CONTEXT,
    calculator: "dynamic",
    id: input.id,
    name: `Compatible anchor-delta one-side lab companion surface ${input.id}`,
    rows: input.rows ?? ONE_SIDE_EXTERIOR_BOARD_END_LSF_ROWS,
    savedAtIso: input.source === "saved" ? "2026-06-10T10:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "wall",
    targetOutputs: input.targetOutputs ?? TARGET_OUTPUTS
  });

  if (!scenario.result) {
    throw new Error(`Scenario ${input.id} did not evaluate.`);
  }

  return scenario as EvaluatedScenario & { result: AssemblyCalculation };
}

function buildScenarioFromSnapshot(snapshot: ScenarioSnapshot, id: string): EvaluatedScenario & { result: AssemblyCalculation } {
  const scenario = evaluateScenario({
    airborneContext: elementLabContextFromSnapshot(snapshot),
    calculator: "dynamic",
    id,
    name: `Compatible anchor-delta one-side lab companion surface ${id}`,
    rows: snapshot.rows,
    savedAtIso: "2026-06-10T10:00:00.000Z",
    source: "saved",
    studyMode: "wall",
    targetOutputs: snapshot.requestedOutputs
  });

  if (!scenario.result) {
    throw new Error(`Scenario ${id} did not evaluate.`);
  }

  return scenario as EvaluatedScenario & { result: AssemblyCalculation };
}

function buildReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("light_steel_stud_wall"),
    briefNote: "",
    clientName: "Compatible Anchor Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Compatible Anchor-Delta One-Side Lab Companion Surface",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "wall",
    targetLnwDb: "",
    targetRwDb: "57"
  });
}

function expectOneSideLabCompanionSurface(result: AssemblyCalculation | null | undefined): asserts result is AssemblyCalculation {
  expect(result?.supportedTargetOutputs).toEqual([...TARGET_OUTPUTS]);
  expect(result?.unsupportedTargetOutputs).toEqual([]);
  expect(result?.metrics).toMatchObject({
    estimatedCDb: -0.6,
    estimatedCtrDb: -5.5,
    estimatedRwDb: 57,
    estimatedStc: 57
  });
  expect(result?.airborneBasis).toMatchObject({
    anchorSourceId: "knauf_lab_416889_primary_2026",
    method: LAB_COMPANION_RUNTIME_BASIS,
    origin: "family_physics_prediction"
  });
  expect(result?.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: false,
    selectedCandidateId: LAB_COMPANION_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction"
  });
  expect(getLayerCombinationResolverCandidateSurface(result)).toMatchObject({
    candidateKind: "source_absent_family_solver",
    noRuntimeValueMovement: true,
    requestedBasis: "element_lab",
    route: "wall",
    runtimeBasisId: LAB_COMPANION_RUNTIME_BASIS,
    selectedCandidateId: LAB_COMPANION_SELECTED_CANDIDATE_ID,
    supportBucket: "source_absent_estimate",
    supportedMetrics: ["Rw", "STC", "C", "Ctr"],
    valuePins: [
      { metric: "Rw", value: 57 },
      { metric: "STC", value: 57 },
      { metric: "C", value: -0.6 },
      { metric: "Ctr", value: -5.5 }
    ]
  });
  expect(result?.warnings).toEqual(expect.arrayContaining([expect.stringContaining(LAB_COMPANION_WARNING_PREFIX)]));
  expect(result?.warnings).not.toEqual(expect.arrayContaining([expect.stringContaining(DIRECT_ANCHOR_DELTA_WARNING_PREFIX)]));
}

function expectDirectRwSurface(result: AssemblyCalculation | null | undefined): asserts result is AssemblyCalculation {
  expect(result?.supportedTargetOutputs).toEqual(["Rw"]);
  expect(result?.unsupportedTargetOutputs).toEqual([]);
  expect(result?.metrics).toMatchObject({ estimatedRwDb: 57 });
  expect(result?.airborneBasis).toMatchObject({
    method: DIRECT_ANCHOR_DELTA_RUNTIME_BASIS,
    origin: "measured_exact_subassembly_plus_calculated_delta"
  });
  expect(getLayerCombinationResolverCandidateSurface(result)).toMatchObject({
    runtimeBasisId: DIRECT_ANCHOR_DELTA_RUNTIME_BASIS,
    selectedCandidateId: DIRECT_ANCHOR_DELTA_SELECTED_CANDIDATE_ID,
    supportedMetrics: ["Rw"],
    valuePins: [{ metric: "Rw", value: 57 }]
  });
  expect(result?.warnings).toEqual(expect.arrayContaining([expect.stringContaining(DIRECT_ANCHOR_DELTA_WARNING_PREFIX)]));
  expect(result?.warnings).not.toEqual(expect.arrayContaining([expect.stringContaining(LAB_COMPANION_WARNING_PREFIX)]));
}

function expectStcOnlyLabCompanionSurface(result: AssemblyCalculation | null | undefined): asserts result is AssemblyCalculation {
  expect(result?.supportedTargetOutputs).toEqual([...STC_ONLY_OUTPUT]);
  expect(result?.unsupportedTargetOutputs).toEqual([]);
  expect(result?.metrics).toMatchObject({ estimatedStc: 57 });
  expect(result?.airborneBasis).toMatchObject({
    anchorSourceId: "knauf_lab_416889_primary_2026",
    method: LAB_COMPANION_RUNTIME_BASIS,
    origin: "family_physics_prediction"
  });
  expect(result?.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: false,
    selectedCandidateId: LAB_COMPANION_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction"
  });
  expect(getLayerCombinationResolverCandidateSurface(result)).toMatchObject({
    candidateKind: "source_absent_family_solver",
    noRuntimeValueMovement: true,
    requestedBasis: "element_lab",
    route: "wall",
    runtimeBasisId: LAB_COMPANION_RUNTIME_BASIS,
    selectedCandidateId: LAB_COMPANION_SELECTED_CANDIDATE_ID,
    supportBucket: "source_absent_estimate",
    supportedMetrics: [...STC_ONLY_OUTPUT],
    valuePins: [{ metric: "STC", value: 57 }]
  });
  expect(result?.warnings).toEqual(expect.arrayContaining([expect.stringContaining(LAB_COMPANION_WARNING_PREFIX)]));
  expect(result?.warnings).not.toEqual(expect.arrayContaining([expect.stringContaining(DIRECT_ANCHOR_DELTA_WARNING_PREFIX)]));
}

async function estimateViaApi(input: {
  airborneContext?: AirborneContext;
  rows?: readonly LayerDraft[];
  targetOutputs?: readonly RequestedOutputId[];
} = {}): Promise<AssemblyCalculation> {
  const { POST: estimate } = await import("../../app/api/estimate/route");
  const response = await estimate(
    jsonRequest("http://localhost/api/estimate", {
      airborneContext: input.airborneContext ?? ELEMENT_LAB_CONTEXT,
      calculator: "dynamic",
      layers: toLayerInputs(input.rows ?? ONE_SIDE_EXTERIOR_BOARD_END_LSF_ROWS),
      targetOutputs: input.targetOutputs ?? TARGET_OUTPUTS
    })
  );
  const body = (await response.json()) as { ok?: boolean; result?: AssemblyCalculation };

  expect(response.status).toBe(200);
  expect(body.ok).toBe(true);
  expect(body.result).toBeDefined();

  return body.result as AssemblyCalculation;
}

async function saveOneSideLabSnapshot(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();

  store.reset();
  store.startStudyMode("wall");
  store.setCalculatorId("dynamic");
  store.clearRows();
  store.appendRows(withoutIds(ONE_SIDE_EXTERIOR_BOARD_END_LSF_ROWS));
  store.setRequestedOutputs([...TARGET_OUTPUTS]);
  store.setAirborneContextMode("element_lab");
  store.setAirborneAirtightness("good");
  store.setAirborneConnectionType("line_connection");
  store.setAirborneStudType("light_steel_stud");
  store.setAirborneStudSpacingMm("600");
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Expected the workbench store to save the one-side lab companion snapshot.");
  }

  return savedSnapshot;
}

beforeEach(() => {
  originalEnv = Object.fromEntries(AUTH_ENV_KEYS.map((key) => [key, process.env[key]] as const));
  vi.resetModules();
  vi.stubGlobal("localStorage", createMemoryStorage());

  for (const key of AUTH_ENV_KEYS) {
    process.env[key] = "";
  }
});

afterEach(() => {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  vi.unstubAllGlobals();
});

describe("post-V1 wall compatible anchor-delta one-side lab metric companion surface parity", () => {
  it("lands after one-side owner and selects one-side coverage refresh next", () => {
    expect({
      counters: SURFACE_PARITY_COUNTERS,
      landedGate: SURFACE_PARITY_ACTION,
      previousOwnerAction: PREVIOUS_ONE_SIDE_OWNER_ACTION,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectionStatus: SURFACE_PARITY_STATUS
    }).toMatchObject({
      counters: SURFACE_PARITY_COUNTERS,
      landedGate: SURFACE_PARITY_ACTION,
      previousOwnerAction: PREVIOUS_ONE_SIDE_OWNER_ACTION,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectionStatus: SURFACE_PARITY_STATUS
    });

    expect(existsSync(join(REPO_ROOT, PREVIOUS_ONE_SIDE_OWNER_FILE)), PREVIOUS_ONE_SIDE_OWNER_FILE).toBe(true);
    expect(existsSync(join(REPO_ROOT, SURFACE_PARITY_FILE)), SURFACE_PARITY_FILE).toBe(true);
  });

  it("shows one-side exterior-board Rw/STC/C/Ctr lab companions on cards, report, and calculator API", async () => {
    const scenario = buildScenario({ id: "compatible-anchor-one-side-lab-companion-live" });
    const result = scenario.result;

    expectOneSideLabCompanionSurface(result);

    expect(addOutputCardPosture(buildOutputCard({ output: "Rw", result, studyMode: "wall" }), {
      result,
      studyMode: "wall"
    })).toMatchObject({ status: "live", value: "57 dB" });
    expect(addOutputCardPosture(buildOutputCard({ output: "STC", result, studyMode: "wall" }), {
      result,
      studyMode: "wall"
    })).toMatchObject({ status: "live", value: "57 dB" });
    expect(addOutputCardPosture(buildOutputCard({ output: "C", result, studyMode: "wall" }), {
      result,
      studyMode: "wall"
    })).toMatchObject({ status: "live", value: "-0.6 dB" });
    expect(addOutputCardPosture(buildOutputCard({ output: "Ctr", result, studyMode: "wall" }), {
      result,
      studyMode: "wall"
    })).toMatchObject({ status: "live", value: "-5.5 dB" });

    const report = buildReport(scenario);
    expect(report).toContain(`- Resolver candidate id: ${LAB_COMPANION_SELECTED_CANDIDATE_ID}`);
    expect(report).toContain(`- Resolver runtime basis: ${LAB_COMPANION_RUNTIME_BASIS}`);
    expect(report).toContain("- Resolver route / basis: wall / element_lab");
    expect(report).toContain("- Resolver supported metrics: Rw, STC, C, Ctr");
    expect(report).toContain("- Resolver value pins: Rw 57, STC 57, C -0.6, Ctr -5.5");
    expect(report).toContain(LAB_COMPANION_WARNING_PREFIX);

    expectOneSideLabCompanionSurface(await estimateViaApi());
    expectOneSideLabCompanionSurface(await estimateViaApi({ rows: ONE_SIDE_EXTERIOR_BOARD_START_LSF_ROWS }));
  });

  it("keeps saved replay and server snapshot replay on the one-side lab companion resolver candidate", async () => {
    const savedSnapshot = await saveOneSideLabSnapshot();
    expect(savedSnapshot.rows).toHaveLength(ONE_SIDE_EXTERIOR_BOARD_END_LSF_ROWS.length);
    expect(savedSnapshot.requestedOutputs).toEqual([...TARGET_OUTPUTS]);
    expect(savedSnapshot.airborneContextMode).toBe("element_lab");
    expect(savedSnapshot.airborneConnectionType).toBe("line_connection");
    expect(savedSnapshot.airborneStudType).toBe("light_steel_stud");
    expect(savedSnapshot.airborneStudSpacingMm).toBe("600");

    expectOneSideLabCompanionSurface(
      buildScenarioFromSnapshot(savedSnapshot, "compatible-anchor-one-side-lab-companion-saved").result
    );

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();
    expectOneSideLabCompanionSurface(
      buildScenarioFromSnapshot(
        parsedServerSnapshot as ScenarioSnapshot,
        "compatible-anchor-one-side-lab-companion-server"
      ).result
    );
  });

  it("keeps direct Rw and unsupported boundaries off the one-side lab companion surface", async () => {
    const directRw = buildScenario({
      id: "compatible-anchor-one-side-direct-rw",
      targetOutputs: DIRECT_RW_OUTPUT
    });
    expectDirectRwSurface(directRw.result);
    expect(addOutputCardPosture(buildOutputCard({ output: "Rw", result: directRw.result, studyMode: "wall" }), {
      result: directRw.result,
      studyMode: "wall"
    })).toMatchObject({ status: "live", value: "57 dB" });

    const stcOnly = buildScenario({
      id: "compatible-anchor-one-side-stc-only",
      targetOutputs: STC_ONLY_OUTPUT
    });
    expectStcOnlyLabCompanionSurface(stcOnly.result);
    expect(addOutputCardPosture(buildOutputCard({ output: "STC", result: stcOnly.result, studyMode: "wall" }), {
      result: stcOnly.result,
      studyMode: "wall"
    })).toMatchObject({ status: "live", value: "57 dB" });

    const buildingMixed = buildScenario({
      airborneContext: BUILDING_CONTEXT,
      id: "compatible-anchor-one-side-building-mixed",
      targetOutputs: FIELD_BUILDING_WITH_LAB_COMPANIONS
    });
    expect(buildingMixed.result.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(buildingMixed.result.unsupportedTargetOutputs).toEqual(["STC", "C", "Ctr"]);
    expect(getLayerCombinationResolverCandidateSurface(buildingMixed.result)?.selectedCandidateId).not.toBe(
      LAB_COMPANION_SELECTED_CANDIDATE_ID
    );

    const nonKnaufMixed = buildScenario({
      id: "compatible-anchor-one-side-non-knauf",
      rows: NON_KNAUF_ONE_SIDE_BOARD_ROWS
    });
    expect(nonKnaufMixed.result.supportedTargetOutputs).toEqual(["Rw"]);
    expect(nonKnaufMixed.result.unsupportedTargetOutputs).toEqual(["STC", "C", "Ctr"]);
    expect(getLayerCombinationResolverCandidateSurface(nonKnaufMixed.result)?.selectedCandidateId).not.toBe(
      LAB_COMPANION_SELECTED_CANDIDATE_ID
    );

    expectDirectRwSurface(await estimateViaApi({ targetOutputs: DIRECT_RW_OUTPUT }));
    const stcOnlyApiResult = await estimateViaApi({ targetOutputs: STC_ONLY_OUTPUT });
    expectStcOnlyLabCompanionSurface(stcOnlyApiResult);
  });

  it("keeps docs and the current-gate runner aligned with the one-side lab companion surface parity", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);
      const normalized = contents.toLowerCase().replace(/\s+/g, " ");

      expect(contents, path).toContain(PREVIOUS_ONE_SIDE_OWNER_ACTION);
      expect(contents, path).toContain(PREVIOUS_ONE_SIDE_OWNER_FILE);
      expect(contents, path).toContain(PREVIOUS_ONE_SIDE_OWNER_STATUS);
      expect(contents, path).toContain(SURFACE_PARITY_ACTION);
      expect(contents, path).toContain(SURFACE_PARITY_FILE);
      expect(contents, path).toContain(SURFACE_PARITY_STATUS);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(SELECTED_NEXT_FILE);
      expect(contents, path).toContain(LAB_COMPANION_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain(LAB_COMPANION_RUNTIME_BASIS);
      expect(contents, path).toContain("Rw 57 / STC 57 / C -0.6 / Ctr -5.5");
      expect(contents, path).toContain("webSurfaceParityContractFilesTouched: 1");
      expect(normalized, path).toContain(SELECTED_NEXT_LABEL.toLowerCase());
      expect(normalized, path).toContain("stc-only");
      expect(normalized, path).toContain("field/building");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "features/workbench/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-surface-parity.test.ts"
    );
  });
});
