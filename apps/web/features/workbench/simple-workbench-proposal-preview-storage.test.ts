import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearSimpleWorkbenchProposalPreview,
  readSimpleWorkbenchProposalPreview,
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
  consultantPhone: "+90 212 000 00 00",
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
  issuedOnIso: "2026-03-21T09:30:00.000Z",
  issuedOnLabel: "21 March 2026",
  layers: [],
  metrics: [],
  preparedBy: "O. Tuna",
  primaryMetricLabel: "Rw",
  primaryMetricValue: "61 dB",
  projectName: "Riverside Residences",
  proposalAttention: "Design Coordination Team",
  proposalRecipient: "Riverside Development Team",
  proposalReference: "MAC-2026-014",
  proposalRevision: "Rev 01",
  proposalSubject: "Riverside Residences floor acoustic proposal",
  recommendationItems: [],
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
    expect(loaded?.document.issueBaseReference).toBe("MAC-RR-20260321");
    expect(loaded?.document.issueRegisterItems).toHaveLength(1);
    expect(loaded?.document.proposalRecipient).toBe("Riverside Development Team");
    expect(loaded?.document.proposalSubject).toBe("Riverside Residences floor acoustic proposal");
    expect(loaded?.savedAtIso).toMatch(/^20/);
  });

  it("hydrates legacy preview snapshots that predate consultant identity fields", () => {
    const legacyDocument = { ...DOCUMENT } as Record<string, unknown>;
    delete legacyDocument.approverTitle;
    delete legacyDocument.consultantAddress;
    delete legacyDocument.consultantEmail;
    delete legacyDocument.consultantPhone;
    delete legacyDocument.issueBaseReference;
    delete legacyDocument.issueNextReference;
    delete legacyDocument.issueRegisterItems;
    delete legacyDocument.proposalAttention;
    delete legacyDocument.proposalRecipient;
    delete legacyDocument.proposalSubject;

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
    expect(loaded?.document.consultantPhone).toBe("Contact phone not entered");
    expect(loaded?.document.issueBaseReference).toBe("MAC-2026-014");
    expect(loaded?.document.issueRegisterItems).toHaveLength(1);
    expect(loaded?.document.proposalRecipient).toBe("Machinity Acoustics");
    expect(loaded?.document.proposalAttention).toBe("Attention line not entered");
    expect(loaded?.document.proposalSubject).toBe("Riverside Residences acoustic proposal");
  });

  it("clears the stored proposal snapshot", () => {
    storeSimpleWorkbenchProposalPreview(DOCUMENT);
    clearSimpleWorkbenchProposalPreview();

    expect(readSimpleWorkbenchProposalPreview()).toBeNull();
  });
});
