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
      issueCodePrefix: "MIA",
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
    expect(brief.suggestedIssue.reference).toBe("MIA-RR-20260321");
    expect(brief.suggestedIssue.revision).toBe("Rev 00");
    expect(brief.suggestedIssue.detail).toContain("profile issue code prefix");
  });

  it("keeps no-warning low-confidence fallback proposals in screening mode", () => {
    const brief = buildSimpleWorkbenchProposalBrief({
      briefNote: "",
      citations: [
        {
          detail: "Nearby published row remains attached for fallback audit.",
          href: "https://example.com/nearby-row",
          label: "Nearby row 1 · elastic-ceiling anchor",
          tone: "warning"
        }
      ],
      consultantCompany: "Machinity Acoustic Consultants",
      contextLabel: "Building prediction",
      dynamicBranchDetail: "Low-confidence reinforced-concrete combined fallback is active.",
      dynamicBranchLabel: "Low-confidence fallback",
      issueCodePrefix: "MIA",
      issuedOnIso: "2026-04-17T09:30:00.000Z",
      primaryMetricLabel: "Ln,w",
      primaryMetricValue: "50 dB",
      projectName: "Reinforced Concrete Accuracy Tightening",
      reportProfileLabel: "Consultant issue",
      studyContextLabel: "Option screening",
      studyModeLabel: "Floor",
      validationDetail: "Low-confidence fallback is active. Mixed nearby-row concrete lane remains explicit.",
      validationLabel: "Low-confidence fallback",
      validationTone: "warning",
      warnings: []
    });

    expect(brief.assumptionItems.find((item) => item.label === "Live warning state")).toEqual(
      expect.objectContaining({
        tone: "warning"
      })
    );
    expect(brief.assumptionItems.find((item) => item.label === "Live warning state")?.detail).toContain(
      "screening-only fallback mode"
    );
    expect(brief.assumptionItems.find((item) => item.label === "Citation coverage")).toEqual(
      expect.objectContaining({
        tone: "accent"
      })
    );
    expect(brief.executiveSummary).toContain("screening-only low-confidence fallback route");
    expect(brief.executiveSummary).toContain("screening package remains explicit");
    expect(brief.recommendationItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Keep screening language explicit",
          tone: "warning"
        }),
        expect.objectContaining({
          label: "Keep the stack as a screening snapshot",
          tone: "warning"
        }),
        expect.objectContaining({
          label: "Carry the nearby-row appendix",
          tone: "accent"
        })
      ])
    );
    expect(brief.recommendationItems.some((item) => item.label === "Freeze the current stack")).toBe(false);
    expect(brief.recommendationItems.some((item) => item.label === "Attach the citation appendix")).toBe(false);
  });
});
