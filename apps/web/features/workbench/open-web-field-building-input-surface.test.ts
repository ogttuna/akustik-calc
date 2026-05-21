import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AssemblyCalculation, ImpactErrorBudget, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import {
  buildWorkbenchOpenWebFieldBuildingInputSurface,
  formatWorkbenchOpenWebFieldBuildingMissingInputWarning,
  type WorkbenchOpenWebFieldBuildingInputSurfaceDraft
} from "./open-web-field-building-input-surface";
import {
  OPEN_WEB_DIRECT_FIXED_LINING_BASIS
} from "./open-web-direct-fixed-lining-surface";
import {
  OPEN_WEB_RAW_BARE_BASIS
} from "./open-web-raw-bare-surface";
import {
  OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS
} from "./open-web-supported-band-similarity-surface";
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
const REPO_ROOT = fileURLToPath(new URL("../../../..", import.meta.url));
const LANDED_GATE = "broad_accuracy_floor_open_web_field_building_input_surface_plan";
const SELECTION_STATUS =
  "broad_accuracy_floor_open_web_field_building_input_surface_landed_selected_post_input_surface_revalidation";
const SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_web_field_building_post_input_surface_revalidation_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-web-field-building-post-input-surface-revalidation-contract.test.ts";
const DOC_ALIGNMENT_SURFACES = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md"
] as const;
const FIELD_TARGETS = [
  "Rw",
  "R'w",
  "DnT,w",
  "Ln,w",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "IIC"
] as const satisfies readonly RequestedOutputId[];
const BUILDING_TARGETS = ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

let originalEnv: Record<string, string | undefined>;

const EXACT_FL23_ROWS: readonly LayerDraft[] = [
  { floorRole: "floor_covering", id: "finish", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
  { floorRole: "floating_screed", id: "deck", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", id: "steel", materialId: "open_web_steel_floor", thicknessMm: "300" },
  { floorRole: "ceiling_board", id: "board-a", materialId: "firestop_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", id: "board-b", materialId: "firestop_board", thicknessMm: "13" }
];

const DIRECT_FIXED_ROWS: readonly LayerDraft[] = [
  { floorRole: "floating_screed", id: "deck", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "ceiling_board", id: "board-a", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", id: "board-b", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "base_structure", id: "steel", materialId: "open_web_steel_floor", thicknessMm: "250" }
];

const SUPPORTED_BAND_ROWS: readonly LayerDraft[] = [
  { floorRole: "ceiling_board", id: "board-a", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", id: "board-b", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", id: "fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", id: "cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floating_screed", id: "deck", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", id: "steel", materialId: "open_web_steel_floor", thicknessMm: "250" }
];

const RAW_BARE_ROWS: readonly LayerDraft[] = [
  { floorRole: "base_structure", id: "steel", materialId: "open_web_steel_floor", thicknessMm: "300" }
];

const COMPLETE_FIELD_SURFACE = {
  contextMode: "field_between_rooms",
  fieldKDb: "2",
  impactReceivingRoomVolumeM3: "55",
  panelHeightMm: "2800",
  panelWidthMm: "3200",
  receivingRoomRt60S: "0.6",
  receivingRoomVolumeM3: "55"
} as const satisfies WorkbenchOpenWebFieldBuildingInputSurfaceDraft;

const COMPLETE_BUILDING_SURFACE = {
  ...COMPLETE_FIELD_SURFACE,
  baseAirborneContext: {
    buildingPredictionOutputBasis: "apparent_and_standardized",
    conservativeFlankingAssumption: "multi_path_conservative",
    flankingJunctionClass: "rigid_cross_junction",
    junctionCouplingLengthM: 4,
    sourceRoomVolumeM3: 55
  },
  contextMode: "building_prediction"
} as const satisfies WorkbenchOpenWebFieldBuildingInputSurfaceDraft;

const FIELD_CASES = [
  {
    basis: "official_floor_system_exact_match",
    expected: { DnTw: 80, LPrimeNT50: 70, LPrimeNTw: 70.6, LPrimeNW: 73, LnW: 71, Rw: 51, RwPrime: 77 },
    id: "exact",
    rows: EXACT_FL23_ROWS
  },
  {
    basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS,
    expected: { DnTw: 78, LPrimeNT50: 76.5, LPrimeNTw: 76.6, LPrimeNW: 79, LnW: 77, Rw: 52, RwPrime: 75 },
    id: "direct-fixed",
    rows: DIRECT_FIXED_ROWS
  },
  {
    basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS,
    expected: { DnTw: 48, LPrimeNT50: 60, LPrimeNTw: 61.1, LPrimeNW: 63.5, LnW: 61.5, Rw: 61.5, RwPrime: 45 },
    id: "supported-band",
    rows: SUPPORTED_BAND_ROWS
  }
] as const;

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
    floorRole: row.floorRole,
    materialId: row.materialId,
    thicknessMm: row.thicknessMm
  }));
}

