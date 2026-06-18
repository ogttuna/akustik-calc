import { calculateAssembly } from "@dynecho/engine/runtime";
import type {
  AssemblyCalculation,
  EstimateRequest,
  FloorRole,
  JsonValue,
  MaterialDefinition,
  RequestedOutputId
} from "@dynecho/shared";

import { buildResolvedMaterialCatalog } from "./material-editor-state";
import {
  parseWorkbenchV2ProjectSnapshot,
  WORKBENCH_V2_DEFAULT_CONTEXT,
  buildWorkbenchV2ProjectSnapshot,
  type WorkbenchV2ContextDraft,
  type WorkbenchV2DraftLayer,
  type WorkbenchV2ProjectSnapshot,
  type WorkbenchV2StudyMode
} from "./workbench-v2-project-snapshot";

export type WorkbenchV2CalculatorAssistantToolName =
  | "preview_described_layer_configuration"
  | "preview_workbench_v2_calculator_snapshot";

export type WorkbenchV2CalculatorAssistantToolDefinition = {
  description: string;
  mutates: false;
  name: WorkbenchV2CalculatorAssistantToolName;
  previewOnly: true;
  requiredInputs: readonly string[];
};

export const WORKBENCH_V2_CALCULATOR_ASSISTANT_TOOL_DEFINITIONS: readonly WorkbenchV2CalculatorAssistantToolDefinition[] = [
  {
    description: "Run a preview calculation from a Workbench V2 snapshot and return bounded calculator output context.",
    mutates: false,
    name: "preview_workbench_v2_calculator_snapshot",
    previewOnly: true,
    requiredInputs: ["snapshot"]
  },
  {
    description: "Parse a described wall layer configuration, build a temporary calculator request, and return preview-only calculator output context.",
    mutates: false,
    name: "preview_described_layer_configuration",
    previewOnly: true,
    requiredInputs: ["description"]
  }
];

export type WorkbenchV2CalculatorAssistantOutputStatus = "live" | "needs_input" | "pending" | "unsupported";

export type WorkbenchV2CalculatorAssistantOutputRow = {
  detail: string;
  label: RequestedOutputId;
  status: WorkbenchV2CalculatorAssistantOutputStatus;
  value: string;
};

export type WorkbenchV2CalculatorAssistantTask = {
  detail: string;
  id: string;
  label: string;
  source: "calculator_route" | "described_layer_configuration" | "workbench_snapshot";
};

export type WorkbenchV2CalculatorAssistantPreviewStatus = "needs_input" | "ready" | "unsupported";

export type WorkbenchV2CalculatorAssistantPreview = {
  calculationSummary: {
    primaryOutput?: RequestedOutputId;
    primaryValueLabel?: string;
    selectedOutputs: RequestedOutputId[];
    status: WorkbenchV2CalculatorAssistantPreviewStatus;
  };
  describedConfiguration?: {
    description: string;
    layers: readonly {
      materialId: string;
      materialName: string;
      role: string;
      thicknessMm: number;
    }[];
    parser: "deterministic_wall_layer_description_v1";
    warnings: readonly string[];
  };
  engineSummary?: {
    acousticBoundary?: {
      method: string;
      missingPhysicalInputs: readonly string[];
      origin: "needs_input" | "unsupported";
      requiredInputs: readonly string[];
      route: "floor" | "wall";
      unsupportedOutputs: readonly RequestedOutputId[];
    };
    calculatorId?: string;
    calculatorLabel?: string;
    method: string;
    supportedImpactOutputs: readonly RequestedOutputId[];
    supportedTargetOutputs: readonly RequestedOutputId[];
    unsupportedImpactOutputs: readonly RequestedOutputId[];
    unsupportedTargetOutputs: readonly RequestedOutputId[];
    warnings: readonly string[];
  };
  estimatePayload?: EstimateRequest;
  outputRows: readonly WorkbenchV2CalculatorAssistantOutputRow[];
  requestedSnapshot: {
    customMaterialCount: number;
    layerCount: number;
    mode: WorkbenchV2StudyMode;
    name: string;
    selectedOutputs: RequestedOutputId[];
  };
  tasks: readonly WorkbenchV2CalculatorAssistantTask[];
};

export type WorkbenchV2CalculatorAssistantPreviewResult =
  | {
      mutates: false;
      name: WorkbenchV2CalculatorAssistantToolName;
      ok: true;
      preview: WorkbenchV2CalculatorAssistantPreview;
      previewOnly: true;
    }
  | {
      code: string;
      errors: readonly string[];
      mutates: false;
      name: WorkbenchV2CalculatorAssistantToolName;
      ok: false;
      previewOnly: true;
      statusCode: number;
    };

const SNAPSHOT_TOOL_NAME = "preview_workbench_v2_calculator_snapshot" satisfies WorkbenchV2CalculatorAssistantToolName;
const DESCRIBED_LAYER_TOOL_NAME = "preview_described_layer_configuration" satisfies WorkbenchV2CalculatorAssistantToolName;

const WORKBENCH_V2_ASSISTANT_OUTPUT_IDS = new Set<RequestedOutputId>([
  "Rw",
  "R'w",
  "DnT,w",
  "DnT,A",
  "DnT,A,k",
  "Dn,w",
  "Dn,A",
  "STC",
  "C",
  "Ctr",
  "Ln,w",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "Ln,w+CI",
  "LnT,A",
  "DeltaLw",
  "CI",
  "CI,50-2500",
  "IIC",
  "AIIC"
]);

