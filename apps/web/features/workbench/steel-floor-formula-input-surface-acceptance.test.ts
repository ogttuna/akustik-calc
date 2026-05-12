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
const TARGET_OUTPUTS = ["Rw", "Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
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

function buildSteelFormulaReport(scenario: EvaluatedScenario) {
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
    requestedOutputs: TARGET_OUTPUTS,
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
