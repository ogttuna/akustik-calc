import {
  WORKBENCH_V2_DEFAULT_CONTEXT,
  buildWorkbenchV2ProjectSnapshot,
  type WorkbenchV2ContextDraft,
  type WorkbenchV2ProjectSnapshot
} from "./workbench-v2-project-snapshot";

export type WorkbenchV2CommonPresetSourceBasis = "lab_rw";

export type WorkbenchV2CommonPresetSourceReference = {
  basis: WorkbenchV2CommonPresetSourceBasis;
  metric: "Rw";
  note: string;
  sourceLabel: string;
  sourceUrl: string;
  targetValue: number;
  toleranceDb: number;
};

export type WorkbenchV2CommonPreset = {
  description: string;
  id: string;
  label: string;
  snapshot: WorkbenchV2ProjectSnapshot;
  sourceReferences: readonly WorkbenchV2CommonPresetSourceReference[];
  tags: readonly string[];
};

const COMMON_PRESET_SAVED_AT_ISO = "2026-06-15T00:00:00.000Z";

function buildCommonWallContext(input: {
  cavityAbsorptionClass: WorkbenchV2ContextDraft["wallCavity1AbsorptionClass"];
  cavityDepthMm: string;
  cavityFillCoverage: WorkbenchV2ContextDraft["wallCavity1FillCoverage"];
  cavityLayerIndices: string;
  sideALayerIndices: string;
  sideBLayerIndices: string;
}): WorkbenchV2ContextDraft {
  return {
    ...WORKBENCH_V2_DEFAULT_CONTEXT,
    airborneMode: "element_lab",
    supportSpacingMm: "600",
    wallCavity1AbsorptionClass: input.cavityAbsorptionClass,
    wallCavity1DepthMm: input.cavityDepthMm,
    wallCavity1FillCoverage: input.cavityFillCoverage,
    wallCavity1LayerIndices: input.cavityLayerIndices,
    wallSideALeafLayerIndices: input.sideALayerIndices,
    wallSideBLeafLayerIndices: input.sideBLayerIndices,
    wallSupportTopology: "single_shared_stud",
    wallTopologyMode: "double_leaf_framed"
  };
}

function buildCommonPreset(input: {
  description: string;
  id: string;
  label: string;
  snapshot: Omit<Parameters<typeof buildWorkbenchV2ProjectSnapshot>[0], "customMaterials" | "id" | "materialVisualOverrides" | "mode" | "name" | "savedAtIso">;
  sourceReferences: readonly WorkbenchV2CommonPresetSourceReference[];
  tags: readonly string[];
}): WorkbenchV2CommonPreset {
  return {
    description: input.description,
    id: input.id,
    label: input.label,
    snapshot: buildWorkbenchV2ProjectSnapshot({
      ...input.snapshot,
      customMaterials: [],
      id: input.id,
      materialVisualOverrides: [],
      mode: "wall",
      name: input.label,
      savedAtIso: COMMON_PRESET_SAVED_AT_ISO
    }),
    sourceReferences: input.sourceReferences,
    tags: input.tags
  };
}

