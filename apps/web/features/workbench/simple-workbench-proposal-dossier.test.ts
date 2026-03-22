import { describe, expect, it } from "vitest";

import { buildSimpleWorkbenchProposalDossier } from "./simple-workbench-proposal-dossier";
import type { SimpleWorkbenchProposalDocument } from "./simple-workbench-proposal";

const DOCUMENT: SimpleWorkbenchProposalDocument = {
  assemblyHeadline: "3 live rows, heavy floating floor estimate active.",
  assumptionItems: [
    {
      detail: "Scoped estimate. Keep estimate language explicit.",
      label: "Evidence posture",
      tone: "accent"
    },
    {
      detail: "1 linked source line is active for audit follow-up.",
      label: "Citation coverage",
      tone: "success"
    }
  ],
  approverTitle: "Lead Acoustic Consultant",
  briefNote: "Check flanking risk before issue.",
  citations: [
    {
      detail: "Exact family row is active.",
      href: "https://example.com/source",
      label: "Exact floor family",
      tone: "success"
    },
    {
      detail: "Local calibrated companion remains explicit.",
      label: "Source posture",
      tone: "accent"
    }
  ],
  clientName: "Machinity Acoustics",
  consultantAddress: "Maslak District, Istanbul, Turkiye",
  consultantCompany: "Machinity Acoustic Consultants",
  consultantEmail: "offers@machinity-acoustics.com",
  consultantLogoDataUrl: "",
  consultantPhone: "+90 212 000 00 00",
  consultantWordmarkLine: "Building Acoustics and Vibration Control",
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
  coverageItems: [
    {
      detail: "Weighted airborne element rating from the active airborne calculator.",
      label: "Rw",
      status: "live",
      value: "61 dB"
    },
    {
      detail: "Weighted impact rating from the active impact calculator.",
      label: "Ln,w",
      status: "bound",
      value: "49 dB"
    },
    {
      detail: "Need receiving-room volume before the room-standardized field lane can defend this output.",
      label: "DnT,w",
      nextStep: "Enter receiving-room volume",
      status: "needs_input",
      value: "Not ready"
    },
    {
      detail: "The current lane cannot defend this metric.",
      label: "LnT,A",
      status: "unsupported",
      value: "Not ready"
    }
  ],
  decisionTrailHeadline: "Scoped estimate on the heavy floating floor corridor is active.",
  decisionTrailItems: [
    {
      detail: "Published family estimate is active.",
      label: "Impact corridor",
      tone: "accent"
    },
    {
      detail: "Assumptions remain explicit.",
      label: "Assumption log",
      tone: "success"
    },
    {
      detail: "Output coverage is visible.",
      label: "Coverage posture",
      tone: "neutral"
    }
  ],
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
    },
    {
      detail: "Previous browser-local reservation captured on the same base issue stem.",
      issuedOnLabel: "20 March 2026",
      label: "Reserved issue no",
      reference: "MAC-RR-20260321-02",
      statusLabel: "Rev 00"
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
    "Floor calculation is currently reading the stack through heavy floating floor in building prediction context. 2 outputs are already defensible while 1 output remains parked and 1 lane stays unsupported.",
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
  recommendationItems: [
    {
      detail: "Keep estimate wording explicit.",
      label: "Issue as estimate, not measurement",
      tone: "accent"
    },
    {
      detail: "Attach the citation appendix.",
      label: "Attach the citation appendix",
      tone: "success"
    }
  ],
  reportProfile: "consultant",
  reportProfileLabel: "Consultant issue",
  studyContextLabel: "Pre-tender",
  studyModeLabel: "Floor",
  validationDetail: "Published family estimate is active. Read this as a supported floor estimate, not as a measured claim.",
  validationLabel: "Scoped estimate",
  warnings: ["Receiving-room volume is still missing for standardized field outputs."]
};

describe("simple workbench proposal dossier", () => {
  it("summarizes evidence, coverage, audit package, and issue control in one brief", () => {
    const dossier = buildSimpleWorkbenchProposalDossier(DOCUMENT);

    expect(dossier.headline).toContain("Scoped estimate stays explicit on the heavy floating floor route.");
    expect(dossier.headline).toContain("2 ready outputs");
    expect(dossier.headline).toContain("1 parked output");
    expect(dossier.headline).toContain("1 unsupported lane");
    expect(dossier.readyCoverageCount).toBe(2);
    expect(dossier.parkedCoverageCount).toBe(1);
    expect(dossier.unsupportedCoverageCount).toBe(1);
    expect(dossier.linkedCitationCount).toBe(1);
    expect(dossier.warningCount).toBe(1);
    expect(dossier.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Evidence posture", value: "Scoped estimate" }),
        expect.objectContaining({ label: "Coverage posture", value: "2 ready / 1 parked" }),
        expect.objectContaining({ label: "Audit package", value: "3 decisions / 2 assumptions" }),
        expect.objectContaining({ label: "Issue control", value: "MAC-2026-014 · Rev 01" })
      ])
    );
  });
});
