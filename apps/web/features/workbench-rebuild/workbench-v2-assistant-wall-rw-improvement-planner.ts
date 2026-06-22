import type { MaterialDefinition, RequestedOutputId } from "@dynecho/shared";

import {
  getWorkbenchV2AssistantLayerStackSignature,
  typicalWorkbenchV2AssistantThicknessMmForLayer,
  type WorkbenchV2AssistantLayerStackCandidateStack,
  type WorkbenchV2AssistantLayerStackCommandTask
} from "./workbench-v2-assistant-layer-stack-command";
import type {
  WorkbenchV2ContextDraft,
  WorkbenchV2DraftLayer,
  WorkbenchV2StudyMode
} from "./workbench-v2-project-snapshot";

export const WORKBENCH_WALL_RW_IMPROVEMENT_CANDIDATE_ID_PREFIX = "wall-rw-improvement-";

export type WorkbenchWallRwImprovementExpectedMechanism =
  | "added_mass"
  | "porous_cavity_damping"
  | "symmetric_boarding";

export type WorkbenchWallRwImprovementCandidateMetadata = {
  candidateId: string;
  expectedMechanism: WorkbenchWallRwImprovementExpectedMechanism;
  generatedBy: "wall_rw_improvement_planner_v1";
  objectiveMetric: "Rw";
  tradeoffs: readonly string[];
};

export type WorkbenchWallRwImprovementPlan = {
  candidateStacks: readonly WorkbenchV2AssistantLayerStackCandidateStack[];
  metadataByCandidateId: Readonly<Record<string, WorkbenchWallRwImprovementCandidateMetadata>>;
  mutatesSavedState: false;
  objective: {
    direction: "increase";
    metric: "Rw";
  };
  previewRequired: true;
  sourceLayerSignature: string;
  warnings: readonly string[];
};

export type WorkbenchWallRwImprovementPlannerInput = {
  candidateCap?: 1 | 2 | 3;
  constraints?: {
    maxAddedLayers?: number;
    maxAddedThicknessMm?: number;
  };
  context?: Partial<WorkbenchV2ContextDraft>;
  currentLayers: readonly WorkbenchV2DraftLayer[];
  idFactory?: (index: number) => string;
  materials: readonly MaterialDefinition[];
  mode: WorkbenchV2StudyMode;
  selectedOutputs?: readonly RequestedOutputId[];
};

export function isWorkbenchWallRwImprovementCandidateStack(
  candidate: WorkbenchV2AssistantLayerStackCandidateStack
): boolean {
  return candidate.candidateId.startsWith(WORKBENCH_WALL_RW_IMPROVEMENT_CANDIDATE_ID_PREFIX);
}

type CandidateDraft = {
  expectedMechanism: WorkbenchWallRwImprovementExpectedMechanism;
  label: string;
  layers: readonly WorkbenchV2DraftLayer[];
  tradeoffs: readonly string[];
};

const BOARD_MATERIAL_IDS = new Set([
  "acoustic_gypsum_board",
  "gypsum_board",
  "nrc_type_c_gypsum_board",
  "security_board",
  "silentboard"
]);
const POROUS_MATERIAL_IDS = new Set(["glasswool_board", "high_density_rockwool", "rockwool"]);

function materialById(materials: readonly MaterialDefinition[]): ReadonlyMap<string, MaterialDefinition> {
  return new Map(materials.map((material) => [material.id, material]));
}

function formatIndexList(indices: readonly number[]): string {
  return indices.map((index) => String(index + 1)).join(",");
}