const DESCRIBED_LAYER_THICKNESS_PATTERN =
  /(\d+(?:[.,]\d+)?)\s*(?:mm|millimeters?|millimetres?|milimetre|milimeter)\b/iu;

const DESCRIBED_LAYER_MATERIAL_ALIASES: readonly {
  aliases: readonly string[];
  materialId: string;
}[] = [
  {
    aliases: ["acoustic gypsum board", "acoustic plasterboard", "soundbloc", "diamant board"],
    materialId: "acoustic_gypsum_board"
  },
  {
    aliases: ["gypsum board", "gypsum", "plasterboard", "drywall", "alcipan", "gkb"],
    materialId: "gypsum_board"
  },
  {
    aliases: ["high density rockwool", "high density mineral wool", "dense rockwool"],
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

const DESCRIBED_TARGET_OUTPUT_ALIASES: readonly {
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
  { aliases: ["l prime n w", "l n w", "lnw field"], outputId: "L'n,w" },
  { aliases: ["iic"], outputId: "IIC" },
  { aliases: ["aiic"], outputId: "AIIC" }
];

function fail(input: {
  code: string;
  errors: readonly string[];
  name?: WorkbenchV2CalculatorAssistantToolName;
  statusCode: number;
}): WorkbenchV2CalculatorAssistantPreviewResult {
  return {
    code: input.code,
    errors: input.errors,
    mutates: false,
    name: input.name ?? SNAPSHOT_TOOL_NAME,
    ok: false,
    previewOnly: true,
    statusCode: input.statusCode
  };
}

function parsePositiveNumber(value: string): number | null {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function parseOptionalPositiveNumber(value: string): number | undefined {
  return parsePositiveNumber(value) ?? undefined;
}

function parseOptionalFiniteNumber(value: string): number | undefined {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseTargetOutputs(value: unknown): RequestedOutputId[] | null {
  if (value === undefined) {
    return null;
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(value.filter((entry): entry is RequestedOutputId => typeof entry === "string" && WORKBENCH_V2_ASSISTANT_OUTPUT_IDS.has(entry as RequestedOutputId)))
  );
}

function formatDb(value: number): string {
  return Number.isInteger(value) ? `${value} dB` : `${value.toFixed(1)} dB`;
}

function parseLayerIndexList(value: string, rowCount: number): number[] | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  const indices: number[] = [];
  for (const token of trimmed.split(/[,\s]+/u).filter(Boolean)) {
    if (!/^\d+$/u.test(token)) {
      return undefined;
    }

    const oneBasedIndex = Number(token);
    if (!Number.isSafeInteger(oneBasedIndex) || oneBasedIndex < 1 || oneBasedIndex > rowCount) {
      return undefined;
    }

    const zeroBasedIndex = oneBasedIndex - 1;
    if (!indices.includes(zeroBasedIndex)) {
      indices.push(zeroBasedIndex);
    }
  }

  return indices.length ? indices : undefined;
}

function buildWallTopologyFromContext(
  context: WorkbenchV2ContextDraft,
  rowCount: number
): NonNullable<EstimateRequest["airborneContext"]>["wallTopology"] | undefined {
  if (context.wallTopologyMode === "auto") {
    return undefined;
  }

  const topology: NonNullable<EstimateRequest["airborneContext"]>["wallTopology"] = {
    topologyMode: context.wallTopologyMode
  };
  const sideA = parseLayerIndexList(context.wallSideALeafLayerIndices, rowCount);
  const cavity1 = parseLayerIndexList(context.wallCavity1LayerIndices, rowCount);
  const sideB = parseLayerIndexList(context.wallSideBLeafLayerIndices, rowCount);
  const cavity1DepthMm = parseOptionalPositiveNumber(context.wallCavity1DepthMm);

  if (sideA) topology.sideALeafLayerIndices = sideA;
  if (cavity1) topology.cavity1LayerIndices = cavity1;
  if (sideB) topology.sideBLeafLayerIndices = sideB;
  if (cavity1DepthMm) topology.cavity1DepthMm = cavity1DepthMm;
  if (context.wallCavity1FillCoverage !== "unknown") topology.cavity1FillCoverage = context.wallCavity1FillCoverage;
  if (context.wallCavity1AbsorptionClass !== "unknown") topology.cavity1AbsorptionClass = context.wallCavity1AbsorptionClass;
  if (context.wallSupportTopology !== "unknown") topology.supportTopology = context.wallSupportTopology;

  return topology;
}

function buildEstimatePayload(input: {
  context: WorkbenchV2ContextDraft;
  customMaterials: readonly MaterialDefinition[];
  layers: readonly WorkbenchV2DraftLayer[];
  mode: WorkbenchV2StudyMode;
  selectedOutputs: readonly RequestedOutputId[];
}): EstimateRequest | null {
  const requestLayers: EstimateRequest["layers"] = [];

  for (const layer of input.layers) {
    const thicknessMm = parsePositiveNumber(layer.thicknessMm);

    if (!thicknessMm) {
      return null;
    }

    requestLayers.push({
      floorRole: input.mode === "floor" ? (layer.role as FloorRole) : undefined,
      materialId: layer.materialId,
      thicknessMm
    });
  }

  if (!requestLayers.length || !input.selectedOutputs.length) {
    return null;
  }

  const airborneContext: EstimateRequest["airborneContext"] = {};
  const panelWidthMm = parseOptionalPositiveNumber(input.context.panelWidthMm);
  const panelHeightMm = parseOptionalPositiveNumber(input.context.panelHeightMm);
  const receivingRoomVolumeM3 = parseOptionalPositiveNumber(input.context.receivingRoomVolumeM3);
  const receivingRoomRt60S = parseOptionalPositiveNumber(input.context.receivingRoomRt60S);
  const sourceRoomVolumeM3 = parseOptionalPositiveNumber(input.context.sourceRoomVolumeM3);
  const junctionCouplingLengthM = parseOptionalPositiveNumber(input.context.junctionCouplingLengthM);
  const supportSpacingMm = parseOptionalPositiveNumber(input.context.supportSpacingMm);
  const wallTopology = input.mode === "wall" ? buildWallTopologyFromContext(input.context, input.layers.length) : undefined;

  if (input.context.airborneMode !== "element_lab") airborneContext.contextMode = input.context.airborneMode;
  if (panelWidthMm) airborneContext.panelWidthMm = panelWidthMm;
  if (panelHeightMm) airborneContext.panelHeightMm = panelHeightMm;
  if (receivingRoomVolumeM3) airborneContext.receivingRoomVolumeM3 = receivingRoomVolumeM3;
  if (receivingRoomRt60S) airborneContext.receivingRoomRt60S = receivingRoomRt60S;
  if (sourceRoomVolumeM3) airborneContext.sourceRoomVolumeM3 = sourceRoomVolumeM3;
  if (junctionCouplingLengthM) airborneContext.junctionCouplingLengthM = junctionCouplingLengthM;
  if (supportSpacingMm) airborneContext.studSpacingMm = supportSpacingMm;
  if (input.context.airborneResilientBarSideCount !== "auto") airborneContext.resilientBarSideCount = input.context.airborneResilientBarSideCount;
  if (input.context.flankingJunctionClass !== "unknown") airborneContext.flankingJunctionClass = input.context.flankingJunctionClass;
  if (input.context.conservativeFlankingAssumption !== "unknown") airborneContext.conservativeFlankingAssumption = input.context.conservativeFlankingAssumption;
  if (input.context.buildingPredictionOutputBasis !== "unknown") airborneContext.buildingPredictionOutputBasis = input.context.buildingPredictionOutputBasis;
  if (wallTopology) airborneContext.wallTopology = wallTopology;

  const impactFieldContext: EstimateRequest["impactFieldContext"] = {};
  const fieldKDb = parseOptionalFiniteNumber(input.context.fieldKDb);
  const ciDb = parseOptionalFiniteNumber(input.context.ciDb);
  const ci50_2500Db = parseOptionalFiniteNumber(input.context.ci50_2500Db);
  const impactReceivingRoomVolumeM3 = parseOptionalPositiveNumber(input.context.impactReceivingRoomVolumeM3);

  if (fieldKDb !== undefined) impactFieldContext.fieldKDb = fieldKDb;
  if (ciDb !== undefined) impactFieldContext.ciDb = ciDb;
  if (ci50_2500Db !== undefined) impactFieldContext.ci50_2500Db = ci50_2500Db;
  if (impactReceivingRoomVolumeM3) impactFieldContext.receivingRoomVolumeM3 = impactReceivingRoomVolumeM3;

  const floorImpactContext: EstimateRequest["floorImpactContext"] = {};
  const loadBasisKgM2 = parseOptionalPositiveNumber(input.context.loadBasisKgM2);
  const resilientLayerDynamicStiffnessMNm3 = parseOptionalPositiveNumber(input.context.resilientLayerDynamicStiffnessMNm3);

  if (loadBasisKgM2) floorImpactContext.loadBasisKgM2 = loadBasisKgM2;
  if (resilientLayerDynamicStiffnessMNm3) floorImpactContext.resilientLayerDynamicStiffnessMNm3 = resilientLayerDynamicStiffnessMNm3;

  const payload: EstimateRequest = {
    calculator: "dynamic",
    layers: requestLayers,
    targetOutputs: [...input.selectedOutputs]
  };

  if (Object.keys(airborneContext).length) payload.airborneContext = airborneContext;
  if (Object.keys(impactFieldContext).length) payload.impactFieldContext = impactFieldContext;
  if (input.mode === "floor" && Object.keys(floorImpactContext).length) payload.floorImpactContext = floorImpactContext;
  if (input.customMaterials.length) payload.materialCatalog = [...input.customMaterials];

  return payload;
}

function localTasks(input: {
  materialById: ReadonlyMap<string, MaterialDefinition>;
  selectedOutputs: readonly RequestedOutputId[];
  snapshot: WorkbenchV2ProjectSnapshot;
}): WorkbenchV2CalculatorAssistantTask[] {
  const tasks: WorkbenchV2CalculatorAssistantTask[] = [];

  if (!input.snapshot.layers.length) {
    tasks.push({
      detail: "Add at least one construction layer before running the calculator.",
      id: "missing-layer",
      label: "No layers",
      source: "workbench_snapshot"
    });
  }

  if (!input.selectedOutputs.length) {
    tasks.push({
      detail: "Choose at least one requested output before running the calculator.",
      id: "missing-output",
      label: "No output selected",
      source: "workbench_snapshot"
    });
  }

  for (const [index, layer] of input.snapshot.layers.entries()) {
    if (!input.materialById.has(layer.materialId)) {
      tasks.push({
        detail: `Layer ${index + 1} references material "${layer.materialId}", which is not in the current catalog.`,
        id: `missing-material-${layer.id}`,
        label: "Missing material",
        source: "workbench_snapshot"
      });
    }

    if (!parsePositiveNumber(layer.thicknessMm)) {
      tasks.push({
        detail: `Layer ${index + 1} needs a positive thickness before calculation.`,
        id: `missing-thickness-${layer.id}`,
        label: "Missing thickness",
        source: "workbench_snapshot"
      });
    }
  }

  return tasks;
}

function missingInputLabel(fieldId: string): string {
  const normalized = fieldId.toLowerCase().replace(/[^a-z0-9]/gu, "");

  if (normalized.includes("loadbasiskgm2")) return "Load basis";
  if (normalized.includes("resilientlayerdynamicstiffnessmnm3")) return "Dynamic stiffness";
  if (normalized.includes("fieldkdb")) return "K correction";
  if (normalized.includes("ci502500db")) return "CI,50-2500";
  if (normalized.includes("cidb")) return "CI";
  if (normalized.includes("receivingroomvolumem3")) return "Receiving-room volume";
  if (normalized.includes("receivingroomrt60s")) return "RT60";
  if (normalized.includes("panelwidthmm")) return "Panel width";
  if (normalized.includes("panelheightmm")) return "Panel height";
  if (normalized.includes("sourceroomvolumem3")) return "Source-room volume";
  if (normalized.includes("supportspacingmm") || normalized.includes("studspacingmm")) return "Support spacing";
  if (normalized.includes("resilientbarsidecount")) return "Resilient bar side count";
  if (normalized.includes("walltopology") || normalized.includes("leafgrouping")) return "Wall topology";

  return fieldId.split(".").at(-1) ?? fieldId;
}

function routeTasks(result: AssemblyCalculation): WorkbenchV2CalculatorAssistantTask[] {
  const boundary = result.acousticAnswerBoundary;

  if (!boundary || boundary.origin !== "needs_input") {
    return [];
  }

  const missingPhysicalInputs: string[] = Array.isArray(boundary.missingPhysicalInputs)
    ? boundary.missingPhysicalInputs.filter((fieldId: unknown): fieldId is string => typeof fieldId === "string")
    : [];

  return Array.from(new Set<string>(missingPhysicalInputs)).map((fieldId) => ({
    detail: `Calculator route requires ${fieldId}.`,
    id: `route-${fieldId}`,
    label: missingInputLabel(fieldId),
    source: "calculator_route" as const
  }));
}

function readOutputValue(result: AssemblyCalculation, outputId: RequestedOutputId): number | null {
  switch (outputId) {
    case "AIIC":
      return result.impact?.AIIC ?? null;
    case "C":
      return result.ratings.iso717.C;
    case "CI":
      return result.impact?.CI ?? null;
    case "CI,50-2500":
      return result.impact?.CI50_2500 ?? null;
    case "Ctr":
      return result.ratings.iso717.Ctr;
    case "DeltaLw":
      return result.impact?.DeltaLw ?? null;
    case "Dn,A":
      return result.ratings.field?.DnA ?? result.metrics.estimatedDnADb ?? null;
    case "DnT,A":
      return result.ratings.field?.DnTA ?? result.metrics.estimatedDnTADb ?? null;
    case "DnT,A,k":
      return result.ratings.field?.DnTAk ?? result.metrics.estimatedDnTAkDb ?? null;
    case "DnT,w":
      return result.ratings.field?.DnTw ?? result.metrics.estimatedDnTwDb ?? null;
    case "Dn,w":
      return result.ratings.field?.DnW ?? result.metrics.estimatedDnWDb ?? null;
    case "IIC":
      return result.impact?.IIC ?? null;
    case "L'n,w":
      return result.impact?.LPrimeNW ?? null;
    case "L'nT,50":
      return result.impact?.LPrimeNT50 ?? null;
    case "L'nT,w":
      return result.impact?.LPrimeNTw ?? null;
    case "Ln,w":
      return result.impact?.LnW ?? null;
    case "Ln,w+CI":
      return result.impact?.LnWPlusCI ?? null;
    case "LnT,A":
      return result.impact?.LnTA ?? null;
    case "Rw":
      return result.ratings.iso717.Rw;
    case "R'w":
      return result.ratings.field?.RwPrime ?? result.metrics.estimatedRwPrimeDb ?? null;
    case "STC":
      return result.ratings.astmE413.STC;
    case "HIIC":
    case "ISR":
    case "LIIC":
    case "LIR":
    case "NISR":
      return null;
  }
}

function outputDetail(result: AssemblyCalculation, outputId: RequestedOutputId, status: WorkbenchV2CalculatorAssistantOutputStatus): string {
  const boundary = result.acousticAnswerBoundary;

  if (status === "live") {
    return "Calculated";
  }

  if (boundary?.origin === "needs_input" && boundary.unsupportedOutputs.includes(outputId)) {
    const labels = routeTasks(result)
      .slice(0, 2)
      .map((task) => task.label);
    return labels.length ? `Needs ${labels.join(", ")}` : "Needs input";
  }

  if (result.unsupportedTargetOutputs.includes(outputId) || boundary?.unsupportedOutputs.includes(outputId)) {
    return "Unsupported for route";
  }

  return "No value";
}

function outputRows(
  result: AssemblyCalculation,
  selectedOutputs: readonly RequestedOutputId[]
): WorkbenchV2CalculatorAssistantOutputRow[] {
  return selectedOutputs.map((outputId) => {
    const value = readOutputValue(result, outputId);
    const hasDisplayValue = typeof value === "number" && Number.isFinite(value);
    const boundary = result.acousticAnswerBoundary;
    const isNeedsInput = boundary?.origin === "needs_input" && boundary.unsupportedOutputs.includes(outputId);
    const isUnsupported = result.unsupportedTargetOutputs.includes(outputId) || boundary?.unsupportedOutputs.includes(outputId);
    const isSupported = result.supportedTargetOutputs.includes(outputId);
    let status: WorkbenchV2CalculatorAssistantOutputStatus = "pending";

    if (isNeedsInput) {
      status = "needs_input";
    } else if (isUnsupported) {
      status = "unsupported";
    } else if (isSupported && hasDisplayValue) {
      status = "live";
    }

    return {
      detail: outputDetail(result, outputId, status),
      label: outputId,
      status,
      value: status === "live" && hasDisplayValue ? formatDb(value) : "--"
    };
  });
}

function statusFromRows(input: {
  rows: readonly WorkbenchV2CalculatorAssistantOutputRow[];
  tasks: readonly WorkbenchV2CalculatorAssistantTask[];
}): WorkbenchV2CalculatorAssistantPreviewStatus {
  if (input.tasks.length || input.rows.some((row) => row.status === "needs_input")) {
    return "needs_input";
  }

  return input.rows.some((row) => row.status === "live") ? "ready" : "unsupported";
}

function calculationSummary(input: {
  rows: readonly WorkbenchV2CalculatorAssistantOutputRow[];
  selectedOutputs: readonly RequestedOutputId[];
  status: WorkbenchV2CalculatorAssistantPreviewStatus;
}): WorkbenchV2CalculatorAssistantPreview["calculationSummary"] {
  const primary = input.rows.find((row) => row.status === "live") ?? input.rows[0];

  return {
    primaryOutput: primary?.label,
    primaryValueLabel: primary?.status === "live" ? primary.value : undefined,
    selectedOutputs: [...input.selectedOutputs],
    status: input.status
  };
}

function engineSummary(result: AssemblyCalculation): NonNullable<WorkbenchV2CalculatorAssistantPreview["engineSummary"]> {
  const boundary = result.acousticAnswerBoundary;

  return {
    acousticBoundary: boundary
      ? {
          method: boundary.method,
          missingPhysicalInputs: boundary.missingPhysicalInputs,
          origin: boundary.origin,
          requiredInputs: boundary.requiredInputs,
          route: boundary.route,
          unsupportedOutputs: boundary.unsupportedOutputs
        }
      : undefined,
    calculatorId: result.calculatorId,
    calculatorLabel: result.calculatorLabel,
    method: result.metrics.method,
    supportedImpactOutputs: result.supportedImpactOutputs,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedImpactOutputs: result.unsupportedImpactOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs,
    warnings: result.warnings
  };
}

function toJsonValue(value: unknown): JsonValue | undefined {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    Array.isArray(value) ||
    (typeof value === "object" && value !== null)
  ) {
    return value as JsonValue;
  }

  return undefined;
}

function normalizeDescribedText(value: string): string {
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
  const normalizedAlias = normalizeDescribedText(alias);
  return normalizedAlias.length > 0 && ` ${haystack} `.includes(` ${normalizedAlias} `);
}

function readDescription(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function parseDescribedMode(input: {
  description: string;
  mode?: unknown;
}): WorkbenchV2StudyMode | null {
  if (input.mode !== undefined) {
    return input.mode === "wall" || input.mode === "floor" ? input.mode : null;
  }

  const normalized = normalizeDescribedText(input.description);
  const mentionsFloor = ["floor", "ceiling", "slab", "doseme", "tavan"].some((alias) => containsNormalizedAlias(normalized, alias));
  const mentionsWall = ["wall", "duvar"].some((alias) => containsNormalizedAlias(normalized, alias));

  return mentionsFloor && !mentionsWall ? "floor" : "wall";
}

function inferTargetOutputsFromDescription(input: {
  description: string;
  mode: WorkbenchV2StudyMode;
}): RequestedOutputId[] {
  const normalized = normalizeDescribedText(input.description);
  const outputIds: RequestedOutputId[] = [];

  for (const definition of DESCRIBED_TARGET_OUTPUT_ALIASES) {
    if (definition.aliases.some((alias) => containsNormalizedAlias(normalized, alias)) && !outputIds.includes(definition.outputId)) {
      outputIds.push(definition.outputId);
    }
  }

  return outputIds.length ? outputIds : input.mode === "floor" ? ["Ln,w"] : ["Rw"];
}

function describedPendingRows(input: {
  detail: string;
  selectedOutputs: readonly RequestedOutputId[];
}): WorkbenchV2CalculatorAssistantOutputRow[] {
  return input.selectedOutputs.map((outputId) => ({
    detail: input.detail,
    label: outputId,
    status: "pending",
    value: "--"
  }));
}

function describedNeedsInputResult(input: {
  description: string;
  mode: WorkbenchV2StudyMode;
  selectedOutputs: readonly RequestedOutputId[];
  tasks: readonly WorkbenchV2CalculatorAssistantTask[];
}): WorkbenchV2CalculatorAssistantPreviewResult {
  const rows = describedPendingRows({
    detail: "Pending until the described layer configuration is complete.",
    selectedOutputs: input.selectedOutputs
  });

  return {
    mutates: false,
    name: DESCRIBED_LAYER_TOOL_NAME,
    ok: true,
    preview: {
      calculationSummary: calculationSummary({
        rows,
        selectedOutputs: input.selectedOutputs,
        status: "needs_input"
      }),
      describedConfiguration: {
        description: input.description,
        layers: [],
        parser: "deterministic_wall_layer_description_v1",
        warnings: []
      },
      outputRows: rows,
      requestedSnapshot: {
        customMaterialCount: 0,
        layerCount: 0,
        mode: input.mode,
        name: "Described layer configuration",
        selectedOutputs: [...input.selectedOutputs]
      },
      tasks: input.tasks
    },
    previewOnly: true
  };
}

function splitDescribedLayerSegments(description: string): string[] {
  return description
    .replace(/\bmm\s*,\s*(?=\d)/giu, "mm + ")
    .replace(/([^\d]),\s*(?=\d+(?:[.,]\d+)?\s*(?:mm|millimeters?|millimetres?|milimetre|milimeter)\b)/giu, "$1 + ")
    .replace(/\b(?:and|ve)\b/giu, "+")
    .split(/[+;\n]+/u)
    .map((segment) => segment.trim())
    .filter((segment) => DESCRIBED_LAYER_THICKNESS_PATTERN.test(segment));
}

function cleanMaterialPhrase(segment: string, thicknessText: string): string {
  return segment
    .replace(thicknessText, " ")
    .replace(/^\s*\d+\s*x\s*/iu, " ")
    .replace(/\b(?:calculate|calculator|configuration|config|estimate|for|from|hesapla|hesap|icin|ile|katman|layer|layers|stack|wall|duvar|thick|kalin|kalinlikta|kalinliginda)\b/giu, " ")
    .replace(/\b(?:rw|stc|ctr|dnt|dn|ln|iic|aiic)\b/giu, " ")
    .replace(/^\s*\d+\s*x\s*/iu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function buildMaterialAliasEntries(materials: readonly MaterialDefinition[]): {
  alias: string;
  material: MaterialDefinition;
}[] {
  const materialById = new Map(materials.map((material) => [material.id, material]));
  const entries: { alias: string; material: MaterialDefinition }[] = [];

  for (const definition of DESCRIBED_LAYER_MATERIAL_ALIASES) {
    const material = materialById.get(definition.materialId);
    if (!material) {
      continue;
    }

    for (const alias of definition.aliases) {
      entries.push({
        alias: normalizeDescribedText(alias),
        material
      });
    }
  }

  for (const material of materials) {
    entries.push({
      alias: normalizeDescribedText(material.name),
      material
    });
    entries.push({
      alias: normalizeDescribedText(material.id.replace(/_/gu, " ")),
      material
    });
  }

  return entries
    .filter((entry) => entry.alias.length > 1)
    .sort((left, right) => right.alias.length - left.alias.length);
}

function matchDescribedMaterial(input: {
  aliasEntries: readonly {
    alias: string;
    material: MaterialDefinition;
  }[];
  materialPhrase: string;
}): MaterialDefinition | null {
  const normalized = normalizeDescribedText(input.materialPhrase);
  const matches = input.aliasEntries.filter((entry) => containsNormalizedAlias(normalized, entry.alias));
  const first = matches[0];

  if (!first) {
    return null;
  }

  const sameLengthDifferentMaterial = matches.some((match) =>
    match.alias.length === first.alias.length && match.material.id !== first.material.id
  );

  return sameLengthDifferentMaterial ? null : first.material;
}

function roleForDescribedWallLayer(input: {
  index: number;
  parsed: readonly {
    material: MaterialDefinition;
  }[];
}): string {
  const absorberIndices = input.parsed
    .map((layer, index) => layer.material.acoustic?.behavior === "porous_absorber" ? index : -1)
    .filter((index) => index >= 0);

  if (absorberIndices.length > 0) {
    const firstAbsorberIndex = absorberIndices[0]!;
    const lastAbsorberIndex = absorberIndices[absorberIndices.length - 1]!;

    if (input.index < firstAbsorberIndex) {
      return "side_a";
    }

    if (input.index > lastAbsorberIndex) {
      return "side_b";
    }

    return absorberIndices.includes(input.index) ? "cavity" : "core";
  }

  if (input.index === 0) {
    return "side_a";
  }

  if (input.index === input.parsed.length - 1) {
    return "side_b";
  }

  return "core";
}

function readDescribedLayerRepeatCount(input: {
  segment: string;
  thicknessIndex: number;
}): {
  count: number;
  error?: string;
} {
  const prefix = input.segment.slice(0, input.thicknessIndex);
  if (!prefix.trim()) {
    return {
      count: 1
    };
  }

  const repeatPrefix = prefix
    .replace(/\b(?:calculate|calculator|configuration|config|estimate|for|from|hesapla|hesap|icin|ile|katman|layer|layers|stack|wall|duvar|thick|kalin|kalinlikta|kalinliginda)\b/giu, " ")
    .replace(/\b(?:rw|stc|ctr|dnt|dn|ln|iic|aiic)\b/giu, " ")
    .replace(/\s+/gu, " ")
    .trim();
  const repeatMatch = /^\s*(\d+)\s*x\s*$/iu.exec(repeatPrefix);
  if (!repeatMatch) {
    return {
      count: 1
    };
  }

  const count = Number.parseInt(repeatMatch[1] ?? "", 10);
  if (!Number.isInteger(count) || count < 1 || count > 8) {
    return {
      count: 1,
      error: "Layer repeat count must be between 1 and 8."
    };
  }

  return {
    count
  };
}

function parseDescribedWallLayers(input: {
  description: string;
  materials: readonly MaterialDefinition[];
}): {
  errors: readonly string[];
  layers: WorkbenchV2DraftLayer[];
  parsedLayers: NonNullable<WorkbenchV2CalculatorAssistantPreview["describedConfiguration"]>["layers"];
} {
  const segments = splitDescribedLayerSegments(input.description);
  const aliasEntries = buildMaterialAliasEntries(input.materials);
  const errors: string[] = [];
  const parsed: {
    material: MaterialDefinition;
    materialPhrase: string;
    thicknessMm: number;
  }[] = [];

  if (!segments.length) {
    return {
      errors: ["Describe each layer with a positive thickness in mm, for example: 12.5 mm gypsum board + 50 mm rockwool + 100 mm concrete."],
      layers: [],
      parsedLayers: []
    };
  }

  for (const [index, segment] of segments.entries()) {
    const thicknessMatch = DESCRIBED_LAYER_THICKNESS_PATTERN.exec(segment);
    const thicknessMm = thicknessMatch ? parsePositiveNumber(thicknessMatch[1].replace(",", ".")) : null;
    const repeat = thicknessMatch
      ? readDescribedLayerRepeatCount({
        segment,
        thicknessIndex: thicknessMatch.index
      })
      : { count: 1 };
    const materialPhrase = thicknessMatch ? cleanMaterialPhrase(segment, thicknessMatch[0]) : "";
    const material = materialPhrase ? matchDescribedMaterial({ aliasEntries, materialPhrase }) : null;

    if (!thicknessMm) {
      errors.push(`Layer ${index + 1} needs a positive thickness in mm.`);
      continue;
    }

    if (repeat.error) {
      errors.push(`Layer ${index + 1}: ${repeat.error}`);
      continue;
    }

    if (!material) {
      errors.push(`Layer ${index + 1} material could not be matched from "${materialPhrase || segment}".`);
      continue;
    }

    for (let repeatIndex = 0; repeatIndex < repeat.count; repeatIndex += 1) {
      parsed.push({
        material,
        materialPhrase,
        thicknessMm
      });
    }
  }

  if (errors.length) {
    return {
      errors,
      layers: [],
      parsedLayers: []
    };
  }

  const layers = parsed.map((layer, index) => ({
    id: `assistant-described-layer-${index + 1}`,
    materialId: layer.material.id,
    role: roleForDescribedWallLayer({
      index,
      parsed
    }),
    thicknessMm: String(layer.thicknessMm)
  }));

  return {
    errors: [],
    layers,
    parsedLayers: parsed.map((layer, index) => ({
      materialId: layer.material.id,
      materialName: layer.material.name,
      role: layers[index]?.role ?? "core",
      thicknessMm: layer.thicknessMm
    }))
  };
}

export function previewWorkbenchV2CalculatorSnapshot(input: {
  snapshot: unknown;
  targetOutputs?: unknown;
}): WorkbenchV2CalculatorAssistantPreviewResult {
  const parsed = parseWorkbenchV2ProjectSnapshot(toJsonValue(input.snapshot));

  if (!parsed.snapshot) {
    return fail({
      code: "invalid_workbench_v2_calculator_snapshot",
      errors: ["Calculator preview requires a valid Workbench V2 snapshot."],
      statusCode: 400
    });
  }

  const overrideOutputs = parseTargetOutputs(input.targetOutputs);
  if (overrideOutputs !== null && overrideOutputs.length === 0) {
    return fail({
      code: "invalid_workbench_v2_calculator_outputs",
      errors: ["Calculator preview targetOutputs must include at least one supported Workbench V2 output id."],
      statusCode: 400
    });
  }

  const selectedOutputs = overrideOutputs ?? parsed.snapshot.selectedOutputs;
  const materials = buildResolvedMaterialCatalog(parsed.snapshot.customMaterials);
  const materialById = new Map(materials.map((material) => [material.id, material]));
  const tasks = localTasks({
    materialById,
    selectedOutputs,
    snapshot: parsed.snapshot
  });
  const requestedSnapshot = {
    customMaterialCount: parsed.snapshot.customMaterials.length,
    layerCount: parsed.snapshot.layers.length,
    mode: parsed.snapshot.mode,
    name: parsed.snapshot.name,
    selectedOutputs: [...selectedOutputs]
  };

  if (tasks.length) {
    return {
      mutates: false,
      name: SNAPSHOT_TOOL_NAME,
      ok: true,
      preview: {
        calculationSummary: calculationSummary({
          rows: selectedOutputs.map((outputId) => ({
            detail: "Pending until snapshot inputs are complete.",
            label: outputId,
            status: "pending",
            value: "--"
          })),
          selectedOutputs,
          status: "needs_input"
        }),
        outputRows: selectedOutputs.map((outputId) => ({
          detail: "Pending until snapshot inputs are complete.",
          label: outputId,
          status: "pending",
          value: "--"
        })),
        requestedSnapshot,
        tasks
      },
      previewOnly: true
    };
  }

  const estimatePayload = buildEstimatePayload({
    context: parsed.snapshot.context,
    customMaterials: parsed.snapshot.customMaterials,
    layers: parsed.snapshot.layers,
    mode: parsed.snapshot.mode,
    selectedOutputs
  });

  if (!estimatePayload) {
    return fail({
      code: "invalid_workbench_v2_calculator_payload",
      errors: ["Calculator preview could not build an estimate payload from the Workbench V2 snapshot."],
      statusCode: 400
    });
  }

  const result = calculateAssembly(estimatePayload.layers, {
    airborneContext: estimatePayload.airborneContext ?? null,
    calculator: estimatePayload.calculator ?? undefined,
    catalog: estimatePayload.materialCatalog ?? [],
    exactImpactSource: estimatePayload.exactImpactSource ?? null,
    floorImpactContext: estimatePayload.floorImpactContext ?? null,
    impactFieldContext: estimatePayload.impactFieldContext ?? null,
    impactPredictorInput: estimatePayload.impactPredictorInput ?? null,
    steelFloorFormulaSurface: estimatePayload.steelFloorFormulaSurface ?? null,
    targetOutputs: estimatePayload.targetOutputs ?? []
  });
  const rows = outputRows(result, selectedOutputs);
  const allTasks = [...routeTasks(result)];
  const status = statusFromRows({ rows, tasks: allTasks });

  return {
    mutates: false,
    name: SNAPSHOT_TOOL_NAME,
    ok: true,
    preview: {
      calculationSummary: calculationSummary({
        rows,
        selectedOutputs,
        status
      }),
      engineSummary: engineSummary(result),
      estimatePayload,
      outputRows: rows,
      requestedSnapshot,
      tasks: allTasks
    },
    previewOnly: true
  };
}

export function previewDescribedLayerConfiguration(input: {
  description: unknown;
  mode?: unknown;
  targetOutputs?: unknown;
}): WorkbenchV2CalculatorAssistantPreviewResult {
  const description = readDescription(input.description);
  if (!description) {
    return fail({
      code: "invalid_described_layer_configuration",
      errors: ["Calculator preview requires a non-empty layer configuration description."],
      name: DESCRIBED_LAYER_TOOL_NAME,
      statusCode: 400
    });
  }

  const mode = parseDescribedMode({
    description,
    mode: input.mode
  });
  if (!mode) {
    return fail({
      code: "invalid_described_layer_configuration_mode",
      errors: ["Described calculator preview mode must be wall or floor."],
      name: DESCRIBED_LAYER_TOOL_NAME,
      statusCode: 400
    });
  }

  const overrideOutputs = parseTargetOutputs(input.targetOutputs);
  if (overrideOutputs !== null && overrideOutputs.length === 0) {
    return fail({
      code: "invalid_described_layer_configuration_outputs",
      errors: ["Described calculator preview targetOutputs must include at least one supported Workbench V2 output id."],
      name: DESCRIBED_LAYER_TOOL_NAME,
      statusCode: 400
    });
  }
  const selectedOutputs = overrideOutputs ?? inferTargetOutputsFromDescription({ description, mode });

  if (mode !== "wall") {
    return describedNeedsInputResult({
      description,
      mode,
      selectedOutputs,
      tasks: [
        {
          detail: "Described calculator preview currently supports wall layer configurations. Use a Workbench V2 snapshot for floor calculator context until floor description parsing is implemented.",
          id: "unsupported-described-floor-configuration",
          label: "Floor description unsupported",
          source: "described_layer_configuration"
        }
      ]
    });
  }

  const materials = buildResolvedMaterialCatalog([]);
  const parsed = parseDescribedWallLayers({
    description,
    materials
  });

  if (parsed.errors.length) {
    return describedNeedsInputResult({
      description,
      mode,
      selectedOutputs,
      tasks: parsed.errors.map((error, index) => ({
        detail: error,
        id: `described-layer-parse-${index + 1}`,
        label: "Layer description needs input",
        source: "described_layer_configuration"
      }))
    });
  }

  const snapshot = buildWorkbenchV2ProjectSnapshot({
    context: WORKBENCH_V2_DEFAULT_CONTEXT,
    customMaterials: [],
    id: "assistant-described-layer-calculator-preview",
    layers: parsed.layers,
    materialVisualOverrides: [],
    mode,
    name: "Described wall layer configuration",
    savedAtIso: "2026-06-17T00:00:00.000Z",
    selectedLayerId: parsed.layers[0]?.id ?? null,
    selectedOutputs
  });
  const result = previewWorkbenchV2CalculatorSnapshot({
    snapshot,
    targetOutputs: selectedOutputs
  });

  if (!result.ok) {
    return fail({
      code: result.code,
      errors: result.errors,
      name: DESCRIBED_LAYER_TOOL_NAME,
      statusCode: result.statusCode
    });
  }

  return {
    mutates: false,
    name: DESCRIBED_LAYER_TOOL_NAME,
    ok: true,
    preview: {
      ...result.preview,
      describedConfiguration: {
        description,
        layers: parsed.parsedLayers,
        parser: "deterministic_wall_layer_description_v1",
        warnings: []
      }
    },
    previewOnly: true
  };
}