export const WORKBENCH_V2_COMMON_PRESETS: readonly WorkbenchV2CommonPreset[] = [
  buildCommonPreset({
    description: "Double 12.5 mm gypsum boards each side on C75 studs with 70 mm mineral wool.",
    id: "common-preset-knauf-w112-gkb-deciwool-70-c75",
    label: "Knauf W112 double gypsum + mineral wool",
    snapshot: {
      context: buildCommonWallContext({
        cavityAbsorptionClass: "porous_absorptive",
        cavityDepthMm: "75",
        cavityFillCoverage: "full",
        cavityLayerIndices: "3, 4",
        sideALayerIndices: "1, 2",
        sideBLayerIndices: "5, 6"
      }),
      layers: [
        { id: "knauf-w112-gkb-layer-1", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" },
        { id: "knauf-w112-gkb-layer-2", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" },
        { id: "knauf-w112-gkb-layer-3", materialId: "air_gap", role: "cavity", thicknessMm: "5" },
        { id: "knauf-w112-gkb-layer-4", materialId: "glasswool_board", role: "cavity", thicknessMm: "70" },
        { id: "knauf-w112-gkb-layer-5", materialId: "gypsum_board", role: "side_b", thicknessMm: "12.5" },
        { id: "knauf-w112-gkb-layer-6", materialId: "gypsum_board", role: "side_b", thicknessMm: "12.5" }
      ],
      selectedLayerId: "knauf-w112-gkb-layer-1",
      selectedOutputs: ["Rw"]
    },
    sourceReferences: [
      {
        basis: "lab_rw",
        metric: "Rw",
        note: "UNI EN ISO 10140-2 / ISO 717-1 lab report 416702. Local preset uses generic gypsum board and glass wool board materials.",
        sourceLabel: "Knauf W112 416702",
        sourceUrl: "https://knauf.com/api/download-center/v1/assets/589f6519-4625-4e62-9fd2-3c9e8b71cfcd?download=true",
        targetValue: 50,
        toleranceDb: 4
      }
    ],
    tags: ["wall", "rw", "steel-stud", "gypsum", "mineral-wool", "knauf"]
  }),
  buildCommonPreset({
    description: "Double 12.5 mm high-mass board each side on C75 studs with 70 mm mineral wool.",
    id: "common-preset-knauf-w112-diamant-deciwool-70-c75",
    label: "Knauf W112 Diamant + mineral wool",
    snapshot: {
      context: buildCommonWallContext({
        cavityAbsorptionClass: "porous_absorptive",
        cavityDepthMm: "75",
        cavityFillCoverage: "full",
        cavityLayerIndices: "3, 4",
        sideALayerIndices: "1, 2",
        sideBLayerIndices: "5, 6"
      }),
      layers: [
        { id: "knauf-w112-diamant-layer-1", materialId: "diamond_board", role: "side_a", thicknessMm: "12.5" },
        { id: "knauf-w112-diamant-layer-2", materialId: "diamond_board", role: "side_a", thicknessMm: "12.5" },
        { id: "knauf-w112-diamant-layer-3", materialId: "air_gap", role: "cavity", thicknessMm: "5" },
        { id: "knauf-w112-diamant-layer-4", materialId: "glasswool_board", role: "cavity", thicknessMm: "70" },
        { id: "knauf-w112-diamant-layer-5", materialId: "diamond_board", role: "side_b", thicknessMm: "12.5" },
        { id: "knauf-w112-diamant-layer-6", materialId: "diamond_board", role: "side_b", thicknessMm: "12.5" }
      ],
      selectedLayerId: "knauf-w112-diamant-layer-1",
      selectedOutputs: ["Rw"]
    },
    sourceReferences: [
      {
        basis: "lab_rw",
        metric: "Rw",
        note: "UNI EN ISO 10140-2 / ISO 717-1 lab report 416889. Local preset maps Knauf Diamant to the catalog diamond board material.",
        sourceLabel: "Knauf W112 416889",
        sourceUrl: "https://knauf.com/api/download-center/v1/assets/f4c73202-1613-4953-b2dc-666f67ab1fab?download=true",
        targetValue: 55,
        toleranceDb: 4
      }
    ],
    tags: ["wall", "rw", "steel-stud", "high-mass-board", "mineral-wool", "knauf"]
  }),
  buildCommonPreset({
    description: "Single 15 mm acoustic board each side on a 70 mm C-stud with 50 mm glass mineral wool.",
    id: "common-preset-siniat-cs70r-15db-50g",
    label: "Siniat CS70R-15dB-50G acoustic board + glass wool",
    snapshot: {
      context: buildCommonWallContext({
        cavityAbsorptionClass: "porous_absorptive",
        cavityDepthMm: "70",
        cavityFillCoverage: "full",
        cavityLayerIndices: "2, 3",
        sideALayerIndices: "1",
        sideBLayerIndices: "4"
      }),
      layers: [
        { id: "siniat-cs70r-layer-1", materialId: "acoustic_gypsum_board", role: "side_a", thicknessMm: "15" },
        { id: "siniat-cs70r-layer-2", materialId: "air_gap", role: "cavity", thicknessMm: "20" },
        { id: "siniat-cs70r-layer-3", materialId: "glasswool_board", role: "cavity", thicknessMm: "50" },
        { id: "siniat-cs70r-layer-4", materialId: "acoustic_gypsum_board", role: "side_b", thicknessMm: "15" }
      ],
      selectedLayerId: "siniat-cs70r-layer-1",
      selectedOutputs: ["Rw"]
    },
    sourceReferences: [
      {
        basis: "lab_rw",
        metric: "Rw",
        note: "Official Siniat system page. Local preset maps Siniat dB Board to the catalog acoustic gypsum board material.",
        sourceLabel: "Siniat CS70R-15dB-50G",
        sourceUrl: "https://www.siniat.co.uk/en-gb/products-and-systems/systems/partition-systems/cs70r-15db-50g/",
        targetValue: 50,
        toleranceDb: 4
      }
    ],
    tags: ["wall", "rw", "steel-stud", "acoustic-board", "glass-wool", "siniat"]
  }),
  buildCommonPreset({
    description: "Single 15 mm acoustic board each side on 92 mm AcouStuds with an empty cavity.",
    id: "common-preset-bg-a206a281-soundbloc",
    label: "British Gypsum A206A281 SoundBloc single-layer wall",
    snapshot: {
      context: buildCommonWallContext({
        cavityAbsorptionClass: "none",
        cavityDepthMm: "92",
        cavityFillCoverage: "empty",
        cavityLayerIndices: "2",
        sideALayerIndices: "1",
        sideBLayerIndices: "3"
      }),
      layers: [
        { id: "bg-a206a281-layer-1", materialId: "acoustic_gypsum_board", role: "side_a", thicknessMm: "15" },
        { id: "bg-a206a281-layer-2", materialId: "air_gap", role: "cavity", thicknessMm: "92" },
        { id: "bg-a206a281-layer-3", materialId: "acoustic_gypsum_board", role: "side_b", thicknessMm: "15" }
      ],
      selectedLayerId: "bg-a206a281-layer-1",
      selectedOutputs: ["Rw"]
    },
    sourceReferences: [
      {
        basis: "lab_rw",
        metric: "Rw",
        note: "Official British Gypsum technical specification. Local preset uses generic acoustic gypsum board and explicit empty air cavity.",
        sourceLabel: "British Gypsum A206A281",
        sourceUrl: "https://www.british-gypsum.com/documents/technical-specification/british-gypsum-ts-a206a281-en.pdf",
        targetValue: 45,
        toleranceDb: 6
      }
    ],
    tags: ["wall", "rw", "steel-stud", "soundbloc", "empty-cavity", "british-gypsum"]
  })
];

export function findWorkbenchV2CommonPresetById(presetId: string): WorkbenchV2CommonPreset | null {
  return WORKBENCH_V2_COMMON_PRESETS.find((preset) => preset.id === presetId) ?? null;
}

export function formatWorkbenchV2CommonPresetSourceSummary(preset: WorkbenchV2CommonPreset): string {
  const source = preset.sourceReferences[0];

  if (!source) {
    return "Source metadata unavailable";
  }

  return `${source.sourceLabel} - ${source.metric} ${source.targetValue} dB`;
}
