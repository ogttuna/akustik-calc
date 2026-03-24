import { calculateAssembly } from "@dynecho/engine";
import type {
  AssemblyCalculation,
  AirborneCalculatorId,
  AirborneContext,
  ExactImpactSource,
  ImpactFieldContext,
  MaterialDefinition,
  RequestedOutputId
} from "@dynecho/shared";

import { normalizeRows } from "./normalize-rows";
import type { StudyMode } from "./preset-definitions";
import { collectScenarioInputWarnings } from "./input-sanity";
import { buildWorkbenchMaterialCatalog } from "./workbench-materials";
import { buildWorkbenchWarningNotes } from "./workbench-warning-notes";
import type { LayerDraft } from "./workbench-store";

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

  return {
    ...input,
    result,
    warnings: result
      ? buildWorkbenchWarningNotes(result, [...scenarioWarnings, ...result.warnings])
      : scenarioWarnings
  };
}
