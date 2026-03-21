import { describe, expect, it } from "vitest";

import { buildSimpleWorkbenchProposalBrief } from "./simple-workbench-proposal-brief";

describe("simple workbench proposal brief", () => {
  it("builds executive summary, assumption register, recommendations, and suggested issue metadata", () => {
    const brief = buildSimpleWorkbenchProposalBrief({
      briefNote: "Check flanking transfer before tender issue.",
      citations: [
        {
          detail: "Exact family row is active.",
          href: "https://www.dataholz.eu/en/index/download/en/gdmtxn01-0.pdf",
          label: "Exact floor family: Dataholz GDMTXN01",
          tone: "success"
        }
      ],
      consultantCompany: "Machinity Acoustic Consultants",
      contextLabel: "Building prediction",
      dynamicBranchDetail: "Published family estimate is active through reinforced concrete.",
      dynamicBranchLabel: "Heavy floating floor",
      issuedOnIso: "2026-03-21T09:30:00.000Z",
      primaryMetricLabel: "Rw",
      primaryMetricValue: "61 dB",
      projectName: "Riverside Residences",
      reportProfileLabel: "Consultant issue",
      studyContextLabel: "Pre-tender",
      studyModeLabel: "Floor",
      validationDetail: "Published family estimate is active. Read this as a supported floor estimate, not as a measured claim.",
      validationLabel: "Scoped estimate",
      validationTone: "neutral",
      warnings: ["Receiving-room volume is still missing for standardized field outputs."]
    });

    expect(brief.executiveSummary).toContain("Riverside Residences currently reads Rw 61 dB.");
    expect(brief.assumptionItems.some((item) => item.label === "Evidence posture")).toBe(true);
    expect(brief.assumptionItems.some((item) => item.label === "Citation coverage")).toBe(true);
    expect(brief.recommendationItems.some((item) => item.label === "Issue as estimate, not measurement")).toBe(true);
    expect(brief.recommendationItems.some((item) => item.label === "Protect issue control")).toBe(true);
    expect(brief.suggestedIssue.reference).toBe("MAC-RR-20260321");
    expect(brief.suggestedIssue.revision).toBe("Rev 00");
  });
});
