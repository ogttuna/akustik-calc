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
  const company = input.consultantCompany.trim() || "DynEcho Acoustic Consulting";
  const customWordmarkLine = input.consultantWordmarkLine?.trim() ?? "";
  const project = input.projectName.trim() || "Untitled acoustic proposal";
  const monogram = buildSimpleWorkbenchProposalMonogram(company);

  switch (input.reportProfile) {
    case "developer":
      return {
        accent: "#40627a",
        accentSoft: "#eaf0f5",
        accentStrong: "#294456",
        coverKicker: `Commercial coordination memo for ${project}. Route choice, live outputs, and parked metrics remain explicit so the client team can read delivery risk without opening the operator desk.`,
        coverLabel: "Developer memo",
        coverTitle: "Acoustic Coordination Memo",
        heroFrom: "#f4f7fa",
        heroTo: "#e7eef3",
        line: "rgba(64, 98, 122, 0.22)",
        monogram,
        profileDetail: "Commercial coordination issue with delivery-facing solver posture.",
        templateLabel: input.reportProfileLabel,
        wordmarkPrimary: company,
        wordmarkSecondary: customWordmarkLine || "Developer memo template"
      };
    case "lab_ready":
      return {
        accent: "#2f6453",
        accentSoft: "#e9f3ee",
        accentStrong: "#21493d",
        coverKicker: `Laboratory-facing technical brief for ${project}. The issue sheet keeps the branch, validation posture, and citation trail visible so the package can move into measured verification without rewriting the calculator reading by hand.`,
        coverLabel: "Lab-ready brief",
        coverTitle: "Laboratory Submission Brief",
        heroFrom: "#f5faf7",
        heroTo: "#e7f0ea",
        line: "rgba(47, 100, 83, 0.22)",
        monogram,
        profileDetail: "Technical brief for lab or verification teams.",
        templateLabel: input.reportProfileLabel,
        wordmarkPrimary: company,
        wordmarkSecondary: customWordmarkLine || "Lab-ready template"
      };
    case "consultant":
    default:
      return {
        accent: "#935d42",
        accentSoft: "#f4e7dc",
        accentStrong: "#6f402a",
        coverKicker: `Formal consultant issue sheet for ${project}. This package preserves route choice, evidence posture, and unsupported lanes instead of flattening them into sales copy.`,
        coverLabel: "Consultant issue",
        coverTitle: "Acoustic Proposal",
        heroFrom: "#fff7ef",
        heroTo: "#f7ecdf",
        line: "rgba(147, 93, 66, 0.2)",
        monogram,
        profileDetail: "Client transmittal with signature-ready consultant framing.",
        templateLabel: input.reportProfileLabel,
        wordmarkPrimary: company,
        wordmarkSecondary: customWordmarkLine || "Consultant issue template"
      };
  }
}
