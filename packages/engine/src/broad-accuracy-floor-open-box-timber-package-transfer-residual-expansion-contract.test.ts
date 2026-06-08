import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type {
  ExactFloorSystem,
  FloorRole,
  FloorSystemRoleCriteria,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberExactOnlyHybridFragmentationPolicyContract,
  type BroadAccuracyFloorOpenBoxTimberExactOnlyHybridSourceId
} from "./broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy";
import {
  buildBroadAccuracyFloorOpenBoxTimberSimilarityRuntimeCorridorContract
} from "./broad-accuracy-floor-open-box-timber-similarity-runtime-corridor";
import { evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor } from "./broad-accuracy-floor-open-box-timber-similarity-formula-corridor";
import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_PACKAGE_TRANSFER_RESIDUAL_EXPANSION_LANDED_GATE =
  "broad_accuracy_floor_open_box_timber_package_transfer_residual_expansion_plan";

const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_PACKAGE_TRANSFER_RESIDUAL_EXPANSION_SELECTION_STATUS =
  "broad_accuracy_floor_open_box_timber_package_transfer_residual_expansion_landed_no_runtime_selected_eps_screed_hybrid_package_owner";

const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_PACKAGE_TRANSFER_RESIDUAL_EXPANSION_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_owner_plan";

const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_PACKAGE_TRANSFER_RESIDUAL_EXPANSION_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-owner-contract.test.ts";

const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_PACKAGE_TRANSFER_RESIDUAL_EXPANSION_SELECTED_NEXT_LABEL =
  "floor open-box timber EPS/screed hybrid package owner";

const LAB_OUTPUTS = ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"] as const satisfies readonly RequestedOutputId[];
const BLOCKED_OUTPUTS = ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "IIC"] as const satisfies readonly RequestedOutputId[];

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
  "packages/engine/src/broad-accuracy-floor-open-box-timber-package-transfer-residual-expansion-contract.test.ts",
  "packages/engine/src/broad-accuracy-post-raw-bare-open-box-timber-coverage-revalidation-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-runtime-corridor.ts",
  "packages/engine/src/open-box-timber-similarity-estimate.ts",
  "tools/dev/run-calculator-current-gate.ts",
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
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md"
] as const;

type ResidualExpansionRow = {
  readonly admission: "blocked_negative_boundary" | "candidate_owner_gap" | "residual_readiness_only";
  readonly currentRuntimeAdmission: "blocked";
  readonly exactSourcePrecedence: true;
  readonly metricResidualsAgainstDryPackage: {
    readonly LnWDb: number;
    readonly RwDb: number;
  };
  readonly nextOwner: string;
  readonly packageBucket: "eps_screed_or_hybrid_upper" | "mixed_staged_upper";
  readonly policyDecision: string;
  readonly selectedNextCandidate: boolean;
  readonly sourceId: BroadAccuracyFloorOpenBoxTimberExactOnlyHybridSourceId;
};

function residualExpansionPackageBucket(packageId: string): ResidualExpansionRow["packageBucket"] {
  if (packageId === "eps_screed_or_hybrid_upper" || packageId === "mixed_staged_upper") {
    return packageId;
  }

  throw new Error(`Package ${packageId} is not a residual expansion bucket`);
}

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

function exactSystem(sourceId: BroadAccuracyFloorOpenBoxTimberExactOnlyHybridSourceId): ExactFloorSystem {
  const system = EXACT_FLOOR_SYSTEMS.find((candidate) => candidate.id === sourceId);

  if (!system) {
    throw new Error(`Missing exact floor system ${sourceId}`);
  }

  return system;
}