function toLayerInputs(rows: readonly LayerDraft[]): LayerInput[] {
  return rows.map((row) => ({
    floorRole: row.floorRole,
    materialId: row.materialId,
    thicknessMm: Number.parseFloat(row.thicknessMm.replace(",", "."))
  }));
}

function surfaceFromScenario(
  snapshot: Pick<
    ScenarioSnapshot,
    | "airborneContextMode"
    | "airbornePanelHeightMm"
    | "airbornePanelWidthMm"
    | "airborneReceivingRoomRt60S"
    | "airborneReceivingRoomVolumeM3"
    | "impactGuideKDb"
    | "impactGuideReceivingRoomVolumeM3"
  >
): WorkbenchOpenWebFieldBuildingInputSurfaceDraft {
  return {
    contextMode: snapshot.airborneContextMode,
    fieldKDb: snapshot.impactGuideKDb,
    impactReceivingRoomVolumeM3: snapshot.impactGuideReceivingRoomVolumeM3,
    panelHeightMm: snapshot.airbornePanelHeightMm,
    panelWidthMm: snapshot.airbornePanelWidthMm,
    receivingRoomRt60S: snapshot.airborneReceivingRoomRt60S,
    receivingRoomVolumeM3: snapshot.airborneReceivingRoomVolumeM3
  };
}

function buildScenario(input: {
  id?: string;
  rows?: readonly LayerDraft[];
  source?: "current" | "saved";
  surface?: WorkbenchOpenWebFieldBuildingInputSurfaceDraft;
  targetOutputs?: readonly RequestedOutputId[];
} = {}): EvaluatedScenario & { result: AssemblyCalculation } {
  const scenario = evaluateScenario({
    calculator: "dynamic",
    id: input.id ?? "open-web-field-building-input-surface",
    name: "Open-web field/building input surface",
    openWebFieldBuildingInputSurface: input.surface ?? COMPLETE_FIELD_SURFACE,
    rows: input.rows ?? EXACT_FL23_ROWS,
    savedAtIso: input.source === "saved" ? "2026-05-20T10:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "floor",
    targetOutputs: input.targetOutputs ?? FIELD_TARGETS
  });

  if (!scenario.result) {
    throw new Error("Open-web field/building scenario did not evaluate.");
  }

  return scenario as EvaluatedScenario & { result: AssemblyCalculation };
}

function buildReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("heavy_concrete_impact_floor"),
    briefNote: "",
    clientName: "Broad Accuracy",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Open Web Field Building",
    reportProfile: "consultant",
    requestedOutputs: FIELD_TARGETS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "70",
    targetRwDb: "50"
  });
}

