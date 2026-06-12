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
import { buildWorkbenchWallTopology } from "./simple-workbench-wall-topology";
import { getTargetOutputStatus } from "./target-output-status";
import type { LayerDraft, ScenarioSnapshot } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const REPO_ROOT = fileURLToPath(new URL("../../../..", import.meta.url));

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_ALIAS_OUTPUTS = ["R'w"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const RUNTIME_WIDENING_ACTION =
  "post_v1_wall_double_leaf_framed_route_input_runtime_widening_plan";
const RUNTIME_WIDENING_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-contract.test.ts";
const RUNTIME_WIDENING_STATUS =
  "post_v1_wall_double_leaf_framed_route_input_runtime_widening_landed_runtime_selected_surface_parity";
const SURFACE_PARITY_ACTION =
  "post_v1_wall_double_leaf_framed_route_input_runtime_widening_surface_parity_plan";
const SURFACE_PARITY_FILE =
  "apps/web/features/workbench/post-v1-wall-double-leaf-framed-route-input-runtime-widening-surface-parity.test.ts";
const SURFACE_PARITY_STATUS =
  "post_v1_wall_double_leaf_framed_route_input_runtime_widening_surface_parity_landed_no_runtime_selected_coverage_refresh";
const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed route-input runtime widening coverage refresh";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_ROUTE_INPUT_RUNTIME_WIDENING_COVERAGE_REFRESH_PLAN_2026-06-11.md";

const DOUBLE_LEAF_BANDED_SELECTED_CANDIDATE_ID =
  "candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver";
const DOUBLE_LEAF_BANDED_RUNTIME_BASIS =
  "layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor";
const DOUBLE_LEAF_BANDED_WARNING =
  "Layer-combination resolver double-leaf framed wall banded runtime corridor is active";
const NEEDS_INPUT_SELECTED_CANDIDATE_ID = "candidate_dynamic_needs_input";
const NEEDS_INPUT_METHOD = "dynamic_calculator_route_input_contract_missing_physical_fields";

const REQUIRED_DOCS = [
  "AGENTS.md",
  "README.md",
  "docs/calculator/CALCULATOR_NEXT_VALUE_MOVEMENT_ALIGNMENT_2026-06-11.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SYSTEM_MAP.md",
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_ROUTE_INPUT_RUNTIME_WIDENING_PLAN_2026-06-11.md",
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_ROUTE_INPUT_RUNTIME_WIDENING_SURFACE_PARITY_PLAN_2026-06-11.md",
  SELECTED_NEXT_PLAN_DOC
] as const;

const CONTEXT_ONLY_EMPTY_CAVITY_ROWS: readonly LayerDraft[] = [
  { id: "side-a-board", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "side-b-board", materialId: "gypsum_board", thicknessMm: "12.5" }
];

const CONTEXT_ONLY_EMPTY_CAVITY_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "none",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "empty",
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [1],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

const CONTEXT_ONLY_DEPTH_WITHOUT_EMPTY_CLASSIFICATION: AirborneContext = {
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1DepthMm: 90,
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [1],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

let originalEnv: Record<string, string | undefined>;

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

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function buildContextFromSnapshot(snapshot: ScenarioSnapshot): AirborneContext {
  const wallTopology = buildWorkbenchWallTopology(snapshot, snapshot.rows.length);
  if (!wallTopology) {
    throw new Error("Expected a saved context-only empty-cavity wall topology.");
  }

  const context: AirborneContext = {
    contextMode: snapshot.airborneContextMode,
    sharedTrack: snapshot.airborneSharedTrack,
    wallTopology
  };
  const studSpacingMm = parsePositiveNumber(snapshot.airborneStudSpacingMm);

  if (typeof studSpacingMm === "number") {
    context.studSpacingMm = studSpacingMm;
  }

  return context;
}

function buildScenario(input: {
  airborneContext?: AirborneContext;
  id: string;
  rows?: readonly LayerDraft[];
  source?: "current" | "saved";
  targetOutputs?: readonly RequestedOutputId[];
}): EvaluatedScenario & { result: AssemblyCalculation } {
  const scenario = evaluateScenario({
    airborneContext: input.airborneContext ?? CONTEXT_ONLY_EMPTY_CAVITY_CONTEXT,
    calculator: "dynamic",
    id: input.id,
    name: `Double-leaf route-input widening surface ${input.id}`,
    rows: input.rows ?? CONTEXT_ONLY_EMPTY_CAVITY_ROWS,
    savedAtIso: input.source === "saved" ? "2026-06-11T12:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "wall",
    targetOutputs: input.targetOutputs ?? WALL_LAB_OUTPUTS
  });

  if (!scenario.result) {
    throw new Error(`Scenario ${input.id} did not evaluate.`);
  }

  return scenario as EvaluatedScenario & { result: AssemblyCalculation };
}

function buildReport(scenario: EvaluatedScenario, requestedOutputs: readonly RequestedOutputId[] = WALL_LAB_OUTPUTS): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("concrete_wall"),
    briefNote: "",
    clientName: "Route Input Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Double-Leaf Route-Input Runtime Widening Surface",
    reportProfile: "consultant",
    requestedOutputs,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "wall",
    targetLnwDb: "",
    targetRwDb: "42"
  });
}

