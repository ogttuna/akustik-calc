import { describe, expect, it } from "vitest";

import {
  buildSimpleWorkbenchProposalHtml,
  buildSimpleWorkbenchProposalText
} from "./simple-workbench-proposal";

const BASE_DOCUMENT = {
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
  briefNote: "Check flanking <risk> before tender issue.",
  clientName: "Machinity Acoustics",
  consultantAddress: "Maslak District, Istanbul, Turkiye",
  citations: [
    {
      detail: "Knauf AU official system table · Official manufacturer system table · Official manufacturer · system id knauf_ct30_1c_timber_lab_2026.",
      label: "Exact floor family: Knauf CT30 1C",
      tone: "success"
    },
    {
      detail: "Room-to-room field route is active. DnT,w is being standardized from the same apparent field curve using the current partition area and receiving-room volume.",
      href: "https://example.com/source",
      label: "Field airborne provenance: Room-standardized apparent derivation",
      tone: "accent"
    }
  ],
  consultantCompany: "Machinity Acoustic Consultants",
  consultantEmail: "offers@machinity-acoustics.com",
  consultantPhone: "+90 212 000 00 00",
  contextLabel: "Building prediction",
  coverageItems: [
    {
      detail: "Weighted airborne element rating from the active airborne calculator.",
      label: "Rw",
      status: "live",
      value: "61 dB"
    },
    {
      detail: "Need partition width and height before the room-standardized field lane can defend this output.",
      label: "DnT,w",
      nextStep: "Enter partition width and height",
      status: "needs_input",
      value: "Not ready"
    },
    {
      detail: "The current solver lane cannot defend this metric on the active topology.",
      label: "LnT,A",
      status: "unsupported",
      value: "Not ready"
    }
  ],
  decisionTrailHeadline: "Scoped estimate on the heavy floating floor corridor is the current floor-side posture.",
  decisionTrailItems: [
    {
      detail: "Published family estimate is active on the current corridor.",
      label: "Impact corridor",
      tone: "accent"
    },
    {
      detail: "Assumptions are documented and warnings stay explicit.",
      label: "Assumption log",
      tone: "success"
    }
  ],
  dynamicBranchDetail: "Published family estimate is active through reinforced concrete.",
  dynamicBranchLabel: "Heavy floating floor",
  executiveSummary:
    "Riverside Residences currently reads Rw 61 dB. DynEcho is carrying the stack on the heavy floating floor route with a scoped estimate posture.",
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
      issuedOnLabel: "20/03/2026",
      label: "Reserved issue no",
      reference: "MAC-RR-20260321-02",
      statusLabel: "Rev 00"
    }
  ],
  issuedOnLabel: "21 March 2026",
  issuedOnIso: "2026-03-21T09:30:00.000Z",
  layers: [
    {
      categoryLabel: "Top finish",
      index: 1,
      label: "Vinyl Flooring",
      roleLabel: "Floor covering",
      thicknessLabel: "4 mm"
    },
    {
      categoryLabel: "Base structure",
      index: 2,
      label: "Concrete",
      roleLabel: "Base structure",
      thicknessLabel: "180 mm"
    }
  ],
  metrics: [
    {
      detail: "Weighted airborne element rating from the active airborne calculator.",
      label: "Rw",
      value: "61 dB"
    },
    {
      detail: "ISO 717-2 weighted normalized impact sound pressure level for lab-side floor impact.",
      label: "Ln,w",
      value: "49 dB"
    }
  ],
  preparedBy: "O. Tuna",
  primaryMetricLabel: "Rw",
  primaryMetricValue: "61 dB",
  projectName: "Riverside Residences",
  proposalAttention: "Design Coordination Team",
  proposalRecipient: "Riverside Development Team",
  proposalReference: "MAC-2026-014",
  proposalRevision: "Rev 01",
  proposalSubject: "Riverside Residences floor acoustic proposal",
  recommendationItems: [
    {
      detail: "Keep estimate wording and avoid calling this a measured result.",
      label: "Issue as estimate, not measurement",
      tone: "accent"
    },
    {
      detail: "Attach the linked source appendix to the offer sheet.",
      label: "Attach the citation appendix",
      tone: "success"
    }
  ],
  reportProfileLabel: "Consultant issue",
  studyModeLabel: "Floor",
  studyContextLabel: "Pre-tender",
  validationDetail: "Published family estimate is active. Read this as a supported floor estimate, not as a measured claim.",
  validationLabel: "Scoped estimate",
  warnings: ["Receiving-room volume is still missing for standardized field outputs."]
} as const;

