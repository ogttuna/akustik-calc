import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearSimpleWorkbenchProposalCompanyProfiles,
  deleteSimpleWorkbenchProposalCompanyProfile,
  exportSimpleWorkbenchProposalCompanyProfiles,
  getDefaultSimpleWorkbenchProposalCompanyProfile,
  importSimpleWorkbenchProposalCompanyProfiles,
  matchesSimpleWorkbenchProposalCompanyProfile,
  readSimpleWorkbenchProposalCompanyProfiles,
  saveSimpleWorkbenchProposalCompanyProfile,
  setDefaultSimpleWorkbenchProposalCompanyProfile
} from "./simple-workbench-proposal-company-profiles";

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

describe("simple workbench proposal company profiles", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createMemoryStorage());
    vi.stubGlobal("window", { localStorage });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("stores and reloads a local company profile", () => {
    const result = saveSimpleWorkbenchProposalCompanyProfile({
      approverTitle: "Lead Acoustic Consultant",
      consultantAddress: "Maslak District, Istanbul, Turkiye",
      consultantCompany: "Machinity Acoustic Consultants",
      consultantEmail: "offers@machinity-acoustics.com",
      consultantLogoDataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'></svg>",
      consultantPhone: "+90 212 000 00 00",
      consultantWordmarkLine: "Building Acoustics and Vibration Control",
      issueCodePrefix: "MAC",
      label: "Machinity Istanbul",
      preparedBy: "O. Tuna",
      preferredReportProfile: "consultant",
      proposalIssuePurpose: "Client review and acoustic coordination",
      proposalValidityNote: "Valid for 30 calendar days unless superseded by a later issue."
    });

    expect(result.action).toBe("created");
    expect(result.savedProfile.id).toBe("machinity-istanbul");
    expect(readSimpleWorkbenchProposalCompanyProfiles()).toHaveLength(1);
    expect(readSimpleWorkbenchProposalCompanyProfiles()[0]?.consultantCompany).toBe("Machinity Acoustic Consultants");
    expect(readSimpleWorkbenchProposalCompanyProfiles()[0]?.consultantWordmarkLine).toBe(
      "Building Acoustics and Vibration Control"
    );
    expect(readSimpleWorkbenchProposalCompanyProfiles()[0]?.isDefault).toBe(false);
    expect(readSimpleWorkbenchProposalCompanyProfiles()[0]?.issueCodePrefix).toBe("MAC");
    expect(readSimpleWorkbenchProposalCompanyProfiles()[0]?.preferredReportProfile).toBe("consultant");
    expect(readSimpleWorkbenchProposalCompanyProfiles()[0]?.proposalIssuePurpose).toBe("Client review and acoustic coordination");
    expect(readSimpleWorkbenchProposalCompanyProfiles()[0]?.proposalValidityNote).toBe(
      "Valid for 30 calendar days unless superseded by a later issue."
    );
  });

  it("updates an existing profile when the same label is saved again", () => {
    saveSimpleWorkbenchProposalCompanyProfile({
      approverTitle: "Lead Acoustic Consultant",
      consultantAddress: "Maslak District, Istanbul, Turkiye",
      consultantCompany: "Machinity Acoustic Consultants",
      consultantEmail: "offers@machinity-acoustics.com",
      consultantLogoDataUrl: "",
      consultantPhone: "+90 212 000 00 00",
      consultantWordmarkLine: "",
      issueCodePrefix: "",
      label: "Machinity Istanbul",
      preparedBy: "O. Tuna",
      preferredReportProfile: "consultant",
      proposalIssuePurpose: "Client review and acoustic coordination",
      proposalValidityNote: "Valid for 30 calendar days unless superseded by a later issue."
    });

    const result = saveSimpleWorkbenchProposalCompanyProfile({
      approverTitle: "Director of Acoustic Consulting",
      consultantAddress: "Maslak District, Istanbul, Turkiye",
      consultantCompany: "Machinity Acoustic Consultants",
      consultantEmail: "director@machinity-acoustics.com",
      consultantLogoDataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'></svg>",
      consultantPhone: "+90 212 000 00 11",
      consultantWordmarkLine: "Facade, floor, and vibration strategy",
      issueCodePrefix: "MIA",
      label: "Machinity Istanbul",
      preparedBy: "O. Tuna",
      preferredReportProfile: "developer",
      proposalIssuePurpose: "Tender review and design coordination",
      proposalValidityNote: "Budget pricing valid for 21 calendar days."
    });

    expect(result.action).toBe("updated");
    expect(readSimpleWorkbenchProposalCompanyProfiles()).toHaveLength(1);
    expect(readSimpleWorkbenchProposalCompanyProfiles()[0]?.consultantEmail).toBe("director@machinity-acoustics.com");
    expect(readSimpleWorkbenchProposalCompanyProfiles()[0]?.approverTitle).toBe("Director of Acoustic Consulting");
    expect(readSimpleWorkbenchProposalCompanyProfiles()[0]?.consultantLogoDataUrl).toContain("data:image/svg+xml");
    expect(readSimpleWorkbenchProposalCompanyProfiles()[0]?.isDefault).toBe(false);
    expect(readSimpleWorkbenchProposalCompanyProfiles()[0]?.issueCodePrefix).toBe("MIA");
    expect(readSimpleWorkbenchProposalCompanyProfiles()[0]?.preferredReportProfile).toBe("developer");
    expect(readSimpleWorkbenchProposalCompanyProfiles()[0]?.proposalIssuePurpose).toBe("Tender review and design coordination");
    expect(readSimpleWorkbenchProposalCompanyProfiles()[0]?.proposalValidityNote).toBe(
      "Budget pricing valid for 21 calendar days."
    );
  });

  it("can mark one office as the default profile", () => {
    const firstResult = saveSimpleWorkbenchProposalCompanyProfile({
      approverTitle: "Lead Acoustic Consultant",
      consultantAddress: "Maslak District, Istanbul, Turkiye",
      consultantCompany: "Machinity Acoustic Consultants",
      consultantEmail: "offers@machinity-acoustics.com",
      consultantLogoDataUrl: "",
      consultantPhone: "+90 212 000 00 00",
      consultantWordmarkLine: "",
      issueCodePrefix: "MAC",
      label: "Machinity Istanbul",
      preparedBy: "O. Tuna",
      preferredReportProfile: "consultant",
      proposalIssuePurpose: "Client review and acoustic coordination",
      proposalValidityNote: "Valid for 30 calendar days unless superseded by a later issue."
    });
    const secondResult = saveSimpleWorkbenchProposalCompanyProfile({
      approverTitle: "Lead Acoustic Consultant",
      consultantAddress: "Ankara Office",
      consultantCompany: "Machinity Acoustic Consultants Ankara",
      consultantEmail: "ankara@machinity-acoustics.com",
      consultantLogoDataUrl: "",
      consultantPhone: "+90 312 000 00 00",
      consultantWordmarkLine: "",
      issueCodePrefix: "MAN",
      label: "Machinity Ankara",
      preparedBy: "A. Analyst",
      preferredReportProfile: "developer",
      proposalIssuePurpose: "Tender review and design coordination",
      proposalValidityNote: "Pricing valid for 14 calendar days."
    });

    const profiles = setDefaultSimpleWorkbenchProposalCompanyProfile(secondResult.savedProfile.id);

    expect(profiles.find((profile) => profile.id === firstResult.savedProfile.id)?.isDefault).toBe(false);
    expect(profiles.find((profile) => profile.id === secondResult.savedProfile.id)?.isDefault).toBe(true);
    expect(readSimpleWorkbenchProposalCompanyProfiles()[0]?.id).toBe(secondResult.savedProfile.id);
    expect(getDefaultSimpleWorkbenchProposalCompanyProfile()?.id).toBe(secondResult.savedProfile.id);
  });

  it("matches the live consultant identity back to a saved office profile", () => {
    const result = saveSimpleWorkbenchProposalCompanyProfile({
      approverTitle: "Lead Acoustic Consultant",
      consultantAddress: "Maslak District, Istanbul, Turkiye",
      consultantCompany: "Machinity Acoustic Consultants",
      consultantEmail: "offers@machinity-acoustics.com",
      consultantLogoDataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'></svg>",
      consultantPhone: "+90 212 000 00 00",
      consultantWordmarkLine: "Building Acoustics and Vibration Control",
      issueCodePrefix: "MAC",
      label: "Machinity Istanbul",
      preparedBy: "O. Tuna",
      preferredReportProfile: "developer",
      proposalIssuePurpose: "Client review and acoustic coordination",
      proposalValidityNote: "Valid for 30 calendar days unless superseded by a later issue."
    });

    expect(
      matchesSimpleWorkbenchProposalCompanyProfile(result.savedProfile, {
        approverTitle: "Lead Acoustic Consultant",
        consultantAddress: "Maslak District, Istanbul, Turkiye",
        consultantCompany: "Machinity Acoustic Consultants",
        consultantEmail: "OFFERS@machinity-acoustics.com",
        consultantLogoDataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'></svg>",
        consultantPhone: "+90 212 000 00 00",
        consultantWordmarkLine: "Building Acoustics and Vibration Control",
        issueCodePrefix: "MAC",
        preparedBy: "O. Tuna",
        preferredReportProfile: "developer"
      })
    ).toBe(true);
    expect(
      matchesSimpleWorkbenchProposalCompanyProfile(result.savedProfile, {
        approverTitle: "Lead Acoustic Consultant",
        consultantAddress: "Maslak District, Istanbul, Turkiye",
        consultantCompany: "Machinity Acoustic Consultants",
        consultantEmail: "offers@machinity-acoustics.com",
        consultantLogoDataUrl: "",
        consultantPhone: "+90 212 000 00 00",
        consultantWordmarkLine: "Building Acoustics and Vibration Control",
        issueCodePrefix: "MAC",
        preparedBy: "O. Tuna",
        preferredReportProfile: "developer"
      })
    ).toBe(false);
  });

  it("exports and re-imports the company profile library", () => {
    saveSimpleWorkbenchProposalCompanyProfile({
      approverTitle: "Lead Acoustic Consultant",
      consultantAddress: "Maslak District, Istanbul, Turkiye",
      consultantCompany: "Machinity Acoustic Consultants",
      consultantEmail: "offers@machinity-acoustics.com",
      consultantLogoDataUrl: "",
      consultantPhone: "+90 212 000 00 00",
      consultantWordmarkLine: "",
      issueCodePrefix: "MAC",
      isDefault: true,
      label: "Machinity Istanbul",
      preparedBy: "O. Tuna",
      preferredReportProfile: "consultant",
      proposalIssuePurpose: "Client review and acoustic coordination",
      proposalValidityNote: "Valid for 30 calendar days unless superseded by a later issue."
    });

    const exported = exportSimpleWorkbenchProposalCompanyProfiles();
    clearSimpleWorkbenchProposalCompanyProfiles();

    const result = importSimpleWorkbenchProposalCompanyProfiles(exported);

    expect(result.importedCount).toBe(1);
    expect(result.profiles[0]?.label).toBe("Machinity Istanbul");
    expect(result.profiles[0]?.isDefault).toBe(true);
    expect(result.profiles[0]?.issueCodePrefix).toBe("MAC");
    expect(result.profiles[0]?.proposalIssuePurpose).toBe("Client review and acoustic coordination");
    expect(result.profiles[0]?.proposalValidityNote).toBe("Valid for 30 calendar days unless superseded by a later issue.");
  });

  it("deletes saved company profiles and clears the library", () => {
    const result = saveSimpleWorkbenchProposalCompanyProfile({
      approverTitle: "Lead Acoustic Consultant",
      consultantAddress: "Maslak District, Istanbul, Turkiye",
      consultantCompany: "Machinity Acoustic Consultants",
      consultantEmail: "offers@machinity-acoustics.com",
      consultantLogoDataUrl: "",
      consultantPhone: "+90 212 000 00 00",
      consultantWordmarkLine: "",
      issueCodePrefix: "MAC",
      label: "Machinity Istanbul",
      preparedBy: "O. Tuna",
      preferredReportProfile: "consultant",
      proposalIssuePurpose: "Client review and acoustic coordination",
      proposalValidityNote: "Valid for 30 calendar days unless superseded by a later issue."
    });

    const remainingProfiles = deleteSimpleWorkbenchProposalCompanyProfile(result.savedProfile.id);
    expect(remainingProfiles).toHaveLength(0);

    saveSimpleWorkbenchProposalCompanyProfile({
      approverTitle: "Lead Acoustic Consultant",
      consultantAddress: "Maslak District, Istanbul, Turkiye",
      consultantCompany: "Machinity Acoustic Consultants",
      consultantEmail: "offers@machinity-acoustics.com",
      consultantLogoDataUrl: "",
      consultantPhone: "+90 212 000 00 00",
      consultantWordmarkLine: "",
      issueCodePrefix: "MAC",
      label: "Machinity Istanbul",
      preparedBy: "O. Tuna",
      preferredReportProfile: "consultant",
      proposalIssuePurpose: "Client review and acoustic coordination",
      proposalValidityNote: "Valid for 30 calendar days unless superseded by a later issue."
    });
    clearSimpleWorkbenchProposalCompanyProfiles();

    expect(readSimpleWorkbenchProposalCompanyProfiles()).toHaveLength(0);
  });
});