function expectContextOnlyEmptyCavitySurface(
  result: AssemblyCalculation | null | undefined
): asserts result is AssemblyCalculation {
  expect(result?.supportedTargetOutputs).toEqual([...WALL_LAB_OUTPUTS]);
  expect(result?.unsupportedTargetOutputs).toEqual([]);
  expect(result?.metrics).toMatchObject({
    estimatedCDb: -1,
    estimatedCtrDb: -6.1,
    estimatedRwDb: 42,
    estimatedStc: 42
  });
  expect(result?.airborneBasis).toMatchObject({
    errorBudgetDb: 6,
    family: "double_stud_system",
    method: DOUBLE_LEAF_BANDED_RUNTIME_BASIS,
    missingPhysicalInputs: [],
    origin: "family_physics_prediction"
  });
  expect(result?.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: false,
    selectedCandidateId: DOUBLE_LEAF_BANDED_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction"
  });
  expect(getLayerCombinationResolverCandidateSurface(result)).toMatchObject({
    candidateKind: "source_absent_family_solver",
    errorBudgetMetrics: ["Rw", "C", "Ctr", "STC"],
    noRuntimeValueMovement: true,
    requestedBasis: "element_lab",
    route: "wall",
    runtimeBasisId: DOUBLE_LEAF_BANDED_RUNTIME_BASIS,
    selectedCandidateId: DOUBLE_LEAF_BANDED_SELECTED_CANDIDATE_ID,
    supportBucket: "source_absent_estimate",
    supportedMetrics: ["Rw", "C", "Ctr", "STC"],
    valuePins: [
      { metric: "Rw", value: 42 },
      { metric: "STC", value: 42 },
      { metric: "C", value: -1 },
      { metric: "Ctr", value: -6.1 }
    ]
  });
  expect(result?.warnings).toEqual(expect.arrayContaining([expect.stringContaining(DOUBLE_LEAF_BANDED_WARNING)]));
}

function expectMissingEmptyCavityClassificationSurface(
  result: AssemblyCalculation | null | undefined
): asserts result is AssemblyCalculation {
  expect(result?.supportedTargetOutputs).toEqual([]);
  expect(result?.unsupportedTargetOutputs).toEqual([...WALL_LAB_OUTPUTS]);
  expect(result?.airborneBasis).toMatchObject({
    method: NEEDS_INPUT_METHOD,
    missingPhysicalInputs: ["cavity1FillCoverage", "absorberClass"],
    origin: "needs_input"
  });
  expect(result?.airborneCandidateResolution).toMatchObject({
    selectedCandidateId: NEEDS_INPUT_SELECTED_CANDIDATE_ID,
    selectedOrigin: "needs_input"
  });
  expect(getLayerCombinationResolverCandidateSurface(result)?.selectedCandidateId).not.toBe(
    DOUBLE_LEAF_BANDED_SELECTED_CANDIDATE_ID
  );
}

