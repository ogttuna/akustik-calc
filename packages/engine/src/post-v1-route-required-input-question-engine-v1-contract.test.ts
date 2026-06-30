import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  AcousticInputCompletenessSchema,
  AcousticInputFieldIdSchema,
  AcousticInputRouteFamilySchema
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_PLAN,
  POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_STATUS
} from "./post-v1-industry-grade-golden-scenario-matrix-v1";
import {
  POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_PLAN,
  POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_STATUS,
  buildPostV1RouteInputFamilyFirstClassSurface
} from "./post-v1-route-input-family-first-class-surface-v1";
import {
  POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_COUNTERS,
  POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_PLAN,
  POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_ROUTE_PRIORITY,
  POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_CANDIDATE_ID,
  POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_NEXT_ACTION,
  POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_NEXT_FILE,
  POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_NEXT_LABEL,
  POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_NEXT_PLAN_DOC,
  POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_STATUS,
  buildPostV1RouteRequiredInputQuestionEngineV1
} from "./post-v1-route-required-input-question-engine-v1";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_FILE =
  "packages/engine/src/post-v1-route-required-input-question-engine-v1-contract.test.ts";
const CURRENT_PLAN_DOC =
  "docs/calculator/POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_PLAN_2026-06-30.md";
const CURRENT_CHECKPOINT_DOC =
  "docs/calculator/CHECKPOINT_2026-06-30_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_HANDOFF.md";

const CURRENT_AUTHORITY_DOCS = [
  "AGENTS.md",
  CURRENT_CHECKPOINT_DOC,
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/SYSTEM_MAP.md",
  CURRENT_PLAN_DOC,
  POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_NEXT_PLAN_DOC
] as const;

const DOUBLE_LEAF_FRAMED_AIRBORNE_COMPLETENESS = AcousticInputCompletenessSchema.parse({
  id: "post_v1_question_engine_double_leaf_framed_airborne_minimum_unblocker",
  missingPhysicalInputs: [
    "leafGrouping",
    "cavityDepthMm",
    "supportTopology",
    "frameBridgeClass",
    "supportSpacingMm",
    "absorberFlowResistivityPaSM2"
  ],
  notes: [
    "Double-leaf framed airborne stacks need topology and cavity ownership before the wall route can publish."
  ],
  requiredFields: [
    "leafGrouping",
    "cavityDepthMm",
    "supportTopology",
    "frameBridgeClass",
    "supportSpacingMm",
    "absorberFlowResistivityPaSM2"
  ],
  routeFamily: "double_leaf_framed_airborne",
  status: "needs_input",
  targetOutputs: ["Rw", "STC", "C", "Ctr"]
});

const FLOATING_FLOOR_IMPACT_COMPLETENESS = AcousticInputCompletenessSchema.parse({
  id: "post_v1_question_engine_floating_floor_impact_minimum_unblocker",
  missingPhysicalInputs: [
    "baseSlabOrFloor",
    "ceilingOrLowerAssembly",
    "resilientLayerDynamicStiffnessMNPerM3",
    "loadBasisKgM2"
  ],
  notes: [
    "Floating-floor impact formulas need slab/lower treatment, dynamic stiffness, and load basis before impact values can publish."
  ],
  requiredFields: [
    "baseSlabOrFloor",
    "ceilingOrLowerAssembly",
    "resilientLayerDynamicStiffnessMNPerM3",
    "loadBasisKgM2"
  ],
  routeFamily: "floating_floor_impact",
  status: "needs_input",
  targetOutputs: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"]
});

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function buildCurrentQuestionSet() {
  const routeSurface = buildPostV1RouteInputFamilyFirstClassSurface({
    targetOutputs: ["Rw", "R'w", "DnT,w", "OITC", "IIC", "AIIC"]
  });

  return buildPostV1RouteRequiredInputQuestionEngineV1({
    inputCompletenessSet: [
      ...routeSurface.inputCompletenessSet,
      DOUBLE_LEAF_FRAMED_AIRBORNE_COMPLETENESS,
      FLOATING_FLOOR_IMPACT_COMPLETENESS
    ],
    targetOutputs: routeSurface.targetOutputs,
    unsupportedBoundaries: routeSurface.unsupportedBoundaries,
    unsupportedOutputs: routeSurface.unsupportedOutputs
  });
}

