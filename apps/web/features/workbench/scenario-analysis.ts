import { calculateAssembly } from "@dynecho/engine";
import type {
  AssemblyCalculation,
  AirborneCalculatorId,
  AirborneContext,
  ExactImpactSource,
  ImpactFieldContext,
  ImpactPredictorInput,
  LayerInput,
  MaterialDefinition,
  RequestedOutputId
} from "@dynecho/shared";

import { normalizeRows } from "./normalize-rows";
import type { StudyMode } from "./preset-definitions";
import { collectScenarioInputWarnings } from "./input-sanity";
import { buildWorkbenchMaterialCatalog } from "./workbench-materials";
import { buildWorkbenchWarningNotes } from "./workbench-warning-notes";
import type { LayerDraft } from "./workbench-store";
import {
  buildWorkbenchAirborneFieldContextInputSurface,
  formatWorkbenchAirborneFieldContextMissingInputWarning,
  type WorkbenchAirborneFieldContextInputSurfaceDraft
} from "./airborne-field-context-input-surface";
import {
  buildWorkbenchAdvancedWallInputSurface,
  formatWorkbenchAdvancedWallMissingInputWarning,
  type WorkbenchAdvancedWallInputSurfaceDraft
} from "./advanced-wall-source-absent-input-surface";
import {
  buildWorkbenchOpeningLeakCompositeInputSurface,
  formatWorkbenchOpeningLeakCompositeMissingInputWarning,
  type WorkbenchOpeningLeakCompositeInputSurfaceDraft
} from "./opening-leak-composite-input-surface";
import {
  buildWorkbenchOpeningLeakFieldBuildingInputSurface
} from "./opening-leak-field-building-input-surface";
import {
  buildWorkbenchOpenWebFieldBuildingInputSurface,
  formatWorkbenchOpenWebFieldBuildingMissingInputWarning,
  type WorkbenchOpenWebFieldBuildingInputSurfaceDraft
} from "./open-web-field-building-input-surface";
import {
  buildWorkbenchHeavyConcreteCombinedImpactInputSurface,
  formatWorkbenchHeavyConcreteCombinedImpactMissingInputWarning,
  type WorkbenchHeavyConcreteCombinedImpactInputSurfaceDraft
} from "./heavy-concrete-combined-impact-input-surface";
import {
  buildWorkbenchSteelFloorFormulaInputSurface,
  formatWorkbenchSteelFloorFormulaMissingInputWarning,
  type WorkbenchSteelFloorFormulaInputSurfaceDraft
} from "./steel-floor-formula-input-surface";
import {
  buildWorkbenchTimberCltDeltaLwInputSurface,
  formatWorkbenchTimberCltDeltaLwMissingInputWarning,
  type WorkbenchTimberCltDeltaLwInputSurfaceDraft
} from "./timber-clt-delta-lw-input-surface";

function collectInactiveOfficialProductWarnings(input: {
  layers: readonly LayerInput[];
  materials: readonly MaterialDefinition[];
  result: AssemblyCalculation | null;
}): string[] {
  if (!input.result) {
    return [];
  }

  const materialById = new Map(input.materials.map((material) => [material.id, material]));
  const matchedResilientMaterialIds = new Set(input.result.impactCatalogMatch?.catalog.match.resilientLayer?.materialIds ?? []);
  const warnings: string[] = [];
  const seenMaterialIds = new Set<string>();

  for (const layer of input.layers) {
    if (layer.floorRole !== "resilient_layer") {
      continue;
    }

    const material = materialById.get(layer.materialId);
    if (!material || seenMaterialIds.has(material.id)) {
      continue;
    }

    seenMaterialIds.add(material.id);

    if (material.category !== "support" || !material.tags.includes("official-product")) {
      continue;
    }

    if (matchedResilientMaterialIds.has(material.id)) {
      continue;
    }

    if (typeof material.impact?.dynamicStiffnessMNm3 === "number") {
      continue;
    }

    warnings.push(
      `${material.name} is in the stack, but no official product row matched the current topology and no generic dynamic stiffness fallback is available for this product. DAC kept the result on the broader predictor/family lane instead of inventing product-backed impact credit.`
    );
  }

  return warnings;
}

type HeavyConcreteCombinedSurfaceBridgeStatus =
  | "inactive"
  | "needs_input"
  | "ready_for_formula_corridor"
  | "unsafe_topology";

