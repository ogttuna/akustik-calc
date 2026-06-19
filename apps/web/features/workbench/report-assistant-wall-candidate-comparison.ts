import {
  REQUESTED_OUTPUT_IDS,
  type MaterialDefinition,
  type RequestedOutputId
} from "@dynecho/shared";

import { buildResolvedMaterialCatalog } from "../workbench-rebuild/material-editor-state";
import {
  previewReportAssistantLayerStackDraft,
  type WorkbenchV2CalculatorAssistantOutputRow,
  type WorkbenchV2CalculatorAssistantPreview
} from "../workbench-rebuild/workbench-v2-calculator-assistant";
import {
  validateReportAssistantLayerStackDraft,
  type ReportAssistantLayerStackDraft,
  type ReportAssistantLayerStackDraftMissingInput,
  type ReportAssistantLayerStackDraftLayer,
  type ReportAssistantLayerStackDraftLayerRole,
  type ReportAssistantLayerStackDraftValidation
} from "./report-assistant-layer-stack-draft";

export type ReportAssistantWallCandidateComparisonStatus = "needs_input" | "ready" | "unsupported";

export type ReportAssistantWallCandidateComparisonCandidate = {
  candidateId: string;
  draft: ReportAssistantLayerStackDraft;
  label: string;
  sourcePhrase: string;
  status: Exclude<ReportAssistantWallCandidateComparisonStatus, "unsupported">;
  validation: ReportAssistantLayerStackDraftValidation;
};

export type ReportAssistantWallCandidateComparisonRanking = {
  reason: string;
  rows: readonly never[];
  status: "blocked_no_calculator_output";
};

export type ReportAssistantWallCandidateComparison = {
  candidates: readonly ReportAssistantWallCandidateComparisonCandidate[];
  comparisonId: string;
  instruction: string;
  maxCandidates: number;
  ranking: ReportAssistantWallCandidateComparisonRanking;
  requestedOutputs: readonly RequestedOutputId[];
  status: ReportAssistantWallCandidateComparisonStatus;
  warnings: readonly string[];
};

export type ReportAssistantWallCandidateComparisonOutputAuthority = "calculator_backed" | "needs_input" | "preview_only" | "unsupported";

export type ReportAssistantWallCandidateComparisonOutputBasis = {
  basis: string;
  metricId: RequestedOutputId;
  routeStatus: "ready";
  unit?: "dB";
  valueLabel: string;
};

export type ReportAssistantWallCandidateComparisonSourceTrace = {
  detail?: string;
  kind: "calculator_preview";
  label: "preview_layer_stack_draft";
};

export type ReportAssistantWallCandidateComparisonPreviewOutputRow = {
  authority: ReportAssistantWallCandidateComparisonOutputAuthority;
  basis: readonly ReportAssistantWallCandidateComparisonOutputBasis[];
  candidateId: string;
  detail: string;
  label: RequestedOutputId;
  sourceTrace: readonly ReportAssistantWallCandidateComparisonSourceTrace[];
  status: WorkbenchV2CalculatorAssistantOutputRow["status"];
  value: string;
};

export type ReportAssistantWallCandidateComparisonPreviewTask = {
  candidateId: string;
  code: string;
  message: string;
  source: "calculator_preview" | "layer_stack_draft";
};

export type ReportAssistantWallCandidateComparisonCandidatePreview = {
  candidateId: string;
  label: string;
  outputRows: readonly ReportAssistantWallCandidateComparisonPreviewOutputRow[];
  sourcePhrase: string;
  status: ReportAssistantWallCandidateComparisonStatus;
  tasks: readonly ReportAssistantWallCandidateComparisonPreviewTask[];
  validation: ReportAssistantLayerStackDraftValidation;
};

