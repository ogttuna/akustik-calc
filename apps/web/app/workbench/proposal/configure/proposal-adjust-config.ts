export type ProposalPdfStyle = "branded" | "simple";

export type ProposalEditorTabId = "essentials" | "copy" | "issuer" | "details";

export const PROPOSAL_PDF_STYLE_OPTIONS: readonly { description: string; label: string; value: ProposalPdfStyle }[] = [
  {
    description: "Branded acoustic analysis report with cover, sender identity, values, notes, and construction details.",
    label: "Branded PDF",
    value: "branded"
  },
  {
    description: "Compact acoustic analysis report with simpler document chrome.",
    label: "Simple PDF",
    value: "simple"
  }
] as const;

export const PROPOSAL_EDITOR_TABS: readonly { detail: string; label: string; value: ProposalEditorTabId }[] = [
  {
    detail: "Primary answer, Rw / Ln,w rows, executive summary, consultant note, and review copy.",
    label: "Results",
    value: "copy"
  },
  {
    detail: "Project, recipient, subject, issue reference, revision, purpose, and validity line.",
    label: "Header",
    value: "essentials"
  },
  {
    detail: "Construction illustration, visible layer schedule, response curves, and appendix tables.",
    label: "Layers & charts",
    value: "details"
  },
  {
    detail: "Consultant identity, sender metadata, contact info, and issue date.",
    label: "Sender",
    value: "issuer"
  }
] as const;

export function getProposalPdfStyleDescriptor(style: ProposalPdfStyle): {
  downloadLabel: string;
  note: string;
  shortLabel: string;
} {
  if (style === "simple") {
    return {
      downloadLabel: "Download simple PDF",
      note: "Simple uses the edited report snapshot with lightweight framing.",
      shortLabel: "Simple PDF"
    };
  }

  return {
    downloadLabel: "Download branded PDF",
    note: "Branded uses the edited report snapshot with cover, sender identity, values, notes, and construction details.",
    shortLabel: "Branded PDF"
  };
}

export function getProposalEditorStateLabel(options: {
  hasManualOverrides: boolean;
  hasUnsavedChanges: boolean;
}): string {
  if (options.hasUnsavedChanges) {
    return "Unsaved local edits";
  }

  if (options.hasManualOverrides) {
    return "Saved PDF override";
  }

  return "Packaged baseline";
}
