import type { FloorRole, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { getPresetById, type PresetId } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { buildCustomMaterialDefinition, createEmptyCustomMaterialDraft } from "./workbench-materials";
import { IMPACT_ONLY_LOW_CONFIDENCE_FLOOR_FAMILY_NOTE } from "./impact-only-low-confidence-floor-lane";
import { EXACT_FLOOR_FAMILY_CURVE_NOTE, LOW_CONFIDENCE_FLOOR_FAMILY_NOTE } from "./workbench-warning-notes";

const TARGET_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w"];
const SINGLE_ENTRY_ROLE_SPLIT_PREFERENCE: readonly FloorRole[] = [
  "floor_covering",
  "resilient_layer",
  "upper_fill",
  "floating_screed",
  "ceiling_cavity",
  "ceiling_fill",
  "base_structure"
];

function resultSnapshot(result: NonNullable<ReturnType<typeof evaluateScenario>["result"]>) {
  return {
    deltaLw: result.impact?.DeltaLw ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

function evaluatePresetScenario(presetId: PresetId) {
  const preset = getPresetById(presetId);

  return evaluateScenario({
    id: preset.id,
    name: preset.label,
    rows: preset.rows.map((row, index) => ({ ...row, id: `${preset.id}-${index + 1}` })),
    source: "current",
    studyMode: preset.studyMode,
    targetOutputs: ["Rw", "Ln,w", "Ln,w+CI", "STC", "C", "Ctr"]
  });
}

function buildDisjointSplitRows(
  rows: ReadonlyArray<{ floorRole?: FloorRole; id: string; materialId: string; thicknessMm: string }>
): Array<{ floorRole?: FloorRole; id: string; materialId: string; thicknessMm: string }> | null {
  for (const role of SINGLE_ENTRY_ROLE_SPLIT_PREFERENCE) {
    const roleIndices = rows.flatMap((row, index) => (row.floorRole === role ? [index] : []));
    if (roleIndices.length !== 1) {
      continue;
    }

    const roleIndex = roleIndices[0]!;
    const originalRow = rows[roleIndex]!;
    const originalThicknessMm = Number(originalRow.thicknessMm);
    if (!(Number.isFinite(originalThicknessMm) && originalThicknessMm > 0)) {
      continue;
    }

    const firstHalfThicknessMm = Number((originalThicknessMm / 2).toFixed(3));
    const secondHalfThicknessMm = Number((originalThicknessMm - firstHalfThicknessMm).toFixed(3));
    if (!(firstHalfThicknessMm > 0 && secondHalfThicknessMm > 0)) {
      continue;
    }

    const nextDifferentRoleIndex = rows.findIndex((row, index) => index > roleIndex && row.floorRole !== role);
    let previousDifferentRoleIndex = -1;
    for (let index = roleIndex - 1; index >= 0; index -= 1) {
      if (rows[index]?.floorRole !== role) {
        previousDifferentRoleIndex = index;
        break;
      }
    }

    if (nextDifferentRoleIndex === -1 && previousDifferentRoleIndex === -1) {
      continue;
    }

    const splitRows = rows.map((row, index) =>
      index === roleIndex ? { ...row, thicknessMm: firstHalfThicknessMm.toString() } : { ...row }
    );
    const trailingHalf = {
      ...originalRow,
      id: `${originalRow.id}-split-b`,
      thicknessMm: secondHalfThicknessMm.toString()
    };

    if (nextDifferentRoleIndex !== -1) {
      splitRows.splice(nextDifferentRoleIndex + 1, 0, trailingHalf);
      return splitRows;
    }

    splitRows.splice(previousDifferentRoleIndex, 0, trailingHalf);
    return splitRows;
  }

  return null;
}

describe("scenario analysis", () => {
  it("keeps the same heavy-floor result when a blank row sits inside the stack", () => {
    const baseRows = [
      { floorRole: "floor_covering" as const, id: "a", materialId: "ceramic_tile", thicknessMm: "8" },
      { floorRole: "floating_screed" as const, id: "b", materialId: "screed", thicknessMm: "50" },
      { floorRole: "resilient_layer" as const, id: "c", materialId: "generic_resilient_underlay", thicknessMm: "8" },
      { floorRole: "base_structure" as const, id: "d", materialId: "concrete", thicknessMm: "150" }
    ];

    const withBlankMiddleRow = [
      baseRows[0]!,
      { floorRole: "upper_fill" as const, id: "gap", materialId: "generic_fill", thicknessMm: "" },
      baseRows[1]!,
      baseRows[2]!,
      baseRows[3]!
    ];

    const baseScenario = evaluateScenario({
      id: "base",
      name: "base",
      rows: baseRows,
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });
    const blankScenario = evaluateScenario({
      id: "blank",
      name: "blank",
      rows: withBlankMiddleRow,
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(baseScenario.result).not.toBeNull();
    expect(blankScenario.result).not.toBeNull();
    expect(resultSnapshot(blankScenario.result!)).toEqual(resultSnapshot(baseScenario.result!));
    expect(blankScenario.warnings).toContain("Layer 2 is missing a valid thickness.");
  });

  it("keeps the same heavy-floor result when an identical live layer is split into adjacent rows", () => {
    const mergedRows = [
      { floorRole: "floor_covering" as const, id: "a", materialId: "ceramic_tile", thicknessMm: "8" },
      { floorRole: "floating_screed" as const, id: "b", materialId: "screed", thicknessMm: "100" },
      { floorRole: "resilient_layer" as const, id: "c", materialId: "generic_resilient_underlay", thicknessMm: "8" },
      { floorRole: "base_structure" as const, id: "d", materialId: "concrete", thicknessMm: "150" }
    ];
    const splitRows = [
      mergedRows[0]!,
      { floorRole: "floating_screed" as const, id: "b1", materialId: "screed", thicknessMm: "60" },
      { floorRole: "floating_screed" as const, id: "b2", materialId: "screed", thicknessMm: "40" },
      mergedRows[2]!,
      mergedRows[3]!
    ];

    const mergedScenario = evaluateScenario({
      id: "merged",
      name: "merged",
      rows: mergedRows,
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });
    const splitScenario = evaluateScenario({
      id: "split",
      name: "split",
      rows: splitRows,
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(mergedScenario.result).not.toBeNull();
    expect(splitScenario.result).not.toBeNull();
    expect(resultSnapshot(splitScenario.result!)).toEqual(resultSnapshot(mergedScenario.result!));
  });

  it("keeps the same heavy-floor result and warning set when one merge-safe live layer is entered as ten rows", () => {
    const mergedRows = [
      { floorRole: "floor_covering" as const, id: "a", materialId: "ceramic_tile", thicknessMm: "8" },
      { floorRole: "floating_screed" as const, id: "b", materialId: "screed", thicknessMm: "80" },
      { floorRole: "resilient_layer" as const, id: "c", materialId: "generic_resilient_underlay", thicknessMm: "8" },
      { floorRole: "base_structure" as const, id: "d", materialId: "concrete", thicknessMm: "150" }
    ];
    const splitRows = [
      mergedRows[0]!,
      ...Array.from({ length: 10 }, (_, index) => ({
        floorRole: "floating_screed" as const,
        id: `b-${index + 1}`,
        materialId: "screed",
        thicknessMm: "8"
      })),
      mergedRows[2]!,
      mergedRows[3]!
    ];

    const mergedScenario = evaluateScenario({
      id: "merged-ten-way",
      name: "merged ten way",
      rows: mergedRows,
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });
    const splitScenario = evaluateScenario({
      id: "split-ten-way",
      name: "split ten way",
      rows: splitRows,
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(mergedScenario.result).not.toBeNull();
    expect(splitScenario.result).not.toBeNull();
    expect(resultSnapshot(splitScenario.result!)).toEqual(resultSnapshot(mergedScenario.result!));
    expect(splitScenario.warnings).toEqual(mergedScenario.warnings);
  });

  it("keeps the same bare exact floor result when one base slab is entered as ten rows", () => {
    const mergedRows = [
      { floorRole: "base_structure" as const, id: "a", materialId: "concrete", thicknessMm: "140" }
    ];
    const splitRows = Array.from({ length: 10 }, (_, index) => ({
      floorRole: "base_structure" as const,
      id: `a-${index + 1}`,
      materialId: "concrete",
      thicknessMm: "14"
    }));

    const mergedScenario = evaluateScenario({
      id: "merged-bare-exact",
      name: "merged bare exact",
      rows: mergedRows,
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });
    const splitScenario = evaluateScenario({
      id: "split-bare-exact",
      name: "split bare exact",
      rows: splitRows,
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(mergedScenario.result).not.toBeNull();
    expect(splitScenario.result).not.toBeNull();
    expect(resultSnapshot(splitScenario.result!)).toEqual(resultSnapshot(mergedScenario.result!));
    expect(splitScenario.warnings).toEqual(mergedScenario.warnings);
  });

  it("keeps merged and high-split floor rows stable across bare, density-override, and dynamic-stiffness cases", () => {
    const splitCounts = [2, 3, 5, 10, 20, 29] as const;
    const cases = [
      {
        id: "bare-base",
        mergedRows: [{ floorRole: "base_structure" as const, id: "a", materialId: "concrete", thicknessMm: "140" }],
        buildSplitRows: (splitCount: number) =>
          Array.from({ length: splitCount }, (_, index) => ({
            floorRole: "base_structure" as const,
            id: `a-${index + 1}`,
            materialId: "concrete",
            thicknessMm: String(140 / splitCount)
          }))
      },
      {
        id: "density-override",
        mergedRows: [
          { floorRole: "floor_covering" as const, id: "a", materialId: "ceramic_tile", thicknessMm: "8" },
          { densityKgM3: "1800", floorRole: "floating_screed" as const, id: "b", materialId: "screed", thicknessMm: "80" },
          { floorRole: "resilient_layer" as const, id: "c", materialId: "generic_resilient_underlay", thicknessMm: "8" },
          { floorRole: "base_structure" as const, id: "d", materialId: "concrete", thicknessMm: "150" }
        ],
        buildSplitRows: (splitCount: number) => [
          { floorRole: "floor_covering" as const, id: "a", materialId: "ceramic_tile", thicknessMm: "8" },
          ...Array.from({ length: splitCount }, (_, index) => ({
            densityKgM3: "1800",
            floorRole: "floating_screed" as const,
            id: `b-${index + 1}`,
            materialId: "screed",
            thicknessMm: String(80 / splitCount)
          })),
          { floorRole: "resilient_layer" as const, id: "c", materialId: "generic_resilient_underlay", thicknessMm: "8" },
          { floorRole: "base_structure" as const, id: "d", materialId: "concrete", thicknessMm: "150" }
        ]
      },
      {
        id: "dynamic-override",
        mergedRows: [
          { floorRole: "floor_covering" as const, id: "a", materialId: "ceramic_tile", thicknessMm: "8" },
          { floorRole: "floating_screed" as const, id: "b", materialId: "screed", thicknessMm: "50" },
          {
            dynamicStiffnessMNm3: "35",
            floorRole: "resilient_layer" as const,
            id: "c",
            materialId: "generic_resilient_underlay",
            thicknessMm: "20"
          },
          { floorRole: "base_structure" as const, id: "d", materialId: "concrete", thicknessMm: "150" }
        ],
        buildSplitRows: (splitCount: number) => [
          { floorRole: "floor_covering" as const, id: "a", materialId: "ceramic_tile", thicknessMm: "8" },
          { floorRole: "floating_screed" as const, id: "b", materialId: "screed", thicknessMm: "50" },
          ...Array.from({ length: splitCount }, (_, index) => ({
            dynamicStiffnessMNm3: "35",
            floorRole: "resilient_layer" as const,
            id: `c-${index + 1}`,
            materialId: "generic_resilient_underlay",
            thicknessMm: String(20 / splitCount)
          })),
          { floorRole: "base_structure" as const, id: "d", materialId: "concrete", thicknessMm: "150" }
        ]
      }
    ] as const;

    const failures: string[] = [];

    for (const testCase of cases) {
      const mergedScenario = evaluateScenario({
        id: `${testCase.id}-merged`,
        name: `${testCase.id} merged`,
        rows: testCase.mergedRows,
        source: "current",
        studyMode: "floor",
        targetOutputs: TARGET_OUTPUTS
      });

      expect(mergedScenario.result).not.toBeNull();

      for (const splitCount of splitCounts) {
        const splitScenario = evaluateScenario({
          id: `${testCase.id}-split-${splitCount}`,
          name: `${testCase.id} split ${splitCount}`,
          rows: testCase.buildSplitRows(splitCount),
          source: "current",
          studyMode: "floor",
          targetOutputs: TARGET_OUTPUTS
        });

        expect(splitScenario.result).not.toBeNull();

        if (JSON.stringify(resultSnapshot(splitScenario.result!)) !== JSON.stringify(resultSnapshot(mergedScenario.result!))) {
          failures.push(
            `${testCase.id}: split x${splitCount} result drift merged=${JSON.stringify(resultSnapshot(mergedScenario.result!))} split=${JSON.stringify(resultSnapshot(splitScenario.result!))}`
          );
        }

        if (JSON.stringify(splitScenario.warnings) !== JSON.stringify(mergedScenario.warnings)) {
          failures.push(
            `${testCase.id}: split x${splitCount} warning drift merged=${JSON.stringify(mergedScenario.warnings)} split=${JSON.stringify(splitScenario.warnings)}`
          );
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it("collapses ten split screed rows into the same single sanity warning as the packed version", () => {
    const mergedRows = [
      { floorRole: "floor_covering" as const, id: "a", materialId: "ceramic_tile", thicknessMm: "8" },
      { floorRole: "floating_screed" as const, id: "b", materialId: "screed", thicknessMm: "100" },
      { floorRole: "resilient_layer" as const, id: "c", materialId: "generic_resilient_underlay", thicknessMm: "8" },
      { floorRole: "base_structure" as const, id: "d", materialId: "concrete", thicknessMm: "150" }
    ];
    const splitRows = [
      mergedRows[0]!,
      ...Array.from({ length: 10 }, (_, index) => ({
        floorRole: "floating_screed" as const,
        id: `b-${index + 1}`,
        materialId: "screed",
        thicknessMm: "10"
      })),
      mergedRows[2]!,
      mergedRows[3]!
    ];

    const mergedScenario = evaluateScenario({
      id: "merged-warning",
      name: "merged warning",
      rows: mergedRows,
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });
    const splitScenario = evaluateScenario({
      id: "split-warning",
      name: "split warning",
      rows: splitRows,
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(mergedScenario.warnings.filter((warning) => warning.includes("guided sanity band"))).toHaveLength(1);
    expect(splitScenario.warnings).toEqual(mergedScenario.warnings);
  });

  it("keeps the same heavy-floor result when an overridden resilient layer is split into adjacent rows with the same final stiffness", () => {
    const mergedRows = [
      { floorRole: "floor_covering" as const, id: "a", materialId: "ceramic_tile", thicknessMm: "8" },
      {
        dynamicStiffnessMNm3: "35",
        floorRole: "resilient_layer" as const,
        id: "b",
        materialId: "generic_resilient_underlay",
        thicknessMm: "8"
      },
      { floorRole: "floating_screed" as const, id: "c", materialId: "screed", thicknessMm: "50" },
      { floorRole: "base_structure" as const, id: "d", materialId: "concrete", thicknessMm: "150" }
    ];
    const splitRows = [
      mergedRows[0]!,
      {
        dynamicStiffnessMNm3: "35",
        floorRole: "resilient_layer" as const,
        id: "b1",
        materialId: "generic_resilient_underlay",
        thicknessMm: "4"
      },
      {
        dynamicStiffnessMNm3: "35",
        floorRole: "resilient_layer" as const,
        id: "b2",
        materialId: "generic_resilient_underlay",
        thicknessMm: "4"
      },
      mergedRows[2]!,
      mergedRows[3]!
    ];

    const mergedScenario = evaluateScenario({
      id: "merged-override",
      name: "merged override",
      rows: mergedRows,
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });
    const splitScenario = evaluateScenario({
      id: "split-override",
      name: "split override",
      rows: splitRows,
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(mergedScenario.result).not.toBeNull();
    expect(splitScenario.result).not.toBeNull();
    expect(resultSnapshot(splitScenario.result!)).toEqual(resultSnapshot(mergedScenario.result!));
  });

  it("lets a manual dynamic stiffness override activate the explicit heavy-floor route for catalog materials without a listed value", () => {
    const baseRows = [
      { floorRole: "floor_covering" as const, id: "a", materialId: "ceramic_tile", thicknessMm: "8" },
      { floorRole: "floating_screed" as const, id: "b", materialId: "screed", thicknessMm: "50" },
      { floorRole: "resilient_layer" as const, id: "c", materialId: "resilient_support", thicknessMm: "8" },
      { floorRole: "base_structure" as const, id: "d", materialId: "concrete", thicknessMm: "150" }
    ];

    const withoutOverride = evaluateScenario({
      id: "without-override",
      name: "without override",
      rows: baseRows,
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });
    const withOverride = evaluateScenario({
      id: "with-override",
      name: "with override",
      rows: baseRows.map((row) =>
        row.id === "c"
          ? {
              ...row,
              dynamicStiffnessMNm3: "35"
            }
          : row
      ),
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(withoutOverride.result).not.toBeNull();
    expect(withOverride.result).not.toBeNull();
    expect(withoutOverride.result?.impact?.DeltaLw ?? null).toBeNull();
    expect(withOverride.result?.impact?.DeltaLw ?? null).not.toBeNull();
    expect(withOverride.result?.impact?.LnW ?? null).not.toBeNull();
  });

  it("uses a manual dynamic stiffness override instead of the catalog value when the material already has one", () => {
    const baseRows = [
      { floorRole: "floor_covering" as const, id: "a", materialId: "ceramic_tile", thicknessMm: "8" },
      { floorRole: "floating_screed" as const, id: "b", materialId: "screed", thicknessMm: "50" },
      { floorRole: "resilient_layer" as const, id: "c", materialId: "mw_t_impact_layer_s40", thicknessMm: "30" },
      { floorRole: "base_structure" as const, id: "d", materialId: "concrete", thicknessMm: "150" }
    ];

    const catalogScenario = evaluateScenario({
      id: "catalog-dynamic-stiffness",
      name: "catalog dynamic stiffness",
      rows: baseRows,
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });
    const overriddenScenario = evaluateScenario({
      id: "overridden-dynamic-stiffness",
      name: "overridden dynamic stiffness",
      rows: baseRows.map((row) =>
        row.id === "c"
          ? {
              ...row,
              dynamicStiffnessMNm3: "20"
            }
          : row
      ),
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(catalogScenario.result).not.toBeNull();
    expect(overriddenScenario.result).not.toBeNull();
    expect(catalogScenario.result?.impact?.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(overriddenScenario.result?.impact?.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(overriddenScenario.result?.impact?.DeltaLw ?? null).not.toBe(catalogScenario.result?.impact?.DeltaLw ?? null);
    expect(overriddenScenario.result?.impact?.LnW ?? null).not.toBe(catalogScenario.result?.impact?.LnW ?? null);
  });

  it("uses a manual density override instead of the catalog value when the material already has one", () => {
    const baseRows = [
      { floorRole: "floor_covering" as const, id: "a", materialId: "ceramic_tile", thicknessMm: "8" },
      {
        densityKgM3: "1400",
        floorRole: "floating_screed" as const,
        id: "b",
        materialId: "screed",
        thicknessMm: "50"
      },
      {
        dynamicStiffnessMNm3: "35",
        floorRole: "resilient_layer" as const,
        id: "c",
        materialId: "generic_resilient_underlay",
        thicknessMm: "8"
      },
      { floorRole: "base_structure" as const, id: "d", materialId: "concrete", thicknessMm: "150" }
    ];

    const catalogScenario = evaluateScenario({
      id: "catalog-density",
      name: "catalog density",
      rows: baseRows.map((row) => (row.id === "b" ? { ...row, densityKgM3: undefined } : row)),
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });
    const overriddenScenario = evaluateScenario({
      id: "overridden-density",
      name: "overridden density",
      rows: baseRows,
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(catalogScenario.result).not.toBeNull();
    expect(overriddenScenario.result).not.toBeNull();
    expect(catalogScenario.result?.impact?.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(overriddenScenario.result?.impact?.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(overriddenScenario.result?.impact?.DeltaLw ?? null).not.toBe(catalogScenario.result?.impact?.DeltaLw ?? null);
    expect(overriddenScenario.result?.impact?.LnW ?? null).not.toBe(catalogScenario.result?.impact?.LnW ?? null);
  });

  it("evaluates floor scenarios that use a local custom material in the live stack", () => {
    const customMaterial = buildCustomMaterialDefinition({
      draft: {
        ...createEmptyCustomMaterialDraft(),
        category: "finish",
        densityKgM3: "1650",
        name: "Custom cork finish"
      },
      existingMaterials: []
    });

    const scenario = evaluateScenario({
      customMaterials: [customMaterial],
      id: "custom-floor",
      name: "custom floor",
      rows: [
        { floorRole: "floor_covering", id: "a", materialId: customMaterial.id, thicknessMm: "8" },
        { floorRole: "floating_screed", id: "b", materialId: "screed", thicknessMm: "50" },
        { floorRole: "resilient_layer", id: "c", materialId: "generic_resilient_underlay", thicknessMm: "8" },
        { floorRole: "base_structure", id: "d", materialId: "concrete", thicknessMm: "150" }
      ],
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(scenario.result).not.toBeNull();
    expect(scenario.warnings).not.toContain(expect.stringContaining("Unknown material"));
    expect(scenario.result?.impact?.LnW ?? null).not.toBeNull();
  });

  it("lets a row-level density override change the live result for local custom concrete base materials", () => {
    const customMaterial = buildCustomMaterialDefinition({
      draft: {
        ...createEmptyCustomMaterialDraft(),
        category: "mass",
        densityKgM3: "2400",
        name: "Custom Concrete QA"
      },
      existingMaterials: []
    });

    const evaluateWithDensity = (densityKgM3?: string) =>
      evaluateScenario({
        customMaterials: [customMaterial],
        id: `custom-concrete-${densityKgM3 ?? "catalog"}`,
        name: "custom concrete density",
        rows: [
          { floorRole: "floor_covering", id: "a", materialId: "ceramic_tile", thicknessMm: "8" },
          { floorRole: "floating_screed", id: "b", materialId: "screed", thicknessMm: "50" },
          {
            dynamicStiffnessMNm3: "35",
            floorRole: "resilient_layer",
            id: "c",
            materialId: "generic_resilient_underlay",
            thicknessMm: "8"
          },
          {
            densityKgM3,
            floorRole: "base_structure",
            id: "d",
            materialId: customMaterial.id,
            thicknessMm: "150"
          }
        ],
        source: "current",
        studyMode: "floor",
        targetOutputs: TARGET_OUTPUTS
      });

    const catalogScenario = evaluateWithDensity();
    const lighterScenario = evaluateWithDensity("1200");

    expect(catalogScenario.result).not.toBeNull();
    expect(lighterScenario.result).not.toBeNull();
    expect(catalogScenario.result?.impact?.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(lighterScenario.result?.impact?.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(lighterScenario.result?.impact?.LnW ?? -Infinity).toBeGreaterThan(catalogScenario.result?.impact?.LnW ?? Infinity);
    expect(lighterScenario.result?.floorSystemRatings?.Rw ?? Infinity).toBeLessThan(catalogScenario.result?.floorSystemRatings?.Rw ?? -Infinity);
  });

  it("surfaces soft sanity warnings for out-of-band guided inputs without blocking calculation", () => {
    const scenario = evaluateScenario({
      airborneContext: {
        airtightness: "good",
        connectionType: "auto",
        contextMode: "field_between_rooms",
        electricalBoxes: "none",
        junctionQuality: "good",
        panelHeightMm: 9000,
        panelWidthMm: 20000,
        penetrationState: "none",
        perimeterSeal: "good",
        receivingRoomRt60S: 8,
        receivingRoomVolumeM3: 1600,
        sharedTrack: "independent",
        studSpacingMm: undefined,
        studType: "auto"
      },
      id: "sanity",
      impactFieldContext: {
        fieldKDb: 28,
        receivingRoomVolumeM3: 1600
      },
      name: "sanity",
      rows: [
        { floorRole: "floor_covering", id: "a", materialId: "ceramic_tile", thicknessMm: "8" },
        { floorRole: "floating_screed", id: "b", materialId: "screed", thicknessMm: "1200" },
        { floorRole: "resilient_layer", id: "c", materialId: "generic_resilient_underlay", thicknessMm: "8" },
        { floorRole: "base_structure", id: "d", materialId: "concrete", thicknessMm: "150" }
      ],
      source: "current",
      studyMode: "floor",
      targetOutputs: [...TARGET_OUTPUTS, "DnT,w", "DnT,A"]
    });

    expect(scenario.result).not.toBeNull();
    expect(scenario.warnings).toContain(
      "Layer 2 thickness 1200 mm is outside the guided sanity band of 25 to 90 mm for Mineral Screed in the floating screed role. Check units, role assignment, or split the build-up into separate layers if needed."
    );
    expect(scenario.warnings).toContain(
      "Partition width 20000 mm is outside the guided sanity band of 1500 to 15000 mm. Check that the value is in millimetres."
    );
    expect(scenario.warnings).toContain(
      "Partition height 9000 mm is outside the guided sanity band of 1500 to 6000 mm. Check that the value is in millimetres."
    );
    expect(scenario.warnings).toContain(
      "Receiving-room volume 1600 m³ is outside the guided sanity band of 5 to 1000 m³. Check that the value reflects the real receiving space."
    );
    expect(scenario.warnings).toContain(
      "RT60 8 s is outside the guided sanity band of 0.2 to 5 s. Recheck the measurement or assumption before trusting a standardized field read."
    );
    expect(scenario.warnings).toContain(
      "Impact receiving-room volume 1600 m³ is outside the guided sanity band of 5 to 1000 m³. Check that the value reflects the receiving room used for field standardization."
    );
    expect(scenario.warnings).toContain(
      "Field K correction 28 dB is outside the guided sanity band of -15 to 20 dB. Recheck the correction source before trusting carried field impact values."
    );
  });

  it("uses material-aware thickness bands before the global fallback", () => {
    const scenario = evaluateScenario({
      id: "material-aware-bands",
      name: "material-aware-bands",
      rows: [
        { floorRole: "floor_covering", id: "tile", materialId: "ceramic_tile", thicknessMm: "50" },
        { floorRole: "resilient_layer", id: "resilient", materialId: "generic_resilient_underlay", thicknessMm: "60" },
        { floorRole: "base_structure", id: "base", materialId: "concrete", thicknessMm: "20" }
      ],
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(scenario.warnings).toContain(
      "Layer 1 thickness 50 mm is outside the guided sanity band of 4 to 20 mm for Ceramic Tile in the floor covering role. Check units, role assignment, or split the build-up into separate layers if needed."
    );
    expect(scenario.warnings).toContain(
      "Layer 2 thickness 60 mm is outside the guided sanity band of 3 to 30 mm for Generic Resilient Underlay in the resilient layer role. Check units, role assignment, or split the build-up into separate layers if needed."
    );
    expect(scenario.warnings).toContain(
      "Layer 3 thickness 20 mm is outside the guided sanity band of 80 to 250 mm for Concrete in the base structure role. Check units, role assignment, or split the build-up into separate layers if needed."
    );
  });

  it("explains when an official product stays off the active lane because only exact-row support exists locally", () => {
    const scenario = evaluateScenario({
      id: "official-product-near-miss",
      name: "official-product-near-miss",
      rows: [
        { floorRole: "floor_covering", id: "a", materialId: "ceramic_tile", thicknessMm: "8" },
        { floorRole: "floating_screed", id: "b", materialId: "screed", thicknessMm: "50" },
        { floorRole: "resilient_layer", id: "c", materialId: "regupol_sonus_multi_4_5", thicknessMm: "8" },
        { floorRole: "base_structure", id: "d", materialId: "concrete", thicknessMm: "150" }
      ],
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(scenario.result).not.toBeNull();
    expect(scenario.result?.impactCatalogMatch).toBeNull();
    expect(scenario.warnings).toContain(
      "REGUPOL sonus multi 4.5 is in the stack, but no official product row matched the current topology and no generic dynamic stiffness fallback is available for this product. DynEcho kept the result on the broader predictor/family lane instead of inventing product-backed impact credit."
    );
  });

  it("warns when duplicate single-entry floor roles keep visible-layer predictor matching parked", () => {
    const scenario = evaluateScenario({
      id: "duplicate-upper-fill-role",
      name: "duplicate-upper-fill-role",
      rows: [
        { floorRole: "ceiling_board", id: "a", materialId: "gypsum_board", thicknessMm: "13" },
        { floorRole: "ceiling_board", id: "b", materialId: "gypsum_board", thicknessMm: "13" },
        { floorRole: "ceiling_fill", id: "c", materialId: "rockwool", thicknessMm: "100" },
        { floorRole: "ceiling_cavity", id: "d", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
        { floorRole: "floor_covering", id: "e", materialId: "laminate_flooring", thicknessMm: "8" },
        { floorRole: "resilient_layer", id: "f", materialId: "eps_underlay", thicknessMm: "3" },
        { floorRole: "upper_fill", id: "g", materialId: "generic_fill", thicknessMm: "30" },
        { floorRole: "upper_fill", id: "h", materialId: "bonded_chippings", thicknessMm: "20" },
        { floorRole: "floating_screed", id: "i", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "60" },
        { floorRole: "base_structure", id: "j", materialId: "open_box_timber_slab", thicknessMm: "370" }
      ],
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(scenario.result).not.toBeNull();
    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.floorSystemEstimate?.kind).not.toBe("family_archetype");
    expect(scenario.result?.floorSystemEstimate?.fitPercent).toBe(54);
    expect(scenario.result?.floorSystemEstimate?.notes.some((note: string) => /Archetype-level family matching was withheld/i.test(note))).toBe(
      true
    );
    expect(
      scenario.result?.floorSystemEstimate?.notes.some((note: string) =>
        /Displayed fit was capped from 87.5% to 54%/i.test(note)
      )
    ).toBe(true);
    expect(
      scenario.warnings.some((warning) =>
        /Visible-layer predictor matching is parked because single-entry floor roles are duplicated: upper fill x2/i.test(
          warning
        )
      )
    ).toBe(true);
  });

  it("keeps split same-material upper-fill schedules off the archetype lane", () => {
    const scenario = evaluateScenario({
      id: "split-same-upper-fill-role",
      name: "split-same-upper-fill-role",
      rows: [
        { floorRole: "ceiling_board", id: "a", materialId: "gypsum_board", thicknessMm: "13" },
        { floorRole: "ceiling_board", id: "b", materialId: "gypsum_board", thicknessMm: "13" },
        { floorRole: "ceiling_fill", id: "c", materialId: "rockwool", thicknessMm: "100" },
        { floorRole: "ceiling_cavity", id: "d", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
        { floorRole: "floor_covering", id: "e", materialId: "laminate_flooring", thicknessMm: "8" },
        { floorRole: "upper_fill", id: "f", materialId: "generic_fill", thicknessMm: "30" },
        { floorRole: "resilient_layer", id: "g", materialId: "eps_underlay", thicknessMm: "3" },
        { floorRole: "upper_fill", id: "h", materialId: "generic_fill", thicknessMm: "20" },
        { floorRole: "floating_screed", id: "i", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "60" },
        { floorRole: "base_structure", id: "j", materialId: "open_box_timber_slab", thicknessMm: "370" }
      ],
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(scenario.result).not.toBeNull();
    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.floorSystemEstimate?.kind).toBe("family_general");
    expect(scenario.result?.floorSystemEstimate?.fitPercent).toBe(54);
    expect(
      scenario.result?.floorSystemEstimate?.notes.some((note: string) =>
        /single-entry roles are duplicated or split in the visible stack: upper fill x2 \(Generic Fill\)/i.test(note)
      )
    ).toBe(true);
    expect(
      scenario.warnings.some((warning) =>
        /Visible-layer predictor matching is parked because single-entry floor roles are duplicated: upper fill x2 \(Generic Fill\)/i.test(
          warning
        )
      )
    ).toBe(true);
  });

  it("keeps split same-material resilient schedules off the curated exact lane", () => {
    const scenario = evaluateScenario({
      id: "split-same-resilient-role",
      name: "split-same-resilient-role",
      rows: [
        { floorRole: "ceiling_board", id: "a", materialId: "gypsum_board", thicknessMm: "13" },
        { floorRole: "ceiling_board", id: "b", materialId: "gypsum_board", thicknessMm: "13" },
        { floorRole: "ceiling_fill", id: "c", materialId: "rockwool", thicknessMm: "100" },
        { floorRole: "ceiling_cavity", id: "d", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
        { floorRole: "floor_covering", id: "e", materialId: "laminate_flooring", thicknessMm: "8" },
        { floorRole: "resilient_layer", id: "f", materialId: "eps_underlay", thicknessMm: "1.5" },
        { floorRole: "upper_fill", id: "g", materialId: "generic_fill", thicknessMm: "50" },
        { floorRole: "resilient_layer", id: "h", materialId: "eps_underlay", thicknessMm: "1.5" },
        { floorRole: "floating_screed", id: "i", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "60" },
        { floorRole: "base_structure", id: "j", materialId: "open_box_timber_slab", thicknessMm: "370" }
      ],
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(scenario.result).not.toBeNull();
    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.floorSystemEstimate?.kind).toBe("family_general");
    expect(scenario.result?.floorSystemEstimate?.fitPercent).toBe(54);
    expect(
      scenario.warnings.some((warning) =>
        /Visible-layer predictor matching is parked because single-entry floor roles are duplicated: resilient layer x2 \(EPS Underlay\)/i.test(
          warning
        )
      )
    ).toBe(true);
  });

  const publishedExactBenchmarks = [
    {
      presetId: "knauf_acoustic_mount_exact" as const,
      publishedLabel: "Knauf CT120.1C",
      publishedLnW: 61,
      publishedRw: 61,
      toleranceDb: { lnW: 0, rw: 1 }
    },
    {
      presetId: "dataholz_dry_floor_exact" as const,
      publishedLabel: "Dataholz GDRTXN02B-08",
      publishedLnW: 62,
      publishedLnWPlusCI: 64,
      publishedRw: 60,
      toleranceDb: { lnW: 0, lnWPlusCI: 0, rw: 0 }
    },
    {
      presetId: "hollow_core_vinyl_exact" as const,
      publishedLabel: "Pliteq HCP 200 + vinyl + RST05 + GenieClip",
      publishedLnW: 48,
      publishedRw: 62,
      toleranceDb: { lnW: 0, rw: 0 }
    },
    {
      presetId: "knauf_concrete_exact" as const,
      publishedLabel: "Knauf CC60.1A",
      publishedLnW: 51,
      publishedRw: 63,
      toleranceDb: { lnW: 0, rw: 0 }
    }
  ];

  for (const benchmark of publishedExactBenchmarks) {
    it(`keeps ${benchmark.publishedLabel} within the published companion-value tolerance band`, () => {
      const scenario = evaluatePresetScenario(benchmark.presetId);

      expect(scenario.result).not.toBeNull();
      expect(scenario.result?.floorSystemMatch).not.toBeNull();
      expect(scenario.warnings).not.toContain("Screening estimate only. This result is coming from the local calibrated seed lane.");
      expect(
        scenario.warnings
      ).not.toContain(
        "Derived C, Ctr, and STC values are currently built from a calibrated mass-law curve anchored to the screening Rw estimate."
      );
      expect(scenario.warnings[0]).toMatch(/^Curated exact floor-system match active:/);
      expect(scenario.warnings[1]).toBe(EXACT_FLOOR_FAMILY_CURVE_NOTE);

      const liveRw = scenario.result?.floorSystemRatings?.Rw ?? null;
      const liveLnW = scenario.result?.impact?.LnW ?? null;
      const liveLnWPlusCI = scenario.result?.impact?.LnWPlusCI ?? null;

      expect(liveRw).not.toBeNull();
      expect(liveLnW).not.toBeNull();
      expect(Math.abs(liveRw! - benchmark.publishedRw)).toBeLessThanOrEqual(benchmark.toleranceDb.rw);
      expect(Math.abs(liveLnW! - benchmark.publishedLnW)).toBeLessThanOrEqual(benchmark.toleranceDb.lnW);

      if (typeof benchmark.publishedLnWPlusCI === "number") {
        expect(liveLnWPlusCI).not.toBeNull();
        expect(Math.abs(liveLnWPlusCI! - benchmark.publishedLnWPlusCI)).toBeLessThanOrEqual(
          benchmark.toleranceDb.lnWPlusCI ?? 0
        );
      }
    });
  }

  it("keeps published exact and bound presets off curated lanes when a single-entry role is split into a disjoint second schedule", () => {
    const failures: string[] = [];
    const presetIds: readonly PresetId[] = [
      ...publishedExactBenchmarks.map((benchmark) => benchmark.presetId),
      "ubiq_open_web_300_bound",
      "ubiq_steel_200_unspecified_bound",
      "ubiq_steel_300_unspecified_bound"
    ];

    for (const presetId of presetIds) {
      const preset = getPresetById(presetId);
      const baselineRows = preset.rows.map((row, index) => ({ ...row, id: `${preset.id}-${index + 1}` }));
      const splitRows = buildDisjointSplitRows(baselineRows);
      if (!splitRows) {
        failures.push(`${presetId}: could not build a disjoint split regression row set`);
        continue;
      }

      const baselineScenario = evaluateScenario({
        id: preset.id,
        name: preset.label,
        rows: baselineRows,
        source: "current",
        studyMode: "floor",
        targetOutputs: ["Rw", "Ln,w", "Ln,w+CI"]
      });
      const splitScenario = evaluateScenario({
        id: `${preset.id}-split-regression`,
        name: `${preset.label} split regression`,
        rows: splitRows,
        source: "current",
        studyMode: "floor",
        targetOutputs: ["Rw", "Ln,w", "Ln,w+CI"]
      });

      if (!baselineScenario.result || !splitScenario.result) {
        failures.push(`${presetId}: expected both baseline and split scenarios to evaluate`);
        continue;
      }

      if (!baselineScenario.result.floorSystemMatch && !baselineScenario.result.lowerBoundImpact) {
        failures.push(`${presetId}: expected baseline preset to begin on an exact or bound lane`);
      }

      if (splitScenario.result.floorSystemMatch) {
        failures.push(`${presetId}: disjoint split should not keep the curated exact lane live`);
      }

      if (splitScenario.result.boundFloorSystemMatch || splitScenario.result.boundFloorSystemEstimate || splitScenario.result.lowerBoundImpact) {
        failures.push(`${presetId}: disjoint split should not keep the curated or published bound lane live`);
      }

      if (!splitScenario.warnings.some((warning) => /single-entry floor roles are duplicated/i.test(warning))) {
        failures.push(`${presetId}: expected predictor blocker warning after disjoint split`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps the steel suspended sample on the low-confidence fallback lane with explicit warning copy", () => {
    const scenario = evaluatePresetScenario("steel_suspended_fallback");

    expect(scenario.result).not.toBeNull();
    expect(scenario.result?.dynamicImpactTrace?.estimateTier).toBe("low_confidence");
    expect(scenario.warnings).toContain(LOW_CONFIDENCE_FLOOR_FAMILY_NOTE);
    expect(scenario.warnings).toContain(
      "Screening estimate only. This result is coming from the local calibrated seed lane."
    );
    expect(scenario.warnings).toContain(
      "Derived C, Ctr, and STC values are currently built from a calibrated mass-law curve anchored to the screening Rw estimate."
    );
  });

  it("keeps timber bare-floor low-confidence lane live with exposed airborne companions on the same fallback family", () => {
    const scenario = evaluatePresetScenario("timber_bare_impact_only_fallback");

    expect(scenario.result).not.toBeNull();
    expect(scenario.result?.dynamicImpactTrace?.estimateTier).toBe("low_confidence");
    expect(scenario.result?.floorSystemRatings).toEqual({
      Rw: 51.6,
      RwCtr: 31.1,
      basis: "predictor_floor_system_low_confidence_estimate"
    });
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI", "STC", "C", "Ctr"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual([]);
    expect(scenario.warnings).toContain(IMPACT_ONLY_LOW_CONFIDENCE_FLOOR_FAMILY_NOTE);
    expect(scenario.warnings).toContain(
      "Screening estimate only. This result is coming from the local calibrated seed lane."
    );
  });

  it("moves the timber bare-floor sample into a narrower family lane once a ceiling-side helper package is appended", () => {
    const preset = getPresetById("timber_bare_impact_only_fallback");
    const scenario = evaluateScenario({
      id: `${preset.id}-with-ceiling-board`,
      name: `${preset.label} with ceiling board`,
      rows: [
        ...preset.rows.map((row, index) => ({ ...row, id: `${preset.id}-${index + 1}` })),
        {
          id: `${preset.id}-ceiling-board`,
          floorRole: "ceiling_board",
          materialId: "impactstop_board",
          thicknessMm: "13"
        }
      ],
      source: "current",
      studyMode: "floor",
      targetOutputs: ["Rw", "Ln,w", "Ln,w+CI"]
    });

    expect(scenario.result).not.toBeNull();
    expect(scenario.result?.dynamicImpactTrace?.estimateTier).toBe("family_archetype");
    expect(scenario.result?.impact?.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(49.8);
    expect(scenario.warnings).not.toContain(IMPACT_ONLY_LOW_CONFIDENCE_FLOOR_FAMILY_NOTE);
  });

  it("moves the lightweight-steel crossover bound into a narrower supported steel lane once the carrier is fixed", () => {
    const preset = getPresetById("ubiq_steel_300_unspecified_bound");
    const baseRows = preset.rows.map((row, index) => ({ ...row, id: `${preset.id}-${index + 1}` }));
    const unspecifiedScenario = evaluateScenario({
      id: preset.id,
      name: preset.label,
      rows: baseRows,
      source: "current",
      studyMode: "floor",
      targetOutputs: ["Rw", "Ln,w", "Ln,w+CI"]
    });
    const narrowedScenario = evaluateScenario({
      id: `${preset.id}-open-web`,
      name: `${preset.label} narrowed`,
      rows: baseRows.map((row) =>
        row.floorRole === "base_structure" ? { ...row, materialId: "open_web_steel_floor" } : row
      ),
      source: "current",
      studyMode: "floor",
      targetOutputs: ["Rw", "Ln,w", "Ln,w+CI"]
    });

    expect(unspecifiedScenario.result?.lowerBoundImpact?.basis).toBe(
      "predictor_lightweight_steel_missing_support_form_bound_estimate"
    );
    expect(narrowedScenario.result?.lowerBoundImpact?.basis).toBe("official_floor_system_bound_support");
    expect(narrowedScenario.warnings.some((warning) => /support form was left unspecified/i.test(warning))).toBe(false);
  });

  it("keeps converged 200 mm lightweight-steel support envelopes off the crossover warning lane", () => {
    const preset = getPresetById("ubiq_steel_200_unspecified_bound");
    const scenario = evaluateScenario({
      id: preset.id,
      name: preset.label,
      rows: preset.rows.map((row, index) => ({ ...row, id: `${preset.id}-${index + 1}` })),
      source: "current",
      studyMode: "floor",
      targetOutputs: ["Rw", "Ln,w", "Ln,w+CI"]
    });

    expect(scenario.result?.lowerBoundImpact?.basis).toBe("predictor_lightweight_steel_bound_interpolation_estimate");
    expect(scenario.result?.lowerBoundImpact?.LnWUpperBound).toBe(53);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(62);
    expect(scenario.warnings.some((warning) => /support form was left unspecified/i.test(warning))).toBe(false);
  });

  it("withholds the converged 200 mm lightweight-steel bound lane when floor covering is duplicated into a disjoint second schedule", () => {
    const preset = getPresetById("ubiq_steel_200_unspecified_bound");
    const baseRows = preset.rows.map((row, index) => ({ ...row, id: `${preset.id}-${index + 1}` }));
    const ambiguousRows = [
      ...baseRows.slice(0, 5),
      {
        floorRole: "floor_covering" as const,
        id: `${preset.id}-dup-cover`,
        materialId: "engineered_timber_with_acoustic_underlay",
        thicknessMm: "20"
      },
      baseRows[5]!
    ];

    const baselineScenario = evaluateScenario({
      id: preset.id,
      name: preset.label,
      rows: baseRows,
      source: "current",
      studyMode: "floor",
      targetOutputs: ["Rw", "Ln,w", "Ln,w+CI"]
    });
    const ambiguousScenario = evaluateScenario({
      id: `${preset.id}-duplicate-covering`,
      name: `${preset.label} duplicate covering`,
      rows: ambiguousRows,
      source: "current",
      studyMode: "floor",
      targetOutputs: ["Rw", "Ln,w", "Ln,w+CI"]
    });

    expect(baselineScenario.result?.lowerBoundImpact?.basis).toBe("predictor_lightweight_steel_bound_interpolation_estimate");
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

  it("keeps the workspace live when a field-context number is invalid instead of crashing scenario evaluation", () => {
    const scenario = evaluateScenario({
      id: "invalid-field-context",
      impactFieldContext: {
        directPathOffsetDb: Number.NaN
      },
      name: "invalid field context",
      rows: [
        { floorRole: "floor_covering", id: "a", materialId: "ceramic_tile", thicknessMm: "8" },
        { floorRole: "floating_screed", id: "b", materialId: "screed", thicknessMm: "50" },
        { floorRole: "resilient_layer", id: "c", materialId: "generic_resilient_underlay", thicknessMm: "8" },
        { floorRole: "base_structure", id: "d", materialId: "concrete", thicknessMm: "150" }
      ],
      source: "current",
      studyMode: "floor",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(scenario.result).toBeNull();
    expect(
      scenario.warnings.some((warning) =>
        warning.includes("DynEcho could not evaluate the current scenario and kept the workspace live instead of crashing.")
      )
    ).toBe(true);
    expect(scenario.warnings.some((warning) => warning.includes("Expected number, received nan"))).toBe(true);
  });
});
