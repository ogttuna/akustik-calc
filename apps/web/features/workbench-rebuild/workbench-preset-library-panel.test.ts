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
        onMeasuredRwDraftChange: noop,
        onMeasuredRwToleranceDraftChange: noop,
        onRetireMeasuredRwAnchor: noop,
        onSaveMeasuredRwAnchor: noop,
        onSavePreset: noop,
        onSelectPreset: noop,
        onUsePreset: noop,
        measuredRwDraft: "52",
        measuredRwToleranceDraft: "1",
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
          createdAtIso: "2026-06-15T10:10:00.000Z",
          id: "preset-2",
          kind: "wall",
          layerCount: 2,
          name: "Guest wall preset",
          updatedAtIso: "2026-06-15T10:15:00.000Z"
        },
        selectedPresetMeasuredRwAnchors: [],
        selectedPresetId: "preset-2",
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
    expect(html).toContain("Reference capture paused");
    expect(html).not.toContain("Measured lab Rw");
    expect(html).not.toContain("Save Rw reference");
    expect(html).toContain("Knauf W112 double gypsum + mineral wool");
    expect(html).toContain("Knauf W112 416702 - Rw 50 dB");
    expect(html).toContain("Use common template");
  });

  it("shows an active measured Rw reference instead of the duplicate save controls", () => {
    const html = renderToStaticMarkup(
      React.createElement(WorkbenchPresetLibraryPanel, {
        busy: false,
        canRenamePreset: true,
        commonPresets: [],
        measuredRwDraft: "",
        measuredRwToleranceDraft: "0",
        message: "1 saved",
        onCommonPresetSelect: noop,
        onCommonPresetUse: noop,
        onDeletePreset: noop,
        onDuplicatePreset: noop,
        onMeasuredRwDraftChange: noop,
        onMeasuredRwToleranceDraftChange: noop,
        onPresetDescriptionDraftChange: noop,
        onPresetNameDraftChange: noop,
        onPresetRenameDescriptionDraftChange: noop,
        onPresetRenameDraftChange: noop,
        onRenamePreset: noop,
        onRetireMeasuredRwAnchor: noop,
        onSaveMeasuredRwAnchor: noop,
        onSavePreset: noop,
        onSelectPreset: noop,
        onUsePreset: noop,
        presetDescriptionDraft: "",
        presetNameDraft: "",
        presetRenameDescriptionDraft: "",
        presetRenameDraft: "Measured wall",
        presets: [
          {
            createdAtIso: "2026-06-22T10:00:00.000Z",
            id: "preset-1",
            kind: "wall",
            layerCount: 3,
            name: "Measured wall",
            updatedAtIso: "2026-06-22T10:00:00.000Z"
          }
        ],
        selectedCommonPreset: null,
        selectedCommonPresetId: "",
        selectedPreset: {
          createdAtIso: "2026-06-22T10:00:00.000Z",
          id: "preset-1",
          kind: "wall",
          layerCount: 3,
          name: "Measured wall",
          updatedAtIso: "2026-06-22T10:00:00.000Z"
        },
        selectedPresetMeasuredRwAnchors: [
          {
            createdAtIso: "2026-06-22T10:00:30.000Z",
            createdFromPresetId: "preset-1",
            fingerprint: "dynecho:wall-rw-anchor:v1:fedcba0987654321",
            id: "anchor-retired",
            measurementMethodStandard: "ISO 10140-2",
            ratingStandard: "ISO 717-1",
            sourceLabel: "Old measured wall Rw",
            sourceStatus: "retired",
            toleranceDb: 1,
            updatedAtIso: "2026-06-22T10:00:45.000Z",
            valueDb: 51
          },
          {
            createdAtIso: "2026-06-22T10:01:00.000Z",
            createdFromPresetId: "preset-1",
            fingerprint: "dynecho:wall-rw-anchor:v1:1234567890abcdef",
            id: "anchor-1",
            measurementMethodStandard: "ISO 10140-2",
            ratingStandard: "ISO 717-1",
            sourceLabel: "Measured wall measured lab Rw",
            sourceStatus: "active",
            toleranceDb: 1,
            updatedAtIso: "2026-06-22T10:01:00.000Z",
            valueDb: 52
          }
        ],
        selectedPresetId: "preset-1",
        status: "idle"
      })
    );

    expect(html).toContain("Rw 52 dB +/-1");
    expect(html).toContain("Rw reference active");
    expect(html).toContain("1 retired Rw reference");
    expect(html).toContain("Retire Rw reference");
    expect(html).not.toContain("Save Rw reference");
  });

  it("shows retired measured Rw history while reference capture is paused", () => {
    const html = renderToStaticMarkup(
      React.createElement(WorkbenchPresetLibraryPanel, {
        busy: false,
        canRenamePreset: true,
        commonPresets: [],
        measuredRwDraft: "",
        measuredRwToleranceDraft: "0",
        message: "1 saved",
        onCommonPresetSelect: noop,
        onCommonPresetUse: noop,
        onDeletePreset: noop,
        onDuplicatePreset: noop,
        onMeasuredRwDraftChange: noop,
        onMeasuredRwToleranceDraftChange: noop,
        onPresetDescriptionDraftChange: noop,
        onPresetNameDraftChange: noop,
        onPresetRenameDescriptionDraftChange: noop,
        onPresetRenameDraftChange: noop,
        onRenamePreset: noop,
        onRetireMeasuredRwAnchor: noop,
        onSaveMeasuredRwAnchor: noop,
        onSavePreset: noop,
        onSelectPreset: noop,
        onUsePreset: noop,
        presetDescriptionDraft: "",
        presetNameDraft: "",
        presetRenameDescriptionDraft: "",
        presetRenameDraft: "Measured wall",
        presets: [
          {
            createdAtIso: "2026-06-22T10:00:00.000Z",
            id: "preset-1",
            kind: "wall",
            layerCount: 3,
            name: "Measured wall",
            updatedAtIso: "2026-06-22T10:00:00.000Z"
          }
        ],
        selectedCommonPreset: null,
        selectedCommonPresetId: "",
        selectedPreset: {
          createdAtIso: "2026-06-22T10:00:00.000Z",
          id: "preset-1",
          kind: "wall",
          layerCount: 3,
          name: "Measured wall",
          updatedAtIso: "2026-06-22T10:00:00.000Z"
        },
        selectedPresetMeasuredRwAnchors: [
          {
            createdAtIso: "2026-06-22T10:01:00.000Z",
            createdFromPresetId: "preset-1",
            fingerprint: "dynecho:wall-rw-anchor:v1:1234567890abcdef",
            id: "anchor-1",
            measurementMethodStandard: "ISO 10140-2",
            ratingStandard: "ISO 717-1",
            sourceLabel: "Measured wall measured lab Rw",
            sourceStatus: "retired",
            toleranceDb: 1,
            updatedAtIso: "2026-06-22T10:02:00.000Z",
            valueDb: 52
          }
        ],
        selectedPresetId: "preset-1",
        status: "idle"
      })
    );

    expect(html).toContain("1 retired Rw reference");
    expect(html).toContain("Reference capture paused");
    expect(html).not.toContain("Save Rw reference");
    expect(html).not.toContain("Rw reference active");
    expect(html).not.toContain("Retire Rw reference");
  });

  it("keeps route mutations out of the presentational preset panel", () => {
    const source = readFileSync(new URL("./workbench-preset-library-panel.tsx", import.meta.url), "utf8");

    expect(source).not.toContain("fetch(");
    expect(source).not.toContain("/api/workbench-v2");
  });

  it("wires measured Rw reference retirement through a confirmed parent route action", () => {
    const panelSource = readFileSync(new URL("./workbench-preset-library-panel.tsx", import.meta.url), "utf8");
    const workbenchSource = readFileSync(new URL("./calculator-workbench.tsx", import.meta.url), "utf8");

    expect(panelSource).toContain("onRetireMeasuredRwAnchor(activeRwReference.id)");
    expect(workbenchSource).toContain(
      'globalThis.confirm("Retire this measured Rw reference? It will no longer be used by calculator estimates.")'
    );
    expect(workbenchSource).toContain("async function retireSelectedWorkbenchPresetMeasuredRwAnchor(anchorId: string)");
    expect(workbenchSource).toContain('fetch(`/api/workbench-v2/measured-wall-rw-anchors/${encodeURIComponent(anchorId)}`');
    expect(workbenchSource).toContain('method: "DELETE"');
    expect(workbenchSource).toContain("setWorkbenchMeasuredAnchorRevision((current) => current + 1)");
  });
});
