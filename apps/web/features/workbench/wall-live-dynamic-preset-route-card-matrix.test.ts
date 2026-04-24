import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import { getPresetById, type PresetId } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";

const WALL_OUTPUTS = [
  "Rw",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

type WallOutputId = (typeof WALL_OUTPUTS)[number];
type LiveContextMode = NonNullable<AirborneContext["contextMode"]>;

type CardSnapshot = {
  status: "bound" | "live" | "needs_input" | "unsupported";
  value: string;
};

type LiveWallCase = {
  contextMode: LiveContextMode;
  expected: {
    c: number | null;
    cards: Record<WallOutputId, CardSnapshot>;
    ctr: number | null;
    dnA: number | null;
    dnTA: number | null;
    dnTw: number | null;
    dnW: number | null;
    rw: number | null;
    rwPrime: number | null;
    supported: readonly RequestedOutputId[];
    unsupported: readonly RequestedOutputId[];
  };
  presetId: PresetId;
};

function createMemoryStorage(): Storage {
  const values = new Map<string, string>();

  return {
    clear() {
      values.clear();
    },
    getItem(key: string) {
      return values.has(key) ? values.get(key)! : null;
    },
    key(index: number) {
      return Array.from(values.keys())[index] ?? null;
    },
    get length() {
      return values.size;
    },
    removeItem(key: string) {
      values.delete(key);
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    }
  };
}

function parsePositiveNumber(value: string): number | undefined {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

async function evaluateLiveWorkbenchPreset(input: {
  contextMode: LiveContextMode;
  presetId: PresetId;
}) {
  const { useWorkbenchStore } = await import("./workbench-store");

  useWorkbenchStore.getState().loadPreset(input.presetId);
  useWorkbenchStore.getState().setCalculatorId("dynamic");
  useWorkbenchStore.getState().setAirborneContextMode(input.contextMode);
  useWorkbenchStore.getState().setAirborneSharedTrack("independent");
  useWorkbenchStore.getState().setAirborneElectricalBoxes("none");
  useWorkbenchStore.getState().setAirborneJunctionQuality("good");
  useWorkbenchStore.getState().setAirbornePenetrationState("none");
  useWorkbenchStore.getState().setAirbornePerimeterSeal("good");

  if (input.contextMode === "element_lab") {
    useWorkbenchStore.getState().setAirbornePanelHeightMm("");
    useWorkbenchStore.getState().setAirbornePanelWidthMm("");
    useWorkbenchStore.getState().setAirborneReceivingRoomRt60S("");
    useWorkbenchStore.getState().setAirborneReceivingRoomVolumeM3("");
  } else {
    useWorkbenchStore.getState().setAirbornePanelHeightMm("3000");
    useWorkbenchStore.getState().setAirbornePanelWidthMm("4200");
    if (input.contextMode === "building_prediction") {
      useWorkbenchStore.getState().setAirborneReceivingRoomRt60S("0.7");
      useWorkbenchStore.getState().setAirborneReceivingRoomVolumeM3("55");
    } else {
      useWorkbenchStore.getState().setAirborneReceivingRoomRt60S("");
      useWorkbenchStore.getState().setAirborneReceivingRoomVolumeM3("");
    }
  }

  const state = useWorkbenchStore.getState();
  const airborneContext: AirborneContext = {
    airtightness: state.airborneAirtightness,
    connectionType: state.airborneConnectionType,
    contextMode: state.airborneContextMode,
    electricalBoxes: state.airborneElectricalBoxes,
    junctionQuality: state.airborneJunctionQuality,
    panelHeightMm: parsePositiveNumber(state.airbornePanelHeightMm),
    panelWidthMm: parsePositiveNumber(state.airbornePanelWidthMm),
    penetrationState: state.airbornePenetrationState,
    perimeterSeal: state.airbornePerimeterSeal,
    receivingRoomRt60S: parsePositiveNumber(state.airborneReceivingRoomRt60S),
    receivingRoomVolumeM3: parsePositiveNumber(state.airborneReceivingRoomVolumeM3),
    resilientBarSideCount: state.airborneResilientBarSideCount,
    sharedTrack: state.airborneSharedTrack,
    studSpacingMm: parsePositiveNumber(state.airborneStudSpacingMm),
    studType: state.airborneStudType
  };

  const preset = getPresetById(input.presetId);
  const scenario = evaluateScenario({
    airborneContext,
    calculator: state.calculatorId,
    id: `${input.presetId}-${input.contextMode}`,
    name: preset.label,
    rows: state.rows,
    source: "current",
    studyMode: state.studyMode,
    targetOutputs: WALL_OUTPUTS
  });

  const result = scenario.result;
  expect(result, `${input.presetId} ${input.contextMode} result`).not.toBeNull();
  if (!result) {
    throw new Error(`${input.presetId} ${input.contextMode} did not evaluate.`);
  }

  const cards = new Map(
    WALL_OUTPUTS.map((output) => [
      output,
      buildOutputCard({
        output,
        result,
        studyMode: "wall"
      })
    ])
  );

  return {
    airborneContext,
    branch: getDynamicCalcBranchSummary({
      result,
      studyMode: "wall"
    }),
    cards,
    result,
    state
  };
}

const LIVE_CASES: readonly LiveWallCase[] = [
  {
    presetId: "timber_stud_wall",
    contextMode: "element_lab",
    expected: {
      c: 0.5,
      cards: {
        Rw: { status: "live", value: "50 dB" },
        "R'w": { status: "needs_input", value: "Not ready" },
        "Dn,w": { status: "needs_input", value: "Not ready" },
        "Dn,A": { status: "needs_input", value: "Not ready" },
        "DnT,w": { status: "needs_input", value: "Not ready" },
        "DnT,A": { status: "needs_input", value: "Not ready" },
        STC: { status: "live", value: "50 dB" },
        C: { status: "live", value: "+0.5 dB" },
        Ctr: { status: "live", value: "-4.2 dB" }
      },
      ctr: -4.2,
      dnA: null,
      dnTA: null,
      dnTw: null,
      dnW: null,
      rw: 50,
      rwPrime: null,
      supported: ["Rw", "STC", "C", "Ctr"],
      unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]
    }
  },
  {
    presetId: "timber_stud_wall",
    contextMode: "field_between_rooms",
    expected: {
      c: 0.8,
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "42 dB" },
        "Dn,w": { status: "live", value: "41 dB" },
        "Dn,A": { status: "live", value: "41.8 dB" },
        "DnT,w": { status: "needs_input", value: "Not ready" },
        "DnT,A": { status: "needs_input", value: "Not ready" },
        STC: { status: "live", value: "42 dB" },
        C: { status: "live", value: "+0.8 dB" },
        Ctr: { status: "live", value: "-4 dB" }
      },
      ctr: -4,
      dnA: 41.8,
      dnTA: null,
      dnTw: null,
      dnW: 41,
      rw: 42,
      rwPrime: 42,
      supported: ["R'w", "Dn,w", "Dn,A", "STC", "C", "Ctr"],
      unsupported: ["Rw", "DnT,w", "DnT,A"]
    }
  },
  {
    presetId: "timber_stud_wall",
    contextMode: "building_prediction",
    expected: {
      c: 0.8,
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "42 dB" },
        "Dn,w": { status: "live", value: "41 dB" },
        "Dn,A": { status: "live", value: "41.8 dB" },
        "DnT,w": { status: "live", value: "44 dB" },
        "DnT,A": { status: "live", value: "44.3 dB" },
        STC: { status: "live", value: "42 dB" },
        C: { status: "live", value: "+0.8 dB" },
        Ctr: { status: "live", value: "-4 dB" }
      },
      ctr: -4,
      dnA: 41.8,
      dnTA: 44.3,
      dnTw: 44,
      dnW: 41,
      rw: 42,
      rwPrime: 42,
      supported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"],
      unsupported: ["Rw"]
    }
  },
  {
    presetId: "light_steel_stud_wall",
    contextMode: "element_lab",
    expected: {
      c: -1.5,
      cards: {
        Rw: { status: "live", value: "55 dB" },
        "R'w": { status: "needs_input", value: "Not ready" },
        "Dn,w": { status: "needs_input", value: "Not ready" },
        "Dn,A": { status: "needs_input", value: "Not ready" },
        "DnT,w": { status: "needs_input", value: "Not ready" },
        "DnT,A": { status: "needs_input", value: "Not ready" },
        STC: { status: "live", value: "55 dB" },
        C: { status: "live", value: "-1.5 dB" },
        Ctr: { status: "live", value: "-6.4 dB" }
      },
      ctr: -6.4,
      dnA: null,
      dnTA: null,
      dnTw: null,
      dnW: null,
      rw: 55,
      rwPrime: null,
      supported: ["Rw", "STC", "C", "Ctr"],
      unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]
    }
  },
  {
    presetId: "light_steel_stud_wall",
    contextMode: "field_between_rooms",
    expected: {
      c: -1.5,
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "48 dB" },
        "Dn,w": { status: "live", value: "47 dB" },
        "Dn,A": { status: "live", value: "45.5 dB" },
        "DnT,w": { status: "needs_input", value: "Not ready" },
        "DnT,A": { status: "needs_input", value: "Not ready" },
        STC: { status: "live", value: "48 dB" },
        C: { status: "live", value: "-1.5 dB" },
        Ctr: { status: "live", value: "-6.4 dB" }
      },
      ctr: -6.4,
      dnA: 45.5,
      dnTA: null,
      dnTw: null,
      dnW: 47,
      rw: 48,
      rwPrime: 48,
      supported: ["R'w", "Dn,w", "Dn,A", "STC", "C", "Ctr"],
      unsupported: ["Rw", "DnT,w", "DnT,A"]
    }
  },
  {
    presetId: "light_steel_stud_wall",
    contextMode: "building_prediction",
    expected: {
      c: -1.5,
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "48 dB" },
        "Dn,w": { status: "live", value: "47 dB" },
        "Dn,A": { status: "live", value: "45.5 dB" },
        "DnT,w": { status: "live", value: "49 dB" },
        "DnT,A": { status: "live", value: "48 dB" },
        STC: { status: "live", value: "48 dB" },
        C: { status: "live", value: "-1.5 dB" },
        Ctr: { status: "live", value: "-6.4 dB" }
      },
      ctr: -6.4,
      dnA: 45.5,
      dnTA: 48,
      dnTw: 49,
      dnW: 47,
      rw: 48,
      rwPrime: 48,
      supported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"],
      unsupported: ["Rw"]
    }
  }
];

