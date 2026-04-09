import { describe, expect, it } from "vitest";

import { buildSimpleWorkbenchProposalPreviewHtml } from "./simple-workbench-proposal-preview-html";
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
  consultantLogoDataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'></svg>",
  consultantPhone: "+90 212 000 00 00",
  consultantWordmarkLine: "Building Acoustics and Vibration Control",
  corridorDossierCards: [],
  corridorDossierHeadline: "Family-specific estimate is the active benchmark mode on reinforced concrete.",
  contextLabel: "Building prediction",
  coverageItems: [],
  decisionTrailHeadline: "Scoped estimate is active.",
  decisionTrailItems: [],
  dynamicBranchDetail: "Published family estimate is active through reinforced concrete.",
  dynamicBranchLabel: "Heavy floating floor",
  executiveSummary: "Riverside Residences currently reads Rw 61 dB.",
  issueBaseReference: "MAC-RR-20260321",
  issueNextReference: "MAC-RR-20260321-03",
  issueRegisterItems: [],
  methodDossierCards: [],
  methodDossierHeadline: "Floor calculation is currently reading the stack through heavy floating floor.",
  methodTraceGroups: [],
  issuedOnIso: "2026-03-21T09:30:00.000Z",
  issuedOnLabel: "21 March 2026",
  layers: [
    { categoryLabel: "floor_covering", densityLabel: "2200 kg/m³", index: 1, label: "Vinyl Flooring", roleLabel: "Walking side", surfaceMassLabel: "22 kg/m²", thicknessLabel: "10 mm" },
    { categoryLabel: "base_structure", densityLabel: "2400 kg/m³", index: 2, label: "Concrete", roleLabel: "Base structure", surfaceMassLabel: "432 kg/m²", thicknessLabel: "180 mm" }
  ],
  metrics: [
    { detail: "Primary weighted airborne value based on the active defended route.", label: "Rw", value: "61 dB" },
    { detail: "Primary weighted impact value based on the active defended route.", label: "Ln,w", value: "47 dB" }
  ],
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

describe("simple workbench proposal preview html helper", () => {
  it("builds branded html by default", () => {
    const html = buildSimpleWorkbenchProposalPreviewHtml(DOCUMENT);

    expect(html).toContain("This DAC sheet summarizes a project estimate");
    expect(html).not.toContain("This short-form report summarises the current DynEcho Acoustic Calculator reading.");
  });

  it("builds the lightweight summary html for the simple preview path", () => {
    const html = buildSimpleWorkbenchProposalPreviewHtml(DOCUMENT, "simple");

    expect(html).toContain("This short-form report summarises the current DynEcho Acoustic Calculator reading.");
    expect(html).toContain("Measured / predicted indices");
    expect(html).not.toContain("This DAC sheet summarizes a project estimate");
  });
});
