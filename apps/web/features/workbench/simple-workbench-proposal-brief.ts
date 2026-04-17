import type { SimpleWorkbenchProposalCitation } from "./simple-workbench-evidence";

export type SimpleWorkbenchProposalBriefTone = "accent" | "neutral" | "success" | "warning";

export type SimpleWorkbenchProposalBriefItem = {
  detail: string;
  label: string;
  tone: SimpleWorkbenchProposalBriefTone;
};

export type SimpleWorkbenchSuggestedIssue = {
  detail: string;
  reference: string;
  revision: string;
};

export type SimpleWorkbenchProposalBrief = {
  assumptionItems: readonly SimpleWorkbenchProposalBriefItem[];
  executiveSummary: string;
  recommendationItems: readonly SimpleWorkbenchProposalBriefItem[];
  suggestedIssue: SimpleWorkbenchSuggestedIssue;
};

const TOKEN_STOP_WORDS = new Set([
  "ACOUSTIC",
  "ACOUSTICS",
  "AND",
  "COMPANY",
  "CONSULTANT",
  "CONSULTANTS",
  "CONSULTING",
  "FOR",
  "GROUP",
  "INC",
  "LAB",
  "LIMITED",
  "LLC",
  "LTD",
  "OF",
  "PROJECT",
  "PTY",
  "SOLUTIONS",
  "STUDY",
  "THE"
]);

function tokenize(value: string): string[] {
  return value
    .toUpperCase()
    .match(/[A-Z0-9]+/g)
    ?.filter((token) => token.length > 0) ?? [];
}

function getCompactIssueDate(issuedOnIso: string): string {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})/u.exec(issuedOnIso);
  if (dateMatch) {
    return `${dateMatch[1]}${dateMatch[2]}${dateMatch[3]}`;
  }

  return "00000000";
}

function sanitizeIssueCodePrefix(issueCodePrefix: string): string {
  return tokenize(issueCodePrefix)
    .join("")
    .slice(0, 6);
}

function buildCompanyCode(consultantCompany: string): string {
  const tokens = tokenize(consultantCompany).filter((token) => !TOKEN_STOP_WORDS.has(token));

  if (tokens.length >= 2) {
    return tokens
      .slice(0, 3)
      .map((token) => token[0])
      .join("")
      .slice(0, 4);
  }

  if (tokens[0]) {
    return tokens[0].slice(0, 3);
  }

  const fallback = tokenize(consultantCompany)[0];
  return fallback ? fallback.slice(0, 3) : "DEC";
}

function buildProjectCode(projectName: string): string {
  const tokens = tokenize(projectName).filter((token) => !TOKEN_STOP_WORDS.has(token));

  if (tokens.length >= 2) {
    return tokens
      .slice(0, 3)
      .map((token) => token[0])
      .join("")
      .slice(0, 4);
  }

  if (tokens[0]) {
    return tokens[0].slice(0, 4);
  }

  return "PRJ";
}

function buildSuggestedIssue(input: {
  consultantCompany: string;
  issueCodePrefix?: string;
  issuedOnIso: string;
  projectName: string;
}): SimpleWorkbenchSuggestedIssue {
  const consultantCode = sanitizeIssueCodePrefix(input.issueCodePrefix ?? "") || buildCompanyCode(input.consultantCompany);
  const projectCode = buildProjectCode(input.projectName);
  const compactDate = getCompactIssueDate(input.issuedOnIso);

  return {
    detail:
      consultantCode === sanitizeIssueCodePrefix(input.issueCodePrefix ?? "")
        ? "Suggested from the profile issue code prefix, project, and issue date so the offer sheet can carry a disciplined document code immediately."
        : "Suggested from consultant, project, and issue date so the offer sheet can carry a disciplined document code immediately.",
    reference: `${consultantCode}-${projectCode}-${compactDate}`,
    revision: "Rev 00"
  };
}

