import { beforeEach, describe, expect, it, vi } from "vitest";

import { AirborneContextSchema } from "@dynecho/shared";

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

describe("wall resilient-bar side-count input contract", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  it("accepts explicit resilient-bar side count in the shared airborne context schema", () => {
    const parsed = AirborneContextSchema.parse({
      connectionType: "resilient_channel",
      contextMode: "element_lab",
      resilientBarSideCount: "both_sides",
      studSpacingMm: 600,
      studType: "resilient_stud"
    });

    expect(parsed).toEqual({
      connectionType: "resilient_channel",
      contextMode: "element_lab",
      resilientBarSideCount: "both_sides",
      studSpacingMm: 600,
      studType: "resilient_stud"
    });

    expect(
      AirborneContextSchema.safeParse({
        resilientBarSideCount: "not_a_side_count"
      }).success
    ).toBe(false);
  });

  it("persists resilient-bar side count through the workbench store without preset-invented defaults", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");

    const state = useWorkbenchStore.getState();

    expect("airborneConnectionType" in state).toBe(true);
    expect("airborneStudType" in state).toBe(true);
    expect("airborneStudSpacingMm" in state).toBe(true);
    expect(state.airborneResilientBarSideCount).toBe("auto");
    expect("setAirborneResilientBarSideCount" in state).toBe(true);

    useWorkbenchStore.getState().loadPreset("timber_stud_wall");
    expect(useWorkbenchStore.getState().airborneResilientBarSideCount).toBe("auto");

    useWorkbenchStore.getState().setAirborneResilientBarSideCount("both_sides");
    expect(useWorkbenchStore.getState().airborneResilientBarSideCount).toBe("both_sides");

    useWorkbenchStore.getState().loadPreset("timber_stud_wall");

    const loadedState = useWorkbenchStore.getState();

    expect(loadedState.airborneConnectionType).toBe("line_connection");
    expect(loadedState.airborneStudType).toBe("wood_stud");
    expect(loadedState.airborneStudSpacingMm).toBe("600");
    expect(loadedState.airborneResilientBarSideCount).toBe("both_sides");

    useWorkbenchStore.getState().saveCurrentScenario();
    const savedScenarioId = useWorkbenchStore.getState().savedScenarios[0]?.id;

    expect(useWorkbenchStore.getState().savedScenarios[0]?.airborneResilientBarSideCount).toBe("both_sides");

    useWorkbenchStore.getState().setAirborneResilientBarSideCount("one_side");
    useWorkbenchStore.getState().loadSavedScenario(savedScenarioId!);

    expect(useWorkbenchStore.getState().airborneResilientBarSideCount).toBe("both_sides");
  });

  it("defaults legacy scenario snapshots without side count back to auto", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");

    useWorkbenchStore.getState().saveCurrentScenario();
    const scenario = { ...useWorkbenchStore.getState().savedScenarios[0]! };

    delete scenario.airborneResilientBarSideCount;

    useWorkbenchStore.getState().setAirborneResilientBarSideCount("one_side");
    useWorkbenchStore.getState().loadScenarioSnapshot(scenario);

    expect(useWorkbenchStore.getState().airborneResilientBarSideCount).toBe("auto");
  });
});
