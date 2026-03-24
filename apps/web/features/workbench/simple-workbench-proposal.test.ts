import { describe, expect, it } from "vitest";

import {
  buildSimpleWorkbenchProposalHtml,
  buildSimpleWorkbenchProposalText
} from "./simple-workbench-proposal";
import { buildSimpleWorkbenchProposalSimpleHtml } from "./simple-workbench-proposal-simple";

const LOGO_DATA_URL = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'></svg>";

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
  consultantLogoDataUrl: LOGO_DATA_URL,
  consultantPhone: "+90 212 000 00 00",
  consultantWordmarkLine: "Building Acoustics and Vibration Control",
  corridorDossierCards: [
    {
      detail: "Estimated floor lane · field continuation live. 4 exact · 3 estimate · 1 low confidence · 1 bound · 3 field across 12 tracked benchmark cases.",
      label: "Active family",
      tone: "accent",
      value: "reinforced concrete"
    },
    {
      detail: "Estimate benchmark mode with 1 tracked case. Family-specific reinforced-concrete estimate stays benchmark-guarded.",
      label: "Benchmark mode",
      tone: "accent",
      value: "Family-specific estimate"
    },
    {
      detail: "0 dB tolerance across 2 floor and 2 field cases on the active family.",
      label: "Tolerance band",
      tone: "success",
      value: "0 dB tolerance"
    },
    {
      detail: "Standardized room volume is active on the impact side. Room-to-room field route is active and remains explicit.",
      label: "Field continuation",
      tone: "accent",
      value: "Standardized room volume"
    }
  ],
  corridorDossierHeadline:
    "Family-specific estimate is the active benchmark mode on reinforced concrete. 0 dB tolerance remains attached to this route. Standardized room volume is live on the field-side chain.",
  contextLabel: "Building prediction",
  coverageItems: [
    {
      detail: "Weighted airborne element rating from the active airborne calculator.",
      label: "Rw",
      postureDetail:
        "The active floor lane is a scoped estimate. It is benchmark-guarded, but it still needs explicit source citation or tolerance notes before it is presented as a final acoustic claim.",
      postureLabel: "Benchmark-backed estimate",
      postureTone: "accent",
      status: "live",
      value: "61 dB"
    },
    {
      detail: "Need partition width and height before the room-standardized field lane can defend this output.",
      label: "DnT,w",
      nextStep: "Enter partition width and height",
      postureDetail:
        "The field route is recognized, but it still needs geometry, room-volume, K, or imported field evidence before this metric can be defended.",
      postureLabel: "Awaiting field input",
      postureTone: "warning",
      status: "needs_input",
      value: "Not ready"
    },
    {
      detail: "The current solver lane cannot defend this metric on the active topology.",
      label: "LnT,A",
      postureDetail:
        "The active topology does not expose a defensible solver lane for this metric. Keep it visible, but frame it as out of scope on the current route.",
      postureLabel: "Unsupported on route",
      postureTone: "neutral",
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
  methodDossierCards: [
    {
      detail: "Heavy floating floor route is active in building prediction context.",
      label: "Route choice",
      tone: "accent",
      value: "Heavy floating floor"
    },
    {
      detail: "1 ready, 1 parked, 1 unsupported. 1 live warning remains explicit on the issue sheet.",
      label: "Output posture",
      tone: "warning",
      value: "1 ready / 1 parked"
    }
  ],
  methodDossierHeadline:
    "Floor calculation is currently reading the stack through heavy floating floor in building prediction context. 1 output is already defensible while 1 output remains parked and 1 lane stays unsupported.",
  methodTraceGroups: [
    {
      detail: "Screening Seed remains active on the airborne side through mass law. No family-aware airborne trace has locked yet.",
      label: "Airborne lane",
      notes: [
        "ISO 717 composite stays on Rw + C / Ctr.",
        "Surface mass 450 kg/m² and total thickness 192 mm are feeding the current screening curve."
      ],
      tone: "neutral",
      value: "Screening Seed"
    },
    {
      detail: "Estimate using resilient floating floor basis. Heavy floating floor. Standardized room volume.",
      label: "Impact lane",
      notes: ["Published family estimate stayed active at 81% fit.", "Standardized room volume keeps Ln,w and field companions on the active lane."],
      tone: "accent",
      value: "Published family estimate · reinforced concrete"
    }
  ],
  issuedOnLabel: "21 March 2026",
  issuedOnIso: "2026-03-21T09:30:00.000Z",
  layers: [
    {
      categoryLabel: "Top finish",
      densityLabel: "1,400 kg/m³",
      index: 1,
      label: "Vinyl Flooring",
      roleLabel: "Floor covering",
      surfaceMassLabel: "5.6 kg/m²",
      thicknessLabel: "4 mm"
    },
    {
      categoryLabel: "Base structure",
      densityLabel: "2,400 kg/m³",
      index: 2,
      label: "Concrete",
      roleLabel: "Base structure",
      surfaceMassLabel: "432 kg/m²",
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
  reportProfile: "consultant",
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
    expect(text).toContain("Brand line: Building Acoustics and Vibration Control");
    expect(text).toContain("Contact: offers@machinity-acoustics.com | +90 212 000 00 00");
    expect(text).toContain("Office: Maslak District, Istanbul, Turkiye");
    expect(text).toContain("Issued to: Riverside Development Team");
    expect(text).toContain("Attention: Design Coordination Team");
    expect(text).toContain("Subject: Riverside Residences floor acoustic proposal");
    expect(text).toContain("Issue purpose: Client review and acoustic coordination");
    expect(text).toContain("Validity: Valid for 30 calendar days unless superseded by a later issue.");
    expect(text).toContain("Issue: MAC-2026-014 | Rev 01");
    expect(text).toContain("Issue code prefix: MAC");
    expect(text).toContain("Study: Floor | Building prediction | Pre-tender | Consultant issue");
    expect(text).toContain("Template: Consultant issue | Acoustic Proposal | Machinity Acoustic Consultants");
    expect(text).toContain("Primary read: Rw 61 dB");
    expect(text).toContain("Executive summary");
    expect(text).toContain("Riverside Residences currently reads Rw 61 dB.");
    expect(text).toContain("Issue dossier");
    expect(text).toContain(
      "Headline: Scoped estimate stays explicit on the heavy floating floor route. 1 ready output travels with 1 parked output and 1 unsupported lane."
    );
    expect(text).toContain(
      "Evidence posture: Scoped estimate | Published family estimate is active. Read this as a supported floor estimate, not as a measured claim. 1 live warning remains explicit on the issue sheet."
    );
    expect(text).toContain("Audit package: 2 decisions / 2 assumptions | 2 citations, 1 linked source, and 2 recommended actions travel with the issue package.");
    expect(text).toContain("Validation corridor package");
    expect(text).toContain(
      "Headline: Family-specific estimate is the active benchmark mode on reinforced concrete. 0 dB tolerance remains attached to this route. Standardized room volume is live on the field-side chain."
    );
    expect(text).toContain(
      "Active family: reinforced concrete | Estimated floor lane · field continuation live. 4 exact · 3 estimate · 1 low confidence · 1 bound · 3 field across 12 tracked benchmark cases."
    );
    expect(text).toContain("Solver rationale appendix");
    expect(text).toContain(
      "Headline: Floor calculation is currently reading the stack through heavy floating floor in building prediction context. 1 output is already defensible while 1 output remains parked and 1 lane stays unsupported."
    );
    expect(text).toContain(
      "Airborne lane: Screening Seed | Screening Seed remains active on the airborne side through mass law. No family-aware airborne trace has locked yet."
    );
    expect(text).toContain(
      "Impact lane: Published family estimate · reinforced concrete | Estimate using resilient floating floor basis. Heavy floating floor. Standardized room volume."
    );
    expect(text).toContain("Construction section");
    expect(text).toContain("Walking side -> Ceiling side | 184 mm total");
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
    expect(text).toContain(
      "Rw: Live now | Benchmark-backed estimate | 61 dB | Weighted airborne element rating from the active airborne calculator. | Evidence class: The active floor lane is a scoped estimate. It is benchmark-guarded, but it still needs explicit source citation or tolerance notes before it is presented as a final acoustic claim."
    );
    expect(text).toContain(
      "DnT,w: Needs input | Awaiting field input | Not ready | Need partition width and height before the room-standardized field lane can defend this output. | Next action: Enter partition width and height | Evidence class: The field route is recognized, but it still needs geometry, room-volume, K, or imported field evidence before this metric can be defended."
    );
    expect(text).toContain(
      "LnT,A: Unsupported on lane | Unsupported on route | Not ready | The current solver lane cannot defend this metric on the active topology. | Evidence class: The active topology does not expose a defensible solver lane for this metric. Keep it visible, but frame it as out of scope on the current route."
    );
    expect(text).toContain("Heavy floating floor: Published family estimate is active through reinforced concrete.");
    expect(text).toContain("Issue authority");
    expect(text).toContain(
      "O. Tuna, Lead Acoustic Consultant, is issuing MAC-2026-014 Rev 01 on behalf of Machinity Acoustic Consultants for Machinity Acoustics."
    );
    expect(text).toContain("Purpose: Client review and acoustic coordination");
    expect(text).toContain("Validity: Valid for 30 calendar days unless superseded by a later issue.");
    expect(text).toContain("Issue control register");
    expect(text).toContain("Issue code prefix: MAC");
    expect(text).toContain("Base reference: MAC-RR-20260321");
    expect(text).toContain("Next available issue no: MAC-RR-20260321-03");
    expect(text).toContain(
      "Current issue: MAC-2026-014 | Rev 01 | 21 March 2026 | Active issue line currently applied to the printable consultant sheet."
    );
    expect(text).toContain("Applied method and deliverable basis");
    expect(text).toContain(
      "- Deliverable basis: Client review and acoustic coordination | Issued to Riverside Development Team | Valid for 30 calendar days unless superseded by a later issue."
    );
    expect(text).toContain("1. Vinyl Flooring | 4 mm | 1,400 kg/m³ | 5.6 kg/m² | Floor covering | Top finish");
    expect(text).toContain("Check flanking <risk> before tender issue.");
  });

  it("escapes consultant free text in the printable html while preserving core sections", () => {
    const html = buildSimpleWorkbenchProposalHtml(BASE_DOCUMENT);

    expect(html).toContain("Acoustic Proposal");
    expect(html).toContain("Riverside Residences");
    expect(html).toContain("Machinity Acoustics");
    expect(html).toContain("Machinity Acoustic Consultants");
    expect(html).toContain("Building Acoustics and Vibration Control");
    expect(html).toContain("O. Tuna");
    expect(html).toContain("Lead Acoustic Consultant");
    expect(html).toContain("offers@machinity-acoustics.com");
    expect(html).toContain("+90 212 000 00 00");
    expect(html).toContain("Maslak District, Istanbul, Turkiye");
    expect(html).toContain("MAC-2026-014");
    expect(html).toContain("Rev 01");
    expect(html).toContain("Client review and acoustic coordination");
    expect(html).toContain("Valid for 30 calendar days unless superseded by a later issue.");
    expect(html).toContain("Executive Summary");
    expect(html).toContain("Issue Dossier");
    expect(html).toContain("Validation Corridor Package");
    expect(html).toContain("Benchmarked family and mode posture");
    expect(html).toContain("reinforced concrete");
    expect(html).toContain("Family-specific estimate");
    expect(html).toContain("Solver Rationale Appendix");
    expect(html).toContain("Why DynEcho is reading the stack this way");
    expect(html).toContain("Packaged method narrative");
    expect(html).toContain("Airborne lane");
    expect(html).toContain("Impact lane");
    expect(html).toContain("Construction Section");
    expect(html).toContain("Visible layer stack in solver order");
    expect(html).toContain("Walking side");
    expect(html).toContain("Ceiling side");
    expect(html).toContain("Technical schedule legend");
    expect(html).toContain("construction-grid");
    expect(html).toContain("Audit posture");
    expect(html).toContain("Coverage posture");
    expect(html).toContain("Audit package");
    expect(html).toContain("Memo-grade reading");
    expect(html).toContain("Template");
    expect(html).toContain("Building Acoustics and Vibration Control");
    expect(html).toContain('alt="Machinity Acoustic Consultants logo"');
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
    expect(html).toContain("Issue Snapshot");
    expect(html).toContain("Applied Method &amp; Deliverable Basis");
    expect(html).toContain("Prefix MAC");
    expect(html).toContain("MAC-RR-20260321");
    expect(html).toContain("MAC-RR-20260321-03");
    expect(html).toContain('class="brand-logo"');
    expect(html).toContain("Recommendation Register");
    expect(html).toContain("Assumption Register");
    expect(html).toContain("Decision Trail");
    expect(html).toContain("Citation Appendix");
    expect(html).toContain("Source Citation Appendix");
    expect(html).toContain("Output Coverage Register");
    expect(html).toContain("Evidence class");
    expect(html).toContain("Benchmark-backed estimate");
    expect(html).toContain("Awaiting field input");
    expect(html).toContain("Needs input");
    expect(html).toContain("Unsupported on lane");
    expect(html).toContain("Enter partition width and height");
    expect(html).toContain("Exact floor family: Knauf CT30 1C");
    expect(html).toContain("https://example.com/source");
    expect(html).toContain("Rw");
    expect(html).toContain("Ln,w");
    expect(html).toContain("Vinyl Flooring");
    expect(html).toContain("Concrete");
    expect(html).toContain("Density");
    expect(html).toContain("Surface Mass");
    expect(html).toContain("1,400 kg/m³");
    expect(html).toContain("432 kg/m²");
    expect(html).toContain("Check flanking &lt;risk&gt; before tender issue.");
    expect(html).not.toContain("Check flanking <risk> before tender issue.");
    expect(html).toContain("Prepared from the DynEcho dynamic calculator.");
  });

  it("builds a lightweight summary html for the simple pdf path", () => {
    const html = buildSimpleWorkbenchProposalSimpleHtml(BASE_DOCUMENT);

    expect(html).toContain("Acoustic Summary Sheet");
    expect(html).toContain("Short-form acoustic issue");
    expect(html).toContain("Layer illustration");
    expect(html).toContain("Measured / predicted indices");
    expect(html).toContain("Visible layer schedule");
    expect(html).toContain("Output coverage register");
    expect(html).toContain("Reference basis");
    expect(html).toContain("Consultant note and assumption register");
    expect(html).toContain("Warnings and issue guardrails");
    expect(html).toContain("ISO 717-1");
    expect(html).toContain("ISO 717-2");
    expect(html).toContain("ISO 16283-1");
    expect(html).toContain("ISO 12354-2");
    expect(html).toContain("Prediction route posture");
    expect(html).toContain("Vinyl Flooring");
    expect(html).toContain("Walking side");
    expect(html).toContain("Ceiling side");
    expect(html).toContain("Rw");
    expect(html).toContain("Ln,w");
    expect(html).toContain("Riverside Development Team");
    expect(html).toContain("Published family estimate is active through reinforced concrete.");
    expect(html).toContain("Prepared from the DynEcho dynamic calculator as a short-form issue sheet.");
  });
});
