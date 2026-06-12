import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, AssemblyCalculation, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { WorkbenchAdvancedWallInputSurfaceDraft } from "./advanced-wall-source-absent-input-surface";
import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
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
const WALL_FIELD_ALIAS_OUTPUTS = ["R'w", "Dn,w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "CI"] as const satisfies readonly RequestedOutputId[];

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_landed_runtime_selected_surface_parity";
const SURFACE_PARITY_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_plan";
const SURFACE_PARITY_FILE =
  "apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-surface-parity.test.ts";
const SURFACE_PARITY_STATUS =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_landed_no_runtime_selected_coverage_refresh";
const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed direct-fixed context absorptive cavity owner coverage refresh";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_OWNER_COVERAGE_REFRESH_PLAN_2026-06-11.md";

const GATE_EO_DIRECT_FIXED_RUNTIME_BASIS =
  "wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner";
const GATE_EO_DIRECT_FIXED_SELECTED_CANDIDATE_ID =
  "candidate_wall_direct_fixed_double_leaf_bridge_loss_equivalent_coupled_mass";
const GATE_EO_DIRECT_FIXED_WARNING =
  "Gate EO direct-fixed double-leaf bridge-loss runtime is active only for complete element-lab direct-fixed wall stacks";
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
  "docs/calculator/README.md",
  "docs/calculator/SYSTEM_MAP.md",
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_OWNER_PLAN_2026-06-11.md",
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_OWNER_SURFACE_PARITY_PLAN_2026-06-11.md",
  SELECTED_NEXT_PLAN_DOC
] as const;

const TWO_BOARD_ROWS: readonly LayerDraft[] = [
  { id: "side-a-board", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "side-b-board", materialId: "gypsum_board", thicknessMm: "12.5" }
];

const DIRECT_FIXED_FULL_ABSORPTIVE_SURFACE = {
  cavities: [
    {
      absorberCoverageRatio: "1",
      absorberFlowResistivityPaSM2: "15000",
      absorberThicknessMm: "45",
      depthMm: "45",
      id: "cavity-1",
      sealState: "sealed",
      sequence: "1"
    }
  ],
  frameCoupling: {
    depthMm: "",
    frameMaterialClass: "",
    lineCouplingStiffnessMNPerM3: "",
    mechanicalBridgeAreaRatio: "",
    resilientConnectionStiffnessMNPerM3: "",
    resilientConnectionType: "",
    spacingMm: ""
  },
  frequencyBandSet: "",
  hostWallAreaM2: "",
  openingIntent: "",
  openings: [],
  outputBasis: "",
  panels: [],
  wallSolverIntent: ""
} as const satisfies WorkbenchAdvancedWallInputSurfaceDraft;

const DIRECT_FIXED_PARTIAL_ABSORPTIVE_SURFACE = {
  ...DIRECT_FIXED_FULL_ABSORPTIVE_SURFACE,
  cavities: [
    {
      ...DIRECT_FIXED_FULL_ABSORPTIVE_SURFACE.cavities[0],
      absorberCoverageRatio: "0.5",
      absorberThicknessMm: "22.5"
    }
  ]
} as const satisfies WorkbenchAdvancedWallInputSurfaceDraft;

const DIRECT_FIXED_FULL_BASE_CONTEXT: AirborneContext = {
  connectionType: "direct_fix",
  contextMode: "element_lab",
  studSpacingMm: 400,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 45,
    cavity1FillCoverage: "full",
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [1],
    supportTopology: "direct_fixed",
    topologyMode: "double_leaf_framed"
  }
};

const DIRECT_FIXED_PARTIAL_BASE_CONTEXT: AirborneContext = {
  ...DIRECT_FIXED_FULL_BASE_CONTEXT,
  wallTopology: {
    ...DIRECT_FIXED_FULL_BASE_CONTEXT.wallTopology,
    cavity1FillCoverage: "partial"
  }
};

const DIRECT_FIXED_EMPTY_CONTEXT: AirborneContext = {
  connectionType: "direct_fix",
  contextMode: "element_lab",
  studSpacingMm: 400,
  wallTopology: {
    cavity1AbsorptionClass: "none",
    cavity1DepthMm: 45,
    cavity1FillCoverage: "empty",
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [1],
    supportTopology: "direct_fixed",
    topologyMode: "double_leaf_framed"
  }
};

const DIRECT_FIXED_FULL_API_CONTEXT: AirborneContext = {
  ...DIRECT_FIXED_FULL_BASE_CONTEXT,
  advancedWall: {
    cavities: [
      {
        absorberCoverageRatio: 1,
        absorberFlowResistivityPaSM2: 15000,
        absorberThicknessMm: 45,
        depthMm: 45,
        id: "cavity-1",
        sealState: "sealed",
        sequence: 1
      }
    ]
  }
};