function buildResidualExpansionRows(): readonly ResidualExpansionRow[] {
  const policy = buildBroadAccuracyFloorOpenBoxTimberExactOnlyHybridFragmentationPolicyContract();
  const dryPackage = policy.runtimePinsFrozen.find((pin) => pin.packageId === "dry_gypsum_fiber_upper");

  if (!dryPackage) {
    throw new Error("Expected dry gypsum-fiber package-transfer runtime pin");
  }

  return policy.policyRows.map((row) => {
    if (row.packageId === "dry_gypsum_fiber_upper") {
      throw new Error("Dry gypsum-fiber package is the residual baseline, not an expansion row");
    }

    const nextOwner =
      row.sourceId === "tuas_r7b_open_box_timber_measured_2026"
        ? "eps_screed_hybrid_package_owner"
        : row.sourceId === "tuas_r8b_open_box_timber_measured_2026"
          ? "partial_finish_negative_boundary_owner"
          : row.sourceId === "tuas_r9b_open_box_timber_measured_2026"
            ? "screed_only_negative_boundary_owner"
            : row.sourceId === "tuas_r2c_open_box_timber_measured_2026"
              ? "lower_ceiling_missing_mass_negative_boundary_owner"
              : "mixed_staged_upper_package_owner";

    const admission =
      row.sourceId === "tuas_r7b_open_box_timber_measured_2026"
        ? "candidate_owner_gap"
        : row.residualAdmissionStatus === "residual_readiness_only"
          ? "residual_readiness_only"
          : "blocked_negative_boundary";

    return {
      admission,
      currentRuntimeAdmission: "blocked",
      exactSourcePrecedence: true,
      metricResidualsAgainstDryPackage: {
        LnWDb: Number((row.measuredMetrics.LnW - dryPackage.LnW).toFixed(1)),
        RwDb: Number((row.measuredMetrics.Rw - dryPackage.Rw).toFixed(1))
      },
      nextOwner,
      packageBucket: residualExpansionPackageBucket(row.packageId),
      policyDecision: row.policyDecision,
      selectedNextCandidate: row.sourceId === "tuas_r7b_open_box_timber_measured_2026",
      sourceId: row.sourceId
    };
  });
}

const PACKAGE_TRANSFER_RESIDUAL_EXPANSION_CONTRACT = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_PACKAGE_TRANSFER_RESIDUAL_EXPANSION_LANDED_GATE,
  noRuntimeValueMovement: true,
  previousPolicy: {
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_LANDED_GATE,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTION_STATUS
  },
  residualRows: buildResidualExpansionRows(),
  runtimePromotionAllowedInGate: false,
  selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_PACKAGE_TRANSFER_RESIDUAL_EXPANSION_SELECTED_NEXT_ACTION,
  selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_PACKAGE_TRANSFER_RESIDUAL_EXPANSION_SELECTED_NEXT_FILE,
  selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_PACKAGE_TRANSFER_RESIDUAL_EXPANSION_SELECTED_NEXT_LABEL,
  selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_PACKAGE_TRANSFER_RESIDUAL_EXPANSION_SELECTION_STATUS,
  toleranceMovement: false
} as const;

