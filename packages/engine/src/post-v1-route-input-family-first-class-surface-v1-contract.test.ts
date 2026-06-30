import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  AcousticAnswerBoundaryRouteSchema,
  AcousticInputFieldIdSchema,
  AcousticInputRouteFamilySchema,
  LayerCombinationResolverRouteSchema,
  type AirborneContext,
  type ExactImpactSource
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  ASTM_E989_IIC_METRIC_BASIS,
  ASTM_E989_IMPACT_RATING_BASIS,
  ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID
} from "./impact-astm-e989";
import { IMPACT_RATING_FREQS_THIRD } from "./impact-iso717";
import { buildLayerCombinationResolverRegistryContract } from "./layer-combination-resolver-registry";
import {
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_SELECTED_CANDIDATE_ID
} from "./post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner";
import {
  POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_SELECTED_CANDIDATE_ID
} from "./post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-owner";
import {
  POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_ROUTE_FAMILIES,
  POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_COUNTERS,
  POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_PLAN,
  POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_SELECTED_CANDIDATE_ID,
  POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_SELECTED_NEXT_ACTION,
  POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_SELECTED_NEXT_FILE,
  POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_SELECTED_NEXT_LABEL,
  POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_SELECTED_NEXT_PLAN_DOC,
  POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_STATUS,
  POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_UNSUPPORTED_BOUNDARIES,
  buildPostV1RouteInputFamilyFirstClassSurface
} from "./post-v1-route-input-family-first-class-surface-v1";
import { analyzeTargetOutputSupport } from "./target-output-support";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_ACTION = "post_v1_spectral_rating_backbone_v1_plan";
const PREVIOUS_STATUS =
  "post_v1_spectral_rating_backbone_v1_landed_support_selected_post_v1_route_input_family_first_class_surface_v1";
const CURRENT_FILE = "packages/engine/src/post-v1-route-input-family-first-class-surface-v1-contract.test.ts";
const CURRENT_PLAN_DOC = "docs/calculator/POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_PLAN_2026-06-29.md";

const CURRENT_AUTHORITY_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/SYSTEM_MAP.md",
  CURRENT_PLAN_DOC,
  POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_SELECTED_NEXT_PLAN_DOC
] as const;

const COMPLETE_OITC_CONTEXT = {
  facadeOutdoorContext: "outdoor_indoor_facade",
  frequencyBandSet: "one_third_octave_80_4000",
  hostWallAreaM2: 12,
  openingLeakElements: [
    {
      areaM2: 2.2,
      count: 1,
      elementTransmissionLossCurve: {
        frequenciesHz: [
          80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250,
          1600, 2000, 2500, 3150, 4000
        ],
        transmissionLossDb: [
          20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 43, 44, 45, 46,
          47, 48
        ]
      },
      elementType: "facade_element",
      frequencyBandSet: "one_third_octave_80_4000",
      sealLeakageClass: "sealed"
    }
  ]
} as const satisfies AirborneContext;

const ASTM_FIELD_SOURCE = {
  frequenciesHz: [...IMPACT_RATING_FREQS_THIRD],
  labOrField: "field",
  levelsDb: IMPACT_RATING_FREQS_THIRD.map((_, index) => 58 + (index % 3)),
  standardMethod: "ASTM E1007 / ASTM E989"
} as const satisfies ExactImpactSource;

