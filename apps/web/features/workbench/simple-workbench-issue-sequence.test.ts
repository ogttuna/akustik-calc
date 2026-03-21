import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildSimpleWorkbenchSequencedReference,
  readSimpleWorkbenchIssueSequence,
  reserveSimpleWorkbenchIssueSequence
} from "./simple-workbench-issue-sequence";

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

describe("simple workbench issue sequence", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createMemoryStorage());
    vi.stubGlobal("window", { localStorage });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("builds zero-padded sequence references", () => {
    expect(buildSimpleWorkbenchSequencedReference("MAC-RR-20260321", 1)).toBe("MAC-RR-20260321-01");
    expect(buildSimpleWorkbenchSequencedReference("MAC-RR-20260321", 12)).toBe("MAC-RR-20260321-12");
  });

  it("starts a new stem at sequence 01 and advances after reservation", () => {
    const initial = readSimpleWorkbenchIssueSequence("MAC-RR-20260321");
    expect(initial.nextReference).toBe("MAC-RR-20260321-01");
    expect(initial.lastIssuedReference).toBeNull();
    expect(initial.history).toHaveLength(0);

    const firstReservation = reserveSimpleWorkbenchIssueSequence("MAC-RR-20260321");
    expect(firstReservation.reservedReference).toBe("MAC-RR-20260321-01");
    expect(firstReservation.nextReference).toBe("MAC-RR-20260321-02");
    expect(firstReservation.history[0]?.reference).toBe("MAC-RR-20260321-01");

    const secondRead = readSimpleWorkbenchIssueSequence("MAC-RR-20260321");
    expect(secondRead.lastIssuedReference).toBe("MAC-RR-20260321-01");
    expect(secondRead.nextReference).toBe("MAC-RR-20260321-02");
    expect(secondRead.history).toHaveLength(1);
  });

  it("keeps separate stems on independent counters", () => {
    reserveSimpleWorkbenchIssueSequence("MAC-RR-20260321");
    reserveSimpleWorkbenchIssueSequence("MAC-RR-20260321");
    reserveSimpleWorkbenchIssueSequence("MAC-HQ-20260321");

    expect(readSimpleWorkbenchIssueSequence("MAC-RR-20260321").nextReference).toBe("MAC-RR-20260321-03");
    expect(readSimpleWorkbenchIssueSequence("MAC-HQ-20260321").nextReference).toBe("MAC-HQ-20260321-02");
    expect(readSimpleWorkbenchIssueSequence("MAC-RR-20260321").history).toHaveLength(2);
    expect(readSimpleWorkbenchIssueSequence("MAC-HQ-20260321").history).toHaveLength(1);
  });
});
