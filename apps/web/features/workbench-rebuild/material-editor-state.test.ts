import { describe, expect, it } from "vitest";

import {
  buildMaterialDefinitionFromDraft,
  buildMaterialVisualOverride,
  countMaterialUsage,
  createDefaultMaterialVisualDraft,
  createEmptyMaterialEditorDraft,
  createMaterialEditorDraftFromMaterial,
  createSeedCopyDraft,
  getMaterialVisualReadabilityWarning,
  isBuiltInMaterial,
  isValidMaterialVisualDraft,
  normalizeHexColor,
  parseMaterialEditorPersistedState,
  removeCustomMaterial,
  serializeMaterialEditorPersistedState,
  upsertCustomMaterial,
  validateMaterialEditorDraft
} from "./material-editor-state";

const seedMaterial = {
  category: "insulation" as const,
  densityKgM3: 45,
  id: "rockwool",
  name: "Rockwool",
  tags: ["wool", "insulation"]
};

describe("material editor state", () => {
  it("builds a custom porous absorber from comma-decimal draft values", () => {
    const draft = {
      ...createEmptyMaterialEditorDraft(),
      absorberClass: "porous_absorptive" as const,
      behavior: "porous_absorber" as const,
      category: "insulation" as const,
      densityKgM3: "45,5",
      flowResistivityPaSM2: "12000,25",
      name: "Local mineral wool"
    };

    expect(validateMaterialEditorDraft(draft, []).errors).toEqual({});

    const material = buildMaterialDefinitionFromDraft({
      draft,
      existingMaterials: []
    });

    expect(material.id).toBe("custom_local_mineral_wool");
    expect(material.densityKgM3).toBe(45.5);
    expect(material.acoustic?.behavior).toBe("porous_absorber");
    expect(material.acoustic?.flowResistivityPaSM2).toBe(12000.25);
    expect(material.tags).toContain("custom-workbench-material");
  });

  it("keeps seed material copies on derived custom ids", () => {
    const draft = createSeedCopyDraft(seedMaterial, [seedMaterial]);
    const material = buildMaterialDefinitionFromDraft({
      draft,
      existingMaterials: [seedMaterial]
    });

    expect(isBuiltInMaterial(seedMaterial)).toBe(true);
    expect(material.id).not.toBe(seedMaterial.id);
    expect(material.id).toMatch(/^custom_/u);
    expect(material.name).toContain("custom");
  });

  it("preserves ids while editing existing custom materials", () => {
    const base = buildMaterialDefinitionFromDraft({
      draft: {
        ...createEmptyMaterialEditorDraft(),
        category: "finish",
        densityKgM3: "720",
        name: "Local cork finish"
      },
      existingMaterials: []
    });
    const draft = {
      ...createMaterialEditorDraftFromMaterial(base),
      densityKgM3: "740",
      name: "Local cork finish edited"
    };
    const edited = buildMaterialDefinitionFromDraft({
      currentMaterialId: base.id,
      draft,
      existingMaterials: [base]
    });

    expect(edited.id).toBe(base.id);
    expect(edited.name).toBe("Local cork finish edited");
    expect(edited.densityKgM3).toBe(740);
  });

  it("separates save errors from route-readiness warnings", () => {
    const porousDraft = {
      ...createEmptyMaterialEditorDraft(),
      behavior: "porous_absorber" as const,
      category: "insulation" as const,
      densityKgM3: "40",
      name: "No flow absorber"
    };
    const invalidDraft = {
      ...porousDraft,
      densityKgM3: "0",
      lossFactor: "2"
    };

    expect(validateMaterialEditorDraft(porousDraft, []).errors).toEqual({});
    expect(validateMaterialEditorDraft(porousDraft, []).warnings.flowResistivityPaSM2).toContain(
      "This porous absorber material is missing flow resistivity"
    );
    expect(validateMaterialEditorDraft(invalidDraft, []).errors.densityKgM3).toMatch(/greater than zero/iu);
    expect(validateMaterialEditorDraft(invalidDraft, []).errors.lossFactor).toMatch(/no more than 1/iu);
  });

  it("normalizes visual colors and rejects invalid values", () => {
    expect(normalizeHexColor("#abc")).toBe("#aabbcc");
    expect(normalizeHexColor("#AABBCC")).toBe("#aabbcc");
    expect(normalizeHexColor("not-a-color")).toBeNull();
    expect(isValidMaterialVisualDraft({ fillColor: "#ffffff", patternColor: "#222222", sideColor: "#eeeeee", strokeColor: "#111111" })).toBe(true);
    expect(isValidMaterialVisualDraft({ fillColor: "white", patternColor: "#222222", sideColor: "#eeeeee", strokeColor: "#111111" })).toBe(false);

    expect(
      buildMaterialVisualOverride(
        "custom_local",
        { fillColor: "#abc", patternColor: "#345678", sideColor: "#cde", strokeColor: "#123456" },
        "2026-06-12T10:00:00.000Z"
      )
    ).toEqual({
      fillColor: "#aabbcc",
      materialId: "custom_local",
      patternColor: "#345678",
      sideColor: "#ccddee",
      strokeColor: "#123456",
      updatedAtIso: "2026-06-12T10:00:00.000Z"
    });
  });

  it("starts visual drafts from material cue defaults", () => {
    expect(createDefaultMaterialVisualDraft(seedMaterial)).toEqual({
      fillColor: "#d5bf78",
      patternColor: "#8e7440",
      sideColor: "#b59a58",
      strokeColor: "#806638"
    });
    expect(createDefaultMaterialVisualDraft({ category: "finish", id: "gypsum_board", name: "Gypsum Board", tags: ["board"] })).toEqual({
      fillColor: "#ddd8cf",
      patternColor: "#8f8477",
      sideColor: "#c6baab",
      strokeColor: "#938779"
    });
    expect(createDefaultMaterialVisualDraft({ category: "mass", densityKgM3: 2400, id: "concrete", name: "Concrete", tags: ["structural"] })).toEqual({
      fillColor: "#ced1d0",
      patternColor: "#7f878a",
      sideColor: "#b5bbbd",
      strokeColor: "#747d82"
    });
    expect(createDefaultMaterialVisualDraft({ category: "mass", densityKgM3: 2350, id: "composite_steel_deck", name: "Composite Steel Deck", tags: ["steel-deck"] })).toEqual({
      fillColor: "#c6ccd0",
      patternColor: "#747f87",
      sideColor: "#a7afb5",
      strokeColor: "#66737c"
    });
    expect(createDefaultMaterialVisualDraft({ category: "finish", densityKgM3: 1400, id: "local_finish", name: "Local finish", tags: ["finish"] })).toEqual({
      fillColor: "#d8d6cf",
      patternColor: "#85857d",
      sideColor: "#c0bdb4",
      strokeColor: "#74766f"
    });
  });

  it("stores sparse visual overrides and returns null when values match defaults", () => {
    const defaults = createDefaultMaterialVisualDraft(seedMaterial);

    expect(buildMaterialVisualOverride(seedMaterial.id, defaults, "2026-06-12T10:00:00.000Z", defaults)).toBeNull();
    expect(
      buildMaterialVisualOverride(
        seedMaterial.id,
        {
          ...defaults,
          fillColor: "#abc"
        },
        "2026-06-12T10:00:00.000Z",
        defaults
      )
    ).toEqual({
      fillColor: "#aabbcc",
      materialId: seedMaterial.id,
      updatedAtIso: "2026-06-12T10:00:00.000Z"
    });
  });

  it("warns when visual colors make layer edges hard to read", () => {
    expect(
      getMaterialVisualReadabilityWarning({
        fillColor: "#eeeeee",
        patternColor: "#eeeeee",
        sideColor: "#ededed",
        strokeColor: "#eeeeee"
      })
    ).toMatch(/hard to read/iu);
    expect(
      getMaterialVisualReadabilityWarning({
        fillColor: "#d5bf78",
        patternColor: "#8e7440",
        sideColor: "#b59a58",
        strokeColor: "#806638"
      })
    ).toBeNull();
  });

  it("upserts, removes, and counts custom material usage", () => {
    const material = buildMaterialDefinitionFromDraft({
      draft: {
        ...createEmptyMaterialEditorDraft(),
        category: "finish",
        densityKgM3: "700",
        name: "Local finish"
      },
      existingMaterials: []
    });
    const updated = { ...material, name: "Local finish updated" };

    expect(upsertCustomMaterial([], material)).toEqual([material]);
    expect(upsertCustomMaterial([material], updated)).toEqual([updated]);
    expect(removeCustomMaterial([updated], updated.id)).toEqual([]);
    expect(countMaterialUsage([{ materialId: updated.id }, { materialId: "concrete" }, { materialId: updated.id }], updated.id)).toBe(2);
  });

  it("round-trips persisted editor state and normalizes restored visual colors", () => {
    const material = buildMaterialDefinitionFromDraft({
      draft: {
        ...createEmptyMaterialEditorDraft(),
        category: "finish",
        densityKgM3: "710",
        name: "Persisted finish"
      },
      existingMaterials: []
    });
    const serialized = serializeMaterialEditorPersistedState({
      customMaterials: [material],
      materialVisualOverrides: [
        {
          fillColor: "#abc",
          materialId: material.id,
          strokeColor: "#123456",
          updatedAtIso: "2026-06-12T10:00:00.000Z"
        }
      ]
    });
    const parsed = parseMaterialEditorPersistedState(JSON.parse(serialized) as unknown);

    expect(parsed.malformed).toBe(false);
    expect(parsed.droppedCustomMaterials).toBe(0);
    expect(parsed.droppedVisualOverrides).toBe(0);
    expect(parsed.state.customMaterials).toEqual([material]);
    expect(parsed.state.materialVisualOverrides).toEqual([
      {
        fillColor: "#aabbcc",
        materialId: material.id,
        strokeColor: "#123456",
        updatedAtIso: "2026-06-12T10:00:00.000Z"
      }
    ]);
  });

  it("drops malformed persisted materials, seed-id collisions, duplicate ids, and invalid visuals", () => {
    const material = buildMaterialDefinitionFromDraft({
      draft: {
        ...createEmptyMaterialEditorDraft(),
        category: "finish",
        densityKgM3: "720",
        name: "Persisted cork"
      },
      existingMaterials: []
    });
    const parsed = parseMaterialEditorPersistedState({
      customMaterials: [
        material,
        { ...material, name: "Duplicate cork" },
        { ...material, id: "gypsum_board", name: "Seed collision" },
        { id: "broken" }
      ],
      materialVisualOverrides: [
        { fillColor: "#fff", materialId: material.id, updatedAtIso: "2026-06-12T10:00:00.000Z" },
        { fillColor: "#111111", materialId: material.id, updatedAtIso: "2026-06-12T10:01:00.000Z" },
        { fillColor: "white", materialId: "custom_invalid", updatedAtIso: "2026-06-12T10:02:00.000Z" },
        { fillColor: "#000000", materialId: "", updatedAtIso: "2026-06-12T10:03:00.000Z" }
      ]
    });

    expect(parsed.malformed).toBe(false);
    expect(parsed.droppedCustomMaterials).toBe(3);
    expect(parsed.droppedVisualOverrides).toBe(3);
    expect(parsed.state.customMaterials).toEqual([material]);
    expect(parsed.state.materialVisualOverrides).toEqual([
      {
        fillColor: "#ffffff",
        materialId: material.id,
        updatedAtIso: "2026-06-12T10:00:00.000Z"
      }
    ]);
  });

  it("treats non-object persisted state as malformed and restores empty state", () => {
    const parsed = parseMaterialEditorPersistedState(null);

    expect(parsed).toEqual({
      droppedCustomMaterials: 0,
      droppedVisualOverrides: 0,
      malformed: true,
      state: {
        customMaterials: [],
        materialVisualOverrides: []
      }
    });
  });
});
