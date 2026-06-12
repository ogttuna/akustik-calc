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
import { getTargetOutputStatus } from "./target-output-status";
import type { LayerDraft, ScenarioSnapshot } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const REPO_ROOT = fileURLToPath(new URL("../../../..", import.meta.url));

const STC_ONLY_OUTPUT = ["STC"] as const satisfies readonly RequestedOutputId[];
const DIRECT_RW_OUTPUT = ["Rw"] as const satisfies readonly RequestedOutputId[];
const C_ONLY_OUTPUT = ["C"] as const satisfies readonly RequestedOutputId[];
const CTR_ONLY_OUTPUT = ["Ctr"] as const satisfies readonly RequestedOutputId[];
const BUILDING_WITH_STC_OUTPUTS = ["Dn,A", "DnT,A", "STC"] as const satisfies readonly RequestedOutputId[];

const PREVIOUS_OWNER_ACTION = "post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_owner_landed_runtime_selected_surface_parity";
const SURFACE_PARITY_ACTION =
  "post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_surface_parity_plan";
const SURFACE_PARITY_FILE =
  "apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-surface-parity.test.ts";
const SURFACE_PARITY_STATUS =
  "post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_surface_parity_landed_no_runtime_selected_coverage_refresh";
const SELECTED_NEXT_ACTION =
  "post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_STC_ONLY_LAB_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-11.md";
const SELECTED_NEXT_LABEL = "post-V1 wall compatible anchor-delta STC-only lab companion coverage refresh";

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
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SYSTEM_MAP.md"
] as const;

let originalEnv: Record<string, string | undefined>;

