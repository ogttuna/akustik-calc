import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearSimpleWorkbenchProposalPreview,
  readSimpleWorkbenchProposalPreview,
  resetSimpleWorkbenchProposalPreviewCustomizations,
  storeSimpleWorkbenchProposalPreviewCustomizations,
  storeSimpleWorkbenchProposalPreview
} from "./simple-workbench-proposal-preview-storage";
import type { SimpleWorkbenchProposalDocument } from "./simple-workbench-proposal";

function createMemoryStorage(): Storage {
  const values = new Map<string, string>();

  return {
    clear() {
      values.clear();
    },
    getItem(key: string) {
      return values.has(key) ? values.get(key)! : null;
    },
    key(index: number) {
      return Array.from(values.keys())[index] ?? null;
    },
    get length() {
      return values.size;
    },
    removeItem(key: string) {
      values.delete(key);
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    }
  };
}

const DOCUMENT: SimpleWorkbenchProposalDocument = {
  assemblyHeadline: "3 live rows, heavy floating floor estimate active.",
  assumptionItems: [],
  approverTitle: "Lead Acoustic Consultant",
  briefNote: "Check flanking risk before issue.",
  citations: [],
  clientName: "Machinity Acoustics",
  consultantAddress: "Maslak District, Istanbul, Turkiye",
  consultantCompany: "Machinity Acoustic Consultants",
  consultantEmail: "offers@machinity-acoustics.com",
  consultantLogoDataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'></svg>",
  consultantPhone: "+90 212 000 00 00",
  consultantWordmarkLine: "Building Acoustics and Vibration Control",
  constructionTotalThicknessOverrideLabel: "212 mm total",
  corridorDossierCards: [
    {
      detail: "Estimated floor lane · field continuation live across the reinforced concrete benchmark family.",
      label: "Active family",
      tone: "accent",
      value: "reinforced concrete"
    }
  ],
  corridorDossierHeadline:
    "Family-specific estimate is the active benchmark mode on reinforced concrete. 0 dB tolerance remains attached to this route. Standardized room volume is live on the field-side chain.",
  contextLabel: "Building prediction",
  coverageItems: [],
  decisionTrailHeadline: "Scoped estimate is active.",
  decisionTrailItems: [],
  dynamicBranchDetail: "Published family estimate is active through reinforced concrete.",
  dynamicBranchLabel: "Heavy floating floor",
  executiveSummary: "Riverside Residences currently reads Rw 61 dB.",
  issueBaseReference: "MAC-RR-20260321",
  issueNextReference: "MAC-RR-20260321-03",
  issueRegisterItems: [
    {
      detail: "Active issue line currently applied to the printable consultant sheet.",
      issuedOnLabel: "21 March 2026",
      label: "Current issue",
      reference: "MAC-2026-014",
      statusLabel: "Rev 01"
    }
  ],
  methodDossierCards: [
    {
      detail: "Heavy floating floor route is active in building prediction context.",
      label: "Route choice",
      tone: "accent",
      value: "Heavy floating floor"
    }
  ],
  methodDossierHeadline:
    "Floor calculation is currently reading the stack through heavy floating floor in building prediction context. 1 output is already defensible while 0 outputs remain parked and 0 lanes stay unsupported.",
  methodTraceGroups: [
    {
      detail: "Screening Seed remains active on the airborne side through mass law. No family-aware airborne trace has locked yet.",
      label: "Airborne lane",
      notes: ["ISO 717 composite stays on Rw + C / Ctr."],
      tone: "neutral",
      value: "Screening Seed"
    }
  ],
  issuedOnIso: "2026-03-21T09:30:00.000Z",
  issuedOnLabel: "21 March 2026",
  layers: [],
  metrics: [],
  preparedBy: "O. Tuna",
  primaryMetricLabel: "Rw",
  primaryMetricValue: "61 dB",
  projectName: "Riverside Residences",
  issueCodePrefix: "MAC",
  proposalAttention: "Design Coordination Team",
  proposalIssuePurpose: "Client review and acoustic coordination",
  proposalRecipient: "Riverside Development Team",
  proposalReference: "MAC-2026-014",
  proposalRevision: "Rev 01",
  proposalSubject: "Riverside Residences floor acoustic proposal",
  proposalValidityNote: "Valid for 30 calendar days unless superseded by a later issue.",
  recommendationItems: [],
  reportProfile: "consultant",
  reportProfileLabel: "Consultant issue",
  studyContextLabel: "Pre-tender",
  studyModeLabel: "Floor",
  validationDetail: "Read this as a supported floor estimate, not as a measured claim.",
  validationLabel: "Scoped estimate",
  warnings: []
};