describe("post-V1 route-required input question engine V1", () => {
  it("lands the bounded input question engine and selects the roof runtime owner", () => {
    const questionSet = buildCurrentQuestionSet();

    expect(POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_PLAN).toBe(
      "post_v1_route_required_input_question_engine_v1_plan"
    );
    expect(POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_STATUS).toBe(
      "post_v1_route_required_input_question_engine_v1_landed_input_surface_selected_post_v1_roof_airborne_formula_owner_after_input_surface_v1"
    );
    expect(questionSet.previousAction).toBe(POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_PLAN);
    expect(questionSet.previousStatus).toBe(POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_STATUS);
    expect(questionSet.selectedCandidateId).toBe(
      POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_CANDIDATE_ID
    );
    expect(questionSet.selectedNext).toEqual({
      action: "post_v1_roof_airborne_formula_owner_after_input_surface_v1_plan",
      file: "packages/engine/src/post-v1-roof-airborne-formula-owner-after-input-surface-v1-contract.test.ts",
      label: "post-V1 roof airborne formula owner after input surface V1",
      plan: "docs/calculator/POST_V1_ROOF_AIRBORNE_FORMULA_OWNER_AFTER_INPUT_SURFACE_V1_PLAN_2026-06-30.md"
    });
    expect(questionSet.runtimeValueMovement).toBe(false);
    expect(POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_COUNTERS).toMatchObject({
      minimumUnblockerQuestions: 9,
      newCalculableRequestShapes: 0,
      newCalculableTargetOutputs: 0,
      optionalPrecisionQuestions: 0,
      requiredPhysicalInputsCaptured: 9,
      routeQuestionFamiliesCaptured: 9,
      runtimeBasisPromotions: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0,
      unsupportedBoundariesProtected: 8
    });
  });

  it("turns needs_input completeness rows into ordered minimum unblocker questions", () => {
    const questionSet = buildCurrentQuestionSet();
    const questionsByRoute = new Map(
      questionSet.minimumUnblockerQuestions.map((question) => [question.routeFamilies[0], question])
    );

    expect(questionSet.status).toBe("questions_ready");
    expect(questionSet.minimumUnblockerQuestions).toHaveLength(9);
    expect(questionSet.optionalPrecisionQuestions).toEqual([]);
    expect(questionSet.routeFamilies).toEqual([
      ...POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_ROUTE_PRIORITY
    ]);
    expect(questionSet.minimumUnblockerQuestions.map((question) => question.questionOrder)).toEqual(
      [...questionSet.minimumUnblockerQuestions.map((question) => question.questionOrder)].sort((left, right) => left - right)
    );

    expect(questionsByRoute.get("ceiling_roof_suspended_ceiling_route_boundary")).toMatchObject({
      fieldIds: [
        "routeIntent",
        "roofOrCeilingMountingContext",
        "suspendedCeilingAirborneOrImpactIntent",
        "hangerOrSupportCouplingClass"
      ],
      promptKind: "select_group",
      severity: "hard_blocker"
    });
    expect(questionsByRoute.get("double_leaf_framed_airborne")).toMatchObject({
      fieldIds: expect.arrayContaining([
        "leafGrouping",
        "cavityDepthMm",
        "supportTopology",
        "frameBridgeClass",
        "supportSpacingMm",
        "absorberFlowResistivityPaSM2"
      ]),
      promptKind: "number_group"
    });
    expect(questionsByRoute.get("roof_airborne")).toMatchObject({
      fieldIds: expect.arrayContaining([
        "routeIntent",
        "roofOrCeilingMountingContext",
        "frequencyBandSet",
        "surfaceMassKgM2",
        "cavityDepthMm"
      ]),
      promptKind: "number_group"
    });
    expect(questionsByRoute.get("opening_facade_outdoor_indoor_oitc")).toMatchObject({
      fieldIds: expect.arrayContaining([
        "facadeOutdoorOrRoomNormalizationContext",
        "frequencyBandSet",
        "openingElementTransmissionLossCurve",
        "openingSealLeakageClass"
      ]),
      promptKind: "spectral_curve"
    });
    expect(questionsByRoute.get("floating_floor_impact")).toMatchObject({
      fieldIds: [
        "baseSlabOrFloor",
        "ceilingOrLowerAssembly",
        "resilientLayerDynamicStiffnessMNPerM3",
        "loadBasisKgM2"
      ],
      promptKind: "number_group"
    });
    expect(questionsByRoute.get("field_building_flanking_context")).toMatchObject({
      fieldIds: expect.arrayContaining([
        "partitionAreaM2",
        "sourceRoomVolumeM3",
        "receivingRoomVolumeM3",
        "receivingRoomRt60S",
        "flankingJunctionClass",
        "buildingPredictionOutputBasis"
      ]),
      promptKind: "context_group"
    });
  });

  it("keeps every question typed, no-default, and non-runtime", () => {
    const questionSet = buildCurrentQuestionSet();

    for (const question of questionSet.minimumUnblockerQuestions) {
      expect(question.defaultPolicy, question.id).toBe("no_default");
      expect(question.missingBehavior, question.id).toBe("needs_input");
      expect(question.uncertaintyEffect, question.id).toBe("none");
      expect(question.targetOutputs.length, question.id).toBeGreaterThan(0);
      expect(question.notes.join("\n"), question.id).toContain("do not use nearby source rows or metric aliases");

      for (const fieldId of question.fieldIds) {
        expect(AcousticInputFieldIdSchema.parse(fieldId), question.id).toBe(fieldId);
      }
      for (const routeFamily of question.routeFamilies) {
        expect(AcousticInputRouteFamilySchema.parse(routeFamily), question.id).toBe(routeFamily);
      }
    }

    expect(questionSet.runtimeValueMovement).toBe(false);
  });

  it("does not ask route questions when all requested outputs are unsupported", () => {
    const unsupportedIic = buildPostV1RouteInputFamilyFirstClassSurface({
      exactImpactSource: {
        frequenciesHz: [100, 125, 160, 200],
        labOrField: "lab",
        levelsDb: [61, 60, 59, 58],
        standardMethod: "ISO 10140-3"
      },
      targetOutputs: ["IIC", "AIIC"]
    });
    const questionSet = buildPostV1RouteRequiredInputQuestionEngineV1({
      inputCompletenessSet: unsupportedIic.inputCompletenessSet,
      targetOutputs: unsupportedIic.targetOutputs,
      unsupportedBoundaries: unsupportedIic.unsupportedBoundaries,
      unsupportedOutputs: unsupportedIic.unsupportedOutputs
    });

    expect(unsupportedIic.status).toBe("unsupported");
    expect(questionSet.status).toBe("unsupported_only");
    expect(questionSet.minimumUnblockerQuestions).toEqual([]);
    expect(questionSet.unsupportedOutputs).toEqual(["IIC", "AIIC"]);
    expect(questionSet.unsupportedBoundaries).toEqual(expect.arrayContaining([
      "no IIC/AIIC from ISO Ln,w or DeltaLw",
      "no source-row proximity substitution without exact or bounded same-family evidence"
    ]));
  });

  it("keeps docs and current gate synchronized with the landed question engine and selected next", () => {
    for (const path of [
      CURRENT_FILE,
      CURRENT_CHECKPOINT_DOC,
      CURRENT_PLAN_DOC,
      POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }

    for (const path of CURRENT_AUTHORITY_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_PLAN);
      expect(content, path).toContain(POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_STATUS);
      expect(content, path).toContain(POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_PLAN);
      expect(content, path).toContain(POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_STATUS);
      expect(content, path).toContain(POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_PLAN);
      expect(content, path).toContain(POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_STATUS);
      expect(content, path).toContain(POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_NEXT_FILE);
      expect(content, path).toContain(POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain(POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_NEXT_LABEL);
      expect(content, path).toContain("minimumUnblockerQuestions: 9");
      expect(content, path).toContain("requiredPhysicalInputsCaptured: 9");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(CURRENT_FILE.replace("packages/engine/", ""));
  });
});
