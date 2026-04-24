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

  it("keeps the shared airborne context schema side-count-blind in Gate A", () => {
    const parsedKnownFields = AirborneContextSchema.parse({
      connectionType: "resilient_channel",
      contextMode: "element_lab",
      studSpacingMm: 600,
      studType: "resilient_stud"
    });
    const parsedWithUnknownField = AirborneContextSchema.parse({
      connectionType: "resilient_channel",
      contextMode: "element_lab",
      resilientBarSideCount: "both_sides",
      studSpacingMm: 600,
      studType: "resilient_stud"
    });

    expect(parsedKnownFields).toEqual({
      connectionType: "resilient_channel",
      contextMode: "element_lab",
      studSpacingMm: 600,
      studType: "resilient_stud"
    });
    expect(parsedWithUnknownField).toEqual(parsedKnownFields);
    expect(Object.keys(parsedKnownFields)).toEqual(
      expect.arrayContaining(["connectionType", "contextMode", "studSpacingMm", "studType"])
    );
    expect(Object.keys(parsedWithUnknownField)).not.toContain("resilientBarSideCount");
  });

  it("keeps the workbench store limited to connection type, stud type, and stud spacing", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");

    const state = useWorkbenchStore.getState();

    expect("airborneConnectionType" in state).toBe(true);
    expect("airborneStudType" in state).toBe(true);
    expect("airborneStudSpacingMm" in state).toBe(true);
    expect("airborneResilientBarSideCount" in state).toBe(false);
    expect("setAirborneResilientBarSideCount" in state).toBe(false);

    useWorkbenchStore.getState().loadPreset("timber_stud_wall");

    const loadedState = useWorkbenchStore.getState();

    expect(loadedState.airborneConnectionType).toBe("line_connection");
    expect(loadedState.airborneStudType).toBe("wood_stud");
    expect(loadedState.airborneStudSpacingMm).toBe("600");
    expect("airborneResilientBarSideCount" in loadedState).toBe(false);
  });
});
