import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  EstimateRequestSchema,
  ImpactOnlyRequestSchema,
  type AssemblyCalculation
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import { getTargetOutputStatus } from "./target-output-status";

const REPO_ROOT = fileURLToPath(new URL("../../../..", import.meta.url));

const UI_INPUT_OUTPUT_HONESTY_GATE_A_INVENTORY = {
  activeSlice: "ui_input_output_honesty_v1",
  gate: "gate_a_inventory",
  runtimeBehaviorChange: false,
  selectedNextGate: "gate_b_required_input_and_unsupported_output_visibility_fixes",
  planningSurface: "docs/calculator/SLICE_UI_INPUT_OUTPUT_HONESTY_PLAN.md",
  checkpoint: "docs/calculator/CHECKPOINT_2026-04-27_UI_INPUT_OUTPUT_HONESTY_GATE_A_HANDOFF.md"
} as const;

const GATE_A_FINDINGS = {
  alreadyHonest: [
    "estimate_schema_rejects_missing_layer_stack_with_structured_issue_path",
    "impact_only_schema_rejects_source_less_requests_with_structured_issue_path",
    "field_airborne_status_separates_partition_geometry_from_room_volume",
    "explicitly_unsupported_requested_outputs_do_not_render_live_or_bound_numbers",
    "existing_card_matrices_cover_output_support_parity_layer_reorder_many_layer_and_save_load_surfaces"
  ],
  needsCopyUiWiring: [
    "api_route_top_level_errors_remain_generic_even_though_schema_issues_are_structured",
    "explicit_unsupported_field_impact_cards_should_prefer_unsupported_label_over_needs_input_when_engine_already_rejected_output"
  ],
  mustFailClosedBeforePrivateUse: []
} as const;

const FIELD_WALL_ROWS = [
  { id: "wall-1", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "wall-2", materialId: "air_gap", thicknessMm: "75" },
  { id: "wall-3", materialId: "rockwool", thicknessMm: "75" },
  { id: "wall-4", materialId: "gypsum_board", thicknessMm: "12.5" }
] as const;

function buildUnsupportedFieldImpactResult(): AssemblyCalculation {
  return {
    curve: {
      frequenciesHz: [125, 250, 500],
      transmissionLossDb: [52, 59, 65]
    },
    impact: {
      basis: "predictor_floor_system_low_confidence_estimate",
      LnW: 58.3
    } as AssemblyCalculation["impact"],
    layers: [],
    metrics: {
      airGapCount: 1,
      estimatedRwDb: 61,
      estimatedStc: 60,
      insulationCount: 1,
      method: "screening_mass_law_curve_seed_v3",
      surfaceMassKgM2: 145,
      totalThicknessMm: 270
    },
    ok: true,
    ratings: {
      iso717: {
        composite: "Rw 61",
        descriptor: "Rw"
      }
    },
    supportedTargetOutputs: ["Rw", "Ln,w"],
    unsupportedTargetOutputs: ["L'nT,50"],
    warnings: []
  } as AssemblyCalculation;
}

