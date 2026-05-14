import type {
  AssemblyCalculation,
  ImpactFieldContext,
  ImpactOnlyCalculation,
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
import { buildSimpleWorkbenchCorridorDossier } from "./simple-workbench-corridor-dossier";
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
const STEEL_FIELD_BASIS = "mixed_predicted_plus_estimated_standardized_field_volume_normalization";
const STEEL_FORMULA_BASIS = "predictor_lightweight_steel_mass_spring_holdout_corridor_estimate";
const STEEL_SUSPENDED_REFERENCE_FLOOR_TYPE = "steel_suspended_ceiling_lower_reference";
const TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

const COMPLETE_FIELD_CONTEXT = {
  ci50_2500Db: -1,
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
} as const satisfies ImpactFieldContext;

const COMPLETE_STEEL_SUSPENDED_LNT50_ROWS: readonly LayerDraft[] = [
  { floorRole: "floor_covering", id: "finish", materialId: "vinyl_flooring", thicknessMm: "3" },
  { floorRole: "floating_screed", id: "topping", materialId: "cement_board", thicknessMm: "18" },
  { floorRole: "resilient_layer", id: "underlay", materialId: "generic_resilient_underlay", thicknessMm: "5" },
  { floorRole: "base_structure", id: "steel", materialId: "steel_joist_floor", thicknessMm: "250" },
  { floorRole: "ceiling_cavity", id: "cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "120" },
  { floorRole: "ceiling_fill", id: "fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_board", id: "board-a", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", id: "board-b", materialId: "firestop_board", thicknessMm: "16" }
];

const COMPLETE_STEEL_SUSPENDED_LNT50_SURFACE = {
  impactSteelCarrierDepthMm: "250",
  impactSteelCarrierSpacingMm: "600",
  impactSteelLoadBasisKgM2: "64",
  impactSteelLowerCeilingIsolationSupportForm: "elastic_furred_channels",
  impactSteelResilientLayerDynamicStiffnessMNm3: "35",
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
    impactSteelResilientLayerDynamicStiffnessMNm3:
      snapshot.impactSteelResilientLayerDynamicStiffnessMNm3,
    impactSteelSupportForm: snapshot.impactSteelSupportForm
  };
}

function fieldContextFromScenario(snapshot: Pick<
  ScenarioSnapshot,
  "impactGuideCi50_2500Db" | "impactGuideKDb" | "impactGuideReceivingRoomVolumeM3"
>): ImpactFieldContext {
  return {
    ci50_2500Db: Number.parseFloat(snapshot.impactGuideCi50_2500Db.replace(",", ".")),
    fieldKDb: Number.parseFloat(snapshot.impactGuideKDb.replace(",", ".")),
    receivingRoomVolumeM3: Number.parseFloat(snapshot.impactGuideReceivingRoomVolumeM3.replace(",", "."))
  };
}

function evaluateSteelSuspendedLowFrequencyScenario(input: {
  fieldContext?: ImpactFieldContext | null;
  id?: string;
  rows?: readonly LayerDraft[];
  source?: "current" | "saved";
  surface?: WorkbenchSteelFloorFormulaInputSurfaceDraft | null;
  targetOutputs?: readonly RequestedOutputId[];
}): EvaluatedScenario {
  return evaluateScenario({
    id: input.id ?? "company-internal-steel-suspended-lnt50-surface-parity",
    impactFieldContext: input.fieldContext ?? COMPLETE_FIELD_CONTEXT,
    name: "Company-internal steel suspended L'nT,50 surface parity",
    rows: input.rows ?? COMPLETE_STEEL_SUSPENDED_LNT50_ROWS,
    source: input.source ?? "current",
    steelFloorFormulaInputSurface: input.surface ?? COMPLETE_STEEL_SUSPENDED_LNT50_SURFACE,
    studyMode: "floor",
    targetOutputs: input.targetOutputs ?? TARGET_OUTPUTS
  });
}

function expectSteelSuspendedLowFrequencyResult(
  result: AssemblyCalculation | ImpactOnlyCalculation | null | undefined
) {
  expect(result?.impact).toMatchObject({
    CI50_2500: -1,
    DeltaLw: 22.4,
    LPrimeNT50: 50.8,
    LPrimeNTw: 51.8,
    LPrimeNW: 54.6,
    LnW: 51.6,
    basis: STEEL_FIELD_BASIS,
    labOrField: "lab",
    referenceFloorType: STEEL_SUSPENDED_REFERENCE_FLOOR_TYPE
  });
  expect(result?.impact?.metricBasis).toMatchObject({
    DeltaLw: STEEL_FORMULA_BASIS,
    LPrimeNT50: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500",
    LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
    LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
    LnW: STEEL_FORMULA_BASIS
  });
  expect(result?.impact?.errorBudgets).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ estimate: 51.6, metricId: "Ln,w", toleranceDb: 4.5 }),
      expect.objectContaining({ estimate: 22.4, metricId: "DeltaLw", toleranceDb: 2 }),
      expect.objectContaining({ estimate: 54.6, metricId: "L'n,w", toleranceDb: 5 }),
      expect.objectContaining({ estimate: 51.8, metricId: "L'nT,w", toleranceDb: 5.5 }),
      expect.objectContaining({
        estimate: 50.8,
        max: 57.8,
        metricId: "L'nT,50",
        min: 43.8,
        notMeasuredEvidence: true,
        toleranceDb: 7,
        terms: expect.arrayContaining([
          expect.objectContaining({ termId: "low_frequency_ci50_2500_owner_precision" })
        ])
      })
    ])
  );
  expect(result?.dynamicImpactTrace).toMatchObject({
    fieldContinuation: "standardized_room_volume",
    selectedLabel: "Lightweight-steel suspended-ceiling DeltaLw formula corridor",
    standardizedFieldActive: true,
    systemTypeLabel: "Combined upper and lower system"
  });
  expect(result?.impactSupport?.formulaNotes).toEqual(
    expect.arrayContaining([
      "L'nT,50 was computed as L'nT,w + CI,50-2500.",
      "Floor-impact field-volume adapter tolerance remains +/-5 dB for L'n,w, +/-5.5 dB for L'nT,w, and +/-7 dB for L'nT,50 when a low-frequency owner is active."
    ])
  );
  expect(result?.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"]);
  expect(result?.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
}

function expectSteelSuspendedLowFrequencyCards(scenario: EvaluatedScenario) {
  const fieldCard = addOutputCardPosture(
    buildOutputCard({ output: "L'n,w", result: scenario.result, studyMode: "floor" }),
    { result: scenario.result, studyMode: "floor" }
  );
  const standardizedCard = addOutputCardPosture(
    buildOutputCard({ output: "L'nT,w", result: scenario.result, studyMode: "floor" }),
    { result: scenario.result, studyMode: "floor" }
  );
  const lowFrequencyCard = addOutputCardPosture(
    buildOutputCard({ output: "L'nT,50", result: scenario.result, studyMode: "floor" }),
    { result: scenario.result, studyMode: "floor" }
  );

  expect(fieldCard).toMatchObject({
    postureLabel: "Field continuation",
    status: "live",
    value: "54.6 dB"
  });
  expect(fieldCard.detail).toContain("explicit field K");
  expect(fieldCard.detail).toContain("+/-5.0 dB corridor tolerance");
  expect(standardizedCard).toMatchObject({
    postureLabel: "Field continuation",
    status: "live",
    value: "51.8 dB"
  });
  expect(standardizedCard.detail).toContain("receiving-room volume normalization");
  expect(standardizedCard.detail).toContain("+/-5.5 dB corridor tolerance");
  expect(lowFrequencyCard).toMatchObject({
    postureLabel: "Field continuation",
    status: "live",
    value: "50.8 dB"
  });
  expect(lowFrequencyCard.detail).toContain("L'nT,w + CI,50-2500");
  expect(lowFrequencyCard.detail).toContain("+/-7.0 dB corridor tolerance");
  expect(lowFrequencyCard.detail).toContain("not measured evidence");
}

function buildReport(scenario: EvaluatedScenario) {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("heavy_concrete_impact_floor"),
    briefNote: "",
    clientName: "Company Internal",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Company Internal Steel Suspended L'nT,50",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "50",
    targetRwDb: "60"
  });
}