function buildValidationRecommendation(input: {
  validationDetail: string;
  validationLabel: string;
  validationTone: "neutral" | "ready" | "warning";
}): SimpleWorkbenchProposalBriefItem {
  const { validationDetail, validationLabel, validationTone } = input;

  if (validationLabel === "Exact evidence") {
    return {
      detail: `${validationDetail} Keep the cited family or catalog row attached when the sheet is shared outside DynEcho.`,
      label: "Issue as source-backed",
      tone: "success"
    };
  }

  if (validationLabel === "Conservative bound") {
    return {
      detail: `${validationDetail} Treat the current read as a bound only and tighten the topology before calling it delivery-ready.`,
      label: "Narrow the evidence corridor",
      tone: "warning"
    };
  }

  if (validationLabel === "Low-confidence fallback") {
    return {
      detail: `${validationDetail} Use this only for option screening until a narrower published family or measured row is available, and do not present it as delivery-ready.`,
      label: "Keep screening language explicit",
      tone: "warning"
    };
  }

  if (validationLabel === "Scoped estimate") {
    return {
      detail: `${validationDetail} Keep the wording estimate-based and avoid lab-claim or field-measurement language.`,
      label: "Issue as estimate, not measurement",
      tone: validationTone === "ready" ? "success" : "accent"
    };
  }

  return {
    detail: `${validationDetail} Finish the live stack and required route inputs before treating the document as an issue sheet.`,
    label: "Complete the active route first",
    tone: validationTone === "warning" ? "warning" : "neutral"
  };
}