function parsePositiveThicknessMm(value: string): number | null {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function formatThicknessMm(value: number): string {
  const rounded = Math.round(value * 1000) / 1000;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

function isBoardLayer(layer: WorkbenchV2DraftLayer): boolean {
  return BOARD_MATERIAL_IDS.has(layer.materialId);
}

function isPorousLayer(layer: WorkbenchV2DraftLayer, materials: ReadonlyMap<string, MaterialDefinition>): boolean {
  const material = materials.get(layer.materialId);
  return POROUS_MATERIAL_IDS.has(layer.materialId) || material?.acoustic?.behavior === "porous_absorber";
}

function cloneLayers(layers: readonly WorkbenchV2DraftLayer[]): WorkbenchV2DraftLayer[] {
  return layers.map((layer) => ({ ...layer }));
}

function firstMaterial(materials: ReadonlyMap<string, MaterialDefinition>, ids: readonly string[]): MaterialDefinition | null {
  for (const id of ids) {
    const material = materials.get(id);
    if (material) {
      return material;
    }
  }

  return null;
}

function sideWithFewerBoards(layers: readonly WorkbenchV2DraftLayer[]): "side_a" | "side_b" {
  const sideABoards = layers.filter((layer) => layer.role === "side_a" && isBoardLayer(layer)).length;
  const sideBBoards = layers.filter((layer) => layer.role === "side_b" && isBoardLayer(layer)).length;
  return sideABoards <= sideBBoards ? "side_a" : "side_b";
}

function insertionIndexForSide(layers: readonly WorkbenchV2DraftLayer[], side: "side_a" | "side_b"): number {
  const sideIndices = layers.flatMap((layer, index) => layer.role === side ? [index] : []);
  if (!sideIndices.length) {
    return side === "side_a" ? 0 : layers.length;
  }

  return side === "side_a" ? sideIndices[sideIndices.length - 1]! + 1 : sideIndices[sideIndices.length - 1]! + 1;
}

function createBoardLayer(input: {
  id: string;
  material: MaterialDefinition;
  role: "side_a" | "side_b";
}): WorkbenchV2DraftLayer {
  return {
    id: input.id,
    materialId: input.material.id,
    role: input.role,
    thicknessMm: formatThicknessMm(
      typicalWorkbenchV2AssistantThicknessMmForLayer({
        material: input.material,
        mode: "wall",
        role: input.role
      })
    )
  };
}

function addLayerAt(layers: readonly WorkbenchV2DraftLayer[], index: number, layer: WorkbenchV2DraftLayer): WorkbenchV2DraftLayer[] {
  return [
    ...layers.slice(0, index),
    layer,
    ...layers.slice(index)
  ];
}

function buildWallContextPatch(layers: readonly WorkbenchV2DraftLayer[]): Partial<WorkbenchV2ContextDraft> {
  const sideAIndices = layers.flatMap((layer, index) => layer.role === "side_a" ? [index] : []);
  const cavityIndices = layers.flatMap((layer, index) => layer.role === "cavity" ? [index] : []);
  const sideBIndices = layers.flatMap((layer, index) => layer.role === "side_b" ? [index] : []);
  const cavityDepthMm = cavityIndices.reduce(
    (sum, index) => sum + (parsePositiveThicknessMm(layers[index]?.thicknessMm ?? "") ?? 0),
    0
  );
  const hasCavity = cavityIndices.length > 0;

  return {
    wallCavity1AbsorptionClass: hasCavity ? "porous_absorptive" : "unknown",
    wallCavity1DepthMm: hasCavity && cavityDepthMm > 0 ? formatThicknessMm(cavityDepthMm) : "",
    wallCavity1FillCoverage: hasCavity ? "full" : "unknown",
    wallCavity1LayerIndices: formatIndexList(cavityIndices),
    wallSideALeafLayerIndices: formatIndexList(sideAIndices),
    wallSideBLeafLayerIndices: formatIndexList(sideBIndices),
    wallTopologyMode: hasCavity ? "double_leaf_framed" : "auto"
  };
}

function missingThicknessTasks(layers: readonly WorkbenchV2DraftLayer[]): WorkbenchV2AssistantLayerStackCommandTask[] {
  return layers.flatMap((layer, index) =>
    parsePositiveThicknessMm(layer.thicknessMm) === null
      ? [{
          code: "assistant_layer_thickness_missing",
          detail: `Layer ${index + 1} needs a positive thickness before calculator preview.`,
          label: `Layer ${index + 1}`,
          layerId: layer.id
        }]
      : []
  );
}

function candidateSignature(layers: readonly WorkbenchV2DraftLayer[]): string {
  return layers.map((layer) => `${layer.materialId}:${layer.role}:${layer.thicknessMm}`).join("|");
}

function buildCandidate(input: {
  candidateIndex: number;
  draft: CandidateDraft;
  sourceLayerSignature: string;
}): WorkbenchV2AssistantLayerStackCandidateStack {
  return {
    candidateId: `${WORKBENCH_WALL_RW_IMPROVEMENT_CANDIDATE_ID_PREFIX}${input.candidateIndex + 1}`,
    contextPatch: buildWallContextPatch(input.draft.layers),
    label: input.draft.label,
    layers: cloneLayers(input.draft.layers),
    mode: "wall",
    selectedLayerId: input.draft.layers[0]?.id ?? null,
    sourceLayerSignature: input.sourceLayerSignature,
    tasks: missingThicknessTasks(input.draft.layers),
    warnings: [
      "Planner candidate only; preview through the calculator before comparing Rw.",
      "No source, provider, or model-supplied dB value is attached to this candidate."
    ]
  };
}

export function planWorkbenchWallRwImprovementCandidates(
  input: WorkbenchWallRwImprovementPlannerInput
): WorkbenchWallRwImprovementPlan {
  const candidateCap = input.candidateCap ?? 3;
  const maxAddedLayers = input.constraints?.maxAddedLayers ?? 2;
  const maxAddedThicknessMm = input.constraints?.maxAddedThicknessMm ?? Number.POSITIVE_INFINITY;
  const sourceLayerSignature = getWorkbenchV2AssistantLayerStackSignature(input.currentLayers);
  const warnings: string[] = [];
  const drafts: CandidateDraft[] = [];
  const seen = new Set<string>();
  const materials = materialById(input.materials);
  const idFactory = input.idFactory ?? ((index: number) => `wall-rw-improvement-layer-${index + 1}`);
  let nextLayerIdIndex = 0;

  function pushDraft(draft: CandidateDraft) {
    if (drafts.length >= candidateCap) {
      return;
    }

    const signature = candidateSignature(draft.layers);
    if (seen.has(signature)) {
      return;
    }

    seen.add(signature);
    drafts.push(draft);
  }

  if (input.mode !== "wall") {
    warnings.push("Wall/Rw improvement planner only supports wall mode.");
  } else if (!input.currentLayers.length) {
    warnings.push("No visible wall layers are available for candidate planning.");
  } else {
    const addBoardMaterial = firstMaterial(materials, ["acoustic_gypsum_board", "gypsum_board"]);
    const acousticGypsum = materials.get("acoustic_gypsum_board");
    const genericGypsumIndex = input.currentLayers.findIndex((layer) => layer.materialId === "gypsum_board");
    const sideAExists = input.currentLayers.some((layer) => layer.role === "side_a");
    const sideBExists = input.currentLayers.some((layer) => layer.role === "side_b");
    const cavityExists = input.currentLayers.some((layer) => layer.role === "cavity");

    if (genericGypsumIndex >= 0 && acousticGypsum) {
      const layers = cloneLayers(input.currentLayers);
      layers[genericGypsumIndex] = {
        ...layers[genericGypsumIndex]!,
        materialId: acousticGypsum.id,
        thicknessMm: layers[genericGypsumIndex]!.thicknessMm.trim()
          ? layers[genericGypsumIndex]!.thicknessMm
          : formatThicknessMm(typicalWorkbenchV2AssistantThicknessMmForLayer({
              material: acousticGypsum,
              mode: "wall",
              role: layers[genericGypsumIndex]!.role
            }))
      };

      pushDraft({
        expectedMechanism: "added_mass",
        label: "Replace one gypsum board with acoustic gypsum",
        layers,
        tradeoffs: [
          "Keeps layer count unchanged.",
          "Requires explicit catalog mapping to acoustic gypsum.",
          "Preview is required before claiming an Rw change."
        ]
      });
    }

    if (addBoardMaterial && maxAddedLayers >= 1) {
      const side = sideWithFewerBoards(input.currentLayers);
      const addedLayer = createBoardLayer({
        id: idFactory(nextLayerIdIndex++),
        material: addBoardMaterial,
        role: side
      });

      if (parsePositiveThicknessMm(addedLayer.thicknessMm)! <= maxAddedThicknessMm) {
        const layers = addLayerAt(input.currentLayers, insertionIndexForSide(input.currentLayers, side), addedLayer);
        pushDraft({
          expectedMechanism: "added_mass",
          label: `Add ${addBoardMaterial.name} to ${side === "side_a" ? "side A" : "side B"}`,
          layers,
          tradeoffs: [
            "Adds mass and thickness to one side of the wall.",
            "May affect build-up depth and detailing.",
            "Preview is required before claiming an Rw change."
          ]
        });
      }
    }

    if (addBoardMaterial && maxAddedLayers >= 2 && sideAExists && sideBExists && cavityExists) {
      const sideALayer = createBoardLayer({
        id: idFactory(nextLayerIdIndex++),
        material: addBoardMaterial,
        role: "side_a"
      });
      const sideBLayer = createBoardLayer({
        id: idFactory(nextLayerIdIndex++),
        material: addBoardMaterial,
        role: "side_b"
      });
      const addedThickness = (parsePositiveThicknessMm(sideALayer.thicknessMm) ?? 0) +
        (parsePositiveThicknessMm(sideBLayer.thicknessMm) ?? 0);

      if (addedThickness <= maxAddedThicknessMm) {
        const withSideA = addLayerAt(input.currentLayers, insertionIndexForSide(input.currentLayers, "side_a"), sideALayer);
        const layers = addLayerAt(withSideA, insertionIndexForSide(withSideA, "side_b"), sideBLayer);
        pushDraft({
          expectedMechanism: "symmetric_boarding",
          label: `Add symmetric ${addBoardMaterial.name} boards`,
          layers,
          tradeoffs: [
            "Adds mass to both leaves instead of loading one side only.",
            "Increases total thickness and material count.",
            "Preview is required before claiming an Rw change."
          ]
        });
      }
    }

    const routeInputsLookReady = Boolean(
      input.context?.wallCavity1DepthMm?.trim() &&
      input.context?.supportSpacingMm?.trim()
    );
    const porousIndex = input.currentLayers.findIndex((layer) => layer.role === "cavity" && isPorousLayer(layer, materials));
    if (porousIndex >= 0 && routeInputsLookReady) {
      const currentThickness = parsePositiveThicknessMm(input.currentLayers[porousIndex]?.thicknessMm ?? "");
      if (currentThickness) {
        const layers = cloneLayers(input.currentLayers);
        layers[porousIndex] = {
          ...layers[porousIndex]!,
          thicknessMm: formatThicknessMm(currentThickness + Math.min(25, currentThickness * 0.5))
        };
        pushDraft({
          expectedMechanism: "porous_cavity_damping",
          label: "Increase porous cavity absorber thickness",
          layers,
          tradeoffs: [
            "Uses only existing porous absorber material.",
            "Requires route inputs such as cavity depth and support spacing to be reviewed.",
            "Preview is required before claiming an Rw change."
          ]
        });
      }
    } else if (porousIndex >= 0) {
      warnings.push("Porous absorber thickness candidate skipped because cavity depth/support spacing context is incomplete.");
    }
  }

  const candidateStacks = drafts.map((draft, candidateIndex) =>
    buildCandidate({
      candidateIndex,
      draft,
      sourceLayerSignature
    })
  );
  const metadataByCandidateId = Object.fromEntries(
    candidateStacks.map((candidate, index) => [
      candidate.candidateId,
      {
        candidateId: candidate.candidateId,
        expectedMechanism: drafts[index]!.expectedMechanism,
        generatedBy: "wall_rw_improvement_planner_v1" as const,
        objectiveMetric: "Rw" as const,
        tradeoffs: drafts[index]!.tradeoffs
      }
    ])
  );

  return {
    candidateStacks,
    metadataByCandidateId,
    mutatesSavedState: false,
    objective: {
      direction: "increase",
      metric: "Rw"
    },
    previewRequired: true,
    sourceLayerSignature,
    warnings
  };
}
