import { calculateAssembly } from "@dynecho/engine";
import type {
  AssemblyCalculation,
  AirborneCalculatorId,
  AirborneContext,
  ExactImpactSource,
  ImpactFieldContext,
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
      `${material.name} is in the stack, but no official product row matched the current topology and no generic dynamic stiffness fallback is available for this product. DynEcho kept the result on the broader predictor/family lane instead of inventing product-backed impact credit.`
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
  studyMode: StudyMode;
  targetOutputs?: readonly RequestedOutputId[];
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
  let result: AssemblyCalculation | null = null;

  if (normalized.layers.length > 0) {
    try {
      result = calculateAssembly(normalized.layers, {
        airborneContext: input.airborneContext ?? null,
        calculator: input.calculator ?? null,
        catalog: runtimeCatalog,
        exactImpactSource: input.exactImpactSource ?? null,
        impactFieldContext: input.impactFieldContext ?? null,
        targetOutputs: input.targetOutputs ?? []
      });
    } catch (error) {
      const detail = error instanceof Error && error.message.trim().length > 0 ? error.message.trim() : "Unknown evaluation error.";
      scenarioWarnings.push(
        `DynEcho could not evaluate the current scenario and kept the workspace live instead of crashing. ${detail}`
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
