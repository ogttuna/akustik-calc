import type { RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const TARGET_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"];

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

function resultSnapshot(result: {
  floorSystemRatings?: { Rw?: number | null } | null;
  impact?: { DeltaLw?: number | null; LnW?: number | null; LnWPlusCI?: number | null } | null;
  supportedTargetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
}) {
  return {
    deltaLw: result.impact?.DeltaLw ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

type ResultSnapshotSource = Parameters<typeof resultSnapshot>[0];

describe("workbench store", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps the same heavy-floor result when the middle layer reaches the same final thickness through different edit paths", async () => {
    const { evaluateScenario } = await import("./scenario-analysis");
    const { useWorkbenchStore } = await import("./workbench-store");

    const evaluateCurrentScenario = () => {
      const state = useWorkbenchStore.getState();
      return evaluateScenario({
        id: "current",
        name: "regression check",
        rows: state.rows,
        source: "current",
        studyMode: state.studyMode,
        targetOutputs: TARGET_OUTPUTS
      });
    };

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().loadPreset("heavy_concrete_impact_floor");

    let screedRowId = useWorkbenchStore.getState().rows.find((row) => row.materialId === "screed")?.id;
    expect(screedRowId).toBeTruthy();

    useWorkbenchStore.getState().updateThickness(screedRowId!, "20");
    useWorkbenchStore.getState().updateThickness(screedRowId!, "100");

    const editedPathResult = evaluateCurrentScenario();
    expect(editedPathResult.result).not.toBeNull();

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().loadPreset("heavy_concrete_impact_floor");

    screedRowId = useWorkbenchStore.getState().rows.find((row) => row.materialId === "screed")?.id;
    expect(screedRowId).toBeTruthy();

    useWorkbenchStore.getState().updateThickness(screedRowId!, "100");

    const directPathResult = evaluateCurrentScenario();
    expect(directPathResult.result).not.toBeNull();

    expect(resultSnapshot(editedPathResult.result as ResultSnapshotSource)).toEqual(
      resultSnapshot(directPathResult.result as ResultSnapshotSource)
    );
  });

  it("keeps the same heavy-floor result when multiple parked rows are interleaved and retagged", async () => {
    const { evaluateScenario } = await import("./scenario-analysis");
    const { useWorkbenchStore } = await import("./workbench-store");

    const evaluateCurrentScenario = () => {
      const state = useWorkbenchStore.getState();
      return evaluateScenario({
        id: "current",
        name: "regression check",
        rows: state.rows,
        source: "current",
        studyMode: state.studyMode,
        targetOutputs: TARGET_OUTPUTS
      });
    };

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().loadPreset("heavy_concrete_impact_floor");

    const baselineResult = evaluateCurrentScenario();
    expect(baselineResult.result).not.toBeNull();

    useWorkbenchStore.getState().addRow();
    useWorkbenchStore.getState().addRow();

    const parkedRowIds = useWorkbenchStore
      .getState()
      .rows.slice(-2)
      .map((row) => row.id);

    expect(parkedRowIds).toHaveLength(2);

    const [leadingParkedRowId, middleParkedRowId] = parkedRowIds;

    useWorkbenchStore.getState().updateThickness(leadingParkedRowId!, "");
    useWorkbenchStore.getState().updateThickness(middleParkedRowId!, "");
    useWorkbenchStore.getState().updateMaterial(leadingParkedRowId!, "screed");
    useWorkbenchStore.getState().updateFloorRole(leadingParkedRowId!, "floating_screed");
    useWorkbenchStore.getState().updateMaterial(middleParkedRowId!, "generic_fill");
    useWorkbenchStore.getState().updateFloorRole(middleParkedRowId!, "upper_fill");

    for (let step = 0; step < 6; step += 1) {
      useWorkbenchStore.getState().moveRow(leadingParkedRowId!, "up");
    }

    for (let step = 0; step < 2; step += 1) {
      useWorkbenchStore.getState().moveRow(middleParkedRowId!, "up");
    }

    const interleavedParkedRowsResult = evaluateCurrentScenario();
    expect(interleavedParkedRowsResult.result).not.toBeNull();
    expect(resultSnapshot(interleavedParkedRowsResult.result as ResultSnapshotSource)).toEqual(
      resultSnapshot(baselineResult.result as ResultSnapshotSource)
    );
    expect(interleavedParkedRowsResult.warnings.filter((warning) => /missing a valid thickness/i.test(warning))).toHaveLength(2);
  });

  it("keeps the same heavy-floor result after saving and reloading an assembly with parked rows", async () => {
    const { evaluateScenario } = await import("./scenario-analysis");
    const { useWorkbenchStore } = await import("./workbench-store");

    const evaluateCurrentScenario = () => {
      const state = useWorkbenchStore.getState();
      return evaluateScenario({
        id: "current",
        name: "regression check",
        rows: state.rows,
        source: "current",
        studyMode: state.studyMode,
        targetOutputs: TARGET_OUTPUTS
      });
    };

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().loadPreset("heavy_concrete_impact_floor");

    const baselineResult = evaluateCurrentScenario();
    expect(baselineResult.result).not.toBeNull();

    useWorkbenchStore.getState().addRow();
    const parkedRowId = useWorkbenchStore.getState().rows.at(-1)?.id;
    expect(parkedRowId).toBeTruthy();

    useWorkbenchStore.getState().updateThickness(parkedRowId!, "");
    useWorkbenchStore.getState().updateMaterial(parkedRowId!, "generic_fill");
    useWorkbenchStore.getState().updateFloorRole(parkedRowId!, "upper_fill");

    for (let step = 0; step < 3; step += 1) {
      useWorkbenchStore.getState().moveRow(parkedRowId!, "up");
    }

    const savedBaseline = evaluateCurrentScenario();
    expect(savedBaseline.result).not.toBeNull();
    expect(savedBaseline.warnings.filter((warning) => /missing a valid thickness/i.test(warning))).toHaveLength(1);

    useWorkbenchStore.getState().saveCurrentScenario();
    const savedScenarioId = useWorkbenchStore.getState().savedScenarios[0]?.id;
    expect(savedScenarioId).toBeTruthy();

    useWorkbenchStore.getState().loadPreset("concrete_wall");
    useWorkbenchStore.getState().loadSavedScenario(savedScenarioId!);

    const reloadedResult = evaluateCurrentScenario();
    expect(reloadedResult.result).not.toBeNull();
    expect(resultSnapshot(reloadedResult.result as ResultSnapshotSource)).toEqual(
      resultSnapshot(savedBaseline.result as ResultSnapshotSource)
    );
    expect(reloadedResult.warnings.filter((warning) => /missing a valid thickness/i.test(warning))).toHaveLength(1);
    expect(resultSnapshot(reloadedResult.result as ResultSnapshotSource)).toEqual(
      resultSnapshot(baselineResult.result as ResultSnapshotSource)
    );
  });

  it("restores proposal issue metadata when a saved scenario is reloaded", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().setProjectName("Riverside Residences");
    useWorkbenchStore.getState().setClientName("Machinity Acoustics");
    useWorkbenchStore.getState().setConsultantCompany("Machinity Acoustic Consultants");
    useWorkbenchStore.getState().setConsultantAddress("Maslak District, Istanbul, Turkiye");
    useWorkbenchStore.getState().setConsultantEmail("offers@machinity-acoustics.com");
    useWorkbenchStore.getState().setConsultantPhone("+90 212 000 00 00");
    useWorkbenchStore.getState().setPreparedBy("O. Tuna");
    useWorkbenchStore.getState().setApproverTitle("Lead Acoustic Consultant");
    useWorkbenchStore.getState().setProposalRecipient("Riverside Development Team");
    useWorkbenchStore.getState().setProposalAttention("Design Coordination Team");
    useWorkbenchStore.getState().setProposalReference("MAC-2026-014");
    useWorkbenchStore.getState().setProposalRevision("Rev 01");
    useWorkbenchStore.getState().setProposalSubject("Riverside Residences floor acoustic proposal");
    useWorkbenchStore.getState().setBriefNote("Issue with explicit flanking caveat.");

    useWorkbenchStore.getState().saveCurrentScenario();
    const savedScenarioId = useWorkbenchStore.getState().savedScenarios[0]?.id;
    expect(savedScenarioId).toBeTruthy();

    useWorkbenchStore.getState().setProjectName("Other project");
    useWorkbenchStore.getState().setClientName("Other client");
    useWorkbenchStore.getState().setConsultantCompany("Other consultant");
    useWorkbenchStore.getState().setConsultantAddress("Other office");
    useWorkbenchStore.getState().setConsultantEmail("other@example.com");
    useWorkbenchStore.getState().setConsultantPhone("+90 000 000 00 00");
    useWorkbenchStore.getState().setPreparedBy("Other author");
    useWorkbenchStore.getState().setApproverTitle("Other title");
    useWorkbenchStore.getState().setProposalRecipient("Other recipient");
    useWorkbenchStore.getState().setProposalAttention("Other attention");
    useWorkbenchStore.getState().setProposalReference("OTHER-001");
    useWorkbenchStore.getState().setProposalRevision("Rev 99");
    useWorkbenchStore.getState().setProposalSubject("Other subject");
    useWorkbenchStore.getState().setBriefNote("Other note");

    useWorkbenchStore.getState().loadSavedScenario(savedScenarioId!);

    const reloadedState = useWorkbenchStore.getState();
    expect(reloadedState.projectName).toBe("Riverside Residences");
    expect(reloadedState.clientName).toBe("Machinity Acoustics");
    expect(reloadedState.consultantCompany).toBe("Machinity Acoustic Consultants");
    expect(reloadedState.consultantAddress).toBe("Maslak District, Istanbul, Turkiye");
    expect(reloadedState.consultantEmail).toBe("offers@machinity-acoustics.com");
    expect(reloadedState.consultantPhone).toBe("+90 212 000 00 00");
    expect(reloadedState.preparedBy).toBe("O. Tuna");
    expect(reloadedState.approverTitle).toBe("Lead Acoustic Consultant");
    expect(reloadedState.proposalRecipient).toBe("Riverside Development Team");
    expect(reloadedState.proposalAttention).toBe("Design Coordination Team");
    expect(reloadedState.proposalReference).toBe("MAC-2026-014");
    expect(reloadedState.proposalRevision).toBe("Rev 01");
    expect(reloadedState.proposalSubject).toBe("Riverside Residences floor acoustic proposal");
    expect(reloadedState.briefNote).toBe("Issue with explicit flanking caveat.");
  });

  it("keeps the same heavy-floor result when one live layer is split into adjacent identical rows", async () => {
    const { evaluateScenario } = await import("./scenario-analysis");
    const { useWorkbenchStore } = await import("./workbench-store");

    const evaluateCurrentScenario = () => {
      const state = useWorkbenchStore.getState();
      return evaluateScenario({
        id: "current",
        name: "regression check",
        rows: state.rows,
        source: "current",
        studyMode: state.studyMode,
        targetOutputs: TARGET_OUTPUTS
      });
    };

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().loadPreset("heavy_concrete_impact_floor");

    const screedRowId = useWorkbenchStore.getState().rows.find((row) => row.materialId === "screed")?.id;
    expect(screedRowId).toBeTruthy();

    useWorkbenchStore.getState().updateThickness(screedRowId!, "100");
    const mergedScenario = evaluateCurrentScenario();
    expect(mergedScenario.result).not.toBeNull();

    useWorkbenchStore.getState().addRow();
    const splitRowId = useWorkbenchStore.getState().rows.at(-1)?.id;
    expect(splitRowId).toBeTruthy();

    useWorkbenchStore.getState().updateMaterial(splitRowId!, "screed");
    useWorkbenchStore.getState().updateFloorRole(splitRowId!, "floating_screed");
    useWorkbenchStore.getState().updateThickness(splitRowId!, "40");
    useWorkbenchStore.getState().updateThickness(screedRowId!, "60");

    for (let step = 0; step < 2; step += 1) {
      useWorkbenchStore.getState().moveRow(splitRowId!, "up");
    }

    const splitScenario = evaluateCurrentScenario();
    expect(splitScenario.result).not.toBeNull();
    expect(resultSnapshot(splitScenario.result as ResultSnapshotSource)).toEqual(
      resultSnapshot(mergedScenario.result as ResultSnapshotSource)
    );
  });
});
