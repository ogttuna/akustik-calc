import type { AirborneContext, ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { type PresetDefinition, WORKBENCH_PRESETS } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";

const FLOOR_CARD_AUDIT_OUTPUTS: readonly RequestedOutputId[] = [
  "Rw",
  "R'w",
  "DnT,w",
  "DnT,A",
  "Dn,w",
  "Dn,A",
  "Ln,w",
  "DeltaLw",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "STC",
  "C",
  "Ctr"
];

const LAB_CONTEXT: AirborneContext | null = null;

const FIELD_BETWEEN_ROOMS_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const BUILDING_PREDICTION_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const IMPACT_FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
};

function evaluateFloorRows(input: {
  airborneContext: AirborneContext | null;
  id: string;
  impactFieldContext: ImpactFieldContext | null;
  rows: Array<{
    floorRole?: string;
    id: string;
    materialId: string;
    thicknessMm: number | string;
  }>;
}) {
  return evaluateScenario({
    airborneContext: input.airborneContext,
    id: input.id,
    impactFieldContext: input.impactFieldContext,
    name: input.id,
    rows: input.rows,
    source: "current",
    studyMode: "floor",
    targetOutputs: FLOOR_CARD_AUDIT_OUTPUTS
  }).result;
}

function auditResultParity(input: {
  failures: string[];
  label: string;
  result: ReturnType<typeof evaluateFloorRows>;
}) {
  const supported = new Set(input.result.supportedTargetOutputs);
  const unsupported = new Set(input.result.unsupportedTargetOutputs);

  for (const output of FLOOR_CARD_AUDIT_OUTPUTS) {
    const card = buildOutputCard({
      output,
      result: input.result,
      studyMode: "floor"
    });

    if (supported.has(output) && (card.status === "unsupported" || card.status === "needs_input")) {
      input.failures.push(
        `${input.label}: output ${output} is supported=${JSON.stringify(
          input.result.supportedTargetOutputs
        )} but card resolved to ${card.status}`
      );
    }

    if (unsupported.has(output) && (card.status === "live" || card.status === "bound")) {
      input.failures.push(
        `${input.label}: output ${output} is unsupported=${JSON.stringify(
          input.result.unsupportedTargetOutputs
        )} but card resolved to ${card.status} (${card.value})`
      );
    }
  }
}

describe("floor output-card support parity", () => {
  it("keeps every representative floor preset card aligned with engine support buckets across lab and field contexts", () => {
    const failures: string[] = [];
    const contexts: Array<{
      airborneContext: AirborneContext | null;
      impactFieldContext: ImpactFieldContext | null;
      label: string;
    }> = [
      {
        airborneContext: LAB_CONTEXT,
        impactFieldContext: null,
        label: "lab"
      },
      {
        airborneContext: FIELD_BETWEEN_ROOMS_CONTEXT,
        impactFieldContext: IMPACT_FIELD_CONTEXT,
        label: "field_between_rooms"
      },
      {
        airborneContext: BUILDING_PREDICTION_CONTEXT,
        impactFieldContext: IMPACT_FIELD_CONTEXT,
        label: "building_prediction"
      }
    ];

    for (const preset of WORKBENCH_PRESETS.filter(
      (candidate): candidate is PresetDefinition => candidate.studyMode === "floor"
    )) {
      for (const context of contexts) {
        const result = evaluateFloorRows({
          airborneContext: context.airborneContext,
          id: `${preset.id}-${context.label}`,
          impactFieldContext: context.impactFieldContext,
          rows: preset.rows.map((row, index) => ({
            ...row,
            id: `${preset.id}-${context.label}-${index + 1}`
          }))
        });

        auditResultParity({
          failures,
          label: `${preset.id} ${context.label}`,
          result
        });
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps representative raw floor, inferred floor, and wall-like hybrid scenarios aligned with engine support buckets", () => {
    const failures: string[] = [];
    const cases = [
      {
        id: "tagged-concrete-room",
        rows: [{ floorRole: "base_structure", id: "a", materialId: "concrete", thicknessMm: 150 }]
      },
      {
        id: "tagged-open-box-room",
        rows: [{ floorRole: "base_structure", id: "a", materialId: "open_box_timber_slab", thicknessMm: 370 }]
      },
      {
        id: "raw-open-box-with-tile-room",
        rows: [
          { id: "a", materialId: "ceramic_tile", thicknessMm: 8 },
          { id: "b", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
          { id: "c", materialId: "screed", thicknessMm: 30 },
          { id: "d", materialId: "open_box_timber_slab", thicknessMm: 370 }
        ]
      },
      {
        id: "raw-heavy-walllike-hybrid-room",
        rows: [
          { id: "a", materialId: "gypsum_board", thicknessMm: 12.5 },
          { id: "b", materialId: "concrete", thicknessMm: 120 },
          { id: "c", materialId: "gypsum_board", thicknessMm: 12.5 }
        ]
      }
    ];

    for (const testCase of cases) {
      const result = evaluateFloorRows({
        airborneContext: FIELD_BETWEEN_ROOMS_CONTEXT,
        id: testCase.id,
        impactFieldContext: IMPACT_FIELD_CONTEXT,
        rows: testCase.rows
      });

      auditResultParity({
        failures,
        label: testCase.id,
        result
      });
    }

    expect(failures).toEqual([]);
  });
});
