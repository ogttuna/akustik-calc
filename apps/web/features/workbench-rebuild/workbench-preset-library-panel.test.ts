import { readFileSync } from "node:fs";

import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { WorkbenchPresetLibraryPanel } from "./workbench-preset-library-panel";
import { WORKBENCH_V2_COMMON_PRESETS } from "./workbench-v2-common-presets";

const noop = () => undefined;

describe("WorkbenchPresetLibraryPanel", () => {
  beforeEach(() => {
    vi.stubGlobal("React", React);
  });

  it("renders compact template save and reuse controls", () => {
    const html = renderToStaticMarkup(
      React.createElement(WorkbenchPresetLibraryPanel, {
        busy: false,
        canRenamePreset: true,
        commonPresets: WORKBENCH_V2_COMMON_PRESETS,
        message: "2 saved",
        onCommonPresetSelect: noop,
        onCommonPresetUse: noop,
        onClose: noop,
        onDeletePreset: noop,
        onDuplicatePreset: noop,
        onPresetDescriptionDraftChange: noop,
        onPresetNameDraftChange: noop,
        onPresetRenameDescriptionDraftChange: noop,
        onPresetRenameDraftChange: noop,
        onRenamePreset: noop,
        onSavePreset: noop,
        onSelectPreset: noop,
        onUsePreset: noop,
        presetDescriptionDraft: "Reusable guest wall",
        presetNameDraft: "Guest wall preset",
        presetRenameDescriptionDraft: "Reusable floor starter",
        presetRenameDraft: "Lobby slab preset",
        presets: [
          {
            createdAtIso: "2026-06-15T10:00:00.000Z",
            description: "Reusable floor starter",
            id: "preset-1",
            kind: "floor",
            layerCount: 3,
            name: "Lobby slab preset",
            updatedAtIso: "2026-06-15T10:05:00.000Z"
          },
          {
            createdAtIso: "2026-06-15T10:10:00.000Z",
            id: "preset-2",
            kind: "wall",
            layerCount: 2,
            name: "Guest wall preset",
            updatedAtIso: "2026-06-15T10:15:00.000Z"
          }
        ],
        selectedCommonPreset: WORKBENCH_V2_COMMON_PRESETS[0]!,
        selectedCommonPresetId: WORKBENCH_V2_COMMON_PRESETS[0]!.id,
        selectedPreset: {
          createdAtIso: "2026-06-15T10:00:00.000Z",
          description: "Reusable floor starter",
          id: "preset-1",
          kind: "floor",
          layerCount: 3,
          name: "Lobby slab preset",
          updatedAtIso: "2026-06-15T10:05:00.000Z"
        },
        selectedPresetId: "preset-1",
        status: "idle"
      })
    );

    expect(html).toContain("Layer templates");
    expect(html).toContain("2 saved");
    expect(html).toContain("My templates");
    expect(html).toContain("Common templates");
    expect(html).toContain("Template name");
    expect(html).toContain("Save template");
    expect(html).toContain("Lobby slab preset");
    expect(html).toContain("Reusable floor starter");
    expect(html).toContain("3 layers");
    expect(html).toContain("Use template");
    expect(html).toContain("Rename template");
    expect(html).toContain("Duplicate template");
    expect(html).toContain("Delete template");
    expect(html).toContain("Knauf W112 double gypsum + mineral wool");
    expect(html).toContain("Knauf W112 416702 - Rw 50 dB");
    expect(html).toContain("Use common template");
  });

  it("keeps route mutations out of the presentational preset panel", () => {
    const source = readFileSync(new URL("./workbench-preset-library-panel.tsx", import.meta.url), "utf8");

    expect(source).not.toContain("fetch(");
    expect(source).not.toContain("/api/workbench-v2");
  });
});
