import { describe, expect, it } from "vitest";

import {
  buildSimpleWorkbenchProposalMonogram,
  getSimpleWorkbenchProposalBranding,
  inferSimpleWorkbenchReportProfile
} from "./simple-workbench-proposal-branding";

describe("simple workbench proposal branding", () => {
  it("builds a stable company monogram for the proposal cover", () => {
    expect(buildSimpleWorkbenchProposalMonogram("Machinity Acoustic Consultants")).toBe("MAC");
    expect(buildSimpleWorkbenchProposalMonogram("  dyn echo  ")).toBe("DE");
  });

  it("maps report profiles to distinct branded template readings", () => {
    const developerBrand = getSimpleWorkbenchProposalBranding({
      consultantCompany: "Machinity Acoustic Consultants",
      consultantWordmarkLine: "Building Acoustics and Vibration Control",
      projectName: "Riverside Residences",
      reportProfile: "developer",
      reportProfileLabel: "Developer memo"
    });
    const labBrand = getSimpleWorkbenchProposalBranding({
      consultantCompany: "Machinity Acoustic Consultants",
      projectName: "Riverside Residences",
      reportProfile: "lab_ready",
      reportProfileLabel: "Lab-ready brief"
    });

    expect(developerBrand.coverTitle).toBe("Acoustic Coordination Memo");
    expect(developerBrand.templateLabel).toBe("Developer memo");
    expect(developerBrand.wordmarkSecondary).toBe("Building Acoustics and Vibration Control");
    expect(labBrand.coverTitle).toBe("Laboratory Submission Brief");
    expect(labBrand.profileDetail).toContain("lab");
  });

  it("infers a missing raw report profile from the legacy label", () => {
    expect(inferSimpleWorkbenchReportProfile("Developer memo")).toBe("developer");
    expect(inferSimpleWorkbenchReportProfile("Lab-ready brief")).toBe("lab_ready");
    expect(inferSimpleWorkbenchReportProfile("Consultant issue")).toBe("consultant");
  });
});
