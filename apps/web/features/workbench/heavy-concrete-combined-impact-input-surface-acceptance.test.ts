import {
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS
} from "@dynecho/engine";
import type {
  AssemblyCalculation,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import {
  buildWorkbenchHeavyConcreteCombinedImpactInputSurface,
  type WorkbenchHeavyConcreteCombinedImpactInputSurfaceDraft
} from "./heavy-concrete-combined-impact-input-surface";
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
import type { LayerDraft, ScenarioSnapshot } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const TARGET_OUTPUTS = ["Rw", "Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const PRESET_IMPACT_TARGET_OUTPUTS = ["Rw", "Ln,w", "DeltaLw", "Ln,w+CI"] as const satisfies readonly RequestedOutputId[];
const FIELD_TARGET_OUTPUTS = ["L'n,w", "L'nT,w", "IIC"] as const satisfies readonly RequestedOutputId[];
const HEAVY_CONCRETE_PUBLISHED_UPPER_TREATMENT_BASIS =
  "predictor_heavy_concrete_published_upper_treatment_estimate";

const HEAVY_CONCRETE_ROWS: readonly LayerDraft[] = [
  { floorRole: "floor_covering", id: "finish", materialId: "ceramic_tile", thicknessMm: "8" },
  { floorRole: "floating_screed", id: "screed", materialId: "screed", thicknessMm: "30" },
  { floorRole: "resilient_layer", id: "underlay", materialId: "generic_resilient_underlay_s30", thicknessMm: "8" },
  { floorRole: "base_structure", id: "slab", materialId: "concrete", thicknessMm: "150" }
];

const COMPLETE_HEAVY_CONCRETE_SURFACE = {
  impactHeavyConcreteBaseSlabDensityKgM3: "2400",
  impactHeavyConcreteBaseSlabThicknessMm: "150",
  impactHeavyConcreteLoadBasisKgM2: "100",
  impactHeavyConcreteLowerAssemblyType: "suspended_ceiling_elastic_hanger",
  impactHeavyConcreteLowerBoardLayerCount: "2",
  impactHeavyConcreteLowerBoardThicknessMm: "12.5",
  impactHeavyConcreteLowerCavityDepthMm: "120",
  impactHeavyConcreteLowerCavityFillThicknessMm: "80",
  impactHeavyConcreteLowerSupportClass: "furred_channels",
  impactHeavyConcreteResilientLayerDynamicStiffnessMNm3: "30",
  impactHeavyConcreteResilientLayerThicknessMm: "8"
} as const satisfies WorkbenchHeavyConcreteCombinedImpactInputSurfaceDraft;

const EMPTY_HEAVY_CONCRETE_SURFACE = {
  impactHeavyConcreteBaseSlabDensityKgM3: "",
  impactHeavyConcreteBaseSlabThicknessMm: "",
  impactHeavyConcreteLoadBasisKgM2: "",
  impactHeavyConcreteLowerAssemblyType: "",
  impactHeavyConcreteLowerBoardLayerCount: "",
  impactHeavyConcreteLowerBoardThicknessMm: "",
  impactHeavyConcreteLowerCavityDepthMm: "",
  impactHeavyConcreteLowerCavityFillThicknessMm: "",
  impactHeavyConcreteLowerSupportClass: "",
  impactHeavyConcreteResilientLayerDynamicStiffnessMNm3: "",
  impactHeavyConcreteResilientLayerThicknessMm: ""
} as const satisfies WorkbenchHeavyConcreteCombinedImpactInputSurfaceDraft;

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
  return rows.map((row) => ({
    floorRole: row.floorRole,
    materialId: row.materialId,
    thicknessMm: row.thicknessMm
  }));
}

function surfaceFromScenario(snapshot: Pick<
  ScenarioSnapshot,
  | "impactHeavyConcreteBaseSlabDensityKgM3"
  | "impactHeavyConcreteBaseSlabThicknessMm"
  | "impactHeavyConcreteLoadBasisKgM2"
  | "impactHeavyConcreteLowerAssemblyType"
  | "impactHeavyConcreteLowerBoardLayerCount"
  | "impactHeavyConcreteLowerBoardThicknessMm"
  | "impactHeavyConcreteLowerCavityDepthMm"
  | "impactHeavyConcreteLowerCavityFillThicknessMm"
  | "impactHeavyConcreteLowerSupportClass"
  | "impactHeavyConcreteResilientLayerDynamicStiffnessMNm3"
  | "impactHeavyConcreteResilientLayerThicknessMm"
>): WorkbenchHeavyConcreteCombinedImpactInputSurfaceDraft {
  return {
    impactHeavyConcreteBaseSlabDensityKgM3: snapshot.impactHeavyConcreteBaseSlabDensityKgM3,
    impactHeavyConcreteBaseSlabThicknessMm: snapshot.impactHeavyConcreteBaseSlabThicknessMm,
    impactHeavyConcreteLoadBasisKgM2: snapshot.impactHeavyConcreteLoadBasisKgM2,
    impactHeavyConcreteLowerAssemblyType: snapshot.impactHeavyConcreteLowerAssemblyType,
    impactHeavyConcreteLowerBoardLayerCount: snapshot.impactHeavyConcreteLowerBoardLayerCount,
    impactHeavyConcreteLowerBoardThicknessMm: snapshot.impactHeavyConcreteLowerBoardThicknessMm,
    impactHeavyConcreteLowerCavityDepthMm: snapshot.impactHeavyConcreteLowerCavityDepthMm,
    impactHeavyConcreteLowerCavityFillThicknessMm: snapshot.impactHeavyConcreteLowerCavityFillThicknessMm,
    impactHeavyConcreteLowerSupportClass: snapshot.impactHeavyConcreteLowerSupportClass,
    impactHeavyConcreteResilientLayerDynamicStiffnessMNm3:
      snapshot.impactHeavyConcreteResilientLayerDynamicStiffnessMNm3,
    impactHeavyConcreteResilientLayerThicknessMm: snapshot.impactHeavyConcreteResilientLayerThicknessMm
  };
}

function evaluateHeavyConcreteScenario(input: {
  id?: string;
  rows?: readonly LayerDraft[];
  source?: "current" | "saved";
  surface?: WorkbenchHeavyConcreteCombinedImpactInputSurfaceDraft | null;
  targetOutputs?: readonly RequestedOutputId[];
}): EvaluatedScenario {
  return evaluateScenario({
    heavyConcreteCombinedImpactInputSurface: input.surface ?? COMPLETE_HEAVY_CONCRETE_SURFACE,
    id: input.id ?? "gate-bf-web-heavy-concrete-combined-input-surface",
    name: "Gate BF web heavy concrete combined input surface",
    rows: input.rows ?? HEAVY_CONCRETE_ROWS,
    source: input.source ?? "current",
    studyMode: "floor",
    targetOutputs: input.targetOutputs ?? TARGET_OUTPUTS
  });
}

function buildHeavyConcreteImpactPresetRows(): LayerDraft[] {
  const preset = getPresetById("heavy_concrete_impact_floor");

  return preset.rows.map((row, index) => ({
    ...row,
    id: `heavy-concrete-impact-preset-${index + 1}`,
    thicknessMm: String(row.thicknessMm)
  }));
}

function evaluateHeavyConcreteImpactPreset(input: {
  id?: string;
  surface?: WorkbenchHeavyConcreteCombinedImpactInputSurfaceDraft | null;
  targetOutputs?: readonly RequestedOutputId[];
} = {}): EvaluatedScenario {
  return evaluateScenario({
    heavyConcreteCombinedImpactInputSurface: input.surface,
    id: input.id ?? "heavy-concrete-impact-preset-surface-regression",
    name: "Heavy concrete impact preset surface regression",
    rows: buildHeavyConcreteImpactPresetRows(),
    source: "current",
    studyMode: "floor",
    targetOutputs: input.targetOutputs ?? PRESET_IMPACT_TARGET_OUTPUTS
  });
}

function expectHeavyConcreteFormulaResult(result: AssemblyCalculation | null | undefined) {
  expect(result?.impact).toMatchObject({
    basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
    DeltaLw: 30.1,
    LnW: 44.4,
    labOrField: "lab"
  });
  expect(result?.impactPredictorStatus).toMatchObject({
    implementedFormulaEstimate: true,
    inputMode: "explicit_predictor_input"
  });
}

function expectPublishedUpperTreatmentAnchorScenario(scenario: EvaluatedScenario) {
  expect(scenario.result?.impact).toMatchObject({
    LnW: 50,
    basis: HEAVY_CONCRETE_PUBLISHED_UPPER_TREATMENT_BASIS,
    labOrField: "lab"
  });
  expect(scenario.result?.supportedTargetOutputs).toContain("Ln,w");
  expect(scenario.result?.unsupportedTargetOutputs).not.toContain("Ln,w");
  expect(scenario.result?.impactPredictorStatus?.inputMode).not.toBe("explicit_predictor_input");
}

function expectHeavyConcreteFormulaScenario(scenario: EvaluatedScenario) {
  expectHeavyConcreteFormulaResult(scenario.result);

  const lnwCard = addOutputCardPosture(
    buildOutputCard({ output: "Ln,w", result: scenario.result, studyMode: "floor" }),
    { result: scenario.result, studyMode: "floor" }
  );
  const deltaCard = addOutputCardPosture(
    buildOutputCard({ output: "DeltaLw", result: scenario.result, studyMode: "floor" }),
    { result: scenario.result, studyMode: "floor" }
  );

  expect(lnwCard).toMatchObject({
    postureLabel: "Heavy concrete combined formula corridor",
    status: "live",
    value: "44.4 dB"
  });
  expect(lnwCard.detail).toContain("+/-6.5 dB corridor tolerance");
  expect(deltaCard).toMatchObject({
    postureLabel: "Heavy concrete combined formula corridor",
    status: "live",
    value: "30.1 dB"
  });
  expect(deltaCard.detail).toContain("+/-5.5 dB corridor tolerance");
}

function buildHeavyConcreteFormulaReport(scenario: EvaluatedScenario) {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("heavy_concrete_impact_floor"),
    briefNote: "",
    clientName: "Gate BF Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate BF Heavy Concrete Input Surface",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "50",
    targetRwDb: "60"
  });
}

