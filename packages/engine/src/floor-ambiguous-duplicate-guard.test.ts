import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type AmbiguousDuplicateCase = {
  id: string;
  layers: readonly LayerInput[];
};

const FIELD_OUTPUTS = ["Rw", "R'w", "DnT,w", "Ln,w", "Ln,w+CI", "L'n,w"] as const satisfies readonly RequestedOutputId[];
type FieldOutputId = (typeof FIELD_OUTPUTS)[number];

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms" as const,
  partitionHeightM: 4,
  partitionWidthM: 4.5,
  receivingRoomVolumeM3: 55,
  separatingAreaM2: 18
};

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const CASES: readonly AmbiguousDuplicateCase[] = [
  {
    id: "heavy dual finish",
    layers: [
      { materialId: "concrete", thicknessMm: 150 },
      { materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { materialId: "screed", thicknessMm: 30 },
      { materialId: "ceramic_tile", thicknessMm: 8 },
      { materialId: "vinyl_flooring", thicknessMm: 2.5 }
    ]
  },
  {
    id: "heavy dual resilient",
    layers: [
      { materialId: "concrete", thicknessMm: 150 },
      { materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { materialId: "rubber_sheet", thicknessMm: 5 },
      { materialId: "screed", thicknessMm: 30 },
      { materialId: "ceramic_tile", thicknessMm: 8 }
    ]
  },
  {
    id: "clt dual finish",
    layers: [
      { materialId: "clt_panel", thicknessMm: 140 },
      { materialId: "vinyl_flooring", thicknessMm: 2.5 },
      { materialId: "engineered_timber_flooring", thicknessMm: 15 },
      { materialId: "genieclip_rst", thicknessMm: 16 },
      { materialId: "gypsum_board", thicknessMm: 16 }
    ]
  },
  {
    id: "clt dual resilient",
    layers: [
      { materialId: "clt_panel", thicknessMm: 140 },
      { materialId: "mw_t_impact_layer_s40", thicknessMm: 30 },
      { materialId: "rubber_sheet", thicknessMm: 5 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 }
    ]
  },
  {
    id: "hollow-core dual finish",
    layers: [
      { materialId: "hollow_core_plank", thicknessMm: 200 },
      { materialId: "geniemat_rst05", thicknessMm: 5 },
      { materialId: "vinyl_flooring", thicknessMm: 2.5 },
      { materialId: "engineered_timber_flooring", thicknessMm: 15 },
      { materialId: "genieclip_rst", thicknessMm: 16 },
      { materialId: "gypsum_board", thicknessMm: 16 }
    ]
  },
  {
    id: "open-box dual upper fill",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 100 },
      { materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { materialId: "laminate_flooring", thicknessMm: 8 },
      { materialId: "eps_underlay", thicknessMm: 3 },
      { materialId: "generic_fill", thicknessMm: 30 },
      { materialId: "bonded_chippings", thicknessMm: 20 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]
  },
  {
    id: "open-web dual finish",
    layers: [
      { materialId: "open_web_steel_joist", thicknessMm: 300 },
      { materialId: "rubber_sheet", thicknessMm: 5 },
      { materialId: "particleboard_flooring", thicknessMm: 19 },
      { materialId: "engineered_timber_flooring", thicknessMm: 15 },
      { materialId: "vinyl_flooring", thicknessMm: 2.5 },
      { materialId: "resilient_channel", thicknessMm: 65 },
      { materialId: "glasswool", thicknessMm: 145 },
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "firestop_board", thicknessMm: 16 }
    ]
  },
  {
    id: "open-web dual resilient",
    layers: [
      { materialId: "open_web_steel_joist", thicknessMm: 300 },
      { materialId: "rubber_sheet", thicknessMm: 5 },
      { materialId: "mw_t_impact_layer_s40", thicknessMm: 30 },
      { materialId: "particleboard_flooring", thicknessMm: 19 },
      { materialId: "engineered_timber_flooring", thicknessMm: 15 },
      { materialId: "resilient_channel", thicknessMm: 65 },
      { materialId: "glasswool", thicknessMm: 145 },
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "firestop_board", thicknessMm: 16 }
    ]
  }
];

const OUTPUT_VALUE_GETTERS: Record<FieldOutputId, (result: ReturnType<typeof calculateAssembly>) => number | null | undefined> =
  {
    "DnT,w": (result) => result.metrics.estimatedDnTwDb,
    "L'n,w": (result) => result.impact?.LPrimeNW,
    "Ln,w": (result) => result.impact?.LnW,
    "Ln,w+CI": (result) => result.impact?.LnWPlusCI,
    "R'w": (result) => result.metrics.estimatedRwPrimeDb,
    Rw: (result) => result.metrics.estimatedRwDb
  };

function assertFiniteSupportedOutputs(
  failures: string[],
  label: string,
  result: ReturnType<typeof calculateAssembly>
) {
  const supported = new Set(result.supportedTargetOutputs);
  const unsupported = new Set(result.unsupportedTargetOutputs);

  for (const output of FIELD_OUTPUTS) {
    if (supported.has(output) === unsupported.has(output)) {
      failures.push(
        `${label}: output ${output} should belong to exactly one support bucket, supported=${JSON.stringify(result.supportedTargetOutputs)} unsupported=${JSON.stringify(result.unsupportedTargetOutputs)}`
      );
    }
  }

  for (const output of result.supportedTargetOutputs) {
    if (!FIELD_OUTPUTS.includes(output as FieldOutputId)) {
      continue;
    }

    const value = OUTPUT_VALUE_GETTERS[output as FieldOutputId]?.(result);

    if (!(typeof value === "number" && Number.isFinite(value) && value >= 20 && value <= 90)) {
      failures.push(`${label}: supported output ${output} should stay finite and in a broad sane corridor, got ${String(value)}`);
    }
  }
}

describe("floor ambiguous duplicate guard", () => {
  it("keeps ambiguous duplicate floor-role stacks off curated exact and bound lanes while preserving sane field outputs", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const result = calculateAssembly(testCase.layers, {
        airborneContext: AIRBORNE_FIELD_CONTEXT,
        impactFieldContext: IMPACT_FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });

      if (result.floorSystemMatch) {
        failures.push(`${testCase.id}: expected no curated exact floor-system match, got ${result.floorSystemMatch.system.id}`);
      }

      if (result.boundFloorSystemMatch) {
        failures.push(
          `${testCase.id}: expected no curated bound floor-system match, got ${result.boundFloorSystemMatch.system.id}`
        );
      }

      if (result.impactPredictorStatus?.inputMode === "derived_from_visible_layers") {
        failures.push(`${testCase.id}: ambiguous stack should not activate visible-layer derived predictor input mode`);
      }

      if (result.warnings.some((warning: string) => warning.includes("Impact predictor topology was derived from visible floor-role layers"))) {
        failures.push(`${testCase.id}: ambiguous stack should not emit the visible-layer derived predictor warning`);
      }

      if (!result.supportedTargetOutputs.length) {
        failures.push(`${testCase.id}: expected at least one supported field output`);
      }

      assertFiniteSupportedOutputs(failures, testCase.id, result);
    }

    expect(failures).toEqual([]);
  });
});
