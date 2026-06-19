import {
  REQUESTED_OUTPUT_IDS,
  type MaterialDefinition,
  type RequestedOutputId
} from "@dynecho/shared";

import type {
  WorkbenchV2ContextDraft,
  WorkbenchV2DraftLayer,
  WorkbenchV2StudyMode
} from "./workbench-v2-project-snapshot";

export type WorkbenchV2AssistantLayerStackCommandTask = {
  code: string;
  detail: string;
  label: string;
  layerId?: string;
};

export type WorkbenchV2AssistantCalculatorControlCommandKind =
  | "add_layer"
  | "generate_candidates"
  | "move_layer"
  | "preview"
  | "remove_layer"
  | "replace_stack"
  | "set_context"
  | "set_outputs"
  | "update_layer";

export type WorkbenchV2AssistantLayerStackApplyResult =
  | {
      candidateStacks?: WorkbenchV2AssistantLayerStackCandidateStack[];
      commandKind: WorkbenchV2AssistantCalculatorControlCommandKind;
      contextPatch: Partial<WorkbenchV2ContextDraft>;
      layerCount: number;
      layers: WorkbenchV2DraftLayer[];
      materialNames: string[];
      mode: WorkbenchV2StudyMode;
      ok: true;
      previewRequested: boolean;
      selectedLayerId: string | null;
      selectedOutputs?: RequestedOutputId[];
      tasks: WorkbenchV2AssistantLayerStackCommandTask[];
      warnings: string[];
    }
  | {
      code:
        | "ambiguous_material"
        | "empty_instruction"
        | "missing_apply_intent"
        | "missing_current_stack"
        | "missing_output"
        | "no_candidate_layers"
        | "no_layers"
        | "no_matching_layer"
        | "invalid_context_value"
        | "unknown_context_field"
        | "unknown_material"
        | "unknown_output"
        | "unsupported_floor_stack";
      message: string;
      ok: false;
    };

export type WorkbenchV2AssistantLayerStackCandidateStack = {
  candidateId: string;
  contextPatch: Partial<WorkbenchV2ContextDraft>;
  label: string;
  layers: WorkbenchV2DraftLayer[];
  mode: WorkbenchV2StudyMode;
  selectedLayerId: string | null;
  sourceLayerSignature: string;
  tasks: WorkbenchV2AssistantLayerStackCommandTask[];
  warnings: string[];
};

type ParsedLayerSeed = {
  material: MaterialDefinition;
  originalPhrase: string;
  thicknessMm: string;
};

const ASSISTANT_LAYER_STACK_APPLY_INTENT_PATTERN =
  /\b(?:add|alternative|alternatives|apply|arrange|build|calculate|combination|combinations|create|delete|insert|make|move|option|options|preview|remove|run|select|set|use|alternatif|alternatifler|ayarla|diz|dizelim|dizilimi|dizilimini|ekle|hesapla|kaldir|kaldır|kombinasyon|kombinasyonlar|kur|olustur|olusturalim|sec|seç|secenek|seçenek|secenekler|seçenekler|sil|tasi|taşı|uygula|yap)\b/iu;
const THICKNESS_PATTERN = /(\d+(?:[.,]\d+)?)\s*(?:mm|millimeters?|millimetres?|milimetre|milimeter)\b/iu;
const CONTEXT_NUMBER_PATTERN = /([+-]?\d+(?:[.,]\d+)?)/u;
const MAX_REPEAT_COUNT = 8;
const REQUESTED_OUTPUT_ID_SET = new Set<string>(REQUESTED_OUTPUT_IDS);

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
  },
  {
    aliases: ["screed", "sap", "floating screed"],
    materialId: "screed"
  },
  {
    aliases: ["geniemat", "geniemat rst05", "resilient mat"],
    materialId: "geniemat_rst05"
  }
];

const FLOOR_ROLE_ORDER = [
  "base_structure",
  "resilient_layer",
  "floating_screed",
  "upper_fill",
  "floor_covering",
  "ceiling_cavity",
  "ceiling_fill",
  "ceiling_board"
] as const;

const TARGET_OUTPUT_ALIASES: readonly {
  aliases: readonly string[];
  outputId: RequestedOutputId;
}[] = [
  { aliases: ["dnt a k", "dntak", "dnt a,k"], outputId: "DnT,A,k" },
  { aliases: ["dnt a", "dnta"], outputId: "DnT,A" },
  { aliases: ["dnt w", "dntw"], outputId: "DnT,w" },
  { aliases: ["dn a", "dna"], outputId: "Dn,A" },
  { aliases: ["dn w", "dnw"], outputId: "Dn,w" },
  { aliases: ["r prime w", "r w prime", "r w"], outputId: "R'w" },
  { aliases: ["rw"], outputId: "Rw" },
  { aliases: ["stc"], outputId: "STC" },
  { aliases: ["ctr"], outputId: "Ctr" },
  { aliases: ["delta lw", "deltalw"], outputId: "DeltaLw" },
  { aliases: ["ln w plus ci", "lnw ci", "lnwci"], outputId: "Ln,w+CI" },
  { aliases: ["ln w", "lnw"], outputId: "Ln,w" },
  { aliases: ["l prime nt 50", "l nt 50", "lnt50"], outputId: "L'nT,50" },
  { aliases: ["l prime nt w", "l nt w", "lntw"], outputId: "L'nT,w" },
  { aliases: ["l prime n w", "l n w"], outputId: "L'n,w" },
  { aliases: ["iic"], outputId: "IIC" },
  { aliases: ["aiic"], outputId: "AIIC" }
];