describe("UI input/output honesty Gate A inventory", () => {
  it("records the active no-runtime Gate A scope and evidence surfaces", () => {
    expect(UI_INPUT_OUTPUT_HONESTY_GATE_A_INVENTORY).toEqual({
      activeSlice: "ui_input_output_honesty_v1",
      gate: "gate_a_inventory",
      runtimeBehaviorChange: false,
      selectedNextGate: "gate_b_required_input_and_unsupported_output_visibility_fixes",
      planningSurface: "docs/calculator/SLICE_UI_INPUT_OUTPUT_HONESTY_PLAN.md",
      checkpoint: "docs/calculator/CHECKPOINT_2026-04-27_UI_INPUT_OUTPUT_HONESTY_GATE_A_HANDOFF.md"
    });
    expect(GATE_A_FINDINGS.mustFailClosedBeforePrivateUse).toEqual([]);

    for (const path of [
      UI_INPUT_OUTPUT_HONESTY_GATE_A_INVENTORY.planningSurface,
      UI_INPUT_OUTPUT_HONESTY_GATE_A_INVENTORY.checkpoint,
      "apps/web/features/workbench/target-output-status.test.ts",
      "apps/web/features/workbench/floor-output-card-support-parity.test.ts",
      "apps/web/features/workbench/wall-output-card-support-parity.test.ts",
      "apps/web/features/workbench/floor-layer-order-edit-stability-gate-a-card-matrix.test.ts",
      "apps/web/features/workbench/floor-many-layer-stress-gate-a-card-matrix.test.ts",
      "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps API request schemas fail-closed with structured issue paths for missing inputs", () => {
    const estimateParse = EstimateRequestSchema.safeParse({
      targetOutputs: ["Rw"]
    });
    const impactOnlyParse = ImpactOnlyRequestSchema.safeParse({
      targetOutputs: ["Ln,w"]
    });

    expect(estimateParse.success).toBe(false);
    if (!estimateParse.success) {
      expect(estimateParse.error.issues.map((issue) => issue.path.join("."))).toContain("layers");
    }

    expect(impactOnlyParse.success).toBe(false);
    if (!impactOnlyParse.success) {
      expect(impactOnlyParse.error.issues).toEqual([
        expect.objectContaining({
          message: expect.stringContaining("at least one source"),
          path: ["layers"]
        })
      ]);
    }

    expect(GATE_A_FINDINGS.needsCopyUiWiring).toContain(
      "api_route_top_level_errors_remain_generic_even_though_schema_issues_are_structured"
    );
  });

  it("separates field airborne geometry blockers from room-volume blockers", () => {
    const missingGeometry = evaluateScenario({
      airborneContext: {
        contextMode: "field_between_rooms"
      },
      id: "gate-a-wall-field-missing-geometry",
      name: "Gate A wall field missing geometry",
      rows: FIELD_WALL_ROWS,
      source: "current",
      studyMode: "wall",
      targetOutputs: ["R'w", "Dn,w", "DnT,w"]
    });
    const geometryOnly = evaluateScenario({
      airborneContext: {
        contextMode: "field_between_rooms",
        panelHeightMm: 2800,
        panelWidthMm: 3000
      },
      id: "gate-a-wall-field-geometry-only",
      name: "Gate A wall field geometry only",
      rows: FIELD_WALL_ROWS,
      source: "current",
      studyMode: "wall",
      targetOutputs: ["Dn,w", "DnT,w"]
    });

    const missingGeometryDnw = getTargetOutputStatus({
      guideResult: null,
      output: "Dn,w",
      result: missingGeometry.result
    });
    const missingGeometryDntw = getTargetOutputStatus({
      guideResult: null,
      output: "DnT,w",
      result: missingGeometry.result
    });
    const geometryOnlyDnw = getTargetOutputStatus({
      guideResult: null,
      output: "Dn,w",
      result: geometryOnly.result
    });
    const geometryOnlyDntw = getTargetOutputStatus({
      guideResult: null,
      output: "DnT,w",
      result: geometryOnly.result
    });

    expect(missingGeometryDnw).toEqual(
      expect.objectContaining({
        kind: "pending_input",
        label: "Need partition geometry"
      })
    );
    expect(missingGeometryDntw).toEqual(
      expect.objectContaining({
        kind: "pending_input",
        label: "Need partition geometry"
      })
    );
    expect(geometryOnlyDnw).toEqual(
      expect.objectContaining({
        kind: "engine_live",
        label: "Area-normalized"
      })
    );
    expect(geometryOnlyDntw).toEqual(
      expect.objectContaining({
        kind: "pending_input",
        label: "Need room volume"
      })
    );
  });

  it("keeps explicitly unsupported requested outputs non-numeric and identifies the Gate B label gap", () => {
    const result = buildUnsupportedFieldImpactResult();
    const card = buildOutputCard({
      output: "L'nT,50",
      result,
      studyMode: "floor"
    });
    const status = getTargetOutputStatus({
      guideResult: null,
      output: "L'nT,50",
      result
    });

    expect(card.value).toBe("Not ready");
    expect(card.status).not.toBe("live");
    expect(card.status).not.toBe("bound");
    expect(card.status).toBe("needs_input");
    expect(card.detail).toContain("Need field K together with receiving-room volume");
    expect(status).toEqual(
      expect.objectContaining({
        kind: "unavailable",
        label: "Unavailable on current path"
      })
    );
    expect(GATE_A_FINDINGS.needsCopyUiWiring).toContain(
      "explicit_unsupported_field_impact_cards_should_prefer_unsupported_label_over_needs_input_when_engine_already_rejected_output"
    );
  });
});