const DIRECT_FIXED_PARTIAL_API_CONTEXT: AirborneContext = {
  ...DIRECT_FIXED_PARTIAL_BASE_CONTEXT,
  advancedWall: {
    cavities: [
      {
        absorberCoverageRatio: 0.5,
        absorberFlowResistivityPaSM2: 15000,
        absorberThicknessMm: 22.5,
        depthMm: 45,
        id: "cavity-1",
        sealState: "sealed",
        sequence: 1
      }
    ]
  }
};

const DIRECT_FIXED_GATE_AY_PANEL_API_CONTEXT: AirborneContext = {
  ...DIRECT_FIXED_FULL_API_CONTEXT,
  advancedWall: {
    cavities: [
      {
        absorberCoverageRatio: 1,
        absorberFlowResistivityPaSM2: 15000,
        absorberThicknessMm: 45,
        depthMm: 45,
        id: "cavity-1",
        sealState: "sealed"
      }
    ],
    panels: [
      {
        criticalFrequencyHz: 2500,
        id: "panel-a",
        lossFactor: 0.03,
        materialClass: "gypsum_board",
        sequence: 1,
        surfaceMassKgM2: 10.6,
        thicknessMm: 12.5
      }
    ],
    wallSolverIntent: "advanced_source_absent_wall"
  }
};

const NON_DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT: AirborneContext = {
  ...DIRECT_FIXED_FULL_API_CONTEXT,
  connectionType: undefined,
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    ...DIRECT_FIXED_FULL_BASE_CONTEXT.wallTopology,
    cavity1DepthMm: 90,
    supportTopology: "independent_frames"
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

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function buildContextFromSnapshot(snapshot: ScenarioSnapshot): AirborneContext {
  const wallTopology = buildWorkbenchWallTopology(snapshot, snapshot.rows.length);
  if (!wallTopology) {
    throw new Error("Expected a saved direct-fixed context-owned absorptive cavity wall topology.");
  }

  const context: AirborneContext = {
    contextMode: snapshot.airborneContextMode,
    wallTopology
  };
  const studSpacingMm = parsePositiveNumber(snapshot.airborneStudSpacingMm);

  if (snapshot.airborneConnectionType && snapshot.airborneConnectionType !== "auto") {
    context.connectionType = snapshot.airborneConnectionType;
  }
  if (typeof studSpacingMm === "number") {
    context.studSpacingMm = studSpacingMm;
  }

  return context;
}

function buildScenario(input: {
  advancedWallInputSurface?: WorkbenchAdvancedWallInputSurfaceDraft | null;
  airborneContext?: AirborneContext;
  id: string;
  rows?: readonly LayerDraft[];
  source?: "current" | "saved";
  targetOutputs?: readonly RequestedOutputId[];
}): EvaluatedScenario & { result: AssemblyCalculation } {
  const scenario = evaluateScenario({
    advancedWallInputSurface: Object.hasOwn(input, "advancedWallInputSurface")
      ? input.advancedWallInputSurface
      : DIRECT_FIXED_FULL_ABSORPTIVE_SURFACE,
    airborneContext: input.airborneContext ?? DIRECT_FIXED_FULL_BASE_CONTEXT,
    calculator: "dynamic",
    id: input.id,
    name: `Direct-fixed context-owned absorptive cavity surface ${input.id}`,
    rows: input.rows ?? TWO_BOARD_ROWS,
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
    clientName: "Direct Fixed Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Double-Leaf Direct-Fixed Context-Owned Absorptive Cavity Surface",
    reportProfile: "consultant",
    requestedOutputs,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "wall",
    targetLnwDb: "",
    targetRwDb: "35"
  });
}

function expectDirectFixedAbsorptiveSurface(
  result: AssemblyCalculation | null | undefined,
  expected: {
    C: number;
    Ctr: number;
    Rw: number;
    STC: number;
  }
): asserts result is AssemblyCalculation {
  expect(result?.supportedTargetOutputs).toEqual([...WALL_LAB_OUTPUTS]);
  expect(result?.unsupportedTargetOutputs).toEqual([]);
  expect(result?.metrics).toMatchObject({
    estimatedCDb: expected.C,
    estimatedCtrDb: expected.Ctr,
    estimatedRwDb: expected.Rw,
    estimatedStc: expected.STC
  });
  expect(result?.airborneBasis).toMatchObject({
    errorBudgetDb: 6,
    method: GATE_EO_DIRECT_FIXED_RUNTIME_BASIS,
    missingPhysicalInputs: [],
    origin: "family_physics_prediction"
  });
  expect(result?.airborneBasis?.requiredInputs).toEqual(
    expect.arrayContaining([
      "cavity1FillCoverage",
      "cavity1AbsorptionClass=porous_absorptive",
      "absorberFlowResistivityPaSM2",
      "directFixedContextAbsorptiveCavityOwner",
      "porousCavityDampingOwner",
      "directFixedEquivalentCoupledMassOwner",
      "directFixedBridgeLossOwner"
    ])
  );
  expect(result?.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: true,
    selectedCandidateId: GATE_EO_DIRECT_FIXED_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction"
  });
  expect(result?.warnings).toEqual(expect.arrayContaining([expect.stringContaining(GATE_EO_DIRECT_FIXED_WARNING)]));
}

