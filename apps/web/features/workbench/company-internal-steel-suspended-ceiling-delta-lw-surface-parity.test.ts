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
const STEEL_FORMULA_BASIS = "predictor_lightweight_steel_mass_spring_holdout_corridor_estimate";
const STEEL_SUSPENDED_REFERENCE_FLOOR_TYPE = "steel_suspended_ceiling_lower_reference";
const TARGET_OUTPUTS = ["Ln,w", "DeltaLw", "IIC", "L'nT,50"] as const satisfies readonly RequestedOutputId[];

const COMPLETE_STEEL_SUSPENDED_DELTA_LW_ROWS: readonly LayerDraft[] = [
  { floorRole: "floor_covering", id: "finish", materialId: "vinyl_flooring", thicknessMm: "3" },
  { floorRole: "floating_screed", id: "topping", materialId: "cement_board", thicknessMm: "18" },
  { floorRole: "resilient_layer", id: "underlay", materialId: "generic_resilient_underlay", thicknessMm: "5" },
  { floorRole: "base_structure", id: "steel", materialId: "steel_joist_floor", thicknessMm: "250" },
  { floorRole: "ceiling_cavity", id: "cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "120" },
  { floorRole: "ceiling_fill", id: "fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_board", id: "board-a", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", id: "board-b", materialId: "firestop_board", thicknessMm: "16" }
];

const COMPLETE_STEEL_SUSPENDED_DELTA_LW_SURFACE = {
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

function evaluateSteelSuspendedDeltaLwScenario(input: {
  id?: string;
  rows?: readonly LayerDraft[];
  source?: "current" | "saved";
  surface?: WorkbenchSteelFloorFormulaInputSurfaceDraft | null;
  targetOutputs?: readonly RequestedOutputId[];
}): EvaluatedScenario {
  return evaluateScenario({
    id: input.id ?? "company-internal-steel-suspended-delta-lw-surface-parity",
    name: "Company-internal steel suspended DeltaLw surface parity",
    rows: input.rows ?? COMPLETE_STEEL_SUSPENDED_DELTA_LW_ROWS,
    source: input.source ?? "current",
    steelFloorFormulaInputSurface: input.surface ?? COMPLETE_STEEL_SUSPENDED_DELTA_LW_SURFACE,
    studyMode: "floor",
    targetOutputs: input.targetOutputs ?? TARGET_OUTPUTS
  });
}

function expectSteelSuspendedDeltaLwResult(result: AssemblyCalculation | null | undefined) {
  expect(result?.impact).toMatchObject({
    DeltaLw: 22.4,
    LnW: 51.6,
    basis: STEEL_FORMULA_BASIS,
    labOrField: "lab",
    referenceFloorType: STEEL_SUSPENDED_REFERENCE_FLOOR_TYPE
  });
  expect(result?.dynamicImpactTrace).toMatchObject({
    selectedLabel: "Lightweight-steel suspended-ceiling DeltaLw formula corridor",
    systemTypeLabel: "Combined upper and lower system"
  });
  expect(result?.impactSupport?.formulaNotes).toEqual(
    expect.arrayContaining([
      "Steel suspended-ceiling DeltaLw runtime uses the Gate BK lower suspended-ceiling reference before applying the upper-package reduction.",
      "Corridor tolerance remains +/-4.5 dB for Ln,w and +/-2 dB for DeltaLw."
    ])
  );
  expect(result?.unsupportedTargetOutputs).toEqual(expect.arrayContaining(["IIC", "L'nT,50"]));
}

function expectSteelSuspendedDeltaLwCards(scenario: EvaluatedScenario) {
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
    value: "51.6 dB"
  });
  expect(lnwCard.detail).toContain("Gate BK lower suspended-ceiling reference");
  expect(deltaCard).toMatchObject({
    postureLabel: "Steel formula corridor",
    status: "live",
    value: "22.4 dB"
  });
  expect(deltaCard.detail).toContain("Gate BK lower suspended-ceiling reference");
  expect(deltaCard.detail).toContain("+/-2.0 dB corridor tolerance");
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
    projectName: "Company Internal Steel Suspended DeltaLw",
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
  store.appendRows(withoutIds(COMPLETE_STEEL_SUSPENDED_DELTA_LW_ROWS));
  store.setRequestedOutputs([...TARGET_OUTPUTS]);
  store.setImpactSteelCarrierDepthMm(COMPLETE_STEEL_SUSPENDED_DELTA_LW_SURFACE.impactSteelCarrierDepthMm);
  store.setImpactSteelCarrierSpacingMm(COMPLETE_STEEL_SUSPENDED_DELTA_LW_SURFACE.impactSteelCarrierSpacingMm);
  store.setImpactSteelLoadBasisKgM2(COMPLETE_STEEL_SUSPENDED_DELTA_LW_SURFACE.impactSteelLoadBasisKgM2);
  store.setImpactSteelLowerCeilingIsolationSupportForm(
    COMPLETE_STEEL_SUSPENDED_DELTA_LW_SURFACE.impactSteelLowerCeilingIsolationSupportForm
  );
  store.setImpactSteelResilientLayerDynamicStiffnessMNm3(
    COMPLETE_STEEL_SUSPENDED_DELTA_LW_SURFACE.impactSteelResilientLayerDynamicStiffnessMNm3
  );
  store.setImpactSteelSupportForm(COMPLETE_STEEL_SUSPENDED_DELTA_LW_SURFACE.impactSteelSupportForm);
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Expected the workbench store to save the complete steel suspended DeltaLw snapshot.");
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

describe("company-internal steel suspended-ceiling DeltaLw surface parity", () => {
  it("shows the same runtime values on cards, dossier, and Markdown report", () => {
    const scenario = evaluateSteelSuspendedDeltaLwScenario({ id: "steel-suspended-delta-lw-live" });
    expectSteelSuspendedDeltaLwResult(scenario.result);
    expectSteelSuspendedDeltaLwCards(scenario);

    const dossier = buildSimpleWorkbenchCorridorDossier(scenario.result, "floor");
    expect(dossier.headline).toContain("Source-absent steel formula budgets");
    expect(dossier.cards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Ln,w error budget",
          value: "+/-4.5 dB"
        }),
        expect.objectContaining({
          label: "DeltaLw error budget",
          value: "+/-2.0 dB"
        })
      ])
    );

    const report = buildReport(scenario);
    expect(report).toContain("- Impact lane: Lightweight-steel suspended-ceiling DeltaLw formula corridor");
    expect(report).toContain("- Impact system type: Combined upper and lower system");
    expect(report).toContain("- Impact Ln,w: 51.6 dB");
    expect(report).toContain("- DeltaLw: 22.4 dB");
    expect(report).toContain(`- Support reference floor: ${STEEL_SUSPENDED_REFERENCE_FLOOR_TYPE}`);
    expect(report).toContain(
      "- Formula note: Steel suspended-ceiling DeltaLw runtime uses the Gate BK lower suspended-ceiling reference before applying the upper-package reduction."
    );
  });

  it("keeps local saved replay and server snapshot replay on the same basis", async () => {
    const savedSnapshot = await saveCompleteScenario();
    expect(savedSnapshot).toMatchObject(COMPLETE_STEEL_SUSPENDED_DELTA_LW_SURFACE);

    const savedScenario = evaluateSteelSuspendedDeltaLwScenario({
      id: "steel-suspended-delta-lw-saved",
      rows: savedSnapshot.rows,
      source: "saved",
      surface: surfaceFromScenario(savedSnapshot),
      targetOutputs: savedSnapshot.requestedOutputs
    });
    expectSteelSuspendedDeltaLwResult(savedScenario.result);
    expectSteelSuspendedDeltaLwCards(savedScenario);

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();

    const serverScenario = evaluateSteelSuspendedDeltaLwScenario({
      id: "steel-suspended-delta-lw-server",
      rows: parsedServerSnapshot?.rows,
      source: "saved",
      surface: parsedServerSnapshot ? surfaceFromScenario(parsedServerSnapshot) : null,
      targetOutputs: parsedServerSnapshot?.requestedOutputs
    });
    expectSteelSuspendedDeltaLwResult(serverScenario.result);
    expectSteelSuspendedDeltaLwCards(serverScenario);
  });

  it("keeps calculator and impact-only API payloads on the same lab basis without ASTM or field aliases", async () => {
    const layers = toLayerInputs(COMPLETE_STEEL_SUSPENDED_DELTA_LW_ROWS);
    const surface = buildWorkbenchSteelFloorFormulaInputSurface({
      layers,
      surface: COMPLETE_STEEL_SUSPENDED_DELTA_LW_SURFACE,
      targetOutputs: TARGET_OUTPUTS
    });
    expect(surface.status).toBe("ready_for_formula_corridor");

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const { POST: impactOnly } = await import("../../app/api/impact-only/route");
    const payload = {
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
    expectSteelSuspendedDeltaLwResult(estimateBody.result);
    expect(estimateBody.result?.impact?.IIC).toBeUndefined();
    expect(estimateBody.result?.impact?.LPrimeNT50).toBeUndefined();

    const impactResponse = await impactOnly(jsonRequest("http://localhost/api/impact-only", payload));
    const impactBody = (await impactResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };
    expect(impactResponse.status).toBe(200);
    expect(impactBody.ok).toBe(true);
    expectSteelSuspendedDeltaLwResult(impactBody.result);
    expect(impactBody.result?.impact?.IIC).toBeUndefined();
    expect(impactBody.result?.impact?.LPrimeNT50).toBeUndefined();
  });
});
