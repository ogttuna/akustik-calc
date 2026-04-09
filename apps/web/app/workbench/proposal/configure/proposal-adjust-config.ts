export type ProposalPdfStyle = "branded" | "simple";

export type ProposalEditorTabId = "essentials" | "copy" | "issuer" | "details";

export const PROPOSAL_PDF_STYLE_OPTIONS: readonly { description: string; label: string; value: ProposalPdfStyle }[] = [
  {
    description: "Formal consultant issue with full branded sheet framing.",
    label: "Branded PDF",
    value: "branded"
  },
  {
    description: "Lightweight export with the same content and simpler chrome.",
    label: "Simple PDF",
    value: "simple"
  }
] as const;

export const PROPOSAL_EDITOR_TABS: readonly { detail: string; label: string; value: ProposalEditorTabId }[] = [
  {
    detail: "Rw, Ln,w, validation copy, and the visible metric rows.",
    label: "Metrics",
    value: "copy"
  },
  {
    detail: "Visible layer rows, thickness, density, mass, and role wording.",
    label: "Layers",
    value: "details"
  },
  {
    detail: "Project, recipient, subject, summary, and issue lines.",
    label: "Cover",
    value: "essentials"
  },
  {
    detail: "Consultant identity, sender metadata, and contact info.",
    label: "Issuer",
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
      note: "Simple uses the same edited content, but exports with the lightweight renderer.",
      shortLabel: "Simple PDF"
    };
  }

  return {
    downloadLabel: "Download branded PDF",
    note: "Branded keeps the consultant-sheet framing while reusing the same edited content.",
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
