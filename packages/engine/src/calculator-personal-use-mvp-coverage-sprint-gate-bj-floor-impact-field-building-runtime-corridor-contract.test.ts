import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  buildPersonalUseMvpCoverageSprintGateBJContract,
  buildPersonalUseMvpCoverageSprintGateBJScenarioPack,
  GATE_BJ_FIELD_IMPACT_RUNTIME_BUDGET_ORIGIN,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTION_STATUS,
  type PersonalUseMvpCoverageSprintGateBJRuntimeScenario
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bj";
import {
  FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NT_W_TOLERANCE_DB,
  FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NW_TOLERANCE_DB,
  FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB,
  FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB
} from "./impact-field-adapter-error-budget";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bi";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BJ_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bj.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bj-floor-impact-field-building-runtime-corridor-contract.test.ts",
  "packages/engine/src/impact-field-adapter-error-budget.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_HANDOFF.md",
  "docs/calculator/SLICE_PERSONAL_USE_MVP_GATE_BJ_FLOOR_IMPACT_FIELD_BUILDING_RUNTIME_CORRIDOR_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function scenario(id: string): PersonalUseMvpCoverageSprintGateBJRuntimeScenario {
  const found = buildPersonalUseMvpCoverageSprintGateBJScenarioPack().find((entry) => entry.id === id);

  if (!found) {
    throw new Error(`Missing Gate BJ scenario ${id}`);
  }

  return found;
}