describe("simple workbench proposal helpers", () => {
  it("builds a copy-ready summary with the live route, metrics, and schedule", () => {
    const text = buildSimpleWorkbenchProposalText(BASE_DOCUMENT);

    expect(text).toContain("Acoustic Proposal | Riverside Residences");
    expect(text).toContain("Client: Machinity Acoustics");
    expect(text).toContain("Consultant: Machinity Acoustic Consultants");
    expect(text).toContain("Prepared by: O. Tuna");
    expect(text).toContain("Role: Lead Acoustic Consultant");
    expect(text).toContain("Contact: offers@machinity-acoustics.com | +90 212 000 00 00");
    expect(text).toContain("Office: Maslak District, Istanbul, Turkiye");
    expect(text).toContain("Issued to: Riverside Development Team");
    expect(text).toContain("Attention: Design Coordination Team");
    expect(text).toContain("Subject: Riverside Residences floor acoustic proposal");
    expect(text).toContain("Issue: MAC-2026-014 | Rev 01");
    expect(text).toContain("Study: Floor | Building prediction | Pre-tender | Consultant issue");
    expect(text).toContain("Primary read: Rw 61 dB");
    expect(text).toContain("Executive summary");
    expect(text).toContain("Riverside Residences currently reads Rw 61 dB.");
    expect(text).toContain("Decision trail");
    expect(text).toContain("Headline: Scoped estimate on the heavy floating floor corridor is the current floor-side posture.");
    expect(text).toContain("Assumption register");
    expect(text).toContain("Evidence posture: Scoped estimate. Keep estimate language explicit.");
    expect(text).toContain("Recommended next steps");
    expect(text).toContain("Issue as estimate, not measurement: Keep estimate wording and avoid calling this a measured result.");
    expect(text).toContain("Source citations");
    expect(text).toContain("Exact floor family: Knauf CT30 1C");
    expect(text).toContain("https://example.com/source");
    expect(text).toContain("Output coverage register");
    expect(text).toContain("Rw: Live now | 61 dB | Weighted airborne element rating from the active airborne calculator.");
    expect(text).toContain(
      "DnT,w: Needs input | Not ready | Need partition width and height before the room-standardized field lane can defend this output. | Next action: Enter partition width and height"
    );
    expect(text).toContain("LnT,A: Unsupported on lane | Not ready | The current solver lane cannot defend this metric on the active topology.");
    expect(text).toContain("Heavy floating floor: Published family estimate is active through reinforced concrete.");
    expect(text).toContain("Issue authority");
    expect(text).toContain(
      "O. Tuna, Lead Acoustic Consultant, is issuing MAC-2026-014 Rev 01 on behalf of Machinity Acoustic Consultants for Machinity Acoustics."
    );
    expect(text).toContain("Issue control register");
    expect(text).toContain("Base reference: MAC-RR-20260321");
    expect(text).toContain("Next available issue no: MAC-RR-20260321-03");
    expect(text).toContain(
      "Current issue: MAC-2026-014 | Rev 01 | 21 March 2026 | Active issue line currently applied to the printable consultant sheet."
    );
    expect(text).toContain("1. Vinyl Flooring | 4 mm | Floor covering | Top finish");
    expect(text).toContain("Check flanking <risk> before tender issue.");
  });

  it("escapes consultant free text in the printable html while preserving core sections", () => {
    const html = buildSimpleWorkbenchProposalHtml(BASE_DOCUMENT);

    expect(html).toContain("Acoustic Proposal");
    expect(html).toContain("Riverside Residences");
    expect(html).toContain("Machinity Acoustics");
    expect(html).toContain("Machinity Acoustic Consultants");
    expect(html).toContain("O. Tuna");
    expect(html).toContain("Lead Acoustic Consultant");
    expect(html).toContain("offers@machinity-acoustics.com");
    expect(html).toContain("+90 212 000 00 00");
    expect(html).toContain("Maslak District, Istanbul, Turkiye");
    expect(html).toContain("MAC-2026-014");
    expect(html).toContain("Rev 01");
    expect(html).toContain("Executive Summary");
    expect(html).toContain("Memo-grade reading");
    expect(html).toContain("Signature and Issue Authority");
    expect(html).toContain("Prepared for client review");
    expect(html).toContain("Authorized consultant signature");
    expect(html).toContain("Company identity");
    expect(html).toContain("Issued to");
    expect(html).toContain("Riverside Development Team");
    expect(html).toContain("Design Coordination Team");
    expect(html).toContain("Riverside Residences floor acoustic proposal");
    expect(html).toContain("Recipient and subject");
    expect(html).toContain("Transmittal recipient");
    expect(html).toContain("Issue subject line");
    expect(html).toContain("Primary issue contact");
    expect(html).toContain("Revision control snapshot");
    expect(html).toContain("Issue Control Register");
    expect(html).toContain("Issue History Appendix");
    expect(html).toContain("MAC-RR-20260321");
    expect(html).toContain("MAC-RR-20260321-03");
    expect(html).toContain("Recommendation Register");
    expect(html).toContain("Assumption Register");
    expect(html).toContain("Decision Trail");
    expect(html).toContain("Citation Appendix");
    expect(html).toContain("Source Citation Appendix");
    expect(html).toContain("Output Coverage Register");
    expect(html).toContain("Needs input");
    expect(html).toContain("Unsupported on lane");
    expect(html).toContain("Enter partition width and height");
    expect(html).toContain("Exact floor family: Knauf CT30 1C");
    expect(html).toContain("https://example.com/source");
    expect(html).toContain("Rw");
    expect(html).toContain("Ln,w");
    expect(html).toContain("Vinyl Flooring");
    expect(html).toContain("Concrete");
    expect(html).toContain("Check flanking &lt;risk&gt; before tender issue.");
    expect(html).not.toContain("Check flanking <risk> before tender issue.");
    expect(html).toContain("Prepared from the DynEcho dynamic calculator.");
  });
});
