import type { RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const FLOOR_TARGET_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w"];
const WALL_TARGET_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "STC", "C", "Ctr", "R'w", "Dn,w", "DnT,w"];
const SINGLE_ENTRY_ROLE_SPLIT_PREFERENCE = [
  "floor_covering",
  "resilient_layer",
  "upper_fill",
  "floating_screed",
  "ceiling_cavity",
  "ceiling_fill",
  "base_structure"
] as const;
const PUBLISHED_FLOOR_AMBIGUITY_PRESET_IDS = [
  "knauf_acoustic_mount_exact",
  "dataholz_dry_floor_exact",
  "hollow_core_vinyl_exact",
  "knauf_concrete_exact",
  "ubiq_open_web_300_bound",
  "ubiq_steel_200_unspecified_bound",
  "ubiq_steel_300_unspecified_bound"
] as const;

const EDIT_PATH_PARITY_CASES = [
  {
    finalThickness: "100",
    interimThickness: "20",
    presetId: "heavy_concrete_impact_floor",
    rowMatch: { floorRole: "floating_screed", materialId: "screed" }
  },
  {
    finalThickness: "180",
    interimThickness: "140",
    presetId: "dataholz_clt_dry_exact",
    rowMatch: { floorRole: "base_structure", materialId: "clt_panel" }
  },
  {
    finalThickness: "140",
    interimThickness: "60",
    presetId: "steel_suspended_fallback",
    rowMatch: { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling" }
  },
  {
    finalThickness: "260",
    interimThickness: "200",
    presetId: "timber_bare_impact_only_fallback",
    rowMatch: { floorRole: "base_structure", materialId: "timber_joist_floor" }
  },
  {
    finalThickness: "90",
    interimThickness: "25",
    presetId: "concrete_wall",
    rowMatch: { materialId: "rockwool" }
  }
] as const;

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
  boundFloorSystemMatch?: { system?: { id?: string | null } | null } | null;
  floorSystemEstimate?: { impact?: { basis?: string | null } | null; kind?: string | null } | null;
  floorSystemMatch?: { system?: { id?: string | null } | null } | null;
  floorSystemRatings?: { Rw?: number | null } | null;
  impact?: {
    DeltaLw?: number | null;
    LPrimeNT50?: number | null;
    LPrimeNTw?: number | null;
    LPrimeNW?: number | null;
    LnW?: number | null;
    LnWPlusCI?: number | null;
    basis?: string | null;
  } | null;
  metrics?: {
    estimatedDnADb?: number | null;
    estimatedDnTADb?: number | null;
    estimatedDnTwDb?: number | null;
    estimatedDnWDb?: number | null;
    estimatedRwDb?: number | null;
    estimatedRwPrimeDb?: number | null;
  } | null;
  supportedTargetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
}) {
  return {
    boundFloorSystemMatchId: result.boundFloorSystemMatch?.system?.id ?? null,
    deltaLw: result.impact?.DeltaLw ?? null,
    dnA: result.metrics?.estimatedDnADb ?? null,
    dnTA: result.metrics?.estimatedDnTADb ?? null,
    dnTw: result.metrics?.estimatedDnTwDb ?? null,
    dnW: result.metrics?.estimatedDnWDb ?? null,
    floorSystemEstimateBasis: result.floorSystemEstimate?.impact?.basis ?? null,
    floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system?.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    lPrimeNT50: result.impact?.LPrimeNT50 ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    rwDb: result.metrics?.estimatedRwDb ?? null,
    rwPrimeDb: result.metrics?.estimatedRwPrimeDb ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

type ResultSnapshotSource = Parameters<typeof resultSnapshot>[0];

function evaluatedScenarioSnapshot(input: {
  result: ResultSnapshotSource | null;
  warnings: readonly string[];
}) {
  return {
    result: input.result ? resultSnapshot(input.result) : null,
    warnings: [...input.warnings]
  };
}

function formatThicknessMm(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1).replace(/\.0$/u, "");
}

function buildShiftedThicknessPath(thicknessMm: string, rowIndex: number) {
  const baseThickness = Number.parseFloat(thicknessMm);

  if (!Number.isFinite(baseThickness)) {
    throw new Error(`Cannot build thickness path for non-numeric thickness "${thicknessMm}".`);
  }

  const delta = Math.max(1, Math.min(25, Math.round(baseThickness * 0.15)));
  const finalThickness = formatThicknessMm(baseThickness + delta);
  const interimCandidate = rowIndex % 2 === 0 ? Math.max(0.5, baseThickness - delta / 2) : baseThickness + delta / 2;
  const interimThickness = formatThicknessMm(interimCandidate === baseThickness + delta ? baseThickness : interimCandidate);

  return {
    finalThickness,
    interimThickness: interimThickness === finalThickness ? formatThicknessMm(baseThickness) : interimThickness
  };
}

function moveCurrentRowToIndex(useWorkbenchStore: {
  getState: () => {
    moveRow: (id: string, direction: "up" | "down") => void;
    rows: Array<{ id: string }>;
  };
}, rowId: string, targetIndex: number) {
  while (true) {
    const currentIndex = useWorkbenchStore.getState().rows.findIndex((row) => row.id === rowId);

    expect(currentIndex).toBeGreaterThanOrEqual(0);

    if (currentIndex === targetIndex) {
      return;
    }

    useWorkbenchStore.getState().moveRow(rowId, currentIndex > targetIndex ? "up" : "down");
  }
}

function resolveSingleEntrySplitCandidate(
  rows: Array<{ floorRole?: string; id: string; materialId: string; thicknessMm: string }>
) {
  for (const role of SINGLE_ENTRY_ROLE_SPLIT_PREFERENCE) {
    const roleIndices = rows.flatMap((row, index) => (row.floorRole === role ? [index] : []));
    if (roleIndices.length !== 1) {
      continue;
    }

    const index = roleIndices[0]!;
    const nextDifferentRoleIndex = rows.findIndex((row, rowIndex) => rowIndex > index && row.floorRole !== role);
    if (nextDifferentRoleIndex === -1) {
      continue;
    }

    return {
      nextDifferentRoleIndex,
      role,
      row: rows[index]!
    };
  }

  return null;
}

describe("workbench store", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("resets back onto the active preset lane instead of jumping across study modes", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");

    useWorkbenchStore.getState().loadPreset("heavy_concrete_impact_floor");

    const floorScreedRow = useWorkbenchStore
      .getState()
      .rows.find((row) => row.materialId === "screed" && row.floorRole === "floating_screed");

    expect(floorScreedRow).toBeTruthy();

    useWorkbenchStore.getState().updateThickness(floorScreedRow!.id, "125");
    useWorkbenchStore.getState().reset();

    let state = useWorkbenchStore.getState();

    expect(state.studyMode).toBe("floor");
    expect(state.activePresetId).toBe("heavy_concrete_impact_floor");
    expect(state.rows.map((row) => `${row.materialId}:${row.thicknessMm}`)).toEqual([
      "ceramic_tile:8",
      "screed:50",
      "generic_resilient_underlay:8",
      "concrete:150"
    ]);

    useWorkbenchStore.getState().loadPreset("concrete_wall");

    const wallWoolRow = useWorkbenchStore.getState().rows.find((row) => row.materialId === "rockwool");

    expect(wallWoolRow).toBeTruthy();

    useWorkbenchStore.getState().updateThickness(wallWoolRow!.id, "90");
    useWorkbenchStore.getState().reset();

    state = useWorkbenchStore.getState();

    expect(state.studyMode).toBe("wall");
    expect(state.activePresetId).toBe("concrete_wall");
    expect(state.rows.map((row) => `${row.materialId}:${row.thicknessMm}`)).toEqual([
      "gypsum_board:12.5",
      "rockwool:50",
      "air_gap:50",
      "concrete:100"
    ]);
  });

  it("keeps representative wall and floor presets stable when the same final thickness is reached through different edit paths", async () => {
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
        targetOutputs: state.studyMode === "floor" ? FLOOR_TARGET_OUTPUTS : WALL_TARGET_OUTPUTS
      });
    };

    const resolveRowId = (testCase: (typeof EDIT_PATH_PARITY_CASES)[number]) => {
      const matchingRows = useWorkbenchStore
        .getState()
        .rows.filter(
          (row) =>
            row.materialId === testCase.rowMatch.materialId &&
            ("floorRole" in testCase.rowMatch ? row.floorRole === testCase.rowMatch.floorRole : true)
        );
      const row = matchingRows[0];

      expect(row).toBeTruthy();

      return row!.id;
    };

    const failures: string[] = [];

    for (const testCase of EDIT_PATH_PARITY_CASES) {
      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().loadPreset(testCase.presetId);

      let rowId = resolveRowId(testCase);
      useWorkbenchStore.getState().updateThickness(rowId, testCase.interimThickness);
      useWorkbenchStore.getState().updateThickness(rowId, testCase.finalThickness);

      const editedPathResult = evaluateCurrentScenario();

      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().loadPreset(testCase.presetId);

      rowId = resolveRowId(testCase);
      useWorkbenchStore.getState().updateThickness(rowId, testCase.finalThickness);

      const directPathResult = evaluateCurrentScenario();

      expect(editedPathResult.result).not.toBeNull();
      expect(directPathResult.result).not.toBeNull();

      const editedSnapshot = resultSnapshot(editedPathResult.result as ResultSnapshotSource);
      const directSnapshot = resultSnapshot(directPathResult.result as ResultSnapshotSource);

      if (JSON.stringify(editedSnapshot) !== JSON.stringify(directSnapshot)) {
        failures.push(
          `${testCase.presetId}: edited=${JSON.stringify(editedSnapshot)} direct=${JSON.stringify(directSnapshot)}`
        );
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps every preset stable when all rows land on the same final thicknesses through stepped and direct edit paths", async () => {
    const { evaluateScenario } = await import("./scenario-analysis");
    const { WORKBENCH_PRESETS } = await import("./preset-definitions");
    const { useWorkbenchStore } = await import("./workbench-store");

    const evaluateCurrentScenario = () => {
      const state = useWorkbenchStore.getState();

      return evaluateScenario({
        id: "current",
        name: "full-stack parity sweep",
        rows: state.rows,
        source: "current",
        studyMode: state.studyMode,
        targetOutputs: state.studyMode === "floor" ? FLOOR_TARGET_OUTPUTS : WALL_TARGET_OUTPUTS
      });
    };

    const failures: string[] = [];

    for (const preset of WORKBENCH_PRESETS) {
      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().loadPreset(preset.id);

      const editedRows = useWorkbenchStore.getState().rows;
      const thicknessTargets = editedRows.map((row, rowIndex) => ({
        id: row.id,
        ...buildShiftedThicknessPath(row.thicknessMm, rowIndex)
      }));

      for (const target of thicknessTargets) {
        useWorkbenchStore.getState().updateThickness(target.id, target.interimThickness);
      }

      for (const target of thicknessTargets) {
        useWorkbenchStore.getState().updateThickness(target.id, target.finalThickness);
      }

      const editedPathScenario = evaluateCurrentScenario();

      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().loadPreset(preset.id);

      const directRows = useWorkbenchStore.getState().rows;
      directRows.forEach((row, rowIndex) => {
        useWorkbenchStore.getState().updateThickness(row.id, thicknessTargets[rowIndex]!.finalThickness);
      });

      const directPathScenario = evaluateCurrentScenario();
      const editedSnapshot = evaluatedScenarioSnapshot({
        result: editedPathScenario.result as ResultSnapshotSource | null,
        warnings: editedPathScenario.warnings
      });
      const directSnapshot = evaluatedScenarioSnapshot({
        result: directPathScenario.result as ResultSnapshotSource | null,
        warnings: directPathScenario.warnings
      });

      if (JSON.stringify(editedSnapshot) !== JSON.stringify(directSnapshot)) {
        failures.push(`${preset.id}: edited=${JSON.stringify(editedSnapshot)} direct=${JSON.stringify(directSnapshot)}`);
      }
    }

    expect(failures).toEqual([]);
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
        targetOutputs: FLOOR_TARGET_OUTPUTS
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
        targetOutputs: FLOOR_TARGET_OUTPUTS
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
        targetOutputs: FLOOR_TARGET_OUTPUTS
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
    useWorkbenchStore.getState().setConsultantLogoDataUrl("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'></svg>");
    useWorkbenchStore.getState().setConsultantPhone("+90 212 000 00 00");
    useWorkbenchStore.getState().setConsultantWordmarkLine("Building Acoustics and Vibration Control");
    useWorkbenchStore.getState().setPreparedBy("O. Tuna");
    useWorkbenchStore.getState().setProposalIssueCodePrefix("MAC");
    useWorkbenchStore.getState().setApproverTitle("Lead Acoustic Consultant");
    useWorkbenchStore.getState().setProposalIssuePurpose("Client review and acoustic coordination");
    useWorkbenchStore.getState().setProposalRecipient("Riverside Development Team");
    useWorkbenchStore.getState().setProposalAttention("Design Coordination Team");
    useWorkbenchStore.getState().setProposalReference("MAC-2026-014");
    useWorkbenchStore.getState().setProposalRevision("Rev 01");
    useWorkbenchStore.getState().setProposalSubject("Riverside Residences floor acoustic proposal");
    useWorkbenchStore.getState().setProposalValidityNote("Valid for 30 calendar days unless superseded by a later issue.");
    useWorkbenchStore.getState().setReportProfile("developer");
    useWorkbenchStore.getState().setBriefNote("Issue with explicit flanking caveat.");

    useWorkbenchStore.getState().saveCurrentScenario();
    const savedScenarioId = useWorkbenchStore.getState().savedScenarios[0]?.id;
    expect(savedScenarioId).toBeTruthy();

    useWorkbenchStore.getState().setProjectName("Other project");
    useWorkbenchStore.getState().setClientName("Other client");
    useWorkbenchStore.getState().setConsultantCompany("Other consultant");
    useWorkbenchStore.getState().setConsultantAddress("Other office");
    useWorkbenchStore.getState().setConsultantEmail("other@example.com");
    useWorkbenchStore.getState().setConsultantLogoDataUrl("");
    useWorkbenchStore.getState().setConsultantPhone("+90 000 000 00 00");
    useWorkbenchStore.getState().setConsultantWordmarkLine("Other wordmark");
    useWorkbenchStore.getState().setPreparedBy("Other author");
    useWorkbenchStore.getState().setProposalIssueCodePrefix("OTH");
    useWorkbenchStore.getState().setApproverTitle("Other title");
    useWorkbenchStore.getState().setProposalIssuePurpose("Other purpose");
    useWorkbenchStore.getState().setProposalRecipient("Other recipient");
    useWorkbenchStore.getState().setProposalAttention("Other attention");
    useWorkbenchStore.getState().setProposalReference("OTHER-001");
    useWorkbenchStore.getState().setProposalRevision("Rev 99");
    useWorkbenchStore.getState().setProposalSubject("Other subject");
    useWorkbenchStore.getState().setProposalValidityNote("Other validity");
    useWorkbenchStore.getState().setReportProfile("consultant");
    useWorkbenchStore.getState().setBriefNote("Other note");

    useWorkbenchStore.getState().loadSavedScenario(savedScenarioId!);

    const reloadedState = useWorkbenchStore.getState();
    expect(reloadedState.projectName).toBe("Riverside Residences");
    expect(reloadedState.clientName).toBe("Machinity Acoustics");
    expect(reloadedState.consultantCompany).toBe("Machinity Acoustic Consultants");
    expect(reloadedState.consultantAddress).toBe("Maslak District, Istanbul, Turkiye");
    expect(reloadedState.consultantEmail).toBe("offers@machinity-acoustics.com");
    expect(reloadedState.consultantLogoDataUrl).toContain("data:image/svg+xml");
    expect(reloadedState.consultantPhone).toBe("+90 212 000 00 00");
    expect(reloadedState.consultantWordmarkLine).toBe("Building Acoustics and Vibration Control");
    expect(reloadedState.preparedBy).toBe("O. Tuna");
    expect(reloadedState.proposalIssueCodePrefix).toBe("MAC");
    expect(reloadedState.approverTitle).toBe("Lead Acoustic Consultant");
    expect(reloadedState.proposalIssuePurpose).toBe("Client review and acoustic coordination");
    expect(reloadedState.proposalRecipient).toBe("Riverside Development Team");
    expect(reloadedState.proposalAttention).toBe("Design Coordination Team");
    expect(reloadedState.proposalReference).toBe("MAC-2026-014");
    expect(reloadedState.proposalRevision).toBe("Rev 01");
    expect(reloadedState.proposalSubject).toBe("Riverside Residences floor acoustic proposal");
    expect(reloadedState.proposalValidityNote).toBe("Valid for 30 calendar days unless superseded by a later issue.");
    expect(reloadedState.reportProfile).toBe("developer");
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
        targetOutputs: FLOOR_TARGET_OUTPUTS
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

  it("keeps preset results stable when the same assembly is entered row-by-row instead of appended directly", async () => {
    const { evaluateScenario } = await import("./scenario-analysis");
    const { WORKBENCH_PRESETS } = await import("./preset-definitions");
    const { useWorkbenchStore } = await import("./workbench-store");

    const evaluateCurrentScenario = () => {
      const state = useWorkbenchStore.getState();

      return evaluateScenario({
        id: "current",
        name: "entry parity sweep",
        rows: state.rows,
        source: "current",
        studyMode: state.studyMode,
        targetOutputs: state.studyMode === "floor" ? FLOOR_TARGET_OUTPUTS : WALL_TARGET_OUTPUTS
      });
    };

    const failures: string[] = [];

    for (const preset of WORKBENCH_PRESETS) {
      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().startStudyMode(preset.studyMode);
      useWorkbenchStore.getState().appendRows(preset.rows);

      const directEntryScenario = evaluateCurrentScenario();

      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().startStudyMode(preset.studyMode);

      for (const row of preset.rows) {
        useWorkbenchStore.getState().addRow();
        const draftRowId = useWorkbenchStore.getState().rows.at(-1)?.id;

        expect(draftRowId).toBeTruthy();

        useWorkbenchStore.getState().updateMaterial(draftRowId!, row.materialId);
        if (preset.studyMode === "floor") {
          useWorkbenchStore.getState().updateFloorRole(draftRowId!, row.floorRole);
        }
        useWorkbenchStore.getState().updateThickness(draftRowId!, row.thicknessMm);
      }

      const rowByRowScenario = evaluateCurrentScenario();
      const directSnapshot = evaluatedScenarioSnapshot({
        result: directEntryScenario.result as ResultSnapshotSource | null,
        warnings: directEntryScenario.warnings
      });
      const rowByRowSnapshot = evaluatedScenarioSnapshot({
        result: rowByRowScenario.result as ResultSnapshotSource | null,
        warnings: rowByRowScenario.warnings
      });

      if (JSON.stringify(directSnapshot) !== JSON.stringify(rowByRowSnapshot)) {
        failures.push(`${preset.id}: direct=${JSON.stringify(directSnapshot)} rowByRow=${JSON.stringify(rowByRowSnapshot)}`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps every preset stable when the same assembly is entered in reverse order and then reordered into place", async () => {
    const { evaluateScenario } = await import("./scenario-analysis");
    const { WORKBENCH_PRESETS } = await import("./preset-definitions");
    const { useWorkbenchStore } = await import("./workbench-store");

    const evaluateCurrentScenario = () => {
      const state = useWorkbenchStore.getState();

      return evaluateScenario({
        customMaterials: state.customMaterials,
        id: "current",
        name: "reverse-entry parity sweep",
        rows: state.rows,
        source: "current",
        studyMode: state.studyMode,
        targetOutputs: state.studyMode === "floor" ? FLOOR_TARGET_OUTPUTS : WALL_TARGET_OUTPUTS
      });
    };

    const failures: string[] = [];

    for (const preset of WORKBENCH_PRESETS) {
      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().loadPreset(preset.id);

      const directScenario = evaluateCurrentScenario();

      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().startStudyMode(preset.studyMode);

      const reverseEntryIds: string[] = [];

      for (const row of [...preset.rows].reverse()) {
        useWorkbenchStore.getState().addRow();
        const draftRowId = useWorkbenchStore.getState().rows.at(-1)?.id;

        expect(draftRowId).toBeTruthy();

        reverseEntryIds.push(draftRowId!);
        useWorkbenchStore.getState().updateThickness(draftRowId!, "");
        useWorkbenchStore.getState().updateMaterial(draftRowId!, row.materialId);
        if (preset.studyMode === "floor") {
          useWorkbenchStore.getState().updateFloorRole(draftRowId!, row.floorRole);
        }
        if ("densityKgM3" in row && typeof row.densityKgM3 === "string") {
          useWorkbenchStore.getState().updateDensity(draftRowId!, row.densityKgM3);
        }
        if ("dynamicStiffnessMNm3" in row && typeof row.dynamicStiffnessMNm3 === "string") {
          useWorkbenchStore.getState().updateDynamicStiffness(draftRowId!, row.dynamicStiffnessMNm3);
        }
        useWorkbenchStore.getState().updateThickness(draftRowId!, row.thicknessMm);
      }

      reverseEntryIds
        .slice()
        .reverse()
        .forEach((rowId, targetIndex) => {
          moveCurrentRowToIndex(useWorkbenchStore, rowId, targetIndex);
        });

      const reverseOrderedScenario = evaluateCurrentScenario();
      const directSnapshot = evaluatedScenarioSnapshot({
        result: directScenario.result as ResultSnapshotSource | null,
        warnings: directScenario.warnings
      });
      const reverseSnapshot = evaluatedScenarioSnapshot({
        result: reverseOrderedScenario.result as ResultSnapshotSource | null,
        warnings: reverseOrderedScenario.warnings
      });

      if (JSON.stringify(directSnapshot) !== JSON.stringify(reverseSnapshot)) {
        failures.push(`${preset.id}: direct=${JSON.stringify(directSnapshot)} reverse=${JSON.stringify(reverseSnapshot)}`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps an override-heavy split floor stack stable when it is entered in reverse order and then reordered into place", async () => {
    const { evaluateScenario } = await import("./scenario-analysis");
    const { useWorkbenchStore } = await import("./workbench-store");

    const finalRows = [
      { floorRole: "floor_covering" as const, materialId: "ceramic_tile", thicknessMm: "8" },
      ...Array.from({ length: 5 }, () => ({
        densityKgM3: "1800",
        floorRole: "floating_screed" as const,
        materialId: "screed",
        thicknessMm: "16"
      })),
      ...Array.from({ length: 5 }, () => ({
        dynamicStiffnessMNm3: "35",
        floorRole: "resilient_layer" as const,
        materialId: "generic_resilient_underlay",
        thicknessMm: "4"
      })),
      { floorRole: "base_structure" as const, materialId: "concrete", thicknessMm: "46.667" },
      { floorRole: "base_structure" as const, materialId: "concrete", thicknessMm: "46.667" },
      { floorRole: "base_structure" as const, materialId: "concrete", thicknessMm: "46.666" }
    ] as const;

    const evaluateCurrentScenario = () => {
      const state = useWorkbenchStore.getState();

      return evaluateScenario({
        id: "current",
        name: "reverse entry parity",
        rows: state.rows,
        source: "current",
        studyMode: state.studyMode,
        targetOutputs: FLOOR_TARGET_OUTPUTS
      });
    };

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().startStudyMode("floor");
    useWorkbenchStore.getState().appendRows(finalRows);

    const directScenario = evaluateCurrentScenario();
    expect(directScenario.result).not.toBeNull();

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().startStudyMode("floor");

    const reverseEntryIds: string[] = [];

    for (const row of [...finalRows].reverse()) {
      useWorkbenchStore.getState().addRow();
      const draftRowId = useWorkbenchStore.getState().rows.at(-1)?.id;

      expect(draftRowId).toBeTruthy();

      reverseEntryIds.push(draftRowId!);
      useWorkbenchStore.getState().updateMaterial(draftRowId!, row.materialId);
      useWorkbenchStore.getState().updateFloorRole(draftRowId!, row.floorRole);
      useWorkbenchStore.getState().updateThickness(draftRowId!, row.thicknessMm);

      if ("densityKgM3" in row && typeof row.densityKgM3 === "string") {
        useWorkbenchStore.getState().updateDensity(draftRowId!, row.densityKgM3);
      }

      if ("dynamicStiffnessMNm3" in row && typeof row.dynamicStiffnessMNm3 === "string") {
        useWorkbenchStore.getState().updateDynamicStiffness(draftRowId!, row.dynamicStiffnessMNm3);
      }
    }

    reverseEntryIds
      .slice()
      .reverse()
      .forEach((rowId, targetIndex) => {
        moveCurrentRowToIndex(useWorkbenchStore, rowId, targetIndex);
      });

    const reverseOrderedScenario = evaluateCurrentScenario();
    expect(reverseOrderedScenario.result).not.toBeNull();
    expect(
      evaluatedScenarioSnapshot({
        result: reverseOrderedScenario.result as ResultSnapshotSource | null,
        warnings: reverseOrderedScenario.warnings
      })
    ).toEqual(
      evaluatedScenarioSnapshot({
        result: directScenario.result as ResultSnapshotSource | null,
        warnings: directScenario.warnings
      })
    );
  });

  it("keeps duplicated floor-covering edit-and-move flows off the converged lightweight-steel bound lane", async () => {
    const { evaluateScenario } = await import("./scenario-analysis");
    const { useWorkbenchStore } = await import("./workbench-store");

    const evaluateCurrentScenario = () => {
      const state = useWorkbenchStore.getState();

      return evaluateScenario({
        id: "current",
        name: "duplicate floor covering regression",
        rows: state.rows,
        source: "current",
        studyMode: state.studyMode,
        targetOutputs: FLOOR_TARGET_OUTPUTS
      });
    };

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().loadPreset("ubiq_steel_200_unspecified_bound");

    const baselineScenario = evaluateCurrentScenario();
    expect(baselineScenario.result?.lowerBoundImpact?.basis).toBe("predictor_lightweight_steel_bound_interpolation_estimate");

    useWorkbenchStore.getState().addRow();
    const duplicateRowId = useWorkbenchStore.getState().rows.at(-1)?.id;
    expect(duplicateRowId).toBeTruthy();

    useWorkbenchStore.getState().updateMaterial(duplicateRowId!, "engineered_timber_with_acoustic_underlay");
    useWorkbenchStore.getState().updateFloorRole(duplicateRowId!, "floor_covering");
    useWorkbenchStore.getState().updateThickness(duplicateRowId!, "20");
    useWorkbenchStore.getState().moveRow(duplicateRowId!, "up");

    const ambiguousScenario = evaluateCurrentScenario();
    expect(ambiguousScenario.result).not.toBeNull();
    expect(ambiguousScenario.result?.lowerBoundImpact).toBeNull();
    expect(ambiguousScenario.result?.boundFloorSystemEstimate).toBeNull();
    expect(ambiguousScenario.result?.floorSystemEstimate?.kind).toBe("family_general");
    expect(
      ambiguousScenario.warnings.some((warning) =>
        /Visible-layer predictor matching is parked because single-entry floor roles are duplicated: floor covering x2 \(Engineered Timber \+ Acoustic Underlay\)/i.test(
          warning
        )
      )
    ).toBe(true);
  });

  it("keeps duplicated floor-covering edit-and-move flows off the curated exact lane", async () => {
    const { evaluateScenario } = await import("./scenario-analysis");
    const { useWorkbenchStore } = await import("./workbench-store");

    const evaluateCurrentScenario = () => {
      const state = useWorkbenchStore.getState();

      return evaluateScenario({
        id: "current",
        name: "duplicate floor covering exact regression",
        rows: state.rows,
        source: "current",
        studyMode: state.studyMode,
        targetOutputs: FLOOR_TARGET_OUTPUTS
      });
    };

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().loadPreset("knauf_concrete_exact");

    const baselineScenario = evaluateCurrentScenario();
    expect(baselineScenario.result?.floorSystemMatch?.system.id).toBe("knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026");

    useWorkbenchStore.getState().addRow();
    const duplicateRowId = useWorkbenchStore.getState().rows.at(-1)?.id;
    expect(duplicateRowId).toBeTruthy();

    useWorkbenchStore.getState().updateMaterial(duplicateRowId!, "engineered_timber_with_acoustic_underlay");
    useWorkbenchStore.getState().updateFloorRole(duplicateRowId!, "floor_covering");
    useWorkbenchStore.getState().updateThickness(duplicateRowId!, "20");

    for (let step = 0; step < 3; step += 1) {
      useWorkbenchStore.getState().moveRow(duplicateRowId!, "up");
    }

    const ambiguousScenario = evaluateCurrentScenario();
    expect(ambiguousScenario.result).not.toBeNull();
    expect(ambiguousScenario.result?.floorSystemMatch).toBeNull();
    expect(ambiguousScenario.result?.lowerBoundImpact).toBeNull();
    expect(
      ambiguousScenario.warnings.some((warning) =>
        /Visible-layer predictor matching is parked because single-entry floor roles are duplicated: floor covering x2 \(Engineered Timber \+ Acoustic Underlay\)/i.test(
          warning
        )
      )
    ).toBe(true);
  });

  it("replaces the single explicit base row cleanly instead of leaving a duplicate structural carrier behind", async () => {
    const { evaluateScenario } = await import("./scenario-analysis");
    const { useWorkbenchStore } = await import("./workbench-store");

    const evaluateCurrentScenario = () => {
      const state = useWorkbenchStore.getState();

      return evaluateScenario({
        id: "current",
        name: "replace base structure regression",
        rows: state.rows,
        source: "current",
        studyMode: state.studyMode,
        targetOutputs: FLOOR_TARGET_OUTPUTS
      });
    };

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().loadPreset("heavy_concrete_impact_floor");
    useWorkbenchStore.getState().replaceSingleBaseStructure("clt_panel", "140");

    const replacedScenario = evaluateCurrentScenario();
    expect(replacedScenario.result).not.toBeNull();
    expect(replacedScenario.result?.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(replacedScenario.result?.impact?.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(replacedScenario.result?.impact?.LnW).toBeCloseTo(68, 1);
    expect(replacedScenario.result?.floorSystemRatings?.Rw).toBeCloseTo(39.6, 1);
    expect(
      replacedScenario.warnings.some((warning) =>
        /Visible-layer predictor matching is parked because single-entry floor roles are duplicated: base structure x2/i.test(
          warning
        )
      )
    ).toBe(false);
  });

  it("refuses ineligible base replacements and keeps the original structural carrier intact", async () => {
    const { evaluateScenario } = await import("./scenario-analysis");
    const { useWorkbenchStore } = await import("./workbench-store");

    const evaluateCurrentScenario = () => {
      const state = useWorkbenchStore.getState();

      return evaluateScenario({
        id: "current",
        name: "ineligible base replacement regression",
        rows: state.rows,
        source: "current",
        studyMode: state.studyMode,
        targetOutputs: FLOOR_TARGET_OUTPUTS
      });
    };

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().loadPreset("heavy_concrete_impact_floor");
    const beforeRows = useWorkbenchStore.getState().rows.map((row) => ({
      floorRole: row.floorRole,
      materialId: row.materialId,
      thicknessMm: row.thicknessMm
    }));

    useWorkbenchStore.getState().replaceSingleBaseStructure("osb", "18");

    const afterRows = useWorkbenchStore.getState().rows.map((row) => ({
      floorRole: row.floorRole,
      materialId: row.materialId,
      thicknessMm: row.thicknessMm
    }));
    expect(afterRows).toEqual(beforeRows);

    const scenario = evaluateCurrentScenario();
    expect(scenario.result?.impact?.basis).toBe("predictor_heavy_concrete_published_upper_treatment_estimate");
    expect(scenario.result?.impact?.LnW).toBeCloseTo(50, 1);
    expect(
      scenario.warnings.some((warning) =>
        /Visible-layer predictor matching is parked because single-entry floor roles are duplicated: base structure x2/i.test(
          warning
        )
      )
    ).toBe(false);
  });

  it("keeps replace-base structural defaults inside guided sanity bands", async () => {
    const { evaluateScenario } = await import("./scenario-analysis");
    const { useWorkbenchStore } = await import("./workbench-store");
    const { defaultThicknessForMaterialInRole, getWorkbenchMaterialById } = await import("./workbench-materials");

    const affectedMaterialIds = [
      "hollow_core_plank",
      "steel_joist_floor",
      "lightweight_steel_floor",
      "composite_steel_deck",
      "open_box_timber_slab"
    ] as const;

    for (const materialId of affectedMaterialIds) {
      const material = getWorkbenchMaterialById(materialId);

      expect(material).toBeDefined();

      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().loadPreset("heavy_concrete_impact_floor");

      const replacementThickness = defaultThicknessForMaterialInRole(material!, "base_structure");
      useWorkbenchStore.getState().replaceSingleBaseStructure(materialId, replacementThickness);

      const state = useWorkbenchStore.getState();
      const baseRow = state.rows.find((row) => row.floorRole === "base_structure");

      expect(baseRow?.materialId).toBe(materialId);
      expect(baseRow?.thicknessMm).toBe(replacementThickness);

      const scenario = evaluateScenario({
        id: materialId,
        name: `replace ${materialId}`,
        rows: state.rows,
        source: "current",
        studyMode: state.studyMode,
        targetOutputs: FLOOR_TARGET_OUTPUTS
      });

      expect(scenario.warnings.filter((warning) => /outside the guided sanity band/i.test(warning))).toEqual([]);
    }
  });

  it("keeps published exact and bound presets off curated lanes when a single-entry role is split and moved through the store", async () => {
    const { evaluateScenario } = await import("./scenario-analysis");
    const { useWorkbenchStore } = await import("./workbench-store");

    const evaluateCurrentScenario = () => {
      const state = useWorkbenchStore.getState();

      return evaluateScenario({
        id: "current",
        name: "preset ambiguity store regression",
        rows: state.rows,
        source: "current",
        studyMode: state.studyMode,
        targetOutputs: FLOOR_TARGET_OUTPUTS
      });
    };

    const failures: string[] = [];

    for (const presetId of PUBLISHED_FLOOR_AMBIGUITY_PRESET_IDS) {
      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().loadPreset(presetId);

      const baselineScenario = evaluateCurrentScenario();
      if (!(baselineScenario.result?.floorSystemMatch || baselineScenario.result?.lowerBoundImpact)) {
        failures.push(`${presetId}: baseline preset should start on an exact or bound lane`);
        continue;
      }

      const candidate = resolveSingleEntrySplitCandidate(useWorkbenchStore.getState().rows);
      if (!candidate) {
        failures.push(`${presetId}: could not resolve a single-entry split candidate`);
        continue;
      }

      const baseThickness = Number.parseFloat(candidate.row.thicknessMm);
      if (!(Number.isFinite(baseThickness) && baseThickness > 0)) {
        failures.push(`${presetId}: candidate thickness is not numeric`);
        continue;
      }

      useWorkbenchStore.getState().duplicateRow(candidate.row.id);

      const rowsAfterDuplicate = useWorkbenchStore.getState().rows;
      const originalIndex = rowsAfterDuplicate.findIndex((row) => row.id === candidate.row.id);
      const duplicateRowId = rowsAfterDuplicate[originalIndex + 1]?.id;
      if (!(originalIndex >= 0 && duplicateRowId)) {
        failures.push(`${presetId}: duplicate row was not inserted next to the source row`);
        continue;
      }

      const firstHalf = Number((baseThickness / 2).toFixed(3));
      const secondHalf = Number((baseThickness - firstHalf).toFixed(3));
      useWorkbenchStore.getState().updateThickness(candidate.row.id, formatThicknessMm(firstHalf));
      useWorkbenchStore.getState().updateThickness(duplicateRowId, formatThicknessMm(secondHalf));

      const updatedRows = useWorkbenchStore.getState().rows;
      const nextDifferentRoleIndex = updatedRows.findIndex(
        (row, index) => index > originalIndex + 1 && row.floorRole !== candidate.role
      );
      if (nextDifferentRoleIndex === -1) {
        failures.push(`${presetId}: could not create a disjoint moved split for role ${candidate.role}`);
        continue;
      }

      moveCurrentRowToIndex(useWorkbenchStore, duplicateRowId, nextDifferentRoleIndex);

      const ambiguousScenario = evaluateCurrentScenario();
      if (!ambiguousScenario.result) {
        failures.push(`${presetId}: split-and-move scenario should still evaluate`);
        continue;
      }

      if (ambiguousScenario.result.floorSystemMatch) {
        failures.push(`${presetId}: split-and-move scenario should not keep the curated exact lane live`);
      }

      if (
        ambiguousScenario.result.boundFloorSystemMatch ||
        ambiguousScenario.result.boundFloorSystemEstimate ||
        ambiguousScenario.result.lowerBoundImpact
      ) {
        failures.push(`${presetId}: split-and-move scenario should not keep the curated or published bound lane live`);
      }

      if (!ambiguousScenario.warnings.some((warning) => /single-entry floor roles are duplicated/i.test(warning))) {
        failures.push(`${presetId}: split-and-move scenario should emit the predictor blocker warning`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps the same heavy-floor result when override rows detour through other materials before the final stack is restored", async () => {
    const { evaluateScenario } = await import("./scenario-analysis");
    const { useWorkbenchStore } = await import("./workbench-store");

    const evaluateCurrentScenario = () => {
      const state = useWorkbenchStore.getState();

      return evaluateScenario({
        customMaterials: state.customMaterials,
        id: "override-detour parity",
        name: "override-detour parity",
        rows: state.rows,
        source: "current",
        studyMode: state.studyMode,
        targetOutputs: FLOOR_TARGET_OUTPUTS
      });
    };

    const resolveRows = () => {
      const state = useWorkbenchStore.getState();
      const screedRow = state.rows.find((entry) => entry.floorRole === "floating_screed" && entry.materialId === "screed");
      const resilientRow = state.rows.find(
        (entry) => entry.floorRole === "resilient_layer" && entry.materialId === "generic_resilient_underlay"
      );

      expect(screedRow).toBeTruthy();
      expect(resilientRow).toBeTruthy();

      return {
        resilientRow: resilientRow!,
        screedRow: screedRow!
      };
    };

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().loadPreset("heavy_concrete_impact_floor");

    let { resilientRow, screedRow } = resolveRows();
    useWorkbenchStore.getState().updateDensity(screedRow.id, "1800");
    useWorkbenchStore.getState().updateDynamicStiffness(resilientRow.id, "35");

    const directScenario = evaluateCurrentScenario();

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().loadPreset("heavy_concrete_impact_floor");

    ({ resilientRow, screedRow } = resolveRows());

    useWorkbenchStore.getState().updateDensity(screedRow.id, "1500");
    useWorkbenchStore.getState().updateMaterial(screedRow.id, "concrete");
    useWorkbenchStore.getState().updateMaterial(screedRow.id, "screed");
    useWorkbenchStore.getState().updateFloorRole(screedRow.id, "floating_screed");
    useWorkbenchStore.getState().updateThickness(screedRow.id, "50");
    useWorkbenchStore.getState().updateDensity(screedRow.id, "1800");

    useWorkbenchStore.getState().updateDynamicStiffness(resilientRow.id, "20");
    useWorkbenchStore.getState().updateMaterial(resilientRow.id, "eps_underlay");
    useWorkbenchStore.getState().updateMaterial(resilientRow.id, "generic_resilient_underlay");
    useWorkbenchStore.getState().updateFloorRole(resilientRow.id, "resilient_layer");
    useWorkbenchStore.getState().updateThickness(resilientRow.id, "8");
    useWorkbenchStore.getState().updateDynamicStiffness(resilientRow.id, "35");

    const detourScenario = evaluateCurrentScenario();

    expect(detourScenario.result).not.toBeNull();
    expect(directScenario.result).not.toBeNull();
    expect(
      evaluatedScenarioSnapshot({
        result: detourScenario.result as ResultSnapshotSource | null,
        warnings: detourScenario.warnings
      })
    ).toEqual(
      evaluatedScenarioSnapshot({
        result: directScenario.result as ResultSnapshotSource | null,
        warnings: directScenario.warnings
      })
    );
  });

  it("keeps the same heavy-floor result when the final dynamic stiffness override is reached through stepped and direct edits", async () => {
    const { evaluateScenario } = await import("./scenario-analysis");
    const { useWorkbenchStore } = await import("./workbench-store");

    const evaluateCurrentScenario = () => {
      const state = useWorkbenchStore.getState();

      return evaluateScenario({
        id: "current",
        name: "dynamic stiffness parity",
        rows: state.rows,
        source: "current",
        studyMode: state.studyMode,
        targetOutputs: FLOOR_TARGET_OUTPUTS
      });
    };

    const resolveRowId = () => {
      const row = useWorkbenchStore
        .getState()
        .rows.find((entry) => entry.floorRole === "resilient_layer" && entry.materialId === "generic_resilient_underlay");

      expect(row).toBeTruthy();

      return row!.id;
    };

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().loadPreset("heavy_concrete_impact_floor");
    let rowId = resolveRowId();
    useWorkbenchStore.getState().updateDynamicStiffness(rowId, "20");
    useWorkbenchStore.getState().updateDynamicStiffness(rowId, "35");

    const editedScenario = evaluateCurrentScenario();

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().loadPreset("heavy_concrete_impact_floor");
    rowId = resolveRowId();
    useWorkbenchStore.getState().updateDynamicStiffness(rowId, "35");

    const directScenario = evaluateCurrentScenario();

    expect(editedScenario.result).not.toBeNull();
    expect(directScenario.result).not.toBeNull();
    expect(
      evaluatedScenarioSnapshot({
        result: editedScenario.result as ResultSnapshotSource | null,
        warnings: editedScenario.warnings
      })
    ).toEqual(
      evaluatedScenarioSnapshot({
        result: directScenario.result as ResultSnapshotSource | null,
        warnings: directScenario.warnings
      })
    );
  });

  it("keeps the same heavy-floor result when the final density override is reached through stepped and direct edits", async () => {
    const { evaluateScenario } = await import("./scenario-analysis");
    const { useWorkbenchStore } = await import("./workbench-store");

    const evaluateCurrentScenario = () => {
      const state = useWorkbenchStore.getState();

      return evaluateScenario({
        customMaterials: state.customMaterials,
        id: "density parity",
        name: "density parity",
        rows: state.rows,
        source: "current",
        studyMode: state.studyMode,
        targetOutputs: FLOOR_TARGET_OUTPUTS
      });
    };

    const resolveRowId = () => {
      const row = useWorkbenchStore
        .getState()
        .rows.find((entry) => entry.floorRole === "floating_screed" && entry.materialId === "screed");

      expect(row).toBeTruthy();

      return row!.id;
    };

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().loadPreset("heavy_concrete_impact_floor");
    let rowId = resolveRowId();
    useWorkbenchStore.getState().updateDensity(rowId, "1500");
    useWorkbenchStore.getState().updateDensity(rowId, "1800");

    const editedScenario = evaluateCurrentScenario();

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().loadPreset("heavy_concrete_impact_floor");
    rowId = resolveRowId();
    useWorkbenchStore.getState().updateDensity(rowId, "1800");

    const directScenario = evaluateCurrentScenario();

    expect(editedScenario.result).not.toBeNull();
    expect(directScenario.result).not.toBeNull();
    expect(
      evaluatedScenarioSnapshot({
        result: editedScenario.result as ResultSnapshotSource | null,
        warnings: editedScenario.warnings
      })
    ).toEqual(
      evaluatedScenarioSnapshot({
        result: directScenario.result as ResultSnapshotSource | null,
        warnings: directScenario.warnings
      })
    );
  });

  it("clears the manual dynamic stiffness override when the row material changes", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().loadPreset("heavy_concrete_impact_floor");

    const row = useWorkbenchStore
      .getState()
      .rows.find((entry) => entry.floorRole === "resilient_layer" && entry.materialId === "generic_resilient_underlay");

    expect(row).toBeTruthy();

    useWorkbenchStore.getState().updateDynamicStiffness(row!.id, "35");
    useWorkbenchStore.getState().updateMaterial(row!.id, "eps_underlay");

    const updatedRow = useWorkbenchStore.getState().rows.find((entry) => entry.id === row!.id);

    expect(updatedRow?.materialId).toBe("eps_underlay");
    expect(updatedRow?.dynamicStiffnessMNm3 ?? "").toBe("");
  });

  it("reclassifies ceiling-support products onto the ceiling side when the row material changes", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().loadPreset("heavy_concrete_impact_floor");

    const row = useWorkbenchStore
      .getState()
      .rows.find((entry) => entry.floorRole === "resilient_layer" && entry.materialId === "generic_resilient_underlay");

    expect(row).toBeTruthy();

    useWorkbenchStore.getState().updateMaterial(row!.id, "acoustic_mount_clip");

    const updatedRow = useWorkbenchStore.getState().rows.find((entry) => entry.id === row!.id);

    expect(updatedRow?.materialId).toBe("acoustic_mount_clip");
    expect(updatedRow?.floorRole).toBe("ceiling_cavity");
  });

  it("clears the manual density override when the row material changes", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().loadPreset("heavy_concrete_impact_floor");

    const row = useWorkbenchStore
      .getState()
      .rows.find((entry) => entry.floorRole === "floating_screed" && entry.materialId === "screed");

    expect(row).toBeTruthy();

    useWorkbenchStore.getState().updateDensity(row!.id, "1800");
    useWorkbenchStore.getState().updateMaterial(row!.id, "concrete");

    const updatedRow = useWorkbenchStore.getState().rows.find((entry) => entry.id === row!.id);

    expect(updatedRow?.materialId).toBe("concrete");
    expect(updatedRow?.densityKgM3 ?? "").toBe("");
  });

  it("reloads saved custom materials so they stay usable in the layer stack", async () => {
    const { evaluateScenario } = await import("./scenario-analysis");
    const { createEmptyCustomMaterialDraft, buildCustomMaterialDefinition } = await import("./workbench-materials");
    const { useWorkbenchStore } = await import("./workbench-store");

    const evaluateCurrentScenario = () => {
      const state = useWorkbenchStore.getState();

      return evaluateScenario({
        customMaterials: state.customMaterials,
        id: "custom-material-reload",
        name: "custom material reload",
        rows: state.rows,
        source: "current",
        studyMode: state.studyMode,
        targetOutputs: FLOOR_TARGET_OUTPUTS
      });
    };

    const draft = createEmptyCustomMaterialDraft();
    draft.name = "Cork Finish QA";
    draft.category = "finish";
    draft.densityKgM3 = "720";
    draft.notes = "Store reload regression.";

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().loadPreset("heavy_concrete_impact_floor");

    const customMaterial = buildCustomMaterialDefinition({
      draft,
      existingMaterials: useWorkbenchStore.getState().customMaterials
    });

    useWorkbenchStore.getState().addCustomMaterial(customMaterial);

    const floorCoveringRowId = useWorkbenchStore
      .getState()
      .rows.find((row) => row.floorRole === "floor_covering")?.id;

    expect(floorCoveringRowId).toBeTruthy();

    useWorkbenchStore.getState().updateMaterial(floorCoveringRowId!, customMaterial.id);
    useWorkbenchStore.getState().updateThickness(floorCoveringRowId!, "12.5");

    const beforeSave = evaluateCurrentScenario();
    expect(beforeSave.result).not.toBeNull();

    useWorkbenchStore.getState().saveCurrentScenario();
    const savedScenarioId = useWorkbenchStore.getState().savedScenarios[0]?.id;

    expect(savedScenarioId).toBeTruthy();

    useWorkbenchStore.setState({ customMaterials: [] });
    useWorkbenchStore.getState().loadPreset("concrete_wall");
    useWorkbenchStore.getState().loadSavedScenario(savedScenarioId!);

    const reloadedState = useWorkbenchStore.getState();
    const reloadedCustomMaterial = reloadedState.customMaterials.find((material) => material.id === customMaterial.id);

    expect(reloadedCustomMaterial?.name).toBe("Cork Finish QA");
    expect(reloadedState.rows.find((row) => row.floorRole === "floor_covering")?.materialId).toBe(customMaterial.id);

    const afterReload = evaluateCurrentScenario();
    expect(afterReload.result).not.toBeNull();
    expect(resultSnapshot(afterReload.result as ResultSnapshotSource)).toEqual(
      resultSnapshot(beforeSave.result as ResultSnapshotSource)
    );
  });
});
