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
      expectedImpactOnlySupported: readonly RequestedOutputId[];
      expectedLabSupported: readonly RequestedOutputId[];
      expectedFieldSupported: readonly RequestedOutputId[];
      opensFloorSystemEstimate: boolean;
    }> = [
      {
        label: "open-box timber",
        layers: [{ floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }],
        expectedFieldRwPrime: 40,
        expectedFieldDnTw: 43,
        expectedImpactOnlySupported: ["Rw", "Ln,w", "Ln,w+CI"],
        expectedLabRw: 42.3,
        expectedLabSupported: ["Rw", "Ln,w", "Ln,w+CI"],
        expectedFieldSupported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
        opensFloorSystemEstimate: true
      },
      {
        label: "open-web steel",
        layers: [{ floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }],
        expectedFieldRwPrime: 70,
        expectedFieldDnTw: 73,
        expectedImpactOnlySupported: ["Rw", "Ln,w", "Ln,w+CI"],
        expectedLabRw: 32,
        expectedLabSupported: ["Rw", "Ln,w", "Ln,w+CI"],
        expectedFieldSupported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
        opensFloorSystemEstimate: true
      },
      {
        label: "steel joist",
        layers: [{ floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 250 }],
        expectedFieldRwPrime: 69,
        expectedFieldDnTw: 71,
        expectedImpactOnlySupported: [],
        expectedLabRw: 71,
        expectedLabSupported: ["Rw"],
        expectedFieldSupported: ["Rw", "R'w", "DnT,w"],
        opensFloorSystemEstimate: false
      },
      {
        label: "generic lightweight steel",
        layers: [{ floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 250 }],
        expectedFieldRwPrime: 69,
        expectedFieldDnTw: 71,
        expectedImpactOnlySupported: [],
        expectedLabRw: 71,
        expectedLabSupported: ["Rw"],
        expectedFieldSupported: ["Rw", "R'w", "DnT,w"],
        opensFloorSystemEstimate: false
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

      if (entry.opensFloorSystemEstimate && (!assemblyLab.impact || !assemblyField.impact || !impactOnly.impact)) {
        failures.push(`${entry.label}: expected tagged raw-bare owner to open the impact lane on assembly and impact-only surfaces`);
      }

      if (!entry.opensFloorSystemEstimate && (assemblyLab.floorSystemEstimate || assemblyField.floorSystemEstimate || impactOnly.floorSystemEstimate)) {
        failures.push(`${entry.label}: expected no floor-system family estimate to be synthesized`);
      }

      if (assemblyLab.supportedTargetOutputs.join("|") !== entry.expectedLabSupported.join("|")) {
        failures.push(
          `${entry.label}: expected assembly lab support ${JSON.stringify(entry.expectedLabSupported)}, got ${JSON.stringify(assemblyLab.supportedTargetOutputs)}`
        );
      }

      if (assemblyField.supportedTargetOutputs.join("|") !== entry.expectedFieldSupported.join("|")) {
        failures.push(
          `${entry.label}: expected assembly field support ${JSON.stringify(entry.expectedFieldSupported)}, got ${JSON.stringify(assemblyField.supportedTargetOutputs)}`
        );
      }

      if (impactOnly.supportedTargetOutputs.join("|") !== entry.expectedImpactOnlySupported.join("|")) {
        failures.push(
          `${entry.label}: expected impact-only support ${JSON.stringify(entry.expectedImpactOnlySupported)}, got ${JSON.stringify(impactOnly.supportedTargetOutputs)}`
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
