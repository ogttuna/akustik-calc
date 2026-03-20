import { describe, expect, it } from "vitest";

import { deriveGuidedRouteSignals } from "./guided-route-signals";

describe("deriveGuidedRouteSignals", () => {
  it("asks for the first layer when the stack is empty", () => {
    const signals = deriveGuidedRouteSignals({
      missingFloorRoleCount: 0,
      primaryReadyCard: null,
      rowsLength: 0,
      studyMode: "floor",
      validationPosture: "inactive",
      validThicknessCount: 0,
      warningCount: 0
    });

    expect(signals.nextAction.value).toBe("Add the first layer");
    expect(signals.stackStatus.value).toBe("Waiting for layers");
    expect(signals.primaryRead.value).toBe("Primary read pending");
  });

  it("prioritizes missing thickness over later guidance", () => {
    const signals = deriveGuidedRouteSignals({
      missingFloorRoleCount: 0,
      primaryReadyCard: { label: "Ln,w", value: "62.5 dB" },
      rowsLength: 5,
      studyMode: "floor",
      validationPosture: "estimate",
      validThicknessCount: 4,
      warningCount: 2
    });

    expect(signals.nextAction.value).toBe("Finish thickness");
    expect(signals.stackStatus.tone).toBe("warning");
  });

  it("asks for floor roles before warning review when floor rows are unassigned", () => {
    const signals = deriveGuidedRouteSignals({
      missingFloorRoleCount: 2,
      primaryReadyCard: { label: "Ln,w", value: "62.5 dB" },
      rowsLength: 4,
      studyMode: "floor",
      validationPosture: "estimate",
      validThicknessCount: 4,
      warningCount: 3
    });

    expect(signals.nextAction.value).toBe("Tag floor roles");
  });

  it("routes to warning review when the stack is otherwise ready", () => {
    const signals = deriveGuidedRouteSignals({
      missingFloorRoleCount: 0,
      primaryReadyCard: { label: "Rw", value: "57 dB" },
      rowsLength: 4,
      studyMode: "wall",
      validationPosture: "estimate",
      validThicknessCount: 4,
      warningCount: 4
    });

    expect(signals.nextAction.value).toBe("Review warnings");
    expect(signals.primaryRead.value).toBe("Rw ready");
  });

  it("lets the operator read outputs when the route is clean and live", () => {
    const signals = deriveGuidedRouteSignals({
      missingFloorRoleCount: 0,
      primaryReadyCard: { label: "Rw", value: "58 dB" },
      rowsLength: 4,
      studyMode: "wall",
      validationPosture: "estimate",
      validThicknessCount: 4,
      warningCount: 0
    });

    expect(signals.nextAction.value).toBe("Read the outputs");
    expect(signals.nextAction.tone).toBe("ready");
  });

  it("keeps route-input guidance when the stack is ready but no lead read exists yet", () => {
    const signals = deriveGuidedRouteSignals({
      missingFloorRoleCount: 0,
      primaryReadyCard: null,
      rowsLength: 4,
      studyMode: "wall",
      validationPosture: "inactive",
      validThicknessCount: 4,
      warningCount: 0
    });

    expect(signals.nextAction.value).toBe("Add route inputs");
  });

  it("keeps bound lanes on evidence-tightening instead of a read-the-outputs prompt", () => {
    const signals = deriveGuidedRouteSignals({
      missingFloorRoleCount: 0,
      primaryReadyCard: { label: "Ln,w", value: "<= 58 dB" },
      rowsLength: 4,
      studyMode: "floor",
      validationPosture: "bound",
      validThicknessCount: 4,
      warningCount: 2
    });

    expect(signals.nextAction.value).toBe("Prefer exact evidence");
    expect(signals.nextAction.tone).toBe("warning");
  });

  it("uses a more specific next action when a bound lane still needs its support form fixed", () => {
    const signals = deriveGuidedRouteSignals({
      missingFloorRoleCount: 0,
      primaryReadyCard: { label: "Ln,w", value: "<= 51 dB" },
      rowsLength: 6,
      studyMode: "floor",
      topologyGap: {
        detail: "This lightweight-steel bound lane is still conservative because the live stack leaves the carrier open between steel joist / purlin and open-web / rolled steel.",
        value: "Fix support form"
      },
      validationPosture: "bound",
      validThicknessCount: 6,
      warningCount: 0
    });

    expect(signals.nextAction.value).toBe("Fix support form");
    expect(signals.nextAction.detail).toContain("open-web / rolled steel");
    expect(signals.nextAction.tone).toBe("warning");
  });

  it("keeps low-confidence lanes on topology tightening instead of a read-the-outputs prompt", () => {
    const signals = deriveGuidedRouteSignals({
      missingFloorRoleCount: 0,
      primaryReadyCard: { label: "Ln,w", value: "61 dB" },
      rowsLength: 4,
      studyMode: "floor",
      validationPosture: "low_confidence",
      validThicknessCount: 4,
      warningCount: 1
    });

    expect(signals.nextAction.value).toBe("Narrow the topology");
    expect(signals.nextAction.tone).toBe("warning");
  });

  it("uses a more specific next action when the topology gap is already known", () => {
    const signals = deriveGuidedRouteSignals({
      missingFloorRoleCount: 0,
      primaryReadyCard: { label: "Ln,w", value: "70.4 dB" },
      rowsLength: 2,
      studyMode: "floor",
      topologyGap: {
        detail: "Add the ceiling board row and choose whether it sits direct to the joists or on furring channels.",
        value: "Add the ceiling package"
      },
      validationPosture: "low_confidence",
      validThicknessCount: 2,
      warningCount: 0
    });

    expect(signals.nextAction.value).toBe("Add the ceiling package");
    expect(signals.nextAction.detail).toContain("ceiling board row");
    expect(signals.nextAction.tone).toBe("warning");
  });
});
