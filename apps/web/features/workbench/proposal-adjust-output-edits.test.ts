import { describe, expect, it } from "vitest";

import type { SimpleWorkbenchProposalDocument } from "./simple-workbench-proposal";
import {
  applyPrimaryMetricLabelEdit,
  applyPrimaryMetricValueEdit,
  applyProposalCoverageValueEdit,
  applyProposalMetricLabelEdit,
  applyProposalMetricValueEdit
} from "./proposal-adjust-output-edits";

const DOCUMENT: SimpleWorkbenchProposalDocument = {
  assemblyHeadline: "Rw 61 dB and Ln,w 49 dB are packaged for issue.",
  assumptionItems: [],
  approverTitle: "Lead Acoustic Consultant",
  briefNote: "Manual issue snapshot.",
  citations: [],
  clientName: "Machinity Acoustics",
  consultantAddress: "Maslak District, Istanbul, Turkiye",
  consultantCompany: "Machinity Acoustic Consultants",
  consultantEmail: "offers@machinity-acoustics.com",
  consultantLogoDataUrl: "",
  consultantPhone: "+90 212 000 00 00",
  consultantWordmarkLine: "Building Acoustics and Vibration Control",
  corridorDossierCards: [],
  corridorDossierHeadline: "Validation corridor packaged.",
  contextLabel: "Building prediction",
  coverageItems: [
    {
      detail: "Weighted airborne element rating.",
      label: "Rw",
      postureDetail: "Benchmark-backed estimate.",
      postureLabel: "Benchmark-backed estimate",
      postureTone: "accent",
      status: "live",
      value: "61 dB"
    },
    {
      detail: "Weighted normalized impact sound pressure level.",
      label: "Ln,w",
      postureDetail: "Exact impact lane.",
      postureLabel: "Exact impact lane",
      postureTone: "success",
      status: "live",
      value: "49 dB"
    }
  ],
  decisionTrailHeadline: "Scoped estimate is active.",
  decisionTrailItems: [],
  dynamicBranchDetail: "Published family estimate is active.",
  dynamicBranchLabel: "Heavy floating floor",
  executiveSummary: "Riverside Residences currently reads Rw 61 dB.",
  issuedOnIso: "2026-03-21T09:30:00.000Z",
  issuedOnLabel: "21 March 2026",
  issueBaseReference: "MAC-RR-20260321",
  issueCodePrefix: "MAC",
  issueNextReference: "MAC-RR-20260321-03",
  issueRegisterItems: [],
  layers: [],
  methodDossierCards: [],
  methodDossierHeadline: "Solver rationale packaged.",
  methodTraceGroups: [],
  metrics: [
    {
      detail: "Weighted airborne element rating.",
      label: "Rw",
      value: "61 dB"
    },
    {
      detail: "Weighted normalized impact sound pressure level.",
      label: "Ln,w",
      value: "49 dB"
    }
  ],
  preparedBy: "O. Tuna",
  primaryMetricLabel: "Rw",
  primaryMetricValue: "61 dB",
  projectName: "Riverside Residences",
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
  validationDetail: "Read this as a supported floor estimate.",
  validationLabel: "Scoped estimate",
  warnings: []
};

describe("proposal adjust output edits", () => {
  it("syncs the top PDF Rw value into matching metric and coverage rows", () => {
    const edited = applyPrimaryMetricValueEdit(DOCUMENT, "58 dB (manual)");

    expect(edited.primaryMetricValue).toBe("58 dB (manual)");
    expect(edited.metrics.find((metric) => metric.label === "Rw")?.value).toBe("58 dB (manual)");
    expect(edited.coverageItems.find((item) => item.label === "Rw")?.value).toBe("58 dB (manual)");
    expect(edited.metrics.find((metric) => metric.label === "Ln,w")?.value).toBe("49 dB");
  });

  it("syncs an edited Ln,w metric into the matching coverage row without changing a Rw headline", () => {
    const edited = applyProposalMetricValueEdit(DOCUMENT, 1, "46 dB (manual)");

    expect(edited.primaryMetricLabel).toBe("Rw");
    expect(edited.primaryMetricValue).toBe("61 dB");
    expect(edited.metrics[1]?.value).toBe("46 dB (manual)");
    expect(edited.coverageItems.find((item) => item.label === "Ln,w")?.value).toBe("46 dB (manual)");
  });

  it("syncs a coverage Rw value edit back into the top headline and metric row", () => {
    const edited = applyProposalCoverageValueEdit(DOCUMENT, 0, "60 dB (manual)");

    expect(edited.primaryMetricValue).toBe("60 dB (manual)");
    expect(edited.metrics.find((metric) => metric.label === "Rw")?.value).toBe("60 dB (manual)");
    expect(edited.coverageItems[0]?.value).toBe("60 dB (manual)");
  });

  it("can switch the top PDF metric to an existing Ln,w output and pick up its value", () => {
    const edited = applyPrimaryMetricLabelEdit(DOCUMENT, "Ln,w");

    expect(edited.primaryMetricLabel).toBe("Ln,w");
    expect(edited.primaryMetricValue).toBe("49 dB");
  });

  it("keeps the primary label attached when the primary metric row is renamed", () => {
    const edited = applyProposalMetricLabelEdit(DOCUMENT, 0, "Rw manual");

    expect(edited.primaryMetricLabel).toBe("Rw manual");
    expect(edited.primaryMetricValue).toBe("61 dB");
    expect(edited.metrics[0]?.label).toBe("Rw manual");
  });
});
