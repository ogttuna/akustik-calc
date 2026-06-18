import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  WORKBENCH_V2_COMMON_PRESETS,
  findWorkbenchV2CommonPresetById,
  formatWorkbenchV2CommonPresetSourceSummary
} from "./workbench-v2-common-presets";
import { parseWorkbenchV2ProjectSnapshot } from "./workbench-v2-project-snapshot";

describe("workbench v2 common presets", () => {
  it("ships a bounded rw-only first seed pack", () => {
    expect(WORKBENCH_V2_COMMON_PRESETS).toHaveLength(4);
    expect(WORKBENCH_V2_COMMON_PRESETS.map((preset) => preset.id)).toEqual([
      "common-preset-knauf-w112-gkb-deciwool-70-c75",
      "common-preset-knauf-w112-diamant-deciwool-70-c75",
      "common-preset-siniat-cs70r-15db-50g",
      "common-preset-bg-a206a281-soundbloc"
    ]);

    for (const preset of WORKBENCH_V2_COMMON_PRESETS) {
      expect(preset.snapshot.mode).toBe("wall");
      expect(preset.snapshot.customMaterials).toEqual([]);
      expect(preset.snapshot.materialVisualOverrides).toEqual([]);
      expect(preset.snapshot.selectedOutputs).toEqual(["Rw"]);
      expect(preset.sourceReferences).toHaveLength(1);
      expect(preset.sourceReferences[0]).toMatchObject({
        basis: "lab_rw",
        metric: "Rw"
      });
    }
  });

  it("builds restorable snapshots with explicit wall topology context", () => {
    const parsedSnapshots = WORKBENCH_V2_COMMON_PRESETS.map((preset) => parseWorkbenchV2ProjectSnapshot(preset.snapshot));

    for (const parsed of parsedSnapshots) {
      expect(parsed.droppedCustomMaterials).toBe(0);
      expect(parsed.droppedVisualOverrides).toBe(0);
      expect(parsed.snapshot).not.toBeNull();
      expect(parsed.snapshot?.context.airborneMode).toBe("element_lab");
      expect(parsed.snapshot?.context.supportSpacingMm).toBe("600");
      expect(parsed.snapshot?.context.wallSupportTopology).toBe("single_shared_stud");
      expect(parsed.snapshot?.context.wallTopologyMode).toBe("double_leaf_framed");
      expect(parsed.snapshot?.context.wallSideALeafLayerIndices).not.toBe("");
      expect(parsed.snapshot?.context.wallCavity1LayerIndices).not.toBe("");
      expect(parsed.snapshot?.context.wallSideBLeafLayerIndices).not.toBe("");
    }

    expect(parsedSnapshots[0]?.snapshot?.context.wallCavity1DepthMm).toBe("75");
    expect(parsedSnapshots[2]?.snapshot?.context.wallCavity1DepthMm).toBe("70");
    expect(parsedSnapshots[3]?.snapshot?.context.wallCavity1FillCoverage).toBe("empty");
    expect(parsedSnapshots[3]?.snapshot?.context.wallCavity1AbsorptionClass).toBe("none");
  });

  it("finds common presets and formats compact source labels", () => {
    const preset = findWorkbenchV2CommonPresetById("common-preset-siniat-cs70r-15db-50g");

    expect(preset?.label).toBe("Siniat CS70R-15dB-50G acoustic board + glass wool");
    expect(formatWorkbenchV2CommonPresetSourceSummary(preset!)).toBe("Siniat CS70R-15dB-50G - Rw 50 dB");
    expect(findWorkbenchV2CommonPresetById("missing")).toBeNull();
  });

  it("keeps common presets out of engine and storage concerns", () => {
    const source = readFileSync(new URL("./workbench-v2-common-presets.ts", import.meta.url), "utf8");

    expect(source).not.toContain("@dynecho/engine");
    expect(source).not.toContain("fetch(");
    expect(source).not.toContain("/api/workbench-v2");
  });
});