describe("wall live dynamic preset route card matrix", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps the live timber preset route on the dynamic framed-wall surface instead of the screening seed", async () => {
    const live = await evaluateLiveWorkbenchPreset({
      contextMode: "element_lab",
      presetId: "timber_stud_wall"
    });
    const timberPreset = getPresetById("timber_stud_wall");
    const screening = evaluateScenario({
      airborneContext: live.airborneContext,
      calculator: null,
      id: "timber-screening-control",
      name: timberPreset.label,
      rows: live.state.rows,
      source: "current",
      studyMode: "wall",
      targetOutputs: WALL_OUTPUTS
    });

    expect(live.state.calculatorId, "live store calculator").toBe("dynamic");
    expect(live.state.airborneStudType, "preset stud type").toBe("wood_stud");
    expect(live.state.airborneConnectionType, "preset connection type").toBe("line_connection");
    expect(live.state.airborneStudSpacingMm, "preset stud spacing").toBe("600");
    expect(live.state.airborneResilientBarSideCount, "preset resilient bar side count").toBe("auto");
    expect(live.airborneContext.resilientBarSideCount, "live context resilient bar side count").toBe("auto");

    expect(live.result.calculatorId, "live result calculator").toBe("dynamic");
    expect(live.result.ratings.iso717?.Rw, "live timber lab Rw").toBe(50);
    expect(live.branch.value, "live timber branch value").toBe("Stud Wall Surrogate");

    expect(screening.result, "screening control result").not.toBeNull();
    expect(screening.result?.calculatorId ?? null, "screening control calculator").toBeNull();
    expect(screening.result?.ratings.iso717?.Rw, "screening control Rw").toBe(31);
    expect(
      screening.warnings.some((warning) => /Screening estimate only/i.test(warning)),
      "screening control warnings"
    ).toBe(true);
  });

  it.each(LIVE_CASES)(
    "$presetId $contextMode keeps the user-visible dynamic branch and output cards pinned",
    async (testCase) => {
      const evaluated = await evaluateLiveWorkbenchPreset({
        contextMode: testCase.contextMode,
        presetId: testCase.presetId
      });

      expect(evaluated.result.calculatorId, `${testCase.presetId} ${testCase.contextMode} calculator`).toBe("dynamic");
      expect(evaluated.result.ratings.iso717?.Rw ?? null, `${testCase.presetId} ${testCase.contextMode} Rw`).toBe(
        testCase.expected.rw
      );
      expect(
        evaluated.result.ratings.field?.RwPrime ??
          (evaluated.result.ratings.iso717 as { RwPrime?: number } | undefined)?.RwPrime ??
          null,
        `${testCase.presetId} ${testCase.contextMode} R'w`
      ).toBe(testCase.expected.rwPrime);
      expect(evaluated.result.ratings.field?.DnW ?? null, `${testCase.presetId} ${testCase.contextMode} Dn,w`).toBe(
        testCase.expected.dnW
      );
      expect(evaluated.result.ratings.field?.DnA ?? null, `${testCase.presetId} ${testCase.contextMode} Dn,A`).toBe(
        testCase.expected.dnA
      );
      expect(evaluated.result.ratings.field?.DnTw ?? null, `${testCase.presetId} ${testCase.contextMode} DnT,w`).toBe(
        testCase.expected.dnTw
      );
      expect(evaluated.result.ratings.field?.DnTA ?? null, `${testCase.presetId} ${testCase.contextMode} DnT,A`).toBe(
        testCase.expected.dnTA
      );
      expect(evaluated.result.ratings.iso717?.C ?? null, `${testCase.presetId} ${testCase.contextMode} C`).toBe(
        testCase.expected.c
      );
      expect(evaluated.result.ratings.iso717?.Ctr ?? null, `${testCase.presetId} ${testCase.contextMode} Ctr`).toBe(
        testCase.expected.ctr
      );
      expect(evaluated.result.supportedTargetOutputs, `${testCase.presetId} ${testCase.contextMode} supported`).toEqual(
        testCase.expected.supported
      );
      expect(
        evaluated.result.unsupportedTargetOutputs,
        `${testCase.presetId} ${testCase.contextMode} unsupported`
      ).toEqual(testCase.expected.unsupported);

      expect(evaluated.branch.value, `${testCase.presetId} ${testCase.contextMode} branch value`).toBe(
        "Stud Wall Surrogate"
      );
      expect(evaluated.branch.tone, `${testCase.presetId} ${testCase.contextMode} branch tone`).toBe("warning");
      expect(
        evaluated.branch.detail,
        `${testCase.presetId} ${testCase.contextMode} branch strategy`
      ).toMatch(/stud surrogate blend\+framed wall calibration/i);
      expect(
        evaluated.branch.detail,
        `${testCase.presetId} ${testCase.contextMode} branch boundary`
      ).toMatch(/ambiguous boundary with Double Leaf/i);

      for (const output of WALL_OUTPUTS) {
        const card = evaluated.cards.get(output);

        expect(card, `${testCase.presetId} ${testCase.contextMode} ${output} card`).toBeTruthy();
        expect(card?.status, `${testCase.presetId} ${testCase.contextMode} ${output} status`).toBe(
          testCase.expected.cards[output].status
        );
        expect(card?.value, `${testCase.presetId} ${testCase.contextMode} ${output} value`).toBe(
          testCase.expected.cards[output].value
        );
      }
    }
  );
});
