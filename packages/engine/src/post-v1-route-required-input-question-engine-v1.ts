import {
  type AcousticInputCompleteness,
  type AcousticInputDefaultPolicy,
  type AcousticInputFieldId,
  type AcousticInputMissingBehavior,
  type AcousticInputRouteFamily,
  type AcousticInputUncertaintyEffect,
  type RequestedOutputId
} from "@dynecho/shared";

import {
  POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_PLAN,
  POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_STATUS
} from "./post-v1-industry-grade-golden-scenario-matrix-v1";
import {
  POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_UNSUPPORTED_BOUNDARIES
} from "./post-v1-route-input-family-first-class-surface-v1";

export const POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_PLAN =
  "post_v1_route_required_input_question_engine_v1_plan";

export const POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_STATUS =
  "post_v1_route_required_input_question_engine_v1_landed_input_surface_selected_post_v1_roof_airborne_formula_owner_after_input_surface_v1";

export const POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_CANDIDATE_ID =
  "post_v1_route_required_input_question_engine_v1";

export const POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_NEXT_ACTION =
  "post_v1_roof_airborne_formula_owner_after_input_surface_v1_plan";

export const POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-roof-airborne-formula-owner-after-input-surface-v1-contract.test.ts";

export const POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_ROOF_AIRBORNE_FORMULA_OWNER_AFTER_INPUT_SURFACE_V1_PLAN_2026-06-30.md";

export const POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_NEXT_LABEL =
  "post-V1 roof airborne formula owner after input surface V1";

export const POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_COUNTERS = {
  frontendImplementationFilesTouched: 0,
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
} as const;

export const POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_PREVIOUS_ACTION =
  POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_PLAN;

export const POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_PREVIOUS_STATUS =
  POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_STATUS;

export const POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_ROUTE_PRIORITY = [
  "ceiling_roof_suspended_ceiling_route_boundary",
  "double_leaf_framed_airborne",
  "ceiling_airborne_plenum",
  "roof_airborne",
  "opening_facade_indoor",
  "opening_facade_outdoor_indoor_oitc",
  "floor_astm_iic_aiic_impact_rating",
  "floating_floor_impact",
  "field_building_flanking_context"
] as const satisfies readonly AcousticInputRouteFamily[];

export type PostV1RouteRequiredInputQuestionSeverity =
  | "hard_blocker"
  | "conditional_blocker"
  | "optional_precision";

export type PostV1RouteRequiredInputPromptKind =
  | "context_group"
  | "number_group"
  | "spectral_curve"
  | "select_group";

export type PostV1RouteRequiredInputQuestion = {
  readonly defaultPolicy: AcousticInputDefaultPolicy;
  readonly fieldIds: readonly AcousticInputFieldId[];
  readonly id: string;
  readonly labelKey: string;
  readonly missingBehavior: AcousticInputMissingBehavior;
  readonly notes: readonly string[];
  readonly promptKind: PostV1RouteRequiredInputPromptKind;
  readonly questionOrder: number;
  readonly routeFamilies: readonly AcousticInputRouteFamily[];
  readonly severity: PostV1RouteRequiredInputQuestionSeverity;
  readonly targetOutputs: readonly RequestedOutputId[];
  readonly uncertaintyEffect: AcousticInputUncertaintyEffect;
};

export type PostV1RouteRequiredInputQuestionEngineInput = {
  readonly inputCompletenessSet: readonly AcousticInputCompleteness[];
  readonly targetOutputs?: readonly RequestedOutputId[];
  readonly unsupportedBoundaries?: readonly string[];
  readonly unsupportedOutputs?: readonly RequestedOutputId[];
};

export type PostV1RouteRequiredInputQuestionEngineResult = {
  readonly minimumUnblockerQuestions: readonly PostV1RouteRequiredInputQuestion[];
  readonly optionalPrecisionQuestions: readonly PostV1RouteRequiredInputQuestion[];
  readonly previousAction: typeof POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_PREVIOUS_ACTION;
  readonly previousStatus: typeof POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_PREVIOUS_STATUS;
  readonly routeFamilies: readonly AcousticInputRouteFamily[];
  readonly runtimeValueMovement: false;
  readonly selectedCandidateId: typeof POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_CANDIDATE_ID;
  readonly selectedNext: {
    readonly action: typeof POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_NEXT_ACTION;
    readonly file: typeof POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_NEXT_FILE;
    readonly label: typeof POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_NEXT_LABEL;
    readonly plan: typeof POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_NEXT_PLAN_DOC;
  };
  readonly status: "complete" | "questions_ready" | "unsupported_only";
  readonly targetOutputs: readonly RequestedOutputId[];
  readonly unsupportedBoundaries: readonly string[];
  readonly unsupportedOutputs: readonly RequestedOutputId[];
};

const ROUTE_PRIORITY = new Map<AcousticInputRouteFamily, number>(
  POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_ROUTE_PRIORITY.map((family, index) => [
    family,
    (index + 1) * 10
  ])
);

const ROUTE_PROMPT_KIND: Partial<Record<AcousticInputRouteFamily, PostV1RouteRequiredInputPromptKind>> = {
  ceiling_airborne_plenum: "number_group",
  ceiling_roof_suspended_ceiling_route_boundary: "select_group",
  double_leaf_framed_airborne: "number_group",
  field_building_flanking_context: "context_group",
  floating_floor_impact: "number_group",
  floor_astm_iic_aiic_impact_rating: "select_group",
  opening_facade_indoor: "context_group",
  opening_facade_outdoor_indoor_oitc: "spectral_curve",
  roof_airborne: "number_group"
};

