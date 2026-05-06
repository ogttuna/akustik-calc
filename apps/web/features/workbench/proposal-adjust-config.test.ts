import { describe, expect, it } from "vitest";

import {
  getProposalEditorStateLabel,
  getProposalPdfStyleDescriptor,
  PROPOSAL_EDITOR_TABS,
  PROPOSAL_PDF_STYLE_OPTIONS
} from "@/app/workbench/proposal/configure/proposal-adjust-config";

describe("proposal adjust config helpers", () => {
  it("describes branded and simple export targets with distinct copy", () => {
    expect(PROPOSAL_PDF_STYLE_OPTIONS.map((option) => option.value)).toEqual(["branded", "simple"]);
    expect(getProposalPdfStyleDescriptor("branded")).toEqual({
      downloadLabel: "Download branded PDF",
      note: "Branded uses the edited proposal snapshot with cover, sender identity, values, notes, and construction details.",
      shortLabel: "Branded PDF"
    });
    expect(getProposalPdfStyleDescriptor("simple")).toEqual({
      downloadLabel: "Download simple PDF",
      note: "Simple uses the edited proposal snapshot with lightweight framing.",
      shortLabel: "Simple PDF"
    });
  });

  it("keeps the editor tabs concise and ordered", () => {
    expect(PROPOSAL_EDITOR_TABS.map((tab) => tab.value)).toEqual(["copy", "essentials", "details", "issuer"]);
    expect(PROPOSAL_EDITOR_TABS.map((tab) => tab.label)).toEqual(["Results", "Header", "Layers & charts", "Sender"]);
  });

  it("prioritizes unsaved state over saved override and baseline labels", () => {
    expect(getProposalEditorStateLabel({ hasManualOverrides: false, hasUnsavedChanges: true })).toBe("Unsaved local edits");
    expect(getProposalEditorStateLabel({ hasManualOverrides: true, hasUnsavedChanges: false })).toBe("Saved PDF override");
    expect(getProposalEditorStateLabel({ hasManualOverrides: false, hasUnsavedChanges: false })).toBe("Packaged baseline");
  });
});
