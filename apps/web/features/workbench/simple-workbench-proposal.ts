import type { ReportProfile } from "@dynecho/shared";

import type {
  SimpleWorkbenchProposalCitation,
  SimpleWorkbenchProposalDecisionItem
} from "./simple-workbench-evidence";
import {
  getSimpleWorkbenchProposalBranding,
  inferSimpleWorkbenchReportProfile
} from "./simple-workbench-proposal-branding";
import { buildSimpleWorkbenchProposalConstructionSection } from "./simple-workbench-proposal-construction-section";
import { buildSimpleWorkbenchProposalDossier } from "./simple-workbench-proposal-dossier";
import type { SimpleWorkbenchProposalBriefItem } from "./simple-workbench-proposal-brief";
import {
  getFallbackSimpleWorkbenchOutputPosture,
  type SimpleWorkbenchOutputPostureTone
} from "./simple-workbench-output-posture";
import {
  DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_ISSUE_PURPOSE,
  DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_VALIDITY_NOTE
} from "./simple-workbench-proposal-policy-presets";

export type SimpleWorkbenchProposalMetric = {
  detail: string;
  label: string;
  value: string;
};

export type SimpleWorkbenchProposalLayer = {
  categoryLabel: string;
  index: number;
  label: string;
  roleLabel?: string;
  thicknessLabel: string;
};

export type SimpleWorkbenchProposalCoverageStatus = "bound" | "live" | "needs_input" | "unsupported";

export type SimpleWorkbenchProposalCoverageItem = {
  detail: string;
  label: string;
  nextStep?: string;
  postureDetail: string;
  postureLabel: string;
  postureTone: SimpleWorkbenchOutputPostureTone;
  status: SimpleWorkbenchProposalCoverageStatus;
  value: string;
};

export type SimpleWorkbenchProposalIssueRegisterItem = {
  detail: string;
  issuedOnLabel: string;
  label: string;
  reference: string;
  statusLabel: string;
};

export type SimpleWorkbenchProposalMethodDossierCard = {
  detail: string;
  label: string;
  tone: "accent" | "neutral" | "success" | "warning";
  value: string;
};

export type SimpleWorkbenchProposalMethodTraceGroup = {
  detail: string;
  label: string;
  notes: readonly string[];
  tone: "accent" | "neutral" | "success" | "warning";
  value: string;
};

export type SimpleWorkbenchProposalCorridorDossierCard = SimpleWorkbenchProposalMethodDossierCard;

export type SimpleWorkbenchProposalDocument = {
  assemblyHeadline: string;
  assumptionItems: readonly SimpleWorkbenchProposalBriefItem[];
  approverTitle: string;
  briefNote: string;
  clientName: string;
  consultantAddress: string;
  consultantCompany: string;
  consultantEmail: string;
  consultantLogoDataUrl: string;
  consultantPhone: string;
  consultantWordmarkLine: string;
  corridorDossierCards: readonly SimpleWorkbenchProposalCorridorDossierCard[];
  corridorDossierHeadline: string;
  contextLabel: string;
  coverageItems: readonly SimpleWorkbenchProposalCoverageItem[];
  dynamicBranchDetail: string;
  dynamicBranchLabel: string;
  executiveSummary: string;
  issuedOnLabel: string;
  issuedOnIso: string;
  layers: readonly SimpleWorkbenchProposalLayer[];
  metrics: readonly SimpleWorkbenchProposalMetric[];
  citations: readonly SimpleWorkbenchProposalCitation[];
  decisionTrailHeadline: string;
  decisionTrailItems: readonly SimpleWorkbenchProposalDecisionItem[];
  issueBaseReference: string;
  issueNextReference: string;
  issueRegisterItems: readonly SimpleWorkbenchProposalIssueRegisterItem[];
  methodDossierCards: readonly SimpleWorkbenchProposalMethodDossierCard[];
  methodDossierHeadline: string;
  methodTraceGroups: readonly SimpleWorkbenchProposalMethodTraceGroup[];
  preparedBy: string;
  primaryMetricLabel: string;
  primaryMetricValue: string;
  projectName: string;
  proposalAttention: string;
  issueCodePrefix: string;
  proposalIssuePurpose: string;
  proposalRecipient: string;
  proposalReference: string;
  proposalRevision: string;
  proposalSubject: string;
  proposalValidityNote: string;
  recommendationItems: readonly SimpleWorkbenchProposalBriefItem[];
  reportProfile: ReportProfile;
  reportProfileLabel: string;
  studyModeLabel: string;
  studyContextLabel: string;
  validationDetail: string;
  validationLabel: string;
  warnings: readonly string[];
};

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function normalizeCoverageItem(value: unknown): SimpleWorkbenchProposalCoverageItem | null {
  if (!isObjectRecord(value)) {
    return null;
  }

  if (
    typeof value.detail !== "string" ||
    typeof value.label !== "string" ||
    typeof value.status !== "string" ||
    typeof value.value !== "string"
  ) {
    return null;
  }

  const status =
    value.status === "live" || value.status === "bound" || value.status === "needs_input" || value.status === "unsupported"
      ? value.status
      : "unsupported";
  const fallbackPosture = getFallbackSimpleWorkbenchOutputPosture(status);

  return {
    detail: value.detail,
    label: value.label,
    nextStep: typeof value.nextStep === "string" ? value.nextStep : undefined,
    postureDetail: typeof value.postureDetail === "string" ? value.postureDetail : fallbackPosture.detail,
    postureLabel: typeof value.postureLabel === "string" ? value.postureLabel : fallbackPosture.label,
    postureTone:
      value.postureTone === "accent" ||
      value.postureTone === "neutral" ||
      value.postureTone === "success" ||
      value.postureTone === "warning"
        ? value.postureTone
        : fallbackPosture.tone,
    status,
    value: value.value
  };
}

