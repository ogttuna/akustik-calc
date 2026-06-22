import type { MaterialDefinition, RequestedOutputId } from "@dynecho/shared";

import type { ReportAssistantAssemblyAlternativeReview } from "../workbench/report-assistant-assembly-alternatives";
import {
  getWorkbenchV2AssistantLayerStackSignature,
  type WorkbenchV2AssistantLayerStackCandidateStack,
  type WorkbenchV2AssistantLayerStackCommandTask
} from "./workbench-v2-assistant-layer-stack-command";
import type {
  WorkbenchV2ContextDraft,
  WorkbenchV2DraftLayer,
  WorkbenchV2StudyMode
} from "./workbench-v2-project-snapshot";

export const WORKBENCH_SOURCE_ALTERNATIVE_CANDIDATE_ID_PREFIX = "source-alt-";

export type WorkbenchV2AssistantSourceAlternativeLayerInput = {
  materialName: string;
  role?: string;
  sourcePhrase?: string;
  thicknessMm: number | string;
};

export type WorkbenchV2AssistantSourceAlternativeEvidence = {
  comparability?: string;
  sourceQuality?: string;
  sourceTitle?: string;
  sourceUrl?: string;
};

export type WorkbenchV2AssistantSourceAlternativeCandidateEvidence = WorkbenchV2AssistantSourceAlternativeEvidence & {
  affectedLayers: readonly string[];
  expectedMetricDirection: string;
  suggestedAlternativeLabel: string;
  tradeoffs: readonly string[];
};

export type WorkbenchV2AssistantSourceAlternativeClarificationPrompt = {
  code: "assistant_source_alternative_choose_material" | "assistant_source_alternative_map_material";
  layerIndex: number;
  materialOptions?: readonly string[];
  message: string;
  sourceMaterialName: string;
};

export type WorkbenchV2AssistantSourceAlternativeCandidateInput = {
  alternativeId: string;
  candidateLabel?: string;
  currentLayers: readonly WorkbenchV2DraftLayer[];
  idFactory?: (index: number) => string;
  layers: readonly WorkbenchV2AssistantSourceAlternativeLayerInput[];
  materials: readonly MaterialDefinition[];
  mode: WorkbenchV2StudyMode;
  selectedOutputs?: readonly RequestedOutputId[];
  sourceEvidence?: WorkbenchV2AssistantSourceAlternativeEvidence;
};

export type WorkbenchV2AssistantSourceAlternativeCandidateResult =
  | {
      candidateStack: WorkbenchV2AssistantLayerStackCandidateStack;
      ok: true;
      warnings: readonly string[];
    }
  | {
      code:
        | "ambiguous_material_mapping"
        | "invalid_layer_input"
        | "missing_material_mapping"
        | "no_candidate_layers";
      clarificationPrompts: readonly WorkbenchV2AssistantSourceAlternativeClarificationPrompt[];
      ok: false;
      tasks: readonly WorkbenchV2AssistantLayerStackCommandTask[];
      warnings: readonly string[];
    };

export type WorkbenchV2AssistantSourceAlternativeCandidatesFromReviewInput = {
  currentLayers: readonly WorkbenchV2DraftLayer[];
  idFactory?: (candidateIndex: number, layerIndex: number) => string;
  materials: readonly MaterialDefinition[];
  mode: WorkbenchV2StudyMode;
  review: ReportAssistantAssemblyAlternativeReview;
  selectedOutputs?: readonly RequestedOutputId[];
};

export type WorkbenchV2AssistantSourceAlternativeCandidatesFromReviewResult = {
  candidateStacks: readonly WorkbenchV2AssistantLayerStackCandidateStack[];
  clarificationPrompts: readonly WorkbenchV2AssistantSourceAlternativeClarificationPrompt[];
  sourceEvidenceByCandidateId: Readonly<Record<string, WorkbenchV2AssistantSourceAlternativeCandidateEvidence>>;
  tasks: readonly WorkbenchV2AssistantLayerStackCommandTask[];
  warnings: readonly string[];
};

type MaterialMappingResult =
  | {
      material: MaterialDefinition;
      ok: true;
    }
  | {
      code: "ambiguous_material_mapping" | "missing_material_mapping";
      matches?: readonly MaterialDefinition[];
      ok: false;
    };

const ADVISORY_SOURCE_WARNING =
  "Source/provider alternatives are advisory; preview through the calculator before comparing values.";
