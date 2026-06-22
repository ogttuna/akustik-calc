import {
  GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING,
  GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD
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
  buildWorkbenchOpeningLeakCompositeInputSurface,
  type WorkbenchOpeningLeakCompositeInputSurfaceDraft
} from "./opening-leak-composite-input-surface";
import {
  addOutputCardPosture,
  buildOutputCard
} from "./simple-workbench-output-model";
import type { LayerDraft, ScenarioSnapshot } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const OPENING_TARGETS = ["Rw", "STC", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const HOST_WALL_ROWS: readonly LayerDraft[] = [
  { id: "gypsum", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "gap", materialId: "air_gap", thicknessMm: "40" },
  { id: "fill", materialId: "rockwool", thicknessMm: "40" },
  { id: "concrete", materialId: "concrete", thicknessMm: "160" }
];

const COMPLETE_OPENING_SURFACE = {
  hostWallAreaM2: "12",
  elements: [
    {
      areaM2: "1.8",
      count: "1",
      elementRwDb: "32",
      id: "door-01",
      origin: "catalogued",
      ratingBasis: "rw_single_number",
      sealLeakageClass: "average"
    }
  ]
} as const satisfies WorkbenchOpeningLeakCompositeInputSurfaceDraft;

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
          materialId: row.materialId,
          thicknessMm
        }]
      : [];
  });
}

function withoutIds(rows: readonly LayerDraft[]): Array<Omit<LayerDraft, "id">> {
  return rows.map((row) => ({
    materialId: row.materialId,
    thicknessMm: row.thicknessMm
  }));
}

function surfaceFromScenario(
  snapshot: Pick<ScenarioSnapshot, "airborneOpeningLeakElements" | "airborneOpeningLeakHostWallAreaM2">
): WorkbenchOpeningLeakCompositeInputSurfaceDraft {
  return {
    elements: snapshot.airborneOpeningLeakElements,
    hostWallAreaM2: snapshot.airborneOpeningLeakHostWallAreaM2
  };
}

function evaluateOpeningScenario(input: {
  id?: string;
  rows?: readonly LayerDraft[];
  source?: "current" | "saved";
  surface?: WorkbenchOpeningLeakCompositeInputSurfaceDraft | null;
  targetOutputs?: readonly RequestedOutputId[];
} = {}): EvaluatedScenario {
  return evaluateScenario({
    calculator: "dynamic",
    id: input.id ?? "gate-u-opening-leak-input-surface",
    name: "Gate U opening leak input surface",
    openingLeakCompositeInputSurface: input.surface ?? COMPLETE_OPENING_SURFACE,
    rows: input.rows ?? HOST_WALL_ROWS,
    source: input.source ?? "current",
    studyMode: "wall",
    targetOutputs: input.targetOutputs ?? OPENING_TARGETS
  });
}

function expectOpeningRuntime(result: AssemblyCalculation | null | undefined) {
  expect(result?.metrics.estimatedRwDb).toBe(38.2);
  expect(result?.metrics.estimatedStc).toBe(39);
  expect(result?.supportedTargetOutputs).toEqual(["Rw", "STC"]);
  expect(result?.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
  expect(result?.airborneBasis).toMatchObject({
    errorBudgetDb: 6,
    method: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
    origin: "family_physics_prediction"
  });
  expect(result?.ratingAdapterBasisSet).toEqual([
    expect.objectContaining({
      adapterId: "astm_e413_stc_from_airborne_transmission_loss_curve",
      implementationStatus: "runtime_adapter",
      metricId: "STC",
      ratingStandard: "ASTM E413"
    })
  ]);
  expect(result?.warnings).toContain(GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING);
}

function expectOpeningScenario(scenario: EvaluatedScenario) {
  expectOpeningRuntime(scenario.result);

  const rwCard = addOutputCardPosture(
    buildOutputCard({ output: "Rw", result: scenario.result, studyMode: "wall" }),
    { result: scenario.result, studyMode: "wall" }
  );
  const stcCard = addOutputCardPosture(
    buildOutputCard({ output: "STC", result: scenario.result, studyMode: "wall" }),
    { result: scenario.result, studyMode: "wall" }
  );

  expect(rwCard).toMatchObject({
    postureLabel: "Opening/leak composite runtime",
    status: "live",
    value: "38.2 dB"
  });
  expect(rwCard.detail).toContain("+/-6 dB source-absent lab Rw / STC budget");
  expect(stcCard).toMatchObject({
    postureLabel: "Opening/leak composite runtime",
    status: "live",
    value: "39 dB"
  });
  expect(stcCard.detail).toContain("Gate AH ASTM E413 spectrum adapter");
}

function buildOpeningReport(scenario: EvaluatedScenario) {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("concrete_wall"),
    briefNote: "",
    clientName: "Gate U Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate U Opening Leak Input Surface",
    reportProfile: "consultant",
    requestedOutputs: OPENING_TARGETS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "wall",
    targetLnwDb: "",
    targetRwDb: "45"
  });
}

