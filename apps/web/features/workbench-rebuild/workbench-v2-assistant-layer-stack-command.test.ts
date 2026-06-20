import { describe, expect, it } from "vitest";

import { buildResolvedMaterialCatalog } from "./material-editor-state";
import {
  getWorkbenchV2AssistantLayerStackSignature,
  parseWorkbenchV2AssistantLayerStackApplyCommand
} from "./workbench-v2-assistant-layer-stack-command";

const materials = buildResolvedMaterialCatalog([]);

function parse(instruction: string) {
  return parseWorkbenchV2AssistantLayerStackApplyCommand({
    currentLayers: [
      { id: "existing-layer-1", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" },
      { id: "existing-layer-2", materialId: "rockwool", role: "cavity", thicknessMm: "50" },
      { id: "existing-layer-3", materialId: "gypsum_board", role: "side_b", thicknessMm: "12.5" }
    ],
    currentMode: "wall",
    currentSelectedOutputs: ["Rw"],
    idFactory: (index) => `assistant-test-layer-${index + 1}`,
    instruction,
    materials
  });
}

function parseWithCurrentLayers(instruction: string, currentLayers: Parameters<typeof parseWorkbenchV2AssistantLayerStackApplyCommand>[0]["currentLayers"]) {
  return parseWorkbenchV2AssistantLayerStackApplyCommand({
    currentLayers,
    currentMode: "wall",
    currentSelectedOutputs: ["Rw"],
    idFactory: (index) => `assistant-test-layer-${index + 1}`,
    instruction,
    materials
  });
}

describe("workbench v2 assistant layer stack command", () => {
  it("applies a simple explicit wall stack command without guessing thicknesses", () => {
    const result = parse("gypsium, rock wool, gypsum diz");

    expect(result.ok).toBe(true);
    expect(result.ok && result.commandKind).toBe("replace_stack");
    expect(result.ok && result.mode).toBe("wall");
    expect(result.ok && result.layers).toEqual([
      { id: "assistant-test-layer-1", materialId: "gypsum_board", role: "side_a", thicknessMm: "" },
      { id: "assistant-test-layer-2", materialId: "rockwool", role: "cavity", thicknessMm: "" },
      { id: "assistant-test-layer-3", materialId: "gypsum_board", role: "side_b", thicknessMm: "" }
    ]);
    expect(result.ok && result.contextPatch).toMatchObject({
      wallCavity1AbsorptionClass: "porous_absorptive",
      wallCavity1DepthMm: "",
      wallCavity1FillCoverage: "full",
      wallCavity1LayerIndices: "2",
      wallSideALeafLayerIndices: "1",
      wallSideBLeafLayerIndices: "3",
      wallTopologyMode: "double_leaf_framed"
    });
    expect(result.ok && result.tasks.map((task) => task.code)).toEqual([
      "assistant_layer_thickness_missing",
      "assistant_layer_thickness_missing",
      "assistant_layer_thickness_missing"
    ]);
  });

  it("applies explicit thicknesses and updates cavity depth", () => {
    const result = parse("12.5 mm gypsum + 50 mm rock wool + 12.5 mm gypsum diz");

    expect(result.ok).toBe(true);
    expect(result.ok && result.commandKind).toBe("replace_stack");
    expect(result.ok && result.layers.map((layer) => layer.thicknessMm)).toEqual(["12.5", "50", "12.5"]);
    expect(result.ok && result.contextPatch).toMatchObject({
      wallCavity1DepthMm: "50",
      wallCavity1LayerIndices: "2",
      wallSideALeafLayerIndices: "1",
      wallSideBLeafLayerIndices: "3"
    });
    expect(result.ok && result.tasks).toEqual([]);
    expect(result.ok && result.warnings).toEqual([]);
  });

  it("fills explicit draft thickness assumptions only when the instruction asks for them", () => {
    const result = parse("gypsium, rock wool, gypsum mantıklı kalınlıklarla diz");

    expect(result.ok).toBe(true);
    expect(result.ok && result.commandKind).toBe("replace_stack");
    expect(result.ok && result.layers.map((layer) => layer.thicknessMm)).toEqual(["12.5", "50", "12.5"]);
    expect(result.ok && result.tasks.map((task) => task.code)).toEqual([
      "assistant_layer_thickness_assumed",
      "assistant_layer_thickness_assumed",
      "assistant_layer_thickness_assumed"
    ]);
    expect(result.ok && result.warnings[0]).toContain("engineering-default draft values");
  });

  it("treats broad material selection and reasonable input wording as a usable stack command", () => {
    const result = parse(
      "1 tane gypsum board seç hangisi farketmez stacke en uygunu seç araya rockwool koy sonra bi tane daha aynı gypsumdan seç inputları da makul şekilde doldur bakalım"
    );

    expect(result.ok).toBe(true);
    expect(result.ok && result.commandKind).toBe("replace_stack");
    expect(result.ok && result.layers).toEqual([
      { id: "assistant-test-layer-1", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" },
      { id: "assistant-test-layer-2", materialId: "rockwool", role: "cavity", thicknessMm: "50" },
      { id: "assistant-test-layer-3", materialId: "gypsum_board", role: "side_b", thicknessMm: "12.5" }
    ]);
    expect(result.ok && result.contextPatch).toMatchObject({
      wallCavity1DepthMm: "50",
      wallCavity1LayerIndices: "2",
      wallSideALeafLayerIndices: "1",
      wallSideBLeafLayerIndices: "3",
      wallTopologyMode: "double_leaf_framed"
    });
    expect(result.ok && result.tasks.map((task) => task.code)).toEqual([
      "assistant_layer_thickness_assumed",
      "assistant_layer_thickness_assumed",
      "assistant_layer_thickness_assumed"
    ]);
  });

  it("does not mutate on layer phrases without explicit apply intent", () => {
    expect(parse("gypsum, rock wool, gypsum")).toEqual({
      code: "missing_apply_intent",
      message: "The stack was not changed because the instruction did not explicitly ask to apply or arrange layers.",
      ok: false
    });
  });

  it("rejects unknown material phrases before building a layer stack", () => {
    expect(parse("gypsum, mystery wool, gypsum diz")).toEqual({
      code: "unknown_material",
      message: 'Layer material "mystery wool" is not in the current material catalog.',
      ok: false
    });
  });

  it("uses explicit floor mode words only for floor stack role ordering", () => {
    const result = parse("floor concrete, geniemat, screed diz");

    expect(result.ok).toBe(true);
    expect(result.ok && result.mode).toBe("floor");
    expect(result.ok && result.layers).toEqual([
      { id: "assistant-test-layer-1", materialId: "concrete", role: "base_structure", thicknessMm: "" },
      { id: "assistant-test-layer-2", materialId: "geniemat_rst05", role: "resilient_layer", thicknessMm: "" },
      { id: "assistant-test-layer-3", materialId: "screed", role: "floating_screed", thicknessMm: "" }
    ]);
    expect(result.ok && result.contextPatch).toEqual({});
  });

  it("adds a resolved layer at the requested edge without replacing the stack", () => {
    const result = parse("üste 15 mm gypsum ekle");

    expect(result.ok).toBe(true);
    expect(result.ok && result.commandKind).toBe("add_layer");
    expect(result.ok && result.layers).toEqual([
      { id: "assistant-test-layer-1", materialId: "gypsum_board", role: "side_a", thicknessMm: "15" },
      { id: "existing-layer-1", materialId: "gypsum_board", role: "core", thicknessMm: "12.5" },
      { id: "existing-layer-2", materialId: "rockwool", role: "cavity", thicknessMm: "50" },
      { id: "existing-layer-3", materialId: "gypsum_board", role: "side_b", thicknessMm: "12.5" }
    ]);
    expect(result.ok && result.selectedLayerId).toBe("assistant-test-layer-1");
  });

  it("removes one-based layer references without touching other rows", () => {
    const result = parse("2. layerı sil");

    expect(result.ok).toBe(true);
    expect(result.ok && result.commandKind).toBe("remove_layer");
    expect(result.ok && result.layers.map((layer) => layer.id)).toEqual(["existing-layer-1", "existing-layer-3"]);
  });

  it("moves a material-matched layer to the middle", () => {
    const result = parse("rock wool'u ortaya taşı");

    expect(result.ok).toBe(true);
    expect(result.ok && result.commandKind).toBe("move_layer");
    expect(result.ok && result.layers.map((layer) => layer.materialId)).toEqual(["gypsum_board", "rockwool", "gypsum_board"]);
    expect(result.ok && result.selectedLayerId).toBe("existing-layer-2");
  });

  it("updates matching layer thicknesses without guessing material ids", () => {
    const result = parse("gypsumları 15 mm yap");

    expect(result.ok).toBe(true);
    expect(result.ok && result.commandKind).toBe("update_layer");
    expect(result.ok && result.layers.map((layer) => layer.thicknessMm)).toEqual(["15", "50", "15"]);
  });

  it("updates every visible layer with a relative thickness delta", () => {
    const result = parse("hepsinin kalınlığını 10 mm artır");

    expect(result.ok).toBe(true);
    expect(result.ok && result.commandKind).toBe("update_layer");
    expect(result.ok && result.layers.map((layer) => layer.thicknessMm)).toEqual(["22.5", "60", "22.5"]);
  });

  it("fills missing visible layer thicknesses with draft defaults when requested", () => {
    const result = parseWithCurrentLayers("ekrandaki layerların kalınlıklarını mantıklı şekilde gir", [
      { id: "blank-layer-1", materialId: "gypsum_board", role: "side_a", thicknessMm: "" },
      { id: "blank-layer-2", materialId: "rockwool", role: "cavity", thicknessMm: "" },
      { id: "blank-layer-3", materialId: "gypsum_board", role: "side_b", thicknessMm: "" }
    ]);

    expect(result.ok).toBe(true);
    expect(result.ok && result.commandKind).toBe("update_layer");
    expect(result.ok && result.layers.map((layer) => layer.thicknessMm)).toEqual(["12.5", "50", "12.5"]);
    expect(result.ok && result.contextPatch).toMatchObject({
      wallCavity1DepthMm: "50",
      wallCavity1LayerIndices: "2"
    });
    expect(result.ok && result.tasks.map((task) => task.code)).toEqual([
      "assistant_layer_thickness_assumed",
      "assistant_layer_thickness_assumed",
      "assistant_layer_thickness_assumed"
    ]);
  });

  it("sets selected calculator outputs without changing layer rows", () => {
    const result = parse("Rw ve STC seç");

    expect(result.ok).toBe(true);
    expect(result.ok && result.commandKind).toBe("set_outputs");
    expect(result.ok && result.layers.map((layer) => layer.id)).toEqual(["existing-layer-1", "existing-layer-2", "existing-layer-3"]);
    expect(result.ok && result.selectedOutputs).toEqual(["Rw", "STC"]);
  });

  it("sets explicit floor impact physical inputs without changing layer rows", () => {
    const result = parseWorkbenchV2AssistantLayerStackApplyCommand({
      currentLayers: [
        { id: "floor-layer-1", materialId: "concrete", role: "base_structure", thicknessMm: "150" },
        { id: "floor-layer-2", materialId: "geniemat_rst05", role: "resilient_layer", thicknessMm: "5" },
        { id: "floor-layer-3", materialId: "screed", role: "floating_screed", thicknessMm: "50" }
      ],
      currentMode: "floor",
      currentSelectedOutputs: ["Ln,w"],
      idFactory: (index) => `assistant-test-layer-${index + 1}`,
      instruction: "dynamic stiffness 15 MN/m3, load basis 200 kg/m2, room volume 50 m3 gir ve hesapla",
      materials
    });

    expect(result.ok).toBe(true);
    expect(result.ok && result.commandKind).toBe("set_context");
    expect(result.ok && result.previewRequested).toBe(true);
    expect(result.ok && result.layers.map((layer) => layer.id)).toEqual(["floor-layer-1", "floor-layer-2", "floor-layer-3"]);
    expect(result.ok && result.contextPatch).toEqual({
      impactReceivingRoomVolumeM3: "50",
      loadBasisKgM2: "200",
      resilientLayerDynamicStiffnessMNm3: "15"
    });
    expect(result.ok && result.tasks.map((task) => task.code)).toEqual([
      "assistant_context_resilientLayerDynamicStiffnessMNm3_updated",
      "assistant_context_loadBasisKgM2_updated",
      "assistant_context_impactReceivingRoomVolumeM3_updated"
    ]);
  });

  it("sets wall support spacing and building prediction context fields", () => {
    const result = parse("support spacing 600 mm, building mode, apparent basis ayarla");

    expect(result.ok).toBe(true);
    expect(result.ok && result.commandKind).toBe("set_context");
    expect(result.ok && result.layers.map((layer) => layer.id)).toEqual(["existing-layer-1", "existing-layer-2", "existing-layer-3"]);
    expect(result.ok && result.contextPatch).toMatchObject({
      airborneMode: "building_prediction",
      buildingPredictionOutputBasis: "apparent",
      supportSpacingMm: "600"
    });
  });

  it("sets signed CI companion inputs without treating CI,50-2500 as CI", () => {
    const result = parse("CI -1 ve CI,50-2500 4 gir");

    expect(result.ok).toBe(true);
    expect(result.ok && result.commandKind).toBe("set_context");
    expect(result.ok && result.contextPatch).toMatchObject({
      ci50_2500Db: "4",
      ciDb: "-1"
    });
  });

  it("rejects invalid physical context values before applying a patch", () => {
    expect(parse("dynamic stiffness -1 MN/m3 gir")).toEqual({
      code: "invalid_context_value",
      message: "Dynamic stiffness must be a positive number.",
      ok: false
    });
  });

  it("rejects unknown numeric context commands instead of guessing a field", () => {
    expect(parse("density 50 kg/m3 gir")).toEqual({
      code: "unknown_context_field",
      message: "No supported calculator context input could be read from the assistant command.",
      ok: false
    });
  });

  it("recognizes preview-only commands without claiming a layer mutation", () => {
    const result = parse("hesapla");

    expect(result.ok).toBe(true);
    expect(result.ok && result.commandKind).toBe("preview");
    expect(result.ok && result.previewRequested).toBe(true);
    expect(result.ok && result.layers.map((layer) => layer.id)).toEqual(["existing-layer-1", "existing-layer-2", "existing-layer-3"]);
  });

  it("generates bounded candidate stacks from the visible calculator stack without mutating it", () => {
    const result = parse("kombinasyon yap");

    expect(result.ok).toBe(true);
    expect(result.ok && result.commandKind).toBe("generate_candidates");
    expect(result.ok && result.layers.map((layer) => layer.id)).toEqual(["existing-layer-1", "existing-layer-2", "existing-layer-3"]);
    expect(result.ok && result.candidateStacks).toHaveLength(6);
    expect(result.ok && result.candidateStacks?.map((candidate) => candidate.label)).toEqual([
      "Current order",
      "Reversed order",
      "Rotated order",
      "Rotated reverse",
      "Front-middle swap",
      "Middle-back swap"
    ]);
    expect(result.ok && result.candidateStacks?.[0]?.layers.map((layer) => layer.materialId)).toEqual([
      "gypsum_board",
      "rockwool",
      "gypsum_board"
    ]);
    expect(result.ok && result.candidateStacks?.[1]?.layers.map((layer) => layer.materialId)).toEqual([
      "gypsum_board",
      "rockwool",
      "gypsum_board"
    ]);
    expect(result.ok && result.candidateStacks?.[2]?.layers.map((layer) => layer.materialId)).toEqual([
      "rockwool",
      "gypsum_board",
      "gypsum_board"
    ]);
    expect(result.ok && result.candidateStacks?.[3]?.layers.map((layer) => layer.materialId)).toEqual([
      "gypsum_board",
      "gypsum_board",
      "rockwool"
    ]);
    expect(result.ok && result.candidateStacks?.[0]?.mode).toBe("wall");
    expect(result.ok && result.candidateStacks?.[0]?.sourceLayerSignature).toBe(
      getWorkbenchV2AssistantLayerStackSignature(result.ok ? result.layers : [])
    );
    expect(result.ok && result.candidateStacks?.[0]?.contextPatch).toMatchObject({
      wallCavity1DepthMm: "50",
      wallCavity1LayerIndices: "2",
      wallSideALeafLayerIndices: "1",
      wallSideBLeafLayerIndices: "3"
    });
  });

  it("keeps missing thickness tasks visible on generated candidate stacks", () => {
    const result = parseWorkbenchV2AssistantLayerStackApplyCommand({
      currentLayers: [
        { id: "existing-layer-1", materialId: "gypsum_board", role: "side_a", thicknessMm: "" },
        { id: "existing-layer-2", materialId: "rockwool", role: "cavity", thicknessMm: "" },
        { id: "existing-layer-3", materialId: "gypsum_board", role: "side_b", thicknessMm: "" }
      ],
      currentMode: "wall",
      currentSelectedOutputs: ["Rw"],
      idFactory: (index) => `assistant-test-layer-${index + 1}`,
      instruction: "kombinasyon yap",
      materials
    });

    expect(result.ok).toBe(true);
    expect(result.ok && result.candidateStacks?.[0]?.tasks.map((task) => task.code)).toEqual([
      "assistant_layer_thickness_missing",
      "assistant_layer_thickness_missing",
      "assistant_layer_thickness_missing"
    ]);
  });

  it("can generate candidate stacks with requested draft thickness assumptions", () => {
    const result = parseWorkbenchV2AssistantLayerStackApplyCommand({
      currentLayers: [
        { id: "existing-layer-1", materialId: "gypsum_board", role: "side_a", thicknessMm: "" },
        { id: "existing-layer-2", materialId: "rockwool", role: "cavity", thicknessMm: "" },
        { id: "existing-layer-3", materialId: "gypsum_board", role: "side_b", thicknessMm: "" }
      ],
      currentMode: "wall",
      currentSelectedOutputs: ["Rw"],
      idFactory: (index) => `assistant-test-layer-${index + 1}`,
      instruction: "mantıklı kalınlıklarla farklı kombinasyonlar yap",
      materials
    });

    expect(result.ok).toBe(true);
    expect(result.ok && result.candidateStacks?.[0]?.layers.map((layer) => layer.thicknessMm)).toEqual([
      "12.5",
      "50",
      "12.5"
    ]);
    expect(result.ok && result.candidateStacks?.[0]?.tasks.map((task) => task.code)).toEqual([
      "assistant_layer_thickness_assumed",
      "assistant_layer_thickness_assumed",
      "assistant_layer_thickness_assumed"
    ]);
  });
});