function shouldForwardHeavyConcreteCombinedImpactPredictor(
  surface: { readonly status: HeavyConcreteCombinedSurfaceBridgeStatus } | null | undefined
): boolean {
  return surface?.status === "ready_for_formula_corridor" || surface?.status === "unsafe_topology";
}

export type EvaluatedScenario = {
  airborneContext?: AirborneContext | null;
  id: string;
  name: string;
  result: AssemblyCalculation | null;
  rows: readonly LayerDraft[];
  savedAtIso?: string;
  source: "current" | "saved";
  studyMode: StudyMode;
  warnings: readonly string[];
};

export function evaluateScenario(input: {
  advancedWallInputSurface?: WorkbenchAdvancedWallInputSurfaceDraft | null;
  airborneFieldContextInputSurface?: WorkbenchAirborneFieldContextInputSurfaceDraft | null;
  airborneContext?: AirborneContext | null;
  calculator?: AirborneCalculatorId | null;
  customMaterials?: readonly MaterialDefinition[];
  exactImpactSource?: ExactImpactSource | null;
  id: string;
  impactFieldContext?: ImpactFieldContext | null;
  name: string;
  heavyConcreteCombinedImpactInputSurface?: WorkbenchHeavyConcreteCombinedImpactInputSurfaceDraft | null;
  openWebFieldBuildingInputSurface?: WorkbenchOpenWebFieldBuildingInputSurfaceDraft | null;
  openingLeakCompositeInputSurface?: WorkbenchOpeningLeakCompositeInputSurfaceDraft | null;
  rows: readonly LayerDraft[];
  savedAtIso?: string;
  source: "current" | "saved";
  steelFloorFormulaInputSurface?: WorkbenchSteelFloorFormulaInputSurfaceDraft | null;
  studyMode: StudyMode;
  targetOutputs?: readonly RequestedOutputId[];
  timberCltDeltaLwInputSurface?: WorkbenchTimberCltDeltaLwInputSurfaceDraft | null;
}): EvaluatedScenario {
  const baseCatalog = buildWorkbenchMaterialCatalog(input.customMaterials ?? []);
  const normalized = normalizeRows(input.rows, baseCatalog);
  const runtimeCatalog =
    normalized.runtimeMaterials.length > 0 ? [...baseCatalog, ...normalized.runtimeMaterials] : baseCatalog;
  const targetOutputs = input.targetOutputs ?? [];
  const airborneFieldContextInputSurface =
    input.airborneFieldContextInputSurface
      ? buildWorkbenchAirborneFieldContextInputSurface({
          studyMode: input.studyMode,
          surface: input.airborneFieldContextInputSurface,
          targetOutputs
      })
      : null;
  const openingLeakCompositeInputSurface =
    input.studyMode === "wall" && input.openingLeakCompositeInputSurface
      ? buildWorkbenchOpeningLeakCompositeInputSurface({
          studyMode: input.studyMode,
          surface: input.openingLeakCompositeInputSurface,
          targetOutputs
        })
      : null;
  const openingLeakFieldBuildingInputSurface = buildWorkbenchOpeningLeakFieldBuildingInputSurface({
    contextMode: airborneFieldContextInputSurface?.airborneContext.contextMode ?? input.airborneContext?.contextMode,
    openingLeakCompositeInputSurface,
    studyMode: input.studyMode,
    targetOutputs
  });
  const advancedWallInputSurface =
    input.studyMode === "wall" && input.advancedWallInputSurface
      ? buildWorkbenchAdvancedWallInputSurface({
          studyMode: input.studyMode,
          surface: input.advancedWallInputSurface,
          targetOutputs
        })
      : null;
  const baseAirborneContext = airborneFieldContextInputSurface?.airborneContext ?? input.airborneContext ?? null;
  const advancedWallAirborneContext =
    advancedWallInputSurface && advancedWallInputSurface.status !== "inactive"
      ? {
          ...(baseAirborneContext ?? { contextMode: "element_lab" as const }),
          ...advancedWallInputSurface.airborneContextPatch
        }
      : baseAirborneContext;
  const effectiveAirborneContext =
    openingLeakCompositeInputSurface && openingLeakCompositeInputSurface.status !== "inactive"
      ? {
          ...(advancedWallAirborneContext ?? { contextMode: "element_lab" as const }),
          ...openingLeakCompositeInputSurface.airborneContextPatch,
          ...openingLeakFieldBuildingInputSurface.airborneContextPatch
        }
      : advancedWallAirborneContext;
  const openWebFieldBuildingInputSurface =
    input.studyMode === "floor" && input.openWebFieldBuildingInputSurface
      ? buildWorkbenchOpenWebFieldBuildingInputSurface({
          layers: normalized.layers,
          studyMode: input.studyMode,
          surface: input.openWebFieldBuildingInputSurface,
          targetOutputs
        })
      : null;
  const effectiveFloorAirborneContext =
    openWebFieldBuildingInputSurface && openWebFieldBuildingInputSurface.status !== "inactive"
      ? openWebFieldBuildingInputSurface.airborneContext
      : effectiveAirborneContext;
  const effectiveImpactFieldContext =
    openWebFieldBuildingInputSurface && openWebFieldBuildingInputSurface.status !== "inactive"
      ? openWebFieldBuildingInputSurface.impactFieldContext
      : input.impactFieldContext ?? null;
  const inputWarnings = collectScenarioInputWarnings({
    airborneContext: effectiveFloorAirborneContext,
    impactFieldContext: effectiveImpactFieldContext,
    materials: runtimeCatalog,
    normalizedLayers: normalized.layers,
    rows: input.rows,
    studyMode: input.studyMode,
    targetOutputs
  });
  const scenarioWarnings = [...normalized.warnings, ...inputWarnings];
  const steelFloorFormulaInputSurface =
    input.studyMode === "floor" && input.steelFloorFormulaInputSurface
      ? buildWorkbenchSteelFloorFormulaInputSurface({
          catalog: runtimeCatalog,
          layers: normalized.layers,
          surface: input.steelFloorFormulaInputSurface,
          targetOutputs
        })
      : null;
  const timberCltDeltaLwInputSurface =
    input.studyMode === "floor" && input.timberCltDeltaLwInputSurface
      ? buildWorkbenchTimberCltDeltaLwInputSurface({
          layers: normalized.layers,
          surface: input.timberCltDeltaLwInputSurface,
          targetOutputs
        })
      : null;
  const heavyConcreteCombinedImpactInputSurface =
    input.studyMode === "floor" && input.heavyConcreteCombinedImpactInputSurface
      ? buildWorkbenchHeavyConcreteCombinedImpactInputSurface({
          catalog: runtimeCatalog,
          layers: normalized.layers,
          surface: input.heavyConcreteCombinedImpactInputSurface,
          targetOutputs
        })
      : null;
  if (steelFloorFormulaInputSurface?.status === "unsafe_topology") {
    scenarioWarnings.push(
      "Steel-floor formula input surface is parked because the visible steel carrier topology is unsafe to collapse. Keep one explicit base_structure carrier before relying on the steel formula lane."
    );
  }
  if (timberCltDeltaLwInputSurface?.status === "unsafe_topology") {
    scenarioWarnings.push(
      "Timber/CLT DeltaLw formula input surface is parked because the visible timber or CLT carrier topology is unsafe to collapse. Keep one explicit base_structure carrier before relying on the timber/CLT formula lane."
    );
  }
  if (heavyConcreteCombinedImpactInputSurface?.status === "unsafe_topology") {
    scenarioWarnings.push(
      "Heavy concrete combined formula input surface is parked because the visible concrete base topology is unsafe to collapse. Keep one explicit base_structure concrete slab before relying on the combined upper/lower formula lane."
    );
  }
  const steelFormulaMissingInputWarning = steelFloorFormulaInputSurface
    ? formatWorkbenchSteelFloorFormulaMissingInputWarning(steelFloorFormulaInputSurface)
    : null;
  if (steelFormulaMissingInputWarning) {
    scenarioWarnings.push(steelFormulaMissingInputWarning);
  }
  const timberCltMissingInputWarning = timberCltDeltaLwInputSurface
    ? formatWorkbenchTimberCltDeltaLwMissingInputWarning(timberCltDeltaLwInputSurface)
    : null;
  if (timberCltMissingInputWarning) {
    scenarioWarnings.push(timberCltMissingInputWarning);
  }
  const heavyConcreteMissingInputWarning = heavyConcreteCombinedImpactInputSurface
    ? formatWorkbenchHeavyConcreteCombinedImpactMissingInputWarning(heavyConcreteCombinedImpactInputSurface)
    : null;
  if (heavyConcreteMissingInputWarning) {
    scenarioWarnings.push(heavyConcreteMissingInputWarning);
  }
  const openWebFieldBuildingMissingInputWarning = openWebFieldBuildingInputSurface
    ? formatWorkbenchOpenWebFieldBuildingMissingInputWarning(openWebFieldBuildingInputSurface)
    : null;
  if (openWebFieldBuildingMissingInputWarning) {
    scenarioWarnings.push(openWebFieldBuildingMissingInputWarning);
  }
  if (openWebFieldBuildingInputSurface?.status === "unsupported") {
    scenarioWarnings.push(
      `Floor open-web field/building input surface is parked because the visible floor context is outside the current runtime boundary: ${openWebFieldBuildingInputSurface.unsupportedBoundaries.join(", ")}.`
    );
  }
  const airborneFieldMissingInputWarning = airborneFieldContextInputSurface
    ? formatWorkbenchAirborneFieldContextMissingInputWarning(airborneFieldContextInputSurface)
    : null;
  if (airborneFieldMissingInputWarning) {
    scenarioWarnings.push(airborneFieldMissingInputWarning);
  }
  const advancedWallMissingInputWarning = advancedWallInputSurface
    ? formatWorkbenchAdvancedWallMissingInputWarning(advancedWallInputSurface)
    : null;
  if (advancedWallMissingInputWarning) {
    scenarioWarnings.push(advancedWallMissingInputWarning);
  }
  if (advancedWallInputSurface?.status === "unsupported") {
    scenarioWarnings.push(
      `Advanced wall source-absent input surface is parked because the visible advanced-wall fields are outside the Gate AY lab runtime boundary: ${advancedWallInputSurface.hostileInputBoundaries.length > 0 ? advancedWallInputSurface.hostileInputBoundaries.join(", ") : "field_or_building_output_basis"}.`
    );
  }
  const openingLeakMissingInputWarning = openingLeakCompositeInputSurface
    ? formatWorkbenchOpeningLeakCompositeMissingInputWarning(openingLeakCompositeInputSurface)
    : null;
  if (openingLeakMissingInputWarning) {
    scenarioWarnings.push(openingLeakMissingInputWarning);
  }
  if (openingLeakCompositeInputSurface?.status === "unsupported") {
    scenarioWarnings.push(
      `Opening/leak composite input surface is parked because the visible opening fields are unsafe: ${openingLeakCompositeInputSurface.hostileInputBoundaries.join(", ")}.`
    );
  }
  const activeInputSurfacePredictors = [
    steelFloorFormulaInputSurface?.status !== "inactive" ? steelFloorFormulaInputSurface?.impactPredictorInput : null,
    timberCltDeltaLwInputSurface?.status !== "inactive" ? timberCltDeltaLwInputSurface?.impactPredictorInput : null,
    shouldForwardHeavyConcreteCombinedImpactPredictor(heavyConcreteCombinedImpactInputSurface)
      ? heavyConcreteCombinedImpactInputSurface?.impactPredictorInput
      : null
  ].filter((item): item is ImpactPredictorInput => item !== null && item !== undefined);
  if (activeInputSurfacePredictors.length > 1) {
    scenarioWarnings.push(
      "Multiple floor formula input surfaces matched this stack, so DAC parked the explicit predictor input instead of choosing between conflicting carrier families."
    );
  }
  const impactPredictorInput =
    activeInputSurfacePredictors.length === 1 ? activeInputSurfacePredictors[0] : null;
  let result: AssemblyCalculation | null = null;

  if (normalized.layers.length > 0) {
    try {
      result = calculateAssembly(normalized.layers, {
        airborneContext: effectiveFloorAirborneContext,
        calculator: input.calculator ?? null,
        catalog: runtimeCatalog,
        exactImpactSource: input.exactImpactSource ?? null,
        impactFieldContext: effectiveImpactFieldContext,
        impactPredictorInput,
        targetOutputs
      });
    } catch (error) {
      const detail = error instanceof Error && error.message.trim().length > 0 ? error.message.trim() : "Unknown evaluation error.";
      scenarioWarnings.push(
        `DAC could not evaluate the current scenario and kept the workspace live instead of crashing. ${detail}`
      );
    }
  }

  scenarioWarnings.push(
    ...collectInactiveOfficialProductWarnings({
      layers: normalized.layers,
      materials: runtimeCatalog,
      result
    })
  );

  return {
    ...input,
    airborneContext: effectiveFloorAirborneContext,
    result,
    warnings: result
      ? buildWorkbenchWarningNotes(result, [...scenarioWarnings, ...result.warnings])
      : scenarioWarnings
  };
}
