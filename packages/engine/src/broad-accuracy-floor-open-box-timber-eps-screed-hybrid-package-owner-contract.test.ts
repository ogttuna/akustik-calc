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
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageOwnerContract
} from "./broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-owner";
import { evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor } from "./broad-accuracy-floor-open-box-timber-similarity-formula-corridor";
import { buildBroadAccuracyFloorOpenBoxTimberSimilarityRuntimeCorridorContract } from "./broad-accuracy-floor-open-box-timber-similarity-runtime-corridor";
import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const LAB_OUTPUTS = ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "IIC"] as const satisfies readonly RequestedOutputId[];

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

const DOC_ALIGNMENT_SURFACES = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md"
] as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-owner.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-owner-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-package-transfer-residual-expansion-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-runtime-corridor.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function exactSystem(id: "tuas_r7b_open_box_timber_measured_2026"): ExactFloorSystem {
  const system = EXACT_FLOOR_SYSTEMS.find((candidate) => candidate.id === id);

  if (!system) {
    throw new Error(`Missing exact system ${id}`);
  }

  return system;
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

describe("broad accuracy floor open-box timber EPS/screed hybrid package owner contract", () => {
  it("lands a no-runtime EPS/screed hybrid owner and selects the formula corridor next", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageOwnerContract();

    expect(contract).toMatchObject({
      exactMeasuredRowsRemainPrecedence: true,
      formulaCorridorStillBlockedBeforeNextGate: true,
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousResidualExpansion: {
        landedGate: "broad_accuracy_floor_open_box_timber_package_transfer_residual_expansion_plan",
        selectedNextAction: "broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_owner_plan",
        selectedNextFile:
          "packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-owner-contract.test.ts",
        selectionStatus:
          "broad_accuracy_floor_open_box_timber_package_transfer_residual_expansion_landed_no_runtime_selected_eps_screed_hybrid_package_owner"
      },
      runtimePromotionAllowedInGate: false,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTION_STATUS,
      toleranceMovementAllowed: false
    });
    expect(contract.basisAliasBlocked).toEqual({
      astmIicAiic: true,
      buildingPrediction: true,
      fieldImpact: true,
      labAirborneFieldAliases: true
    });
    expect(contract.candidateExactPacket).toMatchObject({
      airborneMetrics: { Rw: 72 },
      impactMetrics: { CI: 0, CI50_2500: 1, LnW: 47, LnWPlusCI: 47 },
      sourceId: "tuas_r7b_open_box_timber_measured_2026",
      support: { materialId: "open_box_timber_slab", thicknessMm: 370 }
    });
    expect(contract.candidateExactPacket.airborneMetrics.RwPlusC).toBeCloseTo(70.7, 1);

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("owns the R7b physical packet and keeps sibling rows as negative boundaries", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageOwnerContract();

    expect(contract.ownerTerms.map((term) => term.id)).toEqual([
      "open_box_support_geometry_owner",
      "wet_eps_screed_upper_package_owner",
      "laminate_eps_finish_pair_owner",
      "hybrid_lower_treatment_family_owner",
      "source_equivalent_schedule_owner",
      "residual_cohort_negative_boundary_owner",
      "basis_boundary_owner",
      "metric_budget_owner",
      "exact_precedence_owner",
      "hostile_topology_owner"
    ]);
    expect(contract.ownerTerms.find((term) => term.id === "wet_eps_screed_upper_package_owner")).toMatchObject({
      requiredPhysicalFields: [
        "upperFill.materialId=eps_floor_insulation_board",
        "upperFill.thicknessMm=35",
        "separator.materialId=geotextile",
        "separator.thicknessMm=1",
        "floatingScreed.materialId=screed",
        "floatingScreed.thicknessMm=40",
        "wetScreedMassOrDensity",
        "wetDryCouplingClass"
      ],
      status: "owned_for_formula_corridor"
    });
    expect(contract.ownerTerms.find((term) => term.id === "hybrid_lower_treatment_family_owner")).toMatchObject({
      requiredPhysicalFields: [
        "ceilingCavity.materialSchedule=tuas_open_box_ceiling_family_a+resilient_stud_ceiling",
        "ceilingCavity.thicknessScheduleMm=45+25",
        "ceilingFill.materialId=rockwool",
        "ceilingFill.thicknessMm=100",
        "ceilingBoard.materialId=gypsum_board",
        "ceilingBoard.layerCount=2",
        "ceilingBoard.thicknessMm=13"
      ],
      status: "owned_for_formula_corridor"
    });
    expect(contract.ownerTerms.find((term) => term.id === "metric_budget_owner")).toMatchObject({
      requiredPhysicalFields: [
        "LnWResidualBudgetOwner",
        "RwResidualBudgetOwner",
        "CIResidualBudgetOwner",
        "upperWetDryInteractionBudgetOwner",
        "hybridLowerTransferBudgetOwner",
        "inputPrecisionBudgetOwner"
      ],
      status: "runtime_blocked_until_formula_corridor"
    });
    expect(contract.residualBoundaryRows).toEqual([
      {
        boundaryRole: "accepted_candidate_owner_gap",
        exactSourcePrecedence: true,
        formulaAdmission: "candidate_after_owner_gate",
        sourceId: "tuas_r7b_open_box_timber_measured_2026"
      },
      {
        boundaryRole: "blocked_partial_finish_boundary",
        exactSourcePrecedence: true,
        formulaAdmission: "blocked",
        sourceId: "tuas_r8b_open_box_timber_measured_2026"
      },
      {
        boundaryRole: "blocked_screed_only_boundary",
        exactSourcePrecedence: true,
        formulaAdmission: "blocked",
        sourceId: "tuas_r9b_open_box_timber_measured_2026"
      },
      {
        boundaryRole: "blocked_lower_missing_mass_boundary",
        exactSourcePrecedence: true,
        formulaAdmission: "blocked",
        sourceId: "tuas_r2c_open_box_timber_measured_2026"
      },
      {
        boundaryRole: "blocked_mixed_staged_upper_boundary",
        exactSourcePrecedence: true,
        formulaAdmission: "blocked",
        sourceId: "tuas_r10a_open_box_timber_measured_2026"
      }
    ]);
  });

  it("keeps formula/runtime movement blocked while existing package-transfer pins stay frozen", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageOwnerContract();
    const runtime = buildBroadAccuracyFloorOpenBoxTimberSimilarityRuntimeCorridorContract();
    const formulaProbe = evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor({
      finishPairState: "complete_laminate_eps",
      packageId: "eps_screed_or_hybrid_upper",
      roleTopologyState: "source_equivalent",
      supportFamily: "open_box_timber",
      targetOutputs: LAB_OUTPUTS
    });

    expect(contract.runtimePinsStillFrozen).toEqual([
      {
        anchorSourceIds: [
          "tuas_r3a_open_box_timber_measured_2026",
          "tuas_r3b_open_box_timber_measured_2026",
          "tuas_r5a_open_box_timber_measured_2026",
          "tuas_r5b_open_box_timber_measured_2026"
        ],
        CI50_2500: 3.3,
        LnW: 50.8,
        packageId: "dry_gypsum_fiber_upper",
        Rw: 66
      },
      {
        anchorSourceIds: ["tuas_r2a_open_box_timber_measured_2026", "tuas_r2b_open_box_timber_measured_2026"],
        CI50_2500: 3.5,
        LnW: 53.5,
        packageId: "thin_laminate_eps_no_upper",
        Rw: 55.5
      },
      {
        anchorSourceIds: ["tuas_r6a_open_box_timber_measured_2026", "tuas_r6b_open_box_timber_measured_2026"],
        CI50_2500: 2,
        LnW: 53.5,
        packageId: "reinforced_ceiling_laminate",
        Rw: 63.5
      }
    ]);
    expect(runtime.supportedScenarios.flatMap((scenario) => scenario.anchorSourceIds)).not.toContain(
      "tuas_r7b_open_box_timber_measured_2026"
    );
    expect(formulaProbe).toMatchObject({
      blockedFormulaOutputs: ["C", "L'n,w", "IIC"],
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
    expect(formulaProbe.basisId).toBe(OPEN_BOX_TIMBER_SIMILARITY_BASIS);
  });

  it("preserves R7b exact-source precedence under canonical and safely fragmented schedules", () => {
    const system = exactSystem("tuas_r7b_open_box_timber_measured_2026");
    const canonical = calculateAssembly(layersFromSystem(system, { fragment: false }), {
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });
    const fragmented = calculateAssembly(layersFromSystem(system, { fragment: true }), {
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });

    expect(canonical.floorSystemMatch?.system.id).toBe("tuas_r7b_open_box_timber_measured_2026");
    expect(fragmented.floorSystemMatch?.system.id).toBe("tuas_r7b_open_box_timber_measured_2026");
    expect(canonical.impact).toMatchObject({
      CI: 0,
      CI50_2500: 1,
      LnW: 47,
      LnWPlusCI: 47,
      basis: "open_measured_floor_system_exact_match"
    });
    expect(canonical.floorSystemRatings).toMatchObject({
      Rw: 72,
      basis: "open_measured_floor_system_exact_match"
    });
    expect(fragmented.impact).toEqual(canonical.impact);
    expect(fragmented.floorSystemRatings).toEqual(canonical.floorSystemRatings);
    expect(fragmented.floorSystemEstimate?.impact.basis).not.toBe(OPEN_BOX_TIMBER_SIMILARITY_BASIS);
  });

  it("keeps docs, exports, and current-gate runner aligned to the owner closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();
      const normalizedWhitespaceContent = normalizedContent.replace(/\s+/g, " ");

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_FILE);
      expect(normalizedWhitespaceContent, path).toContain("eps/screed hybrid package owner");
      expect(normalizedContent, path).toContain("r7b");
      expect(normalizedContent, path).toContain("r8b");
      expect(normalizedContent, path).toContain("r9b");
      expect(normalizedContent, path).toContain("r2c");
      expect(normalizedContent, path).toContain("r10a");
      expect(normalizedContent, path).toContain("field/building");
      expect(normalizedContent, path).toContain("astm/iic");
      expect(normalizedWhitespaceContent, path).toContain("not a broad source crawl");
    }

    expect(readRepoFile("packages/engine/src/index.ts")).toContain(
      'export * from "./broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-owner";'
    );
    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-owner-contract.test.ts"
    );
  });
});
