import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";

const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI"];
const FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"];

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms" as const,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

describe("bare tagged floor family contract", () => {
  it("keeps unsafe tagged single-layer bare structural carriers fail-closed on impact while preserving airborne screening companions", () => {
    const failures: string[] = [];
    const cases: Array<{
      label: string;
      layers: LayerInput[];
      expectedFieldRwPrime: number;
      expectedFieldDnTw: number;
      expectedLabRw: number;
    }> = [
      {
        label: "open-box timber",
        layers: [{ floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }],
        expectedFieldRwPrime: 40,
        expectedFieldDnTw: 43,
        expectedLabRw: 42
      },
      {
        label: "open-web steel",
        layers: [{ floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }],
        expectedFieldRwPrime: 70,
        expectedFieldDnTw: 73,
        expectedLabRw: 72
      },
      {
        label: "steel joist",
        layers: [{ floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 250 }],
        expectedFieldRwPrime: 69,
        expectedFieldDnTw: 71,
        expectedLabRw: 71
      },
      {
        label: "generic lightweight steel",
        layers: [{ floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 250 }],
        expectedFieldRwPrime: 69,
        expectedFieldDnTw: 71,
        expectedLabRw: 71
      }
    ];

    for (const entry of cases) {
      const assemblyLab = calculateAssembly(entry.layers, {
        targetOutputs: LAB_OUTPUTS
      });
      const assemblyField = calculateAssembly(entry.layers, {
        airborneContext: AIRBORNE_FIELD_CONTEXT,
        impactFieldContext: IMPACT_FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });
      const impactOnly = calculateImpactOnly(entry.layers, {
        targetOutputs: LAB_OUTPUTS
      });

      if (assemblyLab.impact || assemblyField.impact || impactOnly.impact) {
        failures.push(`${entry.label}: expected impact lane to stay fail-closed on both assembly and impact-only surfaces`);
      }

      if (assemblyLab.floorSystemEstimate || assemblyField.floorSystemEstimate || impactOnly.floorSystemEstimate) {
        failures.push(`${entry.label}: expected no floor-system family estimate to be synthesized`);
      }

      if (assemblyLab.supportedTargetOutputs.join("|") !== "Rw") {
        failures.push(
          `${entry.label}: expected assembly lab support to stay on Rw only, got ${JSON.stringify(assemblyLab.supportedTargetOutputs)}`
        );
      }

      if (assemblyField.supportedTargetOutputs.join("|") !== "R'w|DnT,w") {
        failures.push(
          `${entry.label}: expected assembly field support to stay on R'w + DnT,w only, got ${JSON.stringify(assemblyField.supportedTargetOutputs)}`
        );
      }

      if (impactOnly.supportedTargetOutputs.length !== 0) {
        failures.push(
          `${entry.label}: expected impact-only surface to keep all requested outputs unsupported, got ${JSON.stringify(impactOnly.supportedTargetOutputs)}`
        );
      }

      if (assemblyLab.floorSystemRatings?.Rw !== entry.expectedLabRw) {
        failures.push(`${entry.label}: expected assembly lab Rw ${entry.expectedLabRw}, got ${assemblyLab.floorSystemRatings?.Rw ?? "null"}`);
      }

      if (assemblyField.metrics.estimatedRwPrimeDb !== entry.expectedFieldRwPrime) {
        failures.push(
          `${entry.label}: expected field R'w ${entry.expectedFieldRwPrime}, got ${assemblyField.metrics.estimatedRwPrimeDb ?? "null"}`
        );
      }

      if (assemblyField.metrics.estimatedDnTwDb !== entry.expectedFieldDnTw) {
        failures.push(
          `${entry.label}: expected field DnT,w ${entry.expectedFieldDnTw}, got ${assemblyField.metrics.estimatedDnTwDb ?? "null"}`
        );
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps tagged bare timber-frame floors on same-family general recommendations instead of borrowing unrelated concrete/composite sources", () => {
    const result = calculateAssembly([{ floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 200 }], {
      targetOutputs: LAB_OUTPUTS
    });

    expect(result.floorSystemEstimate?.kind).toBe("family_general");
    expect(result.impact?.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(result.floorSystemEstimate?.impact.estimateCandidateIds).toEqual([
      "knauf_ct2g_timber_nil_lab_2026",
      "knauf_ct2h_timber_nil_lab_2026"
    ]);
    expect(result.floorSystemEstimate?.impact.estimateCandidateIds).not.toContain("euracoustics_f0_bare_concrete_lab_2026");
    expect(result.floorSystemEstimate?.impact.estimateCandidateIds).not.toContain("pmc_m1_bare_composite_lab_2026");
    expect(result.floorSystemRatings?.Rw).toBe(50.5);
    expect(result.impact?.LnW).toBe(69);
  });
});