async function saveCompleteOpeningStoreSnapshot(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();
  store.reset();
  store.startStudyMode("wall");
  store.clearRows();
  store.appendRows(withoutIds(HOST_WALL_ROWS));
  store.setRequestedOutputs([...OPENING_TARGETS]);
  store.setAirborneOpeningLeakHostWallAreaM2(COMPLETE_OPENING_SURFACE.hostWallAreaM2);
  store.replaceAirborneOpeningLeakElements(COMPLETE_OPENING_SURFACE.elements);
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Gate U expected the workbench store to save an opening/leak snapshot.");
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

describe("opening/leak composite input surface acceptance", () => {
  it("feeds the Gate S runtime from UI-derived fields across live, saved, server snapshot, cards, and report", async () => {
    const liveScenario = evaluateOpeningScenario({ id: "gate-u-live" });
    expectOpeningScenario(liveScenario);

    const report = buildOpeningReport(liveScenario);
    expect(report).toContain("- Airborne opening/leak basis: Gate S opening/leak composite runtime");
    expect(report).toContain(
      "- Airborne opening/leak Rw: 38.2 dB; STC: 39 dB through Gate AH ASTM E413 adapter, budget +/-6 dB, not measured evidence."
    );

    const savedSnapshot = await saveCompleteOpeningStoreSnapshot();
    expect(savedSnapshot.airborneOpeningLeakHostWallAreaM2).toBe("12");
    expect(savedSnapshot.airborneOpeningLeakElements).toEqual(COMPLETE_OPENING_SURFACE.elements);

    const savedScenario = evaluateOpeningScenario({
      id: "gate-u-saved",
      rows: savedSnapshot.rows,
      source: "saved",
      surface: surfaceFromScenario(savedSnapshot),
      targetOutputs: savedSnapshot.requestedOutputs
    });
    expectOpeningScenario(savedScenario);

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();

    const serverScenario = evaluateOpeningScenario({
      id: "gate-u-server",
      rows: parsedServerSnapshot?.rows,
      source: "saved",
      surface: parsedServerSnapshot ? surfaceFromScenario(parsedServerSnapshot) : null,
      targetOutputs: parsedServerSnapshot?.requestedOutputs
    });
    expectOpeningScenario(serverScenario);
  });

  it("keeps calculator API payloads on the same lab Rw/STC basis without promoting field outputs", async () => {
    const layers = toLayerInputs(HOST_WALL_ROWS);
    const surface = buildWorkbenchOpeningLeakCompositeInputSurface({
      studyMode: "wall",
      surface: COMPLETE_OPENING_SURFACE,
      targetOutputs: OPENING_TARGETS
    });
    expect(surface.status).toBe("complete");

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const response = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: {
          contextMode: "element_lab",
          ...surface.airborneContextPatch
        },
        calculator: "dynamic",
        layers,
        targetOutputs: OPENING_TARGETS
      })
    );
    const body = (await response.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expectOpeningRuntime(body.result);
    expect(body.result?.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
  });

  it("gives precise missing-input guidance for partial, empty, zero, comma, and removed fields", () => {
    const commaDecimal = evaluateOpeningScenario({
      surface: {
        hostWallAreaM2: "12,0",
        elements: [
          {
            ...COMPLETE_OPENING_SURFACE.elements[0]!,
            areaM2: "1,8",
            elementRwDb: "32,0"
          }
        ]
      }
    });
    expectOpeningRuntime(commaDecimal.result);

    const missingHostArea = evaluateOpeningScenario({
      surface: {
        ...COMPLETE_OPENING_SURFACE,
        hostWallAreaM2: ""
      }
    });
    expect(missingHostArea.result?.airborneBasis).toMatchObject({
      method: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      origin: "needs_input"
    });
    expect(missingHostArea.result?.airborneBasis?.missingPhysicalInputs).toContain("hostWallAreaM2");
    expect(missingHostArea.warnings.join("\n")).toContain("Host wall area (m2)");

    const invalidOpeningFields = evaluateOpeningScenario({
      surface: {
        hostWallAreaM2: "12",
        elements: [
          {
            ...COMPLETE_OPENING_SURFACE.elements[0]!,
            count: "1.5",
            elementRwDb: "0",
            ratingBasis: "unknown",
            sealLeakageClass: "unknown"
          }
        ]
      }
    });
    expect(invalidOpeningFields.result?.airborneBasis?.origin).toBe("needs_input");
    expect(invalidOpeningFields.warnings.join("\n")).toContain("Opening count");
    expect(invalidOpeningFields.warnings.join("\n")).toContain("Opening element Rw (dB)");
    expect(invalidOpeningFields.warnings.join("\n")).toContain("Opening rating basis");
    expect(invalidOpeningFields.warnings.join("\n")).toContain("Seal/leakage class");
  });

  it("keeps hostile and unsupported opening edits bounded while safe reorder remains invariant", () => {
    const duplicateOpening = evaluateOpeningScenario({
      surface: {
        hostWallAreaM2: "12",
        elements: [
          COMPLETE_OPENING_SURFACE.elements[0]!,
          COMPLETE_OPENING_SURFACE.elements[0]!
        ]
      }
    });
    expect(duplicateOpening.result?.airborneBasis).toMatchObject({
      method: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      origin: "unsupported"
    });
    expect(duplicateOpening.result?.airborneBasis?.errorBudgetDb).toBeUndefined();
    expect(duplicateOpening.warnings.join("\n")).toContain("duplicate opening ids");
    expect(duplicateOpening.warnings.join("\n")).not.toContain("duplicateOpeningId");

    const excessiveArea = evaluateOpeningScenario({
      surface: {
        hostWallAreaM2: "1",
        elements: COMPLETE_OPENING_SURFACE.elements
      }
    });
    expect(excessiveArea.result?.airborneBasis?.origin).toBe("unsupported");
    expect(excessiveArea.warnings.join("\n")).toContain("opening area exceeds host wall area");
    expect(excessiveArea.warnings.join("\n")).not.toContain("openingAreaExceedsHostWallArea");

    const sourceAbsentOpening = evaluateOpeningScenario({
      surface: {
        hostWallAreaM2: "12",
        elements: [
          {
            ...COMPLETE_OPENING_SURFACE.elements[0]!,
            id: "source-absent-door",
            origin: "source_absent"
          }
        ]
      }
    });
    expect(sourceAbsentOpening.result?.airborneBasis?.origin).toBe("unsupported");
    expect(sourceAbsentOpening.result?.airborneBasis?.errorBudgetDb).toBeUndefined();

    const stcOnlyOpening = evaluateOpeningScenario({
      surface: {
        hostWallAreaM2: "12",
        elements: [
          {
            ...COMPLETE_OPENING_SURFACE.elements[0]!,
            id: "stc-door",
            ratingBasis: "stc_single_number"
          }
        ]
      }
    });
    expect(stcOnlyOpening.result?.airborneBasis?.origin).toBe("unsupported");
    expect(stcOnlyOpening.result?.airborneBasis?.errorBudgetDb).toBeUndefined();

    const twoOpenings = {
      hostWallAreaM2: "14",
      elements: [
        COMPLETE_OPENING_SURFACE.elements[0]!,
        {
          areaM2: "0.6",
          count: "2",
          elementRwDb: "36",
          id: "window-02",
          origin: "catalogued",
          ratingBasis: "rw_single_number",
          sealLeakageClass: "sealed"
        }
      ]
    } as const satisfies WorkbenchOpeningLeakCompositeInputSurfaceDraft;
    const reordered = {
      ...twoOpenings,
      elements: [...twoOpenings.elements].reverse()
    };
    const first = evaluateOpeningScenario({ surface: twoOpenings });
    const second = evaluateOpeningScenario({ surface: reordered });
    expect(first.result?.airborneBasis?.method).toBe(GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD);
    expect(second.result?.airborneBasis?.method).toBe(GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD);
    expect(second.result?.metrics.estimatedRwDb).toBe(first.result?.metrics.estimatedRwDb);
  });
});