describe("broad accuracy floor open-box timber package-transfer residual expansion contract", () => {
  it("lands a no-runtime residual expansion and selects EPS/screed hybrid package ownership next", () => {
    expect(PACKAGE_TRANSFER_RESIDUAL_EXPANSION_CONTRACT).toMatchObject({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "broad_accuracy_floor_open_box_timber_package_transfer_residual_expansion_plan",
      noRuntimeValueMovement: true,
      previousPolicy: {
        landedGate: "broad_accuracy_floor_open_box_timber_exact_only_hybrid_fragmentation_policy_plan",
        selectionStatus:
          "broad_accuracy_floor_open_box_timber_exact_only_hybrid_fragmentation_policy_landed_no_runtime_selected_raw_bare_reopening_guard"
      },
      runtimePromotionAllowedInGate: false,
      selectedNextAction: "broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_owner_plan",
      selectedNextFile:
        "packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-owner-contract.test.ts",
      selectedNextLabel: "floor open-box timber EPS/screed hybrid package owner",
      selectionStatus:
        "broad_accuracy_floor_open_box_timber_package_transfer_residual_expansion_landed_no_runtime_selected_eps_screed_hybrid_package_owner",
      toleranceMovement: false
    });

    expect(PACKAGE_TRANSFER_RESIDUAL_EXPANSION_CONTRACT.residualRows.map((row) => row.sourceId)).toEqual([
      "tuas_r7b_open_box_timber_measured_2026",
      "tuas_r8b_open_box_timber_measured_2026",
      "tuas_r9b_open_box_timber_measured_2026",
      "tuas_r2c_open_box_timber_measured_2026",
      "tuas_r10a_open_box_timber_measured_2026"
    ]);
    expect(PACKAGE_TRANSFER_RESIDUAL_EXPANSION_CONTRACT.residualRows.filter((row) => row.selectedNextCandidate)).toEqual([
      {
        admission: "candidate_owner_gap",
        currentRuntimeAdmission: "blocked",
        exactSourcePrecedence: true,
        metricResidualsAgainstDryPackage: { LnWDb: -3.8, RwDb: 6 },
        nextOwner: "eps_screed_hybrid_package_owner",
        packageBucket: "eps_screed_or_hybrid_upper",
        policyDecision: "exact_only_hybrid_residual_evidence_lower_wet_dry_owner_required",
        selectedNextCandidate: true,
        sourceId: "tuas_r7b_open_box_timber_measured_2026"
      }
    ]);

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("expands residual evidence without admitting exact-only, partial, missing-mass, or mixed-staged rows to runtime", () => {
    expect(PACKAGE_TRANSFER_RESIDUAL_EXPANSION_CONTRACT.residualRows).toEqual([
      {
        admission: "candidate_owner_gap",
        currentRuntimeAdmission: "blocked",
        exactSourcePrecedence: true,
        metricResidualsAgainstDryPackage: { LnWDb: -3.8, RwDb: 6 },
        nextOwner: "eps_screed_hybrid_package_owner",
        packageBucket: "eps_screed_or_hybrid_upper",
        policyDecision: "exact_only_hybrid_residual_evidence_lower_wet_dry_owner_required",
        selectedNextCandidate: true,
        sourceId: "tuas_r7b_open_box_timber_measured_2026"
      },
      {
        admission: "residual_readiness_only",
        currentRuntimeAdmission: "blocked",
        exactSourcePrecedence: true,
        metricResidualsAgainstDryPackage: { LnWDb: -0.8, RwDb: 6 },
        nextOwner: "partial_finish_negative_boundary_owner",
        packageBucket: "eps_screed_or_hybrid_upper",
        policyDecision: "partial_finish_no_finish_residual_boundary",
        selectedNextCandidate: false,
        sourceId: "tuas_r8b_open_box_timber_measured_2026"
      },
      {
        admission: "residual_readiness_only",
        currentRuntimeAdmission: "blocked",
        exactSourcePrecedence: true,
        metricResidualsAgainstDryPackage: { LnWDb: -5.8, RwDb: 2 },
        nextOwner: "screed_only_negative_boundary_owner",
        packageBucket: "eps_screed_or_hybrid_upper",
        policyDecision: "screed_only_hybrid_residual_boundary",
        selectedNextCandidate: false,
        sourceId: "tuas_r9b_open_box_timber_measured_2026"
      },
      {
        admission: "blocked_negative_boundary",
        currentRuntimeAdmission: "blocked",
        exactSourcePrecedence: true,
        metricResidualsAgainstDryPackage: { LnWDb: 19.2, RwDb: -12 },
        nextOwner: "lower_ceiling_missing_mass_negative_boundary_owner",
        packageBucket: "eps_screed_or_hybrid_upper",
        policyDecision: "lower_ceiling_interaction_missing_mass_boundary",
        selectedNextCandidate: false,
        sourceId: "tuas_r2c_open_box_timber_measured_2026"
      },
      {
        admission: "blocked_negative_boundary",
        currentRuntimeAdmission: "blocked",
        exactSourcePrecedence: true,
        metricResidualsAgainstDryPackage: { LnWDb: 4.2, RwDb: -10 },
        nextOwner: "mixed_staged_upper_package_owner",
        packageBucket: "mixed_staged_upper",
        policyDecision: "mixed_staged_upper_package_owner_gap",
        selectedNextCandidate: false,
        sourceId: "tuas_r10a_open_box_timber_measured_2026"
      }
    ]);

    const runtime = buildBroadAccuracyFloorOpenBoxTimberSimilarityRuntimeCorridorContract();
    const runtimeAnchorIds = runtime.supportedScenarios.flatMap((scenario) => scenario.anchorSourceIds);

    for (const row of PACKAGE_TRANSFER_RESIDUAL_EXPANSION_CONTRACT.residualRows) {
      expect(runtimeAnchorIds).not.toContain(row.sourceId);
      expect(row.currentRuntimeAdmission).toBe("blocked");
      expect(row.exactSourcePrecedence).toBe(true);
    }
  });

  it("keeps current package-transfer values, budgets, and formula blockers unchanged", () => {
    const runtime = buildBroadAccuracyFloorOpenBoxTimberSimilarityRuntimeCorridorContract();

    expect(runtime.supportedScenarios.map((scenario) => [scenario.packageId, scenario.expectedImpact, scenario.expectedAirborne])).toEqual([
      [
        "dry_gypsum_fiber_upper",
        { CI: 1.3, CI50_2500: 3.3, LnW: 50.8, LnWPlusCI: 52, basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS },
        { Rw: 66, RwPlusC: 62.1 }
      ],
      [
        "thin_laminate_eps_no_upper",
        { CI: 1.5, CI50_2500: 3.5, LnW: 53.5, LnWPlusCI: 55, basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS },
        { Rw: 55.5, RwPlusC: 52.3 }
      ],
      [
        "reinforced_ceiling_laminate",
        { CI: 0.5, CI50_2500: 2, LnW: 53.5, LnWPlusCI: 54, basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS },
        { Rw: 63.5, RwPlusC: 61.6 }
      ]
    ]);

    const epsHybrid = evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor({
      finishPairState: "complete_laminate_eps",
      packageId: "eps_screed_or_hybrid_upper",
      roleTopologyState: "source_equivalent",
      supportFamily: "open_box_timber",
      targetOutputs: BLOCKED_OUTPUTS
    });
    const mixedStaged = evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor({
      finishPairState: "complete_laminate_eps",
      packageId: "mixed_staged_upper",
      roleTopologyState: "source_equivalent",
      supportFamily: "open_box_timber",
      targetOutputs: BLOCKED_OUTPUTS
    });

    expect(epsHybrid).toMatchObject({
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
      blockedSourceIds: ["tuas_r10a_open_box_timber_measured_2026"],
      corridorStatus: "blocked_mixed_staged_no_predictor_rows",
      runtimePromotionAllowedInGate: false,
      runtimeValues: { CI: null, CI50_2500: null, LnW: null, LnWPlusCI: null, Rw: null, RwPlusC: null }
    });
  });

  it("keeps exact rows exact under public calculator routing and safe source-equivalent fragmentation", () => {
    for (const row of PACKAGE_TRANSFER_RESIDUAL_EXPANSION_CONTRACT.residualRows) {
      const system = exactSystem(row.sourceId);
      const canonical = calculateAssembly(layersFromSystem(system, { fragment: false }), {
        calculator: "dynamic",
        targetOutputs: LAB_OUTPUTS
      });
      const fragmented = calculateAssembly(layersFromSystem(system, { fragment: true }), {
        calculator: "dynamic",
        targetOutputs: LAB_OUTPUTS
      });

      expect(canonical.floorSystemMatch?.system.id).toBe(row.sourceId);
      expect(fragmented.floorSystemMatch?.system.id).toBe(row.sourceId);
      expect(canonical.impact?.basis).toBe("open_measured_floor_system_exact_match");
      expect(fragmented.impact).toEqual(canonical.impact);
      expect(fragmented.floorSystemRatings).toEqual(canonical.floorSystemRatings);
      expect(fragmented.floorSystemEstimate?.impact.basis).not.toBe(OPEN_BOX_TIMBER_SIMILARITY_BASIS);
    }
  });

  it("keeps docs and current-gate runner aligned with the residual expansion closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();
      const normalizedWhitespaceContent = normalizedContent.replace(/\s+/g, " ");

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_PACKAGE_TRANSFER_RESIDUAL_EXPANSION_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_PACKAGE_TRANSFER_RESIDUAL_EXPANSION_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_PACKAGE_TRANSFER_RESIDUAL_EXPANSION_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_PACKAGE_TRANSFER_RESIDUAL_EXPANSION_SELECTED_NEXT_FILE);
      expect(normalizedWhitespaceContent, path).toContain("package-transfer residual expansion");
      expect(normalizedWhitespaceContent, path).toContain("eps/screed hybrid package owner");
      expect(normalizedContent, path).toContain("r7b");
      expect(normalizedContent, path).toContain("ln,w 50.8");
      expect(normalizedContent, path).toContain("rw 66");
      expect(normalizedContent, path).toContain("field/building");
      expect(normalizedContent, path).toContain("astm/iic");
      expect(normalizedWhitespaceContent, path).toContain("not a broad source crawl");
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/broad-accuracy-floor-open-box-timber-package-transfer-residual-expansion-contract.test.ts"
    );
  });
});
