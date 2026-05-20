import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type {
  ExactFloorSystem,
  FloorRole,
  FloorSystemRoleCriteria,
  ImpactFieldContext,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberExactOnlyHybridFragmentationPolicyContract
} from "./broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy";
import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTION_STATUS
} from "./broad-accuracy-floor-open-box-timber-similarity-coverage-refresh";
import { evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor } from "./broad-accuracy-floor-open-box-timber-similarity-formula-corridor";
import { calculateAssembly } from "./calculate-assembly";

type RouteSnapshot = {
  readonly candidateIds: readonly string[] | null;
  readonly exactMatchId: string | null;
  readonly impactBasis: string | null;
  readonly lPrimeNT50: number | null;
  readonly lPrimeNTw: number | null;
  readonly lPrimeNW: number | null;
  readonly lnW: number | null;
  readonly lnWPlusCI: number | null;
  readonly ratingsBasis: string | null;
  readonly rw: number | null;
  readonly supported: readonly RequestedOutputId[];
  readonly unsupported: readonly RequestedOutputId[];
};

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const EXACT_ONLY_HYBRID_SOURCE_IDS = [
  "tuas_r7b_open_box_timber_measured_2026",
  "tuas_r8b_open_box_timber_measured_2026",
  "tuas_r9b_open_box_timber_measured_2026",
  "tuas_r2c_open_box_timber_measured_2026",
  "tuas_r10a_open_box_timber_measured_2026"
] as const;

const LAB_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];
const FORMULA_OUTPUTS = ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "IIC"] as const satisfies readonly RequestedOutputId[];

const FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const ROLE_ORDER = [
  "ceiling_board",
  "ceiling_fill",
  "ceiling_cavity",
  "floor_covering",
  "resilient_layer",
  "upper_fill",
  "floating_screed",
  "base_structure"
] as const satisfies readonly FloorRole[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-coverage-refresh.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-coverage-refresh-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-runtime-corridor.ts",
  "packages/engine/src/tuas-open-box-same-package-fragmentation-design.test.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts",
  "docs/calculator/CHECKPOINT_2026-05-20_BROAD_ACCURACY_REVALIDATION_AND_OPEN_BOX_FRAGMENTATION_PLAN.md",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "AGENTS.md"
] as const;

const DOC_ALIGNMENT_SURFACES = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-20_BROAD_ACCURACY_REVALIDATION_AND_OPEN_BOX_FRAGMENTATION_PLAN.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function splitThickness(thicknessMm: number): readonly number[] {
  if (thicknessMm <= 2) {
    return [thicknessMm];
  }

  const first = Math.floor(thicknessMm / 2);
  return [first, thicknessMm - first];
}

function criteriaToLayers(
  role: FloorRole,
  criteria: FloorSystemRoleCriteria | undefined,
  options: { readonly fragment: boolean }
): readonly LayerInput[] {
  if (!criteria) {
    return [];
  }

  if (criteria.materialScheduleIds || criteria.thicknessScheduleMm) {
    const materialSchedule = criteria.materialScheduleIds ?? criteria.materialIds ?? [];
    const thicknessSchedule = criteria.thicknessScheduleMm ?? [];

    return thicknessSchedule.map((thicknessMm, index) => ({
      floorRole: role,
      materialId: materialSchedule[index] ?? materialSchedule[0] ?? criteria.materialIds?.[0] ?? "generic_fill",
      thicknessMm
    }));
  }

  const materialId = criteria.materialIds?.[0] ?? "generic_fill";
  const baseThicknessMm = criteria.thicknessMm ?? 1;
  const layerCount = criteria.layerCount ?? 1;

  return Array.from({ length: layerCount }).flatMap(() => {
    const schedule = options.fragment ? splitThickness(baseThicknessMm) : [baseThicknessMm];

    return schedule.map((thicknessMm) => ({
      floorRole: role,
      materialId,
      thicknessMm
    }));
  });
}