describe("Personal-Use MVP Coverage Sprint Gate BJ floor-impact field/building runtime corridor", () => {
  it("lands Gate BJ as a runtime corridor and selects steel-floor low-confidence cleanup next", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBJContract();

    expect(contract).toMatchObject({
      astmImpactAdapterAdded: false,
      buildingPredictionUsesDirectFlankingOwner: true,
      fieldBudgetOrigin: GATE_BJ_FIELD_IMPACT_RUNTIME_BUDGET_ORIGIN,
      fieldRuntimeCorridorPromoted: true,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_LANDED_GATE,
      lowConfidenceDirectFlankingFallbackRemoved: true,
      lowFrequencyRuntimePromoted: false,
      noLabFieldBuildingAlias: true,
      previousGateBI: {
        landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_LANDED_GATE,
        selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_ACTION,
        selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_FILE,
        selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTION_STATUS
      },
      runtimeValueRetune: false,
      selectedImplementationSlice:
        "personal_use_mvp_coverage_sprint_after_gate_bi_floor_impact_field_building_runtime_corridor",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_FILE,
      selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_LABEL,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      tolerancePins: {
        directFlankingLPrimeNTw: FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NT_W_TOLERANCE_DB,
        directFlankingLPrimeNW: FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NW_TOLERANCE_DB,
        fieldVolumeLPrimeNTw: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB,
        fieldVolumeLPrimeNW: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB
      }
    });

    for (const path of REQUIRED_GATE_BJ_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes complete field-volume floor impact requests with explicit field adapter budgets", () => {
    const row = scenario("gate_bj_complete_field_volume_runtime_corridor");

    expect(row).toMatchObject({
      adapterBasis: "field_apparent",
      basisId: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      confidenceLevel: "medium",
      confidenceScore: 0.72,
      directFlankingActive: false,
      fieldContinuation: "standardized_room_volume",
      missingPhysicalInputs: [],
      publicEntryPoint: "calculateAssembly",
      status: "ready_with_runtime_corridor",
      supportedTargetOutputs: ["L'n,w", "L'nT,w"],
      targetOutputs: ["L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "L'n,w", value: 52.3 },
        { metric: "L'nT,w", value: 49.9 }
      ]
    });
    expect(row.budgetPins).toEqual([
      {
        estimate: 52.3,
        metricId: "L'n,w",
        origin: GATE_BJ_FIELD_IMPACT_RUNTIME_BUDGET_ORIGIN,
        termIds: ["lab_anchor_basis_transfer", "field_k_or_mass_ratio_policy", "source_absent_field_holdout_absence"],
        toleranceDb: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB,
        totalBudgetDb: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB
      },
      {
        estimate: 49.9,
        metricId: "L'nT,w",
        origin: GATE_BJ_FIELD_IMPACT_RUNTIME_BUDGET_ORIGIN,
        termIds: [
          "lab_anchor_basis_transfer",
          "field_k_or_mass_ratio_policy",
          "source_absent_field_holdout_absence",
          "room_volume_normalization_precision"
        ],
        toleranceDb: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB,
        totalBudgetDb: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB
      }
    ]);
  });

  it("promotes building direct+flanking L'nT,w without promoting low-frequency L'nT,50", () => {
    const row = scenario("gate_bj_complete_building_direct_flanking_runtime_corridor");

    expect(row).toMatchObject({
      adapterBasis: "building_prediction",
      basisId: "mixed_predicted_plus_estimated_standardized_direct_flanking_energy_sum",
      confidenceLevel: "medium",
      confidenceScore: 0.66,
      directFlankingActive: true,
      fieldContinuation: "direct_flanking_energy_sum",
      missingPhysicalInputs: [],
      publicEntryPoint: "calculateAssembly",
      status: "ready_with_runtime_corridor_and_low_frequency_boundary",
      supportedTargetOutputs: ["L'nT,w"],
      targetOutputs: ["L'nT,w", "L'nT,50"],
      unsupportedTargetOutputs: ["L'nT,50"],
      valuePins: [{ metric: "L'nT,w", value: 52.4 }]
    });
    expect(row.budgetPins).toEqual([
      {
        estimate: 54.8,
        metricId: "L'n,w",
        origin: GATE_BJ_FIELD_IMPACT_RUNTIME_BUDGET_ORIGIN,
        termIds: [
          "lab_anchor_basis_transfer",
          "direct_path_offset_policy",
          "flanking_path_energy_model",
          "junction_and_support_family_mapping"
        ],
        toleranceDb: FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NW_TOLERANCE_DB,
        totalBudgetDb: FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NW_TOLERANCE_DB
      },
      {
        estimate: 52.4,
        metricId: "L'nT,w",
        origin: GATE_BJ_FIELD_IMPACT_RUNTIME_BUDGET_ORIGIN,
        termIds: [
          "lab_anchor_basis_transfer",
          "direct_path_offset_policy",
          "flanking_path_energy_model",
          "junction_and_support_family_mapping",
          "room_standardization_precision"
        ],
        toleranceDb: FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NT_W_TOLERANCE_DB,
        totalBudgetDb: FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NT_W_TOLERANCE_DB
      }
    ]);
    expect(row.warnings).toContain(
      "Live direct+flanking field path is active on the main impact lane. Explicit path offsets are being summed before standardized field re-rating."
    );
    expect(row.warnings).toContain(
      "Some requested impact sound outputs are still unavailable for the current input/path: L'nT,50. DynEcho kept those outputs explicit instead of fabricating unsupported ratings."
    );
  });

  it("keeps missing context, low-frequency, and ASTM/IIC boundaries fail-closed", () => {
    expect(scenario("gate_bj_missing_impact_field_context_needs_input")).toMatchObject({
      adapterBasis: "field_apparent",
      basisId: "predictor_heavy_concrete_published_upper_treatment_estimate",
      budgetPins: [],
      confidenceLevel: "medium",
      missingPhysicalInputs: ["impactFieldContext"],
      status: "needs_input",
      supportedTargetOutputs: [],
      targetOutputs: ["L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: ["L'n,w", "L'nT,w"],
      valuePins: []
    });
    expect(scenario("gate_bj_low_frequency_lnt50_stays_blocked_without_owner")).toMatchObject({
      adapterBasis: "field_apparent",
      basisId: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      budgetPins: expect.arrayContaining([
        expect.objectContaining({ estimate: 52, metricId: "L'n,w" }),
        expect.objectContaining({ estimate: 49.6, metricId: "L'nT,w" })
      ]),
      confidenceLevel: "medium",
      missingPhysicalInputs: ["lowFrequencyImpactSpectrumOrCI50_2500Owner"],
      status: "blocked_low_frequency_owner",
      supportedTargetOutputs: [],
      targetOutputs: ["L'nT,50"],
      unsupportedTargetOutputs: ["L'nT,50"],
      valuePins: []
    });
    expect(scenario("gate_bj_astm_iic_aiic_remains_unsupported")).toMatchObject({
      adapterBasis: "unsupported",
      basisId: null,
      budgetPins: [],
      confidenceLevel: null,
      missingPhysicalInputs: [],
      status: "unsupported_basis",
      supportedTargetOutputs: [],
      targetOutputs: ["IIC", "AIIC"],
      unsupportedTargetOutputs: ["IIC", "AIIC"],
      valuePins: []
    });
  });

  it("keeps impact-only direct+flanking payloads medium confidence and budgeted", () => {
    const row = scenario("gate_bj_impact_only_direct_flanking_runtime_payload");

    expect(row).toMatchObject({
      adapterBasis: "impact_only_field",
      basisId: "mixed_exact_plus_estimated_standardized_direct_flanking_energy_sum",
      confidenceLevel: "medium",
      confidenceScore: 0.78,
      directFlankingActive: true,
      fieldContinuation: "direct_flanking_energy_sum",
      publicEntryPoint: "calculateImpactOnly",
      status: "ready_with_runtime_corridor",
      supportedTargetOutputs: ["L'n,w", "L'nT,w", "L'nT,50"],
      targetOutputs: ["L'n,w", "L'nT,w", "L'nT,50"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "L'n,w", value: 57 },
        { metric: "L'nT,w", value: 55 },
        { metric: "L'nT,50", value: 54 }
      ]
    });
    expect(row.budgetPins).toEqual([
      {
        estimate: 57,
        metricId: "L'n,w",
        origin: GATE_BJ_FIELD_IMPACT_RUNTIME_BUDGET_ORIGIN,
        termIds: [
          "lab_anchor_basis_transfer",
          "direct_path_offset_policy",
          "flanking_path_energy_model",
          "junction_and_support_family_mapping"
        ],
        toleranceDb: FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NW_TOLERANCE_DB,
        totalBudgetDb: FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NW_TOLERANCE_DB
      },
      {
        estimate: 55,
        metricId: "L'nT,w",
        origin: GATE_BJ_FIELD_IMPACT_RUNTIME_BUDGET_ORIGIN,
        termIds: [
          "lab_anchor_basis_transfer",
          "direct_path_offset_policy",
          "flanking_path_energy_model",
          "junction_and_support_family_mapping",
          "room_standardization_precision"
        ],
        toleranceDb: FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NT_W_TOLERANCE_DB,
        totalBudgetDb: FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NT_W_TOLERANCE_DB
      }
    ]);
  });

  it("keeps docs and the current-gate runner aligned with Gate BJ closeout and Gate BK selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_FILE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_LABEL);
      expect(content, path).toContain(GATE_BJ_FIELD_IMPACT_RUNTIME_BUDGET_ORIGIN);
      expect(content, path).toContain("L'nT,50");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-bj-floor-impact-field-building-runtime-corridor-contract.test.ts"
    );
  });
});
