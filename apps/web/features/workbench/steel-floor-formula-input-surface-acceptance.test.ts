import type {
  AssemblyCalculation,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { evaluateScenario, type EvaluatedScenario } from "./scenario-analysis";
import {
  addOutputCardPosture,
  buildOutputCard
} from "./simple-workbench-output-model";
import { getPresetById } from "./preset-definitions";
import {
  buildServerProjectWorkbenchSnapshot,
  parseServerProjectWorkbenchSnapshot
} from "./server-project-workbench-snapshot";
import {
  buildWorkbenchSteelFloorFormulaInputSurface,
  type WorkbenchSteelFloorFormulaInputSurfaceDraft
} from "./steel-floor-formula-input-surface";
import type { LayerDraft, ScenarioSnapshot } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const STEEL_FORMULA_BASIS = "predictor_lightweight_steel_mass_spring_holdout_corridor_estimate";
const STEEL_SUSPENDED_CEILING_FORMULA_BASIS =
  "predictor_lightweight_steel_suspended_ceiling_corridor_estimate";
const TARGET_OUTPUTS = ["Rw", "Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const SUSPENDED_TARGET_OUTPUTS = ["Ln,w", "DeltaLw", "IIC", "L'nT,50"] as const satisfies readonly RequestedOutputId[];
const FIELD_TARGET_OUTPUTS = ["L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

const MODULAR_STEEL_FLOOR_ROWS: readonly LayerDraft[] = [
  { floorRole: "floor_covering", id: "finish", materialId: "ceramic_tile", thicknessMm: "10" },
  { floorRole: "floating_screed", id: "deck", materialId: "cement_board", thicknessMm: "18" },
  { floorRole: "resilient_layer", id: "underlay", materialId: "generic_resilient_underlay", thicknessMm: "4.5" },
  { floorRole: "base_structure", id: "steel", materialId: "lightweight_steel_floor", thicknessMm: "200" },
  { floorRole: "ceiling_cavity", id: "cavity", materialId: "air_gap", thicknessMm: "200" },
  { floorRole: "ceiling_fill", id: "fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_board", id: "board", materialId: "gypsum_board", thicknessMm: "12.5" }
];

const COMPLETE_OPEN_WEB_SURFACE = {
  impactSteelCarrierDepthMm: "200",
  impactSteelCarrierSpacingMm: "600",
  impactSteelLoadBasisKgM2: "64",
  impactSteelLowerCeilingIsolationSupportForm: "elastic_furred_channels",
  impactSteelResilientLayerDynamicStiffnessMNm3: "35",
  impactSteelSupportForm: "open_web_or_rolled"
} as const satisfies WorkbenchSteelFloorFormulaInputSurfaceDraft;

const SUSPENDED_CEILING_STEEL_ROWS: readonly LayerDraft[] = [
  { floorRole: "floor_covering", id: "finish", materialId: "vinyl_flooring", thicknessMm: "3" },
  { floorRole: "base_structure", id: "steel", materialId: "steel_joist_floor", thicknessMm: "250" },
  { floorRole: "ceiling_cavity", id: "cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "120" },
  { floorRole: "ceiling_fill", id: "fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_board", id: "board-a", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", id: "board-b", materialId: "firestop_board", thicknessMm: "16" }
];

const COMPLETE_SUSPENDED_CEILING_SURFACE = {
  impactSteelCarrierDepthMm: "250",
  impactSteelCarrierSpacingMm: "600",
  impactSteelLoadBasisKgM2: "",
  impactSteelLowerCeilingIsolationSupportForm: "elastic_furred_channels",
  impactSteelResilientLayerDynamicStiffnessMNm3: "",
  impactSteelSupportForm: "joist_or_purlin"
} as const satisfies WorkbenchSteelFloorFormulaInputSurfaceDraft;

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

function toLayerInputs(rows: readonly LayerDraft[]): LayerInput[] {
  return rows.flatMap((row) => {
    const thicknessMm = Number.parseFloat(row.thicknessMm.replace(",", "."));
    return Number.isFinite(thicknessMm) && thicknessMm > 0
      ? [{
          floorRole: row.floorRole,
          materialId: row.materialId,
          thicknessMm
        }]
      : [];
  });
}

function withoutIds(rows: readonly LayerDraft[]): Array<Omit<LayerDraft, "id">> {
  return rows.map((row) => {
    const draft: Omit<LayerDraft, "id"> = {
      materialId: row.materialId,
      thicknessMm: row.thicknessMm
    };

    if (row.densityKgM3 !== undefined) {
      draft.densityKgM3 = row.densityKgM3;
    }

    if (row.dynamicStiffnessMNm3 !== undefined) {
      draft.dynamicStiffnessMNm3 = row.dynamicStiffnessMNm3;
    }

    if (row.floorRole !== undefined) {
      draft.floorRole = row.floorRole;
    }

    return draft;
  });
}

function surfaceFromScenario(snapshot: Pick<
  ScenarioSnapshot,
  | "impactSteelCarrierDepthMm"
  | "impactSteelCarrierSpacingMm"
  | "impactSteelLoadBasisKgM2"
  | "impactSteelLowerCeilingIsolationSupportForm"
  | "impactSteelResilientLayerDynamicStiffnessMNm3"
  | "impactSteelSupportForm"
>): WorkbenchSteelFloorFormulaInputSurfaceDraft {
  return {
    impactSteelCarrierDepthMm: snapshot.impactSteelCarrierDepthMm,
    impactSteelCarrierSpacingMm: snapshot.impactSteelCarrierSpacingMm,
    impactSteelLoadBasisKgM2: snapshot.impactSteelLoadBasisKgM2,
    impactSteelLowerCeilingIsolationSupportForm: snapshot.impactSteelLowerCeilingIsolationSupportForm,
    impactSteelResilientLayerDynamicStiffnessMNm3: snapshot.impactSteelResilientLayerDynamicStiffnessMNm3,
    impactSteelSupportForm: snapshot.impactSteelSupportForm
  };
}

function evaluateSteelScenario(input: {
  id?: string;
  rows?: readonly LayerDraft[];
  source?: "current" | "saved";
  surface?: WorkbenchSteelFloorFormulaInputSurfaceDraft | null;
  targetOutputs?: readonly RequestedOutputId[];
}): EvaluatedScenario {
  return evaluateScenario({
    id: input.id ?? "gate-ag-web-steel-floor-formula-input-surface",
    name: "Gate AG web steel input surface",
    rows: input.rows ?? MODULAR_STEEL_FLOOR_ROWS,
    source: input.source ?? "current",
    steelFloorFormulaInputSurface: input.surface ?? COMPLETE_OPEN_WEB_SURFACE,
    studyMode: "floor",
    targetOutputs: input.targetOutputs ?? TARGET_OUTPUTS
  });
}

function evaluateSuspendedCeilingSteelScenario(input: {
  id?: string;
  rows?: readonly LayerDraft[];
  source?: "current" | "saved";
  surface?: WorkbenchSteelFloorFormulaInputSurfaceDraft | null;
  targetOutputs?: readonly RequestedOutputId[];
}): EvaluatedScenario {
  return evaluateScenario({
    id: input.id ?? "gate-bl-web-steel-suspended-ceiling-input-surface",
    name: "Gate BL web steel suspended-ceiling input surface",
    rows: input.rows ?? SUSPENDED_CEILING_STEEL_ROWS,
    source: input.source ?? "current",
    steelFloorFormulaInputSurface: input.surface ?? COMPLETE_SUSPENDED_CEILING_SURFACE,
    studyMode: "floor",
    targetOutputs: input.targetOutputs ?? SUSPENDED_TARGET_OUTPUTS
  });
}

function expectSteelFormulaResult(result: AssemblyCalculation | null | undefined) {
  expect(result?.impact).toMatchObject({
    basis: STEEL_FORMULA_BASIS,
    DeltaLw: 22.4,
    LnW: 55.6,
    labOrField: "lab"
  });
  expect(result?.impactPredictorStatus).toMatchObject({
    implementedFormulaEstimate: true,
    inputMode: "explicit_predictor_input"
  });
}

function expectSteelFormulaScenario(scenario: EvaluatedScenario) {
  expectSteelFormulaResult(scenario.result);

  const lnwCard = addOutputCardPosture(
    buildOutputCard({ output: "Ln,w", result: scenario.result, studyMode: "floor" }),
    { result: scenario.result, studyMode: "floor" }
  );
  const deltaCard = addOutputCardPosture(
    buildOutputCard({ output: "DeltaLw", result: scenario.result, studyMode: "floor" }),
    { result: scenario.result, studyMode: "floor" }
  );

  expect(lnwCard).toMatchObject({
    postureLabel: "Steel formula corridor",
    status: "live",
    value: "55.6 dB"
  });
  expect(lnwCard.detail).toContain("+/-4.5 dB corridor tolerance");
  expect(deltaCard).toMatchObject({
    postureLabel: "Steel formula corridor",
    status: "live",
    value: "22.4 dB"
  });
  expect(deltaCard.detail).toContain("+/-2.0 dB corridor tolerance");
}

function expectSteelSuspendedCeilingResult(result: AssemblyCalculation | null | undefined) {
  expect(result?.impact).toMatchObject({
    basis: STEEL_SUSPENDED_CEILING_FORMULA_BASIS,
    LnW: 62.2,
    labOrField: "lab"
  });
  expect(result?.impact?.DeltaLw).toBeUndefined();
  expect(result?.floorSystemEstimate).toBeNull();
  expect(result?.impactPredictorStatus).toMatchObject({
    implementedFormulaEstimate: true,
    implementedLowConfidenceEstimate: false,
    inputMode: "explicit_predictor_input"
  });
}

function expectSteelSuspendedCeilingScenario(scenario: EvaluatedScenario) {
  expectSteelSuspendedCeilingResult(scenario.result);

  const lnwCard = addOutputCardPosture(
    buildOutputCard({ output: "Ln,w", result: scenario.result, studyMode: "floor" }),
    { result: scenario.result, studyMode: "floor" }
  );
  const deltaCard = addOutputCardPosture(
    buildOutputCard({ output: "DeltaLw", result: scenario.result, studyMode: "floor" }),
    { result: scenario.result, studyMode: "floor" }
  );

  expect(lnwCard).toMatchObject({
    postureLabel: "Steel formula corridor",
    status: "live",
    value: "62.2 dB"
  });
  expect(lnwCard.detail).toContain("Gate BK lightweight-steel suspended-ceiling-only formula corridor");
  expect(lnwCard.detail).toContain("+/-6.0 dB corridor tolerance");
  expect(deltaCard).toMatchObject({
    status: "unsupported",
    value: "Not ready"
  });
}

function buildSteelFormulaReport(
  scenario: EvaluatedScenario,
  requestedOutputs: readonly RequestedOutputId[] = TARGET_OUTPUTS
) {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("heavy_concrete_impact_floor"),
    briefNote: "",
    clientName: "Gate AG Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate AG Steel Formula Acceptance",
    reportProfile: "consultant",
    requestedOutputs,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "50",
    targetRwDb: "60"
  });
}

async function saveCompleteSteelStoreSnapshot(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();
  store.reset();
  store.startStudyMode("floor");
  store.clearRows();
  store.appendRows(withoutIds(MODULAR_STEEL_FLOOR_ROWS));
  store.setRequestedOutputs([...TARGET_OUTPUTS]);
  store.setImpactSteelCarrierDepthMm(COMPLETE_OPEN_WEB_SURFACE.impactSteelCarrierDepthMm);
  store.setImpactSteelCarrierSpacingMm(COMPLETE_OPEN_WEB_SURFACE.impactSteelCarrierSpacingMm);
  store.setImpactSteelLoadBasisKgM2(COMPLETE_OPEN_WEB_SURFACE.impactSteelLoadBasisKgM2);
  store.setImpactSteelLowerCeilingIsolationSupportForm(
    COMPLETE_OPEN_WEB_SURFACE.impactSteelLowerCeilingIsolationSupportForm
  );
  store.setImpactSteelResilientLayerDynamicStiffnessMNm3(
    COMPLETE_OPEN_WEB_SURFACE.impactSteelResilientLayerDynamicStiffnessMNm3
  );
  store.setImpactSteelSupportForm(COMPLETE_OPEN_WEB_SURFACE.impactSteelSupportForm);
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Gate AG expected the workbench store to save a steel formula snapshot.");
  }

  return savedSnapshot;
}

async function saveCompleteSteelSuspendedCeilingStoreSnapshot(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();
  store.reset();
  store.startStudyMode("floor");
  store.clearRows();
  store.appendRows(withoutIds(SUSPENDED_CEILING_STEEL_ROWS));
  store.setRequestedOutputs([...SUSPENDED_TARGET_OUTPUTS]);
  store.setImpactSteelCarrierDepthMm(COMPLETE_SUSPENDED_CEILING_SURFACE.impactSteelCarrierDepthMm);
  store.setImpactSteelCarrierSpacingMm(COMPLETE_SUSPENDED_CEILING_SURFACE.impactSteelCarrierSpacingMm);
  store.setImpactSteelLoadBasisKgM2(COMPLETE_SUSPENDED_CEILING_SURFACE.impactSteelLoadBasisKgM2);
  store.setImpactSteelLowerCeilingIsolationSupportForm(
    COMPLETE_SUSPENDED_CEILING_SURFACE.impactSteelLowerCeilingIsolationSupportForm
  );
  store.setImpactSteelResilientLayerDynamicStiffnessMNm3(
    COMPLETE_SUSPENDED_CEILING_SURFACE.impactSteelResilientLayerDynamicStiffnessMNm3
  );
  store.setImpactSteelSupportForm(COMPLETE_SUSPENDED_CEILING_SURFACE.impactSteelSupportForm);
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Gate BL expected the workbench store to save a steel suspended-ceiling snapshot.");
  }

  return savedSnapshot;
}

beforeEach(() => {
  originalEnv = Object.fromEntries(AUTH_ENV_KEYS.map((key) => [key, process.env[key]] as const));
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

describe("steel floor formula input surface acceptance", () => {
  it("keeps complete steel input-surface parity across live, local saved, server snapshot, cards, and report", async () => {
    const liveScenario = evaluateSteelScenario({ id: "gate-ag-live" });
    expectSteelFormulaScenario(liveScenario);

    const report = buildSteelFormulaReport(liveScenario);
    expect(report).toContain("- Impact lane: Lightweight-steel formula corridor");
    expect(report).toContain("- Formula note: Corridor tolerance remains +/-4.5 dB for Ln,w and +/-2 dB for DeltaLw.");

    const savedSnapshot = await saveCompleteSteelStoreSnapshot();
    expect(savedSnapshot).toMatchObject(COMPLETE_OPEN_WEB_SURFACE);

    const savedScenario = evaluateSteelScenario({
      id: "gate-ag-saved",
      rows: savedSnapshot?.rows,
      source: "saved",
      surface: savedSnapshot ? surfaceFromScenario(savedSnapshot) : null,
      targetOutputs: savedSnapshot?.requestedOutputs
    });
    expectSteelFormulaScenario(savedScenario);

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot as ScenarioSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();

    const serverScenario = evaluateSteelScenario({
      id: "gate-ag-server",
      rows: parsedServerSnapshot?.rows,
      source: "saved",
      surface: parsedServerSnapshot ? surfaceFromScenario(parsedServerSnapshot) : null,
      targetOutputs: parsedServerSnapshot?.requestedOutputs
    });
    expectSteelFormulaScenario(serverScenario);
  });

  it("keeps complete steel suspended-ceiling parity across live, saved, server snapshot, cards, and report", async () => {
    const liveScenario = evaluateSuspendedCeilingSteelScenario({ id: "gate-bl-live" });
    expectSteelSuspendedCeilingScenario(liveScenario);

    const report = buildSteelFormulaReport(liveScenario, SUSPENDED_TARGET_OUTPUTS);
    expect(report).toContain("- Impact lane: Lightweight-steel suspended-ceiling formula corridor");
    expect(report).toContain("- Formula note: Gate BK steel suspended-ceiling-only corridor remains a source-absent lab estimate, not a measured row.");
    expect(report).toContain("- Formula note: Corridor tolerance remains +/-6 dB for Ln,w.");

    const savedSnapshot = await saveCompleteSteelSuspendedCeilingStoreSnapshot();
    expect(savedSnapshot).toMatchObject(COMPLETE_SUSPENDED_CEILING_SURFACE);

    const savedScenario = evaluateSuspendedCeilingSteelScenario({
      id: "gate-bl-saved",
      rows: savedSnapshot.rows,
      source: "saved",
      surface: surfaceFromScenario(savedSnapshot),
      targetOutputs: savedSnapshot.requestedOutputs
    });
    expectSteelSuspendedCeilingScenario(savedScenario);

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();

    const serverScenario = evaluateSuspendedCeilingSteelScenario({
      id: "gate-bl-server",
      rows: parsedServerSnapshot?.rows,
      source: "saved",
      surface: parsedServerSnapshot ? surfaceFromScenario(parsedServerSnapshot) : null,
      targetOutputs: parsedServerSnapshot?.requestedOutputs
    });
    expectSteelSuspendedCeilingScenario(serverScenario);
  });

  it("keeps calculator API payloads on the same formula basis without promoting field outputs", async () => {
    const layers = toLayerInputs(MODULAR_STEEL_FLOOR_ROWS);
    const surface = buildWorkbenchSteelFloorFormulaInputSurface({
      layers,
      surface: COMPLETE_OPEN_WEB_SURFACE,
      targetOutputs: TARGET_OUTPUTS
    });
    expect(surface.status).toBe("ready_for_formula_corridor");

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const { POST: impactOnly } = await import("../../app/api/impact-only/route");

    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        impactPredictorInput: surface.impactPredictorInput,
        layers,
        targetOutputs: TARGET_OUTPUTS
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };
    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.ok).toBe(true);
    expectSteelFormulaResult(estimateBody.result);

    const impactResponse = await impactOnly(
      jsonRequest("http://localhost/api/impact-only", {
        impactPredictorInput: surface.impactPredictorInput,
        layers,
        targetOutputs: FIELD_TARGET_OUTPUTS
      })
    );
    const impactBody = (await impactResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };
    expect(impactResponse.status).toBe(200);
    expect(impactBody.ok).toBe(true);
    expect(impactBody.result?.impact).toMatchObject({
      basis: STEEL_FORMULA_BASIS,
      labOrField: "lab"
    });
    expect(impactBody.result?.unsupportedTargetOutputs).toEqual(
      expect.arrayContaining([...FIELD_TARGET_OUTPUTS])
    );
    expect(impactBody.result?.impact?.LPrimeNW).toBeUndefined();
    expect(impactBody.result?.impact?.LPrimeNTw).toBeUndefined();

    const suspendedLayers = toLayerInputs(SUSPENDED_CEILING_STEEL_ROWS);
    const suspendedSurface = buildWorkbenchSteelFloorFormulaInputSurface({
      layers: suspendedLayers,
      surface: COMPLETE_SUSPENDED_CEILING_SURFACE,
      targetOutputs: SUSPENDED_TARGET_OUTPUTS
    });
    expect(suspendedSurface.status).toBe("ready_for_formula_corridor");

    const suspendedEstimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        impactPredictorInput: suspendedSurface.impactPredictorInput,
        layers: suspendedLayers,
        targetOutputs: SUSPENDED_TARGET_OUTPUTS
      })
    );
    const suspendedEstimateBody = (await suspendedEstimateResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };
    expect(suspendedEstimateResponse.status).toBe(200);
    expect(suspendedEstimateBody.ok).toBe(true);
    expectSteelSuspendedCeilingResult(suspendedEstimateBody.result);

    const suspendedImpactResponse = await impactOnly(
      jsonRequest("http://localhost/api/impact-only", {
        impactPredictorInput: suspendedSurface.impactPredictorInput,
        layers: suspendedLayers,
        targetOutputs: SUSPENDED_TARGET_OUTPUTS
      })
    );
    const suspendedImpactBody = (await suspendedImpactResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };
    expect(suspendedImpactResponse.status).toBe(200);
    expect(suspendedImpactBody.ok).toBe(true);
    expectSteelSuspendedCeilingResult(suspendedImpactBody.result);
    expect(suspendedImpactBody.result?.unsupportedTargetOutputs).toEqual(
      expect.arrayContaining(["DeltaLw", "IIC", "L'nT,50"])
    );
  });

  it("gives precise missing-input guidance for empty, zero, negative, comma, and removed fields", () => {
    const commaDecimal = evaluateSteelScenario({
      surface: {
        ...COMPLETE_OPEN_WEB_SURFACE,
        impactSteelCarrierSpacingMm: "600,0",
        impactSteelLoadBasisKgM2: "64,0"
      }
    });
    expectSteelFormulaResult(commaDecimal.result);

    const emptySpacing = evaluateSteelScenario({
      surface: {
        ...COMPLETE_OPEN_WEB_SURFACE,
        impactSteelCarrierSpacingMm: ""
      }
    });
    expect(emptySpacing.result?.impact?.basis).not.toBe(STEEL_FORMULA_BASIS);
    expect(emptySpacing.warnings.join("\n")).toContain("Steel carrier spacing (mm)");

    const invalidFields = evaluateSteelScenario({
      surface: {
        ...COMPLETE_OPEN_WEB_SURFACE,
        impactSteelLoadBasisKgM2: "-64",
        impactSteelResilientLayerDynamicStiffnessMNm3: "0"
      }
    });
    expect(invalidFields.result?.impact?.basis).not.toBe(STEEL_FORMULA_BASIS);
    expect(invalidFields.warnings.join("\n")).toContain("Resilient-layer load basis (kg/m2)");
    expect(invalidFields.warnings.join("\n")).toContain("Upper resilient dynamic stiffness (MN/m3)");

    const completeThenRemoved = evaluateSteelScenario({});
    expectSteelFormulaResult(completeThenRemoved.result);
    const removedField = evaluateSteelScenario({
      surface: {
        ...COMPLETE_OPEN_WEB_SURFACE,
        impactSteelLoadBasisKgM2: ""
      }
    });
    expect(removedField.result?.impact?.basis).not.toBe(STEEL_FORMULA_BASIS);
    expect(removedField.warnings.join("\n")).toContain("Resilient-layer load basis (kg/m2)");
  });

  it("keeps hostile layer edits bounded across many layers, safe reorder, duplicate carriers, split carriers, and steel toggles", () => {
    const manyLayerRows = [
      ...MODULAR_STEEL_FLOOR_ROWS.slice(0, 3),
      ...Array.from({ length: 16 }, (_, index) => ({
        floorRole: "floor_covering" as const,
        id: `finish-extra-${index + 1}`,
        materialId: "vinyl_flooring",
        thicknessMm: ""
      })),
      ...MODULAR_STEEL_FLOOR_ROWS.slice(3)
    ];
    const manyLayerScenario = evaluateSteelScenario({ rows: manyLayerRows });
    expectSteelFormulaResult(manyLayerScenario.result);
    expect(manyLayerScenario.warnings.filter((warning) => /missing a valid thickness/i.test(warning))).toHaveLength(16);

    const safelyReorderedRows = [
      MODULAR_STEEL_FLOOR_ROWS[2]!,
      MODULAR_STEEL_FLOOR_ROWS[0]!,
      MODULAR_STEEL_FLOOR_ROWS[1]!,
      MODULAR_STEEL_FLOOR_ROWS[3]!,
      MODULAR_STEEL_FLOOR_ROWS[5]!,
      MODULAR_STEEL_FLOOR_ROWS[4]!,
      MODULAR_STEEL_FLOOR_ROWS[6]!
    ];
    expectSteelFormulaResult(evaluateSteelScenario({ rows: safelyReorderedRows }).result);

    const duplicateCarrier = evaluateSteelScenario({
      rows: [
        ...MODULAR_STEEL_FLOOR_ROWS,
        { floorRole: "base_structure", id: "duplicate-steel", materialId: "open_web_steel_floor", thicknessMm: "200" }
      ]
    });
    expect(duplicateCarrier.result?.impact?.basis).not.toBe(STEEL_FORMULA_BASIS);
    expect(duplicateCarrier.warnings.join("\n")).toContain("unsafe to collapse");

    const splitCarrier = evaluateSteelScenario({
      rows: [
        ...MODULAR_STEEL_FLOOR_ROWS.slice(0, 3),
        { floorRole: "base_structure", id: "steel-split-a", materialId: "lightweight_steel_floor", thicknessMm: "100" },
        { floorRole: "base_structure", id: "steel-split-b", materialId: "lightweight_steel_floor", thicknessMm: "100" },
        ...MODULAR_STEEL_FLOOR_ROWS.slice(4)
      ]
    });
    expectSteelFormulaResult(splitCarrier.result);

    const toggledToNonSteel = evaluateSteelScenario({
      rows: MODULAR_STEEL_FLOOR_ROWS.map((row) =>
        row.id === "steel" ? { ...row, materialId: "concrete" } : row
      )
    });
    expect(toggledToNonSteel.result?.impact?.basis).not.toBe(STEEL_FORMULA_BASIS);
    expect(toggledToNonSteel.warnings.join("\n")).not.toContain("Steel-floor formula lane needs");
  });
});
