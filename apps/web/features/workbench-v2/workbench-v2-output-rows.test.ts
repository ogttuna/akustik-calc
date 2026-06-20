import type { AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { buildOutputRows } from "./workbench-v2-shell";

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

function buildFixture(input: {
  supportedTargetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
}): AssemblyCalculation {
  return {
    curve: {
      frequenciesHz: [100, 125, 160],
      transmissionLossDb: [40, 44, 48]
    },
    impact: null,
    layers: [],
    metrics: {
      airGapCount: 1,
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46,
      estimatedStc: 46,
      insulationCount: 1,
      method: "dynamic",
      surfaceMassKgM2: 21.2,
      totalThicknessMm: 115
    },
    ok: true,
    ratings: {
      astmE413: {
        STC: 40
      },
      iso717: {
        C: 0,
        Ctr: 0,
        Rw: 40,
        composite: "Rw 40 (0;0)",
        descriptor: "Rw"
      }
    },
    supportedTargetOutputs: [...input.supportedTargetOutputs],
    targetOutputs: [...LAB_OUTPUTS],
    unsupportedTargetOutputs: [...input.unsupportedTargetOutputs],
    warnings: []
  } as AssemblyCalculation;
}

describe("workbench v2 output rows", () => {
  it("uses visible metrics for supported lab outputs instead of stale rating values", () => {
    const rows = buildOutputRows(
      buildFixture({
        supportedTargetOutputs: LAB_OUTPUTS,
        unsupportedTargetOutputs: []
      }),
      LAB_OUTPUTS
    );

    expect(rows).toEqual([
      { detail: "Calculated", label: "Rw", status: "live", value: "46 dB" },
      { detail: "Calculated", label: "STC", status: "live", value: "46 dB" },
      { detail: "Calculated", label: "C", status: "live", value: "-1 dB" },
      { detail: "Calculated", label: "Ctr", status: "live", value: "-6.1 dB" }
    ]);
  });

  it("does not mark unsupported finite helper metrics as live output rows", () => {
    const rows = buildOutputRows(
      buildFixture({
        supportedTargetOutputs: ["Rw"],
        unsupportedTargetOutputs: ["STC", "C", "Ctr"]
      }),
      LAB_OUTPUTS
    );

    expect(rows).toEqual([
      { detail: "Calculated", label: "Rw", status: "live", value: "46 dB" },
      { detail: "Unsupported for current route", label: "STC", status: "unsupported", value: "--" },
      { detail: "Unsupported for current route", label: "C", status: "unsupported", value: "--" },
      { detail: "Unsupported for current route", label: "Ctr", status: "unsupported", value: "--" }
    ]);
  });
});