function normalizeCommandText(value: string): string {
  return value
    .replace(/[İIı]/gu, "i")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function containsNormalizedAlias(haystack: string, alias: string): boolean {
  const normalizedAlias = normalizeCommandText(alias);
  if (!normalizedAlias.length) {
    return false;
  }

  if (` ${haystack} `.includes(` ${normalizedAlias} `)) {
    return true;
  }

  if (normalizedAlias.includes(" ")) {
    return false;
  }

  const suffixPattern = new RegExp(`\\b${normalizedAlias}(?:lar|ler|lari|leri|i|u|a|e|n)?\\b`, "u");
  return suffixPattern.test(haystack);
}

function normalizeContextText(value: string): string {
  return value
    .replace(/[İIı]/gu, "i")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function contextAliasPattern(alias: string): string {
  return normalizeCommandText(alias)
    .split(" ")
    .filter(Boolean)
    .map(escapeRegex)
    .join("[^a-z0-9]*");
}

function contextAliasRegex(alias: string): RegExp {
  return new RegExp(`\\b${contextAliasPattern(alias)}\\b`, "u");
}

function contextAliasNumberRegex(alias: string): RegExp {
  return new RegExp(`\\b${contextAliasPattern(alias)}\\b[^\\d+-]*${CONTEXT_NUMBER_PATTERN.source}`, "u");
}

function readNumberAfterContextAlias(input: {
  aliases: readonly string[];
  instruction: string;
}): { mentioned: boolean; value: number | null } {
  const haystack = normalizeContextText(input.instruction);
  let mentioned = false;

  for (const alias of input.aliases) {
    const numberMatch = contextAliasNumberRegex(alias).exec(haystack);
    if (numberMatch?.[1]) {
      const value = Number.parseFloat(numberMatch[1].replace(",", "."));
      return {
        mentioned: true,
        value: Number.isFinite(value) ? value : null
      };
    }

    if (contextAliasRegex(alias).test(haystack)) {
      mentioned = true;
    }
  }

  return {
    mentioned,
    value: null
  };
}

const CONTEXT_FIELD_ALIASES: readonly string[] = [
  "airborne mode",
  "building basis",
  "building mode",
  "building output basis",
  "building prediction basis",
  "ci",
  "ci 50 2500",
  "ci,50-2500",
  "ci50 2500",
  "ci50-2500",
  "dynamic stiffness",
  "field context",
  "field k",
  "field mode",
  "impact receiving room volume",
  "impact room volume",
  "k correction",
  "lab mode",
  "load basis",
  "receiving room volume",
  "resilient layer dynamic stiffness",
  "room volume",
  "standardized basis",
  "stud spacing",
  "support spacing"
];

function hasContextFieldMention(instruction: string): boolean {
  const haystack = normalizeContextText(instruction);
  return CONTEXT_FIELD_ALIASES.some((alias) => contextAliasRegex(alias).test(haystack));
}

function looksLikeUnknownContextCommand(instruction: string): boolean {
  const normalized = normalizeCommandText(instruction);
  return /\b(?:enter|gir|girin|girelim|input|set|ayarla)\b/u.test(normalized) && CONTEXT_NUMBER_PATTERN.test(instruction);
}

function hasExplicitApplyIntent(instruction: string): boolean {
  return ASSISTANT_LAYER_STACK_APPLY_INTENT_PATTERN.test(normalizeCommandText(instruction));
}

function commandKindFromInstruction(instruction: string): WorkbenchV2AssistantCalculatorControlCommandKind {
  const normalized = normalizeCommandText(instruction);

  if (hasContextFieldMention(instruction) || looksLikeUnknownContextCommand(instruction)) {
    return "set_context";
  }

  if (/\b(?:alternative|alternatives|combination|combinations|option|options|alternatif|alternatifler|kombinasyon|kombinasyonlar|secenek|secenekler)\b/u.test(normalized)) {
    return "generate_candidates";
  }

  if (/\b(?:select|sec)\b/u.test(normalized)) {
    return "set_outputs";
  }

  if (/\b(?:preview|run|calculate|hesapla)\b/u.test(normalized)) {
    return "preview";
  }

  if (/\b(?:delete|remove|sil|kaldir)\b/u.test(normalized)) {
    return "remove_layer";
  }

  if (/\b(?:move|tasi)\b/u.test(normalized)) {
    return "move_layer";
  }

  if (/\b(?:add|insert|ekle)\b/u.test(normalized)) {
    return "add_layer";
  }

  if (THICKNESS_PATTERN.test(instruction) && /\b(?:make|set|yap|ayarla)\b/u.test(normalized)) {
    return "update_layer";
  }

  return "replace_stack";
}

function parseRequestedOutputs(instruction: string): RequestedOutputId[] {
  const normalized = normalizeCommandText(instruction);
  const outputIds: RequestedOutputId[] = [];

  for (const definition of TARGET_OUTPUT_ALIASES) {
    if (!REQUESTED_OUTPUT_ID_SET.has(definition.outputId)) {
      continue;
    }

    if (definition.aliases.some((alias) => containsNormalizedAlias(normalized, alias)) && !outputIds.includes(definition.outputId)) {
      outputIds.push(definition.outputId);
    }
  }

  return outputIds;
}

function readOneBasedLayerIndex(instruction: string): number | null {
  const normalized = normalizeCommandText(instruction);
  const match = /\b(\d+)\s*(?:layer|layeri|katman|satir|row|sira)?\b/u.exec(normalized);
  const value = match?.[1] ? Number.parseInt(match[1], 10) : NaN;

  return Number.isInteger(value) && value > 0 ? value : null;
}

function splitLayerSegments(instruction: string): string[] {
  return instruction
    .replace(/\s*(?:->|=>|→)\s*/gu, "\n")
    .replace(/\s*[+,;]\s*/gu, "\n")
    .replace(/\b(?:and|then|sonra|ve)\b/giu, "\n")
    .split(/\n+/u)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function cleanLayerMaterialPhrase(segment: string): string {
  return segment
    .replace(THICKNESS_PATTERN, " ")
    .replace(/^\s*\d+\s*x\s*/iu, " ")
    .replace(
      /\b(?:add|alta|apply|arrange|asağı|asagi|build|calculator|calculate|create|delete|edge|ekle|for|from|insert|layer|layeri|layers|make|move|ortaya|remove|set|sil|stack|tasi|taşı|top|use|uste|üst|üste|wall|ayarla|calculatoru|duvar|diz|dizelim|dizilimi|dizilimini|hesap|hesapla|icin|ile|katman|katmanlari|katmanlarını|kaldir|kaldır|kur|olustur|olusturalim|uygula|yap)\b/giu,
      " "
    )
    .replace(/\b(?:rw|stc|ctr|dnt|dn|ln|iic|aiic)\b/giu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function parsePositiveThickness(segment: string): string {
  const match = THICKNESS_PATTERN.exec(segment);
  if (!match) {
    return "";
  }

  const value = Number.parseFloat((match[1] ?? "").replace(",", "."));
  if (!Number.isFinite(value) || value <= 0) {
    return "";
  }

  return Number.isInteger(value) ? String(value) : String(value);
}

function readRepeatCount(segment: string): { count: number; ok: boolean } {
  const match = /^\s*(\d+)\s*x\b/iu.exec(segment);
  if (!match) {
    return { count: 1, ok: true };
  }

  const count = Number.parseInt(match[1] ?? "", 10);
  return {
    count: Number.isInteger(count) && count >= 1 && count <= MAX_REPEAT_COUNT ? count : 1,
    ok: Number.isInteger(count) && count >= 1 && count <= MAX_REPEAT_COUNT
  };
}

function buildMaterialAliasEntries(materials: readonly MaterialDefinition[]): {
  alias: string;
  material: MaterialDefinition;
}[] {
  const materialById = new Map(materials.map((material) => [material.id, material]));
  const entries: { alias: string; material: MaterialDefinition }[] = [];

  for (const definition of MATERIAL_ALIASES) {
    const material = materialById.get(definition.materialId);
    if (!material) {
      continue;
    }

    for (const alias of definition.aliases) {
      entries.push({
        alias: normalizeCommandText(alias),
        material
      });
    }
  }

  for (const material of materials) {
    entries.push({
      alias: normalizeCommandText(material.name),
      material
    });
    entries.push({
      alias: normalizeCommandText(material.id.replace(/_/gu, " ")),
      material
    });
  }

  return entries
    .filter((entry) => entry.alias.length > 1)
    .sort((left, right) => right.alias.length - left.alias.length);
}

function matchMaterial(input: {
  aliasEntries: readonly {
    alias: string;
    material: MaterialDefinition;
  }[];
  phrase: string;
}): { material: MaterialDefinition; ok: true } | { code: "ambiguous_material" | "unknown_material"; ok: false } {
  const normalized = normalizeCommandText(input.phrase);
  const matches = input.aliasEntries.filter((entry) => containsNormalizedAlias(normalized, entry.alias));
  const first = matches[0];

  if (!first) {
    return { code: "unknown_material", ok: false };
  }

  const sameLengthDifferentMaterial = matches.some((match) =>
    match.alias.length === first.alias.length && match.material.id !== first.material.id
  );

  if (sameLengthDifferentMaterial) {
    return { code: "ambiguous_material", ok: false };
  }

  return {
    material: first.material,
    ok: true
  };
}

function materialById(materials: readonly MaterialDefinition[]): ReadonlyMap<string, MaterialDefinition> {
  return new Map(materials.map((material) => [material.id, material]));
}

function materialForExistingLayer(
  layer: WorkbenchV2DraftLayer,
  materialsById: ReadonlyMap<string, MaterialDefinition>
): MaterialDefinition {
  return materialsById.get(layer.materialId) ?? {
    category: "mass",
    densityKgM3: 0,
    id: layer.materialId,
    name: layer.materialId,
    tags: []
  };
}

function parsedSeedsFromLayers(
  layers: readonly WorkbenchV2DraftLayer[],
  materials: readonly MaterialDefinition[]
): ParsedLayerSeed[] {
  const byId = materialById(materials);

  return layers.map((layer) => ({
    material: materialForExistingLayer(layer, byId),
    originalPhrase: layer.materialId,
    thicknessMm: layer.thicknessMm
  }));
}

export function getWorkbenchV2AssistantLayerStackSignature(layers: readonly WorkbenchV2DraftLayer[]): string {
  return layers
    .map((layer) => `${layer.id}:${layer.materialId}:${layer.role}:${layer.thicknessMm}`)
    .join("|");
}

function rebuildLayerRoles(input: {
  layers: readonly WorkbenchV2DraftLayer[];
  materials: readonly MaterialDefinition[];
  mode: WorkbenchV2StudyMode;
}): WorkbenchV2DraftLayer[] {
  const parsedLayers = parsedSeedsFromLayers(input.layers, input.materials);

  return input.layers.map((layer, index) => ({
    ...layer,
    role: roleForLayer({
      index,
      mode: input.mode,
      parsedLayers
    })
  }));
}

function layerIndicesMatchingMaterial(input: {
  instruction: string;
  layers: readonly WorkbenchV2DraftLayer[];
  materials: readonly MaterialDefinition[];
}): number[] {
  const aliasEntries = buildMaterialAliasEntries(input.materials);
  const normalized = normalizeCommandText(input.instruction);
  const matchingMaterialIds = new Set<string>();

  for (const entry of aliasEntries) {
    if (containsNormalizedAlias(normalized, entry.alias)) {
      matchingMaterialIds.add(entry.material.id);
    }
  }

  return input.layers.flatMap((layer, index) => matchingMaterialIds.has(layer.materialId) ? [index] : []);
}

function insertAt<T>(items: readonly T[], index: number, item: T): T[] {
  const next = [...items];
  next.splice(Math.max(0, Math.min(index, next.length)), 0, item);
  return next;
}

function removeAt<T>(items: readonly T[], index: number): T[] {
  return items.filter((_, itemIndex) => itemIndex !== index);
}

function moveAt<T>(items: readonly T[], fromIndex: number, toIndex: number): T[] {
  const next = [...items];
  const [item] = next.splice(fromIndex, 1);

  if (item === undefined) {
    return next;
  }

  next.splice(Math.max(0, Math.min(toIndex, next.length)), 0, item);
  return next;
}

function missingThicknessTasksForLayers(layers: readonly WorkbenchV2DraftLayer[]): WorkbenchV2AssistantLayerStackCommandTask[] {
  return layers.flatMap((layer, index) =>
    layer.thicknessMm.trim()
      ? []
      : [
          {
            code: "assistant_layer_thickness_missing",
            detail: `Layer ${index + 1} needs a positive thickness before calculation.`,
            label: "Missing thickness",
            layerId: layer.id
          }
        ]
  );
}

function cloneCandidateLayers(input: {
  layers: readonly WorkbenchV2DraftLayer[];
  materials: readonly MaterialDefinition[];
  mode: WorkbenchV2StudyMode;
}): WorkbenchV2DraftLayer[] {
  return rebuildLayerRoles({
    layers: input.layers,
    materials: input.materials,
    mode: input.mode
  });
}

function buildCandidateStack(input: {
  candidateIndex: number;
  label: string;
  layers: readonly WorkbenchV2DraftLayer[];
  materials: readonly MaterialDefinition[];
  mode: WorkbenchV2StudyMode;
  sourceLayerSignature: string;
}): WorkbenchV2AssistantLayerStackCandidateStack {
  const layers = cloneCandidateLayers({
    layers: input.layers,
    materials: input.materials,
    mode: input.mode
  });
  const tasks = missingThicknessTasksForLayers(layers);

  return {
    candidateId: `assistant-candidate-${input.candidateIndex + 1}`,
    contextPatch: buildContextPatch({ layers, mode: input.mode }),
    label: input.label,
    layers,
    mode: input.mode,
    selectedLayerId: layers[0]?.id ?? null,
    sourceLayerSignature: input.sourceLayerSignature,
    tasks,
    warnings: [
      "Candidate stack reuses current calculator materials and thicknesses; preview values must come from the calculator."
    ]
  };
}

function generateCandidateStacks(input: {
  currentLayers: readonly WorkbenchV2DraftLayer[];
  materials: readonly MaterialDefinition[];
  mode: WorkbenchV2StudyMode;
}): WorkbenchV2AssistantLayerStackCandidateStack[] {
  const sourceLayerSignature = getWorkbenchV2AssistantLayerStackSignature(input.currentLayers);
  const variants: {
    label: string;
    layers: readonly WorkbenchV2DraftLayer[];
  }[] = [
    {
      label: "Current order",
      layers: input.currentLayers
    },
    {
      label: "Reversed order",
      layers: [...input.currentLayers].reverse()
    },
    {
      label: "Rotated order",
      layers: input.currentLayers.length > 1 ? [...input.currentLayers.slice(1), input.currentLayers[0]!] : input.currentLayers
    }
  ];

  return variants.map((variant, candidateIndex) =>
    buildCandidateStack({
      candidateIndex,
      label: variant.label,
      layers: variant.layers,
      materials: input.materials,
      mode: input.mode,
      sourceLayerSignature
    })
  );
}

function inferCommandMode(input: {
  currentMode: WorkbenchV2StudyMode;
  instruction: string;
  parsedLayers: readonly ParsedLayerSeed[];
}): WorkbenchV2StudyMode {
  const normalized = normalizeCommandText(input.instruction);
  const mentionsFloor = ["floor", "ceiling", "slab", "doseme", "tavan"].some((alias) => containsNormalizedAlias(normalized, alias));
  const mentionsWall = ["wall", "duvar"].some((alias) => containsNormalizedAlias(normalized, alias));

  if (mentionsFloor && !mentionsWall) {
    return "floor";
  }

  if (mentionsWall && !mentionsFloor) {
    return "wall";
  }

  const hasPorousMiddleLayer = input.parsedLayers.some((layer) => layer.material.acoustic?.behavior === "porous_absorber");
  if (input.parsedLayers.length >= 3 && hasPorousMiddleLayer) {
    return "wall";
  }

  return input.currentMode;
}

function roleForWallLayer(input: {
  index: number;
  parsedLayers: readonly ParsedLayerSeed[];
}): string {
  const absorberIndices = input.parsedLayers
    .map((layer, index) => layer.material.acoustic?.behavior === "porous_absorber" ? index : -1)
    .filter((index) => index >= 0);

  if (absorberIndices.length > 0) {
    const firstAbsorberIndex = absorberIndices[0]!;
    const lastAbsorberIndex = absorberIndices[absorberIndices.length - 1]!;

    if (input.index < firstAbsorberIndex) {
      return input.index === 0 ? "side_a" : "core";
    }

    if (input.index > lastAbsorberIndex) {
      return input.index === input.parsedLayers.length - 1 ? "side_b" : "core";
    }

    return absorberIndices.includes(input.index) ? "cavity" : "core";
  }

  if (input.parsedLayers.length === 1) {
    return "core";
  }

  if (input.index === 0) {
    return "side_a";
  }

  if (input.index === input.parsedLayers.length - 1) {
    return "side_b";
  }

  return "core";
}

function roleForLayer(input: {
  index: number;
  mode: WorkbenchV2StudyMode;
  parsedLayers: readonly ParsedLayerSeed[];
}): string {
  if (input.mode === "wall") {
    return roleForWallLayer({
      index: input.index,
      parsedLayers: input.parsedLayers
    });
  }

  return FLOOR_ROLE_ORDER[Math.min(input.index, FLOOR_ROLE_ORDER.length - 1)]!;
}

function parseFinitePositiveNumber(value: string): number | null {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function formatIndexList(indices: readonly number[]): string {
  return indices.map((index) => String(index + 1)).join(",");
}

function formatContextNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(value);
}

function contextTask(input: {
  detail: string;
  field: keyof WorkbenchV2ContextDraft;
}): WorkbenchV2AssistantLayerStackCommandTask {
  return {
    code: `assistant_context_${input.field}_updated`,
    detail: input.detail,
    label: "Context input updated"
  };
}

function parseContextFieldCommand(input: {
  currentLayers: readonly WorkbenchV2DraftLayer[];
  currentMode: WorkbenchV2StudyMode;
  currentSelectedLayerId: string | null;
  currentSelectedOutputs: readonly RequestedOutputId[];
  instruction: string;
}): WorkbenchV2AssistantLayerStackApplyResult {
  const normalized = normalizeCommandText(input.instruction);
  const contextPatch: Partial<WorkbenchV2ContextDraft> = {};
  const tasks: WorkbenchV2AssistantLayerStackCommandTask[] = [];

  function addPositiveNumberField(field: keyof WorkbenchV2ContextDraft, label: string, aliases: readonly string[]): { mentioned: boolean } {
    const parsed = readNumberAfterContextAlias({
      aliases,
      instruction: input.instruction
    });

    if (!parsed.mentioned) {
      return { mentioned: false };
    }

    if (parsed.value === null || parsed.value <= 0) {
      throw new Error(`${label} must be a positive number.`);
    }

    const value = formatContextNumber(parsed.value);
    contextPatch[field] = value as never;
    tasks.push(contextTask({
      detail: `${label} set to ${value}.`,
      field
    }));
    return { mentioned: true };
  }

  function addSignedNumberField(field: keyof WorkbenchV2ContextDraft, label: string, aliases: readonly string[]): { mentioned: boolean } {
    const parsed = readNumberAfterContextAlias({
      aliases,
      instruction: input.instruction
    });

    if (!parsed.mentioned) {
      return { mentioned: false };
    }

    if (parsed.value === null) {
      throw new Error(`${label} must be a finite number.`);
    }

    const value = formatContextNumber(parsed.value);
    contextPatch[field] = value as never;
    tasks.push(contextTask({
      detail: `${label} set to ${value}.`,
      field
    }));
    return { mentioned: true };
  }

  let mentionedKnownField = false;

  try {
    mentionedKnownField = addPositiveNumberField("supportSpacingMm", "Support spacing", [
      "support spacing",
      "stud spacing",
      "dikme araligi",
      "aks araligi"
    ]).mentioned || mentionedKnownField;
    mentionedKnownField = addPositiveNumberField("resilientLayerDynamicStiffnessMNm3", "Dynamic stiffness", [
      "dynamic stiffness",
      "resilient layer dynamic stiffness",
      "dinamik rijitlik",
      "dinamik sertlik"
    ]).mentioned || mentionedKnownField;
    mentionedKnownField = addPositiveNumberField("loadBasisKgM2", "Load basis", [
      "load basis",
      "surface load",
      "yuk baz",
      "yuk",
      "yük"
    ]).mentioned || mentionedKnownField;
    mentionedKnownField = addPositiveNumberField("impactReceivingRoomVolumeM3", "Impact receiving-room volume", [
      "impact receiving room volume",
      "impact room volume",
      "field impact room volume"
    ]).mentioned || mentionedKnownField;
    mentionedKnownField = addPositiveNumberField("receivingRoomVolumeM3", "Receiving-room volume", [
      "receiving room volume"
    ]).mentioned || mentionedKnownField;

    const genericRoomVolume = readNumberAfterContextAlias({
      aliases: ["room volume"],
      instruction: input.instruction
    });
    if (genericRoomVolume.mentioned) {
      if (genericRoomVolume.value === null || genericRoomVolume.value <= 0) {
        throw new Error("Room volume must be a positive number.");
      }

      const field = input.currentMode === "floor" ? "impactReceivingRoomVolumeM3" : "receivingRoomVolumeM3";
      const value = formatContextNumber(genericRoomVolume.value);
      contextPatch[field] = value;
      tasks.push(contextTask({
        detail: `${input.currentMode === "floor" ? "Impact receiving-room volume" : "Receiving-room volume"} set to ${value}.`,
        field
      }));
      mentionedKnownField = true;
    }

    mentionedKnownField = addSignedNumberField("ci50_2500Db", "CI,50-2500", [
      "ci 50 2500",
      "ci,50-2500",
      "ci50 2500",
      "ci50-2500"
    ]).mentioned || mentionedKnownField;
    mentionedKnownField = addSignedNumberField("ciDb", "CI", [
      "impact ci",
      "ci db",
      "ci value"
    ]).mentioned || mentionedKnownField;

    const ciHaystack = normalizeContextText(input.instruction);
    const plainCiMatch = /\bci\b(?![^a-z0-9]*50\b)[^\d+-]*([+-]?\d+(?:[.,]\d+)?)/u.exec(ciHaystack);
    if (plainCiMatch?.[1] && contextPatch.ciDb === undefined) {
      const valueNumber = Number.parseFloat(plainCiMatch[1].replace(",", "."));
      if (!Number.isFinite(valueNumber)) {
        throw new Error("CI must be a finite number.");
      }

      const value = formatContextNumber(valueNumber);
      contextPatch.ciDb = value;
      tasks.push(contextTask({
        detail: `CI set to ${value}.`,
        field: "ciDb"
      }));
      mentionedKnownField = true;
    }

    mentionedKnownField = addSignedNumberField("fieldKDb", "Field K correction", [
      "field k",
      "k correction"
    ]).mentioned || mentionedKnownField;
  } catch (error) {
    return {
      code: "invalid_context_value",
      message: error instanceof Error ? error.message : "Context input value is invalid.",
      ok: false
    };
  }

  if (/\b(?:field mode|field context|saha modu|alan modu)\b/u.test(normalized)) {
    contextPatch.airborneMode = "field_between_rooms";
    tasks.push(contextTask({
      detail: "Airborne mode set to field between rooms.",
      field: "airborneMode"
    }));
    mentionedKnownField = true;
  }

  if (/\b(?:building mode|building prediction|bina modu)\b/u.test(normalized)) {
    contextPatch.airborneMode = "building_prediction";
    tasks.push(contextTask({
      detail: "Airborne mode set to building prediction.",
      field: "airborneMode"
    }));
    mentionedKnownField = true;
  }

  if (/\b(?:lab mode|element lab|laboratory mode|lab modu)\b/u.test(normalized)) {
    contextPatch.airborneMode = "element_lab";
    tasks.push(contextTask({
      detail: "Airborne mode set to element lab.",
      field: "airborneMode"
    }));
    mentionedKnownField = true;
  }

  if (/\b(?:apparent and standardized|apparent standardized|apparent standardi[sz]ed|apparent\+standardi[sz]ed|apparent ve standardized|apparent ve standart)\b/u.test(normalized)) {
    contextPatch.buildingPredictionOutputBasis = "apparent_and_standardized";
    tasks.push(contextTask({
      detail: "Building output basis set to apparent and standardized.",
      field: "buildingPredictionOutputBasis"
    }));
    mentionedKnownField = true;
  } else if (/\b(?:standardized basis|standardised basis|standardized|standardised|standart)\b/u.test(normalized)) {
    contextPatch.buildingPredictionOutputBasis = "standardized";
    tasks.push(contextTask({
      detail: "Building output basis set to standardized.",
      field: "buildingPredictionOutputBasis"
    }));
    mentionedKnownField = true;
  } else if (/\b(?:apparent basis|apparent)\b/u.test(normalized)) {
    contextPatch.buildingPredictionOutputBasis = "apparent";
    tasks.push(contextTask({
      detail: "Building output basis set to apparent.",
      field: "buildingPredictionOutputBasis"
    }));
    mentionedKnownField = true;
  }

  if (!mentionedKnownField || Object.keys(contextPatch).length === 0) {
    return {
      code: "unknown_context_field",
      message: "No supported calculator context input could be read from the assistant command.",
      ok: false
    };
  }

  return {
    commandKind: "set_context",
    contextPatch,
    layerCount: input.currentLayers.length,
    layers: [...input.currentLayers],
    materialNames: [],
    mode: input.currentMode,
    ok: true,
    previewRequested: /\b(?:preview|run|calculate|hesapla)\b/u.test(normalized),
    selectedLayerId: input.currentSelectedLayerId,
    selectedOutputs: input.currentSelectedOutputs.length ? [...input.currentSelectedOutputs] : undefined,
    tasks,
    warnings: []
  };
}

function buildWallContextPatch(layers: readonly WorkbenchV2DraftLayer[]): Partial<WorkbenchV2ContextDraft> {
  const sideAIndices = layers.flatMap((layer, index) => layer.role === "side_a" ? [index] : []);
  const cavityIndices = layers.flatMap((layer, index) => layer.role === "cavity" ? [index] : []);
  const sideBIndices = layers.flatMap((layer, index) => layer.role === "side_b" ? [index] : []);
  const cavityDepthMm = cavityIndices.reduce((sum, index) => sum + (parseFinitePositiveNumber(layers[index]?.thicknessMm ?? "") ?? 0), 0);
  const hasCavity = cavityIndices.length > 0;

  return {
    wallCavity1AbsorptionClass: hasCavity ? "porous_absorptive" : "unknown",
    wallCavity1DepthMm: hasCavity && cavityDepthMm > 0 ? String(cavityDepthMm) : "",
    wallCavity1FillCoverage: hasCavity ? "full" : "unknown",
    wallCavity1LayerIndices: formatIndexList(cavityIndices),
    wallSideALeafLayerIndices: formatIndexList(sideAIndices),
    wallSideBLeafLayerIndices: formatIndexList(sideBIndices),
    wallTopologyMode: hasCavity ? "double_leaf_framed" : "auto"
  };
}

function buildContextPatch(input: {
  layers: readonly WorkbenchV2DraftLayer[];
  mode: WorkbenchV2StudyMode;
}): Partial<WorkbenchV2ContextDraft> {
  if (input.mode !== "wall") {
    return {};
  }

  return buildWallContextPatch(input.layers);
}

function parseLayerSeeds(input: {
  instruction: string;
  materials: readonly MaterialDefinition[];
}): { code: "ambiguous_material" | "no_layers" | "unknown_material"; message: string; ok: false } | { ok: true; parsedLayers: ParsedLayerSeed[] } {
  const segments = splitLayerSegments(input.instruction);
  const aliasEntries = buildMaterialAliasEntries(input.materials);
  const parsedLayers: ParsedLayerSeed[] = [];

  for (const segment of segments) {
    const phrase = cleanLayerMaterialPhrase(segment);
    if (!phrase) {
      continue;
    }

    const material = matchMaterial({ aliasEntries, phrase });
    if (material.ok === false) {
      return {
        code: material.code,
        message:
          material.code === "ambiguous_material"
            ? `Layer material "${phrase}" matches multiple catalog entries. Pick the exact material in the layer table.`
            : `Layer material "${phrase}" is not in the current material catalog.`,
        ok: false
      };
    }

    const repeat = readRepeatCount(segment);
    if (!repeat.ok) {
      return {
        code: "no_layers",
        message: `Layer repeat count in "${segment}" must be between 1 and ${MAX_REPEAT_COUNT}.`,
        ok: false
      };
    }

    const thicknessMm = parsePositiveThickness(segment);
    for (let index = 0; index < repeat.count; index += 1) {
      parsedLayers.push({
        material: material.material,
        originalPhrase: segment,
        thicknessMm
      });
    }
  }

  if (!parsedLayers.length) {
    return {
      code: "no_layers",
      message: "No layer materials could be read from the assistant stack command.",
      ok: false
    };
  }

  return {
    ok: true,
    parsedLayers
  };
}

export function parseWorkbenchV2AssistantLayerStackApplyCommand(input: {
  currentLayers?: readonly WorkbenchV2DraftLayer[];
  currentMode: WorkbenchV2StudyMode;
  currentSelectedLayerId?: string | null;
  currentSelectedOutputs?: readonly RequestedOutputId[];
  idFactory: (index: number) => string;
  instruction: string;
  materials: readonly MaterialDefinition[];
}): WorkbenchV2AssistantLayerStackApplyResult {
  const instruction = input.instruction.trim();
  if (!instruction) {
    return {
      code: "empty_instruction",
      message: "Enter a layer stack command before applying.",
      ok: false
    };
  }

  const commandKind = commandKindFromInstruction(instruction);
  const currentLayers = input.currentLayers ?? [];
  const currentSelectedLayerId = input.currentSelectedLayerId ?? currentLayers[0]?.id ?? null;
  const currentSelectedOutputs = input.currentSelectedOutputs ?? [];

  if (commandKind === "set_context") {
    return parseContextFieldCommand({
      currentLayers,
      currentMode: input.currentMode,
      currentSelectedLayerId,
      currentSelectedOutputs,
      instruction
    });
  }

  if (!hasExplicitApplyIntent(instruction)) {
    return {
      code: "missing_apply_intent",
      message: "The stack was not changed because the instruction did not explicitly ask to apply or arrange layers.",
      ok: false
    };
  }

  if (commandKind === "preview") {
    return {
      commandKind,
      contextPatch: {},
      layerCount: currentLayers.length,
      layers: [...currentLayers],
      materialNames: [],
      mode: input.currentMode,
      ok: true,
      previewRequested: true,
      selectedLayerId: currentSelectedLayerId,
      selectedOutputs: currentSelectedOutputs.length ? [...currentSelectedOutputs] : undefined,
      tasks: [],
      warnings: []
    };
  }

  if (commandKind === "set_outputs") {
    const selectedOutputs = parseRequestedOutputs(instruction);
    if (!selectedOutputs.length) {
      return {
        code: "missing_output",
        message: "No supported calculator output could be read from the assistant command.",
        ok: false
      };
    }

    return {
      commandKind,
      contextPatch: {},
      layerCount: currentLayers.length,
      layers: [...currentLayers],
      materialNames: [],
      mode: input.currentMode,
      ok: true,
      previewRequested: false,
      selectedLayerId: currentSelectedLayerId,
      selectedOutputs,
      tasks: [],
      warnings: []
    };
  }

  if (commandKind === "generate_candidates") {
    if (currentLayers.length < 2) {
      return {
        code: "no_candidate_layers",
        message: "At least two visible calculator layers are needed before generating candidate combinations.",
        ok: false
      };
    }

    const candidateStacks = generateCandidateStacks({
      currentLayers,
      materials: input.materials,
      mode: input.currentMode
    });

    return {
      candidateStacks,
      commandKind,
      contextPatch: {},
      layerCount: currentLayers.length,
      layers: [...currentLayers],
      materialNames: [],
      mode: input.currentMode,
      ok: true,
      previewRequested: false,
      selectedLayerId: currentSelectedLayerId,
      selectedOutputs: currentSelectedOutputs.length ? [...currentSelectedOutputs] : undefined,
      tasks: [],
      warnings: [
        "Generated candidate stacks are draft alternatives only; run calculator preview before comparing acoustic values."
      ]
    };
  }

  if (commandKind === "remove_layer") {
    if (!currentLayers.length) {
      return {
        code: "missing_current_stack",
        message: "There is no current calculator layer stack to edit.",
        ok: false
      };
    }

    const oneBasedIndex = readOneBasedLayerIndex(instruction);
    const layerIndex = oneBasedIndex ? oneBasedIndex - 1 : layerIndicesMatchingMaterial({
      instruction,
      layers: currentLayers,
      materials: input.materials
    })[0];

    if (layerIndex === undefined || layerIndex < 0 || layerIndex >= currentLayers.length) {
      return {
        code: "no_matching_layer",
        message: "No matching calculator layer could be removed from the current stack.",
        ok: false
      };
    }

    const mode = input.currentMode;
    const layers = rebuildLayerRoles({
      layers: removeAt(currentLayers, layerIndex),
      materials: input.materials,
      mode
    });

    return {
      commandKind,
      contextPatch: buildContextPatch({ layers, mode }),
      layerCount: layers.length,
      layers,
      materialNames: [],
      mode,
      ok: true,
      previewRequested: false,
      selectedLayerId: layers[Math.min(layerIndex, layers.length - 1)]?.id ?? null,
      selectedOutputs: currentSelectedOutputs.length ? [...currentSelectedOutputs] : undefined,
      tasks: [],
      warnings: []
    };
  }

  if (commandKind === "move_layer") {
    if (!currentLayers.length) {
      return {
        code: "missing_current_stack",
        message: "There is no current calculator layer stack to edit.",
        ok: false
      };
    }

    const oneBasedIndex = readOneBasedLayerIndex(instruction);
    const fromIndex = oneBasedIndex ? oneBasedIndex - 1 : layerIndicesMatchingMaterial({
      instruction,
      layers: currentLayers,
      materials: input.materials
    })[0];

    if (fromIndex === undefined || fromIndex < 0 || fromIndex >= currentLayers.length) {
      return {
        code: "no_matching_layer",
        message: "No matching calculator layer could be moved from the current stack.",
        ok: false
      };
    }

    const normalized = normalizeCommandText(instruction);
    const toIndex = containsNormalizedAlias(normalized, "orta") || containsNormalizedAlias(normalized, "ortaya") || containsNormalizedAlias(normalized, "middle")
      ? Math.floor(currentLayers.length / 2)
      : containsNormalizedAlias(normalized, "alt") || containsNormalizedAlias(normalized, "bottom") || containsNormalizedAlias(normalized, "end")
        ? currentLayers.length - 1
        : 0;
    const mode = input.currentMode;
    const moved = moveAt(currentLayers, fromIndex, toIndex);
    const layers = rebuildLayerRoles({
      layers: moved,
      materials: input.materials,
      mode
    });

    return {
      commandKind,
      contextPatch: buildContextPatch({ layers, mode }),
      layerCount: layers.length,
      layers,
      materialNames: [],
      mode,
      ok: true,
      previewRequested: false,
      selectedLayerId: currentLayers[fromIndex]?.id ?? null,
      selectedOutputs: currentSelectedOutputs.length ? [...currentSelectedOutputs] : undefined,
      tasks: [],
      warnings: []
    };
  }

  if (commandKind === "update_layer") {
    if (!currentLayers.length) {
      return {
        code: "missing_current_stack",
        message: "There is no current calculator layer stack to edit.",
        ok: false
      };
    }

    const thicknessMm = parsePositiveThickness(instruction);
    const matchingIndices = layerIndicesMatchingMaterial({
      instruction,
      layers: currentLayers,
      materials: input.materials
    });

    if (!thicknessMm || !matchingIndices.length) {
      return {
        code: "no_matching_layer",
        message: "No matching calculator layer could be updated from the current stack.",
        ok: false
      };
    }

    const mode = input.currentMode;
    const layers = currentLayers.map((layer, index) =>
      matchingIndices.includes(index)
        ? {
            ...layer,
            thicknessMm
          }
        : layer
    );

    return {
      commandKind,
      contextPatch: buildContextPatch({ layers, mode }),
      layerCount: layers.length,
      layers,
      materialNames: [],
      mode,
      ok: true,
      previewRequested: false,
      selectedLayerId: layers[matchingIndices[0] ?? 0]?.id ?? null,
      selectedOutputs: currentSelectedOutputs.length ? [...currentSelectedOutputs] : undefined,
      tasks: [],
      warnings: []
    };
  }

  const parsed = parseLayerSeeds({
    instruction,
    materials: input.materials
  });
  if (parsed.ok === false) {
    return parsed;
  }

  const mode = inferCommandMode({
    currentMode: input.currentMode,
    instruction,
    parsedLayers: parsed.parsedLayers
  });
  const parsedLayers = commandKind === "add_layer" ? [
    ...parsed.parsedLayers,
    ...parsedSeedsFromLayers(currentLayers, input.materials)
  ] : parsed.parsedLayers;
  const newLayers = parsed.parsedLayers.map((layer, index) => ({
    id: input.idFactory(index),
    materialId: layer.material.id,
    role: roleForLayer({
      index,
      mode,
      parsedLayers
    }),
    thicknessMm: layer.thicknessMm
  }));
  const normalized = normalizeCommandText(instruction);
  const insertionIndex = containsNormalizedAlias(normalized, "alt") || containsNormalizedAlias(normalized, "bottom") || containsNormalizedAlias(normalized, "end")
    ? currentLayers.length
    : 0;
  const layers = commandKind === "add_layer"
    ? rebuildLayerRoles({
        layers: insertAt(currentLayers, insertionIndex, newLayers[0]!),
        materials: input.materials,
        mode
      })
    : newLayers;
  const missingThicknessTasks = missingThicknessTasksForLayers(layers);

  return {
    commandKind,
    contextPatch: buildContextPatch({ layers, mode }),
    layerCount: layers.length,
    layers,
    materialNames: parsed.parsedLayers.map((layer) => layer.material.name),
    mode,
    ok: true,
    previewRequested: false,
    selectedLayerId: layers[0]?.id ?? null,
    selectedOutputs: currentSelectedOutputs.length ? [...currentSelectedOutputs] : undefined,
    tasks: missingThicknessTasks,
    warnings: missingThicknessTasks.length
      ? ["Assistant arranged the stack but left missing thicknesses blank instead of guessing."]
      : []
  };
}
