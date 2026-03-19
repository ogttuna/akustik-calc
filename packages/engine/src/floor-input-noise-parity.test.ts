import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type NoiseVariant = "alternating" | "base_only" | "raw" | "reversed_base_only" | "reversed_raw";

type NoiseParityCase = {
  aliasSwap?: {
    canonical: string;
    replacement: string;
  };
  id: string;
  layers: readonly LayerInput[];
};

const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI"];
const FIELD_OUTPUTS: readonly RequestedOutputId[] = [
  "Rw",
  "R'w",
  "DnT,w",
  "DnT,A",
  "Dn,w",
  "Dn,A",
  "Ln,w",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
];

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

const CASES: readonly NoiseParityCase[] = [
  {
    id: "heavy floating concrete family estimate",
    layers: [
      { materialId: "concrete", thicknessMm: 150 },
      { materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { materialId: "screed", thicknessMm: 30 },
      { materialId: "ceramic_tile", thicknessMm: 8 }
    ]
  },
  {
    id: "open-box timber exact dry family",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 100 },
      { materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { materialId: "laminate_flooring", thicknessMm: 8 },
      { materialId: "eps_underlay", thicknessMm: 3 },
      { materialId: "generic_fill", thicknessMm: 50 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]
  },
  {
    id: "open-web steel exact combined family",
    layers: [
      { materialId: "open_web_steel_joist", thicknessMm: 300 },
      { materialId: "rubber_sheet", thicknessMm: 5 },
      { materialId: "particleboard_flooring", thicknessMm: 19 },
      { materialId: "engineered_timber_flooring", thicknessMm: 15 },
      { materialId: "resilient_channel", thicknessMm: 65 },
      { materialId: "glasswool", thicknessMm: 145 },
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "firestop_board", thicknessMm: 16 }
    ],
    aliasSwap: {
      canonical: "open_web_steel_joist",
      replacement: "open_web_steel_floor"
    }
  },
  {
    id: "open-web steel bound-only family",
    layers: [
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { materialId: "inex_floor_panel", thicknessMm: 19 },
      { materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    aliasSwap: {
      canonical: "open_web_steel_floor",
      replacement: "open_web_steel_joist"
    }
  }
];

function resultSnapshot(result: ReturnType<typeof calculateAssembly>) {
  return {
    basis: result.impact?.basis ?? null,
    boundFloorSystemMatchId: result.boundFloorSystemMatch?.system.id ?? null,
    dnA: result.metrics.estimatedDnADb ?? null,
    dnTw: result.metrics.estimatedDnTwDb ?? null,
    dnTA: result.metrics.estimatedDnTADb ?? null,
    dnW: result.metrics.estimatedDnWDb ?? null,
    floorSystemEstimateBasis: result.floorSystemEstimate?.impact.basis ?? null,
    floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    lPrimeNT50: result.impact?.LPrimeNT50 ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    lowerBoundLnWUpperBound: result.lowerBoundImpact?.LnWUpperBound ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    rwCtr: result.floorSystemRatings?.RwCtr ?? null,
    rwDb: result.metrics.estimatedRwDb ?? null,
    rwPrimeDb: result.metrics.estimatedRwPrimeDb ?? null,
    supportedImpactOutputs: result.supportedImpactOutputs,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedImpactOutputs: result.unsupportedImpactOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

function toBaseOnly(layers: readonly LayerInput[]): LayerInput[] {
  return layers.map((layer) =>
    layer.floorRole === "base_structure"
      ? { ...layer }
      : {
          materialId: layer.materialId,
          thicknessMm: layer.thicknessMm
        }
  );
}

function toAlternating(layers: readonly LayerInput[]): LayerInput[] {
  return layers.map((layer, index) =>
    index % 2 === 1
      ? { ...layer }
      : {
          materialId: layer.materialId,
          thicknessMm: layer.thicknessMm
        }
  );
}

function applyAliasSwap(
  layers: readonly LayerInput[],
  aliasSwap: NoiseParityCase["aliasSwap"]
): LayerInput[] {
  if (!aliasSwap) {
    return [...layers];
  }

  return layers.map((layer) =>
    layer.materialId === aliasSwap.canonical
      ? {
          ...layer,
          materialId: aliasSwap.replacement
        }
      : { ...layer }
  );
}

function buildVariantLayers(testCase: NoiseParityCase, variant: NoiseVariant): LayerInput[] {
  switch (variant) {
    case "raw":
      return [...testCase.layers];
    case "reversed_raw":
      return [...testCase.layers].reverse();
    case "base_only":
      return toBaseOnly(testCase.layers);
    case "reversed_base_only":
      return [...toBaseOnly(testCase.layers)].reverse();
    case "alternating":
      return toAlternating(testCase.layers);
  }
}

function assertParity(
  failures: string[],
  label: string,
  left: ReturnType<typeof calculateAssembly>,
  right: ReturnType<typeof calculateAssembly>
) {
  const leftSnapshot = resultSnapshot(left);
  const rightSnapshot = resultSnapshot(right);

  if (JSON.stringify(leftSnapshot) !== JSON.stringify(rightSnapshot)) {
    failures.push(`${label}: expected identical output snapshots, left=${JSON.stringify(leftSnapshot)} right=${JSON.stringify(rightSnapshot)}`);
  }
}

describe("floor input noise parity", () => {
  it("keeps representative floor families stable under raw order and sparse-tag noise in the lab bundle", () => {
    const failures: string[] = [];
    const variants: readonly NoiseVariant[] = ["raw", "reversed_raw", "base_only", "reversed_base_only", "alternating"];

    for (const testCase of CASES) {
      const canonical = calculateAssembly(testCase.layers, {
        targetOutputs: LAB_OUTPUTS
      });

      for (const variant of variants) {
        const candidate = calculateAssembly(buildVariantLayers(testCase, variant), {
          targetOutputs: LAB_OUTPUTS
        });

        assertParity(failures, `${testCase.id} ${variant} lab`, canonical, candidate);
      }

      if (testCase.aliasSwap) {
        const aliasVariant = calculateAssembly(applyAliasSwap(testCase.layers, testCase.aliasSwap), {
          targetOutputs: LAB_OUTPUTS
        });

        assertParity(failures, `${testCase.id} alias lab`, canonical, aliasVariant);
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps representative floor families stable under raw order and sparse-tag noise in the field bundle", () => {
    const failures: string[] = [];
    const variants: readonly NoiseVariant[] = ["raw", "reversed_raw", "base_only", "reversed_base_only", "alternating"];

    for (const testCase of CASES) {
      const canonical = calculateAssembly(testCase.layers, {
        airborneContext: AIRBORNE_FIELD_CONTEXT,
        impactFieldContext: IMPACT_FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });

      for (const variant of variants) {
        const candidate = calculateAssembly(buildVariantLayers(testCase, variant), {
          airborneContext: AIRBORNE_FIELD_CONTEXT,
          impactFieldContext: IMPACT_FIELD_CONTEXT,
          targetOutputs: FIELD_OUTPUTS
        });

        assertParity(failures, `${testCase.id} ${variant} field`, canonical, candidate);
      }

      if (testCase.aliasSwap) {
        const aliasVariant = calculateAssembly(applyAliasSwap(testCase.layers, testCase.aliasSwap), {
          airborneContext: AIRBORNE_FIELD_CONTEXT,
          impactFieldContext: IMPACT_FIELD_CONTEXT,
          targetOutputs: FIELD_OUTPUTS
        });

        assertParity(failures, `${testCase.id} alias field`, canonical, aliasVariant);
      }
    }

    expect(failures).toEqual([]);
  });
});
