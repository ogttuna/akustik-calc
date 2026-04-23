import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { getPresetById } from "./preset-definitions";
import { MODE_PRESETS } from "./simple-workbench-constants";
import { SimpleWorkbenchToolbar } from "./simple-workbench-toolbar";

describe("simple workbench toolbar", () => {
  it("renders grouped scenario presets with an inline empty-start option", () => {
    const selectedPreset = getPresetById("heavy_concrete_impact_floor");
    const html = renderToStaticMarkup(
      createElement(SimpleWorkbenchToolbar, {
        airborneContextMode: "element_lab",
        exportReady: true,
        isExportingPdf: false,
        isServerProjectBusy: false,
        modePresets: MODE_PRESETS.floor.map(getPresetById),
        onContextModeChange: vi.fn(),
        onExportBrandedDocx: vi.fn(),
        onExportBrandedPdf: vi.fn(),
        onExportSimpleDocx: vi.fn(),
        onExportSimplePdf: vi.fn(),
        onLoadServerProject: vi.fn(),
        onOpenPdfSetup: vi.fn(),
        onPresetChange: vi.fn(),
        onRefreshServerProjects: vi.fn(),
        onSelectedServerProjectChange: vi.fn(),
        onStartEmpty: vi.fn(),
        onReset: vi.fn(),
        onStudyModeChange: vi.fn(),
        onSyncServerProject: vi.fn(),
        onToggleTheme: vi.fn(),
        readyOutputCount: 2,
        rowCount: 4,
        selectedPreset,
        selectedServerProjectId: "",
        serverProjectOptions: [],
        serverProjectStatusLabel: "Browser-local",
        studyMode: "floor",
        theme: "light"
      })
    );

    expect(html).toContain('aria-label="Load sample rows"');
    expect(html).toContain("Example Rows (Optional)");
    expect(html).toContain('<option value="__start_empty__">Start empty</option>');
    expect(html).toContain("Edit Simple PDF");
    expect(html).toContain("Simple DOCX");
    expect(html).toContain("Server Project");
    expect(html).toContain('aria-label="Refresh server projects"');
    expect(html).toContain('aria-label="Load server project"');
    expect(html).toContain('aria-label="Sync current project to server"');
    expect(html).toContain('<optgroup label="Quick starts">');
    expect(html).toContain('<optgroup label="Conservative examples">');
    expect(html).not.toContain("Optional helper. Ignore this if you want to build the stack manually.");
  });

  it("shows start empty as the selected example when there are no rows yet", () => {
    const selectedPreset = getPresetById("heavy_concrete_impact_floor");
    const html = renderToStaticMarkup(
      createElement(SimpleWorkbenchToolbar, {
        airborneContextMode: "element_lab",
        exportReady: true,
        isExportingPdf: false,
        isServerProjectBusy: false,
        modePresets: MODE_PRESETS.floor.map(getPresetById),
        onContextModeChange: vi.fn(),
        onExportBrandedDocx: vi.fn(),
        onExportBrandedPdf: vi.fn(),
        onExportSimpleDocx: vi.fn(),
        onExportSimplePdf: vi.fn(),
        onLoadServerProject: vi.fn(),
        onOpenPdfSetup: vi.fn(),
        onPresetChange: vi.fn(),
        onRefreshServerProjects: vi.fn(),
        onSelectedServerProjectChange: vi.fn(),
        onStartEmpty: vi.fn(),
        onReset: vi.fn(),
        onStudyModeChange: vi.fn(),
        onSyncServerProject: vi.fn(),
        onToggleTheme: vi.fn(),
        readyOutputCount: 0,
        rowCount: 0,
        selectedPreset,
        selectedServerProjectId: "",
        serverProjectOptions: [],
        serverProjectStatusLabel: "Browser-local",
        studyMode: "floor",
        theme: "light"
      })
    );

    expect(html).toContain('<option value="__start_empty__" selected="">Start empty</option>');
  });
});