const ROUTE_LABEL_KEY: Partial<Record<AcousticInputRouteFamily, string>> = {
  ceiling_airborne_plenum: "acoustic.input.ceiling_airborne_plenum.minimum_unblocker",
  ceiling_roof_suspended_ceiling_route_boundary:
    "acoustic.input.ceiling_roof_suspended_ceiling_route_boundary.minimum_unblocker",
  double_leaf_framed_airborne: "acoustic.input.double_leaf_framed_airborne.minimum_unblocker",
  field_building_flanking_context: "acoustic.input.field_building_flanking_context.minimum_unblocker",
  floating_floor_impact: "acoustic.input.floating_floor_impact.minimum_unblocker",
  floor_astm_iic_aiic_impact_rating:
    "acoustic.input.floor_astm_iic_aiic_impact_rating.minimum_unblocker",
  opening_facade_indoor: "acoustic.input.opening_facade_indoor.minimum_unblocker",
  opening_facade_outdoor_indoor_oitc:
    "acoustic.input.opening_facade_outdoor_indoor_oitc.minimum_unblocker",
  roof_airborne: "acoustic.input.roof_airborne.minimum_unblocker"
};

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function routePriority(routeFamily: AcousticInputRouteFamily): number {
  return ROUTE_PRIORITY.get(routeFamily) ?? 1000;
}

function allRequestedOutputsUnsupported(
  targetOutputs: readonly RequestedOutputId[],
  unsupportedOutputs: readonly RequestedOutputId[]
): boolean {
  if (targetOutputs.length === 0 || unsupportedOutputs.length === 0) {
    return false;
  }

  const unsupported = new Set(unsupportedOutputs);
  return targetOutputs.every((output) => unsupported.has(output));
}

function severityFor(entry: AcousticInputCompleteness): PostV1RouteRequiredInputQuestionSeverity {
  const required = new Set(entry.requiredFields);
  const hasRequiredBlocker = entry.missingPhysicalInputs.some((field) => required.has(field));

  if (hasRequiredBlocker) {
    return "hard_blocker";
  }

  const conditional = new Set(entry.conditionalFields);
  const hasConditionalBlocker = entry.missingPhysicalInputs.some((field) => conditional.has(field));
  return hasConditionalBlocker ? "conditional_blocker" : "optional_precision";
}

function buildMinimumUnblockerQuestion(
  entry: AcousticInputCompleteness,
  index: number
): PostV1RouteRequiredInputQuestion {
  const priority = routePriority(entry.routeFamily);

  return {
    defaultPolicy: "no_default",
    fieldIds: [...entry.missingPhysicalInputs],
    id: `${POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_CANDIDATE_ID}.${entry.routeFamily}.minimum_unblocker`,
    labelKey: ROUTE_LABEL_KEY[entry.routeFamily] ?? `acoustic.input.${entry.routeFamily}.minimum_unblocker`,
    missingBehavior: "needs_input",
    notes: [
      ...entry.notes,
      "Ask this group as a minimum route unblocker; do not use nearby source rows or metric aliases when it is missing."
    ],
    promptKind: ROUTE_PROMPT_KIND[entry.routeFamily] ?? "context_group",
    questionOrder: priority + index,
    routeFamilies: [entry.routeFamily],
    severity: severityFor(entry),
    targetOutputs: [...entry.targetOutputs],
    uncertaintyEffect: "none"
  };
}

function sortQuestions(
  questions: readonly PostV1RouteRequiredInputQuestion[]
): PostV1RouteRequiredInputQuestion[] {
  return [...questions].sort((left, right) => {
    if (left.questionOrder !== right.questionOrder) {
      return left.questionOrder - right.questionOrder;
    }

    return left.id.localeCompare(right.id);
  });
}

export function buildPostV1RouteRequiredInputQuestionEngineV1(
  input: PostV1RouteRequiredInputQuestionEngineInput
): PostV1RouteRequiredInputQuestionEngineResult {
  const targetOutputs = input.targetOutputs ?? unique(
    input.inputCompletenessSet.flatMap((entry) => entry.targetOutputs)
  );
  const unsupportedOutputs = unique(input.unsupportedOutputs ?? []);
  const unsupportedBoundaries = unique([
    ...POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_UNSUPPORTED_BOUNDARIES,
    ...(input.unsupportedBoundaries ?? [])
  ]);

  const suppressQuestions = allRequestedOutputsUnsupported(targetOutputs, unsupportedOutputs);
  const minimumUnblockerQuestions = suppressQuestions
    ? []
    : sortQuestions(
      input.inputCompletenessSet
        .filter((entry) => entry.status === "needs_input")
        .filter((entry) => entry.missingPhysicalInputs.length > 0)
        .map(buildMinimumUnblockerQuestion)
    );

  const routeFamilies = unique(
    minimumUnblockerQuestions.flatMap((question) => question.routeFamilies)
  );
  const status =
    minimumUnblockerQuestions.length > 0
      ? "questions_ready"
      : suppressQuestions
        ? "unsupported_only"
        : "complete";

  return {
    minimumUnblockerQuestions,
    optionalPrecisionQuestions: [],
    previousAction: POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_PREVIOUS_ACTION,
    previousStatus: POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_PREVIOUS_STATUS,
    routeFamilies,
    runtimeValueMovement: false,
    selectedCandidateId: POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_CANDIDATE_ID,
    selectedNext: {
      action: POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_NEXT_ACTION,
      file: POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_NEXT_FILE,
      label: POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_NEXT_LABEL,
      plan: POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_SELECTED_NEXT_PLAN_DOC
    },
    status,
    targetOutputs: [...targetOutputs],
    unsupportedBoundaries,
    unsupportedOutputs
  };
}