const ISO_LAB_SOURCE = {
  frequenciesHz: [...IMPACT_RATING_FREQS_THIRD],
  labOrField: "lab",
  levelsDb: IMPACT_RATING_FREQS_THIRD.map((_, index) => 58 + (index % 3)),
  standardMethod: "ISO 10140-3"
} as const satisfies ExactImpactSource;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 route/input family first-class surface V1", () => {
  it("lands the input-surface slice without moving runtime values and selects the golden scenario matrix", () => {
    expect(existsSync(join(REPO_ROOT, CURRENT_PLAN_DOC))).toBe(true);
    expect(POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_PLAN).toBe(
      "post_v1_route_input_family_first_class_surface_v1_plan"
    );
    expect(POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_STATUS).toBe(
      "post_v1_route_input_family_first_class_surface_v1_landed_input_surface_selected_post_v1_industry_grade_golden_scenario_matrix_v1"
    );
    expect(POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_SELECTED_CANDIDATE_ID).toBe(
      "post_v1_route_input_family_first_class_surface_v1"
    );
    expect(POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_SELECTED_NEXT_ACTION).toBe(
      "post_v1_industry_grade_golden_scenario_matrix_v1_plan"
    );
    expect(POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-industry-grade-golden-scenario-matrix-v1-contract.test.ts"
    );
    expect(POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_COUNTERS).toMatchObject({
      firstClassRouteFamiliesCaptured: 6,
      newCalculableRequestShapes: 0,
      newCalculableTargetOutputs: 0,
      requiredPhysicalInputsCaptured: 6,
      runtimeBasisPromotions: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0,
      unsupportedBoundariesProtected: 8
    });
  });

  it("makes newer route families and route precision typed instead of loose doc strings", () => {
    for (const family of POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_ROUTE_FAMILIES) {
      expect(AcousticInputRouteFamilySchema.parse(family)).toBe(family);
    }

    for (const field of [
      "routeIntent",
      "roofOrCeilingMountingContext",
      "suspendedCeilingAirborneOrImpactIntent",
      "hangerOrSupportCouplingClass"
    ]) {
      expect(AcousticInputFieldIdSchema.parse(field)).toBe(field);
    }

    for (const route of ["opening", "facade", "roof"] as const) {
      expect(AcousticAnswerBoundaryRouteSchema.parse(route)).toBe(route);
      expect(LayerCombinationResolverRouteSchema.parse(route)).toBe(route);
    }
  });

  it("returns route-family-owned needs_input rows without hiding source-only evidence", () => {
    const result = buildPostV1RouteInputFamilyFirstClassSurface({
      targetOutputs: ["Rw", "R'w", "DnT,w", "OITC", "IIC", "AIIC"]
    });

    expect(result.runtimeValueMovement).toBe(false);
    expect(result.status).toBe("needs_input");
    expect(result.routeFamilies).toEqual([
      "ceiling_roof_suspended_ceiling_route_boundary",
      "ceiling_airborne_plenum",
      "roof_airborne",
      "opening_facade_indoor",
      "opening_facade_outdoor_indoor_oitc",
      "floor_astm_iic_aiic_impact_rating",
      "field_building_flanking_context"
    ]);
    expect(result.missingPhysicalInputs).toEqual(expect.arrayContaining([
      "routeIntent",
      "roofOrCeilingMountingContext",
      "suspendedCeilingAirborneOrImpactIntent",
      "hangerOrSupportCouplingClass",
      "facadeOutdoorOrRoomNormalizationContext",
      "frequencyBandSet",
      "openingElementTransmissionLossCurve",
      "impactFieldContext",
      "partitionAreaM2",
      "flankingJunctionClass"
    ]));
    expect(result.inputCompletenessSet.every((entry) => entry.missingSourceEvidence.length === 0)).toBe(true);
    expect(result.inputCompletenessSet.find(
      (entry) => entry.routeFamily === "opening_facade_outdoor_indoor_oitc"
    )).toMatchObject({
      requiredFields: [
        "facadeOutdoorOrRoomNormalizationContext",
        "frequencyBandSet",
        "hostWallAreaM2",
        "openingAreaM2",
        "openingCount",
        "openingElementTransmissionLossCurve",
        "openingElementType",
        "openingSealLeakageClass"
      ],
      status: "needs_input",
      targetOutputs: ["OITC"]
    });
  });

  it("classifies complete OITC and field ASTM AIIC input surfaces without opening new runtime values", () => {
    const oitc = buildPostV1RouteInputFamilyFirstClassSurface({
      airborneContext: COMPLETE_OITC_CONTEXT,
      targetOutputs: ["OITC"]
    });
    const aiic = buildPostV1RouteInputFamilyFirstClassSurface({
      exactImpactSource: ASTM_FIELD_SOURCE,
      targetOutputs: ["AIIC"]
    });

    expect(oitc.inputCompletenessSet).toEqual([
      expect.objectContaining({
        missingPhysicalInputs: [],
        routeFamily: "opening_facade_outdoor_indoor_oitc",
        status: "complete",
        targetOutputs: ["OITC"]
      })
    ]);
    expect(oitc.runtimeValueMovement).toBe(false);
    expect(aiic.inputCompletenessSet).toEqual([
      expect.objectContaining({
        missingPhysicalInputs: [],
        routeFamily: "floor_astm_iic_aiic_impact_rating",
        status: "complete",
        targetOutputs: ["AIIC"]
      })
    ]);
    expect(aiic.runtimeValueMovement).toBe(false);
  });

  it("keeps adjacent unsupported metric bases explicit", () => {
    const result = buildPostV1RouteInputFamilyFirstClassSurface({
      airborneContext: { facadeOutdoorContext: "indoor_partition" },
      exactImpactSource: ISO_LAB_SOURCE,
      targetOutputs: ["OITC", "IIC", "AIIC", "NISR"]
    });

    expect(result.status).toBe("unsupported");
    expect(result.unsupportedOutputs).toEqual(["NISR", "OITC", "IIC", "AIIC"]);
    expect(result.unsupportedBoundaries).toEqual([
      ...POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_UNSUPPORTED_BOUNDARIES
    ]);
  });

  it("keeps target-output support from aliasing OITC or ASTM impact companions", () => {
    const oitcOnly = analyzeTargetOutputSupport({
      impact: null,
      lowerBoundImpact: null,
      metrics: { estimatedOitcDb: 32 },
      targetOutputs: ["OITC", "Rw", "STC", "DnT,w", "IIC"]
    });
    const astmLabOnly = analyzeTargetOutputSupport({
      impact: {
        IIC: 50,
        availableOutputs: ["IIC"],
        basis: ASTM_E989_IMPACT_RATING_BASIS,
        confidence: {
          level: "high",
          provenance: "exact_band_curve",
          score: 0.95,
          summary: "test ASTM E989 exact band source"
        },
        labOrField: "lab",
        metricBasis: { IIC: ASTM_E989_IIC_METRIC_BASIS },
        notes: ["test ASTM E989 IIC source"],
        scope: "exact_band_curve"
      },
      lowerBoundImpact: null,
      targetOutputs: ["IIC", "AIIC"]
    });

    expect(oitcOnly).toMatchObject({
      supportedTargetOutputs: ["OITC"],
      unsupportedTargetOutputs: ["Rw", "STC", "DnT,w", "IIC"]
    });
    expect(astmLabOnly).toMatchObject({
      supportedImpactOutputs: ["IIC"],
      supportedTargetOutputs: ["IIC"],
      unsupportedImpactOutputs: ["AIIC"],
      unsupportedTargetOutputs: ["AIIC"]
    });
  });

  it("keeps docs, registry, and current gate synchronized with the landed input surface", () => {
    for (const path of [
      CURRENT_FILE,
      CURRENT_PLAN_DOC,
      POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }

    for (const path of CURRENT_AUTHORITY_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PREVIOUS_ACTION);
      expect(content, path).toContain(PREVIOUS_STATUS);
      expect(content, path).toContain(POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_PLAN);
      expect(content, path).toContain(POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_STATUS);
      expect(content, path).toContain(POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_SELECTED_NEXT_FILE);
      expect(content, path).toContain(POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain(POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_SELECTED_NEXT_LABEL);
      expect(content, path).toContain("firstClassRouteFamiliesCaptured: 6");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("not a broad source crawl");
    }

    const registry = buildLayerCombinationResolverRegistryContract();
    const registryCandidateIds = registry.candidateDeclarations.map((candidate) => candidate.id);

    expect(registryCandidateIds).toEqual(
      expect.arrayContaining([
        POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_SELECTED_CANDIDATE_ID,
        POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_SELECTED_CANDIDATE_ID,
        ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID
      ])
    );
    expect(Object.keys(registry.summary.routeCount).sort()).toEqual([
      "ceiling",
      "facade",
      "floor",
      "opening",
      "roof",
      "wall"
    ]);

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(CURRENT_FILE.replace("packages/engine/", ""));
  });
});
