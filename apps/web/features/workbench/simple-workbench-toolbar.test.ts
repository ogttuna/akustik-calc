import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { SimpleWorkbenchToolbar } from "./simple-workbench-toolbar";

describe("simple workbench toolbar", () => {
  it("keeps global workbench commands separate from setup controls", () => {
    const html = renderToStaticMarkup(
      createElement(SimpleWorkbenchToolbar, {
        exportReady: true,
        isExportingPdf: false,
        onExportBrandedDocx: vi.fn(),
        onExportBrandedPdf: vi.fn(),
        onExportSimpleDocx: vi.fn(),
        onExportSimplePdf: vi.fn(),
        onOpenPdfSetup: vi.fn(),
        onReset: vi.fn(),
        onToggleTheme: vi.fn(),
        readyOutputCount: 2,
        rowCount: 4,
        studyMode: "floor",
        theme: "light"
      })
    );

    expect(html).toContain("DYNECHO ACOUSTIC CALCULATOR");
    expect(html).toContain("Report");
    expect(html).toContain("PDF setup");
    expect(html).toContain("Simple DOCX");
    expect(html).toContain("Reset");
    expect(html).toContain("Advanced");
    expect(html).toContain("2 ready");
    expect(html).toContain("4 rows");
    expect(html).not.toContain("Example Stack");
    expect(html).not.toContain("Server Project");
    expect(html).not.toContain('aria-label="Load sample rows"');
  });
});