async function saveCompleteScenario(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();
  store.reset();
  store.startStudyMode("floor");
  store.clearRows();
  store.appendRows(withoutIds(COMPLETE_STEEL_SUSPENDED_LNT50_ROWS));
  store.setRequestedOutputs([...TARGET_OUTPUTS]);
  store.setImpactSteelCarrierDepthMm(COMPLETE_STEEL_SUSPENDED_LNT50_SURFACE.impactSteelCarrierDepthMm);
  store.setImpactSteelCarrierSpacingMm(COMPLETE_STEEL_SUSPENDED_LNT50_SURFACE.impactSteelCarrierSpacingMm);
  store.setImpactSteelLoadBasisKgM2(COMPLETE_STEEL_SUSPENDED_LNT50_SURFACE.impactSteelLoadBasisKgM2);
  store.setImpactSteelLowerCeilingIsolationSupportForm(
    COMPLETE_STEEL_SUSPENDED_LNT50_SURFACE.impactSteelLowerCeilingIsolationSupportForm
  );
  store.setImpactSteelResilientLayerDynamicStiffnessMNm3(
    COMPLETE_STEEL_SUSPENDED_LNT50_SURFACE.impactSteelResilientLayerDynamicStiffnessMNm3
  );
  store.setImpactSteelSupportForm(COMPLETE_STEEL_SUSPENDED_LNT50_SURFACE.impactSteelSupportForm);
  store.setImpactGuideSource("live_stack");
  store.setImpactGuideKDb(String(COMPLETE_FIELD_CONTEXT.fieldKDb));
  store.setImpactGuideReceivingRoomVolumeM3(String(COMPLETE_FIELD_CONTEXT.receivingRoomVolumeM3));
  store.setImpactGuideCi50_2500Db(String(COMPLETE_FIELD_CONTEXT.ci50_2500Db));
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Expected the workbench store to save the complete steel suspended L'nT,50 snapshot.");
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

describe("company-internal steel suspended-ceiling L'nT,50 surface parity", () => {
  it("shows the same low-frequency field runtime on cards, dossier, and Markdown report", () => {
    const scenario = evaluateSteelSuspendedLowFrequencyScenario({ id: "steel-suspended-lnt50-live" });
    expectSteelSuspendedLowFrequencyResult(scenario.result);
    expectSteelSuspendedLowFrequencyCards(scenario);

    const dossier = buildSimpleWorkbenchCorridorDossier(scenario.result, "floor");
    expect(dossier.headline).toContain("Source-absent steel formula budgets");
    expect(dossier.cards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Ln,w error budget", value: "+/-4.5 dB" }),
        expect.objectContaining({ label: "DeltaLw error budget", value: "+/-2.0 dB" }),
        expect.objectContaining({ label: "L'n,w error budget", value: "+/-5.0 dB" }),
        expect.objectContaining({ label: "L'nT,w error budget", value: "+/-5.5 dB" }),
        expect.objectContaining({ label: "L'nT,50 error budget", value: "+/-7.0 dB" })
      ])
    );

    const report = buildReport(scenario);
    expect(report).toContain("- Impact lane: Lightweight-steel suspended-ceiling DeltaLw formula corridor");
    expect(report).toContain("- Impact field continuation: Standardized room-volume carry-over");
    expect(report).toContain("- Impact Ln,w: 51.6 dB");
    expect(report).toContain("- Impact L'n,w: 54.6 dB");
    expect(report).toContain("- Impact L'nT,w: 51.8 dB");
    expect(report).toContain("- Impact CI,50-2500: -1.0 dB");
    expect(report).toContain("- Impact L'nT,50: 50.8 dB");
    expect(report).toContain("- DeltaLw: 22.4 dB");
    expect(report).toContain(
      "- Impact L'nT,50 provenance: Standardized field + CI,50-2500. L'nT,50 was derived as L'nT,w + CI,50-2500."
    );
    expect(report).toContain(
      "- Impact error budget L'nT,50: 50.8 dB, range 43.8-57.8 dB, tolerance +/-7.0 dB, origin source_absent_field_building_adapter_error_budget, not measured evidence yes."
    );
    expect(report).toContain("- Impact error budget L'nT,50 terms:");
    expect(report).toContain("low_frequency_ci50_2500_owner_precision");
    expect(report).toContain("- Formula note: L'nT,50 was computed as L'nT,w + CI,50-2500.");
  });

  it("keeps local saved replay and server snapshot replay on the same low-frequency field basis", async () => {
    const savedSnapshot = await saveCompleteScenario();
    expect(savedSnapshot).toMatchObject({
      ...COMPLETE_STEEL_SUSPENDED_LNT50_SURFACE,
      impactGuideCi50_2500Db: "-1",
      impactGuideKDb: "3",
      impactGuideReceivingRoomVolumeM3: "60",
      impactGuideSource: "live_stack"
    });

    const savedScenario = evaluateSteelSuspendedLowFrequencyScenario({
      fieldContext: fieldContextFromScenario(savedSnapshot),
      id: "steel-suspended-lnt50-saved",
      rows: savedSnapshot.rows,
      source: "saved",
      surface: surfaceFromScenario(savedSnapshot),
      targetOutputs: savedSnapshot.requestedOutputs
    });
    expectSteelSuspendedLowFrequencyResult(savedScenario.result);
    expectSteelSuspendedLowFrequencyCards(savedScenario);

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();
    expect(parsedServerSnapshot).toMatchObject({
      impactGuideCi50_2500Db: "-1",
      impactGuideKDb: "3",
      impactGuideReceivingRoomVolumeM3: "60"
    });

    const serverScenario = evaluateSteelSuspendedLowFrequencyScenario({
      fieldContext: parsedServerSnapshot ? fieldContextFromScenario(parsedServerSnapshot) : null,
      id: "steel-suspended-lnt50-server",
      rows: parsedServerSnapshot?.rows,
      source: "saved",
      surface: parsedServerSnapshot ? surfaceFromScenario(parsedServerSnapshot) : null,
      targetOutputs: parsedServerSnapshot?.requestedOutputs
    });
    expectSteelSuspendedLowFrequencyResult(serverScenario.result);
    expectSteelSuspendedLowFrequencyCards(serverScenario);
  });

  it("keeps calculator and impact-only API payloads on the same field basis without ASTM aliases", async () => {
    const layers = toLayerInputs(COMPLETE_STEEL_SUSPENDED_LNT50_ROWS);
    const surface = buildWorkbenchSteelFloorFormulaInputSurface({
      layers,
      surface: COMPLETE_STEEL_SUSPENDED_LNT50_SURFACE,
      targetOutputs: TARGET_OUTPUTS
    });
    expect(surface.status).toBe("ready_for_formula_corridor");

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const { POST: impactOnly } = await import("../../app/api/impact-only/route");
    const payload = {
      impactFieldContext: COMPLETE_FIELD_CONTEXT,
      impactPredictorInput: surface.impactPredictorInput,
      layers,
      targetOutputs: TARGET_OUTPUTS
    };

    const estimateResponse = await estimate(jsonRequest("http://localhost/api/estimate", payload));
    const estimateBody = (await estimateResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };
    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.ok).toBe(true);
    expectSteelSuspendedLowFrequencyResult(estimateBody.result);
    expect(estimateBody.result?.impact?.IIC).toBeUndefined();
    expect(estimateBody.result?.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);

    const impactResponse = await impactOnly(jsonRequest("http://localhost/api/impact-only", payload));
    const impactBody = (await impactResponse.json()) as {
      ok?: boolean;
      result?: ImpactOnlyCalculation;
    };
    expect(impactResponse.status).toBe(200);
    expect(impactBody.ok).toBe(true);
    expectSteelSuspendedLowFrequencyResult(impactBody.result);
    expect(impactBody.result?.impact?.IIC).toBeUndefined();
    expect(impactBody.result?.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
  });
});