export function buildSimpleWorkbenchProposalBrief(input: {
  briefNote: string;
  citations: readonly SimpleWorkbenchProposalCitation[];
  consultantCompany: string;
  contextLabel: string;
  dynamicBranchDetail: string;
  dynamicBranchLabel: string;
  issueCodePrefix?: string;
  issuedOnIso: string;
  primaryMetricLabel: string;
  primaryMetricValue: string;
  projectName: string;
  reportProfileLabel: string;
  studyContextLabel: string;
  studyModeLabel: string;
  validationDetail: string;
  validationLabel: string;
  validationTone: "neutral" | "ready" | "warning";
  warnings: readonly string[];
}): SimpleWorkbenchProposalBrief {
  const lowConfidenceFallback = input.validationLabel === "Low-confidence fallback";
  const suggestedIssue = buildSuggestedIssue({
    consultantCompany: input.consultantCompany,
    issueCodePrefix: input.issueCodePrefix,
    issuedOnIso: input.issuedOnIso,
    projectName: input.projectName
  });
  const note = input.briefNote.trim();
  const citedSourcesCount = input.citations.filter((citation) => typeof citation.href === "string" && citation.href.length > 0).length;
  const executiveSummary =
    `${input.projectName} currently reads ${input.primaryMetricLabel} ${input.primaryMetricValue}. ` +
    (lowConfidenceFallback
      ? `DynEcho is carrying the stack on a screening-only low-confidence fallback route. `
      : `DynEcho is carrying the stack on the ${input.dynamicBranchLabel.toLowerCase()} route with a ${input.validationLabel.toLowerCase()} posture. `) +
    `${input.studyContextLabel} issue under the ${input.reportProfileLabel.toLowerCase()} profile in ${input.contextLabel.toLowerCase()} context. ` +
    `${input.citations.length} ${lowConfidenceFallback ? "nearby-row " : ""}citation${input.citations.length === 1 ? "" : "s"} are attached` +
    (input.warnings.length > 0
      ? ` and ${input.warnings.length} live warning${input.warnings.length === 1 ? "" : "s"} remain explicit.`
      : lowConfidenceFallback
        ? " and the screening package remains explicit even without an additional live warning."
        : " and no live warning is currently active.");

  const assumptionItems: SimpleWorkbenchProposalBriefItem[] = [
    {
      detail: `${input.validationLabel}. ${input.validationDetail}`,
      label: "Evidence posture",
      tone: input.validationTone === "ready" ? "success" : input.validationTone === "warning" ? "warning" : "accent"
    },
    {
      detail: `${input.dynamicBranchLabel}. ${input.dynamicBranchDetail}`,
      label: "Active route",
      tone: input.validationTone === "warning" ? "warning" : "neutral"
    },
    {
      detail: `${input.studyModeLabel} stack in ${input.contextLabel.toLowerCase()} context. ${input.studyContextLabel} issue under the ${input.reportProfileLabel.toLowerCase()} profile.`,
      label: "Issue frame",
      tone: "neutral"
    },
    {
      detail: note.length > 0 ? note : "No additional consultant note is written yet.",
      label: "Consultant note",
      tone: note.length > 0 ? "success" : "warning"
    },
    {
      detail:
        input.warnings.length > 0
          ? `${input.warnings.length} live warning${input.warnings.length === 1 ? "" : "s"} remain visible. First signal: ${input.warnings[0]}${
              lowConfidenceFallback ? " Keep the current route in screening-only fallback mode while those warnings remain open." : ""
            }`
          : lowConfidenceFallback
            ? "No additional live warning is active, but the current route still stays in screening-only fallback mode."
            : "No live warning flag is active on the current route.",
      label: "Live warning state",
      tone: input.warnings.length > 0 ? "warning" : lowConfidenceFallback ? "warning" : "success"
    },
    {
      detail:
        lowConfidenceFallback && citedSourcesCount > 0
          ? `${input.citations.length} nearby-row source line${input.citations.length === 1 ? "" : "s"} are attached, including ${citedSourcesCount} direct link${citedSourcesCount === 1 ? "" : "s"} for screening audit follow-up.`
          : citedSourcesCount > 0
          ? `${input.citations.length} source line${input.citations.length === 1 ? "" : "s"} are attached, including ${citedSourcesCount} direct link${citedSourcesCount === 1 ? "" : "s"} for audit follow-up.`
          : `${input.citations.length} source line${input.citations.length === 1 ? "" : "s"} are attached, but no direct source link is active yet.`,
      label: "Citation coverage",
      tone: citedSourcesCount > 0 ? (lowConfidenceFallback ? "accent" : "success") : input.citations.length > 0 ? "accent" : "warning"
    }
  ];

  const recommendationItems: SimpleWorkbenchProposalBriefItem[] = [
    buildValidationRecommendation({
      validationDetail: input.validationDetail,
      validationLabel: input.validationLabel,
      validationTone: input.validationTone
    }),
    input.warnings.length > 0
      ? {
          detail: `${input.warnings[0]}${
            lowConfidenceFallback ? " Keep the package in screening mode until a narrower lane is proven." : ""
          }`,
          label: "Resolve the first live blocker",
          tone: "warning"
        }
      : lowConfidenceFallback
        ? {
            detail:
              "No extra live blocker remains, but keep the present stack frozen only as a screening snapshot until a narrower lane is proven.",
            label: "Keep the stack as a screening snapshot",
            tone: "warning"
          }
      : {
          detail: "No live blocker remains on the current route. Keep the present stack frozen if you are issuing it.",
          label: "Freeze the current stack",
          tone: "success"
        },
    input.studyContextLabel === "Pre-tender"
      ? {
          detail: "Lock the topology, issue code, and revision before sending the sheet into tender circulation.",
          label: "Protect issue control",
          tone: "warning"
        }
      : {
          detail: "Keep at least one saved option alongside the preferred stack so the client can see the fallback route.",
          label: "Carry one fallback option",
          tone: "accent"
        },
    lowConfidenceFallback && citedSourcesCount > 0
      ? {
          detail: `${citedSourcesCount} linked nearby-row source line${citedSourcesCount === 1 ? "" : "s"} should travel with the screening package so the fallback evidence stays auditable.`,
          label: "Carry the nearby-row appendix",
          tone: "accent"
        }
      : citedSourcesCount > 0
      ? {
          detail: `${citedSourcesCount} linked source line${citedSourcesCount === 1 ? "" : "s"} are ready to travel with the offer sheet appendix.`,
          label: "Attach the citation appendix",
          tone: "success"
        }
      : {
          detail: "Keep the source posture visible in the transmittal because the current stack does not yet carry a direct linked citation.",
          label: "Do not flatten provenance",
          tone: "warning"
        }
  ];

  return {
    assumptionItems,
    executiveSummary,
    recommendationItems,
    suggestedIssue
  };
}
