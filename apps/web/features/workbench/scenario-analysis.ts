import { calculateAssembly } from "@dynecho/engine";
import type {
  AssemblyCalculation,
  AirborneCalculatorId,
  AirborneContext,
  ExactImpactSource,
  ImpactFieldContext,
  RequestedOutputId
} from "@dynecho/shared";

import { normalizeRows } from "./normalize-rows";
import type { StudyMode } from "./preset-definitions";
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
  const normalized = normalizeRows(input.rows);
  const result =
    normalized.layers.length > 0
      ? calculateAssembly(normalized.layers, {
          airborneContext: input.airborneContext ?? null,
          calculator: input.calculator ?? null,
          exactImpactSource: input.exactImpactSource ?? null,
          impactFieldContext: input.impactFieldContext ?? null,
          targetOutputs: input.targetOutputs ?? []
        })
      : null;

  return {
    ...input,
    result,
    warnings: result ? [...normalized.warnings, ...result.warnings] : normalized.warnings
  };
}
