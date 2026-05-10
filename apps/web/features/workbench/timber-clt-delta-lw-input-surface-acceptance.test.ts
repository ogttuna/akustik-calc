import {
  GATE_B_CLT_LAYERS,
  GATE_B_TIMBER_JOIST_LAYERS
} from "@dynecho/engine";
import type {
  AssemblyCalculation,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { getPresetById } from "./preset-definitions";
import { evaluateScenario, type EvaluatedScenario } from "./scenario-analysis";
import {
  buildServerProjectWorkbenchSnapshot,
  parseServerProjectWorkbenchSnapshot
} from "./server-project-workbench-snapshot";
import {
  addOutputCardPosture,
  buildOutputCard
} from "./simple-workbench-output-model";
import {
  MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS,
  TIMBER_JOIST_DELTA_LW_FORMULA_BASIS
} from "./timber-clt-delta-lw-corridor-view";
import {
  buildWorkbenchTimberCltDeltaLwInputSurface,
  type WorkbenchTimberCltDeltaLwInputSurfaceDraft
} from "./timber-clt-delta-lw-input-surface";
import type { LayerDraft, ScenarioSnapshot } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const TARGET_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FIELD_TARGET_OUTPUTS = ["L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

const COMPLETE_TIMBER_SURFACE = {
  impactTimberCltBaseFloorDensityKgM3: "",
  impactTimberCltBaseFloorThicknessMm: "",
  impactTimberCltImpactSystemType: "combined_upper_lower_system",
  impactTimberCltLoadBasisKgM2: "72",
  impactTimberCltLowerAssemblyType: "suspended_ceiling_elastic_hanger",
  impactTimberCltLowerBoardLayerCount: "2",
  impactTimberCltLowerBoardThicknessMm: "12.5",
  impactTimberCltLowerCavityDepthMm: "27",
  impactTimberCltLowerCavityFillThicknessMm: "100",
  impactTimberCltLowerSupportClass: "furred_channels",
  impactTimberCltResilientLayerDynamicStiffnessMNm3: "30",
  impactTimberCltResilientLayerThicknessMm: "30",
  impactTimberCltStructuralSupportType: "timber_joists",
  impactTimberCltUpperFillDensityKgM3: "",
  impactTimberCltUpperFillThicknessMm: "",
  impactTimberCltUpperTreatmentDensityKgM3: "1150",
  impactTimberCltUpperTreatmentThicknessMm: "25"
} as const satisfies WorkbenchTimberCltDeltaLwInputSurfaceDraft;

const COMPLETE_CLT_SURFACE = {
  impactTimberCltBaseFloorDensityKgM3: "470",
  impactTimberCltBaseFloorThicknessMm: "",
  impactTimberCltImpactSystemType: "dry_floating_floor",
  impactTimberCltLoadBasisKgM2: "90",
  impactTimberCltLowerAssemblyType: "none",
  impactTimberCltLowerBoardLayerCount: "",
  impactTimberCltLowerBoardThicknessMm: "",
  impactTimberCltLowerCavityDepthMm: "",
  impactTimberCltLowerCavityFillThicknessMm: "",
  impactTimberCltLowerSupportClass: "",
  impactTimberCltResilientLayerDynamicStiffnessMNm3: "40",
  impactTimberCltResilientLayerThicknessMm: "20",
  impactTimberCltStructuralSupportType: "mass_timber_clt",
  impactTimberCltUpperFillDensityKgM3: "500",
  impactTimberCltUpperFillThicknessMm: "70",
  impactTimberCltUpperTreatmentDensityKgM3: "1150",
  impactTimberCltUpperTreatmentThicknessMm: "22"
} as const satisfies WorkbenchTimberCltDeltaLwInputSurfaceDraft;

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

function toRows(layers: readonly LayerInput[], prefix: string): LayerDraft[] {
  return layers.map((layer, index) => ({
    floorRole: layer.floorRole,
    id: `${prefix}-${index + 1}`,
    materialId: layer.materialId,
    thicknessMm: String(layer.thicknessMm)
  }));
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
  return rows.map((row) => ({
    floorRole: row.floorRole,
    materialId: row.materialId,
    thicknessMm: row.thicknessMm
  }));
}

function timberSurfaceFromScenario(snapshot: Pick<ScenarioSnapshot, keyof WorkbenchTimberCltDeltaLwInputSurfaceDraft>): WorkbenchTimberCltDeltaLwInputSurfaceDraft {
  return {
    impactTimberCltBaseFloorDensityKgM3: snapshot.impactTimberCltBaseFloorDensityKgM3,
    impactTimberCltBaseFloorThicknessMm: snapshot.impactTimberCltBaseFloorThicknessMm,
    impactTimberCltImpactSystemType: snapshot.impactTimberCltImpactSystemType,
    impactTimberCltLoadBasisKgM2: snapshot.impactTimberCltLoadBasisKgM2,
    impactTimberCltLowerAssemblyType: snapshot.impactTimberCltLowerAssemblyType,
    impactTimberCltLowerBoardLayerCount: snapshot.impactTimberCltLowerBoardLayerCount,
    impactTimberCltLowerBoardThicknessMm: snapshot.impactTimberCltLowerBoardThicknessMm,
    impactTimberCltLowerCavityDepthMm: snapshot.impactTimberCltLowerCavityDepthMm,
    impactTimberCltLowerCavityFillThicknessMm: snapshot.impactTimberCltLowerCavityFillThicknessMm,
    impactTimberCltLowerSupportClass: snapshot.impactTimberCltLowerSupportClass,
    impactTimberCltResilientLayerDynamicStiffnessMNm3: snapshot.impactTimberCltResilientLayerDynamicStiffnessMNm3,
    impactTimberCltResilientLayerThicknessMm: snapshot.impactTimberCltResilientLayerThicknessMm,
    impactTimberCltStructuralSupportType: snapshot.impactTimberCltStructuralSupportType,
    impactTimberCltUpperFillDensityKgM3: snapshot.impactTimberCltUpperFillDensityKgM3,
    impactTimberCltUpperFillThicknessMm: snapshot.impactTimberCltUpperFillThicknessMm,
    impactTimberCltUpperTreatmentDensityKgM3: snapshot.impactTimberCltUpperTreatmentDensityKgM3,
    impactTimberCltUpperTreatmentThicknessMm: snapshot.impactTimberCltUpperTreatmentThicknessMm
  };
}

function evaluateTimberCltScenario(input: {
  id?: string;
  rows?: readonly LayerDraft[];
  source?: "current" | "saved";
  surface?: WorkbenchTimberCltDeltaLwInputSurfaceDraft | null;
  targetOutputs?: readonly RequestedOutputId[];
} = {}): EvaluatedScenario {
  return evaluateScenario({
    id: input.id ?? "gate-f-web-timber-clt-input-surface",
    name: "Gate F web timber CLT input surface",
    rows: input.rows ?? toRows(GATE_B_TIMBER_JOIST_LAYERS, "timber"),
    source: input.source ?? "current",
    studyMode: "floor",
    targetOutputs: input.targetOutputs ?? TARGET_OUTPUTS,
    timberCltDeltaLwInputSurface: input.surface ?? COMPLETE_TIMBER_SURFACE
  });
}

function expectTimberResult(result: AssemblyCalculation | null | undefined) {
  expect(result?.impact).toMatchObject({
    basis: "official_floor_system_exact_match",
    DeltaLw: 25.2,
    LnW: 51,
    labOrField: "lab",
    metricBasis: {
      DeltaLw: TIMBER_JOIST_DELTA_LW_FORMULA_BASIS
    }
  });
}

function expectCltResult(result: AssemblyCalculation | null | undefined) {
  expect(result?.impact).toMatchObject({
    basis: "predictor_mass_timber_clt_dataholz_dry_estimate",
    DeltaLw: 22.6,
    LnW: 50,
    labOrField: "lab",
    metricBasis: {
      DeltaLw: MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS
    }
  });
}

function expectTimberScenario(scenario: EvaluatedScenario) {
  expectTimberResult(scenario.result);

  const lnwCard = addOutputCardPosture(
    buildOutputCard({ output: "Ln,w", result: scenario.result, studyMode: "floor" }),
    { result: scenario.result, studyMode: "floor" }
  );
  const deltaCard = addOutputCardPosture(
    buildOutputCard({ output: "DeltaLw", result: scenario.result, studyMode: "floor" }),
    { result: scenario.result, studyMode: "floor" }
  );

  expect(lnwCard).toMatchObject({
    postureLabel: "Exact source row",
    status: "live",
    value: "51 dB"
  });
  expect(deltaCard).toMatchObject({
    postureLabel: "Timber/CLT DeltaLw formula",
    status: "live",
    value: "25.2 dB"
  });
  expect(deltaCard.detail).toContain("+/-7.5 dB corridor tolerance");
}

function buildTimberCltReport(scenario: EvaluatedScenario) {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("heavy_concrete_impact_floor"),
    briefNote: "",
    clientName: "Gate F Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate F Timber CLT Input Surface",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "50",
    targetRwDb: "60"
  });
}