const REDUCED_LSF_ROWS: readonly LayerDraft[] = [
  { id: "side-a-1", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { id: "side-a-2", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { id: "gap", materialId: "air_gap", thicknessMm: "5" },
  { id: "fill", materialId: "glasswool", thicknessMm: "70" },
  { id: "side-b-1", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { id: "side-b-2", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" }
];

const PAIRED_EXTERIOR_BOARD_LSF_ROWS: readonly LayerDraft[] = [
  { id: "outer-start", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  ...REDUCED_LSF_ROWS,
  { id: "outer-end", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" }
];

const ONE_SIDE_EXTERIOR_BOARD_LSF_ROWS: readonly LayerDraft[] = [
  ...REDUCED_LSF_ROWS,
  { id: "outer-end", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" }
];

const NON_KNAUF_ONE_SIDE_BOARD_ROWS: readonly LayerDraft[] = [
  { id: "generic-a-1", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "generic-a-2", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "generic-gap", materialId: "air_gap", thicknessMm: "5" },
  { id: "generic-fill", materialId: "glasswool", thicknessMm: "70" },
  { id: "generic-b-1", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "generic-b-2", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "generic-outer", materialId: "gypsum_board", thicknessMm: "12.5" }
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
    name: `Compatible anchor-delta STC-only lab companion surface ${input.id}`,
    rows: input.rows ?? PAIRED_EXTERIOR_BOARD_LSF_ROWS,
    savedAtIso: input.source === "saved" ? "2026-06-11T10:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "wall",
    targetOutputs: input.targetOutputs ?? STC_ONLY_OUTPUT
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
    name: `Compatible anchor-delta STC-only lab companion surface ${id}`,
    rows: snapshot.rows,
    savedAtIso: "2026-06-11T10:00:00.000Z",
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
    projectName: "Compatible Anchor-Delta STC-Only Surface",
    reportProfile: "consultant",
    requestedOutputs: STC_ONLY_OUTPUT,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "wall",
    targetLnwDb: "",
    targetRwDb: "59"
  });
}

function expectStcOnlyLabCompanionSurface(
  result: AssemblyCalculation | null | undefined,
  expectedStc: number
): asserts result is AssemblyCalculation {
  expect(result?.supportedTargetOutputs).toEqual([...STC_ONLY_OUTPUT]);
  expect(result?.unsupportedTargetOutputs).toEqual([]);
  expect(result?.metrics).toMatchObject({ estimatedStc: expectedStc });
  expect(result?.airborneBasis).toMatchObject({
    anchorSourceId: "knauf_lab_416889_primary_2026",
    kind: "airborne_physics_prediction",
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
    valuePins: [{ metric: "STC", value: expectedStc }]
  });
  expect(result?.warnings).toEqual(expect.arrayContaining([expect.stringContaining(LAB_COMPANION_WARNING_PREFIX)]));
  expect(result?.warnings).not.toEqual(expect.arrayContaining([expect.stringContaining(DIRECT_ANCHOR_DELTA_WARNING_PREFIX)]));
}

function expectCOrCtrOnlyLabCompanionSurface(
  result: AssemblyCalculation | null | undefined,
  output: "C" | "Ctr",
  expectedValue: number
): asserts result is AssemblyCalculation {
  expect(result?.supportedTargetOutputs).toEqual([output]);
  expect(result?.unsupportedTargetOutputs).toEqual([]);
  expect(result?.metrics).toMatchObject(
    output === "C" ? { estimatedCDb: expectedValue } : { estimatedCtrDb: expectedValue }
  );
  expect(result?.airborneBasis).toMatchObject({
    anchorSourceId: "knauf_lab_416889_primary_2026",
    kind: "airborne_physics_prediction",
    method: LAB_COMPANION_RUNTIME_BASIS,
    origin: "family_physics_prediction"
  });
  expect(getLayerCombinationResolverCandidateSurface(result)).toMatchObject({
    candidateKind: "source_absent_family_solver",
    noRuntimeValueMovement: true,
    requestedBasis: "element_lab",
    route: "wall",
    runtimeBasisId: LAB_COMPANION_RUNTIME_BASIS,
    selectedCandidateId: LAB_COMPANION_SELECTED_CANDIDATE_ID,
    supportBucket: "source_absent_estimate",
    supportedMetrics: [output],
    valuePins: [{ metric: output, value: expectedValue }]
  });
  expect(result?.warnings).toEqual(expect.arrayContaining([expect.stringContaining(LAB_COMPANION_WARNING_PREFIX)]));
  expect(result?.warnings).not.toEqual(expect.arrayContaining([expect.stringContaining(DIRECT_ANCHOR_DELTA_WARNING_PREFIX)]));
}

function expectDirectRwSurface(
  result: AssemblyCalculation | null | undefined,
  expectedRw: number
): asserts result is AssemblyCalculation {
  expect(result?.supportedTargetOutputs).toEqual([...DIRECT_RW_OUTPUT]);
  expect(result?.unsupportedTargetOutputs).toEqual([]);
  expect(result?.metrics).toMatchObject({ estimatedRwDb: expectedRw });
  expect(result?.airborneBasis).toMatchObject({
    method: DIRECT_ANCHOR_DELTA_RUNTIME_BASIS,
    origin: "measured_exact_subassembly_plus_calculated_delta"
  });
  expect(getLayerCombinationResolverCandidateSurface(result)).toMatchObject({
    runtimeBasisId: DIRECT_ANCHOR_DELTA_RUNTIME_BASIS,
    selectedCandidateId: DIRECT_ANCHOR_DELTA_SELECTED_CANDIDATE_ID,
    supportedMetrics: ["Rw"],
    valuePins: [{ metric: "Rw", value: expectedRw }]
  });
  expect(result?.warnings).toEqual(expect.arrayContaining([expect.stringContaining(DIRECT_ANCHOR_DELTA_WARNING_PREFIX)]));
  expect(result?.warnings).not.toEqual(expect.arrayContaining([expect.stringContaining(LAB_COMPANION_WARNING_PREFIX)]));
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
      layers: toLayerInputs(input.rows ?? PAIRED_EXTERIOR_BOARD_LSF_ROWS),
      targetOutputs: input.targetOutputs ?? STC_ONLY_OUTPUT
    })
  );
  const body = (await response.json()) as { ok?: boolean; result?: AssemblyCalculation };

  expect(response.status).toBe(200);
  expect(body.ok).toBe(true);
  expect(body.result).toBeDefined();

  return body.result as AssemblyCalculation;
}

async function saveStcOnlySnapshot(rows: readonly LayerDraft[]): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();

  store.reset();
  store.startStudyMode("wall");
  store.setCalculatorId("dynamic");
  store.clearRows();
  store.appendRows(withoutIds(rows));
  store.setRequestedOutputs([...STC_ONLY_OUTPUT]);
  store.setAirborneContextMode("element_lab");
  store.setAirborneAirtightness("good");
  store.setAirborneConnectionType("line_connection");
  store.setAirborneStudType("light_steel_stud");
  store.setAirborneStudSpacingMm("600");
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Expected the workbench store to save the STC-only compatible lab companion snapshot.");
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

describe("post-V1 wall compatible anchor-delta STC-only lab companion surface parity", () => {
  it("shows paired and one-side STC-only lab companions on cards, status, report, and calculator API", async () => {
    const paired = buildScenario({ id: "compatible-anchor-stc-only-paired" });
    expectStcOnlyLabCompanionSurface(paired.result, 59);
    expect(addOutputCardPosture(buildOutputCard({ output: "STC", result: paired.result, studyMode: "wall" }), {
      result: paired.result,
      studyMode: "wall"
    })).toMatchObject({ status: "live", value: "59 dB" });
    expect(getTargetOutputStatus({ guideResult: null, output: "STC", result: paired.result })).toMatchObject({
      kind: "engine_live",
      label: "Live",
      output: "STC",
      tone: "success"
    });

    const report = buildReport(paired);
    expect(report).toContain(`- Resolver candidate id: ${LAB_COMPANION_SELECTED_CANDIDATE_ID}`);
    expect(report).toContain(`- Resolver runtime basis: ${LAB_COMPANION_RUNTIME_BASIS}`);
    expect(report).toContain("- Resolver route / basis: wall / element_lab");
    expect(report).toContain("- Resolver supported metrics: STC");
    expect(report).toContain("- Resolver value pins: STC 59");
    expect(report).toContain(LAB_COMPANION_WARNING_PREFIX);

    expectStcOnlyLabCompanionSurface(await estimateViaApi(), 59);

    const oneSide = buildScenario({
      id: "compatible-anchor-stc-only-one-side",
      rows: ONE_SIDE_EXTERIOR_BOARD_LSF_ROWS
    });
    expectStcOnlyLabCompanionSurface(oneSide.result, 57);
    expect(addOutputCardPosture(buildOutputCard({ output: "STC", result: oneSide.result, studyMode: "wall" }), {
      result: oneSide.result,
      studyMode: "wall"
    })).toMatchObject({ status: "live", value: "57 dB" });
    expectStcOnlyLabCompanionSurface(await estimateViaApi({ rows: ONE_SIDE_EXTERIOR_BOARD_LSF_ROWS }), 57);
  });

  it("keeps saved replay and server snapshot replay on the STC-only lab companion surface", async () => {
    const pairedSnapshot = await saveStcOnlySnapshot(PAIRED_EXTERIOR_BOARD_LSF_ROWS);
    expect(pairedSnapshot.requestedOutputs).toEqual([...STC_ONLY_OUTPUT]);
    expect(pairedSnapshot.airborneContextMode).toBe("element_lab");
    expect(pairedSnapshot.airborneStudType).toBe("light_steel_stud");
    expect(pairedSnapshot.airborneStudSpacingMm).toBe("600");

    expectStcOnlyLabCompanionSurface(buildScenarioFromSnapshot(pairedSnapshot, "compatible-anchor-stc-saved").result, 59);

    const parsedPairedSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(pairedSnapshot)
    );
    expect(parsedPairedSnapshot).not.toBeNull();
    expectStcOnlyLabCompanionSurface(
      buildScenarioFromSnapshot(parsedPairedSnapshot as ScenarioSnapshot, "compatible-anchor-stc-server").result,
      59
    );

    const oneSideSnapshot = await saveStcOnlySnapshot(ONE_SIDE_EXTERIOR_BOARD_LSF_ROWS);
    expectStcOnlyLabCompanionSurface(
      buildScenarioFromSnapshot(oneSideSnapshot, "compatible-anchor-stc-one-side-saved").result,
      57
    );
  });

  it("keeps direct Rw, building-context STC, and non-Knauf boundaries while C/Ctr-only uses its owner", async () => {
    expectDirectRwSurface(
      buildScenario({
        id: "compatible-anchor-stc-direct-rw",
        targetOutputs: DIRECT_RW_OUTPUT
      }).result,
      59
    );
    expectDirectRwSurface(
      buildScenario({
        id: "compatible-anchor-stc-one-side-direct-rw",
        rows: ONE_SIDE_EXTERIOR_BOARD_LSF_ROWS,
        targetOutputs: DIRECT_RW_OUTPUT
      }).result,
      57
    );

    expectCOrCtrOnlyLabCompanionSurface(
      buildScenario({
        id: "compatible-anchor-stc-c-only-owner",
        targetOutputs: C_ONLY_OUTPUT
      }).result,
      "C",
      -1.1
    );
    expectCOrCtrOnlyLabCompanionSurface(
      buildScenario({
        id: "compatible-anchor-stc-ctr-only-owner",
        targetOutputs: CTR_ONLY_OUTPUT
      }).result,
      "Ctr",
      -6
    );

    const buildingWithStc = buildScenario({
      airborneContext: BUILDING_CONTEXT,
      id: "compatible-anchor-stc-building-context",
      targetOutputs: BUILDING_WITH_STC_OUTPUTS
    }).result;
    expect(buildingWithStc.supportedTargetOutputs).toEqual(["Dn,A", "DnT,A"]);
    expect(buildingWithStc.unsupportedTargetOutputs).toEqual(["STC"]);
    expect(getLayerCombinationResolverCandidateSurface(buildingWithStc)?.selectedCandidateId).not.toBe(
      LAB_COMPANION_SELECTED_CANDIDATE_ID
    );

    const nonKnauf = buildScenario({
      id: "compatible-anchor-stc-non-knauf",
      rows: NON_KNAUF_ONE_SIDE_BOARD_ROWS
    }).result;
    expect(nonKnauf.supportedTargetOutputs).toEqual([]);
    expect(nonKnauf.unsupportedTargetOutputs).toEqual([...STC_ONLY_OUTPUT]);
    expect(getLayerCombinationResolverCandidateSurface(nonKnauf)?.selectedCandidateId).not.toBe(
      LAB_COMPANION_SELECTED_CANDIDATE_ID
    );

    expectDirectRwSurface(await estimateViaApi({ targetOutputs: DIRECT_RW_OUTPUT }), 59);
  });

  it("keeps docs and the current-gate runner aligned with the landed STC-only surface parity", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);
      const normalized = contents.toLowerCase().replace(/\s+/g, " ");

      expect(contents, path).toContain(PREVIOUS_OWNER_ACTION);
      expect(contents, path).toContain(PREVIOUS_OWNER_FILE);
      expect(contents, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(contents, path).toContain(SURFACE_PARITY_ACTION);
      expect(contents, path).toContain(SURFACE_PARITY_FILE);
      expect(contents, path).toContain(SURFACE_PARITY_STATUS);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(SELECTED_NEXT_FILE);
      expect(contents, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(contents, path).toContain(LAB_COMPANION_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain(LAB_COMPANION_RUNTIME_BASIS);
      expect(contents, path).toContain("STC 59");
      expect(contents, path).toContain("STC 57");
      expect(contents, path).toContain("webSurfaceParityContractFilesTouched: 1");
      expect(normalized, path).toContain(SELECTED_NEXT_LABEL.toLowerCase());
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "features/workbench/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-surface-parity.test.ts"
    );
  });
});
