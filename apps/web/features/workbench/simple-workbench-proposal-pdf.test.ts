import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { downloadSimpleWorkbenchProposalPdf } from "./simple-workbench-proposal-pdf";
import type { SimpleWorkbenchProposalDocument } from "./simple-workbench-proposal";

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

describe("simple workbench proposal pdf helper", () => {
  beforeEach(() => {
    const anchor = {
      click: vi.fn(),
      download: "",
      href: ""
    };

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        blob: async () => new Blob(["pdf"], { type: "application/pdf" }),
        ok: true
      }))
    );
    vi.stubGlobal("window", {
      URL: {
        createObjectURL: vi.fn(() => "blob:proposal-pdf"),
        revokeObjectURL: vi.fn()
      },
      document: {
        createElement: vi.fn(() => anchor)
      },
      setTimeout: vi.fn((callback: () => void) => {
        callback();
        return 0;
      })
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts the proposal snapshot and triggers a branded pdf download", async () => {
    await downloadSimpleWorkbenchProposalPdf(DOCUMENT);

    expect(fetch).toHaveBeenCalledWith("/api/proposal-pdf", {
      body: JSON.stringify(DOCUMENT),
      headers: {
        "content-type": "application/json"
      },
      method: "POST"
    });
    expect(window.document.createElement).toHaveBeenCalledWith("a");
    expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
  });

  it("surfaces the server error message when generation fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        json: async () => ({
          error: "DynEcho could not generate the branded PDF on the server. Browser binary missing."
        }),
        ok: false
      }))
    );

    await expect(downloadSimpleWorkbenchProposalPdf(DOCUMENT)).rejects.toThrow(
      "DynEcho could not generate the branded PDF on the server. Browser binary missing."
    );
  });
});
