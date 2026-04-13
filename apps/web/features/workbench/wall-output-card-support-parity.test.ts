import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { type PresetDefinition, WORKBENCH_PRESETS } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";

const WALL_CARD_AUDIT_OUTPUTS: readonly RequestedOutputId[] = [
  "Rw",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "STC",
  "C",
  "Ctr"
];

const LAB_CONTEXT: AirborneContext | null = null;

const FIELD_BETWEEN_ROOMS_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 3000,
  panelWidthMm: 4200
};

const BUILDING_PREDICTION_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

function evaluateWallRows(input: {
  airborneContext: AirborneContext | null;
  id: string;
  rows: readonly {
    id: string;
    materialId: string;
    thicknessMm: number | string;
  }[];
}) {
  return evaluateScenario({
    airborneContext: input.airborneContext,
    id: input.id,
    impactFieldContext: null,
    name: input.id,
    rows: input.rows.map((row) => ({
      ...row,
      thicknessMm: String(row.thicknessMm)
    })),
    source: "current",
    studyMode: "wall",
    targetOutputs: WALL_CARD_AUDIT_OUTPUTS
  }).result;
}

type WallScenarioResult = NonNullable<ReturnType<typeof evaluateWallRows>>;

function expectWallScenarioResult(result: ReturnType<typeof evaluateWallRows>, label: string): WallScenarioResult {
  expect(result, `${label} should evaluate`).not.toBeNull();
  if (!result) {
    throw new Error(`${label} did not evaluate.`);
  }

  return result;
}

function auditResultParity(input: {
  failures: string[];
  label: string;
  result: WallScenarioResult;
}) {
  const supported = new Set(input.result.supportedTargetOutputs);
  const unsupported = new Set(input.result.unsupportedTargetOutputs);

  for (const output of WALL_CARD_AUDIT_OUTPUTS) {
    const card = buildOutputCard({
      output,
      result: input.result,
      studyMode: "wall"
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

describe("wall output-card support parity", () => {
  it("keeps every representative wall preset card aligned with engine support buckets across lab, field, and building contexts", () => {
    const failures: string[] = [];
    const contexts: Array<{
      airborneContext: AirborneContext | null;
      label: string;
    }> = [
      {
        airborneContext: LAB_CONTEXT,
        label: "lab"
      },
      {
        airborneContext: FIELD_BETWEEN_ROOMS_CONTEXT,
        label: "field_between_rooms"
      },
      {
        airborneContext: BUILDING_PREDICTION_CONTEXT,
        label: "building_prediction"
      }
    ];

    for (const preset of WORKBENCH_PRESETS.filter(
      (candidate): candidate is PresetDefinition => candidate.studyMode === "wall"
    )) {
      for (const context of contexts) {
        const result = expectWallScenarioResult(
          evaluateWallRows({
            airborneContext: context.airborneContext,
            id: `${preset.id}-${context.label}`,
            rows: preset.rows.map((row, index) => ({
              ...row,
              id: `${preset.id}-${context.label}-${index + 1}`
            }))
          }),
          `${preset.id} ${context.label}`
        );

        auditResultParity({
          failures,
          label: `${preset.id} ${context.label}`,
          result
        });
      }
    }

    expect(failures).toEqual([]);
  });
});