export type ReportAssistantWallCandidateComparisonPreviewRanking =
  | {
      reason?: undefined;
      rows: readonly {
        candidateId: string;
        label: string;
        rank: number;
        targetOutput: RequestedOutputId;
        value: number;
        valueLabel: string;
      }[];
      status: "ready";
      targetOutput: RequestedOutputId;
    }
  | {
      reason: string;
      rows: readonly never[];
      status: "blocked_missing_candidate_output" | "blocked_missing_target_output";
      targetOutput?: RequestedOutputId;
    };

export type ReportAssistantWallCandidateComparisonPreview = {
  candidates: readonly ReportAssistantWallCandidateComparisonCandidatePreview[];
  comparisonId: string;
  mutates: false;
  outputRows: readonly ReportAssistantWallCandidateComparisonPreviewOutputRow[];
  previewOnly: true;
  ranking: ReportAssistantWallCandidateComparisonPreviewRanking;
  requestedOutputs: readonly RequestedOutputId[];
  status: ReportAssistantWallCandidateComparisonStatus;
  warnings: readonly string[];
};

export type CreateReportAssistantWallCandidateComparisonInput = {
  customMaterials?: readonly MaterialDefinition[];
  instruction: string;
  materials?: readonly MaterialDefinition[];
  maxCandidates?: number;
  requestedOutputs?: readonly RequestedOutputId[];
};

export type CreateReportAssistantWallCandidateComparisonResult =
  | {
      comparison: ReportAssistantWallCandidateComparison;
      ok: true;
    }
  | {
      code: "empty_instruction" | "no_wall_candidates" | "unsupported_wall_candidate_comparison_route";
      message: string;
      ok: false;
    };

type MaterialAliasEntry = {
  alias: string;
  material: MaterialDefinition;
};

type LayerSeed = {
  material?: MaterialDefinition;
  originalPhrase: string;
  thicknessMm?: number;
};

const DEFAULT_MAX_CANDIDATES = 3;
const MAX_REPEAT_COUNT = 8;
const REQUESTED_OUTPUT_ID_SET = new Set<string>(REQUESTED_OUTPUT_IDS);
const THICKNESS_PATTERN = /(\d+(?:[.,]\d+)?)\s*(?:mm|millimeters?|millimetres?|milimetre|milimeter)\b/iu;
const REPEAT_PATTERN = /^\s*(\d+)\s*x\b/iu;
const CANDIDATE_LABEL_PATTERN = /\b(?:candidate|option|secenek|seçenek|alternatif)\s*[a-z0-9]+[\s:.)-]+/giu;
const COMPARISON_INTENT_PATTERN =
  /\b(?:compare|comparison|versus|vs|alternative|alternatives|candidate|option|kiyasla|kıyasla|karsilastir|karşılaştır|secenek|seçenek|hangisi|better|daha\s+iyi)\b/iu;
const FLOOR_OR_IMPACT_ROUTE_PATTERN =
  /\b(?:floor|slab|ceiling|impact|floating\s+screed|doseme|döşeme|tavan|sapel|şap|darbeci|darbe)\b/iu;