const NO_SOURCE_DB_WARNING =
  "No source, provider, or model-supplied dB value is attached to this candidate.";

function normalizeText(value: string): string {
  return value
    .replace(/[İIı]/gu, "i")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function normalizeCandidateIdSegment(value: string): string {
  return normalizeText(value)
    .replace(/\s+/gu, "-")
    .replace(/^-+|-+$/gu, "") || "candidate";
}

function formatIndexList(indices: readonly number[]): string {
  return indices.map((index) => String(index + 1)).join(",");
}

function parsePositiveThicknessMm(value: number | string): number | null {
  const raw = typeof value === "number" ? String(value) : value.trim().replace(",", ".");
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function formatThicknessMm(value: number): string {
  const rounded = Math.round(value * 1000) / 1000;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

function materialMappingIndex(materials: readonly MaterialDefinition[]): ReadonlyMap<string, readonly MaterialDefinition[]> {
  const byKey = new Map<string, MaterialDefinition[]>();

  for (const material of materials) {
    const keys = new Set([
      normalizeText(material.id),
      normalizeText(material.id.replace(/_/gu, " ")),
      normalizeText(material.name)
    ]);

    for (const key of keys) {
      if (!key) {
        continue;
      }
      const entries = byKey.get(key) ?? [];
      entries.push(material);
      byKey.set(key, entries);
    }
  }

  return byKey;
}

function mapMaterial(input: {
  index: ReadonlyMap<string, readonly MaterialDefinition[]>;
  materialName: string;
}): MaterialMappingResult {
  const normalized = normalizeText(input.materialName);
  const matches = normalized ? input.index.get(normalized) ?? [] : [];
  const uniqueById = Array.from(new Map(matches.map((material) => [material.id, material])).values());

  if (uniqueById.length === 0) {
    return {
      code: "missing_material_mapping",
      ok: false
    };
  }

  if (uniqueById.length > 1) {
    return {
      code: "ambiguous_material_mapping",
      matches: uniqueById,
      ok: false
    };
  }

  return {
    material: uniqueById[0]!,
    ok: true
  };
}

function fallbackRole(input: {
  currentLayers: readonly WorkbenchV2DraftLayer[];
  index: number;
  layerCount: number;
  role?: string;
}): string {
  const role = input.role?.trim();
  if (role) {
    return role;
  }

  const currentRole = input.currentLayers[input.index]?.role.trim();
  if (currentRole) {
    return currentRole;
  }

  if (input.layerCount === 1) {
    return "core";
  }

  if (input.index === 0) {
    return "side_a";
  }

  return input.index === input.layerCount - 1 ? "side_b" : "core";
}

function buildWallContextPatch(layers: readonly WorkbenchV2DraftLayer[]): Partial<WorkbenchV2ContextDraft> {
  const sideAIndices = layers.flatMap((layer, index) => layer.role === "side_a" ? [index] : []);
  const cavityIndices = layers.flatMap((layer, index) => layer.role === "cavity" ? [index] : []);
  const sideBIndices = layers.flatMap((layer, index) => layer.role === "side_b" ? [index] : []);
  const cavityDepthMm = cavityIndices.reduce((sum, index) => {
    const layer = layers[index];
    return sum + (layer ? parsePositiveThicknessMm(layer.thicknessMm) ?? 0 : 0);
  }, 0);

  return {
    wallCavity1AbsorptionClass: cavityIndices.length > 0 ? "porous_absorptive" : "unknown",
    wallCavity1DepthMm: cavityDepthMm > 0 ? formatThicknessMm(cavityDepthMm) : "",
    wallCavity1FillCoverage: cavityIndices.length > 0 ? "full" : "unknown",
    wallCavity1LayerIndices: formatIndexList(cavityIndices),
    wallSideALeafLayerIndices: formatIndexList(sideAIndices),
    wallSideBLeafLayerIndices: formatIndexList(sideBIndices),
    wallTopologyMode: cavityIndices.length > 0 ? "double_leaf_framed" : "auto"
  };
}

function candidateLabel(input: WorkbenchV2AssistantSourceAlternativeCandidateInput): string {
  if (input.candidateLabel?.trim()) {
    return input.candidateLabel.trim();
  }

  if (input.sourceEvidence?.sourceTitle?.trim()) {
    return `Source alternative: ${input.sourceEvidence.sourceTitle.trim()}`;
  }

  return `Source alternative: ${input.alternativeId}`;
}

function commonBlockedWarnings(): string[] {
  return [
    "No Workbench candidate was created yet; ask the user to map source/provider terms to explicit catalog materials or custom material properties first.",
    "Source/provider alternatives remain advisory and cannot mutate layers or calculator values directly."
  ];
}

function uniqueStrings(values: readonly string[]): string[] {
  return Array.from(new Set(values));
}

export function createWorkbenchV2AssistantSourceAlternativeCandidate(
  input: WorkbenchV2AssistantSourceAlternativeCandidateInput
): WorkbenchV2AssistantSourceAlternativeCandidateResult {
  if (input.layers.length === 0) {
    return {
      code: "no_candidate_layers",
      clarificationPrompts: [],
      ok: false,
      tasks: [
        {
          code: "assistant_source_alternative_layers_missing",
          detail: "A source alternative needs explicit candidate layers before Workbench preview.",
          label: "Add source alternative layers"
        }
      ],
      warnings: commonBlockedWarnings()
    };
  }

  const index = materialMappingIndex(input.materials);
  const clarificationPrompts: WorkbenchV2AssistantSourceAlternativeClarificationPrompt[] = [];
  const tasks: WorkbenchV2AssistantLayerStackCommandTask[] = [];
  const draftLayers: WorkbenchV2DraftLayer[] = [];

  for (const [layerIndex, sourceLayer] of input.layers.entries()) {
    const materialMapping = mapMaterial({
      index,
      materialName: sourceLayer.materialName
    });
    const thicknessMm = parsePositiveThicknessMm(sourceLayer.thicknessMm);

    if (!materialMapping.ok) {
      clarificationPrompts.push({
        code: materialMapping.code === "ambiguous_material_mapping"
          ? "assistant_source_alternative_choose_material"
          : "assistant_source_alternative_map_material",
        layerIndex,
        ...(materialMapping.matches
          ? { materialOptions: materialMapping.matches.map((material) => material.id) }
          : {}),
        message: materialMapping.code === "ambiguous_material_mapping"
          ? `${sourceLayer.materialName} matches multiple Workbench catalog materials. Choose the exact catalog material before preview.`
          : `${sourceLayer.materialName} is not in the Workbench material catalog. Choose an existing catalog material to map it to, or provide a custom material with the required acoustic properties before preview.`,
        sourceMaterialName: sourceLayer.materialName
      });
      tasks.push({
        code:
          materialMapping.code === "ambiguous_material_mapping"
            ? "assistant_source_alternative_material_ambiguous"
            : "assistant_source_alternative_material_unmapped",
        detail:
          materialMapping.code === "ambiguous_material_mapping"
            ? `Layer ${layerIndex + 1} material term "${sourceLayer.materialName}" matches multiple Workbench catalog materials: ${(materialMapping.matches ?? []).map((material) => material.id).join(", ")}.`
            : `Layer ${layerIndex + 1} uses provider/source material term "${sourceLayer.materialName}", which does not explicitly match the Workbench material catalog.`,
        label: materialMapping.code === "ambiguous_material_mapping" ? "Clarify source material" : "Map source material"
      });
    }

    if (thicknessMm === null) {
      tasks.push({
        code: "assistant_source_alternative_thickness_invalid",
        detail: `Layer ${layerIndex + 1} needs an explicit positive thickness in mm before candidate preview.`,
        label: "Set source layer thickness"
      });
    }

    if (materialMapping.ok && thicknessMm !== null) {
      const idFactory = input.idFactory ?? ((indexValue: number) => `${WORKBENCH_SOURCE_ALTERNATIVE_CANDIDATE_ID_PREFIX}layer-${indexValue + 1}`);
      draftLayers.push({
        id: idFactory(layerIndex),
        materialId: materialMapping.material.id,
        role: fallbackRole({
          currentLayers: input.currentLayers,
          index: layerIndex,
          layerCount: input.layers.length,
          role: sourceLayer.role
        }),
        thicknessMm: formatThicknessMm(thicknessMm)
      });
    }
  }

  if (tasks.length > 0) {
    const hasAmbiguous = tasks.some((task) => task.code === "assistant_source_alternative_material_ambiguous");
    const hasMissing = tasks.some((task) => task.code === "assistant_source_alternative_material_unmapped");

    return {
      code: hasAmbiguous
        ? "ambiguous_material_mapping"
        : hasMissing
          ? "missing_material_mapping"
          : "invalid_layer_input",
      clarificationPrompts,
      ok: false,
      tasks,
      warnings: commonBlockedWarnings()
    };
  }

  const candidateStack: WorkbenchV2AssistantLayerStackCandidateStack = {
    candidateId: `${WORKBENCH_SOURCE_ALTERNATIVE_CANDIDATE_ID_PREFIX}${normalizeCandidateIdSegment(input.alternativeId)}`,
    contextPatch: input.mode === "wall" ? buildWallContextPatch(draftLayers) : {},
    label: candidateLabel(input),
    layers: draftLayers.map((layer) => ({ ...layer })),
    mode: input.mode,
    selectedLayerId: draftLayers[0]?.id ?? null,
    sourceLayerSignature: getWorkbenchV2AssistantLayerStackSignature(input.currentLayers),
    tasks: [],
    warnings: [
      ADVISORY_SOURCE_WARNING,
      NO_SOURCE_DB_WARNING,
      "Source quality/comparability can be displayed beside calculator-backed preview results, but it is not used as a numeric calculator result."
    ]
  };

  return {
    candidateStack,
    ok: true,
    warnings: [ADVISORY_SOURCE_WARNING, NO_SOURCE_DB_WARNING]
  };
}

export function createWorkbenchV2AssistantSourceAlternativeCandidatesFromReview(
  input: WorkbenchV2AssistantSourceAlternativeCandidatesFromReviewInput
): WorkbenchV2AssistantSourceAlternativeCandidatesFromReviewResult {
  const candidateStacks: WorkbenchV2AssistantLayerStackCandidateStack[] = [];
  const clarificationPrompts: WorkbenchV2AssistantSourceAlternativeClarificationPrompt[] = [];
  const tasks: WorkbenchV2AssistantLayerStackCommandTask[] = [];
  const warnings: string[] = [];
  const sourceEvidenceByCandidateId: Record<string, WorkbenchV2AssistantSourceAlternativeCandidateEvidence> = {};

  input.review.suggestedAlternatives.forEach((suggestion, candidateIndex) => {
    const candidateLayers = suggestion.candidateLayers ?? [];

    if (!candidateLayers.length) {
      tasks.push({
        code: "assistant_source_alternative_candidate_layers_missing",
        detail: `Suggestion "${suggestion.label}" did not include explicit candidateLayers, so it remains advisory-only.`,
        label: "Source candidate layers missing"
      });
      return;
    }

    const candidateResult = createWorkbenchV2AssistantSourceAlternativeCandidate({
      alternativeId: suggestion.label,
      candidateLabel: `Source alternative: ${suggestion.label}`,
      currentLayers: input.currentLayers,
      idFactory: input.idFactory
        ? (layerIndex) => input.idFactory!(candidateIndex, layerIndex)
        : undefined,
      layers: candidateLayers,
      materials: input.materials,
      mode: input.mode,
      selectedOutputs: input.selectedOutputs,
      sourceEvidence: {
        comparability: input.review.comparability,
        sourceQuality: input.review.sourceQuality,
        sourceTitle: suggestion.label
      }
    });

    if (!candidateResult.ok) {
      clarificationPrompts.push(...candidateResult.clarificationPrompts);
      tasks.push(...candidateResult.tasks);
      warnings.push(...candidateResult.warnings);
      return;
    }

    candidateStacks.push(candidateResult.candidateStack);
    warnings.push(...candidateResult.warnings);
    sourceEvidenceByCandidateId[candidateResult.candidateStack.candidateId] = {
      affectedLayers: suggestion.affectedLayers,
      comparability: input.review.comparability,
      expectedMetricDirection: suggestion.expectedMetricDirection,
      sourceQuality: input.review.sourceQuality,
      suggestedAlternativeLabel: suggestion.label,
      tradeoffs: suggestion.expectedTradeoffs
    };
  });

  if (!candidateStacks.length) {
    warnings.push("No source alternative Workbench candidate stack was created from this review.");
  }

  return {
    candidateStacks,
    clarificationPrompts,
    sourceEvidenceByCandidateId,
    tasks,
    warnings: uniqueStrings(warnings)
  };
}
