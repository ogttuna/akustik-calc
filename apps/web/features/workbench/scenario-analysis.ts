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

export type EvaluatedScenario = {
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
  airborneContext?: AirborneContext | null;
  calculator?: AirborneCalculatorId | null;
  customMaterials?: readonly MaterialDefinition[];
  exactImpactSource?: ExactImpactSource | null;
  id: string;
  impactFieldContext?: ImpactFieldContext | null;
  name: string;
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
  const inputWarnings = collectScenarioInputWarnings({
    airborneContext: input.airborneContext ?? null,
    impactFieldContext: input.impactFieldContext ?? null,
    materials: runtimeCatalog,
    normalizedLayers: normalized.layers,
    rows: input.rows,
    studyMode: input.studyMode,
    targetOutputs: input.targetOutputs ?? []
  });
  const scenarioWarnings = [...normalized.warnings, ...inputWarnings];
  const targetOutputs = input.targetOutputs ?? [];
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
  const activeInputSurfacePredictors = [
    steelFloorFormulaInputSurface?.status !== "inactive" ? steelFloorFormulaInputSurface?.impactPredictorInput : null,
    timberCltDeltaLwInputSurface?.status !== "inactive" ? timberCltDeltaLwInputSurface?.impactPredictorInput : null
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
        airborneContext: input.airborneContext ?? null,
        calculator: input.calculator ?? null,
        catalog: runtimeCatalog,
        exactImpactSource: input.exactImpactSource ?? null,
        impactFieldContext: input.impactFieldContext ?? null,
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
    result,
    warnings: result
      ? buildWorkbenchWarningNotes(result, [...scenarioWarnings, ...result.warnings])
      : scenarioWarnings
  };
}
