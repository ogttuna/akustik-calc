import type { ReportProfile } from "@dynecho/shared";

type SimpleWorkbenchProposalBrandingInput = {
  consultantCompany: string;
  consultantWordmarkLine?: string;
  projectName: string;
  reportProfile: ReportProfile;
  reportProfileLabel: string;
};

export type SimpleWorkbenchProposalBranding = {
  accent: string;
  accentSoft: string;
  accentStrong: string;
  coverKicker: string;
  coverLabel: string;
  coverTitle: string;
  heroFrom: string;
  heroTo: string;
  line: string;
  monogram: string;
  profileDetail: string;
  templateLabel: string;
  wordmarkPrimary: string;
  wordmarkSecondary: string;
};

function compactToken(value: string): string {
  return value.replace(/[^A-Za-z0-9]+/gu, "").toUpperCase();
}

export function inferSimpleWorkbenchReportProfile(reportProfileLabel: string): ReportProfile {
  const normalized = reportProfileLabel.trim().toLowerCase();

  if (normalized.includes("developer")) {
    return "developer";
  }

  if (normalized.includes("lab")) {
    return "lab_ready";
  }

  return "consultant";
}

export function buildSimpleWorkbenchProposalMonogram(consultantCompany: string): string {
  const initials = consultantCompany
    .trim()
    .split(/\s+/u)
    .filter(Boolean)
    .map((segment) => compactToken(segment).slice(0, 1))
    .filter(Boolean)
    .slice(0, 3)
    .join("");

  if (initials.length > 0) {
    return initials;
  }

  const fallback = compactToken(consultantCompany).slice(0, 3);
  return fallback.length > 0 ? fallback : "DYN";
}

export function getSimpleWorkbenchProposalBranding(
  input: SimpleWorkbenchProposalBrandingInput
): SimpleWorkbenchProposalBranding {
  const company = input.consultantCompany.trim() || "DYNECHO Acoustic Consulting";
  const customWordmarkLine = input.consultantWordmarkLine?.trim() ?? "";
  const project = input.projectName.trim() || "Untitled acoustic proposal";
  const monogram = buildSimpleWorkbenchProposalMonogram(company);

  switch (input.reportProfile) {
    case "developer":
      return {
        accent: "#40627a",
        accentSoft: "#eaf0f5",
        accentStrong: "#294456",
        coverKicker: `Commercial acoustic proposal for ${project}. Key acoustic values, construction scope, assumptions, and validity are stated for client review.`,
        coverLabel: "Developer proposal",
        coverTitle: "Acoustic Proposal",
        heroFrom: "#f4f7fa",
        heroTo: "#e7eef3",
        line: "rgba(64, 98, 122, 0.22)",
        monogram,
        profileDetail: "Commercial issue prepared for project coordination and client review.",
        templateLabel: input.reportProfileLabel,
        wordmarkPrimary: company,
        wordmarkSecondary: customWordmarkLine || "Acoustic proposal"
      };
    case "lab_ready":
      return {
        accent: "#2f6453",
        accentSoft: "#e9f3ee",
        accentStrong: "#21493d",
        coverKicker: `Acoustic verification proposal for ${project}. Key values, construction details, reference standards, and notes are stated for technical review.`,
        coverLabel: "Verification proposal",
        coverTitle: "Acoustic Proposal",
        heroFrom: "#f5faf7",
        heroTo: "#e7f0ea",
        line: "rgba(47, 100, 83, 0.22)",
        monogram,
        profileDetail: "Technical issue prepared for verification review.",
        templateLabel: input.reportProfileLabel,
        wordmarkPrimary: company,
        wordmarkSecondary: customWordmarkLine || "Acoustic proposal"
      };
    case "consultant":
    default:
      return {
        accent: "#935d42",
        accentSoft: "#f4e7dc",
        accentStrong: "#6f402a",
        coverKicker: `Acoustic proposal for ${project}. Key values, construction details, assumptions, and validity are stated for client review.`,
        coverLabel: "Consultant proposal",
        coverTitle: "Acoustic Proposal",
        heroFrom: "#fff7ef",
        heroTo: "#f7ecdf",
        line: "rgba(147, 93, 66, 0.2)",
        monogram,
        profileDetail: "Client issue prepared with consultant contact and revision control.",
        templateLabel: input.reportProfileLabel,
        wordmarkPrimary: company,
        wordmarkSecondary: customWordmarkLine || "Acoustic proposal"
      };
  }
}