function expectMissingAbsorberOwnershipSurface(
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
}

async function estimateViaApi(input: {
  airborneContext?: AirborneContext;
  targetOutputs?: readonly RequestedOutputId[];
} = {}): Promise<AssemblyCalculation> {
  const { POST: estimate } = await import("../../app/api/estimate/route");
  const response = await estimate(
    jsonRequest("http://localhost/api/estimate", {
      airborneContext: input.airborneContext ?? DIRECT_FIXED_FULL_API_CONTEXT,
      calculator: "dynamic",
      layers: toLayerInputs(TWO_BOARD_ROWS),
      targetOutputs: input.targetOutputs ?? WALL_LAB_OUTPUTS
    })
  );
  const body = (await response.json()) as { ok?: boolean; result?: AssemblyCalculation };

  expect(response.status).toBe(200);
  expect(body.ok).toBe(true);
  expect(body.result).toBeDefined();

  return body.result as AssemblyCalculation;
}

async function saveDirectFixedAbsorptiveCavitySnapshot(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();

  store.reset();
  store.startStudyMode("wall");
  store.setCalculatorId("dynamic");
  store.clearRows();
  store.appendRows(withoutIds(TWO_BOARD_ROWS));
  store.setRequestedOutputs([...WALL_LAB_OUTPUTS]);
  store.setAirborneContextMode("element_lab");
  store.setAirborneConnectionType("direct_fix");
  store.setAirborneStudSpacingMm("400");
  store.setAirborneWallTopologyMode("double_leaf_framed");
  store.setAirborneWallSideALeafLayerIndices("1");
  store.setAirborneWallCavity1DepthMm("45");
  store.setAirborneWallCavity1FillCoverage("full");
  store.setAirborneWallCavity1AbsorptionClass("porous_absorptive");
  store.setAirborneWallSideBLeafLayerIndices("2");
  store.setAirborneWallSupportTopology("direct_fixed");
  store.replaceAirborneAdvancedWallInputSurface(DIRECT_FIXED_FULL_ABSORPTIVE_SURFACE);
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Expected the workbench store to save the direct-fixed context absorptive cavity snapshot.");
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

describe("post-V1 wall double-leaf/framed direct-fixed context absorptive cavity owner surface parity", () => {
  it("shows the full direct-fixed absorptive cavity formula result on cards, status, report, and calculator API", async () => {
    const scenario = buildScenario({ id: "direct-fixed-context-absorptive-cavity-full" });
    expectDirectFixedAbsorptiveSurface(scenario.result, {
      C: -1.2,
      Ctr: -5.9,
      Rw: 35,
      STC: 35
    });

    expect(addOutputCardPosture(buildOutputCard({ output: "Rw", result: scenario.result, studyMode: "wall" }), {
      result: scenario.result,
      studyMode: "wall"
    })).toMatchObject({ status: "live", value: "35 dB" });
    expect(addOutputCardPosture(buildOutputCard({ output: "STC", result: scenario.result, studyMode: "wall" }), {
      result: scenario.result,
      studyMode: "wall"
    })).toMatchObject({ status: "live", value: "35 dB" });
    expect(addOutputCardPosture(buildOutputCard({ output: "C", result: scenario.result, studyMode: "wall" }), {
      result: scenario.result,
      studyMode: "wall"
    })).toMatchObject({ status: "live", value: "-1.2 dB" });
    expect(addOutputCardPosture(buildOutputCard({ output: "Ctr", result: scenario.result, studyMode: "wall" }), {
      result: scenario.result,
      studyMode: "wall"
    })).toMatchObject({ status: "live", value: "-5.9 dB" });
    expect(getTargetOutputStatus({ guideResult: null, output: "Rw", result: scenario.result })).toMatchObject({
      kind: "engine_live",
      label: "Live",
      output: "Rw",
      tone: "success"
    });

    const report = buildReport(scenario);
    expect(report).toContain("- Rw estimate: 35.0 dB");
    expect(report).toContain("- Spectrum adaptation terms: C -1.2 dB, Ctr -5.9 dB");
    expect(report).toContain("- STC: 35.0 dB");
    expect(report).toContain(`- Airborne runtime basis: ${GATE_EO_DIRECT_FIXED_RUNTIME_BASIS}`);
    expect(report).toContain(`- Airborne selected candidate: ${GATE_EO_DIRECT_FIXED_SELECTED_CANDIDATE_ID}`);
    expect(report).toContain("- Airborne selected origin: family_physics_prediction");
    expect(report).toContain("- Airborne not-measured budget: +/- 6.0 dB");

    expectDirectFixedAbsorptiveSurface(await estimateViaApi(), {
      C: -1.2,
      Ctr: -5.9,
      Rw: 35,
      STC: 35
    });
  });

  it("keeps partial absorber and saved/server replay on the same direct-fixed owner surface", async () => {
    const partial = buildScenario({
      advancedWallInputSurface: DIRECT_FIXED_PARTIAL_ABSORPTIVE_SURFACE,
      airborneContext: DIRECT_FIXED_PARTIAL_BASE_CONTEXT,
      id: "direct-fixed-context-absorptive-cavity-partial"
    });
    expectDirectFixedAbsorptiveSurface(partial.result, {
      C: -1.2,
      Ctr: -5.9,
      Rw: 33,
      STC: 33
    });
    expectDirectFixedAbsorptiveSurface(await estimateViaApi({ airborneContext: DIRECT_FIXED_PARTIAL_API_CONTEXT }), {
      C: -1.2,
      Ctr: -5.9,
      Rw: 33,
      STC: 33
    });

    const savedSnapshot = await saveDirectFixedAbsorptiveCavitySnapshot();
    expect(savedSnapshot.airborneConnectionType).toBe("direct_fix");
    expect(savedSnapshot.airborneWallSupportTopology).toBe("direct_fixed");
    expect(savedSnapshot.airborneWallCavity1DepthMm).toBe("45");
    expect(savedSnapshot.airborneWallCavity1FillCoverage).toBe("full");
    expect(savedSnapshot.airborneWallCavity1AbsorptionClass).toBe("porous_absorptive");
    expect(savedSnapshot.airborneAdvancedWallInputSurface?.cavities[0]?.absorberFlowResistivityPaSM2).toBe("15000");

    const savedScenario = buildScenario({
      advancedWallInputSurface: savedSnapshot.airborneAdvancedWallInputSurface,
      airborneContext: buildContextFromSnapshot(savedSnapshot),
      id: "direct-fixed-context-absorptive-cavity-saved",
      rows: savedSnapshot.rows,
      source: "saved",
      targetOutputs: savedSnapshot.requestedOutputs
    });
    expectDirectFixedAbsorptiveSurface(savedScenario.result, {
      C: -1.2,
      Ctr: -5.9,
      Rw: 35,
      STC: 35
    });

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();
    expect(parsedServerSnapshot?.airborneConnectionType).toBe("direct_fix");
    expect(parsedServerSnapshot?.airborneWallSupportTopology).toBe("direct_fixed");
    expect(parsedServerSnapshot?.airborneAdvancedWallInputSurface?.cavities[0]?.absorberFlowResistivityPaSM2).toBe(
      "15000"
    );

    const serverScenario = buildScenario({
      advancedWallInputSurface: parsedServerSnapshot?.airborneAdvancedWallInputSurface,
      airborneContext: buildContextFromSnapshot(parsedServerSnapshot as ScenarioSnapshot),
      id: "direct-fixed-context-absorptive-cavity-server",
      rows: parsedServerSnapshot?.rows ?? [],
      source: "saved",
      targetOutputs: parsedServerSnapshot?.requestedOutputs ?? WALL_LAB_OUTPUTS
    });
    expectDirectFixedAbsorptiveSurface(serverScenario.result, {
      C: -1.2,
      Ctr: -5.9,
      Rw: 35,
      STC: 35
    });
  });

  it("keeps empty cavity, missing ownership, Gate AY panels, and non-lab metric requests outside this surface", async () => {
    const empty = buildScenario({
      advancedWallInputSurface: null,
      airborneContext: DIRECT_FIXED_EMPTY_CONTEXT,
      id: "direct-fixed-context-absorptive-cavity-empty"
    }).result;
    expect(empty.metrics).toMatchObject({
      estimatedCDb: -1.2,
      estimatedCtrDb: -5.9,
      estimatedRwDb: 31,
      estimatedStc: 31
    });
    expect(empty.airborneBasis?.method).toBe(GATE_EO_DIRECT_FIXED_RUNTIME_BASIS);
    expect(empty.airborneBasis?.requiredInputs).not.toContain("directFixedContextAbsorptiveCavityOwner");

    const nonDirect = buildScenario({
      airborneContext: NON_DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT,
      id: "direct-fixed-context-absorptive-cavity-non-direct"
    }).result;
    expect(nonDirect.airborneBasis?.method).not.toBe(GATE_EO_DIRECT_FIXED_RUNTIME_BASIS);
    expect(nonDirect.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      GATE_EO_DIRECT_FIXED_SELECTED_CANDIDATE_ID
    );

    const missingFlow = buildScenario({
      advancedWallInputSurface: null,
      airborneContext: DIRECT_FIXED_FULL_BASE_CONTEXT,
      id: "direct-fixed-context-absorptive-cavity-missing-flow"
    }).result;
    expectMissingAbsorberOwnershipSurface(missingFlow);
    expect(addOutputCardPosture(buildOutputCard({ output: "Rw", result: missingFlow, studyMode: "wall" }), {
      result: missingFlow,
      studyMode: "wall"
    })).toMatchObject({
      detail: expect.stringContaining("cavity1FillCoverage"),
      status: "needs_input",
      value: "Not ready"
    });

    const gateAyPanels = await estimateViaApi({ airborneContext: DIRECT_FIXED_GATE_AY_PANEL_API_CONTEXT });
    expect(gateAyPanels.supportedTargetOutputs).toEqual([]);
    expect(gateAyPanels.airborneBasis).toMatchObject({
      method: "gate_ay_advanced_wall_source_absent_direct_curve_runtime_corridor",
      origin: "needs_input"
    });

    const fieldAlias = buildScenario({
      id: "direct-fixed-context-absorptive-cavity-field-alias",
      targetOutputs: WALL_FIELD_ALIAS_OUTPUTS
    }).result;
    expect(fieldAlias.supportedTargetOutputs).toEqual([]);
    expect(fieldAlias.unsupportedTargetOutputs).toEqual([...WALL_FIELD_ALIAS_OUTPUTS]);

    const astm = buildScenario({
      id: "direct-fixed-context-absorptive-cavity-astm",
      targetOutputs: ASTM_OUTPUTS
    }).result;
    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual([...ASTM_OUTPUTS]);

    const impact = buildScenario({
      id: "direct-fixed-context-absorptive-cavity-impact",
      targetOutputs: IMPACT_OUTPUTS
    }).result;
    expect(impact.impact).toBeNull();
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);

    expectMissingAbsorberOwnershipSurface(
      await estimateViaApi({ airborneContext: DIRECT_FIXED_FULL_BASE_CONTEXT })
    );
  });

  it("keeps docs and current-gate runner aligned with the landed surface parity and selected coverage refresh", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const text = readRepoFile(path);
      const normalized = text.replace(/\s+/g, " ");

      expect(text, path).toContain(PREVIOUS_OWNER_ACTION);
      expect(text, path).toContain(PREVIOUS_OWNER_FILE);
      expect(text, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(text, path).toContain(SURFACE_PARITY_ACTION);
      expect(text, path).toContain(SURFACE_PARITY_FILE);
      expect(text, path).toContain(SURFACE_PARITY_STATUS);
      expect(text, path).toContain(SELECTED_NEXT_ACTION);
      expect(text, path).toContain(SELECTED_NEXT_FILE);
      expect(normalized, path).toContain(SELECTED_NEXT_LABEL);
      expect(text, path).toContain(GATE_EO_DIRECT_FIXED_RUNTIME_BASIS);
      expect(text, path).toContain(GATE_EO_DIRECT_FIXED_SELECTED_CANDIDATE_ID);
      expect(text, path).toContain("Rw 35");
      expect(text, path).toContain("STC 35");
      expect(text, path).toContain("Rw 33");
      expect(text, path).toContain("Rw 31");
      expect(text, path).toContain("C -1.2");
      expect(text, path).toContain("Ctr -5.9");
      expect(text, path).toContain("webSurfaceParityContractFilesTouched: 1");
      expect(text, path).toContain("frontendImplementationFilesTouched: 1");
      expect(text, path).toContain("runtimeValuesMoved 0");
      expect(text, path).toContain("runtimeFormulaRetunes: 0");
      expect(text, path).toContain("sourceRowsImported: 0");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(SURFACE_PARITY_FILE.replace("apps/web/", ""));
  });
});