async function saveCompleteHeavyConcreteStoreSnapshot(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();
  store.reset();
  store.startStudyMode("floor");
  store.clearRows();
  store.appendRows(withoutIds(HEAVY_CONCRETE_ROWS));
  store.setRequestedOutputs([...TARGET_OUTPUTS]);
  store.setImpactHeavyConcreteBaseSlabDensityKgM3(
    COMPLETE_HEAVY_CONCRETE_SURFACE.impactHeavyConcreteBaseSlabDensityKgM3
  );
  store.setImpactHeavyConcreteBaseSlabThicknessMm(
    COMPLETE_HEAVY_CONCRETE_SURFACE.impactHeavyConcreteBaseSlabThicknessMm
  );
  store.setImpactHeavyConcreteLoadBasisKgM2(COMPLETE_HEAVY_CONCRETE_SURFACE.impactHeavyConcreteLoadBasisKgM2);
  store.setImpactHeavyConcreteLowerAssemblyType(
    COMPLETE_HEAVY_CONCRETE_SURFACE.impactHeavyConcreteLowerAssemblyType
  );
  store.setImpactHeavyConcreteLowerBoardLayerCount(
    COMPLETE_HEAVY_CONCRETE_SURFACE.impactHeavyConcreteLowerBoardLayerCount
  );
  store.setImpactHeavyConcreteLowerBoardThicknessMm(
    COMPLETE_HEAVY_CONCRETE_SURFACE.impactHeavyConcreteLowerBoardThicknessMm
  );
  store.setImpactHeavyConcreteLowerCavityDepthMm(
    COMPLETE_HEAVY_CONCRETE_SURFACE.impactHeavyConcreteLowerCavityDepthMm
  );
  store.setImpactHeavyConcreteLowerCavityFillThicknessMm(
    COMPLETE_HEAVY_CONCRETE_SURFACE.impactHeavyConcreteLowerCavityFillThicknessMm
  );
  store.setImpactHeavyConcreteLowerSupportClass(COMPLETE_HEAVY_CONCRETE_SURFACE.impactHeavyConcreteLowerSupportClass);
  store.setImpactHeavyConcreteResilientLayerDynamicStiffnessMNm3(
    COMPLETE_HEAVY_CONCRETE_SURFACE.impactHeavyConcreteResilientLayerDynamicStiffnessMNm3
  );
  store.setImpactHeavyConcreteResilientLayerThicknessMm(
    COMPLETE_HEAVY_CONCRETE_SURFACE.impactHeavyConcreteResilientLayerThicknessMm
  );
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Gate BF expected the workbench store to save a heavy concrete formula snapshot.");
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

describe("heavy concrete combined input surface acceptance", () => {
  it("keeps the actual impact-floor preset Ln,w anchor live when the combined surface is blank or partial", () => {
    const baseline = evaluateHeavyConcreteImpactPreset({
      id: "heavy-concrete-impact-preset-no-surface-baseline"
    });
    const blankSurface = evaluateHeavyConcreteImpactPreset({
      id: "heavy-concrete-impact-preset-blank-surface",
      surface: EMPTY_HEAVY_CONCRETE_SURFACE
    });
    const partialSurface = evaluateHeavyConcreteImpactPreset({
      id: "heavy-concrete-impact-preset-partial-surface",
      surface: {
        ...COMPLETE_HEAVY_CONCRETE_SURFACE,
        impactHeavyConcreteResilientLayerDynamicStiffnessMNm3: ""
      }
    });

    expectPublishedUpperTreatmentAnchorScenario(baseline);
    expectPublishedUpperTreatmentAnchorScenario(blankSurface);
    expectPublishedUpperTreatmentAnchorScenario(partialSurface);

    expect(blankSurface.result?.supportedTargetOutputs).toEqual(baseline.result?.supportedTargetOutputs);
    expect(blankSurface.result?.unsupportedTargetOutputs).toEqual(baseline.result?.unsupportedTargetOutputs);

    const blankWarnings = blankSurface.warnings.join("\n");
    expect(blankWarnings).toContain("Upper resilient dynamic stiffness (MN/m3)");
    expect(blankWarnings).toContain("Loaded upper treatment mass basis (kg/m2)");
    expect(blankWarnings).toContain("Lower ceiling assembly");

    const partialWarnings = partialSurface.warnings.join("\n");
    expect(partialWarnings).toContain("Upper resilient dynamic stiffness (MN/m3)");
    expect(partialSurface.result?.impact?.basis).not.toBe(HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS);
  });

  it("keeps complete heavy-concrete input-surface parity across live, local saved, server snapshot, cards, and report", async () => {
    const liveScenario = evaluateHeavyConcreteScenario({ id: "gate-bf-live" });
    expectHeavyConcreteFormulaScenario(liveScenario);

    const report = buildHeavyConcreteFormulaReport(liveScenario);
    expect(report).toContain("- Impact lane: Heavy concrete combined upper/lower formula corridor");
    expect(report).toContain("- Impact Ln,w: 44.4 dB");
    expect(report).toContain("- DeltaLw: 30.1 dB");
    expect(report).toContain(
      "- Formula note: Corridor tolerance remains +/-6.5 dB for Ln,w and +/-5.5 dB for DeltaLw."
    );

    const savedSnapshot = await saveCompleteHeavyConcreteStoreSnapshot();
    expect(savedSnapshot).toMatchObject(COMPLETE_HEAVY_CONCRETE_SURFACE);

    const savedScenario = evaluateHeavyConcreteScenario({
      id: "gate-bf-saved",
      rows: savedSnapshot.rows,
      source: "saved",
      surface: surfaceFromScenario(savedSnapshot),
      targetOutputs: savedSnapshot.requestedOutputs
    });
    expectHeavyConcreteFormulaScenario(savedScenario);

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();

    const serverScenario = evaluateHeavyConcreteScenario({
      id: "gate-bf-server",
      rows: parsedServerSnapshot?.rows,
      source: "saved",
      surface: parsedServerSnapshot ? surfaceFromScenario(parsedServerSnapshot) : null,
      targetOutputs: parsedServerSnapshot?.requestedOutputs
    });
    expectHeavyConcreteFormulaScenario(serverScenario);
  });

  it("keeps calculator API payloads on the same formula basis without promoting field or ASTM outputs", async () => {
    const layers = toLayerInputs(HEAVY_CONCRETE_ROWS);
    const surface = buildWorkbenchHeavyConcreteCombinedImpactInputSurface({
      layers,
      surface: COMPLETE_HEAVY_CONCRETE_SURFACE,
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
    expectHeavyConcreteFormulaResult(estimateBody.result);

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
      basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      labOrField: "lab"
    });
    expect(impactBody.result?.unsupportedTargetOutputs).toEqual(
      expect.arrayContaining([...FIELD_TARGET_OUTPUTS])
    );
    expect(impactBody.result?.impact?.LPrimeNW).toBeUndefined();
    expect(impactBody.result?.impact?.LPrimeNTw).toBeUndefined();
  });

  it("gives precise missing-input guidance and refuses unsafe concrete topology", () => {
    const commaDecimal = evaluateHeavyConcreteScenario({
      surface: {
        ...COMPLETE_HEAVY_CONCRETE_SURFACE,
        impactHeavyConcreteLoadBasisKgM2: "100,0"
      }
    });
    expectHeavyConcreteFormulaResult(commaDecimal.result);

    const missingDynamic = evaluateHeavyConcreteScenario({
      surface: {
        ...COMPLETE_HEAVY_CONCRETE_SURFACE,
        impactHeavyConcreteResilientLayerDynamicStiffnessMNm3: ""
      }
    });
    expect(missingDynamic.result?.impact?.basis).not.toBe(HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS);
    expect(missingDynamic.warnings.join("\n")).toContain("Upper resilient dynamic stiffness (MN/m3)");

    const missingLower = evaluateHeavyConcreteScenario({
      surface: {
        ...COMPLETE_HEAVY_CONCRETE_SURFACE,
        impactHeavyConcreteLowerAssemblyType: "",
        impactHeavyConcreteLowerCavityDepthMm: ""
      }
    });
    expect(missingLower.result?.impact?.basis).not.toBe(HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS);
    expect(missingLower.warnings.join("\n")).toContain("Lower ceiling assembly");

    const duplicateBase = evaluateHeavyConcreteScenario({
      rows: [
        ...HEAVY_CONCRETE_ROWS,
        { floorRole: "base_structure", id: "duplicate-slab", materialId: "heavy_concrete", thicknessMm: "50" }
      ]
    });
    expect(duplicateBase.result?.impact?.basis).not.toBe(HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS);
    expect(duplicateBase.warnings.join("\n")).toContain("unsafe to collapse");

    const safelyReorderedRows = [
      HEAVY_CONCRETE_ROWS[2]!,
      HEAVY_CONCRETE_ROWS[0]!,
      HEAVY_CONCRETE_ROWS[1]!,
      HEAVY_CONCRETE_ROWS[3]!
    ];
    expectHeavyConcreteFormulaResult(evaluateHeavyConcreteScenario({ rows: safelyReorderedRows }).result);

    const fieldOnlyRequest = evaluateHeavyConcreteScenario({
      targetOutputs: ["L'n,w", "L'nT,w"]
    });
    expect(fieldOnlyRequest.result?.impact?.basis).not.toBe(HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS);
  });
});
