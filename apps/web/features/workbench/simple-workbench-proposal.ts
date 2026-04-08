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
import {
  buildSimpleWorkbenchProposalConstructionRender,
  SIMPLE_WORKBENCH_REPORT_MARK,
  SIMPLE_WORKBENCH_REPORT_PRODUCT_NAME
} from "./simple-workbench-proposal-reporting";
import { buildSimpleWorkbenchReportMarkSvgMarkup } from "./simple-workbench-report-mark";
import type { SimpleWorkbenchProposalBriefItem } from "./simple-workbench-proposal-brief";
import {
  getFallbackSimpleWorkbenchOutputPosture,
  type SimpleWorkbenchOutputPostureTone
} from "./simple-workbench-output-posture";
import {
  DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_ISSUE_PURPOSE,
  DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_VALIDITY_NOTE
} from "./simple-workbench-proposal-policy-presets";
import type {
  WorkbenchResponseCurveFigure,
  WorkbenchResponseCurveSeries
} from "./response-curve-model";

export type SimpleWorkbenchProposalMetric = {
  detail: string;
  label: string;
  value: string;
};

export type SimpleWorkbenchProposalLayer = {
  categoryLabel: string;
  densityLabel?: string;
  index: number;
  label: string;
  roleLabel?: string;
  surfaceMassLabel?: string;
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
  constructionTotalThicknessOverrideLabel?: string;
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
  responseCurves?: readonly WorkbenchResponseCurveFigure[];
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

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "number" && Number.isFinite(entry));
}

function normalizeResponseCurveSeries(value: unknown): WorkbenchResponseCurveSeries | null {
  if (!isObjectRecord(value)) {
    return null;
  }

  if (
    typeof value.id !== "string" ||
    typeof value.label !== "string" ||
    typeof value.active !== "boolean" ||
    !isNumberArray(value.frequenciesHz) ||
    !isNumberArray(value.valuesDb) ||
    value.frequenciesHz.length === 0 ||
    value.frequenciesHz.length !== value.valuesDb.length
  ) {
    return null;
  }

  return {
    active: value.active,
    frequenciesHz: value.frequenciesHz,
    id: value.id,
    label: value.label,
    valuesDb: value.valuesDb
  };
}

function normalizeResponseCurveFigure(value: unknown): WorkbenchResponseCurveFigure | null {
  if (!isObjectRecord(value) || !Array.isArray(value.series)) {
    return null;
  }

  const series = value.series
    .map((entry) => normalizeResponseCurveSeries(entry))
    .filter((entry): entry is WorkbenchResponseCurveSeries => entry !== null);

  if (
    series.length === 0 ||
    typeof value.id !== "string" ||
    (value.id !== "airborne" && value.id !== "impact") ||
    typeof value.title !== "string" ||
    typeof value.note !== "string" ||
    typeof value.domainLabel !== "string" ||
    typeof value.direction !== "string" ||
    (value.direction !== "higher_better" && value.direction !== "lower_better")
  ) {
    return null;
  }

  return {
    activeSeriesId: typeof value.activeSeriesId === "string" ? value.activeSeriesId : undefined,
    direction: value.direction,
    domainLabel: value.domainLabel,
    id: value.id,
    note: value.note,
    series,
    title: value.title
  };
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
  const responseCurves = Array.isArray(value.responseCurves)
    ? value.responseCurves
        .map((entry) => normalizeResponseCurveFigure(entry))
        .filter((entry): entry is WorkbenchResponseCurveFigure => entry !== null)
    : [];
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
    constructionTotalThicknessOverrideLabel:
      typeof value.constructionTotalThicknessOverrideLabel === "string"
        ? value.constructionTotalThicknessOverrideLabel
        : undefined,
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
          ),
    responseCurves: responseCurves.length > 0 ? responseCurves : undefined
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

function renderCompactBriefList(
  items: readonly SimpleWorkbenchProposalBriefItem[],
  fallback: string
): string {
  const visibleItems = items.slice(0, 3);

  if (visibleItems.length === 0) {
    return `<li>${escapeHtml(fallback)}</li>`;
  }

  return visibleItems
    .map(
      (item) => `
        <li>
          <strong>${escapeHtml(item.label)}</strong>
          <span>${escapeHtml(item.detail)}</span>
        </li>
      `
    )
    .join("");
}