describe("simple workbench proposal preview storage", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createMemoryStorage());
    vi.stubGlobal("window", { localStorage });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("stores and reloads the latest proposal snapshot", () => {
    storeSimpleWorkbenchProposalPreview(DOCUMENT);

    const loaded = readSimpleWorkbenchProposalPreview();

    expect(loaded?.document.projectName).toBe("Riverside Residences");
    expect(loaded?.document.proposalReference).toBe("MAC-2026-014");
    expect(loaded?.document.approverTitle).toBe("Lead Acoustic Consultant");
    expect(loaded?.document.consultantEmail).toBe("offers@machinity-acoustics.com");
    expect(loaded?.document.consultantLogoDataUrl).toContain("data:image/svg+xml");
    expect(loaded?.document.issueBaseReference).toBe("MAC-RR-20260321");
    expect(loaded?.document.issueCodePrefix).toBe("MAC");
    expect(loaded?.document.issueRegisterItems).toHaveLength(1);
    expect(loaded?.document.corridorDossierCards).toHaveLength(1);
    expect(loaded?.document.constructionTotalThicknessOverrideLabel).toBe("212 mm total");
    expect(loaded?.document.corridorDossierHeadline).toContain("reinforced concrete");
    expect(loaded?.document.methodDossierHeadline).toContain("heavy floating floor");
    expect(loaded?.document.methodTraceGroups).toHaveLength(1);
    expect(loaded?.document.proposalIssuePurpose).toBe("Client review and acoustic coordination");
    expect(loaded?.document.proposalRecipient).toBe("Riverside Development Team");
    expect(loaded?.document.proposalSubject).toBe("Riverside Residences floor acoustic proposal");
    expect(loaded?.document.proposalValidityNote).toBe("Valid for 30 calendar days unless superseded by a later issue.");
    expect(loaded?.document.reportProfile).toBe("consultant");
    expect(loaded?.baseDocument.projectName).toBe("Riverside Residences");
    expect(loaded?.hasCustomizations).toBe(false);
    expect(loaded?.savedAtIso).toMatch(/^20/);
  });

  it("hydrates legacy preview snapshots that predate consultant identity fields", () => {
    const legacyDocument = { ...DOCUMENT } as Record<string, unknown>;
    delete legacyDocument.approverTitle;
    delete legacyDocument.consultantAddress;
    delete legacyDocument.consultantEmail;
    delete legacyDocument.consultantLogoDataUrl;
    delete legacyDocument.consultantPhone;
    delete legacyDocument.consultantWordmarkLine;
    delete legacyDocument.constructionTotalThicknessOverrideLabel;
    delete legacyDocument.corridorDossierCards;
    delete legacyDocument.corridorDossierHeadline;
    delete legacyDocument.issueBaseReference;
    delete legacyDocument.issueCodePrefix;
    delete legacyDocument.issueNextReference;
    delete legacyDocument.issueRegisterItems;
    delete legacyDocument.methodDossierCards;
    delete legacyDocument.methodDossierHeadline;
    delete legacyDocument.methodTraceGroups;
    delete legacyDocument.proposalAttention;
    delete legacyDocument.proposalIssuePurpose;
    delete legacyDocument.proposalRecipient;
    delete legacyDocument.proposalSubject;
    delete legacyDocument.proposalValidityNote;
    delete legacyDocument.reportProfile;

    localStorage.setItem(
      "dynecho:proposal-preview:v1",
      JSON.stringify({
        document: legacyDocument,
        savedAtIso: "2026-03-21T09:30:00.000Z"
      })
    );

    const loaded = readSimpleWorkbenchProposalPreview();

    expect(loaded?.document.approverTitle).toBe("Acoustic Consultant");
    expect(loaded?.document.consultantAddress).toBe("Office address not entered");
    expect(loaded?.document.consultantEmail).toBe("Contact email not entered");
    expect(loaded?.document.consultantLogoDataUrl).toBe("");
    expect(loaded?.document.consultantPhone).toBe("Contact phone not entered");
    expect(loaded?.document.consultantWordmarkLine).toBe("");
    expect(loaded?.document.constructionTotalThicknessOverrideLabel).toBeUndefined();
    expect(loaded?.document.corridorDossierCards).toHaveLength(0);
    expect(loaded?.document.corridorDossierHeadline).toBe(
      "No validation corridor snapshot was packaged with this legacy proposal preview."
    );
    expect(loaded?.document.issueBaseReference).toBe("MAC-2026-014");
    expect(loaded?.document.issueCodePrefix).toBe("");
    expect(loaded?.document.issueRegisterItems).toHaveLength(1);
    expect(loaded?.document.methodDossierCards).toHaveLength(0);
    expect(loaded?.document.methodTraceGroups).toHaveLength(0);
    expect(loaded?.document.methodDossierHeadline).toBe("No solver rationale snapshot was packaged with this legacy proposal preview.");
    expect(loaded?.document.proposalIssuePurpose).toBe("Client review and acoustic coordination");
    expect(loaded?.document.proposalRecipient).toBe("Machinity Acoustics");
    expect(loaded?.document.proposalAttention).toBe("Attention line not entered");
    expect(loaded?.document.proposalSubject).toBe("Riverside Residences acoustic proposal");
    expect(loaded?.document.proposalValidityNote).toBe("Valid for 30 calendar days unless superseded by a later issue.");
    expect(loaded?.document.reportProfile).toBe("consultant");
  });

  it("keeps the packaged base document and surfaces customized overrides", () => {
    storeSimpleWorkbenchProposalPreview(DOCUMENT);

    const customizedAtIso = storeSimpleWorkbenchProposalPreviewCustomizations({
      ...DOCUMENT,
      constructionTotalThicknessOverrideLabel: "224 mm total (manual)",
      executiveSummary: "Manual PDF wording is active on this preview.",
      layers: [
        {
          categoryLabel: "Finish",
          densityLabel: "780 kg/m3",
          index: 1,
          label: "Engineered timber",
          roleLabel: "Top layer",
          surfaceMassLabel: "12 kg/m2",
          thicknessLabel: "14 mm"
        }
      ]
    });

    const loaded = readSimpleWorkbenchProposalPreview();

    expect(customizedAtIso).toMatch(/^20/);
    expect(loaded?.hasCustomizations).toBe(true);
    expect(loaded?.document.executiveSummary).toBe("Manual PDF wording is active on this preview.");
    expect(loaded?.document.constructionTotalThicknessOverrideLabel).toBe("224 mm total (manual)");
    expect(loaded?.document.layers).toHaveLength(1);
    expect(loaded?.baseDocument.executiveSummary).toBe("Riverside Residences currently reads Rw 61 dB.");
    expect(loaded?.baseDocument.layers).toHaveLength(0);
    expect(loaded?.customizedAtIso).toBe(customizedAtIso);
  });

  it("drops the customized document without losing the packaged base snapshot", () => {
    storeSimpleWorkbenchProposalPreview(DOCUMENT);
    storeSimpleWorkbenchProposalPreviewCustomizations({
      ...DOCUMENT,
      executiveSummary: "Temporary PDF note"
    });

    resetSimpleWorkbenchProposalPreviewCustomizations();

    const loaded = readSimpleWorkbenchProposalPreview();

    expect(loaded?.hasCustomizations).toBe(false);
    expect(loaded?.customizedAtIso).toBeUndefined();
    expect(loaded?.document.executiveSummary).toBe("Riverside Residences currently reads Rw 61 dB.");
    expect(loaded?.baseDocument.executiveSummary).toBe("Riverside Residences currently reads Rw 61 dB.");
  });

  it("clears the stored proposal snapshot", () => {
    storeSimpleWorkbenchProposalPreview(DOCUMENT);
    clearSimpleWorkbenchProposalPreview();

    expect(readSimpleWorkbenchProposalPreview()).toBeNull();
  });
});