export function parseSimpleWorkbenchProposalDocument(value: unknown): SimpleWorkbenchProposalDocument | null {
  if (!isObjectRecord(value)) {
    return null;
  }

  const approverTitle = typeof value.approverTitle === "string" ? value.approverTitle : "Acoustic Consultant";
  const coverageItems = Array.isArray(value.coverageItems)
    ? value.coverageItems.map((item) => normalizeCoverageItem(item)).filter((item): item is SimpleWorkbenchProposalCoverageItem => item !== null)
    : [];
  const issueRegisterItems = Array.isArray(value.issueRegisterItems) ? value.issueRegisterItems : [];
  const methodDossierCards = Array.isArray(value.methodDossierCards) ? value.methodDossierCards : [];
  const methodTraceGroups = Array.isArray(value.methodTraceGroups) ? value.methodTraceGroups : [];
  const corridorDossierCards = Array.isArray(value.corridorDossierCards) ? value.corridorDossierCards : [];
  const consultantAddress =
    typeof value.consultantAddress === "string" ? value.consultantAddress : "Office address not entered";
  const consultantEmail =
    typeof value.consultantEmail === "string" ? value.consultantEmail : "Contact email not entered";
  const consultantLogoDataUrl =
    typeof value.consultantLogoDataUrl === "string" ? value.consultantLogoDataUrl : "";
  const consultantPhone =
    typeof value.consultantPhone === "string" ? value.consultantPhone : "Contact phone not entered";
  const consultantWordmarkLine =
    typeof value.consultantWordmarkLine === "string" ? value.consultantWordmarkLine : "";
  const issueCodePrefix = typeof value.issueCodePrefix === "string" ? value.issueCodePrefix : "";

  if (
    typeof value.assemblyHeadline !== "string" ||
    !Array.isArray(value.assumptionItems) ||
    typeof value.briefNote !== "string" ||
    typeof value.clientName !== "string" ||
    !Array.isArray(value.citations) ||
    typeof value.consultantCompany !== "string" ||
    typeof value.contextLabel !== "string" ||
    !Array.isArray(value.decisionTrailItems) ||
    typeof value.decisionTrailHeadline !== "string" ||
    typeof value.dynamicBranchDetail !== "string" ||
    typeof value.dynamicBranchLabel !== "string" ||
    typeof value.executiveSummary !== "string" ||
    typeof value.issuedOnIso !== "string" ||
    typeof value.issuedOnLabel !== "string" ||
    !Array.isArray(value.layers) ||
    !Array.isArray(value.metrics) ||
    typeof value.preparedBy !== "string" ||
    typeof value.primaryMetricLabel !== "string" ||
    typeof value.primaryMetricValue !== "string" ||
    typeof value.projectName !== "string" ||
    typeof value.proposalReference !== "string" ||
    typeof value.proposalRevision !== "string" ||
    !Array.isArray(value.recommendationItems) ||
    typeof value.reportProfileLabel !== "string" ||
    typeof value.studyContextLabel !== "string" ||
    typeof value.studyModeLabel !== "string" ||
    typeof value.validationDetail !== "string" ||
    typeof value.validationLabel !== "string" ||
    !isStringArray(value.warnings)
  ) {
    return null;
  }

  return {
    ...(value as SimpleWorkbenchProposalDocument),
    approverTitle,
    consultantAddress,
    consultantEmail,
    consultantLogoDataUrl,
    consultantPhone,
    consultantWordmarkLine,
    corridorDossierCards:
      corridorDossierCards.length > 0
        ? (corridorDossierCards as SimpleWorkbenchProposalCorridorDossierCard[])
        : [],
    corridorDossierHeadline:
      typeof value.corridorDossierHeadline === "string"
        ? value.corridorDossierHeadline
        : "No validation corridor snapshot was packaged with this legacy proposal preview.",
    coverageItems,
    issueBaseReference:
      typeof value.issueBaseReference === "string"
        ? value.issueBaseReference
        : typeof value.proposalReference === "string"
          ? value.proposalReference
          : "DEC-PRJ-00000000",
    issueNextReference:
      typeof value.issueNextReference === "string"
        ? value.issueNextReference
        : typeof value.proposalReference === "string"
          ? value.proposalReference
          : "DEC-PRJ-00000000",
    issueRegisterItems:
      issueRegisterItems.length > 0
        ? (issueRegisterItems as SimpleWorkbenchProposalIssueRegisterItem[])
        : [
            {
              detail: "Legacy proposal snapshot without an explicit issue history register.",
              issuedOnLabel: typeof value.issuedOnLabel === "string" ? value.issuedOnLabel : "",
              label: "Current issue",
              reference: typeof value.proposalReference === "string" ? value.proposalReference : "DEC-PRJ-00000000",
              statusLabel: typeof value.proposalRevision === "string" ? value.proposalRevision : "Rev 00"
            }
          ],
    methodDossierCards:
      methodDossierCards.length > 0
        ? (methodDossierCards as SimpleWorkbenchProposalMethodDossierCard[])
        : [],
    methodDossierHeadline:
      typeof value.methodDossierHeadline === "string"
        ? value.methodDossierHeadline
        : "No solver rationale snapshot was packaged with this legacy proposal preview.",
    methodTraceGroups:
      methodTraceGroups.length > 0
        ? (methodTraceGroups as SimpleWorkbenchProposalMethodTraceGroup[])
        : [],
    proposalAttention: typeof value.proposalAttention === "string" ? value.proposalAttention : "Attention line not entered",
    issueCodePrefix,
    proposalIssuePurpose:
      typeof value.proposalIssuePurpose === "string"
        ? value.proposalIssuePurpose
        : DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_ISSUE_PURPOSE,
    proposalRecipient:
      typeof value.proposalRecipient === "string"
        ? value.proposalRecipient
        : typeof value.clientName === "string"
          ? value.clientName
          : "Client delivery team",
    proposalSubject:
      typeof value.proposalSubject === "string"
        ? value.proposalSubject
        : typeof value.projectName === "string"
          ? `${value.projectName} acoustic proposal`
          : "Acoustic performance proposal",
    proposalValidityNote:
      typeof value.proposalValidityNote === "string"
        ? value.proposalValidityNote
        : DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_VALIDITY_NOTE,
    reportProfile:
      typeof value.reportProfile === "string" &&
      (value.reportProfile === "consultant" || value.reportProfile === "developer" || value.reportProfile === "lab_ready")
        ? value.reportProfile
        : inferSimpleWorkbenchReportProfile(
            typeof value.reportProfileLabel === "string" ? value.reportProfileLabel : ""
          )
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function renderListItems(values: readonly string[]): string {
  return values.map((value) => `<li>${escapeHtml(value)}</li>`).join("");
}

function renderDecisionTrailItems(items: readonly SimpleWorkbenchProposalDecisionItem[]): string {
  return items
    .map(
      (item) => `
        <div class="method-box">
          <div class="eyebrow" style="margin-bottom: 8px;">${escapeHtml(item.label)}</div>
          <p>${escapeHtml(item.detail)}</p>
        </div>
      `
    )
    .join("");
}

function renderMemoItems(items: readonly SimpleWorkbenchProposalBriefItem[]): string {
  return items
    .map(
      (item) => `
        <div class="method-box">
          <div class="eyebrow" style="margin-bottom: 8px;">${escapeHtml(item.label)}</div>
          <p>${escapeHtml(item.detail)}</p>
        </div>
      `
    )
    .join("");
}

function renderCitationItems(citations: readonly SimpleWorkbenchProposalCitation[]): string {
  return citations
    .map((citation) => {
      const hrefLine = citation.href
        ? `<p class="citation-link"><a href="${escapeHtml(citation.href)}">${escapeHtml(citation.href)}</a></p>`
        : "";

      return `
        <div class="method-box">
          <div class="eyebrow" style="margin-bottom: 8px;">${escapeHtml(citation.label)}</div>
          <p>${escapeHtml(citation.detail)}</p>
          ${hrefLine}
        </div>
      `;
    })
    .join("");
}

function renderDossierItems(items: readonly { detail: string; label: string; value: string }[]): string {
  return items
    .map(
      (item) => `
        <div class="method-box">
          <div class="eyebrow" style="margin-bottom: 8px;">${escapeHtml(item.label)}</div>
          <h3>${escapeHtml(item.value)}</h3>
          <p>${escapeHtml(item.detail)}</p>
        </div>
      `
    )
    .join("");
}

function renderMethodTraceGroups(groups: readonly SimpleWorkbenchProposalMethodTraceGroup[]): string {
  return groups
    .map(
      (group) => `
        <div class="method-box">
          <div class="eyebrow" style="margin-bottom: 8px;">${escapeHtml(group.label)}</div>
          <h3>${escapeHtml(group.value)}</h3>
          <p>${escapeHtml(group.detail)}</p>
          ${group.notes.length > 0 ? `<ul style="margin-top: 12px;">${renderListItems(group.notes)}</ul>` : ""}
        </div>
      `
    )
    .join("");
}

function formatCoverageStatus(status: SimpleWorkbenchProposalCoverageStatus): string {
  switch (status) {
    case "live":
      return "Live now";
    case "bound":
      return "Conservative bound";
    case "needs_input":
      return "Needs input";
    case "unsupported":
    default:
      return "Unsupported on lane";
  }
}

function renderCoverageRows(items: readonly SimpleWorkbenchProposalCoverageItem[]): string {
  return items
    .map((item) => {
      const nextStep = item.nextStep ? ` Next action: ${escapeHtml(item.nextStep)}.` : "";

      return `
        <tr>
          <td>${escapeHtml(item.label)}</td>
          <td>${escapeHtml(formatCoverageStatus(item.status))}</td>
          <td>${escapeHtml(item.postureLabel)}</td>
          <td>${escapeHtml(item.value)}</td>
          <td>${escapeHtml(item.detail)}${nextStep} Evidence class: ${escapeHtml(item.postureDetail)}</td>
        </tr>
      `;
    })
    .join("");
}

function renderIssueRegisterRows(items: readonly SimpleWorkbenchProposalIssueRegisterItem[]): string {
  return items
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.label)}</td>
          <td>${escapeHtml(item.reference)}</td>
          <td>${escapeHtml(item.statusLabel)}</td>
          <td>${escapeHtml(item.issuedOnLabel)}</td>
          <td>${escapeHtml(item.detail)}</td>
        </tr>
      `
    )
    .join("");
}

function renderMetricRows(metrics: readonly SimpleWorkbenchProposalMetric[]): string {
  return metrics
    .map(
      (metric) => `
        <tr>
          <td>${escapeHtml(metric.label)}</td>
          <td>${escapeHtml(metric.value)}</td>
          <td>${escapeHtml(metric.detail)}</td>
        </tr>
      `
    )
    .join("");
}

function renderLayerRows(layers: readonly SimpleWorkbenchProposalLayer[]): string {
  return layers
    .map(
      (layer) => `
        <tr>
          <td>${layer.index}</td>
          <td>${escapeHtml(layer.label)}</td>
          <td>${escapeHtml(layer.thicknessLabel)}</td>
          <td>${escapeHtml(layer.roleLabel ?? layer.categoryLabel)}</td>
          <td>${escapeHtml(layer.categoryLabel)}</td>
        </tr>
      `
    )
    .join("");
}

function renderConstructionFigure(document: SimpleWorkbenchProposalDocument): string {
  const section = buildSimpleWorkbenchProposalConstructionSection(document.layers, document.studyModeLabel);

  if (section.bands.length === 0) {
    return `
      <div class="method-box">
        <h3>Construction section unavailable</h3>
        <p>No visible rows are packaged yet, so DynEcho cannot draw the client-facing construction section.</p>
      </div>
    `;
  }

  return `
    <div class="construction-grid">
      <div class="construction-figure">
        <div class="construction-axis">
          <span>${escapeHtml(section.anchorFromLabel)}</span>
          <span>${escapeHtml(section.headline)}</span>
        </div>
        <div class="construction-stack ${section.isWall ? "construction-stack-wall" : "construction-stack-floor"}">
          ${section.bands
            .map(
              (band) => `
                <div class="construction-band construction-band-${band.tone}" style="flex-grow: ${band.flexGrow};">
                  <div class="construction-index">${escapeHtml(band.indexLabel)}</div>
                  <div class="construction-copy">
                    <strong>${escapeHtml(band.label)}</strong>
                    <small>${escapeHtml(band.thicknessLabel)}</small>
                  </div>
                </div>
              `
            )
            .join("")}
        </div>
        <div class="construction-axis">
          <span>${escapeHtml(section.anchorToLabel)}</span>
          <span>${escapeHtml(section.totalThicknessLabel)}</span>
        </div>
      </div>
      <div class="construction-legend">
        <div class="method-box">
          <div class="eyebrow" style="margin-bottom: 8px;">Technical schedule legend</div>
          <h3>${escapeHtml(section.totalThicknessLabel)}</h3>
          <p>${escapeHtml(section.headline)}</p>
        </div>
        <div class="construction-legend-grid">
          ${section.bands
            .map(
              (band) => `
                <div class="construction-legend-row">
                  <span>${escapeHtml(band.indexLabel)}</span>
                  <div>
                    <strong>${escapeHtml(band.label)}</strong>
                    <small>${escapeHtml(band.metaLabel)}</small>
                  </div>
                  <small>${escapeHtml(band.thicknessLabel)}</small>
                </div>
              `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function buildIssueAuthorityText(document: SimpleWorkbenchProposalDocument): string {
  return `${document.preparedBy}, ${document.approverTitle}, is issuing ${document.proposalReference} ${document.proposalRevision} on behalf of ${document.consultantCompany} for ${document.clientName}.`;
}

function buildIssueCodePrefixLabel(document: SimpleWorkbenchProposalDocument): string {
  return document.issueCodePrefix.trim().length > 0 ? document.issueCodePrefix.trim() : "Auto from consultant";
}

export function buildSimpleWorkbenchProposalFilename(projectName: string): string {
  return `${slugify(projectName) || "dynecho-acoustic-proposal"}-proposal`;
}

export function buildSimpleWorkbenchProposalText(document: SimpleWorkbenchProposalDocument): string {
  const branding = getSimpleWorkbenchProposalBranding({
    consultantCompany: document.consultantCompany,
    consultantWordmarkLine: document.consultantWordmarkLine,
    projectName: document.projectName,
    reportProfile: document.reportProfile,
    reportProfileLabel: document.reportProfileLabel
  });
  const dossier = buildSimpleWorkbenchProposalDossier(document);
  const constructionSection = buildSimpleWorkbenchProposalConstructionSection(document.layers, document.studyModeLabel);
  const warningLines =
    document.warnings.length > 0
      ? document.warnings.map((warning) => `- ${warning}`)
      : ["- No live warning flags on the active route."];
  const noteLine =
    document.briefNote.trim().length > 0
      ? document.briefNote.trim()
      : "No additional consultant note entered.";

  return [
    `Acoustic Proposal | ${document.projectName}`,
    `Client: ${document.clientName}`,
    `Consultant: ${document.consultantCompany}`,
    `Prepared by: ${document.preparedBy}`,
    `Role: ${document.approverTitle}`,
    `Brand line: ${branding.wordmarkSecondary}`,
    `Contact: ${document.consultantEmail} | ${document.consultantPhone}`,
    `Office: ${document.consultantAddress}`,
    `Issued to: ${document.proposalRecipient}`,
    `Attention: ${document.proposalAttention}`,
    `Subject: ${document.proposalSubject}`,
    `Issue purpose: ${document.proposalIssuePurpose}`,
    `Validity: ${document.proposalValidityNote}`,
    `Issue: ${document.proposalReference} | ${document.proposalRevision}`,
    `Issued: ${document.issuedOnLabel}`,
    `Issue code prefix: ${buildIssueCodePrefixLabel(document)}`,
    `Study: ${document.studyModeLabel} | ${document.contextLabel} | ${document.studyContextLabel} | ${document.reportProfileLabel}`,
    `Template: ${branding.templateLabel} | ${branding.coverTitle} | ${branding.wordmarkPrimary}`,
    `Primary read: ${document.primaryMetricLabel} ${document.primaryMetricValue}`,
    "",
    "Executive summary",
    document.executiveSummary,
    "",
    "Issue dossier",
    `Headline: ${dossier.headline}`,
    ...dossier.items.map((item) => `- ${item.label}: ${item.value} | ${item.detail}`),
    "",
    ...(document.corridorDossierCards.length > 0
      ? [
          "Validation corridor package",
          `Headline: ${document.corridorDossierHeadline}`,
          ...document.corridorDossierCards.map((item) => `- ${item.label}: ${item.value} | ${item.detail}`),
          ""
        ]
      : []),
    "Solver rationale appendix",
    `Headline: ${document.methodDossierHeadline}`,
    ...document.methodDossierCards.map((item) => `- ${item.label}: ${item.value} | ${item.detail}`),
    ...document.methodTraceGroups.flatMap((group) => [
      `- ${group.label}: ${group.value} | ${group.detail}`,
      ...group.notes.map((note) => `  * ${note}`)
    ]),
    "",
    "Assembly summary",
    `${document.assemblyHeadline}`,
    "",
    "Construction section",
    `${constructionSection.anchorFromLabel} -> ${constructionSection.anchorToLabel} | ${constructionSection.totalThicknessLabel}`,
    ...constructionSection.bands.map(
      (band) => `- ${band.indexLabel}. ${band.label} | ${band.thicknessLabel} | ${band.metaLabel}`
    ),
    "",
    "Solver route",
    `${document.dynamicBranchLabel}: ${document.dynamicBranchDetail}`,
    "",
    "Validation posture",
    `${document.validationLabel}: ${document.validationDetail}`,
    "",
    "Issue authority",
    buildIssueAuthorityText(document),
    `Issued: ${document.issuedOnLabel}`,
    `Purpose: ${document.proposalIssuePurpose}`,
    `Validity: ${document.proposalValidityNote}`,
    "",
    "Issue control register",
    `Issue code prefix: ${buildIssueCodePrefixLabel(document)}`,
    `Base reference: ${document.issueBaseReference}`,
    `Next available issue no: ${document.issueNextReference}`,
    ...document.issueRegisterItems.map(
      (item) => `- ${item.label}: ${item.reference} | ${item.statusLabel} | ${item.issuedOnLabel} | ${item.detail}`
    ),
    "",
    "Decision trail",
    `Headline: ${document.decisionTrailHeadline}`,
    ...document.decisionTrailItems.map((item) => `- ${item.label}: ${item.detail}`),
    "",
    "Assumption register",
    ...document.assumptionItems.map((item) => `- ${item.label}: ${item.detail}`),
    "",
    "Recommended next steps",
    ...document.recommendationItems.map((item) => `- ${item.label}: ${item.detail}`),
    "",
    "Source citations",
    ...document.citations.map((citation) =>
      `- ${citation.label}: ${citation.detail}${citation.href ? ` | ${citation.href}` : ""}`
    ),
    "",
    "Output coverage register",
    ...document.coverageItems.map(
      (item) =>
        `- ${item.label}: ${formatCoverageStatus(item.status)} | ${item.postureLabel} | ${item.value} | ${item.detail}${item.nextStep ? ` | Next action: ${item.nextStep}` : ""} | Evidence class: ${item.postureDetail}`
    ),
    "",
    "Live outputs",
    ...document.metrics.map((metric) => `- ${metric.label}: ${metric.value} (${metric.detail})`),
    "",
    "Layer schedule",
    ...document.layers.map(
      (layer) =>
        `${layer.index}. ${layer.label} | ${layer.thicknessLabel} | ${layer.roleLabel ?? layer.categoryLabel} | ${layer.categoryLabel}`
    ),
    "",
    "Assumptions and warnings",
    ...warningLines,
    "",
    "Consultant note",
    noteLine,
    "",
    "Prepared from the DynEcho dynamic calculator. This sheet summarizes a project estimate and does not replace accredited laboratory or site measurements."
  ].join("\n");
}

export function buildSimpleWorkbenchProposalHtml(document: SimpleWorkbenchProposalDocument): string {
  const branding = getSimpleWorkbenchProposalBranding({
    consultantCompany: document.consultantCompany,
    consultantWordmarkLine: document.consultantWordmarkLine,
    projectName: document.projectName,
    reportProfile: document.reportProfile,
    reportProfileLabel: document.reportProfileLabel
  });
  const dossier = buildSimpleWorkbenchProposalDossier(document);
  const constructionSection = buildSimpleWorkbenchProposalConstructionSection(document.layers, document.studyModeLabel);
  const warningItems =
    document.warnings.length > 0
      ? renderListItems(document.warnings)
      : "<li>No live warning flags on the active route.</li>";
  const consultantNote =
    document.briefNote.trim().length > 0
      ? escapeHtml(document.briefNote.trim())
      : "No additional consultant note entered.";
  const liveCoverageCount = dossier.readyCoverageCount;
  const parkedCoverageCount = dossier.parkedCoverageCount;
  const unsupportedCoverageCount = dossier.unsupportedCoverageCount;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(buildSimpleWorkbenchProposalFilename(document.projectName))}</title>
    <style>
      :root {
        color-scheme: light;
        --ink: #17302d;
        --ink-soft: #49625e;
        --line: #d6ddd8;
        --paper: #f6f4ef;
        --panel: #fffdf8;
        --accent: ${branding.accent};
        --accent-soft: ${branding.accentSoft};
        --brand-hero-from: ${branding.heroFrom};
        --brand-hero-to: ${branding.heroTo};
        --brand-strong: ${branding.accentStrong};
        --brand-line: ${branding.line};
        --warning: #a05a3a;
        --warning-soft: #f6e7de;
      }

      @page {
        margin: 16mm;
        size: A4;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        color: var(--ink);
        background: var(--paper);
        font-family: "Georgia", "Times New Roman", serif;
      }

      .sheet {
        width: 100%;
        max-width: 210mm;
        margin: 0 auto;
        padding: 12mm 10mm 16mm;
      }

      .frame {
        border: 1px solid var(--line);
        background: var(--panel);
      }

      .hero {
        padding: 12mm 12mm 9mm;
        border-bottom: 1px solid var(--line);
        background:
          linear-gradient(135deg, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%),
          linear-gradient(180deg, rgba(22, 42, 39, 0.03), rgba(22, 42, 39, 0));
      }

      .eyebrow {
        font: 700 10px/1.4 Arial, sans-serif;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: var(--ink-soft);
      }

      h1 {
        margin: 14px 0 6px;
        font-size: 30px;
        line-height: 1;
        letter-spacing: -0.04em;
      }

      .lede {
        margin: 0;
        font: 400 14px/1.7 Arial, sans-serif;
        color: var(--ink-soft);
      }

      .hero-grid,
      .issue-grid,
      .summary-grid,
      .detail-grid {
        display: grid;
        gap: 12px;
      }

      .hero-grid {
        grid-template-columns: 1.4fr 0.9fr;
        margin-top: 18px;
      }

      .issue-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
        margin-top: 12px;
      }

      .summary-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
        margin-top: 18px;
      }

      .detail-grid {
        grid-template-columns: 1fr 1fr;
        padding: 10mm 12mm 0;
      }

      .card,
      .metric,
      .note-box {
        border: 1px solid var(--line);
        background: #fffdfa;
        padding: 12px 14px;
      }

      .card strong,
      .metric strong {
        display: block;
        font: 700 11px/1.4 Arial, sans-serif;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--ink-soft);
      }

      .card span,
      .metric span {
        display: block;
        margin-top: 7px;
        font: 700 17px/1.3 Arial, sans-serif;
        color: var(--ink);
      }

      .metric small,
      .card small {
        display: block;
        margin-top: 7px;
        font: 400 12px/1.6 Arial, sans-serif;
        color: var(--ink-soft);
      }

      .primary-metric {
        border-color: color-mix(in srgb, var(--accent) 32%, transparent);
        background: var(--accent-soft);
      }

      .section {
        padding: 0 12mm 10mm;
      }

      .section h2 {
        margin: 0 0 10px;
        font-size: 18px;
        letter-spacing: -0.03em;
      }

      .page {
        break-after: page;
      }

      .page:last-child {
        break-after: auto;
      }

      .cover-frame {
        min-height: 265mm;
        display: flex;
        flex-direction: column;
      }

      .cover-hero {
        padding: 16mm 12mm 14mm;
        border-bottom: 1px solid var(--line);
        background:
          radial-gradient(circle at top right, color-mix(in srgb, var(--accent) 18%, transparent), transparent 45%),
          linear-gradient(135deg, var(--brand-hero-from), var(--brand-hero-to));
      }

      .cover-grid,
      .signature-grid {
        display: grid;
        gap: 12px;
      }

      .cover-grid {
        grid-template-columns: 1.3fr 0.85fr;
        margin-top: 20px;
      }

      .signature-grid {
        grid-template-columns: 1fr 1fr;
      }

      .cover-title {
        max-width: 11ch;
        margin: 18px 0 0;
        font-size: 44px;
        line-height: 0.94;
        letter-spacing: -0.05em;
      }

      .brand-hero-row {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
      }

      .brand-mark {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .brand-monogram {
        width: 68px;
        height: 68px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--brand-line);
        background: var(--brand-strong);
        color: #fff8f2;
        font: 700 24px/1 Arial, sans-serif;
        letter-spacing: 0.16em;
      }

      .brand-logo {
        width: 68px;
        height: 68px;
        object-fit: contain;
        border: 1px solid var(--brand-line);
        background: rgba(255, 253, 248, 0.88);
        padding: 8px;
      }

      .brand-stack strong {
        display: block;
        font: 700 19px/1.3 Arial, sans-serif;
        color: var(--ink);
      }

      .brand-stack small {
        display: block;
        margin-top: 6px;
        font: 400 12px/1.6 Arial, sans-serif;
        color: var(--ink-soft);
      }

      .template-pill {
        display: inline-flex;
        align-items: center;
        border: 1px solid var(--brand-line);
        background: rgba(255, 253, 248, 0.82);
        padding: 8px 12px;
        font: 700 10px/1.4 Arial, sans-serif;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--ink-soft);
      }

      .template-pill span {
        margin-left: 8px;
        letter-spacing: 0.08em;
        color: var(--ink);
      }

      .construction-grid {
        display: grid;
        gap: 14px;
        grid-template-columns: minmax(0, 0.68fr) minmax(0, 1fr);
      }

      .construction-figure {
        border: 1px solid var(--line);
        background: color-mix(in srgb, var(--accent) 7%, var(--paper));
        padding: 16px;
      }

      .construction-axis {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        font: 700 10px/1.4 Arial, sans-serif;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--ink-faint);
      }

      .construction-stack {
        margin-top: 14px;
        overflow: hidden;
        border: 1px solid var(--line);
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.54), rgba(255, 255, 255, 0.12));
      }

      .construction-stack-floor {
        min-height: 220px;
        display: flex;
        flex-direction: column;
      }

      .construction-stack-wall {
        min-height: 130px;
        display: flex;
      }

      .construction-band {
        display: grid;
        gap: 10px;
        min-width: 0;
        padding: 12px;
        border-right: 1px solid var(--line);
        border-bottom: 1px solid var(--line);
      }

      .construction-band:last-child {
        border-right: 0;
        border-bottom: 0;
      }

      .construction-band-leading {
        background: color-mix(in srgb, var(--accent) 14%, var(--paper));
      }

      .construction-band-interior {
        background: rgba(255, 253, 248, 0.82);
      }

      .construction-band-trailing {
        background: color-mix(in srgb, var(--ink) 8%, var(--paper));
      }

      .construction-index {
        width: 24px;
        height: 24px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--line);
        background: rgba(255, 253, 248, 0.86);
        font: 700 10px/1 Arial, sans-serif;
        color: var(--ink);
      }

      .construction-copy strong,
      .construction-legend-row strong {
        display: block;
        font: 700 13px/1.45 Arial, sans-serif;
        color: var(--ink);
      }

      .construction-copy small,
      .construction-legend-row small {
        display: block;
        margin-top: 4px;
        font: 400 11px/1.5 Arial, sans-serif;
        color: var(--ink-soft);
      }

      .construction-legend {
        display: grid;
        gap: 12px;
      }

      .construction-legend-grid {
        display: grid;
        gap: 10px;
      }

      .construction-legend-row {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        gap: 12px;
        align-items: center;
        border: 1px solid var(--line);
        background: rgba(255, 253, 248, 0.86);
        padding: 12px;
      }

      .construction-legend-row > span:first-child {
        font: 700 13px/1 Arial, sans-serif;
        color: var(--ink);
      }

      .construction-legend-row > small:last-child {
        margin-top: 0;
        text-align: right;
      }

      .cover-kicker {
        margin: 10px 0 0;
        font: 400 15px/1.8 Arial, sans-serif;
        color: var(--ink-soft);
      }

      .cover-stack {
        display: grid;
        gap: 12px;
      }

      .cover-summary {
        border: 1px solid var(--line);
        background: var(--accent-soft);
        padding: 18px;
      }

      .cover-summary p {
        margin: 12px 0 0;
        font: 400 13px/1.8 Arial, sans-serif;
        color: var(--ink);
      }

      .signature-box {
        min-height: 128px;
        border: 1px solid var(--line);
        background: #fffdfa;
        padding: 16px 16px 14px;
      }

      .signature-line {
        margin-top: 42px;
        border-top: 1px solid var(--ink);
        padding-top: 8px;
        font: 400 11px/1.6 Arial, sans-serif;
        color: var(--ink-soft);
      }

      .signature-meta {
        margin: 8px 0 0;
        font: 400 12px/1.7 Arial, sans-serif;
        color: var(--ink-soft);
      }

      .page-header {
        padding: 10mm 12mm 8mm;
        border-bottom: 1px solid var(--line);
        background: linear-gradient(180deg, rgba(22, 42, 39, 0.03), rgba(22, 42, 39, 0));
      }

      .page-header-grid {
        display: grid;
        gap: 12px;
        grid-template-columns: 1.1fr 0.9fr;
      }

      .appendix-strip {
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        margin-top: 16px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font: 400 12px/1.6 Arial, sans-serif;
      }

      th,
      td {
        padding: 10px 9px;
        border-bottom: 1px solid var(--line);
        vertical-align: top;
        text-align: left;
      }

      th {
        font-size: 10px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--ink-soft);
      }

      ul {
        margin: 0;
        padding-left: 18px;
        font: 400 12px/1.7 Arial, sans-serif;
        color: var(--ink-soft);
      }

      li + li {
        margin-top: 6px;
      }

      .method-box {
        border: 1px solid var(--line);
        background: #fffdfa;
        padding: 14px;
        break-inside: avoid;
      }

      .method-box h3 {
        margin: 0 0 6px;
        font-size: 14px;
      }

      .method-box p {
        margin: 0;
        font: 400 12px/1.7 Arial, sans-serif;
        color: var(--ink-soft);
      }

      .citation-link {
        margin-top: 8px !important;
        word-break: break-word;
      }

      .citation-link a {
        color: var(--accent);
        text-decoration: none;
      }

      .note-box {
        margin-top: 12px;
        background: var(--warning-soft);
        border-color: rgba(160, 90, 58, 0.24);
      }

      .note-box p {
        margin: 0;
        font: 400 12px/1.7 Arial, sans-serif;
        color: var(--ink);
      }

      .footer {
        padding: 0 12mm 12mm;
        font: 400 11px/1.7 Arial, sans-serif;
        color: var(--ink-soft);
      }

      @media (max-width: 900px) {
        .hero-grid,
        .cover-grid,
        .issue-grid,
        .appendix-strip,
        .summary-grid,
        .detail-grid,
        .page-header-grid,
        .signature-grid,
        .construction-grid {
          grid-template-columns: 1fr;
        }

        .construction-legend-row {
          grid-template-columns: auto minmax(0, 1fr);
        }

        .construction-legend-row > small:last-child {
          text-align: left;
        }
      }

      @media print {
        body {
          background: white;
        }

        .sheet {
          padding: 0;
        }
      }
    </style>
  </head>
  <body>
    <main class="sheet">
      <section class="frame cover-frame page">
        <header class="cover-hero">
          <div class="brand-hero-row">
            <div class="brand-mark">
              ${
                document.consultantLogoDataUrl
                  ? `<img alt="${escapeHtml(document.consultantCompany)} logo" class="brand-logo" src="${escapeHtml(document.consultantLogoDataUrl)}" />`
                  : `<div class="brand-monogram">${escapeHtml(branding.monogram)}</div>`
              }
              <div class="brand-stack">
                <div class="eyebrow">${escapeHtml(branding.coverLabel)}</div>
                <strong>${escapeHtml(branding.wordmarkPrimary)}</strong>
                <small>${escapeHtml(branding.wordmarkSecondary)}</small>
              </div>
            </div>
            <div class="template-pill">
              Template
              <span>${escapeHtml(branding.templateLabel)}</span>
            </div>
          </div>
          <div class="eyebrow" style="margin-top: 20px;">DynEcho Dynamic Calculator</div>
          <h1 class="cover-title">${escapeHtml(branding.coverTitle)}</h1>
          <p class="cover-kicker">
            ${escapeHtml(branding.coverKicker)}
          </p>
          <div class="cover-grid">
            <div class="cover-stack">
              <div class="card">
                <strong>Project</strong>
                <span>${escapeHtml(document.projectName)}</span>
                <small>${escapeHtml(document.clientName)} | ${escapeHtml(document.studyContextLabel)} | ${escapeHtml(document.reportProfileLabel)}</small>
              </div>
              <div class="card">
                <strong>Issued to</strong>
                <span>${escapeHtml(document.proposalRecipient)}</span>
                <small>${escapeHtml(document.proposalAttention)}<br />${escapeHtml(document.proposalSubject)}<br />${escapeHtml(document.proposalIssuePurpose)}<br />${escapeHtml(document.proposalValidityNote)}</small>
              </div>
              <div class="cover-summary">
                <div class="eyebrow">${escapeHtml(branding.coverLabel)}</div>
                <h3 style="margin: 10px 0 0;">${escapeHtml(branding.profileDetail)}</h3>
                <p>${escapeHtml(document.executiveSummary)}</p>
              </div>
            </div>
            <div class="cover-stack">
              <div class="metric primary-metric">
                <strong>Primary read</strong>
                <span>${escapeHtml(document.primaryMetricLabel)} ${escapeHtml(document.primaryMetricValue)}</span>
                <small>${escapeHtml(document.assemblyHeadline)}</small>
              </div>
              <div class="card">
                <strong>Issue</strong>
                <span>${escapeHtml(document.proposalReference)}</span>
                <small>${escapeHtml(document.proposalRevision)} | ${escapeHtml(document.issuedOnLabel)}<br />Prefix ${escapeHtml(buildIssueCodePrefixLabel(document))} · Base ${escapeHtml(document.issueBaseReference)}</small>
              </div>
              <div class="card">
                <strong>Consultant</strong>
                <span>${escapeHtml(document.consultantCompany)}</span>
                <small>${escapeHtml(document.preparedBy)} | ${escapeHtml(document.approverTitle)} | ${escapeHtml(document.studyModeLabel)} study</small>
              </div>
              <div class="card">
                <strong>Company identity</strong>
                <span>${escapeHtml(document.consultantEmail)}</span>
                <small>${escapeHtml(document.consultantPhone)}<br />${escapeHtml(document.consultantAddress)}</small>
              </div>
            </div>
          </div>
        </header>

        <section class="section" style="padding-top: 10mm;">
          <div class="detail-grid" style="padding: 0;">
            <div class="method-box">
              <div class="eyebrow" style="margin-bottom: 8px;">Scope</div>
              <h3>Client transmittal reading</h3>
              <p>${escapeHtml(document.dynamicBranchLabel)} is active on the current route. ${escapeHtml(document.validationLabel)} remains explicit so the issue can move into review without overstating evidence quality.</p>
            </div>
            <div class="method-box">
              <div class="eyebrow" style="margin-bottom: 8px;">Issue authority</div>
              <h3>Prepared for client review</h3>
              <p>${escapeHtml(buildIssueAuthorityText(document))}</p>
            </div>
            <div class="method-box">
              <div class="eyebrow" style="margin-bottom: 8px;">Issue register</div>
              <h3>Revision control snapshot</h3>
              <p>Code prefix ${escapeHtml(buildIssueCodePrefixLabel(document))} is feeding the base stem. Base reference ${escapeHtml(document.issueBaseReference)} is active. Next browser-local issue number currently reads ${escapeHtml(document.issueNextReference)}.</p>
            </div>
            <div class="method-box">
              <div class="eyebrow" style="margin-bottom: 8px;">Transmittal</div>
              <h3>Recipient and subject</h3>
              <p>Issued to ${escapeHtml(document.proposalRecipient)}. ${escapeHtml(document.proposalAttention)}. Subject: ${escapeHtml(document.proposalSubject)}. Purpose: ${escapeHtml(document.proposalIssuePurpose)}. Validity: ${escapeHtml(document.proposalValidityNote)}.</p>
            </div>
          </div>
        </section>

        <section class="section" style="margin-top: auto; padding-bottom: 12mm;">
          <div class="eyebrow" style="margin: 18px 0 8px;">Signature and Issue Authority</div>
          <div class="signature-grid">
            <div class="signature-box">
              <div class="eyebrow">Issued by</div>
              <h3>${escapeHtml(document.preparedBy)}</h3>
              <p>${escapeHtml(document.consultantCompany)}</p>
              <p class="signature-meta">${escapeHtml(document.approverTitle)} · ${escapeHtml(document.consultantEmail)} · ${escapeHtml(document.consultantPhone)}</p>
              <p class="signature-meta">${escapeHtml(document.consultantAddress)}</p>
              <div class="signature-line">Authorized consultant signature</div>
            </div>
            <div class="signature-box">
              <div class="eyebrow">Issue control</div>
              <h3>${escapeHtml(document.proposalReference)} · ${escapeHtml(document.proposalRevision)}</h3>
              <p>Issued on ${escapeHtml(document.issuedOnLabel)} for ${escapeHtml(document.clientName)}.</p>
              <p class="signature-meta">Primary issue contact: ${escapeHtml(document.consultantEmail)} · ${escapeHtml(document.consultantPhone)}</p>
              <p class="signature-meta">Issued to: ${escapeHtml(document.proposalRecipient)} · ${escapeHtml(document.proposalAttention)}</p>
              <p class="signature-meta">Purpose: ${escapeHtml(document.proposalIssuePurpose)} · ${escapeHtml(document.proposalValidityNote)}</p>
              <div class="signature-line">Issue date and transmittal confirmation</div>
            </div>
          </div>
        </section>
      </section>

      <section class="frame page">
        <header class="page-header">
          <div class="eyebrow">DynEcho Dynamic Calculator</div>
          <div class="page-header-grid">
            <div>
              <h1 style="margin-top: 8px;">Technical Schedule</h1>
              <p class="lede">
                Working schedule of live outputs, coverage posture, dynamic branch choice, and the current layer structure.
              </p>
            </div>
            <div class="summary-grid" style="margin-top: 0;">
              <div class="metric">
                <strong>Study</strong>
                <span>${escapeHtml(document.studyModeLabel)}</span>
                <small>${escapeHtml(document.contextLabel)} | ${escapeHtml(document.reportProfileLabel)}</small>
              </div>
              <div class="metric">
                <strong>Dynamic branch</strong>
                <span>${escapeHtml(document.dynamicBranchLabel)}</span>
                <small>${escapeHtml(document.dynamicBranchDetail)}</small>
              </div>
              <div class="metric">
                <strong>Validation posture</strong>
                <span>${escapeHtml(document.validationLabel)}</span>
                <small>${escapeHtml(document.validationDetail)}</small>
              </div>
              <div class="metric">
                <strong>Coverage register</strong>
                <span>${liveCoverageCount} ready · ${parkedCoverageCount} parked</span>
                <small>${unsupportedCoverageCount} unsupported lane${unsupportedCoverageCount === 1 ? "" : "s"} stay explicit in the appendix.</small>
              </div>
            </div>
          </div>
        </header>

        <section class="section">
          <div class="eyebrow" style="margin: 18px 0 8px;">Executive Summary</div>
          <div class="method-box">
            <h3>Memo-grade reading</h3>
            <p>${escapeHtml(document.executiveSummary)}</p>
          </div>
        </section>

        <section class="section">
          <div class="eyebrow" style="margin: 18px 0 8px;">Issue Dossier</div>
          <div class="method-box">
            <h3>Audit posture</h3>
            <p>${escapeHtml(dossier.headline)}</p>
          </div>
          <div class="detail-grid" style="padding: 12px 0 0;">
            ${renderDossierItems(dossier.items)}
          </div>
        </section>

        ${
          document.corridorDossierCards.length > 0
            ? `
        <section class="section">
          <div class="eyebrow" style="margin: 18px 0 8px;">Validation Corridor Package</div>
          <div class="method-box">
            <h3>Benchmarked family and mode posture</h3>
            <p>${escapeHtml(document.corridorDossierHeadline)}</p>
          </div>
          <div class="detail-grid" style="padding: 12px 0 0;">
            ${renderDossierItems(document.corridorDossierCards)}
          </div>
        </section>`
            : ""
        }

        <section class="section">
          <div class="eyebrow" style="margin: 18px 0 8px;">Solver Rationale Appendix</div>
          <div class="method-box">
            <h3>Why DynEcho is reading the stack this way</h3>
            <p>${escapeHtml(document.methodDossierHeadline)}</p>
          </div>
          <div class="detail-grid" style="padding: 12px 0 0;">
            ${renderDossierItems(document.methodDossierCards)}
          </div>
          ${
            document.methodTraceGroups.length > 0
              ? `<div class="detail-grid" style="padding: 12px 0 0;">${renderMethodTraceGroups(document.methodTraceGroups)}</div>`
              : ""
          }
        </section>

        <section class="detail-grid">
          <div class="method-box">
            <div class="eyebrow" style="margin-bottom: 8px;">Recipient</div>
            <h3>Transmittal recipient</h3>
            <p>${escapeHtml(document.proposalRecipient)}</p>
            <p style="margin-top: 8px;">${escapeHtml(document.proposalAttention)}</p>
          </div>
          <div class="method-box">
            <div class="eyebrow" style="margin-bottom: 8px;">Subject</div>
            <h3>Issue subject line</h3>
            <p>${escapeHtml(document.proposalSubject)}</p>
            <p style="margin-top: 8px;">Purpose: ${escapeHtml(document.proposalIssuePurpose)}</p>
            <p style="margin-top: 8px;">Validity: ${escapeHtml(document.proposalValidityNote)}</p>
          </div>
        </section>

        <section class="section">
          <div class="eyebrow" style="margin: 18px 0 8px;">Live Output Schedule</div>
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Meaning on this route</th>
              </tr>
            </thead>
            <tbody>
              ${renderMetricRows(document.metrics)}
            </tbody>
          </table>
        </section>

        <section class="section">
          <div class="eyebrow" style="margin: 18px 0 8px;">Output Coverage Register</div>
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Status</th>
                <th>Evidence class</th>
                <th>Current state</th>
                <th>Audit reading</th>
              </tr>
            </thead>
            <tbody>
              ${renderCoverageRows(document.coverageItems)}
            </tbody>
          </table>
        </section>

        <section class="section">
          <div class="eyebrow" style="margin: 18px 0 8px;">Issue Control Register</div>
          <table>
            <thead>
              <tr>
                <th>Line</th>
                <th>Reference</th>
                <th>Status</th>
                <th>Date</th>
                <th>Reading</th>
              </tr>
            </thead>
            <tbody>
              ${renderIssueRegisterRows(document.issueRegisterItems)}
            </tbody>
          </table>
        </section>

        <section class="detail-grid">
          <div class="method-box">
            <div class="eyebrow" style="margin-bottom: 8px;">Method</div>
            <h3>Why this route is active</h3>
            <p>${escapeHtml(document.dynamicBranchDetail)}</p>
          </div>
          <div class="method-box">
            <div class="eyebrow" style="margin-bottom: 8px;">Confidence</div>
            <h3>How to read the result</h3>
            <p>${escapeHtml(document.validationDetail)}</p>
          </div>
        </section>

        <section class="section">
          <div class="eyebrow" style="margin: 18px 0 8px;">Decision Trail</div>
          <div class="method-box">
            <h3>Audit headline</h3>
            <p>${escapeHtml(document.decisionTrailHeadline)}</p>
          </div>
          <div class="detail-grid" style="padding: 12px 0 0;">
            ${renderDecisionTrailItems(document.decisionTrailItems)}
          </div>
        </section>

        <section class="section">
          <div class="eyebrow" style="margin: 18px 0 8px;">Construction Section</div>
          <div class="method-box">
            <h3>Visible layer stack in solver order</h3>
            <p>${escapeHtml(constructionSection.anchorFromLabel)} to ${escapeHtml(constructionSection.anchorToLabel)}. ${escapeHtml(constructionSection.totalThicknessLabel)} stays visible so the client-facing issue can read the build-up without opening the operator desk.</p>
          </div>
          <div style="padding-top: 12px;">
            ${renderConstructionFigure(document)}
          </div>
        </section>

        <section class="section">
          <div class="eyebrow" style="margin: 18px 0 8px;">Layer Schedule</div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Layer</th>
                <th>Thickness</th>
                <th>Assigned role</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              ${renderLayerRows(document.layers)}
            </tbody>
          </table>
        </section>

        <section class="detail-grid" style="padding-top: 0;">
          <div class="method-box">
            <div class="eyebrow" style="margin-bottom: 8px;">Warnings</div>
            <h3>Live checks</h3>
            <ul>${warningItems}</ul>
          </div>
          <div class="method-box">
            <div class="eyebrow" style="margin-bottom: 8px;">Consultant note</div>
            <h3>Project note</h3>
            <p>${consultantNote}</p>
          </div>
        </section>

      </section>

      <section class="frame page">
        <header class="page-header">
          <div class="eyebrow">DynEcho Dynamic Calculator</div>
          <h1 style="margin-top: 8px;">Citation Appendix</h1>
          <p class="lede">
            Appendix page for assumptions, recommendations, cited sources, and project notes that travel with the formal issue.
          </p>
          <div class="appendix-strip">
            <div class="metric">
              <strong>Recommendations</strong>
              <span>${document.recommendationItems.length}</span>
              <small>Next actions carried in the issue package.</small>
            </div>
            <div class="metric">
              <strong>Assumptions</strong>
              <span>${document.assumptionItems.length}</span>
              <small>Explicit posture lines for audit follow-up.</small>
            </div>
            <div class="metric">
              <strong>Sources</strong>
              <span>${document.citations.length}</span>
              <small>Referenced source lines and active links.</small>
            </div>
            <div class="metric">
              <strong>Solver notes</strong>
              <span>${document.methodTraceGroups.length}</span>
              <small>Dynamic lane groups carried from the method tab.</small>
            </div>
            <div class="metric">
              <strong>Corridor cards</strong>
              <span>${document.corridorDossierCards.length}</span>
              <small>Benchmarked family, mode, tolerance, and field posture lines.</small>
            </div>
            <div class="metric">
              <strong>Issue history</strong>
              <span>${document.issueRegisterItems.length}</span>
              <small>Current issue plus recent browser-local reservations on this base code.</small>
            </div>
          </div>
        </header>

        <section class="section">
          <div class="eyebrow" style="margin: 18px 0 8px;">Recommendation Register</div>
          <div class="detail-grid" style="padding: 0;">
            ${renderMemoItems(document.recommendationItems)}
          </div>
        </section>

        <section class="section">
          <div class="eyebrow" style="margin: 18px 0 8px;">Assumption Register</div>
          <div class="detail-grid" style="padding: 0;">
            ${renderMemoItems(document.assumptionItems)}
          </div>
        </section>

        ${
          document.corridorDossierCards.length > 0
            ? `
        <section class="section">
          <div class="eyebrow" style="margin: 18px 0 8px;">Validation Corridor Package</div>
          <div class="method-box">
            <h3>Benchmarked family and mode posture</h3>
            <p>${escapeHtml(document.corridorDossierHeadline)}</p>
          </div>
          <div class="detail-grid" style="padding: 12px 0 0;">
            ${renderDossierItems(document.corridorDossierCards)}
          </div>
        </section>`
            : ""
        }

        <section class="section">
          <div class="eyebrow" style="margin: 18px 0 8px;">Solver Rationale Appendix</div>
          <div class="method-box">
            <h3>Packaged method narrative</h3>
            <p>${escapeHtml(document.methodDossierHeadline)}</p>
          </div>
          <div class="detail-grid" style="padding: 12px 0 0;">
            ${renderDossierItems(document.methodDossierCards)}
          </div>
          ${
            document.methodTraceGroups.length > 0
              ? `<div class="detail-grid" style="padding: 12px 0 0;">${renderMethodTraceGroups(document.methodTraceGroups)}</div>`
              : ""
          }
        </section>

        <section class="section">
          <div class="eyebrow" style="margin: 18px 0 8px;">Issue History Appendix</div>
          <table>
            <thead>
              <tr>
                <th>Line</th>
                <th>Reference</th>
                <th>Status</th>
                <th>Date</th>
                <th>Reading</th>
              </tr>
            </thead>
            <tbody>
              ${renderIssueRegisterRows(document.issueRegisterItems)}
            </tbody>
          </table>
        </section>

        <section class="section">
          <div class="eyebrow" style="margin: 18px 0 8px;">Source Citation Appendix</div>
          <div class="detail-grid" style="padding: 0;">
            ${renderCitationItems(document.citations)}
          </div>
        </section>

        <section class="footer">
          <div class="note-box">
            <p>
              Prepared from the DynEcho dynamic calculator. This sheet summarizes a project estimate and should be read together with the visible solver posture, assumptions, and any required laboratory or site verification.
            </p>
            <p style="margin-top: 8px;">
              ${escapeHtml(document.consultantCompany)} · ${escapeHtml(document.preparedBy)} · ${escapeHtml(document.approverTitle)} · ${escapeHtml(document.consultantEmail)} · ${escapeHtml(document.consultantPhone)} · ${escapeHtml(document.consultantAddress)}
            </p>
          </div>
        </section>
      </section>
    </main>
  </body>
</html>`;
}
