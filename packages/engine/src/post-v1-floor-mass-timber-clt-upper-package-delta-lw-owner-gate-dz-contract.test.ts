import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import { describe, expect, it } from "vitest";

import {
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_LANDED_GATE,
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTION_STATUS,
  POST_V1_GATE_DZ_ACCEPTED_SAME_SOURCE_PAIRS,
  POST_V1_GATE_DZ_COUNTERS,
  POST_V1_GATE_DZ_OWNER_ID,
  POST_V1_GATE_DZ_OWNER_POLICY,
  POST_V1_GATE_DZ_REJECTED_BOUNDARIES,
  POST_V1_GATE_DZ_TARGET_OUTPUTS,
  summarizePostV1GateDZMassTimberCltUpperPackageDeltaLwOwner
} from "./post-v1-floor-mass-timber-clt-upper-package-delta-lw-owner-gate-dz";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-dy";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

const CLT_COMBINED_LOWER_TREATMENT_SYSTEM_IDS = [
  "tuas_c2c_clt260_measured_2026",
  "tuas_c3c_clt260_measured_2026",
  "tuas_c4c_clt260_measured_2026",
  "tuas_c5c_clt260_measured_2026",
  "tuas_c7c_clt260_measured_2026"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function exactFloorSystem(id: string) {
  const system = EXACT_FLOOR_SYSTEMS.find((candidate) => candidate.id === id);

  if (!system) {
    throw new Error(`Missing exact floor system ${id}`);
  }

  return system;
}

describe("post-V1 floor mass-timber CLT upper-package DeltaLw owner Gate DZ", () => {
  it("lands after Gate DY without runtime value movement and selects the Gate EA runtime slice", () => {
    const summary = summarizePostV1GateDZMassTimberCltUpperPackageDeltaLwOwner();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_dy_landed_no_runtime_selected_floor_mass_timber_clt_upper_package_delta_lw_owner_gate_dz"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_ACTION).toBe(
      POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-floor-mass-timber-clt-upper-package-delta-lw-owner-gate-dz-contract.test.ts"
    );
    expect(summary).toMatchObject({
      acceptedSameSourcePairs: POST_V1_GATE_DZ_ACCEPTED_SAME_SOURCE_PAIRS,
      counters: POST_V1_GATE_DZ_COUNTERS,
      landedGate: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_LANDED_GATE,
      noRuntimeValueMovement: true,
      ownerId: POST_V1_GATE_DZ_OWNER_ID,
      ownerPolicy: POST_V1_GATE_DZ_OWNER_POLICY,
      previousGateDY: {
        landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_LANDED_GATE,
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTION_STATUS
      },
      rejectedBoundaries: POST_V1_GATE_DZ_REJECTED_BOUNDARIES,
      selectedNextAction:
        POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_ACTION,
      selectedNextFile:
        POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_FILE,
      selectedNextLabel:
        POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_LABEL,
      selectionStatus:
        POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_DZ_TARGET_OUTPUTS
    });
    expect(POST_V1_GATE_DZ_COUNTERS).toMatchObject({
      acceptedSameSourcePairs: 5,
      broadSourceCrawlSelected: false,
      estimatedNextNewCalculableLayerTemplates: 5,
      estimatedNextNewCalculableRequestShapes: 5,
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeBasisPromotions: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("proves only same-source, same-carrier, upper-only CLT pairs as DeltaLw owner evidence", () => {
    for (const pair of POST_V1_GATE_DZ_ACCEPTED_SAME_SOURCE_PAIRS) {
      const reference = exactFloorSystem(pair.referenceSystemId);
      const treated = exactFloorSystem(pair.treatedSystemId);

      expect(reference.sourceLabel).toBe(treated.sourceLabel);
      expect(reference.sourceType).toBe("open_measured_dataset");
      expect(treated.sourceType).toBe("open_measured_dataset");
      expect(reference.trustTier).toBe("peer_reviewed_open_access");
      expect(treated.trustTier).toBe("peer_reviewed_open_access");
      expect(reference.match.baseStructure?.materialIds).toEqual(["clt_panel"]);
      expect(treated.match.baseStructure?.materialIds).toEqual(["clt_panel"]);
      expect(reference.match.baseStructure?.thicknessMm).toBe(pair.carrierThicknessMm);
      expect(treated.match.baseStructure?.thicknessMm).toBe(pair.carrierThicknessMm);
      expect(reference.match.absentRoles).toEqual(
        expect.arrayContaining(["ceiling_board", "ceiling_cavity", "ceiling_fill"])
      );
      expect(treated.match.absentRoles).toEqual(
        expect.arrayContaining(["ceiling_board", "ceiling_cavity", "ceiling_fill"])
      );
      expect(treated.match.ceilingBoard).toBeUndefined();
      expect(treated.match.ceilingCavity).toBeUndefined();
      expect(treated.match.ceilingFill).toBeUndefined();
      expect(treated.match.floatingScreed ?? treated.match.upperFill).toBeDefined();
      expect(reference.impactRatings?.LnW).toBe(pair.referenceLnW);
      expect(treated.impactRatings?.LnW).toBe(pair.treatedLnW);
      expect((reference.impactRatings?.LnW ?? 0) - (treated.impactRatings?.LnW ?? 0)).toBe(pair.deltaLw);
      expect(pair.deltaLw).toBeGreaterThan(0);
    }
  });

  it("keeps Gate DZ itself as a no-runtime owner proof delegated to Gate EA", () => {
    expect(POST_V1_GATE_DZ_COUNTERS).toMatchObject({
      estimatedNextNewCalculableLayerTemplates: POST_V1_GATE_DZ_ACCEPTED_SAME_SOURCE_PAIRS.length,
      estimatedNextNewCalculableRequestShapes: POST_V1_GATE_DZ_ACCEPTED_SAME_SOURCE_PAIRS.length,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeBasisPromotions: 0,
      runtimeValuesMoved: 0
    });
    expect(POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_ACTION).toBe(
      "post_v1_floor_mass_timber_clt_upper_package_delta_lw_runtime_gate_ea_plan"
    );
    expect(POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-floor-mass-timber-clt-upper-package-delta-lw-runtime-gate-ea-contract.test.ts"
    );
  });

  it("rejects baselines, negative deltas, lower-treatment combined rows, family borrowing, and ASTM aliases", () => {
    const x2 = exactFloorSystem("tuas_x2_clt140_measured_2026");
    const x5 = exactFloorSystem("tuas_x5_clt140_measured_2026");
    const c2 = exactFloorSystem("tuas_c2_clt260_measured_2026");
    const c5 = exactFloorSystem("tuas_c5_clt260_measured_2026");

    expect((x2.impactRatings?.LnW ?? 0) - (x5.impactRatings?.LnW ?? 0)).toBe(-4);
    expect((c2.impactRatings?.LnW ?? 0) - (c5.impactRatings?.LnW ?? 0)).toBe(-5);
    expect(POST_V1_GATE_DZ_REJECTED_BOUNDARIES.map((boundary) => boundary.boundary)).toEqual(
      expect.arrayContaining([
        "astm_alias_not_iso_delta_lw_owner",
        "baseline_reference_row_not_treated_owner",
        "combined_lower_treatment_not_upper_only",
        "cross_family_delta_lw_borrowing",
        "formula_corridor_missing_required_physical_inputs",
        "non_positive_measured_lnw_reduction",
        "published_family_shorthand_not_exact_pair"
      ])
    );

    for (const id of CLT_COMBINED_LOWER_TREATMENT_SYSTEM_IDS) {
      const system = exactFloorSystem(id);

      expect(system.match.ceilingBoard ?? system.match.ceilingCavity ?? system.match.ceilingFill).toBeDefined();
      expect(system.match.absentRoles).not.toEqual(
        expect.arrayContaining(["ceiling_board", "ceiling_cavity", "ceiling_fill"])
      );
    }
    expect(POST_V1_GATE_DZ_OWNER_POLICY.forbiddenBorrowing).toEqual(
      expect.arrayContaining([
        "astm_iic_aiic_alias",
        "composite_panel_published_interaction",
        "heavy_concrete_annexc",
        "open_box_open_web_delta_lw",
        "timber_clt_formula_corridor_without_dynamic_stiffness"
      ])
    );
  });

  it("keeps DZ/EA current-selection docs aligned without touching frontend implementation", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(
        POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTION_STATUS
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_ACTION
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_FILE
      );
      expect(contents, path).toContain(POST_V1_GATE_DZ_OWNER_ID);
      expect(contents, path).toContain("acceptedSameSourcePairs: 5");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }
  });
});