function renderCompactCitationList(
  citations: readonly SimpleWorkbenchProposalCitation[],
  fallback: string
): string {
  const visibleCitations = citations.slice(0, 3);

  if (visibleCitations.length === 0) {
    return `<li>${escapeHtml(fallback)}</li>`;
  }

  return visibleCitations
    .map((citation) => {
      const href = citation.href ? ` ${citation.href}` : "";

      return `
        <li>
          <strong>${escapeHtml(citation.label)}</strong>
          <span>${escapeHtml(`${citation.detail}${href}`)}</span>
        </li>
      `;
    })
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

type ProposalReportStandardReference = {
  code: string;
  detail: string;
  label: string;
};

type ProposalMetricDirection = "higher" | "lower" | "neutral";

type ProposalMetricChartRow = {
  detail: string;
  direction: ProposalMetricDirection;
  isPrimary: boolean;
  label: string;
  markerPercent: string;
  valueLabel: string;
};

const PROPOSAL_GRAPH_MIN_DB = 30;
const PROPOSAL_GRAPH_MAX_DB = 80;

function normalizeMetricSlug(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[’']/gu, "'")
    .replace(/\s+/gu, "");
}

function proposalHasMetric(document: SimpleWorkbenchProposalDocument, matchers: readonly RegExp[]): boolean {
  return [...document.metrics, ...document.coverageItems].some((item) =>
    matchers.some((matcher) => matcher.test(normalizeMetricSlug(item.label)))
  );
}

function proposalJoinedNarrative(document: SimpleWorkbenchProposalDocument): string {
  return [
    document.contextLabel,
    document.dynamicBranchLabel,
    document.dynamicBranchDetail,
    document.validationLabel,
    document.validationDetail,
    document.executiveSummary,
    document.studyModeLabel,
    document.studyContextLabel,
    document.methodDossierHeadline,
    document.corridorDossierHeadline,
    ...document.citations.map((citation) => `${citation.label} ${citation.detail}`),
    ...document.methodTraceGroups.flatMap((group) => [group.label, group.detail, ...group.notes])
  ]
    .join(" ")
    .toLowerCase();
}

function inferProposalStandardReferences(
  document: SimpleWorkbenchProposalDocument
): readonly ProposalReportStandardReference[] {
  const hasAirborne = proposalHasMetric(document, [/^(rw|r'w|dnt,w|dnt,a|stc|c|ctr)$/u]);
  const hasImpact = proposalHasMetric(document, [/^(ln,w|l'n,w|l'nt,w|l'nt,50|lnt,a|l'nt,a|ci|ci,50-2500|deltalw)$/u]);
  const joinedNarrative = proposalJoinedNarrative(document);
  const references: ProposalReportStandardReference[] = [];

  if (hasAirborne) {
    references.push({
      code: "ISO 717-1",
      detail:
        "Weighted airborne ratings on this issue are stated using ISO 717-1 single-number language, including airborne adaptation terms only when the active route can defend them.",
      label: "Weighted airborne rating basis"
    });
  }

  if (hasImpact) {
    references.push({
      code: "ISO 717-2",
      detail:
        "Weighted impact ratings on this issue are stated using ISO 717-2 language. DynEcho only presents Ln,w, L'n,w, L'nT,w, CI, or DeltaLw when the active route exposes them defensibly.",
      label: "Weighted impact rating basis"
    });
  }

  if (joinedNarrative.includes("field airborne") || joinedNarrative.includes("room-to-room field") || joinedNarrative.includes("field route")) {
    references.push({
      code: "ISO 16283-1",
      detail:
        "Where field airborne continuation is active, the report keeps the room-to-room measurement posture explicit and does not relabel the result as a laboratory claim.",
      label: "Field airborne continuation"
    });
  }

  if (
    joinedNarrative.includes("field impact") ||
    joinedNarrative.includes("field-side") ||
    joinedNarrative.includes("standardized room volume") ||
    joinedNarrative.includes("field continuation")
  ) {
    references.push({
      code: "ISO 16283-2",
      detail:
        "Where field impact continuation is active, the report keeps field-side normalization posture explicit and avoids presenting it as direct laboratory evidence.",
      label: "Field impact continuation"
    });
  }

  if (
    joinedNarrative.includes("estimate") ||
    joinedNarrative.includes("predict") ||
    joinedNarrative.includes("floating floor") ||
    joinedNarrative.includes("standardized room volume")
  ) {
    references.push({
      code: document.studyModeLabel.trim().toLowerCase().includes("wall") ? "ISO 12354-1" : "ISO 12354-2",
      detail:
        "Prediction routes remain labelled as estimates on this sheet. DAC output is transparent about solver posture and is not presented as an accredited laboratory or field certificate.",
      label: "Prediction route posture"
    });
  }

  if (references.length === 0) {
    references.push({
      code: "Method basis",
      detail:
        "The report keeps route choice, validation posture, and cited evidence explicit so the packaged result can be reviewed without overstating confidence.",
      label: "Explicit route disclosure"
    });
  }

  return references;
}

function parseProposalMetricNumericValue(value: string): number | null {
  const match = value.match(/-?\d+(?:[.,]\d+)?/u);

  if (!match) {
    return null;
  }

  const parsed = Number(match[0].replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function inferProposalMetricDirection(label: string): ProposalMetricDirection {
  const slug = normalizeMetricSlug(label);

  if (/^(rw|r'w|dnt,w|dnt,a|stc|deltalw)$/u.test(slug)) {
    return "higher";
  }

  if (/^(ln,w|l'n,w|l'nt,w|l'nt,50|lnt,a|l'nt,a|ci|ci,50-2500)$/u.test(slug)) {
    return "lower";
  }

  return "neutral";
}

function buildProposalMetricChartRows(document: SimpleWorkbenchProposalDocument): readonly ProposalMetricChartRow[] {
  const primaryMetricSlug = normalizeMetricSlug(document.primaryMetricLabel);
  const rows: ProposalMetricChartRow[] = [];
  const seenLabels = new Set<string>();
  const orderedMetrics = [...document.metrics].sort((left, right) => {
    const leftPrimary = normalizeMetricSlug(left.label) === primaryMetricSlug ? 1 : 0;
    const rightPrimary = normalizeMetricSlug(right.label) === primaryMetricSlug ? 1 : 0;
    return rightPrimary - leftPrimary;
  });

  for (const metric of orderedMetrics) {
    const metricSlug = normalizeMetricSlug(metric.label);
    const numericValue = parseProposalMetricNumericValue(metric.value);

    if (seenLabels.has(metricSlug) || numericValue === null) {
      continue;
    }

    const direction = inferProposalMetricDirection(metric.label);

    if (direction === "neutral" && rows.length >= 4) {
      continue;
    }

    const markerPercent = `${Math.max(
      0,
      Math.min(100, ((numericValue - PROPOSAL_GRAPH_MIN_DB) / (PROPOSAL_GRAPH_MAX_DB - PROPOSAL_GRAPH_MIN_DB)) * 100)
    ).toFixed(2)}%`;

    rows.push({
      detail: metric.detail,
      direction,
      isPrimary: metricSlug === primaryMetricSlug,
      label: metric.label,
      markerPercent,
      valueLabel: metric.value
    });
    seenLabels.add(metricSlug);

    if (rows.length >= 4) {
      break;
    }
  }

  return rows;
}

function renderProposalMetricPlotSvg(rows: readonly ProposalMetricChartRow[]): string {
  if (rows.length === 0) {
    return "";
  }

  const width = 620;
  const height = 288;
  const marginTop = 18;
  const marginRight = 22;
  const marginBottom = 56;
  const marginLeft = 52;
  const plotWidth = width - marginLeft - marginRight;
  const plotHeight = height - marginTop - marginBottom;
  const valueRange = PROPOSAL_GRAPH_MAX_DB - PROPOSAL_GRAPH_MIN_DB;
  const points = rows.map((row, index) => {
    const numericValue = parseProposalMetricNumericValue(row.valueLabel) ?? PROPOSAL_GRAPH_MIN_DB;
    const x =
      rows.length === 1 ? marginLeft + plotWidth / 2 : marginLeft + (plotWidth * index) / Math.max(1, rows.length - 1);
    const y = marginTop + ((PROPOSAL_GRAPH_MAX_DB - numericValue) / valueRange) * plotHeight;
    return {
      ...row,
      x,
      y
    };
  });
  const polylinePoints = points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ");
  const gridValues = Array.from({ length: valueRange / 10 + 1 }, (_, index) => PROPOSAL_GRAPH_MIN_DB + index * 10);

  return `
    <svg class="result-plot" viewBox="0 0 ${width} ${height}" role="img" aria-label="Weighted acoustic result plot">
      ${points
        .map((point, index) => {
          const laneWidth = rows.length === 1 ? plotWidth * 0.7 : plotWidth / Math.max(1, rows.length);
          const laneX = rows.length === 1 ? marginLeft + plotWidth * 0.15 : point.x - laneWidth / 2;
          const laneTone =
            point.direction === "higher"
              ? "rgba(201, 115, 66, 0.07)"
              : point.direction === "lower"
                ? "rgba(42, 157, 143, 0.07)"
                : "rgba(38, 70, 83, 0.05)";

          return `
            <rect class="plot-lane-band${point.isPrimary ? " plot-lane-band-primary" : ""}" x="${Math.max(marginLeft, laneX).toFixed(2)}" y="${marginTop}" width="${Math.min(laneWidth, width - marginRight - Math.max(marginLeft, laneX)).toFixed(2)}" height="${plotHeight.toFixed(2)}" fill="${laneTone}"></rect>
            <text class="plot-lane-index" x="${point.x.toFixed(2)}" y="${(marginTop + 12).toFixed(2)}" text-anchor="middle">${index + 1}</text>
          `;
        })
        .join("")}
      ${gridValues
        .map((value) => {
          const y = marginTop + ((PROPOSAL_GRAPH_MAX_DB - value) / valueRange) * plotHeight;
          return `
            <line class="plot-grid-line" x1="${marginLeft}" x2="${width - marginRight}" y1="${y.toFixed(2)}" y2="${y.toFixed(2)}"></line>
            <text class="plot-axis-label" x="${marginLeft - 10}" y="${(y + 4).toFixed(2)}" text-anchor="end">${value}</text>
          `;
        })
        .join("")}
      <line class="plot-frame-line" x1="${marginLeft}" x2="${marginLeft}" y1="${marginTop}" y2="${height - marginBottom}"></line>
      <line class="plot-frame-line" x1="${marginLeft}" x2="${width - marginRight}" y1="${height - marginBottom}" y2="${height - marginBottom}"></line>
      ${
        points.length > 1
          ? `<polyline class="plot-series-line" fill="none" points="${polylinePoints}"></polyline>`
          : ""
      }
      ${points
        .map((point) => {
          const directionClass =
            point.direction === "higher"
              ? "plot-point-higher"
              : point.direction === "lower"
                ? "plot-point-lower"
                : "plot-point-neutral";
          const labelY = point.y - 16;
          const xLabel = point.x;
          const tagWidth = point.isPrimary ? 64 : 56;
          const tagX = xLabel - tagWidth / 2;
          return `
            <line class="plot-drop-line" x1="${point.x.toFixed(2)}" x2="${point.x.toFixed(2)}" y1="${point.y.toFixed(2)}" y2="${(height - marginBottom).toFixed(2)}"></line>
            <circle class="plot-point ${directionClass}${point.isPrimary ? " plot-point-primary" : ""}" cx="${point.x.toFixed(2)}" cy="${point.y.toFixed(2)}" r="${point.isPrimary ? "7.5" : "6"}"></circle>
            <rect class="plot-tag ${directionClass}${point.isPrimary ? " plot-tag-primary" : ""}" x="${tagX.toFixed(2)}" y="${(labelY - 14).toFixed(2)}" width="${tagWidth}" height="22" rx="11"></rect>
            <text class="plot-tag-label" x="${xLabel.toFixed(2)}" y="${(labelY).toFixed(2)}" text-anchor="middle">${escapeHtml(point.valueLabel)}</text>
            <text class="plot-metric-label" x="${point.x.toFixed(2)}" y="${(height - marginBottom + 22).toFixed(2)}" text-anchor="middle">${escapeHtml(point.label)}</text>
          `;
        })
        .join("")}
    </svg>
  `;
}

function renderProposalMetricHighlights(metrics: readonly SimpleWorkbenchProposalMetric[]): string {
  const visibleMetrics = metrics.slice(0, 4);

  if (visibleMetrics.length === 0) {
    return `
      <div class="method-box">
        <h3>No live result set packaged</h3>
        <p>Build a supported stack and active route first so DAC can issue a numeric result schedule.</p>
      </div>
    `;
  }

  return visibleMetrics
    .map(
      (metric) => `
        <div class="result-chip">
          <strong>${escapeHtml(metric.label)}</strong>
          <span>${escapeHtml(metric.value)}</span>
          <small>${escapeHtml(metric.detail)}</small>
        </div>
      `
    )
    .join("");
}

function renderProposalStandardPills(standards: readonly ProposalReportStandardReference[]): string {
  return standards
    .slice(0, 4)
    .map(
      (standard) => `
        <div class="standard-pill">
          <strong>${escapeHtml(standard.code)}</strong>
          <span>${escapeHtml(standard.label)}</span>
        </div>
      `
    )
    .join("");
}

function renderProposalStandardCards(standards: readonly ProposalReportStandardReference[]): string {
  return standards
    .map(
      (standard) => `
        <div class="standard-card">
          <div class="eyebrow" style="margin-bottom: 8px;">${escapeHtml(standard.code)}</div>
          <h3>${escapeHtml(standard.label)}</h3>
          <p>${escapeHtml(standard.detail)}</p>
        </div>
      `
    )
    .join("");
}

function renderProposalMetricGraph(document: SimpleWorkbenchProposalDocument): string {
  const rows = buildProposalMetricChartRows(document);

  if (rows.length === 0) {
    return `
      <div class="result-chart-card">
        <div class="result-chart-head">
          <div>
            <div class="eyebrow">Weighted Result Graph</div>
            <h3>Acoustic result profile</h3>
            <p>No numeric weighted indices are packaged on this issue yet.</p>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="result-chart-card">
      <div class="result-chart-head">
        <div>
          <div class="eyebrow">Weighted Result Graph</div>
          <h3>Acoustic result profile</h3>
          <p>Primary answer first. Weighted airborne ratings read higher-is-better; weighted impact ratings read lower-is-better on the shared dB reference band.</p>
        </div>
        <div class="chart-meta-stack">
          <div class="chart-meta chart-meta-accent">${PROPOSAL_GRAPH_MIN_DB} to ${PROPOSAL_GRAPH_MAX_DB} dB reference band</div>
          <div class="chart-meta">Primary metric first</div>
        </div>
      </div>
      <div class="chart-band-strip">
        <span class="chart-band-pill">Weighted indices</span>
        <span class="chart-band-pill">Shared dB ruler</span>
        <span class="chart-band-pill">Route-aware interpretation</span>
      </div>
      <div class="plot-shell">
        ${renderProposalMetricPlotSvg(rows)}
      </div>
      <div class="result-legend-strip">
        ${rows
          .map((row) => {
            const directionLabel =
              row.direction === "higher"
                ? "Higher is better"
                : row.direction === "lower"
                  ? "Lower is better"
                  : "Reference scale";

            return `
              <div class="result-legend-row">
                <div class="result-row-copy">
                  <strong>${escapeHtml(row.label)}</strong>
                  <span>${escapeHtml(row.valueLabel)}</span>
                  <small>${escapeHtml(directionLabel)} · ${escapeHtml(row.detail)}</small>
                </div>
              </div>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function formatCurveFrequencyLabel(frequencyHz: number): string {
  if (frequencyHz >= 1000) {
    const kiloHertz = frequencyHz / 1000;
    return `${Number.isInteger(kiloHertz) ? kiloHertz : kiloHertz.toFixed(kiloHertz >= 2 ? 1 : 2)}k`;
  }

  return String(frequencyHz);
}

function buildCurveFrequencyAxis(figure: WorkbenchResponseCurveFigure): number[] {
  return Array.from(new Set(figure.series.flatMap((series) => series.frequenciesHz))).sort((left, right) => left - right);
}

function buildCurveValueDomain(figure: WorkbenchResponseCurveFigure): { max: number; min: number } {
  const values = figure.series.flatMap((series) => series.valuesDb);

  if (values.length === 0) {
    return { max: 80, min: 0 };
  }

  return {
    max: Math.ceil(Math.max(...values) / 5) * 5 + 5,
    min: Math.max(0, Math.floor(Math.min(...values) / 5) * 5 - 5)
  };
}

const PROPOSAL_CURVE_BANDS = [
  {
    fill: "rgba(201, 115, 66, 0.08)",
    id: "low",
    label: "Low",
    note: "63-250 Hz",
    x1: 63,
    x2: 250
  },
  {
    fill: "rgba(42, 157, 143, 0.08)",
    id: "speech",
    label: "Speech",
    note: "500-1k Hz",
    x1: 500,
    x2: 1000
  },
  {
    fill: "rgba(188, 108, 37, 0.08)",
    id: "high",
    label: "High",
    note: "2k-4k Hz",
    x1: 2000,
    x2: 4000
  }
] as const;

type ProposalCurveReadout = {
  label: string;
  note: string;
  valueLabel: string;
};

function getProposalCurveDirectionLabel(direction: WorkbenchResponseCurveFigure["direction"]): string {
  return direction === "lower_better" ? "Lower is better" : "Higher is better";
}

function getProposalCurveSeriesColor(seriesId: string): string {
  switch (seriesId) {
    case "airborne":
      return "#c97342";
    case "field":
      return "#bc6c25";
    case "standardized":
      return "#2a9d8f";
    case "source":
    default:
      return "#264653";
  }
}

function getActiveProposalCurveSeries(figure: WorkbenchResponseCurveFigure): WorkbenchResponseCurveSeries | null {
  return figure.series.find((series) => series.id === figure.activeSeriesId) ?? figure.series[0] ?? null;
}

function findClosestProposalCurvePoint(
  series: WorkbenchResponseCurveSeries,
  targetHz: number
): { frequencyHz: number; valueDb: number } | null {
  const pair = series.frequenciesHz
    .map((frequencyHz, index) => ({
      distance: Math.abs(frequencyHz - targetHz),
      frequencyHz,
      valueDb: series.valuesDb[index]
    }))
    .filter((entry) => Number.isFinite(entry.valueDb))
    .sort((left, right) => left.distance - right.distance)[0];

  if (!pair || !Number.isFinite(pair.valueDb)) {
    return null;
  }

  return {
    frequencyHz: pair.frequencyHz,
    valueDb: pair.valueDb
  };
}

function buildProposalCurveReadouts(figure: WorkbenchResponseCurveFigure): ProposalCurveReadout[] {
  const activeSeries = getActiveProposalCurveSeries(figure);

  if (!activeSeries) {
    return [];
  }

  return [
    { label: "Low band", targetHz: 125 },
    { label: "Speech band", targetHz: 500 },
    { label: "High band", targetHz: 2000 }
  ]
    .map(({ label, targetHz }) => {
      const point = findClosestProposalCurvePoint(activeSeries, targetHz);

      if (!point) {
        return null;
      }

      return {
        label,
        note: `${formatCurveFrequencyLabel(point.frequencyHz)} Hz anchor`,
        valueLabel: `${point.valueDb.toFixed(1)} dB`
      };
    })
    .filter((entry): entry is ProposalCurveReadout => entry !== null);
}

function renderProposalCurveReadoutStrip(figure: WorkbenchResponseCurveFigure): string {
  const readouts = buildProposalCurveReadouts(figure);

  if (readouts.length === 0) {
    return "";
  }

  return `
    <div class="curve-readout-grid">
      ${readouts
        .map(
          (readout) => `
            <div class="curve-readout-card">
              <strong>${escapeHtml(readout.label)}</strong>
              <span>${escapeHtml(readout.valueLabel)}</span>
              <small>${escapeHtml(readout.note)}</small>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderProposalResponseCurveSvg(figure: WorkbenchResponseCurveFigure): string {
  const frequencies = buildCurveFrequencyAxis(figure);

  if (frequencies.length === 0) {
    return "";
  }

  const width = 620;
  const height = 288;
  const marginTop = 18;
  const marginRight = 16;
  const marginBottom = 44;
  const marginLeft = 50;
  const plotWidth = width - marginLeft - marginRight;
  const plotHeight = height - marginTop - marginBottom;
  const minFrequency = Math.min(...frequencies);
  const maxFrequency = Math.max(...frequencies);
  const minLog = Math.log10(minFrequency);
  const maxLog = Math.log10(maxFrequency);
  const valueDomain = buildCurveValueDomain(figure);
  const valueRange = Math.max(1, valueDomain.max - valueDomain.min);
  const gridValues = Array.from(
    { length: Math.floor((valueDomain.max - valueDomain.min) / 10) + 1 },
    (_, index) => valueDomain.min + index * 10
  );

  const getX = (frequencyHz: number) => {
    if (maxLog === minLog) {
      return marginLeft + plotWidth / 2;
    }

    return marginLeft + ((Math.log10(frequencyHz) - minLog) / (maxLog - minLog)) * plotWidth;
  };
  const getY = (valueDb: number) => marginTop + ((valueDomain.max - valueDb) / valueRange) * plotHeight;

  return `
    <svg class="result-plot" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(figure.title)}">
      ${PROPOSAL_CURVE_BANDS
        .map((band) => {
          const startFrequency = Math.max(minFrequency, band.x1);
          const endFrequency = Math.min(maxFrequency, band.x2);

          if (endFrequency <= startFrequency) {
            return "";
          }

          const x = getX(startFrequency);
          const bandWidth = Math.max(0, getX(endFrequency) - x);

          return `
            <rect class="curve-band curve-band-${band.id}" fill="${band.fill}" x="${x.toFixed(2)}" y="${marginTop}" width="${bandWidth.toFixed(2)}" height="${plotHeight.toFixed(2)}"></rect>
            <text class="curve-band-label" x="${(x + bandWidth / 2).toFixed(2)}" y="${(marginTop + 12).toFixed(2)}" text-anchor="middle">${escapeHtml(band.label)}</text>
          `;
        })
        .join("")}
      ${gridValues
        .map((value) => {
          const y = getY(value);
          return `
            <line class="plot-grid-line" x1="${marginLeft}" x2="${width - marginRight}" y1="${y.toFixed(2)}" y2="${y.toFixed(2)}"></line>
            <text class="plot-axis-label" x="${marginLeft - 10}" y="${(y + 4).toFixed(2)}" text-anchor="end">${value}</text>
          `;
        })
        .join("")}
      ${frequencies
        .map((frequencyHz) => {
          const x = getX(frequencyHz);
          return `
            <line class="plot-grid-line plot-grid-line-vertical" x1="${x.toFixed(2)}" x2="${x.toFixed(2)}" y1="${marginTop}" y2="${height - marginBottom}"></line>
            <text class="plot-axis-label" x="${x.toFixed(2)}" y="${(height - marginBottom + 18).toFixed(2)}" text-anchor="middle">${escapeHtml(formatCurveFrequencyLabel(frequencyHz))}</text>
          `;
        })
        .join("")}
      <line class="plot-frame-line" x1="${marginLeft}" x2="${marginLeft}" y1="${marginTop}" y2="${height - marginBottom}"></line>
      <line class="plot-frame-line" x1="${marginLeft}" x2="${width - marginRight}" y1="${height - marginBottom}" y2="${height - marginBottom}"></line>
      ${figure.series
        .map((series) => {
          const points = series.frequenciesHz
            .map((frequencyHz, index) => {
              const value = series.valuesDb[index];

              if (!Number.isFinite(value)) {
                return null;
              }

              return `${getX(frequencyHz).toFixed(2)},${getY(value).toFixed(2)}`;
            })
            .filter((point): point is string => point !== null)
            .join(" ");
          const seriesClass = `curve-series-line curve-series-line-${escapeHtml(series.id)}${series.active ? " curve-series-line-active" : ""}`;
          const seriesStroke = getProposalCurveSeriesColor(series.id);

          return `
            <polyline class="${seriesClass}" fill="none" points="${points}" style="stroke:${seriesStroke};"></polyline>
            ${series.frequenciesHz
              .map((frequencyHz, index) => {
                const value = series.valuesDb[index];

                if (!Number.isFinite(value)) {
                  return "";
                }

                return `<circle class="curve-series-point curve-series-point-${escapeHtml(series.id)}${series.active ? " curve-series-point-active" : ""}" cx="${getX(frequencyHz).toFixed(2)}" cy="${getY(value).toFixed(2)}" r="${series.active ? "3.4" : "2.4"}" style="fill:${seriesStroke};"></circle>`;
              })
              .join("")}
          `;
        })
        .join("")}
      <text class="plot-axis-title" x="${(marginLeft + plotWidth / 2).toFixed(2)}" y="${(height - 8).toFixed(2)}" text-anchor="middle">Frequency (Hz)</text>
      <text class="plot-axis-title" transform="translate(14 ${(marginTop + plotHeight / 2).toFixed(2)}) rotate(-90)" text-anchor="middle">Level (dB)</text>
    </svg>
  `;
}

function renderProposalResponseCurves(document: SimpleWorkbenchProposalDocument): string {
  const figures = document.responseCurves ?? [];

  if (figures.length === 0) {
    return renderProposalMetricGraph(document);
  }

  return `
    <div class="response-curve-grid">
      ${figures
        .map((figure) => `
          <div class="result-chart-card">
            <div class="result-chart-head">
              <div>
                <div class="eyebrow">${figure.id === "impact" ? "Impact Curve" : "Airborne Curve"}</div>
                <h3>${escapeHtml(figure.title)}</h3>
                <p>${escapeHtml(figure.note)}</p>
              </div>
              <div class="chart-meta-stack">
                <div class="chart-meta chart-meta-accent">${escapeHtml(figure.domainLabel)}</div>
                <div class="chart-meta">${escapeHtml(getProposalCurveDirectionLabel(figure.direction))}</div>
              </div>
            </div>
            <div class="chart-band-strip">
              ${PROPOSAL_CURVE_BANDS.map((band) => `<span class="chart-band-pill chart-band-pill-${band.id}">${escapeHtml(band.label)} · ${escapeHtml(band.note)}</span>`).join("")}
            </div>
            <div class="plot-shell">
              ${renderProposalResponseCurveSvg(figure)}
            </div>
            ${renderProposalCurveReadoutStrip(figure)}
            <div class="result-legend-strip">
              ${figure.series
                .map(
                  (series) => `
                    <div class="result-legend-row">
                      <div class="curve-legend-swatch curve-legend-swatch-${escapeHtml(series.id)}"></div>
                      <div class="result-row-copy">
                        <strong>${escapeHtml(series.label)}</strong>
                        <small>${series.active ? "Active answer curve on this lane." : "Supporting comparison curve."}</small>
                      </div>
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>
        `)
        .join("")}
    </div>
  `;
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

function renderMethodBasisRows(document: SimpleWorkbenchProposalDocument): string {
  return [
    {
      basis: document.dynamicBranchLabel,
      detail: document.dynamicBranchDetail,
      label: "Dynamic route"
    },
    {
      basis: document.validationLabel,
      detail: document.validationDetail,
      label: "Validation posture"
    },
    {
      basis: `${document.studyModeLabel} · ${document.contextLabel}`,
      detail: `${document.studyContextLabel} workflow running under the ${document.reportProfileLabel.toLowerCase()} profile.`,
      label: "Study scope"
    },
    {
      basis: document.proposalIssuePurpose,
      detail: `Issued to ${document.proposalRecipient}. ${document.proposalValidityNote}`,
      label: "Deliverable basis"
    }
  ]
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.label)}</td>
          <td>${escapeHtml(item.basis)}</td>
          <td>${escapeHtml(item.detail)}</td>
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
          <td>${escapeHtml(layer.densityLabel ?? "Not listed")}</td>
          <td>${escapeHtml(layer.surfaceMassLabel ?? "Not listed")}</td>
          <td>${escapeHtml(layer.roleLabel ?? layer.categoryLabel)}</td>
          <td>${escapeHtml(layer.categoryLabel)}</td>
        </tr>
      `
    )
    .join("");
}

function renderConstructionFigure(document: SimpleWorkbenchProposalDocument): string {
  const construction = buildSimpleWorkbenchProposalConstructionRender(document.layers, document.studyModeLabel, {
    totalThicknessLabelOverride: document.constructionTotalThicknessOverrideLabel
  });

  if (construction.section.bands.length === 0) {
    return `<div class="method-box"><h3>Construction section unavailable</h3><p>Add layers to produce the construction cross-section.</p></div>`;
  }

  return `
    <div class="construction-grid">
      <div class="construction-figure">
        ${construction.svgMarkup}
        <div class="construction-figure-note">Indicative build-up section drawn from the visible solver stack. Thin finish and resilient layers use a minimum graphic width so the sheet stays readable in print.</div>
      </div>
      <div class="construction-legend">
        <table class="construction-table">
          <thead><tr><th>#</th><th>Layer</th><th>Thickness</th></tr></thead>
          <tbody>${construction.legendRowsHtml}</tbody>
        </table>
        <div class="construction-summary-card">
          <strong>Total thickness</strong>
          <span>${escapeHtml(construction.section.totalThicknessLabel)}</span>
          <small>${escapeHtml(construction.section.anchorFromLabel)} to ${escapeHtml(construction.section.anchorToLabel)} in solver order.</small>
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
  const constructionSection = buildSimpleWorkbenchProposalConstructionSection(document.layers, document.studyModeLabel, {
    totalThicknessLabelOverride: document.constructionTotalThicknessOverrideLabel
  });
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
    "Applied method and deliverable basis",
    `- Dynamic route: ${document.dynamicBranchLabel} | ${document.dynamicBranchDetail}`,
    `- Validation posture: ${document.validationLabel} | ${document.validationDetail}`,
    `- Study scope: ${document.studyModeLabel} | ${document.contextLabel} | ${document.studyContextLabel} | ${document.reportProfileLabel}`,
    `- Deliverable basis: ${document.proposalIssuePurpose} | Issued to ${document.proposalRecipient} | ${document.proposalValidityNote}`,
    "",
    "Layer schedule",
    ...document.layers.map(
      (layer) =>
        `${layer.index}. ${layer.label} | ${layer.thicknessLabel} | ${layer.densityLabel ?? "Not listed"} | ${layer.surfaceMassLabel ?? "Not listed"} | ${layer.roleLabel ?? layer.categoryLabel} | ${layer.categoryLabel}`
    ),
    "",
    "Assumptions and warnings",
    ...warningLines,
    "",
    "Consultant note",
    noteLine,
    "",
    `Prepared from the ${SIMPLE_WORKBENCH_REPORT_PRODUCT_NAME}. This sheet summarizes a project estimate and does not replace accredited laboratory or site measurements.`
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
  const constructionSection = buildSimpleWorkbenchProposalConstructionSection(document.layers, document.studyModeLabel, {
    totalThicknessLabelOverride: document.constructionTotalThicknessOverrideLabel
  });
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
  const standardReferences = inferProposalStandardReferences(document);
  const stackDensityCount = document.layers.filter((layer) => typeof layer.densityLabel === "string" && layer.densityLabel.trim().length > 0).length;
  const stackSurfaceMassCount = document.layers.filter(
    (layer) => typeof layer.surfaceMassLabel === "string" && layer.surfaceMassLabel.trim().length > 0
  ).length;
  const reportMarkSvg = buildSimpleWorkbenchReportMarkSvgMarkup({
    accent: branding.accent,
    accentStrong: branding.accentStrong,
    ink: "#1c2f40",
    panel: "#fffdf9",
    variant: "cover"
  });
  const compactRecommendationList = renderCompactBriefList(
    document.recommendationItems,
    "No additional recommendation lines are packaged on this issue."
  );
  const compactAssumptionList = renderCompactBriefList(
    document.assumptionItems,
    "No additional assumption lines are packaged on this issue."
  );
  const compactCitationList = renderCompactCitationList(
    document.citations,
    "No external source line is packaged on this issue."
  );

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(buildSimpleWorkbenchProposalFilename(document.projectName))}</title>
    <style>
      :root {
        color-scheme: light;
        --ink: #193246;
        --ink-faint: #74879a;
        --ink-soft: #456079;
        --line: #c6d1dc;
        --paper: #edf2f6;
        --panel: #ffffff;
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
        font-family: Arial, "Helvetica Neue", sans-serif;
      }

      .sheet {
        width: 100%;
        max-width: 210mm;
        margin: 0 auto;
        padding: 12mm 10mm 16mm;
      }

      .frame {
        border: 1.4px solid var(--ink);
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
        font-size: 28px;
        line-height: 1.06;
        letter-spacing: -0.03em;
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
        background: #ffffff;
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
        border-left: 4px solid var(--accent);
        border-color: var(--line);
        background: color-mix(in srgb, var(--accent) 8%, white);
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
        border-bottom: 1.4px solid var(--ink);
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 251, 253, 0.98)),
          linear-gradient(90deg, color-mix(in srgb, var(--accent) 10%, transparent), transparent 30%);
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
        max-width: none;
        margin: 18px 0 0;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 42px;
        line-height: 1.02;
        letter-spacing: -0.04em;
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
        border: 1px solid var(--ink);
        background: var(--ink);
        color: #ffffff;
        font: 700 24px/1 Arial, sans-serif;
        letter-spacing: 0.16em;
      }

      .brand-logo {
        width: 68px;
        height: 68px;
        object-fit: contain;
        border: 1px solid var(--ink);
        background: #ffffff;
        padding: 8px;
      }

      .brand-stack strong {
        display: block;
        font: 700 20px/1.2 Georgia, "Times New Roman", serif;
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
        border: 1px solid var(--ink);
        background: #ffffff;
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

      .report-kicker-row {
        display: flex;
        align-items: center;
        gap: 18px;
        margin-top: 24px;
      }

      .dac-mark {
        width: 282px;
        height: 102px;
        flex: 0 0 auto;
      }

      .cover-standard-strip {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        margin-top: 18px;
      }

      .standard-pill {
        min-width: 0;
        border: 1px solid var(--line);
        background: #ffffff;
        padding: 10px 12px;
      }

      .standard-pill strong {
        display: block;
        font: 700 11px/1.2 Arial, sans-serif;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--ink);
      }

      .standard-pill span {
        display: block;
        margin-top: 6px;
        font: 400 11px/1.5 Arial, sans-serif;
        color: var(--ink-soft);
      }

      .result-board,
      .standards-grid {
        display: grid;
        gap: 14px;
      }

      .result-board {
        grid-template-columns: minmax(0, 0.68fr) minmax(0, 1fr);
        align-items: start;
      }

      .standards-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .result-brief {
        display: grid;
        gap: 12px;
      }

      .result-chip-grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .result-chip,
      .standard-card {
        border: 1px solid var(--line);
        background: #ffffff;
        padding: 14px;
        break-inside: avoid;
      }

      .result-chip strong,
      .standard-card h3 {
        display: block;
        color: var(--ink);
      }

      .result-chip strong {
        font: 700 11px/1.4 Arial, sans-serif;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      .result-chip span {
        display: block;
        margin-top: 7px;
        font: 700 18px/1.25 Arial, sans-serif;
        color: var(--ink);
      }

      .result-chip small,
      .standard-card p {
        display: block;
        margin-top: 8px;
        font: 400 12px/1.6 Arial, sans-serif;
        color: var(--ink-soft);
      }

      .standard-card h3 {
        margin: 0;
        font-size: 16px;
        line-height: 1.3;
      }

      .result-chart-card {
        border: 1px solid var(--line);
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(247, 250, 252, 0.92));
        border-radius: 18px;
        padding: 18px;
      }

      .result-chart-head {
        display: flex;
        align-items: start;
        justify-content: space-between;
        gap: 16px;
      }

      .result-chart-head h3 {
        margin: 8px 0 0;
        font-size: 20px;
        letter-spacing: -0.03em;
      }

      .result-chart-head p {
        margin: 8px 0 0;
        font: 400 12px/1.7 Arial, sans-serif;
        color: var(--ink-soft);
      }

      .chart-meta {
        flex-shrink: 0;
        font: 700 10px/1.4 Arial, sans-serif;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--ink-faint);
      }

      .chart-meta-stack {
        display: grid;
        gap: 6px;
        justify-items: end;
      }

      .chart-meta-accent {
        padding: 6px 10px;
        border: 1px solid color-mix(in srgb, var(--accent) 22%, var(--line));
        border-radius: 999px;
        background: color-mix(in srgb, var(--accent) 10%, white);
        color: var(--accent-ink);
      }

      .chart-band-strip {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
      }

      .chart-band-pill {
        display: inline-flex;
        align-items: center;
        padding: 6px 10px;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.88);
        font: 600 10px/1.4 Arial, sans-serif;
        color: var(--ink-soft);
      }

      .chart-band-pill-low {
        border-color: rgba(201, 115, 66, 0.22);
        background: rgba(201, 115, 66, 0.08);
      }

      .chart-band-pill-speech {
        border-color: rgba(42, 157, 143, 0.2);
        background: rgba(42, 157, 143, 0.08);
      }

      .chart-band-pill-high {
        border-color: rgba(188, 108, 37, 0.2);
        background: rgba(188, 108, 37, 0.08);
      }

      .plot-shell {
        margin-top: 14px;
        border: 1px solid var(--line);
        border-radius: 16px;
        background: linear-gradient(180deg, rgba(246, 249, 252, 0.9), rgba(255, 255, 255, 0.98));
        padding: 12px;
      }

      .result-plot {
        display: block;
        width: 100%;
        height: auto;
      }

      .plot-grid-line {
        stroke: rgba(116, 135, 154, 0.3);
        stroke-width: 1;
        stroke-dasharray: 3 7;
      }

      .plot-grid-line-vertical {
        stroke: rgba(116, 135, 154, 0.16);
      }

      .plot-lane-band {
        rx: 18px;
      }

      .plot-lane-band-primary {
        stroke: rgba(38, 70, 83, 0.08);
        stroke-width: 1;
      }

      .plot-lane-index {
        fill: var(--ink-faint);
        font: 700 9px/1 Arial, sans-serif;
        letter-spacing: 0.14em;
      }

      .plot-frame-line {
        stroke: var(--ink);
        stroke-width: 1.2;
      }

      .plot-axis-label,
      .plot-metric-label,
      .plot-tag-label {
        font-family: Arial, "Helvetica Neue", sans-serif;
      }

      .plot-axis-label {
        fill: var(--ink-faint);
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.08em;
      }

      .plot-axis-title {
        fill: var(--ink-faint);
        font: 700 10px/1.4 Arial, sans-serif;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .curve-band-label {
        fill: var(--ink-faint);
        font: 700 9px/1.4 Arial, sans-serif;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .plot-series-line {
        stroke: color-mix(in srgb, var(--accent) 44%, var(--ink));
        stroke-width: 2.4;
        stroke-dasharray: 4 4;
      }

      .plot-drop-line {
        stroke: rgba(38, 70, 83, 0.18);
        stroke-width: 1.2;
        stroke-dasharray: 3 6;
      }

      .plot-point {
        stroke: var(--ink);
        stroke-width: 2;
      }

      .plot-point-primary {
        stroke-width: 2.4;
      }

      .plot-point-higher {
        fill: color-mix(in srgb, var(--accent) 60%, white);
      }

      .plot-point-lower {
        fill: color-mix(in srgb, var(--ink) 18%, white);
      }

      .plot-point-neutral {
        fill: #ffffff;
      }

      .plot-tag {
        stroke: var(--ink);
        stroke-width: 1;
        fill: rgba(255, 255, 255, 0.96);
      }

      .plot-tag-primary {
        stroke-width: 1.2;
      }

      .plot-tag-label {
        fill: var(--ink);
        font-size: 10px;
        font-weight: 700;
      }

      .plot-metric-label {
        fill: var(--ink);
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.02em;
      }

      .response-curve-grid {
        display: grid;
        gap: 14px;
      }

      .curve-series-line {
        stroke-width: 2.2;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-dasharray: 6 5;
      }

      .curve-series-line-active {
        stroke-width: 3;
        stroke-dasharray: none;
      }

      .curve-series-line-airborne,
      .curve-series-point-airborne,
      .curve-legend-swatch-airborne {
        stroke: #c97342;
        fill: #c97342;
        background: #c97342;
      }

      .curve-series-line-source,
      .curve-series-point-source,
      .curve-legend-swatch-source {
        stroke: #264653;
        fill: #264653;
        background: #264653;
      }

      .curve-series-line-field,
      .curve-series-point-field,
      .curve-legend-swatch-field {
        stroke: #bc6c25;
        fill: #bc6c25;
        background: #bc6c25;
      }

      .curve-series-line-standardized,
      .curve-series-point-standardized,
      .curve-legend-swatch-standardized {
        stroke: #2a9d8f;
        fill: #2a9d8f;
        background: #2a9d8f;
      }

      .curve-series-point {
        stroke: #ffffff;
        stroke-width: 1.4;
      }

      .curve-series-point-active {
        stroke-width: 1.8;
      }

      .result-row-copy strong {
        display: block;
        font: 700 13px/1.4 Arial, sans-serif;
        color: var(--ink);
      }

      .result-row-copy span {
        display: block;
        margin-top: 4px;
        font: 700 18px/1.2 Arial, sans-serif;
        color: var(--ink);
      }

      .result-row-copy small {
        display: block;
        margin-top: 6px;
        font: 400 11px/1.6 Arial, sans-serif;
        color: var(--ink-soft);
      }

      .result-legend-strip {
        display: grid;
        gap: 10px;
        margin-top: 14px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .curve-readout-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
        margin-top: 12px;
      }

      .curve-readout-card {
        border: 1px solid var(--line);
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.82);
        padding: 10px 12px;
      }

      .curve-readout-card strong {
        display: block;
        font: 700 10px/1.4 Arial, sans-serif;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--ink-faint);
      }

      .curve-readout-card span {
        display: block;
        margin-top: 6px;
        font: 700 18px/1.15 Arial, sans-serif;
        color: var(--ink);
      }

      .curve-readout-card small {
        display: block;
        margin-top: 6px;
        font: 400 11px/1.5 Arial, sans-serif;
        color: var(--ink-soft);
      }

      .result-legend-row {
        display: flex;
        align-items: start;
        gap: 10px;
        border: 1px solid var(--line);
        background: #ffffff;
        padding: 10px 12px;
      }

      .curve-legend-swatch {
        flex: 0 0 12px;
        width: 12px;
        height: 12px;
        margin-top: 3px;
      }

      .construction-grid {
        display: grid;
        gap: 14px;
        grid-template-columns: minmax(0, 0.68fr) minmax(0, 1fr);
      }

      .construction-figure {
        border: 1px solid var(--line);
        background: linear-gradient(180deg, #ffffff, #f7fafc);
        padding: 14px;
        display: grid;
        gap: 10px;
        font: 700 10px/1 Arial, sans-serif;
        color: var(--ink);
      }

      .construction-figure-note {
        font: 400 11px/1.6 Arial, sans-serif;
        color: var(--ink-soft);
      }

      .construction-legend {
        display: grid;
        gap: 10px;
      }

      .construction-table {
        width: 100%;
        border-collapse: collapse;
        font: 400 11px/1.5 Arial, sans-serif;
      }

      .construction-table th {
        background: #f5f5f5;
        font-weight: 700;
        font-size: 9px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        text-align: left;
        padding: 6px 8px;
        border-bottom: 1.5px solid var(--line);
      }

      .construction-table td {
        padding: 5px 8px;
        border-bottom: 1px solid #e8e8e8;
        vertical-align: top;
      }

      .construction-table td strong {
        display: block;
        color: var(--ink);
      }

      .construction-table td span {
        display: block;
        margin-top: 3px;
        color: var(--ink-soft);
        font-size: 10px;
      }

      .construction-summary-card {
        border: 1px solid var(--line);
        background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(244,247,250,0.98));
        padding: 12px 14px;
      }

      .construction-summary-card strong {
        display: block;
        font: 700 10px/1.4 Arial, sans-serif;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--ink-faint);
      }

      .construction-summary-card span {
        display: block;
        margin-top: 6px;
        font: 700 20px/1.2 Georgia, "Times New Roman", serif;
        color: var(--ink);
      }

      .construction-summary-card small {
        display: block;
        margin-top: 8px;
        font: 400 11px/1.6 Arial, sans-serif;
        color: var(--ink-soft);
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
        background: #f8fbfd;
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
        background: #ffffff;
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
        border-bottom: 1.4px solid var(--ink);
        background: linear-gradient(180deg, rgba(248, 251, 253, 0.98), rgba(255, 255, 255, 0.98));
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
        break-inside: avoid;
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
        background: #ffffff;
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
        .cover-standard-strip,
        .issue-grid,
        .appendix-strip,
        .result-board,
        .result-chip-grid,
        .result-legend-strip,
        .summary-grid,
        .standards-grid,
        .detail-grid,
        .page-header-grid,
        .signature-grid,
        .construction-grid {
          grid-template-columns: 1fr;
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
          <div class="report-kicker-row">
            <div class="dac-mark">${reportMarkSvg}</div>
          </div>
          <h1 class="cover-title">${escapeHtml(branding.coverTitle)}</h1>
          <p class="cover-kicker">
            ${escapeHtml(branding.coverKicker)}
          </p>
          <div class="cover-standard-strip">
            ${renderProposalStandardPills(standardReferences)}
          </div>
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
          <div class="eyebrow">${escapeHtml(SIMPLE_WORKBENCH_REPORT_MARK)} | ${escapeHtml(SIMPLE_WORKBENCH_REPORT_PRODUCT_NAME)}</div>
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
          <div class="eyebrow" style="margin: 18px 0 8px;">Issue Snapshot</div>
          <div class="summary-grid" style="margin-top: 0;">
            <div class="metric">
              <strong>Primary read</strong>
              <span>${escapeHtml(document.primaryMetricLabel)} ${escapeHtml(document.primaryMetricValue)}</span>
              <small>${escapeHtml(document.assemblyHeadline)}</small>
            </div>
            <div class="metric">
              <strong>Route</strong>
              <span>${escapeHtml(document.dynamicBranchLabel)}</span>
              <small>${escapeHtml(document.dynamicBranchDetail)}</small>
            </div>
            <div class="metric">
              <strong>Validation</strong>
              <span>${escapeHtml(document.validationLabel)}</span>
              <small>${escapeHtml(document.validationDetail)}</small>
            </div>
            <div class="metric">
              <strong>Stack</strong>
              <span>${escapeHtml(constructionSection.totalThicknessLabel)}</span>
              <small>${document.layers.length} visible row${document.layers.length === 1 ? "" : "s"} · ${stackDensityCount} density line${stackDensityCount === 1 ? "" : "s"} · ${stackSurfaceMassCount} surface-mass line${stackSurfaceMassCount === 1 ? "" : "s"}</small>
            </div>
          </div>
        </section>

        <section class="section">
          <div class="eyebrow" style="margin: 18px 0 8px;">Acoustic Result Profile</div>
          <div class="result-board">
            <div class="result-brief">
              <div class="method-box">
                <h3>DAC technical reading</h3>
                <p>${escapeHtml(document.primaryMetricLabel)} ${escapeHtml(document.primaryMetricValue)} is the current headline answer. Single-number ratings on this issue are expressed in the active ISO rating language, while route choice and validation posture remain explicit below.</p>
              </div>
              <div class="result-chip-grid">
                ${renderProposalMetricHighlights(document.metrics)}
              </div>
              <div class="method-box">
                <div class="eyebrow" style="margin-bottom: 8px;">Result interpretation</div>
                <h3>Consultant-facing answer set</h3>
                <p>Weighted airborne ratings target higher values; weighted impact ratings target lower values. Where the active lane exposes real band data, DAC plots the actual response curve instead of a proxy summary chart.</p>
              </div>
            </div>
            ${renderProposalResponseCurves(document)}
          </div>
        </section>

        <section class="section">
          <div class="eyebrow" style="margin: 18px 0 8px;">ISO &amp; Method Basis</div>
          <div class="method-box">
            <h3>ISO-aligned calculation basis</h3>
            <p>Calculations and single-number ratings are expressed using the active ISO basis relevant to the current route. ${escapeHtml(SIMPLE_WORKBENCH_REPORT_MARK)} output keeps prediction, field continuation, and evidence posture explicit instead of presenting the result as an accredited test certificate.</p>
          </div>
          <div class="standards-grid" style="padding-top: 12px;">
            ${renderProposalStandardCards(standardReferences)}
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
            <h3>Why the calculator is reading the stack this way</h3>
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
          <div class="eyebrow" style="margin: 18px 0 8px;">Applied Method &amp; Deliverable Basis</div>
          <table>
            <thead>
              <tr>
                <th>Basis</th>
                <th>Current reading</th>
                <th>Issue note</th>
              </tr>
            </thead>
            <tbody>
              ${renderMethodBasisRows(document)}
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
                <th>Density</th>
                <th>Surface Mass</th>
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

        <section class="detail-grid" style="padding-top: 12px;">
          <div class="method-box">
            <div class="eyebrow" style="margin-bottom: 8px;">Project Notes</div>
            <h3>Key actions and assumptions</h3>
            <ul>${compactRecommendationList}${compactAssumptionList}</ul>
          </div>
          <div class="method-box">
            <div class="eyebrow" style="margin-bottom: 8px;">Sources</div>
            <h3>Packaged reference lines</h3>
            <ul>${compactCitationList}</ul>
          </div>
        </section>

        <section class="footer">
          <div class="note-box">
            <p>
              Prepared from the ${escapeHtml(SIMPLE_WORKBENCH_REPORT_PRODUCT_NAME)}. This ${escapeHtml(SIMPLE_WORKBENCH_REPORT_MARK)} sheet summarizes a project estimate and should be read together with the visible solver posture, ISO basis, assumptions, and any required laboratory or site verification.
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