function layersFromSystem(system: ExactFloorSystem, options: { readonly fragment: boolean }): readonly LayerInput[] {
  return ROLE_ORDER.flatMap((role) => {
    const criteria =
      role === "base_structure"
        ? system.match.baseStructure
        : role === "ceiling_board"
          ? system.match.ceilingBoard
          : role === "ceiling_cavity"
            ? system.match.ceilingCavity
            : role === "ceiling_fill"
              ? system.match.ceilingFill
              : role === "floating_screed"
                ? system.match.floatingScreed
                : role === "floor_covering"
                  ? system.match.floorCovering
                  : role === "resilient_layer"
                    ? system.match.resilientLayer
                    : system.match.upperFill;

    return criteriaToLayers(role, criteria, options);
  });
}

function snapshot(
  layers: readonly LayerInput[],
  options: {
    readonly impactFieldContext?: ImpactFieldContext;
    readonly targetOutputs: readonly RequestedOutputId[];
  }
): RouteSnapshot {
  const result = calculateAssembly(layers, options);

  return {
    candidateIds: result.impact?.estimateCandidateIds ?? null,
    exactMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    lPrimeNT50: result.impact?.LPrimeNT50 ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    ratingsBasis: result.floorSystemRatings?.basis ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

function getExactOnlyRows(): readonly ExactFloorSystem[] {
  return EXACT_ONLY_HYBRID_SOURCE_IDS.map((sourceId) => {
    const system = EXACT_FLOOR_SYSTEMS.find((candidate) => candidate.id === sourceId);

    if (!system) {
      throw new Error(`Missing TUAS open-box exact-only row ${sourceId}`);
    }

    return system;
  });
}

describe("broad accuracy floor open-box timber exact-only hybrid fragmentation policy contract", () => {
  it("lands a no-runtime policy gate and selects raw-bare reopening guard next", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberExactOnlyHybridFragmentationPolicyContract();

    expect(contract).toMatchObject({
      exactMeasuredRowsRemainPrecedence: true,
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_LANDED_GATE,
      noRuntimeValueMovement: true,
      residualAdmissionAllowedThisGate: false,
      runtimePromotionAllowedInGate: false,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTION_STATUS,
      toleranceMovementAllowed: false
    });
    expect(contract.previousCoverageRefresh).toEqual({
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTION_STATUS
    });
    expect(contract.basisAliasBlocked).toEqual({
      astmIicAiic: true,
      buildingPrediction: true,
      fieldImpact: true,
      labAirborneFieldAliases: true
    });
    expect(contract.negativeBoundaries).toContain(
      "raw_bare_open_box_reopening_is_deferred_to_the_selected_next_guard"
    );

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("classifies the five exact-only hybrid and fragmented TUAS packets without runtime admission", () => {
    const rows = buildBroadAccuracyFloorOpenBoxTimberExactOnlyHybridFragmentationPolicyContract().policyRows;

    expect(rows.map((row) => row.sourceId)).toEqual(EXACT_ONLY_HYBRID_SOURCE_IDS);
    expect(rows.map((row) => [row.sourceId, row.packageId, row.policyDecision, row.residualAdmissionStatus])).toEqual([
      [
        "tuas_r7b_open_box_timber_measured_2026",
        "eps_screed_or_hybrid_upper",
        "exact_only_hybrid_residual_evidence_lower_wet_dry_owner_required",
        "blocked_owner_gap"
      ],
      [
        "tuas_r8b_open_box_timber_measured_2026",
        "eps_screed_or_hybrid_upper",
        "partial_finish_no_finish_residual_boundary",
        "residual_readiness_only"
      ],
      [
        "tuas_r9b_open_box_timber_measured_2026",
        "eps_screed_or_hybrid_upper",
        "screed_only_hybrid_residual_boundary",
        "residual_readiness_only"
      ],
      [
        "tuas_r2c_open_box_timber_measured_2026",
        "eps_screed_or_hybrid_upper",
        "lower_ceiling_interaction_missing_mass_boundary",
        "blocked_owner_gap"
      ],
      [
        "tuas_r10a_open_box_timber_measured_2026",
        "mixed_staged_upper",
        "mixed_staged_upper_package_owner_gap",
        "blocked_owner_gap"
      ]
    ]);
    expect(rows.map((row) => [row.sourceId, row.absentRoles])).toEqual([
      ["tuas_r7b_open_box_timber_measured_2026", []],
      ["tuas_r8b_open_box_timber_measured_2026", ["floor_covering", "resilient_layer"]],
      ["tuas_r9b_open_box_timber_measured_2026", ["upper_fill"]],
      ["tuas_r2c_open_box_timber_measured_2026", ["ceiling_fill", "upper_fill", "floating_screed"]],
      ["tuas_r10a_open_box_timber_measured_2026", []]
    ]);

    const expectedMetrics = {
      tuas_r7b_open_box_timber_measured_2026: {
        CI: 0,
        CI50_2500: 1,
        LnW: 47,
        LnWPlusCI: 47,
        Rw: 72,
        RwPlusC: 70.726430817278
      },
      tuas_r8b_open_box_timber_measured_2026: {
        CI: -1,
        CI50_2500: 0,
        LnW: 50,
        LnWPlusCI: 49,
        Rw: 72,
        RwPlusC: 70.60101885694094
      },
      tuas_r9b_open_box_timber_measured_2026: {
        CI: 1,
        CI50_2500: 3,
        LnW: 45,
        LnWPlusCI: 46,
        Rw: 68,
        RwPlusC: 67.01756572323127
      },
      tuas_r2c_open_box_timber_measured_2026: {
        CI: 0,
        CI50_2500: 0,
        LnW: 70,
        LnWPlusCI: 70,
        Rw: 54,
        RwPlusC: 53.34048310542768
      },
      tuas_r10a_open_box_timber_measured_2026: {
        CI: 0,
        CI50_2500: 1,
        LnW: 55,
        LnWPlusCI: 55,
        Rw: 56,
        RwPlusC: 50.89680103538985
      }
    } as const;

    for (const row of rows) {
      const expected = expectedMetrics[row.sourceId];

      expect(row).toMatchObject({
        exactSourcePrecedence: true,
        fragmentedExactEquivalenceMustStayExact: true,
        runtimeAnchorAdmission: "blocked",
        toleranceMovementAllowed: false
      });
      expect(row.measuredMetrics).toMatchObject({
        CI: expected.CI,
        CI50_2500: expected.CI50_2500,
        LnW: expected.LnW,
        LnWPlusCI: expected.LnWPlusCI,
        Rw: expected.Rw
      });
      expect(row.measuredMetrics.RwPlusC).toBeCloseTo(expected.RwPlusC, 9);
      expect(row.requiredOwnersBeforeAdmission.length).toBeGreaterThanOrEqual(3);
      expect(row.blockedRuntimeReason).toMatch(/runtime|transfer|calibrate|anchor|average|package/u);
    }
  });

  it("keeps exact-only rows out of package-transfer runtime anchors and freezes supported runtime pins", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberExactOnlyHybridFragmentationPolicyContract();

    expect(contract.excludedRuntimeAnchorSourceIds).toEqual(EXACT_ONLY_HYBRID_SOURCE_IDS);
    for (const sourceId of EXACT_ONLY_HYBRID_SOURCE_IDS) {
      expect(contract.runtimeAnchorSourceIds).not.toContain(sourceId);
    }
    expect(contract.runtimePinsFrozen).toEqual([
      {
        anchorSourceIds: [
          "tuas_r3a_open_box_timber_measured_2026",
          "tuas_r3b_open_box_timber_measured_2026",
          "tuas_r5a_open_box_timber_measured_2026",
          "tuas_r5b_open_box_timber_measured_2026"
        ],
        CI: 1.3,
        CI50_2500: 3.3,
        id: "source_absent_dry_gypsum_fiber_upper_mid_packet",
        LnW: 50.8,
        LnWPlusCI: 52,
        packageId: "dry_gypsum_fiber_upper",
        Rw: 66,
        RwPlusC: 62.1
      },
      {
        anchorSourceIds: [
          "tuas_r2a_open_box_timber_measured_2026",
          "tuas_r2b_open_box_timber_measured_2026"
        ],
        CI: 1.5,
        CI50_2500: 3.5,
        id: "source_absent_thin_laminate_eps_no_upper_packet",
        LnW: 53.5,
        LnWPlusCI: 55,
        packageId: "thin_laminate_eps_no_upper",
        Rw: 55.5,
        RwPlusC: 52.3
      },
      {
        anchorSourceIds: [
          "tuas_r6a_open_box_timber_measured_2026",
          "tuas_r6b_open_box_timber_measured_2026"
        ],
        CI: 0.5,
        CI50_2500: 2,
        id: "source_absent_reinforced_ceiling_laminate_packet",
        LnW: 53.5,
        LnWPlusCI: 54,
        packageId: "reinforced_ceiling_laminate",
        Rw: 63.5,
        RwPlusC: 61.6
      }
    ]);
  });

  it("keeps formula evaluation blocked for exact-only hybrid and mixed staged packets", () => {
    const exactOnly = evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor({
      finishPairState: "complete_laminate_eps",
      packageId: "eps_screed_or_hybrid_upper",
      roleTopologyState: "source_equivalent",
      supportFamily: "open_box_timber",
      targetOutputs: FORMULA_OUTPUTS
    });
    const mixedStaged = evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor({
      finishPairState: "complete_laminate_eps",
      packageId: "mixed_staged_upper",
      roleTopologyState: "source_equivalent",
      supportFamily: "open_box_timber",
      targetOutputs: FORMULA_OUTPUTS
    });

    expect(exactOnly).toMatchObject({
      blockedFormulaOutputs: ["L'n,w", "IIC"],
      blockedSourceIds: [
        "tuas_r7b_open_box_timber_measured_2026",
        "tuas_r8b_open_box_timber_measured_2026",
        "tuas_r9b_open_box_timber_measured_2026",
        "tuas_r2c_open_box_timber_measured_2026"
      ],
      corridorStatus: "blocked_exact_only_hybrid_transfer",
      runtimePromotionAllowedInGate: false,
      runtimeValues: { CI: null, CI50_2500: null, LnW: null, LnWPlusCI: null, Rw: null, RwPlusC: null }
    });
    expect(mixedStaged).toMatchObject({
      blockedFormulaOutputs: ["L'n,w", "IIC"],
      blockedSourceIds: ["tuas_r10a_open_box_timber_measured_2026"],
      corridorStatus: "blocked_mixed_staged_no_predictor_rows",
      runtimePromotionAllowedInGate: false,
      runtimeValues: { CI: null, CI50_2500: null, LnW: null, LnWPlusCI: null, Rw: null, RwPlusC: null }
    });
  });

  it("keeps source-equivalent fragmentation exact for lab and field routes on those five rows", () => {
    const failures: string[] = [];
    const rows = getExactOnlyRows();

    expect(rows).toHaveLength(5);

    for (const system of rows) {
      const canonicalLab = snapshot(layersFromSystem(system, { fragment: false }), { targetOutputs: LAB_OUTPUTS });
      const fragmentedLab = snapshot(layersFromSystem(system, { fragment: true }), { targetOutputs: LAB_OUTPUTS });
      const canonicalField = snapshot(layersFromSystem(system, { fragment: false }), {
        impactFieldContext: FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });
      const fragmentedField = snapshot(layersFromSystem(system, { fragment: true }), {
        impactFieldContext: FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });

      if (canonicalLab.exactMatchId !== system.id) {
        failures.push(`${system.id}: canonical lab stack missed exact row`);
      }

      if (JSON.stringify(fragmentedLab) !== JSON.stringify(canonicalLab)) {
        failures.push(`${system.id}: fragmented lab stack drifted from canonical exact route`);
      }

      if (canonicalField.exactMatchId !== system.id) {
        failures.push(`${system.id}: canonical field stack missed exact row`);
      }

      if (JSON.stringify(fragmentedField) !== JSON.stringify(canonicalField)) {
        failures.push(`${system.id}: fragmented field stack drifted from canonical exact route`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps docs, exports, and current-gate list aligned to the landed policy", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(
        BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_LANDED_GATE
      );
      expect(contents, path).toContain(
        BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTION_STATUS
      );
      expect(contents, path).toContain(
        BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_FILE
      );
      expect(contents, path).toContain("raw-bare");
      expect(contents, path).toContain("no-runtime");
      expect(contents, path).toContain("field/building");
      expect(contents, path).toContain("ASTM/IIC");
      expect(contents, path).toContain("Ln,w 50.8");
      expect(contents, path).toContain("CI,50-2500 3.3");
      expect(contents, path).toContain("Rw 66");
    }

    expect(readRepoFile("packages/engine/src/index.ts")).toContain(
      'export * from "./broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy";'
    );
    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy-contract.test.ts"
    );
  });
});