async function saveCompleteTimberStoreSnapshot(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();
  store.reset();
  store.startStudyMode("floor");
  store.clearRows();
  store.appendRows(withoutIds(toRows(GATE_B_TIMBER_JOIST_LAYERS, "timber")));
  store.setRequestedOutputs([...TARGET_OUTPUTS]);
  store.setImpactTimberCltStructuralSupportType(COMPLETE_TIMBER_SURFACE.impactTimberCltStructuralSupportType);
  store.setImpactTimberCltImpactSystemType(COMPLETE_TIMBER_SURFACE.impactTimberCltImpactSystemType);
  store.setImpactTimberCltLoadBasisKgM2(COMPLETE_TIMBER_SURFACE.impactTimberCltLoadBasisKgM2);
  store.setImpactTimberCltLowerAssemblyType(COMPLETE_TIMBER_SURFACE.impactTimberCltLowerAssemblyType);
  store.setImpactTimberCltLowerBoardLayerCount(COMPLETE_TIMBER_SURFACE.impactTimberCltLowerBoardLayerCount);
  store.setImpactTimberCltLowerBoardThicknessMm(COMPLETE_TIMBER_SURFACE.impactTimberCltLowerBoardThicknessMm);
  store.setImpactTimberCltLowerCavityDepthMm(COMPLETE_TIMBER_SURFACE.impactTimberCltLowerCavityDepthMm);
  store.setImpactTimberCltLowerCavityFillThicknessMm(COMPLETE_TIMBER_SURFACE.impactTimberCltLowerCavityFillThicknessMm);
  store.setImpactTimberCltLowerSupportClass(COMPLETE_TIMBER_SURFACE.impactTimberCltLowerSupportClass);
  store.setImpactTimberCltResilientLayerDynamicStiffnessMNm3(COMPLETE_TIMBER_SURFACE.impactTimberCltResilientLayerDynamicStiffnessMNm3);
  store.setImpactTimberCltResilientLayerThicknessMm(COMPLETE_TIMBER_SURFACE.impactTimberCltResilientLayerThicknessMm);
  store.setImpactTimberCltUpperTreatmentDensityKgM3(COMPLETE_TIMBER_SURFACE.impactTimberCltUpperTreatmentDensityKgM3);
  store.setImpactTimberCltUpperTreatmentThicknessMm(COMPLETE_TIMBER_SURFACE.impactTimberCltUpperTreatmentThicknessMm);
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Gate F expected the workbench store to save a timber/CLT formula snapshot.");
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

describe("timber/CLT DeltaLw input surface acceptance", () => {
  it("keeps complete timber input-surface parity across live, local saved, server snapshot, cards, and report", async () => {
    const liveScenario = evaluateTimberCltScenario({ id: "gate-f-live" });
    expectTimberScenario(liveScenario);

    const report = buildTimberCltReport(liveScenario);
    expect(report).toContain("- Impact DeltaLw provenance: Timber joist DeltaLw formula corridor");
    expect(report).toContain("- Formula note: Timber/CLT DeltaLw corridor is source-absent lab evidence, not a measured row.");

    const savedSnapshot = await saveCompleteTimberStoreSnapshot();
    expect(savedSnapshot).toMatchObject(COMPLETE_TIMBER_SURFACE);

    const savedScenario = evaluateTimberCltScenario({
      id: "gate-f-saved",
      rows: savedSnapshot.rows,
      source: "saved",
      surface: timberSurfaceFromScenario(savedSnapshot),
      targetOutputs: savedSnapshot.requestedOutputs
    });
    expectTimberScenario(savedScenario);

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();

    const serverScenario = evaluateTimberCltScenario({
      id: "gate-f-server",
      rows: parsedServerSnapshot?.rows,
      source: "saved",
      surface: parsedServerSnapshot ? timberSurfaceFromScenario(parsedServerSnapshot) : null,
      targetOutputs: parsedServerSnapshot?.requestedOutputs
    });
    expectTimberScenario(serverScenario);
  });

  it("feeds complete CLT input through the same first-class surface", () => {
    const scenario = evaluateTimberCltScenario({
      rows: toRows(GATE_B_CLT_LAYERS, "clt"),
      surface: COMPLETE_CLT_SURFACE
    });

    expectCltResult(scenario.result);
  });

  it("keeps calculator API payloads on the same basis without promoting field outputs", async () => {
    const layers = toLayerInputs(toRows(GATE_B_TIMBER_JOIST_LAYERS, "timber"));
    const surface = buildWorkbenchTimberCltDeltaLwInputSurface({
      layers,
      surface: COMPLETE_TIMBER_SURFACE,
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
    expectTimberResult(estimateBody.result);

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
    expect(impactBody.result?.impact?.DeltaLw).toBeUndefined();
    expect(impactBody.result?.unsupportedTargetOutputs).toEqual(expect.arrayContaining([...FIELD_TARGET_OUTPUTS]));
  });

  it("gives precise missing-input guidance and keeps hostile edits bounded", () => {
    const commaDecimal = evaluateTimberCltScenario({
      surface: {
        ...COMPLETE_TIMBER_SURFACE,
        impactTimberCltLoadBasisKgM2: "72,0",
        impactTimberCltUpperTreatmentDensityKgM3: "1.150"
      }
    });
    expectTimberResult(commaDecimal.result);

    const invalidFields = evaluateTimberCltScenario({
      surface: {
        ...COMPLETE_TIMBER_SURFACE,
        impactTimberCltLoadBasisKgM2: "-72",
        impactTimberCltResilientLayerDynamicStiffnessMNm3: "0",
        impactTimberCltUpperTreatmentDensityKgM3: ""
      }
    });
    expect(invalidFields.result?.impact?.DeltaLw).toBeUndefined();
    expect(invalidFields.warnings.join("\n")).toContain("Load basis (kg/m2)");
    expect(invalidFields.warnings.join("\n")).toContain("Dynamic stiffness (MN/m3)");
    expect(invalidFields.warnings.join("\n")).toContain("Upper floating/topping mass");

    const safelyReordered = evaluateTimberCltScenario({
      rows: [
        ...toRows(GATE_B_TIMBER_JOIST_LAYERS, "timber").slice(1, 3),
        toRows(GATE_B_TIMBER_JOIST_LAYERS, "timber")[0]!,
        ...toRows(GATE_B_TIMBER_JOIST_LAYERS, "timber").slice(3)
      ]
    });
    expectTimberResult(safelyReordered.result);

    const duplicateCarrier = evaluateTimberCltScenario({
      rows: [
        ...toRows(GATE_B_TIMBER_JOIST_LAYERS, "timber"),
        { floorRole: "base_structure", id: "duplicate-timber", materialId: "timber_joist_floor", thicknessMm: "240" }
      ]
    });
    expect(duplicateCarrier.result?.impact?.DeltaLw).toBeUndefined();
    expect(duplicateCarrier.warnings.join("\n")).toContain("unsafe to collapse");
  });
});