async function saveCompleteScenario(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();

  store.reset();
  store.startStudyMode("floor");
  store.clearRows();
  store.appendRows(withoutIds(EXACT_FL23_ROWS));
  store.setRequestedOutputs([...FIELD_TARGETS]);
  store.setAirborneContextMode("field_between_rooms");
  store.setAirbornePanelHeightMm(COMPLETE_FIELD_SURFACE.panelHeightMm);
  store.setAirbornePanelWidthMm(COMPLETE_FIELD_SURFACE.panelWidthMm);
  store.setAirborneReceivingRoomRt60S(COMPLETE_FIELD_SURFACE.receivingRoomRt60S);
  store.setAirborneReceivingRoomVolumeM3(COMPLETE_FIELD_SURFACE.receivingRoomVolumeM3);
  store.setImpactGuideSource("live_stack");
  store.setImpactGuideKDb(COMPLETE_FIELD_SURFACE.fieldKDb);
  store.setImpactGuideReceivingRoomVolumeM3(COMPLETE_FIELD_SURFACE.impactReceivingRoomVolumeM3);
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Expected the workbench store to save the open-web field/building snapshot.");
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

describe("open-web field/building input surface", () => {
  it("normalizes complete floor physical inputs and names missing fields precisely", () => {
    const complete = buildWorkbenchOpenWebFieldBuildingInputSurface({
      layers: toLayerInputs(EXACT_FL23_ROWS),
      studyMode: "floor",
      surface: COMPLETE_FIELD_SURFACE,
      targetOutputs: FIELD_TARGETS
    });

    expect(complete).toMatchObject({
      airborneContext: {
        contextMode: "field_between_rooms",
        panelHeightMm: 2800,
        panelWidthMm: 3200,
        receivingRoomRt60S: 0.6,
        receivingRoomVolumeM3: 55
      },
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 55
      },
      missingPhysicalInputs: [],
      status: "complete"
    });

    const partial = buildWorkbenchOpenWebFieldBuildingInputSurface({
      layers: toLayerInputs(EXACT_FL23_ROWS),
      studyMode: "floor",
      surface: {
        ...COMPLETE_FIELD_SURFACE,
        fieldKDb: "",
        impactReceivingRoomVolumeM3: "",
        panelHeightMm: "",
        receivingRoomRt60S: "",
        receivingRoomVolumeM3: ""
      },
      targetOutputs: FIELD_TARGETS
    });

    expect(partial.status).toBe("needs_input");
    expect(partial.missingPhysicalInputs).toEqual([
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S",
      "fieldKDb",
      "impactReceivingRoomVolumeM3"
    ]);
    expect(formatWorkbenchOpenWebFieldBuildingMissingInputWarning(partial)).toContain("Impact field K correction");
  });

  it("feeds exact, direct-fixed, and supported-band field values through the workbench input surface", () => {
    for (const testCase of FIELD_CASES) {
      const scenario = buildScenario({ id: testCase.id, rows: testCase.rows });
      const result = scenario.result;

      expect(result.supportedTargetOutputs, testCase.id).toEqual([
        "Rw",
        "R'w",
        "DnT,w",
        "Ln,w",
        "L'n,w",
        "L'nT,w",
        "L'nT,50"
      ]);
      expect(result.unsupportedTargetOutputs, testCase.id).toEqual(["IIC"]);
      expect(result.floorSystemRatings, testCase.id).toMatchObject({
        Rw: testCase.expected.Rw,
        basis: testCase.basis
      });
      expect(result.metrics, testCase.id).toMatchObject({
        estimatedDnTwDb: testCase.expected.DnTw,
        estimatedRwPrimeDb: testCase.expected.RwPrime
      });
      expect(result.impact, testCase.id).toMatchObject({
        LPrimeNT50: testCase.expected.LPrimeNT50,
        LPrimeNTw: testCase.expected.LPrimeNTw,
        LPrimeNW: testCase.expected.LPrimeNW,
        LnW: testCase.expected.LnW
      });
      expect(result.impact?.errorBudgets?.some(
        (budget: ImpactErrorBudget) =>
          budget.metricId === "L'n,w" && budget.origin === "source_absent_field_building_adapter_error_budget"
      )).toBe(true);

      const lPrimeCard = addOutputCardPosture(buildOutputCard({ output: "L'n,w", result, studyMode: "floor" }), {
        result,
        studyMode: "floor"
      });
      expect(lPrimeCard).toMatchObject({
        status: "live",
        value: `${testCase.expected.LPrimeNW} dB`
      });
    }
  });

  it("keeps saved replay, server snapshots, calculator API, impact-only API, and report payloads aligned", async () => {
    const saved = await saveCompleteScenario();
    const replay = buildScenario({
      rows: saved.rows,
      source: "saved",
      surface: surfaceFromScenario(saved),
      targetOutputs: saved.requestedOutputs
    });
    const serverSnapshot = parseServerProjectWorkbenchSnapshot(buildServerProjectWorkbenchSnapshot(saved));
    expect(serverSnapshot).not.toBeNull();
    if (!serverSnapshot) {
      throw new Error("Expected server snapshot parse to retain the saved floor field context.");
    }

    expect(replay.result.metrics).toMatchObject({ estimatedDnTwDb: 80, estimatedRwPrimeDb: 77 });
    expect(replay.result.impact).toMatchObject({ LPrimeNT50: 70, LPrimeNTw: 70.6, LPrimeNW: 73, LnW: 71 });
    expect(serverSnapshot.airborneContextMode).toBe("field_between_rooms");
    expect(serverSnapshot.impactGuideKDb).toBe("2");
    expect(serverSnapshot.impactGuideReceivingRoomVolumeM3).toBe("55");

    const surface = buildWorkbenchOpenWebFieldBuildingInputSurface({
      layers: toLayerInputs(EXACT_FL23_ROWS),
      studyMode: "floor",
      surface: surfaceFromScenario(saved),
      targetOutputs: FIELD_TARGETS
    });
    const { POST: estimate } = await import("../../app/api/estimate/route");
    const { POST: impactOnly } = await import("../../app/api/impact-only/route");
    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: surface.airborneContext,
        calculator: "dynamic",
        impactFieldContext: surface.impactFieldContext,
        layers: toLayerInputs(EXACT_FL23_ROWS),
        targetOutputs: FIELD_TARGETS
      })
    );
    const impactResponse = await impactOnly(
      jsonRequest("http://localhost/api/impact-only", {
        impactFieldContext: surface.impactFieldContext,
        layers: toLayerInputs(EXACT_FL23_ROWS),
        targetOutputs: FIELD_TARGETS
      })
    );
    const estimatePayload = await estimateResponse.json();
    const impactPayload = await impactResponse.json();

    expect(estimatePayload.result.metrics).toMatchObject({ estimatedDnTwDb: 80, estimatedRwPrimeDb: 77 });
    expect(estimatePayload.result.impact).toMatchObject({ LPrimeNT50: 70, LPrimeNTw: 70.6, LPrimeNW: 73 });
    expect(impactPayload.result.impact).toMatchObject({ LPrimeNT50: 70, LPrimeNTw: 70.6, LPrimeNW: 73 });

    const report = buildReport(replay);
    expect(report).toContain("- Impact L'n,w: 73.0 dB");
    expect(report).toContain("source_absent_field_building_adapter_error_budget");
  });

  it("blocks partial, raw-bare field transfer, building prediction, and ASTM aliases without inventing support", () => {
    const partial = buildScenario({
      surface: {
        ...COMPLETE_FIELD_SURFACE,
        fieldKDb: "",
        impactReceivingRoomVolumeM3: ""
      }
    });
    expect(partial.warnings.join(" ")).toContain("Impact field K correction");
    expect(partial.result.supportedTargetOutputs).toEqual(["Rw", "R'w", "DnT,w", "Ln,w"]);
    expect(partial.result.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "L'nT,50", "IIC"]);

    const rawBare = buildScenario({ rows: RAW_BARE_ROWS });
    expect(rawBare.result.supportedTargetOutputs).toEqual(["Rw", "R'w", "DnT,w", "Ln,w"]);
    expect(rawBare.result.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "L'nT,50", "IIC"]);
    expect(rawBare.result.floorSystemRatings).toMatchObject({ Rw: 32, basis: OPEN_WEB_RAW_BARE_BASIS });
    expect(rawBare.result.impact?.LPrimeNW).toBeUndefined();
    expect(rawBare.result.impact?.errorBudgets?.some(
      (budget: ImpactErrorBudget) => budget.origin === "source_absent_field_building_adapter_error_budget"
    )).toBe(false);

    const building = buildScenario({
      rows: RAW_BARE_ROWS,
      surface: COMPLETE_BUILDING_SURFACE,
      targetOutputs: BUILDING_TARGETS
    });
    expect(building.warnings.join(" ")).toContain("floor_open_web_building_prediction_runtime_owner_missing");
    expect(building.result.supportedTargetOutputs).toEqual([]);
    expect(building.result.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]);

    const astm = buildScenario({
      rows: DIRECT_FIXED_ROWS,
      targetOutputs: ["IIC", "AIIC"] satisfies RequestedOutputId[]
    });
    expect(astm.result.supportedTargetOutputs).toEqual([]);
    expect(astm.result.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
  });

  it("keeps docs and the current gate runner aligned with the input-surface closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();
      const normalizedWhitespaceContent = normalizedContent.replace(/\s+/g, " ");

      expect(content, path).toContain(LANDED_GATE);
      expect(content, path).toContain(SELECTION_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(normalizedWhitespaceContent, path).toContain("workbench controls");
      expect(normalizedWhitespaceContent, path).toContain("live evaluation");
      expect(normalizedWhitespaceContent, path).toContain("local saved replay");
      expect(normalizedWhitespaceContent, path).toContain("server snapshot replay");
      expect(normalizedWhitespaceContent, path).toContain("calculator api");
      expect(normalizedContent, path).toContain("impact-only api");
      expect(normalizedWhitespaceContent, path).toContain("markdown report");
      expect(normalizedWhitespaceContent, path).toContain("raw-bare impact field transfer remains blocked");
      expect(normalizedWhitespaceContent, path).toContain("building prediction remains unsupported");
      expect(normalizedWhitespaceContent, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain("open-web-field-building-input-surface.test.ts");
  });
});