async function estimateViaApi(input: {
  airborneContext?: AirborneContext;
  targetOutputs?: readonly RequestedOutputId[];
} = {}): Promise<AssemblyCalculation> {
  const { POST: estimate } = await import("../../app/api/estimate/route");
  const response = await estimate(
    jsonRequest("http://localhost/api/estimate", {
      airborneContext: input.airborneContext ?? CONTEXT_ONLY_EMPTY_CAVITY_CONTEXT,
      calculator: "dynamic",
      layers: toLayerInputs(CONTEXT_ONLY_EMPTY_CAVITY_ROWS),
      targetOutputs: input.targetOutputs ?? WALL_LAB_OUTPUTS
    })
  );
  const body = (await response.json()) as { ok?: boolean; result?: AssemblyCalculation };

  expect(response.status).toBe(200);
  expect(body.ok).toBe(true);
  expect(body.result).toBeDefined();

  return body.result as AssemblyCalculation;
}

async function saveContextOnlyEmptyCavitySnapshot(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();

  store.reset();
  store.startStudyMode("wall");
  store.setCalculatorId("dynamic");
  store.clearRows();
  store.appendRows(withoutIds(CONTEXT_ONLY_EMPTY_CAVITY_ROWS));
  store.setRequestedOutputs([...WALL_LAB_OUTPUTS]);
  store.setAirborneContextMode("element_lab");
  store.setAirborneSharedTrack("independent");
  store.setAirborneStudSpacingMm("600");
  store.setAirborneWallTopologyMode("double_leaf_framed");
  store.setAirborneWallSideALeafLayerIndices("1");
  store.setAirborneWallCavity1DepthMm("90");
  store.setAirborneWallCavity1FillCoverage("empty");
  store.setAirborneWallCavity1AbsorptionClass("none");
  store.setAirborneWallSideBLeafLayerIndices("2");
  store.setAirborneWallSupportTopology("independent_frames");
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Expected the workbench store to save the context-only empty-cavity snapshot.");
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

describe("post-V1 wall double-leaf/framed route-input runtime widening surface parity", () => {
  it("shows the context-only empty-cavity formula result on cards, status, report, and calculator API", async () => {
    const scenario = buildScenario({ id: "route-input-empty-cavity-live" });
    expectContextOnlyEmptyCavitySurface(scenario.result);

    expect(addOutputCardPosture(buildOutputCard({ output: "Rw", result: scenario.result, studyMode: "wall" }), {
      result: scenario.result,
      studyMode: "wall"
    })).toMatchObject({ status: "live", value: "42 dB" });
    expect(addOutputCardPosture(buildOutputCard({ output: "STC", result: scenario.result, studyMode: "wall" }), {
      result: scenario.result,
      studyMode: "wall"
    })).toMatchObject({ status: "live", value: "42 dB" });
    expect(addOutputCardPosture(buildOutputCard({ output: "C", result: scenario.result, studyMode: "wall" }), {
      result: scenario.result,
      studyMode: "wall"
    })).toMatchObject({ status: "live", value: "-1 dB" });
    expect(addOutputCardPosture(buildOutputCard({ output: "Ctr", result: scenario.result, studyMode: "wall" }), {
      result: scenario.result,
      studyMode: "wall"
    })).toMatchObject({ status: "live", value: "-6.1 dB" });
    expect(getTargetOutputStatus({ guideResult: null, output: "Rw", result: scenario.result })).toMatchObject({
      kind: "engine_live",
      label: "Live",
      output: "Rw",
      tone: "success"
    });

    const report = buildReport(scenario);
    expect(report).toContain(`- Resolver candidate id: ${DOUBLE_LEAF_BANDED_SELECTED_CANDIDATE_ID}`);
    expect(report).toContain(`- Resolver runtime basis: ${DOUBLE_LEAF_BANDED_RUNTIME_BASIS}`);
    expect(report).toContain("- Resolver route / basis: wall / element_lab");
    expect(report).toContain("- Resolver supported metrics: Rw, C, Ctr, STC");
    expect(report).toContain("- Resolver value pins: Rw 42, STC 42, C -1, Ctr -6.1");

    expectContextOnlyEmptyCavitySurface(await estimateViaApi());
  });

  it("keeps saved replay and server snapshot replay on the same route-input widening surface", async () => {
    const savedSnapshot = await saveContextOnlyEmptyCavitySnapshot();
    expect(savedSnapshot.airborneWallTopologyMode).toBe("double_leaf_framed");
    expect(savedSnapshot.airborneWallCavity1DepthMm).toBe("90");
    expect(savedSnapshot.airborneWallCavity1FillCoverage).toBe("empty");
    expect(savedSnapshot.airborneWallCavity1AbsorptionClass).toBe("none");
    expect(savedSnapshot.airborneWallCavity1LayerIndices).toBe("");

    const savedScenario = buildScenario({
      airborneContext: buildContextFromSnapshot(savedSnapshot),
      id: "route-input-empty-cavity-saved",
      rows: savedSnapshot.rows,
      source: "saved",
      targetOutputs: savedSnapshot.requestedOutputs
    });
    expectContextOnlyEmptyCavitySurface(savedScenario.result);

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();
    expect(parsedServerSnapshot?.airborneWallCavity1FillCoverage).toBe("empty");
    expect(parsedServerSnapshot?.airborneWallCavity1AbsorptionClass).toBe("none");

    const serverScenario = buildScenario({
      airborneContext: buildContextFromSnapshot(parsedServerSnapshot as ScenarioSnapshot),
      id: "route-input-empty-cavity-server",
      rows: parsedServerSnapshot?.rows ?? [],
      source: "saved",
      targetOutputs: parsedServerSnapshot?.requestedOutputs ?? WALL_LAB_OUTPUTS
    });
    expectContextOnlyEmptyCavitySurface(serverScenario.result);
  });

  it("keeps missing classification and non-lab metric requests outside the empty-cavity widening surface", async () => {
    const missingClassification = buildScenario({
      airborneContext: CONTEXT_ONLY_DEPTH_WITHOUT_EMPTY_CLASSIFICATION,
      id: "route-input-empty-cavity-missing-classification"
    }).result;
    expectMissingEmptyCavityClassificationSurface(missingClassification);
    expect(addOutputCardPosture(buildOutputCard({ output: "Rw", result: missingClassification, studyMode: "wall" }), {
      result: missingClassification,
      studyMode: "wall"
    })).toMatchObject({
      detail: expect.stringContaining("cavity1FillCoverage"),
      status: "needs_input",
      value: "Not ready"
    });

    const fieldAlias = buildScenario({
      id: "route-input-empty-cavity-field-alias",
      targetOutputs: WALL_FIELD_ALIAS_OUTPUTS
    }).result;
    expect(fieldAlias.supportedTargetOutputs).toEqual([]);
    expect(fieldAlias.unsupportedTargetOutputs).toEqual([...WALL_FIELD_ALIAS_OUTPUTS]);

    const astm = buildScenario({
      id: "route-input-empty-cavity-astm",
      targetOutputs: ASTM_OUTPUTS
    }).result;
    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual([...ASTM_OUTPUTS]);

    expectMissingEmptyCavityClassificationSurface(
      await estimateViaApi({ airborneContext: CONTEXT_ONLY_DEPTH_WITHOUT_EMPTY_CLASSIFICATION })
    );
  });

  it("keeps docs and current-gate runner aligned with the landed surface parity and selected coverage refresh", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const text = readRepoFile(path);

      expect(text, path).toContain(RUNTIME_WIDENING_ACTION);
      expect(text, path).toContain(RUNTIME_WIDENING_FILE);
      expect(text, path).toContain(RUNTIME_WIDENING_STATUS);
      expect(text, path).toContain(SURFACE_PARITY_ACTION);
      expect(text, path).toContain(SURFACE_PARITY_FILE);
      expect(text, path).toContain(SURFACE_PARITY_STATUS);
      expect(text, path).toContain(SELECTED_NEXT_ACTION);
      expect(text, path).toContain(SELECTED_NEXT_FILE);
      expect(text, path).toContain(SELECTED_NEXT_LABEL);
      expect(text, path).toContain("webSurfaceParityContractFilesTouched: 1");
      expect(text, path).toContain("runtimeValuesMoved 0");
      expect(text, path).toContain("sourceRowsImported: 0");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(SURFACE_PARITY_FILE.replace("apps/web/", ""));
  });
});