const IMPACT_OUTPUT_TEXT_PATTERN = /\b(?:aiic|hiic|iic|liic|ln\s*,?\s*w|l['’]?\s*n|delta\s*l\s*w|deltalw)\b/iu;
const IMPACT_OUTPUTS = new Set<RequestedOutputId>([
  "AIIC",
  "CI",
  "CI,50-2500",
  "DeltaLw",
  "HIIC",
  "IIC",
  "L'n,w",
  "L'nT,50",
  "L'nT,w",
  "LIIC",
  "LIR",
  "Ln,w",
  "Ln,w+CI",
  "LnT,A"
]);
const WALL_OUTPUTS = new Set<RequestedOutputId>(["C", "Ctr", "Dn,A", "Dn,w", "DnT,A", "DnT,w", "R'w", "Rw", "STC"]);

const MATERIAL_ALIASES: readonly {
  aliases: readonly string[];
  materialId: string;
}[] = [
  {
    aliases: ["acoustic gypsum board", "acoustic plasterboard", "soundbloc", "diamant board"],
    materialId: "acoustic_gypsum_board"
  },
  {
    aliases: ["gypsum board", "gypsium", "gypsum", "plasterboard", "drywall", "alcipan", "gkb"],
    materialId: "gypsum_board"
  },
  {
    aliases: ["high density rockwool", "high density rock wool", "high density mineral wool", "dense rockwool"],
    materialId: "high_density_rockwool"
  },
  {
    aliases: ["rock wool", "rockwool", "mineral wool", "stone wool", "tas yunu", "tasyunu"],
    materialId: "rockwool"
  },
  {
    aliases: ["glass wool", "glasswool", "glass fiber", "glass fibre", "cam yunu", "camyunu"],
    materialId: "glasswool_board"
  },
  {
    aliases: ["lightweight concrete", "light concrete", "hafif beton"],
    materialId: "lightweight_concrete"
  },
  {
    aliases: ["heavy concrete", "dense concrete", "agir beton"],
    materialId: "heavy_concrete"
  },
  {
    aliases: ["concrete", "beton"],
    materialId: "concrete"
  },
  {
    aliases: ["aac", "autoclaved aerated concrete", "ytong", "gazbeton"],
    materialId: "aac"
  },
  {
    aliases: ["solid brick", "fired clay brick", "tugla", "brick"],
    materialId: "solid_brick"
  },
  {
    aliases: ["hollow brick", "perforated brick", "delikli tugla"],
    materialId: "hollow_brick"
  },
  {
    aliases: ["cement board", "cementitious board"],
    materialId: "cement_board"
  },
  {
    aliases: ["osb"],
    materialId: "osb"
  },
  {
    aliases: ["plywood", "kontrplak"],
    materialId: "plywood"
  }
];

function normalizeComparisonText(value: string): string {
  return value
    .replace(/[İIı]/gu, "i")
    .replace(/[’`]/gu, "'")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9']+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function uniqueRequestedOutputs(outputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return Array.from(new Set(outputs.filter((output): output is RequestedOutputId => REQUESTED_OUTPUT_ID_SET.has(output))));
}

function parseRequestedOutputsFromInstruction(instruction: string): RequestedOutputId[] {
  const normalized = normalizeComparisonText(instruction);
  const outputs: RequestedOutputId[] = [];
  const outputMatchers: readonly {
    id: RequestedOutputId;
    pattern: RegExp;
  }[] = [
    { id: "DnT,A", pattern: /\bdnt\s*a\b/u },
    { id: "DnT,w", pattern: /\bdnt\s*w\b/u },
    { id: "Dn,A", pattern: /\bdn\s*a\b/u },
    { id: "Dn,w", pattern: /\bdn\s*w\b/u },
    { id: "R'w", pattern: /\br'\s*w\b/u },
    { id: "Rw", pattern: /\brw\b/u },
    { id: "STC", pattern: /\bstc\b/u },
    { id: "Ctr", pattern: /\bctr\b/u },
    { id: "C", pattern: /\bc\b/u },
    { id: "Ln,w", pattern: /\bln\s*w\b/u },
    { id: "DeltaLw", pattern: /\b(?:delta\s*l\s*w|deltalw)\b/u },
    { id: "IIC", pattern: /\biic\b/u },
    { id: "AIIC", pattern: /\baiic\b/u }
  ];

  for (const matcher of outputMatchers) {
    if (matcher.pattern.test(normalized)) {
      outputs.push(matcher.id);
    }
  }

  return uniqueRequestedOutputs(outputs);
}

function containsNormalizedAlias(haystack: string, alias: string): boolean {
  return alias.length > 0 && ` ${haystack} `.includes(` ${alias} `);
}

function buildMaterialAliasEntries(materials: readonly MaterialDefinition[]): MaterialAliasEntry[] {
  const materialById = new Map(materials.map((material) => [material.id, material]));
  const entries: MaterialAliasEntry[] = [];

  for (const definition of MATERIAL_ALIASES) {
    const material = materialById.get(definition.materialId);
    if (!material) {
      continue;
    }

    for (const alias of definition.aliases) {
      entries.push({
        alias: normalizeComparisonText(alias),
        material
      });
    }
  }

  for (const material of materials) {
    entries.push({
      alias: normalizeComparisonText(material.name),
      material
    });
    entries.push({
      alias: normalizeComparisonText(material.id.replace(/_/gu, " ")),
      material
    });
  }

  return entries
    .filter((entry) => entry.alias.length > 1)
    .sort((left, right) => right.alias.length - left.alias.length);
}

function matchMaterial(phrase: string, aliasEntries: readonly MaterialAliasEntry[]): MaterialDefinition | undefined {
  const normalized = normalizeComparisonText(phrase);
  const match = aliasEntries.find((entry) => containsNormalizedAlias(normalized, entry.alias));
  return match?.material;
}

function countThicknessMentions(value: string): number {
  return Array.from(value.matchAll(new RegExp(THICKNESS_PATTERN, "giu"))).length;
}

function stripCandidateCommandText(value: string): string {
  return value
    .replace(/^\s*(?:compare|comparison|kiyasla|kıyasla|karsilastir|karşılaştır)\s*[:,-]?\s*/iu, "")
    .replace(/\b(?:compare|comparison|kiyasla|kıyasla|karsilastir|karşılaştır|hangisi\s+daha\s+iyi|which\s+is\s+better)\b.*$/iu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function candidatePiecesFromSeparator(instruction: string, separator: RegExp): string[] {
  const pieces = instruction
    .split(separator)
    .map(stripCandidateCommandText)
    .filter((piece) => piece.length > 0 && countThicknessMentions(piece) > 0);

  return pieces.length > 1 ? pieces : [];
}

function extractCandidatePhrases(instruction: string): string[] {
  const labeledPieces = candidatePiecesFromSeparator(instruction.replace(CANDIDATE_LABEL_PATTERN, "; "), /\s*;\s*/u);
  if (labeledPieces.length > 0) {
    return labeledPieces;
  }

  const hardSeparated = candidatePiecesFromSeparator(instruction, /\s*(?:;|\n+)\s*/u);
  if (hardSeparated.length > 0) {
    return hardSeparated;
  }

  const versusSeparated = candidatePiecesFromSeparator(instruction, /\s+\b(?:vs|versus)\b\s+/iu);
  if (versusSeparated.length > 0) {
    return versusSeparated;
  }

  const normalized = normalizeComparisonText(instruction);
  if (COMPARISON_INTENT_PATTERN.test(normalized)) {
    const turkishWithSeparated = candidatePiecesFromSeparator(instruction, /\s+\b(?:ile|and)\b\s+/iu);
    if (turkishWithSeparated.length > 0) {
      return turkishWithSeparated;
    }
  }

  const single = stripCandidateCommandText(instruction);
  return countThicknessMentions(single) > 0 ? [single] : [];
}

function splitLayerSegments(candidatePhrase: string): string[] {
  return candidatePhrase
    .replace(/\s*(?:->|=>|→)\s*/gu, "\n")
    .replace(/\s*[+,]\s*/gu, "\n")
    .replace(/\b(?:then|sonra|ve)\b/giu, "\n")
    .split(/\n+/u)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function cleanLayerMaterialPhrase(segment: string): string {
  return segment
    .replace(THICKNESS_PATTERN, " ")
    .replace(REPEAT_PATTERN, " ")
    .replace(
      /\b(?:candidate|compare|comparison|duvar|for|from|icin|için|katman|layer|option|secenek|seçenek|wall|kiyasla|kıyasla|karsilastir|karşılaştır|ile)\b/giu,
      " "
    )
    .replace(/\b(?:aiic|ctr|dnt|dn|iic|ln|rw|stc)\b/giu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function parsePositiveThickness(segment: string): number | undefined {
  const match = THICKNESS_PATTERN.exec(segment);
  if (!match) {
    return undefined;
  }

  const value = Number.parseFloat((match[1] ?? "").replace(",", "."));
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

function readRepeatCount(segment: string): number {
  const match = REPEAT_PATTERN.exec(segment);
  if (!match) {
    return 1;
  }

  const count = Number.parseInt(match[1] ?? "", 10);
  return Number.isInteger(count) && count >= 1 && count <= MAX_REPEAT_COUNT ? count : 1;
}

function parseLayerSeeds(candidatePhrase: string, aliasEntries: readonly MaterialAliasEntry[]): LayerSeed[] {
  const seeds: LayerSeed[] = [];

  for (const segment of splitLayerSegments(candidatePhrase)) {
    const phrase = cleanLayerMaterialPhrase(segment);
    const material = phrase ? matchMaterial(phrase, aliasEntries) : undefined;
    const thicknessMm = parsePositiveThickness(segment);
    const repeatCount = readRepeatCount(segment);

    if (!phrase && thicknessMm === undefined) {
      continue;
    }

    for (let index = 0; index < repeatCount; index += 1) {
      seeds.push({
        material,
        originalPhrase: segment,
        thicknessMm
      });
    }
  }

  return seeds;
}

function isPorousAbsorber(material: MaterialDefinition | undefined): boolean {
  return Boolean(
    material &&
      (material.acoustic?.behavior === "porous_absorber" ||
        material.id === "rockwool" ||
        material.id === "high_density_rockwool" ||
        material.id === "glasswool_board")
  );
}

function roleForLayer(seed: LayerSeed, index: number, seeds: readonly LayerSeed[]): ReportAssistantLayerStackDraftLayerRole {
  if (!seed.material) {
    return "unknown";
  }

  const cavityIndices = seeds
    .map((entry, entryIndex) => (isPorousAbsorber(entry.material) ? entryIndex : -1))
    .filter((entryIndex) => entryIndex >= 0);

  if (isPorousAbsorber(seed.material)) {
    return "cavity";
  }

  if (cavityIndices.length === 0) {
    if (seeds.length === 1) {
      return "core";
    }

    if (index === 0) {
      return "side_a";
    }

    return index === seeds.length - 1 ? "side_b" : "core";
  }

  const firstCavityIndex = cavityIndices[0] ?? 0;
  const lastCavityIndex = cavityIndices[cavityIndices.length - 1] ?? firstCavityIndex;
  return index < firstCavityIndex ? "side_a" : index > lastCavityIndex ? "side_b" : "core";
}

function buildDraftLayers(candidateId: string, seeds: readonly LayerSeed[]): ReportAssistantLayerStackDraftLayer[] {
  return seeds.map((seed, index) => ({
    id: `${candidateId}-layer-${String(index + 1)}`,
    materialId: seed.material?.id,
    materialName: seed.material?.name,
    originalPhrase: seed.originalPhrase,
    role: roleForLayer(seed, index, seeds),
    thicknessMm: seed.thicknessMm
  }));
}

function buildWallCandidateDraft(input: {
  candidateId: string;
  customMaterials: readonly MaterialDefinition[];
  instruction: string;
  requestedOutputs: readonly RequestedOutputId[];
  seeds: readonly LayerSeed[];
  sourcePhrase: string;
}): ReportAssistantLayerStackDraft {
  const layers = buildDraftLayers(input.candidateId, input.seeds);
  const hasCavity = layers.some((layer) => layer.role === "cavity");

  return {
    assumptions: [],
    contextSignature: `report_assistant_wall_candidate_comparison:${input.candidateId}:${String(layers.length)}:${input.requestedOutputs.join("|")}`,
    customMaterials: input.customMaterials,
    draftId: `${input.candidateId}-draft`,
    layers,
    mode: "wall",
    originalPhrases: layers.map((layer) => layer.originalPhrase),
    requestedOutputs: input.requestedOutputs,
    source: "user_instruction",
    sourceInstruction: input.instruction,
    wallTopologyDraft: {
      leafMapping: hasCavity ? "inferred" : "not_required",
      topology: hasCavity ? "double_leaf_framed" : "single_leaf"
    },
    warnings: []
  };
}

function buildCandidate(input: {
  candidateIndex: number;
  customMaterials: readonly MaterialDefinition[];
  instruction: string;
  phrase: string;
  requestedOutputs: readonly RequestedOutputId[];
  seeds: readonly LayerSeed[];
}): ReportAssistantWallCandidateComparisonCandidate {
  const candidateId = `wall-candidate-${String(input.candidateIndex + 1)}`;
  const draft = buildWallCandidateDraft({
    candidateId,
    customMaterials: input.customMaterials,
    instruction: input.instruction,
    requestedOutputs: input.requestedOutputs,
    seeds: input.seeds,
    sourcePhrase: input.phrase
  });
  const validation = validateReportAssistantLayerStackDraft(draft);

  return {
    candidateId,
    draft,
    label: `Candidate ${String(input.candidateIndex + 1)}`,
    sourcePhrase: input.phrase,
    status: validation.ok ? "ready" : "needs_input",
    validation
  };
}

function isUnsupportedWallCandidateRoute(instruction: string, requestedOutputs: readonly RequestedOutputId[]): boolean {
  return (
    requestedOutputs.some((output) => IMPACT_OUTPUTS.has(output) || !WALL_OUTPUTS.has(output)) ||
    FLOOR_OR_IMPACT_ROUTE_PATTERN.test(instruction) ||
    IMPACT_OUTPUT_TEXT_PATTERN.test(instruction)
  );
}

function outputRowUnit(value: string): "dB" | undefined {
  return value.includes("dB") ? "dB" : undefined;
}

function readOutputNumber(value: string): number | undefined {
  const match = /-?\d+(?:\.\d+)?/u.exec(value);
  if (!match) {
    return undefined;
  }

  const parsed = Number.parseFloat(match[0]);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function outputAuthority(row: WorkbenchV2CalculatorAssistantOutputRow): ReportAssistantWallCandidateComparisonOutputAuthority {
  switch (row.status) {
    case "live":
      return "calculator_backed";
    case "needs_input":
    case "pending":
      return "needs_input";
    case "unsupported":
      return "unsupported";
  }
}

function outputBasis(input: {
  preview: WorkbenchV2CalculatorAssistantPreview;
  row: WorkbenchV2CalculatorAssistantOutputRow;
}): ReportAssistantWallCandidateComparisonOutputBasis[] {
  if (input.row.status !== "live" || input.preview.calculationSummary.status !== "ready") {
    return [];
  }

  return [
    {
      basis: input.preview.engineSummary?.calculatorId ?? input.preview.engineSummary?.method ?? "workbench_v2_calculator_preview",
      metricId: input.row.label,
      routeStatus: "ready",
      unit: outputRowUnit(input.row.value),
      valueLabel: input.row.value
    }
  ];
}

function sourceTrace(preview: WorkbenchV2CalculatorAssistantPreview): ReportAssistantWallCandidateComparisonSourceTrace[] {
  return [
    {
      detail: preview.engineSummary?.calculatorLabel ?? preview.engineSummary?.method,
      kind: "calculator_preview",
      label: "preview_layer_stack_draft"
    }
  ];
}

function previewOutputRows(input: {
  candidateId: string;
  preview: WorkbenchV2CalculatorAssistantPreview;
}): ReportAssistantWallCandidateComparisonPreviewOutputRow[] {
  return input.preview.outputRows.map((row) => ({
    authority: outputAuthority(row),
    basis: outputBasis({
      preview: input.preview,
      row
    }),
    candidateId: input.candidateId,
    detail: row.detail,
    label: row.label,
    sourceTrace: row.status === "live" ? sourceTrace(input.preview) : [],
    status: row.status,
    value: row.value
  }));
}

function pendingOutputRows(candidate: ReportAssistantWallCandidateComparisonCandidate): ReportAssistantWallCandidateComparisonPreviewOutputRow[] {
  return candidate.draft.requestedOutputs.map((outputId) => ({
    authority: "needs_input",
    basis: [],
    candidateId: candidate.candidateId,
    detail: "Pending until candidate inputs are complete.",
    label: outputId,
    sourceTrace: [],
    status: "pending",
    value: "--"
  }));
}

function tasksFromMissingInputs(input: {
  candidateId: string;
  missingInputs: readonly ReportAssistantLayerStackDraftMissingInput[];
}): ReportAssistantWallCandidateComparisonPreviewTask[] {
  return input.missingInputs.map((missingInput) => ({
    candidateId: input.candidateId,
    code: missingInput.code,
    message: `${missingInput.message} ${missingInput.question}`,
    source: "layer_stack_draft"
  }));
}

function previewCandidate(candidate: ReportAssistantWallCandidateComparisonCandidate): ReportAssistantWallCandidateComparisonCandidatePreview {
  if (!candidate.validation.ok) {
    return {
      candidateId: candidate.candidateId,
      label: candidate.label,
      outputRows: pendingOutputRows(candidate),
      sourcePhrase: candidate.sourcePhrase,
      status: "needs_input",
      tasks: tasksFromMissingInputs({
        candidateId: candidate.candidateId,
        missingInputs: candidate.validation.missingInputs
      }),
      validation: candidate.validation
    };
  }

  const result = previewReportAssistantLayerStackDraft({
    draft: candidate.draft
  });

  if (!result.ok) {
    return {
      candidateId: candidate.candidateId,
      label: candidate.label,
      outputRows: candidate.draft.requestedOutputs.map((outputId) => ({
        authority: "unsupported",
        basis: [],
        candidateId: candidate.candidateId,
        detail: result.errors.join(" "),
        label: outputId,
        sourceTrace: [],
        status: "unsupported",
        value: "--"
      })),
      sourcePhrase: candidate.sourcePhrase,
      status: "unsupported",
      tasks: [
        {
          candidateId: candidate.candidateId,
          code: result.code,
          message: result.errors.join(" "),
          source: "calculator_preview"
        }
      ],
      validation: candidate.validation
    };
  }

  return {
    candidateId: candidate.candidateId,
    label: candidate.label,
    outputRows: previewOutputRows({
      candidateId: candidate.candidateId,
      preview: result.preview
    }),
    sourcePhrase: candidate.sourcePhrase,
    status: result.preview.calculationSummary.status,
    tasks: result.preview.tasks.map((task) => ({
      candidateId: candidate.candidateId,
      code: task.id,
      message: `${task.label}: ${task.detail}`,
      source: "calculator_preview"
    })),
    validation: result.preview.layerStackDraft?.validation ?? candidate.validation
  };
}

function overallPreviewStatus(candidates: readonly ReportAssistantWallCandidateComparisonCandidatePreview[]): ReportAssistantWallCandidateComparisonStatus {
  if (candidates.some((candidate) => candidate.status === "needs_input")) {
    return "needs_input";
  }

  return candidates.some((candidate) => candidate.outputRows.some((row) => row.authority === "calculator_backed")) ? "ready" : "unsupported";
}

function buildRanking(input: {
  candidates: readonly ReportAssistantWallCandidateComparisonCandidatePreview[];
  requestedOutputs: readonly RequestedOutputId[];
}): ReportAssistantWallCandidateComparisonPreviewRanking {
  const targetOutput = input.requestedOutputs[0];
  if (!targetOutput) {
    return {
      reason: "Ranking requires an explicit target output.",
      rows: [],
      status: "blocked_missing_target_output"
    };
  }

  const rankedRows = input.candidates.flatMap((candidate) => {
    const outputRow = candidate.outputRows.find((row) => row.label === targetOutput && row.authority === "calculator_backed");
    const value = outputRow ? readOutputNumber(outputRow.value) : undefined;
    return outputRow && value !== undefined
      ? [
          {
            candidateId: candidate.candidateId,
            label: candidate.label,
            targetOutput,
            value,
            valueLabel: outputRow.value
          }
        ]
      : [];
  });

  if (rankedRows.length !== input.candidates.length || rankedRows.length < 2) {
    return {
      reason: `Ranking requires live calculator-backed ${targetOutput} output for every visible candidate.`,
      rows: [],
      status: "blocked_missing_candidate_output",
      targetOutput
    };
  }

  return {
    rows: rankedRows
      .sort((left, right) => right.value - left.value || left.candidateId.localeCompare(right.candidateId))
      .map((row, index) => ({
        ...row,
        rank: index + 1
      })),
    status: "ready",
    targetOutput
  };
}

export function previewReportAssistantWallCandidateComparison(input: {
  comparison: ReportAssistantWallCandidateComparison;
}): ReportAssistantWallCandidateComparisonPreview {
  const candidates = input.comparison.candidates.map(previewCandidate);
  const outputRows = candidates.flatMap((candidate) => candidate.outputRows);

  return {
    candidates,
    comparisonId: input.comparison.comparisonId,
    mutates: false,
    outputRows,
    previewOnly: true,
    ranking: buildRanking({
      candidates,
      requestedOutputs: input.comparison.requestedOutputs
    }),
    requestedOutputs: input.comparison.requestedOutputs,
    status: overallPreviewStatus(candidates),
    warnings: input.comparison.warnings
  };
}

export function createReportAssistantWallCandidateComparison(
  input: CreateReportAssistantWallCandidateComparisonInput
): CreateReportAssistantWallCandidateComparisonResult {
  const instruction = input.instruction.trim();
  if (!instruction) {
    return {
      code: "empty_instruction",
      message: "Enter a wall comparison instruction before building candidate drafts.",
      ok: false
    };
  }

  const requestedOutputs = uniqueRequestedOutputs(input.requestedOutputs ?? parseRequestedOutputsFromInstruction(instruction));
  if (isUnsupportedWallCandidateRoute(instruction, requestedOutputs)) {
    return {
      code: "unsupported_wall_candidate_comparison_route",
      message: "Wall candidate comparison v1 only prepares airborne wall layer-stack drafts.",
      ok: false
    };
  }

  const maxCandidates = Math.max(1, input.maxCandidates ?? DEFAULT_MAX_CANDIDATES);
  const customMaterials = input.customMaterials ?? [];
  const materials = input.materials ?? buildResolvedMaterialCatalog(customMaterials);
  const aliasEntries = buildMaterialAliasEntries(materials);
  const allCandidatePhrases = extractCandidatePhrases(instruction);

  if (allCandidatePhrases.length === 0) {
    return {
      code: "no_wall_candidates",
      message: "No explicit mm-based wall candidate layer stacks could be read from the instruction.",
      ok: false
    };
  }

  const candidatePhrases = allCandidatePhrases.slice(0, maxCandidates);
  const candidates = candidatePhrases.map((phrase, candidateIndex) =>
    buildCandidate({
      candidateIndex,
      customMaterials,
      instruction,
      phrase,
      requestedOutputs,
      seeds: parseLayerSeeds(phrase, aliasEntries)
    })
  );
  const warnings =
    allCandidatePhrases.length > candidatePhrases.length
      ? ["assistant_wall_candidate_comparison_candidate_cap_applied"]
      : [];
  const status: ReportAssistantWallCandidateComparisonStatus = candidates.every((candidate) => candidate.validation.ok) ? "ready" : "needs_input";

  return {
    comparison: {
      candidates,
      comparisonId: "report_assistant_wall_candidate_comparison_v1",
      instruction,
      maxCandidates,
      ranking: {
        reason: "Candidate ranking requires calculator-backed outputs; this contract only prepares layer-stack drafts.",
        rows: [],
        status: "blocked_no_calculator_output"
      },
      requestedOutputs,
      status,
      warnings
    },
    ok: true
  };
}
