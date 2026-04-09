"use client";

import type { AssemblyCalculation, ReportProfile } from "@dynecho/shared";
import { SurfacePanel } from "@dynecho/ui";
import { Building2, Copy, Download, FilePenLine, FileText, LibraryBig, Printer, Save, ScrollText, Star, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  buildSimpleWorkbenchProposalText,
  type SimpleWorkbenchProposalCorridorDossierCard,
  type SimpleWorkbenchProposalCoverageItem,
  type SimpleWorkbenchProposalDocument,
  type SimpleWorkbenchProposalIssueRegisterItem,
  type SimpleWorkbenchProposalLayer,
  type SimpleWorkbenchProposalMethodDossierCard,
  type SimpleWorkbenchProposalMethodTraceGroup,
  type SimpleWorkbenchProposalMetric
} from "./simple-workbench-proposal";
import { SimpleWorkbenchProposalConstructionFigure } from "./simple-workbench-proposal-construction-figure";
import { buildSimpleWorkbenchProposalDossier } from "./simple-workbench-proposal-dossier";
import type {
  SimpleWorkbenchProposalCitation,
  SimpleWorkbenchProposalDecisionItem
} from "./simple-workbench-evidence";
import {
  deleteSimpleWorkbenchProposalCompanyProfile,
  exportSimpleWorkbenchProposalCompanyProfiles,
  getDefaultSimpleWorkbenchProposalCompanyProfile,
  importSimpleWorkbenchProposalCompanyProfiles,
  matchesSimpleWorkbenchProposalCompanyProfile,
  readSimpleWorkbenchProposalCompanyProfiles,
  saveSimpleWorkbenchProposalCompanyProfile,
  setDefaultSimpleWorkbenchProposalCompanyProfile,
  type SimpleWorkbenchProposalCompanyProfile
} from "./simple-workbench-proposal-company-profiles";
import {
  buildSimpleWorkbenchProposalBrief,
  type SimpleWorkbenchProposalBrief,
  type SimpleWorkbenchSuggestedIssue
} from "./simple-workbench-proposal-brief";
import {
  readSimpleWorkbenchIssueSequence,
  reserveSimpleWorkbenchIssueSequence,
  type SimpleWorkbenchIssueSequenceSnapshot
} from "./simple-workbench-issue-sequence";
import {
  DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_ISSUE_PURPOSE,
  DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_VALIDITY_NOTE,
  matchSimpleWorkbenchProposalPolicyPreset,
  SIMPLE_WORKBENCH_PROPOSAL_POLICY_PRESETS,
  type SimpleWorkbenchProposalPolicyPreset
} from "./simple-workbench-proposal-policy-presets";
import { getSimpleWorkbenchProposalBranding } from "./simple-workbench-proposal-branding";
import {
  downloadSimpleWorkbenchProposalDocx,
  downloadSimpleWorkbenchProposalPdf,
  getSimpleWorkbenchProposalExportLabel,
  type SimpleWorkbenchProposalExportFormat,
  type SimpleWorkbenchProposalExportStyle
} from "./simple-workbench-proposal-pdf";
import { storeSimpleWorkbenchProposalPreview } from "./simple-workbench-proposal-preview-storage";
import { buildWorkbenchResponseCurveFigures } from "./response-curve-model";
import { REPORT_PROFILE_LABELS } from "./workbench-data";

type SimpleWorkbenchProposalPanelProps = {
  approverTitle: string;
  assemblyHeadline: string;
  briefNote: string;
  clientName: string;
  consultantAddress: string;
  citations: readonly SimpleWorkbenchProposalCitation[];
  consultantCompany: string;
  consultantEmail: string;
  consultantLogoDataUrl: string;
  consultantPhone: string;
  consultantWordmarkLine: string;
  contextLabel: string;
  coverageItems: readonly SimpleWorkbenchProposalCoverageItem[];
  corridorDossierCards: readonly SimpleWorkbenchProposalCorridorDossierCard[];
  corridorDossierHeadline: string;
  decisionTrailHeadline: string;
  decisionTrailItems: readonly SimpleWorkbenchProposalDecisionItem[];
  dynamicBranchDetail: string;
  dynamicBranchLabel: string;
  issueCodePrefix: string;
  issuedOnLabel: string;
  issuedOnIso: string;
  layers: readonly SimpleWorkbenchProposalLayer[];
  metrics: readonly SimpleWorkbenchProposalMetric[];
  methodDossierCards: readonly SimpleWorkbenchProposalMethodDossierCard[];
  methodDossierHeadline: string;
  methodTraceGroups: readonly SimpleWorkbenchProposalMethodTraceGroup[];
  onApproverTitleChange: (value: string) => void;
  onBriefNoteChange: (value: string) => void;
  onClientNameChange: (value: string) => void;
  onConsultantAddressChange: (value: string) => void;
  onConsultantCompanyChange: (value: string) => void;
  onConsultantEmailChange: (value: string) => void;
  onConsultantLogoDataUrlChange: (value: string) => void;
  onConsultantPhoneChange: (value: string) => void;
  onConsultantWordmarkLineChange: (value: string) => void;
  onPreparedByChange: (value: string) => void;
  onReportProfileChange: (value: ReportProfile) => void;
  onIssueCodePrefixChange: (value: string) => void;
  onProposalAttentionChange: (value: string) => void;
  onProposalIssuePurposeChange: (value: string) => void;
  onProposalRecipientChange: (value: string) => void;
  onProjectNameChange: (value: string) => void;
  onProposalReferenceChange: (value: string) => void;
  onProposalRevisionChange: (value: string) => void;
  onProposalSubjectChange: (value: string) => void;
  onProposalValidityNoteChange: (value: string) => void;
  preparedBy: string;
  proposalAttention: string;
  proposalIssuePurpose: string;
  proposalRecipient: string;
  projectName: string;
  proposalReference: string;
  proposalRevision: string;
  proposalSubject: string;
  proposalValidityNote: string;
  reportProfile: ReportProfile;
  reportProfileLabel: string;
  result: AssemblyCalculation | null;
  studyModeLabel: string;
  studyContextLabel: string;
  validationDetail: string;
  validationLabel: string;
  validationTone: "neutral" | "ready" | "warning";
  warnings: readonly string[];
};

function buildProposalBriefInput(props: SimpleWorkbenchProposalPanelProps) {
  return {
    briefNote: props.briefNote,
    citations: props.citations,
    consultantCompany: props.consultantCompany.trim() || "DynEcho Acoustic Consulting",
    contextLabel: props.contextLabel,
    dynamicBranchDetail: props.dynamicBranchDetail,
    dynamicBranchLabel: props.dynamicBranchLabel,
    issueCodePrefix: props.issueCodePrefix.trim(),
    issuedOnIso: props.issuedOnIso,
    primaryMetricLabel: props.metrics[0]?.label ?? "Primary read",
    primaryMetricValue: props.metrics[0]?.value ?? "Waiting for supported output",
    projectName: props.projectName.trim() || "Untitled acoustic proposal",
    reportProfileLabel: props.reportProfileLabel,
    studyContextLabel: props.studyContextLabel,
    studyModeLabel: props.studyModeLabel,
    validationDetail: props.validationDetail,
    validationLabel: props.validationLabel,
    validationTone: props.validationTone,
    warnings: props.warnings
  };
}

function getEffectiveProposalIssuePurpose(value: string): string {
  return value.trim().length > 0 ? value.trim() : DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_ISSUE_PURPOSE;
}

function getEffectiveProposalValidityNote(value: string): string {
  return value.trim().length > 0 ? value.trim() : DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_VALIDITY_NOTE;
}

function getStudyModeAwareProposalSubject(projectName: string, studyModeLabel: string): string {
  const projectLabel = projectName.trim() || "Untitled project";
  const modeLabel = studyModeLabel.trim().toLowerCase();

  return modeLabel.length > 0 ? `${projectLabel} ${modeLabel} acoustic proposal` : `${projectLabel} acoustic proposal`;
}

const GENERIC_PROPOSAL_IDENTITY = {
  approverTitle: "Acoustic Consultant",
  consultantAddress: "Office address not entered",
  consultantCompany: "DynEcho Acoustic Consulting",
  consultantEmail: "Contact email not entered",
  consultantPhone: "Contact phone not entered",
  preparedBy: "DynEcho Operator"
} as const;

function isBlankOrDefaultIdentityValue(value: string, fallback: string): boolean {
  const normalizedValue = value.trim();
  return normalizedValue.length === 0 || normalizedValue === fallback;
}

function isSystemProposalIdentity(props: SimpleWorkbenchProposalPanelProps): boolean {
  return (
    isBlankOrDefaultIdentityValue(props.approverTitle, GENERIC_PROPOSAL_IDENTITY.approverTitle) &&
    isBlankOrDefaultIdentityValue(props.consultantAddress, GENERIC_PROPOSAL_IDENTITY.consultantAddress) &&
    isBlankOrDefaultIdentityValue(props.consultantCompany, GENERIC_PROPOSAL_IDENTITY.consultantCompany) &&
    isBlankOrDefaultIdentityValue(props.consultantEmail, GENERIC_PROPOSAL_IDENTITY.consultantEmail) &&
    props.consultantLogoDataUrl.trim().length === 0 &&
    isBlankOrDefaultIdentityValue(props.consultantPhone, GENERIC_PROPOSAL_IDENTITY.consultantPhone) &&
    props.consultantWordmarkLine.trim().length === 0 &&
    props.issueCodePrefix.trim().length === 0 &&
    isBlankOrDefaultIdentityValue(props.preparedBy, GENERIC_PROPOSAL_IDENTITY.preparedBy) &&
    props.reportProfile === "consultant"
  );
}

function ProposalField(props: {
  label: string;
  note: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  const { label, multiline = false, note, onChange, placeholder, value } = props;

  return (
    <label className="grid gap-2">
      <div className="grid gap-1">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">{label}</span>
        {note.trim().length > 0 ? (
          <p className="max-w-[34rem] text-[0.78rem] leading-5 text-[color:var(--ink-soft)]">{note}</p>
        ) : null}
      </div>
      {multiline ? (
        <textarea
          className="focus-ring min-h-28 rounded-md border hairline bg-[color:var(--paper)] px-3 py-3 text-sm leading-6 text-[color:var(--ink)]"
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          value={value}
        />
      ) : (
        <input
          className="focus-ring rounded-md border hairline bg-[color:var(--paper)] px-3 py-3 text-sm text-[color:var(--ink)]"
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          value={value}
        />
      )}
    </label>
  );
}

function PreviewMetric(props: { detail: string; label: string; value: string }) {
  const { detail, label, value } = props;

  return (
    <article className="min-w-0 rounded-md border hairline bg-[color:var(--paper)]/78 px-4 py-4">
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{label}</div>
      <div className="mt-2 break-words text-lg font-semibold text-[color:var(--ink)]">{value}</div>
      <p className="mt-2 text-[0.82rem] leading-5 text-[color:var(--ink-soft)]">{detail}</p>
    </article>
  );
}

function IssueMetaCard(props: { detail: string; label: string; value: string }) {
  const { detail, label, value } = props;

  return (
    <article className="min-w-0 rounded-md border hairline bg-[color:var(--paper)]/78 px-4 py-4">
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{label}</div>
      <div className="mt-2 break-words text-sm font-semibold text-[color:var(--ink)]">{value}</div>
      <p className="mt-2 text-[0.82rem] leading-5 text-[color:var(--ink-soft)]">{detail}</p>
    </article>
  );
}

function DecisionTrailCard(props: SimpleWorkbenchProposalDecisionItem) {
  return <IssueMetaCard detail={props.detail} label={props.label} value={props.tone.replaceAll("_", " ")} />;
}

function CitationCard(props: SimpleWorkbenchProposalCitation) {
  const { detail, href, label, tone } = props;

  return (
    <article className="rounded-md border hairline bg-[color:var(--paper)]/78 px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{label}</div>
        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{tone}</div>
      </div>
      <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{detail}</p>
      {href ? (
        <a
          className="mt-3 inline-flex text-sm font-semibold text-[color:var(--accent)] underline decoration-[color:color-mix(in_oklch,var(--accent)_60%,transparent)] underline-offset-4"
          href={href}
          rel="noreferrer"
          target="_blank"
        >
          Open source
        </a>
      ) : null}
    </article>
  );
}

function coverageToneClass(status: SimpleWorkbenchProposalCoverageItem["status"]): string {
  switch (status) {
    case "live":
      return "border-[color:color-mix(in_oklch,var(--success)_34%,var(--line))] bg-[color:color-mix(in_oklch,var(--success)_10%,var(--paper))] text-[color:var(--success-ink)]";
    case "bound":
      return "hairline bg-[color:var(--paper)]/86 text-[color:var(--ink-soft)]";
    case "needs_input":
      return "border-[color:color-mix(in_oklch,var(--warning)_34%,var(--line))] bg-[color:color-mix(in_oklch,var(--warning)_12%,var(--paper))] text-[color:var(--warning-ink)]";
    case "unsupported":
    default:
      return "border-[color:color-mix(in_oklch,var(--warning)_24%,var(--line))] bg-[color:var(--paper)]/82 text-[color:var(--warning-ink)]";
  }
}

function coverageStatusLabel(status: SimpleWorkbenchProposalCoverageItem["status"]): string {
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

function coveragePostureTextClass(tone: SimpleWorkbenchProposalCoverageItem["postureTone"]): string {
  switch (tone) {
    case "success":
      return "text-[color:var(--success-ink)]";
    case "warning":
      return "text-[color:var(--warning-ink)]";
    case "accent":
      return "text-[color:var(--accent-ink)]";
    case "neutral":
    default:
      return "text-[color:var(--ink)]";
  }
}

function coveragePosturePanelClass(tone: SimpleWorkbenchProposalCoverageItem["postureTone"]): string {
  switch (tone) {
    case "success":
      return "border-[color:color-mix(in_oklch,var(--success)_34%,var(--line))] bg-[color:color-mix(in_oklch,var(--success)_8%,var(--paper))]";
    case "warning":
      return "border-[color:color-mix(in_oklch,var(--warning)_34%,var(--line))] bg-[color:color-mix(in_oklch,var(--warning)_10%,var(--paper))]";
    case "accent":
      return "border-[color:color-mix(in_oklch,var(--accent)_24%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_8%,var(--paper))]";
    case "neutral":
    default:
      return "border-[color:var(--line)] bg-[color:var(--paper)]/72";
  }
}

function CoverageCard(props: SimpleWorkbenchProposalCoverageItem) {
  const { detail, label, nextStep, postureDetail, postureLabel, postureTone, status, value } = props;
  const postureTextClass = coveragePostureTextClass(postureTone);
  const posturePanelClass = coveragePosturePanelClass(postureTone);

  return (
    <article className="rounded-md border hairline bg-[color:var(--paper)]/78 px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="text-sm font-semibold text-[color:var(--ink)]">{label}</div>
        <div className={`inline-flex rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${coverageToneClass(status)}`}>
          {coverageStatusLabel(status)}
        </div>
      </div>
      <div className="mt-3 text-lg font-semibold text-[color:var(--ink)]">{value}</div>
      <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{detail}</p>
      <div className={`mt-3 rounded border px-3 py-3 ${posturePanelClass}`}>
        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Evidence class</div>
        <div className={`mt-2 text-sm font-semibold ${postureTextClass}`}>{postureLabel}</div>
        <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">{postureDetail}</p>
      </div>
      {nextStep ? (
        <p className="mt-2 text-sm leading-6 text-[color:var(--ink)]">
          <span className="font-semibold">Next action:</span> {nextStep}
        </p>
      ) : null}
    </article>
  );
}

function formatIssueReservationLabel(iso: string): string {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})/u.exec(iso);
  if (!dateMatch) {
    return "Reservation time unavailable";
  }

  return `${dateMatch[3]}/${dateMatch[2]}/${dateMatch[1]}`;
}

function buildIssueRegisterItems(input: {
  currentReference: string;
  currentRevision: string;
  issueSequenceSnapshot: SimpleWorkbenchIssueSequenceSnapshot;
  issuedOnLabel: string;
}): SimpleWorkbenchProposalIssueRegisterItem[] {
  const items: SimpleWorkbenchProposalIssueRegisterItem[] = [
    {
      detail: "Active issue line currently applied to the printable consultant sheet.",
      issuedOnLabel: input.issuedOnLabel,
      label: "Current issue",
      reference: input.currentReference,
      statusLabel: input.currentRevision
    }
  ];

  for (const entry of input.issueSequenceSnapshot.history) {
    if (entry.reference === input.currentReference) {
      continue;
    }

    items.push({
      detail: "Previous browser-local reservation captured on the same base issue stem.",
      issuedOnLabel: formatIssueReservationLabel(entry.reservedAtIso),
      label: "Reserved issue no",
      reference: entry.reference,
      statusLabel: "Rev 00"
    });
  }

  return items;
}

function buildProposalDocument(
  props: SimpleWorkbenchProposalPanelProps,
  proposalBrief: SimpleWorkbenchProposalBrief,
  suggestedIssue: SimpleWorkbenchSuggestedIssue,
  issueSequenceSnapshot: SimpleWorkbenchIssueSequenceSnapshot
): SimpleWorkbenchProposalDocument {
  const primaryMetric = props.metrics[0] ?? {
    detail: "Build a valid stack to generate the printable issue sheet.",
    label: "Primary read",
    value: "Waiting for live result"
  };
  const proposalReference =
    props.proposalReference.trim().length > 0 && props.proposalReference.trim() !== "DEC-2026-001"
      ? props.proposalReference.trim()
      : suggestedIssue.reference;
  const proposalRevision =
    props.proposalRevision.trim().length > 0 && props.proposalRevision.trim() !== "Rev 00"
      ? props.proposalRevision.trim()
      : suggestedIssue.revision;
  const proposalRecipient = props.proposalRecipient.trim().length > 0 ? props.proposalRecipient.trim() : props.clientName.trim() || "Client delivery team";
  const proposalAttention = props.proposalAttention.trim().length > 0 ? props.proposalAttention.trim() : "Attention line not entered";
  const proposalSubject =
    props.proposalSubject.trim().length > 0
      ? props.proposalSubject.trim()
      : getStudyModeAwareProposalSubject(props.projectName, props.studyModeLabel);
  const proposalIssuePurpose =
    props.proposalIssuePurpose.trim().length > 0
      ? props.proposalIssuePurpose.trim()
      : DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_ISSUE_PURPOSE;
  const proposalValidityNote =
    props.proposalValidityNote.trim().length > 0
      ? props.proposalValidityNote.trim()
      : DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_VALIDITY_NOTE;

  return {
    approverTitle: props.approverTitle.trim() || "Acoustic Consultant",
    assemblyHeadline: props.assemblyHeadline,
    assumptionItems: proposalBrief.assumptionItems,
    briefNote: props.briefNote,
    clientName: props.clientName.trim() || "Unnamed client",
    consultantAddress: props.consultantAddress.trim() || "Office address not entered",
    citations: props.citations,
    consultantCompany: props.consultantCompany.trim() || "DynEcho Acoustic Consulting",
    consultantEmail: props.consultantEmail.trim() || "Contact email not entered",
    consultantLogoDataUrl: props.consultantLogoDataUrl.trim(),
    consultantPhone: props.consultantPhone.trim() || "Contact phone not entered",
    consultantWordmarkLine: props.consultantWordmarkLine.trim(),
    corridorDossierCards: props.corridorDossierCards,
    corridorDossierHeadline: props.corridorDossierHeadline,
    contextLabel: props.contextLabel,
    coverageItems: props.coverageItems,
    decisionTrailHeadline: props.decisionTrailHeadline,
    decisionTrailItems: props.decisionTrailItems,
    dynamicBranchDetail: props.dynamicBranchDetail,
    dynamicBranchLabel: props.dynamicBranchLabel,
    executiveSummary: proposalBrief.executiveSummary,
    issuedOnLabel: props.issuedOnLabel,
    issuedOnIso: props.issuedOnIso,
    issueBaseReference: issueSequenceSnapshot.baseReference,
    issueCodePrefix: props.issueCodePrefix.trim(),
    issueNextReference: issueSequenceSnapshot.nextReference,
    issueRegisterItems: buildIssueRegisterItems({
      currentReference: proposalReference,
      currentRevision: proposalRevision,
      issueSequenceSnapshot,
      issuedOnLabel: props.issuedOnLabel
    }),
    layers: props.layers,
    methodDossierCards: props.methodDossierCards,
    methodDossierHeadline: props.methodDossierHeadline,
    methodTraceGroups: props.methodTraceGroups,
    metrics:
      props.metrics.length > 0
        ? props.metrics
        : [
            {
              detail: "No live outputs yet. Finish the stack and route inputs first.",
              label: "Status",
              value: "Waiting for supported output"
            }
          ],
    preparedBy: props.preparedBy.trim() || "DynEcho Operator",
    primaryMetricLabel: primaryMetric.label,
    primaryMetricValue: primaryMetric.value,
    projectName: props.projectName.trim() || "Untitled acoustic proposal",
    proposalAttention,
    proposalIssuePurpose,
    proposalRecipient,
    proposalReference,
    proposalRevision,
    proposalSubject,
    proposalValidityNote,
    recommendationItems: proposalBrief.recommendationItems,
    reportProfile: props.reportProfile,
    reportProfileLabel: props.reportProfileLabel,
    responseCurves: buildWorkbenchResponseCurveFigures(props.result),
    studyModeLabel: props.studyModeLabel,
    studyContextLabel: props.studyContextLabel,
    validationDetail: props.validationDetail,
    validationLabel: props.validationLabel,
    warnings: props.warnings
  };
}

export function SimpleWorkbenchProposalPanel(props: SimpleWorkbenchProposalPanelProps) {
  const {
    onApproverTitleChange,
    onConsultantAddressChange,
    onConsultantCompanyChange,
    onConsultantEmailChange,
    onConsultantLogoDataUrlChange,
    onConsultantPhoneChange,
    onConsultantWordmarkLineChange,
    onIssueCodePrefixChange,
    onPreparedByChange,
    onProposalIssuePurposeChange,
    onProposalValidityNoteChange,
    onReportProfileChange
  } = props;
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [companyProfiles, setCompanyProfiles] = useState<readonly SimpleWorkbenchProposalCompanyProfile[]>([]);
  const [profileDraftLabel, setProfileDraftLabel] = useState(() => props.consultantCompany.trim() || "Current office profile");
  const importProfilesInputRef = useRef<HTMLInputElement | null>(null);
  const proposalBrief = buildSimpleWorkbenchProposalBrief(buildProposalBriefInput(props));
  const suggestedIssue = proposalBrief.suggestedIssue;
  const [issueSequenceSnapshot, setIssueSequenceSnapshot] = useState<SimpleWorkbenchIssueSequenceSnapshot>(() =>
    readSimpleWorkbenchIssueSequence(suggestedIssue.reference)
  );
  const proposalDocument = buildProposalDocument(props, proposalBrief, suggestedIssue, issueSequenceSnapshot);
  const proposalBranding = getSimpleWorkbenchProposalBranding({
    consultantCompany: proposalDocument.consultantCompany,
    consultantWordmarkLine: proposalDocument.consultantWordmarkLine,
    projectName: proposalDocument.projectName,
    reportProfile: proposalDocument.reportProfile,
    reportProfileLabel: proposalDocument.reportProfileLabel
  });
  const proposalDossier = buildSimpleWorkbenchProposalDossier(proposalDocument);
  const proposalText = buildSimpleWorkbenchProposalText(proposalDocument);
  const exportReady = props.layers.length > 0 && props.metrics.length > 0;
  const effectiveProposalIssuePurpose = getEffectiveProposalIssuePurpose(props.proposalIssuePurpose);
  const effectiveProposalValidityNote = getEffectiveProposalValidityNote(props.proposalValidityNote);
  const activeProposalPolicyPreset = matchSimpleWorkbenchProposalPolicyPreset({
    issuePurpose: effectiveProposalIssuePurpose,
    validityNote: effectiveProposalValidityNote
  });
  const defaultCompanyProfile =
    companyProfiles.find((profile) => profile.isDefault) ?? getDefaultSimpleWorkbenchProposalCompanyProfile();
  const activeCompanyProfile =
    companyProfiles.find((profile) =>
      matchesSimpleWorkbenchProposalCompanyProfile(profile, {
        approverTitle: props.approverTitle,
        consultantAddress: props.consultantAddress,
        consultantCompany: props.consultantCompany,
        consultantEmail: props.consultantEmail,
        consultantLogoDataUrl: props.consultantLogoDataUrl,
        consultantPhone: props.consultantPhone,
        consultantWordmarkLine: props.consultantWordmarkLine,
        issueCodePrefix: props.issueCodePrefix,
        preparedBy: props.preparedBy,
        preferredReportProfile: props.reportProfile
      })
    ) ?? null;
  const systemProposalIdentity = isSystemProposalIdentity(props);
  const readyCoverageCount = proposalDossier.readyCoverageCount;
  const parkedCoverageCount = proposalDossier.parkedCoverageCount;
  const unsupportedCoverageCount = proposalDossier.unsupportedCoverageCount;
  const methodTraceNoteCount = proposalDocument.methodTraceGroups.reduce((count, group) => count + group.notes.length, 0);
  const corridorCardCount = proposalDocument.corridorDossierCards.length;
  const warningToneClass =
    props.warnings.length > 0
      ? "border-[color:color-mix(in_oklch,var(--warning)_30%,var(--line))] bg-[color:color-mix(in_oklch,var(--warning)_12%,var(--paper))] text-[color:var(--warning-ink)]"
      : "hairline bg-[color:var(--paper)]/74 text-[color:var(--ink-soft)]";

  useEffect(() => {
    setIssueSequenceSnapshot(readSimpleWorkbenchIssueSequence(suggestedIssue.reference));
  }, [suggestedIssue.reference]);

  useEffect(() => {
    setCompanyProfiles(readSimpleWorkbenchProposalCompanyProfiles());
  }, []);

  useEffect(() => {
    if (profileDraftLabel.trim().length === 0 && props.consultantCompany.trim().length > 0) {
      setProfileDraftLabel(props.consultantCompany.trim());
    }
  }, [profileDraftLabel, props.consultantCompany]);

  useEffect(() => {
    if (!defaultCompanyProfile) {
      return;
    }

    if (activeCompanyProfile?.id === defaultCompanyProfile.id) {
      return;
    }

    if (!systemProposalIdentity) {
      return;
    }

    onConsultantCompanyChange(defaultCompanyProfile.consultantCompany);
    onPreparedByChange(defaultCompanyProfile.preparedBy);
    onApproverTitleChange(defaultCompanyProfile.approverTitle);
    onConsultantEmailChange(defaultCompanyProfile.consultantEmail);
    onConsultantLogoDataUrlChange(defaultCompanyProfile.consultantLogoDataUrl);
    onConsultantPhoneChange(defaultCompanyProfile.consultantPhone);
    onConsultantWordmarkLineChange(defaultCompanyProfile.consultantWordmarkLine);
    onIssueCodePrefixChange(defaultCompanyProfile.issueCodePrefix);
    onProposalIssuePurposeChange(defaultCompanyProfile.proposalIssuePurpose);
    onProposalValidityNoteChange(defaultCompanyProfile.proposalValidityNote);
    onReportProfileChange(defaultCompanyProfile.preferredReportProfile);
    onConsultantAddressChange(defaultCompanyProfile.consultantAddress);
    setProfileDraftLabel(defaultCompanyProfile.label);
    toast.success("Default office loaded", {
      description: `${defaultCompanyProfile.label} replaced the generic DynEcho identity so this issue sheet opens on your saved office preset.`
    });
  }, [
    activeCompanyProfile?.id,
    defaultCompanyProfile,
    onApproverTitleChange,
    onConsultantAddressChange,
    onConsultantCompanyChange,
    onConsultantEmailChange,
    onConsultantLogoDataUrlChange,
    onConsultantPhoneChange,
    onConsultantWordmarkLineChange,
    onIssueCodePrefixChange,
    onPreparedByChange,
    onProposalIssuePurposeChange,
    onProposalValidityNoteChange,
    onReportProfileChange,
    systemProposalIdentity
  ]);

  async function handleCopySummary() {
    try {
      await navigator.clipboard.writeText(proposalText);
      toast.success("Proposal summary copied", {
        description: "The current client-facing summary is on your clipboard."
      });
    } catch {
      toast.error("Copy failed", {
        description: "Browser clipboard permission blocked the proposal summary."
      });
    }
  }

  async function handleDownloadExport(
    style: SimpleWorkbenchProposalExportStyle = "branded",
    format: SimpleWorkbenchProposalExportFormat = "pdf"
  ) {
    setIsDownloadingPdf(true);

    try {
      if (format === "docx") {
        await downloadSimpleWorkbenchProposalDocx(proposalDocument, {
          style
        });
      } else {
        await downloadSimpleWorkbenchProposalPdf(proposalDocument, {
          style
        });
      }
      toast.success(`${getSimpleWorkbenchProposalExportLabel({ format, style })} downloaded`, {
        description:
          format === "docx"
            ? "DynEcho prepared the Word document on the server from the current proposal snapshot."
            : style === "simple"
              ? "DynEcho prepared the lightweight calculation-summary PDF on the server."
              : "DynEcho prepared the formal proposal PDF on the server."
      });
    } catch (error) {
      toast.error(`${getSimpleWorkbenchProposalExportLabel({ format, style })} failed`, {
        description:
          error instanceof Error
            ? error.message
            : `DynEcho could not generate the ${getSimpleWorkbenchProposalExportLabel({ format, style })} on the server. Use the print view as a fallback.`
      });
    } finally {
      setIsDownloadingPdf(false);
    }
  }

  function openProposalPrintView(autoPrint: boolean) {
    storeSimpleWorkbenchProposalPreview(proposalDocument);
    const printWindow = window.open(`/workbench/proposal${autoPrint ? "?autoprint=1" : ""}`, "_blank");

    if (!printWindow) {
      toast.error("Print window blocked", {
        description: "Allow pop-ups so DynEcho can open the print-ready proposal view."
      });
      return;
    }
  }

  function openProposalAdjustmentView() {
    storeSimpleWorkbenchProposalPreview(proposalDocument);
    const adjustmentWindow = window.open("/workbench/proposal/configure", "_blank");

    if (!adjustmentWindow) {
      toast.error("PDF editor blocked", {
        description: "Allow pop-ups so DynEcho can open the PDF editor."
      });
    }
  }

  function handleApplySuggestedIssue() {
    props.onProposalReferenceChange(suggestedIssue.reference);
    props.onProposalRevisionChange(suggestedIssue.revision);
    toast.success("Suggested issue details applied", {
      description: "The proposal reference and revision now match the generated issue suggestion."
    });
  }

  function handleReserveIssueSequence() {
    const reservation = reserveSimpleWorkbenchIssueSequence(suggestedIssue.reference);
    setIssueSequenceSnapshot(reservation);
    props.onProposalReferenceChange(reservation.reservedReference);
    props.onProposalRevisionChange("Rev 00");
    toast.success("Issue number reserved", {
      description: `${reservation.reservedReference} is now applied. The next available issue number is ${reservation.nextReference}.`
    });
  }

  function handleApplyCompanyProfile(
    profile: SimpleWorkbenchProposalCompanyProfile,
    mode: "autoload" | "manual" = "manual"
  ) {
    props.onConsultantCompanyChange(profile.consultantCompany);
    props.onPreparedByChange(profile.preparedBy);
    props.onApproverTitleChange(profile.approverTitle);
    props.onConsultantEmailChange(profile.consultantEmail);
    props.onConsultantLogoDataUrlChange(profile.consultantLogoDataUrl);
    props.onConsultantPhoneChange(profile.consultantPhone);
    props.onConsultantWordmarkLineChange(profile.consultantWordmarkLine);
    props.onIssueCodePrefixChange(profile.issueCodePrefix);
    props.onProposalIssuePurposeChange(profile.proposalIssuePurpose);
    props.onProposalValidityNoteChange(profile.proposalValidityNote);
    props.onReportProfileChange(profile.preferredReportProfile);
    props.onConsultantAddressChange(profile.consultantAddress);
    setProfileDraftLabel(profile.label);
    toast.success(mode === "autoload" ? "Default office loaded" : "Company profile applied", {
      description:
        mode === "autoload"
          ? `${profile.label} replaced the generic DynEcho identity so this issue sheet opens on your saved office preset.`
          : `${profile.label} is now driving the consultant identity block, template profile, issue coding, and default clause policy.`
    });
  }

  function handleApplyPolicyPreset(preset: SimpleWorkbenchProposalPolicyPreset) {
    props.onProposalIssuePurposeChange(preset.issuePurpose);
    props.onProposalValidityNoteChange(preset.validityNote);
    toast.success("Clause preset applied", {
      description: `${preset.label} is now driving the issue purpose and validity wording for this proposal.`
    });
  }

  function handleSaveCurrentCompanyProfile() {
    if (props.consultantCompany.trim().length === 0) {
      toast.error("Company name required", {
        description: "Enter the issuing consultant company before saving a reusable local profile."
      });
      return;
    }

    const result = saveSimpleWorkbenchProposalCompanyProfile({
      approverTitle: props.approverTitle,
      consultantAddress: props.consultantAddress,
      consultantCompany: props.consultantCompany,
      consultantEmail: props.consultantEmail,
      consultantLogoDataUrl: props.consultantLogoDataUrl,
      consultantPhone: props.consultantPhone,
      consultantWordmarkLine: props.consultantWordmarkLine,
      issueCodePrefix: props.issueCodePrefix,
      label: profileDraftLabel,
      preparedBy: props.preparedBy,
      preferredReportProfile: props.reportProfile,
      proposalIssuePurpose: props.proposalIssuePurpose,
      proposalValidityNote: props.proposalValidityNote
    });
    setCompanyProfiles(result.profiles);
    setProfileDraftLabel(result.savedProfile.label);
    toast.success(result.action === "created" ? "Company profile saved" : "Company profile updated", {
      description: `${result.savedProfile.label} is now available in the local proposal library.`
    });
  }

  function handleDeleteCompanyProfile(profile: SimpleWorkbenchProposalCompanyProfile) {
    const profiles = deleteSimpleWorkbenchProposalCompanyProfile(profile.id);
    setCompanyProfiles(profiles);
    toast.success("Company profile removed", {
      description: `${profile.label} was removed from the local proposal library.`
    });
  }

  function handleSetDefaultCompanyProfile(profile: SimpleWorkbenchProposalCompanyProfile) {
    const profiles = setDefaultSimpleWorkbenchProposalCompanyProfile(profile.id);
    setCompanyProfiles(profiles);
    toast.success("Default office profile updated", {
      description: `${profile.label} is now the default office preset for this browser.`
    });
  }

  function handleApplyDefaultCompanyProfile() {
    const defaultProfile = companyProfiles.find((profile) => profile.isDefault);
    if (!defaultProfile) {
      toast.error("No default office profile", {
        description: "Mark one saved company profile as the default office preset first."
      });
      return;
    }

    handleApplyCompanyProfile(defaultProfile);
  }

  function handleExportCompanyProfiles() {
    if (companyProfiles.length === 0) {
      toast.error("No company profiles to export", {
        description: "Save at least one office profile before exporting the proposal library."
      });
      return;
    }

    const blob = new Blob([exportSimpleWorkbenchProposalCompanyProfiles()], {
      type: "application/json"
    });
    const objectUrl = window.URL.createObjectURL(blob);
    const anchor = window.document.createElement("a");

    anchor.href = objectUrl;
    anchor.download = "dynecho-proposal-company-profiles.json";
    anchor.click();

    window.setTimeout(() => {
      window.URL.revokeObjectURL(objectUrl);
    }, 0);

    toast.success("Company profile library exported", {
      description: `${companyProfiles.length} office profile${companyProfiles.length === 1 ? "" : "s"} packaged as JSON.`
    });
  }

  async function handleImportCompanyProfiles(fileList: FileList | null) {
    const file = fileList?.[0] ?? null;
    if (!file) {
      return;
    }

    const rawJson = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("The selected JSON file could not be read."));
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
          return;
        }

        reject(new Error("The selected JSON file did not produce text content."));
      };
      reader.readAsText(file);
    }).catch((error) => {
      toast.error("Company library import failed", {
        description: error instanceof Error ? error.message : "The selected file could not be read."
      });
      return null;
    });

    if (!rawJson) {
      return;
    }

    try {
      const result = importSimpleWorkbenchProposalCompanyProfiles(rawJson);
      setCompanyProfiles(result.profiles);
      toast.success("Company profile library imported", {
        description: `${result.importedCount} profile${result.importedCount === 1 ? "" : "s"} merged into the local office library.`
      });
    } catch (error) {
      toast.error("Company library import failed", {
        description: error instanceof Error ? error.message : "The JSON file could not be parsed."
      });
    } finally {
      if (importProfilesInputRef.current) {
        importProfilesInputRef.current.value = "";
      }
    }
  }

  async function handleConsultantLogoChange(fileList: FileList | null) {
    const file = fileList?.[0] ?? null;
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Unsupported logo file", {
        description: "Upload a PNG, JPEG, SVG, or WebP image for the proposal cover."
      });
      return;
    }

    if (file.size > 600_000) {
      toast.error("Logo file too large", {
        description: "Keep the logo under 600 KB so proposal previews and browser-local profiles stay lightweight."
      });
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Logo upload could not be read."));
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
          return;
        }

        reject(new Error("Logo upload produced an invalid data URL."));
      };
      reader.readAsDataURL(file);
    }).catch((error) => {
      toast.error("Logo upload failed", {
        description: error instanceof Error ? error.message : "The selected file could not be read."
      });
      return null;
    });

    if (!dataUrl) {
      return;
    }

    props.onConsultantLogoDataUrlChange(dataUrl);
    toast.success("Logo uploaded", {
      description: "The proposal preview and branded PDF now use the uploaded company logo."
    });
  }

  function handleClearConsultantLogo() {
    props.onConsultantLogoDataUrlChange("");
    toast.success("Logo cleared", {
      description: "The proposal cover returned to the monogram-only brand mark."
    });
  }

  return (
    <SurfacePanel className="px-5 py-6 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="eyebrow">Issue Sheet</div>
          <h2 className="mt-1 font-display text-[1.4rem] leading-none tracking-[-0.04em] text-[color:var(--ink)]">
            Package the proposal
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[color:var(--ink-soft)]">
            Set the issue identity, then export the live stack as a formal offer sheet.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
            <div className="rounded-full border hairline bg-[color:var(--paper)]/72 px-3 py-1.5">{props.reportProfileLabel}</div>
            <div className="rounded-full border hairline bg-[color:var(--paper)]/72 px-3 py-1.5">
              {props.metrics.length} live metric{props.metrics.length === 1 ? "" : "s"}
            </div>
            <div className="rounded-full border hairline bg-[color:var(--paper)]/72 px-3 py-1.5">
              {props.layers.length} visible row{props.layers.length === 1 ? "" : "s"}
            </div>
            <div className="rounded-full border hairline bg-[color:var(--paper)]/72 px-3 py-1.5">{props.studyModeLabel}</div>
          </div>
        </div>
        <div
          className={`inline-flex items-center rounded-full border px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] ${warningToneClass}`}
        >
          {props.warnings.length > 0 ? `${props.warnings.length} live warning${props.warnings.length === 1 ? "" : "s"}` : "Ready for issue review"}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
        <div className="grid gap-4">
          <div className="rounded-lg border hairline bg-[color:var(--paper)]/78 px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <Building2 className="h-4 w-4" />
              Issue register
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <ProposalField
                label="Consultant company"
                note="Issuer shown on the sheet."
                onChange={props.onConsultantCompanyChange}
                placeholder="e.g. Machinity Acoustic Consultants"
                value={props.consultantCompany}
              />
              <ProposalField
                label="Prepared by"
                note="Issue owner."
                onChange={props.onPreparedByChange}
                placeholder="e.g. O. Tuna"
                value={props.preparedBy}
              />
              <ProposalField
                label="Proposal reference"
                note="Formal issue code."
                onChange={props.onProposalReferenceChange}
                placeholder="e.g. MAC-2026-014"
                value={props.proposalReference}
              />
              <ProposalField
                label="Revision"
                note="Current issue status."
                onChange={props.onProposalRevisionChange}
                placeholder="e.g. Rev 01"
                value={props.proposalRevision}
              />
            </div>
            <div className="mt-4 rounded-md border border-[color:color-mix(in_oklch,var(--accent)_26%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_10%,var(--paper))] px-4 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                    Base issue code
                  </div>
                  <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">
                    {suggestedIssue.reference} · {suggestedIssue.revision}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{suggestedIssue.detail}</p>
                </div>
                <button
                  className="focus-ring inline-flex items-center rounded-full border hairline px-3 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
                  onClick={handleApplySuggestedIssue}
                  type="button"
                >
                  Use base code
                </button>
              </div>
            </div>
            <div className="mt-4 rounded-md border border-[color:color-mix(in_oklch,var(--accent)_20%,var(--line))] bg-[color:var(--paper)] px-4 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                    Issue sequence register
                  </div>
                  <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">
                    {issueSequenceSnapshot.nextReference}
                  </div>
                  <p className="mt-2 text-[0.82rem] leading-5 text-[color:var(--ink-soft)]">
                    Browser-local running issue number for this office, project, and date stem.
                    {issueSequenceSnapshot.lastIssuedReference
                      ? ` Last reserved on this browser: ${issueSequenceSnapshot.lastIssuedReference}.`
                      : " No issue number has been reserved on this browser yet."}
                  </p>
                </div>
                <button
                  className="focus-ring inline-flex items-center rounded-full border hairline px-3 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
                  onClick={handleReserveIssueSequence}
                  type="button"
                >
                  Reserve next issue no
                </button>
              </div>
              <div className="mt-4 grid gap-2">
                {proposalDocument.issueRegisterItems.map((item) => (
                  <div
                    className="grid gap-2 rounded border hairline bg-[color:var(--paper)]/78 px-3 py-3 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)_auto]"
                    key={`${item.label}-${item.reference}-${item.issuedOnLabel}`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">{item.label}</div>
                      <div className="mt-1 text-sm font-semibold text-[color:var(--ink)]">{item.reference}</div>
                    </div>
                    <div className="min-w-0 text-sm leading-6 text-[color:var(--ink-soft)]">{item.detail}</div>
                    <div className="text-right text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
                      {item.statusLabel}
                      <div className="mt-1 text-[0.72rem] normal-case tracking-normal text-[color:var(--ink-soft)]">{item.issuedOnLabel}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border hairline bg-[color:var(--paper)]/78 px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <LibraryBig className="h-4 w-4" />
              Company profile library
            </div>
            <div className="mt-4 grid gap-4">
              <ProposalField
                label="Profile label"
                note="Save the current identity as a reusable local office preset."
                onChange={setProfileDraftLabel}
                placeholder="e.g. Machinity Istanbul office"
                value={profileDraftLabel}
              />
              <div className="flex flex-wrap gap-2">
                <button
                  className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
                  onClick={handleSaveCurrentCompanyProfile}
                  type="button"
                >
                  <Save className="h-4 w-4" />
                  Save current profile
                </button>
                <button
                  className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!companyProfiles.some((profile) => profile.isDefault)}
                  onClick={handleApplyDefaultCompanyProfile}
                  type="button"
                >
                  <Star className="h-4 w-4" />
                  Apply default office
                </button>
                <button
                  className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={companyProfiles.length === 0}
                  onClick={handleExportCompanyProfiles}
                  type="button"
                >
                  <Download className="h-4 w-4" />
                  Export library JSON
                </button>
                <button
                  className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
                  onClick={() => importProfilesInputRef.current?.click()}
                  type="button"
                >
                  <Upload className="h-4 w-4" />
                  Import library JSON
                </button>
                <input
                  accept="application/json,.json"
                  className="hidden"
                  onChange={(event) => void handleImportCompanyProfiles(event.target.files)}
                  ref={importProfilesInputRef}
                  type="file"
                />
              </div>
            </div>
            <div className="mt-4 rounded-md border border-[color:color-mix(in_oklch,var(--accent)_20%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_8%,var(--paper))] px-4 py-4">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                Current office identity
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <div className="text-sm font-semibold text-[color:var(--ink)]">
                  {activeCompanyProfile ? activeCompanyProfile.label : defaultCompanyProfile ? defaultCompanyProfile.label : "Unsaved local identity"}
                </div>
                {activeCompanyProfile ? (
                  <div className="rounded-full border hairline bg-[color:var(--paper)] px-2 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-soft)]">
                    Active on this issue
                  </div>
                ) : null}
                {defaultCompanyProfile?.isDefault ? (
                  <div className="rounded-full border hairline bg-[color:var(--paper)] px-2 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-soft)]">
                    Default office
                  </div>
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">
                {activeCompanyProfile
                  ? `${activeCompanyProfile.label} is driving the consultant block, template profile, issue prefix, and clause wording for this issue.`
                  : defaultCompanyProfile
                    ? "A default office preset is saved for this browser and will preload when the sheet falls back to the generic identity."
                    : "Save one office preset and mark it as default if this browser should always open on the same consultant identity."}
              </p>
            </div>
            <div className="mt-4 grid gap-3">
              {companyProfiles.length > 0 ? (
                companyProfiles.map((profile) => (
                  <div
                    className={`grid gap-3 rounded-md border px-4 py-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_auto] ${
                      activeCompanyProfile?.id === profile.id
                        ? "border-[color:color-mix(in_oklch,var(--accent)_26%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_10%,var(--paper))]"
                        : "hairline bg-[color:var(--paper)]"
                    }`}
                    key={profile.id}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                          {profile.label}
                        </div>
                        {activeCompanyProfile?.id === profile.id ? (
                          <div className="rounded-full border hairline bg-[color:var(--paper)] px-2 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-soft)]">
                            Active on this issue
                          </div>
                        ) : null}
                        {profile.isDefault ? (
                          <div className="rounded-full border hairline bg-[color:var(--paper)] px-2 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-soft)]">
                            Default office
                          </div>
                        ) : null}
                      </div>
                      <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{profile.consultantCompany}</div>
                      <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">
                        {profile.preparedBy} · {profile.approverTitle}
                      </p>
                    </div>
                    <div className="min-w-0 text-sm leading-6 text-[color:var(--ink-soft)]">
                      <div>{profile.consultantWordmarkLine || "No wordmark line saved"}</div>
                      <div>{REPORT_PROFILE_LABELS[profile.preferredReportProfile]}</div>
                      <div>{profile.issueCodePrefix ? `Issue prefix ${profile.issueCodePrefix}` : "Issue prefix auto from company"}</div>
                      <div>
                        {matchSimpleWorkbenchProposalPolicyPreset({
                          issuePurpose: profile.proposalIssuePurpose,
                          validityNote: profile.proposalValidityNote
                        })?.label ?? "Custom clause pair"}
                      </div>
                      <div>{profile.consultantEmail || "No email saved"}</div>
                      <div>{profile.consultantPhone || "No phone saved"}</div>
                    </div>
                    <div className="flex flex-wrap items-start justify-end gap-2">
                      <button
                        className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-3 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
                        onClick={() => handleApplyCompanyProfile(profile)}
                        type="button"
                      >
                        Apply profile
                      </button>
                      <button
                        className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-3 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
                        onClick={() => handleSetDefaultCompanyProfile(profile)}
                        type="button"
                      >
                        <Star className="h-4 w-4" />
                        {profile.isDefault ? "Default office" : "Set default"}
                      </button>
                      {profile.consultantLogoDataUrl ? (
                        <div className="rounded-full border hairline bg-[color:var(--paper)] px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-soft)]">
                          Logo saved
                        </div>
                      ) : null}
                      <button
                        className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-3 py-2 text-sm font-semibold text-[color:var(--warning-ink)] hover:bg-[color:var(--warning-soft)]"
                        onClick={() => handleDeleteCompanyProfile(profile)}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-md border border-dashed hairline px-4 py-4 text-sm leading-6 text-[color:var(--ink-soft)]">
                  No local company profiles yet. Save the current consultant identity block and office-level clause wording, then export it as JSON if the same acoustic office needs to reuse the branded preset on another browser.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border hairline bg-[color:var(--paper)]/78 px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <FileText className="h-4 w-4" />
              Template and issue coding
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Template profile</span>
                <p className="text-[0.78rem] leading-5 text-[color:var(--ink-soft)]">
                  Choose the proposal voice.
                </p>
                <select
                  className="focus-ring rounded-md border hairline bg-[color:var(--paper)] px-3 py-3 text-sm text-[color:var(--ink)]"
                  onChange={(event) => props.onReportProfileChange(event.target.value as ReportProfile)}
                  value={props.reportProfile}
                >
                  {Object.entries(REPORT_PROFILE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <ProposalField
                label="Issue code prefix"
                note="Optional first code block override."
                onChange={props.onIssueCodePrefixChange}
                placeholder="e.g. MAC"
                value={props.issueCodePrefix}
              />
            </div>
          </div>

          <div className="rounded-lg border hairline bg-[color:var(--paper)]/78 px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <Building2 className="h-4 w-4" />
              Consultant identity
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <ProposalField
                label="Approver title"
                note="Shown on issue authority."
                onChange={props.onApproverTitleChange}
                placeholder="e.g. Lead Acoustic Consultant"
                value={props.approverTitle}
              />
              <ProposalField
                label="Contact email"
                note="Printed on cover and footer."
                onChange={props.onConsultantEmailChange}
                placeholder="e.g. proposals@machinity-acoustics.com"
                value={props.consultantEmail}
              />
              <ProposalField
                label="Contact phone"
                note="Primary proposal contact."
                onChange={props.onConsultantPhoneChange}
                placeholder="e.g. +90 212 000 00 00"
                value={props.consultantPhone}
              />
              <ProposalField
                label="Office address"
                note="Office identity on the sheet."
                onChange={props.onConsultantAddressChange}
                placeholder="e.g. Maslak, Istanbul, Turkiye"
                value={props.consultantAddress}
              />
              <ProposalField
                label="Wordmark line"
                note="Optional line under company name."
                onChange={props.onConsultantWordmarkLineChange}
                placeholder="e.g. Building Acoustics and Vibration Control"
                value={props.consultantWordmarkLine}
              />
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Company logo</span>
                <p className="text-[0.78rem] leading-5 text-[color:var(--ink-soft)]">
                  Optional mark for preview and PDF.
                </p>
                <input
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="focus-ring rounded-md border hairline bg-[color:var(--paper)] px-3 py-3 text-sm text-[color:var(--ink)]"
                  onChange={(event) => void handleConsultantLogoChange(event.target.files)}
                  type="file"
                />
              </label>
              <div className="rounded-md border hairline bg-[color:var(--paper)]/78 px-4 py-4">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Current brand mark</div>
                <div className="mt-3 flex items-center gap-3">
                  {props.consultantLogoDataUrl ? (
                    <img
                      alt={`${props.consultantCompany || "Consultant"} logo preview`}
                      className="h-16 w-16 rounded-md border hairline bg-[color:var(--paper)] object-contain p-2"
                      src={props.consultantLogoDataUrl}
                    />
                  ) : (
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-md text-lg font-semibold uppercase tracking-[0.2em] text-[#fff8f2]"
                      style={{ backgroundColor: proposalBranding.accentStrong }}
                    >
                      {proposalBranding.monogram}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[color:var(--ink)]">{proposalDocument.consultantCompany}</div>
                    <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">{proposalBranding.wordmarkSecondary}</p>
                  </div>
                </div>
                {props.consultantLogoDataUrl ? (
                  <button
                    className="focus-ring mt-4 inline-flex items-center gap-2 rounded-full border hairline px-3 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
                    onClick={handleClearConsultantLogo}
                    type="button"
                  >
                    Clear logo
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="rounded-lg border hairline bg-[color:var(--paper)]/78 px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <ScrollText className="h-4 w-4" />
              Project information
            </div>
            <div className="mt-4 grid gap-4">
              <ProposalField
                label="Project name"
                note="Used on the cover and file name."
                onChange={props.onProjectNameChange}
                placeholder="e.g. Riverside Residences acoustic study"
                value={props.projectName}
              />
              <ProposalField
                label="Client name"
                note="Client shown on the sheet."
                onChange={props.onClientNameChange}
                placeholder="e.g. Riverside Development"
                value={props.clientName}
              />
              <ProposalField
                label="Consultant note"
                multiline
                note="Scope notes or caveats that should travel with the issue."
                onChange={props.onBriefNoteChange}
                placeholder="Summarize assumptions, exclusions, and next-step advice."
                value={props.briefNote}
              />
            </div>
          </div>

          <div className="rounded-lg border hairline bg-[color:var(--paper)]/78 px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <FileText className="h-4 w-4" />
              Transmittal details
            </div>
            <div className="mt-4 grid gap-4">
              <div className="rounded-md border border-[color:color-mix(in_oklch,var(--accent)_20%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_8%,var(--paper))] px-4 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                      Clause library
                    </div>
                    <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">
                      {activeProposalPolicyPreset ? activeProposalPolicyPreset.label : "Custom wording active"}
                    </div>
                    <p className="mt-2 max-w-3xl text-[0.82rem] leading-5 text-[color:var(--ink-soft)]">
                      {activeProposalPolicyPreset
                        ? activeProposalPolicyPreset.note
                        : "Current purpose and validity text do not match a saved preset."}
                    </p>
                  </div>
                  <div className="rounded-full border hairline bg-[color:var(--paper)] px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-soft)]">
                    {activeProposalPolicyPreset ? "Matched preset" : "Custom pair"}
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {SIMPLE_WORKBENCH_PROPOSAL_POLICY_PRESETS.map((preset) => {
                    const active = activeProposalPolicyPreset?.id === preset.id;

                    return (
                      <button
                        className={`focus-ring grid gap-2 rounded-md border px-4 py-4 text-left transition ${
                          active
                            ? "border-[color:color-mix(in_oklch,var(--accent)_28%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_12%,var(--paper))]"
                            : "hairline bg-[color:var(--paper)]/76 hover:bg-[color:var(--panel)]"
                        }`}
                        key={preset.id}
                        onClick={() => handleApplyPolicyPreset(preset)}
                        type="button"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-sm font-semibold text-[color:var(--ink)]">{preset.label}</div>
                          <div className="rounded-full border hairline bg-[color:var(--paper)] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-soft)]">
                            {active ? "Active" : "Apply"}
                          </div>
                        </div>
                        <div className="text-sm leading-6 text-[color:var(--ink-soft)]">{preset.note}</div>
                        <div className="text-sm font-semibold text-[color:var(--ink)]">{preset.issuePurpose}</div>
                        <div className="text-sm leading-6 text-[color:var(--ink-soft)]">{preset.validityNote}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <ProposalField
                label="Issued to"
                note="Recipient line."
                onChange={props.onProposalRecipientChange}
                placeholder="e.g. Riverside Development Team"
                value={props.proposalRecipient}
              />
              <ProposalField
                label="Attention"
                note="Named reviewer or team."
                onChange={props.onProposalAttentionChange}
                placeholder="e.g. Attention: Design Coordination Team"
                value={props.proposalAttention}
              />
              <ProposalField
                label="Subject line"
                note="Document title."
                onChange={props.onProposalSubjectChange}
                placeholder={`e.g. ${getStudyModeAwareProposalSubject("Riverside Residences", props.studyModeLabel)}`}
                value={props.proposalSubject}
              />
              <ProposalField
                label="Issue purpose"
                note="Why this issue is being sent."
                onChange={props.onProposalIssuePurposeChange}
                placeholder="e.g. Client review and acoustic coordination"
                value={props.proposalIssuePurpose}
              />
              <ProposalField
                label="Validity note"
                note="Commercial or admin validity wording."
                onChange={props.onProposalValidityNoteChange}
                placeholder="e.g. Valid for 30 calendar days unless superseded"
                value={props.proposalValidityNote}
              />
            </div>
          </div>

          <div className="rounded-lg border hairline bg-[color:var(--panel)] px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <ScrollText className="h-4 w-4" />
              Sheet contents
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <IssueMetaCard
                detail="Project, recipient, subject, purpose, and validity lines so the sheet reads like a formal transmittal."
                label="Cover + transmittal"
                value="Identity, recipient, subject"
              />
              <IssueMetaCard
                detail="Live metrics, technical section, and row schedule stay visible together."
                label="Metric + schedule"
                value={`${props.metrics.length} metric${props.metrics.length === 1 ? "" : "s"} · ${props.layers.length} row${props.layers.length === 1 ? "" : "s"}`}
              />
              <IssueMetaCard
                detail="Validation corridor, solver rationale, decision trail, and assumptions stay packaged."
                label="Method + evidence"
                value={`${proposalDocument.methodTraceGroups.length} trace group${proposalDocument.methodTraceGroups.length === 1 ? "" : "s"}`}
              />
              <IssueMetaCard
                detail="Server PDF, browser print view, and proposal summary copy are available from the same package."
                label="Delivery"
                value="PDF, print, and summary"
              />
            </div>
          </div>
        </div>

        <article className="rounded-lg border hairline bg-[color:var(--panel-strong)] px-4 py-4 sm:px-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="eyebrow">Client Preview</div>
              <h3 className="mt-1 font-display text-[1.9rem] leading-none tracking-[-0.05em] text-[color:var(--ink)]">
                {proposalBranding.coverTitle}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">
                {proposalBranding.coverKicker}
              </p>
            </div>
            <div className="rounded-full border hairline bg-[color:var(--paper)]/74 px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-soft)]">
              {props.issuedOnLabel}
            </div>
          </div>

          <div
            className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-md border px-4 py-4"
            style={{
              background: `linear-gradient(135deg, ${proposalBranding.heroFrom}, ${proposalBranding.heroTo})`,
              borderColor: proposalBranding.line
            }}
          >
            <div className="flex items-center gap-3">
              {proposalDocument.consultantLogoDataUrl ? (
                <img
                  alt={`${proposalDocument.consultantCompany} logo`}
                  className="h-14 w-14 rounded-md border bg-[color:var(--paper)] object-contain p-2"
                  src={proposalDocument.consultantLogoDataUrl}
                  style={{ borderColor: proposalBranding.line }}
                />
              ) : (
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-md text-lg font-semibold uppercase tracking-[0.2em] text-[#fff8f2]"
                  style={{ backgroundColor: proposalBranding.accentStrong }}
                >
                  {proposalBranding.monogram}
                </div>
              )}
              <div>
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                  Template profile
                </div>
                <div className="mt-1 text-lg font-semibold text-[color:var(--ink)]">{proposalBranding.wordmarkPrimary}</div>
                <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">{proposalBranding.wordmarkSecondary}</p>
                <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">{proposalBranding.profileDetail}</p>
              </div>
            </div>
            <div className="rounded-full bg-[color:var(--paper)]/76 px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-soft)]">
              {proposalBranding.templateLabel}
            </div>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="rounded-md border hairline bg-[color:var(--paper)]/8 px-4 py-4">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                Issue header
              </div>
              <div className="mt-2 text-xl font-semibold text-[color:var(--ink)]">{proposalDocument.projectName}</div>
              <div className="mt-1 text-sm text-[color:var(--ink-soft)]">{proposalDocument.clientName}</div>
              <div className="mt-2 text-sm text-[color:var(--ink-soft)]">{proposalDocument.consultantCompany}</div>
              <div className="mt-3 rounded border hairline bg-[color:var(--paper)]/68 px-3 py-3">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                  Issued to
                </div>
                <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{proposalDocument.proposalRecipient}</div>
                <div className="mt-1 text-sm text-[color:var(--ink-soft)]">{proposalDocument.proposalAttention}</div>
                <div className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{proposalDocument.proposalSubject}</div>
                <div className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{proposalDocument.proposalIssuePurpose}</div>
                <div className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">{proposalDocument.proposalValidityNote}</div>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-[color:var(--ink-soft)] sm:grid-cols-2">
                <div>{proposalDocument.studyModeLabel}</div>
                <div>{proposalDocument.contextLabel}</div>
              </div>
              <p className="mt-4 text-[0.82rem] leading-5 text-[color:var(--ink-soft)]">{props.assemblyHeadline}</p>
            </div>

            <div className="rounded-md border border-[color:color-mix(in_oklch,var(--accent)_30%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_10%,var(--paper))] px-4 py-4">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                Lead metric
              </div>
              <div className="mt-3 text-[clamp(2rem,4vw,2.8rem)] font-display leading-none tracking-[-0.05em] text-[color:var(--ink)]">
                {proposalDocument.primaryMetricValue}
              </div>
              <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{proposalDocument.primaryMetricLabel}</div>
              <p className="mt-3 text-sm leading-6 text-[color:var(--ink-soft)]">
                {props.metrics[0]?.detail ?? "Build a valid stack to expose the lead client-facing read."}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <IssueMetaCard
              detail="Formal issuing company shown on the proposal."
              label="Consultant"
              value={proposalDocument.consultantCompany}
            />
            <IssueMetaCard detail="Current proposal owner." label="Prepared by" value={proposalDocument.preparedBy} />
            <IssueMetaCard detail="Professional title shown on the issue authority block." label="Role" value={proposalDocument.approverTitle} />
            <IssueMetaCard detail="Formal issue identifier." label="Reference" value={proposalDocument.proposalReference} />
            <IssueMetaCard detail="Current issue status." label="Revision" value={proposalDocument.proposalRevision} />
            <IssueMetaCard detail="Reason this issue is being released." label="Purpose" value={proposalDocument.proposalIssuePurpose} />
            <IssueMetaCard detail="Commercial or administrative validity note." label="Validity" value={proposalDocument.proposalValidityNote} />
          </div>

          <div className="mt-4 rounded-md border border-[color:color-mix(in_oklch,var(--accent)_26%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_8%,var(--paper))] px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold text-[color:var(--ink)]">Issue authority</div>
              <div className="rounded-full border hairline bg-[color:var(--paper)]/76 px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-soft)]">
                {proposalDocument.proposalReference} · {proposalDocument.proposalRevision}
              </div>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <IssueMetaCard
                detail={`${proposalDocument.consultantCompany} · ${proposalDocument.clientName}`}
                label="Issuer"
                value={`${proposalDocument.preparedBy} · ${proposalDocument.approverTitle}`}
              />
              <IssueMetaCard
                detail={`${proposalDocument.proposalAttention} · ${proposalDocument.proposalSubject}`}
                label="Recipient"
                value={proposalDocument.proposalRecipient}
              />
              <IssueMetaCard
                detail={`Base ${proposalDocument.issueBaseReference} · Next local no ${proposalDocument.issueNextReference}`}
                label="Governance"
                value="Revision control active"
              />
              <IssueMetaCard
                detail={proposalDocument.proposalValidityNote}
                label="Terms"
                value={proposalDocument.proposalIssuePurpose}
              />
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <IssueMetaCard detail="Primary proposal contact email." label="Email" value={proposalDocument.consultantEmail} />
            <IssueMetaCard detail="Primary proposal contact number." label="Phone" value={proposalDocument.consultantPhone} />
            <IssueMetaCard detail="Office identity carried on the issue cover." label="Office" value={proposalDocument.consultantAddress} />
          </div>

          <div className="mt-4 rounded-md border hairline bg-[color:var(--paper)]/72 px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold text-[color:var(--ink)]">Issue control register</div>
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                next {proposalDocument.issueNextReference}
              </div>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {proposalDocument.issueRegisterItems.map((item) => (
                <IssueMetaCard
                  detail={`${item.detail} ${item.issuedOnLabel}`.trim()}
                  key={`${item.reference}-${item.label}`}
                  label={item.label}
                  value={`${item.reference} · ${item.statusLabel}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-md border border-[color:color-mix(in_oklch,var(--accent)_26%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_9%,var(--paper))] px-4 py-4">
            <div className="text-sm font-semibold text-[color:var(--ink)]">Executive summary</div>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-[color:var(--ink-soft)]">{proposalDocument.executiveSummary}</p>
          </div>

          <div className="mt-4 rounded-md border hairline bg-[color:var(--paper)]/72 px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold text-[color:var(--ink)]">Issue dossier</div>
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                {proposalDossier.linkedCitationCount} linked source{proposalDossier.linkedCitationCount === 1 ? "" : "s"} · {proposalDossier.warningCount} warning
                {proposalDossier.warningCount === 1 ? "" : "s"}
              </div>
            </div>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-[color:var(--ink-soft)]">{proposalDossier.headline}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {proposalDossier.items.map((item) => (
                <IssueMetaCard detail={item.detail} key={`${item.label}-${item.value}`} label={item.label} value={item.value} />
              ))}
            </div>
          </div>

          {proposalDocument.corridorDossierCards.length > 0 ? (
            <div className="mt-4 rounded-md border hairline bg-[color:var(--paper)]/72 px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm font-semibold text-[color:var(--ink)]">Validation corridor package</div>
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                  {corridorCardCount} card{corridorCardCount === 1 ? "" : "s"}
                </div>
              </div>
              <p className="mt-2 max-w-4xl text-sm leading-7 text-[color:var(--ink-soft)]">{proposalDocument.corridorDossierHeadline}</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {proposalDocument.corridorDossierCards.map((item) => (
                  <IssueMetaCard detail={item.detail} key={`${item.label}-${item.value}`} label={item.label} value={item.value} />
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-4 rounded-md border hairline bg-[color:var(--paper)]/72 px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold text-[color:var(--ink)]">Solver rationale package</div>
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                {proposalDocument.methodTraceGroups.length} trace group{proposalDocument.methodTraceGroups.length === 1 ? "" : "s"} · {methodTraceNoteCount} selected note
                {methodTraceNoteCount === 1 ? "" : "s"}
              </div>
            </div>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-[color:var(--ink-soft)]">{proposalDocument.methodDossierHeadline}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {proposalDocument.methodDossierCards.map((item) => (
                <IssueMetaCard detail={item.detail} key={`${item.label}-${item.value}`} label={item.label} value={item.value} />
              ))}
            </div>
            {proposalDocument.methodTraceGroups.length > 0 ? (
              <div className="mt-3 text-sm leading-6 text-[color:var(--ink-soft)]">
                The branded PDF now carries {methodTraceNoteCount} selected solver note{methodTraceNoteCount === 1 ? "" : "s"} across{" "}
                {proposalDocument.methodTraceGroups.length} trace group{proposalDocument.methodTraceGroups.length === 1 ? "" : "s"} inside the solver rationale appendix.
              </div>
            ) : null}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {proposalDocument.metrics.slice(0, 6).map((metric) => (
              <PreviewMetric detail={metric.detail} key={`${metric.label}-${metric.value}`} label={metric.label} value={metric.value} />
            ))}
          </div>

          <div className="mt-4 rounded-md border hairline bg-[color:var(--paper)]/72 px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold text-[color:var(--ink)]">Output coverage register</div>
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                {readyCoverageCount} ready · {parkedCoverageCount} parked · {unsupportedCoverageCount} unsupported
              </div>
            </div>
            <p className="mt-2 text-[0.82rem] leading-5 text-[color:var(--ink-soft)]">
              Ready, parked, and unsupported lanes stay separate so the sheet does not hide solver limits.
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {proposalDocument.coverageItems.map((item) => (
                <CoverageCard
                  detail={item.detail}
                  key={`${item.label}-${item.status}-${item.value}`}
                  label={item.label}
                  nextStep={item.nextStep}
                  postureDetail={item.postureDetail}
                  postureLabel={item.postureLabel}
                  postureTone={item.postureTone}
                  status={item.status}
                  value={item.value}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-md border hairline bg-[color:var(--paper)]/72 px-4 py-4">
            <div className="text-sm font-semibold text-[color:var(--ink)]">Decision trail</div>
            <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{proposalDocument.decisionTrailHeadline}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {proposalDocument.decisionTrailItems.slice(0, 4).map((item) => (
                <DecisionTrailCard detail={item.detail} key={`${item.label}-${item.tone}`} label={item.label} tone={item.tone} />
              ))}
            </div>
            {proposalDocument.decisionTrailItems.length > 4 ? (
              <div className="mt-3 text-sm leading-6 text-[color:var(--ink-soft)]">
                The printed sheet carries all {proposalDocument.decisionTrailItems.length} decision-trail lines.
              </div>
            ) : null}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-md border hairline bg-[color:var(--paper)]/76 px-4 py-4">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                Dynamic branch
              </div>
              <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{props.dynamicBranchLabel}</div>
              <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{props.dynamicBranchDetail}</p>
            </div>
            <div className="rounded-md border hairline bg-[color:var(--paper)]/76 px-4 py-4">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                Validation posture
              </div>
              <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{props.validationLabel}</div>
              <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{props.validationDetail}</p>
            </div>
          </div>

          <div className="mt-4 rounded-md border hairline bg-[color:var(--paper)]/72 px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold text-[color:var(--ink)]">Recommended next steps</div>
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                {proposalDocument.recommendationItems.length} action{proposalDocument.recommendationItems.length === 1 ? "" : "s"}
              </div>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {proposalDocument.recommendationItems.map((item) => (
                <DecisionTrailCard detail={item.detail} key={`${item.label}-${item.detail}`} label={item.label} tone={item.tone} />
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-md border hairline bg-[color:var(--paper)]/72 px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold text-[color:var(--ink)]">Source citations</div>
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                {proposalDocument.citations.length} citation{proposalDocument.citations.length === 1 ? "" : "s"}
              </div>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {proposalDocument.citations.slice(0, 4).map((citation) => (
                <CitationCard
                  detail={citation.detail}
                  href={citation.href}
                  key={`${citation.label}-${citation.href ?? citation.detail}`}
                  label={citation.label}
                  tone={citation.tone}
                />
              ))}
            </div>
            {proposalDocument.citations.length > 4 ? (
              <div className="mt-3 text-sm leading-6 text-[color:var(--ink-soft)]">
                The printed sheet carries all {proposalDocument.citations.length} source lines.
              </div>
            ) : null}
          </div>

          <div className="mt-4 rounded-md border hairline bg-[color:var(--paper)]/72 px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold text-[color:var(--ink)]">Assumption register</div>
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                {proposalDocument.assumptionItems.length} line{proposalDocument.assumptionItems.length === 1 ? "" : "s"}
              </div>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {proposalDocument.assumptionItems.map((item) => (
                <DecisionTrailCard detail={item.detail} key={`${item.label}-${item.detail}`} label={item.label} tone={item.tone} />
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-md border hairline bg-[color:var(--paper)]/72 px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold text-[color:var(--ink)]">Construction section</div>
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                {props.layers.length} visible row{props.layers.length === 1 ? "" : "s"}
              </div>
            </div>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-[color:var(--ink-soft)]">
              The official issue now carries a visual construction section alongside the row-by-row schedule so the solver order stays readable without opening the operator desk.
            </p>
            <div className="mt-4">
              <SimpleWorkbenchProposalConstructionFigure layers={props.layers} studyModeLabel={props.studyModeLabel} />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!exportReady}
              onClick={() => void handleCopySummary()}
              type="button"
            >
              <Copy className="h-4 w-4" />
              Copy proposal summary
            </button>
            <button
              className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!exportReady || isDownloadingPdf}
              onClick={() => void handleDownloadExport()}
              type="button"
            >
              <Download className="h-4 w-4" />
              {isDownloadingPdf ? "Preparing file..." : "Download branded PDF"}
            </button>
            <button
              className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!exportReady || isDownloadingPdf}
              onClick={() => void handleDownloadExport("branded", "docx")}
              type="button"
            >
              <Download className="h-4 w-4" />
              {isDownloadingPdf ? "Preparing file..." : "Download branded DOCX"}
            </button>
            <button
              className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!exportReady}
              onClick={openProposalAdjustmentView}
              type="button"
            >
              <FilePenLine className="h-4 w-4" />
              Edit PDFs
            </button>
            <button
              className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!exportReady || isDownloadingPdf}
              onClick={() => void handleDownloadExport("simple")}
              type="button"
            >
              <Download className="h-4 w-4" />
              {isDownloadingPdf ? "Preparing file..." : "Simple PDF"}
            </button>
            <button
              className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!exportReady || isDownloadingPdf}
              onClick={() => void handleDownloadExport("simple", "docx")}
              type="button"
            >
              <Download className="h-4 w-4" />
              {isDownloadingPdf ? "Preparing file..." : "Simple DOCX"}
            </button>
            <button
              className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!exportReady}
              onClick={() => openProposalPrintView(false)}
              type="button"
            >
              <FileText className="h-4 w-4" />
              Open print view
            </button>
            <button
              className="focus-ring ink-button-solid inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!exportReady}
              onClick={() => openProposalPrintView(true)}
              type="button"
            >
              <Printer className="h-4 w-4" />
              Print / save PDF
            </button>
          </div>

          {!exportReady ? (
            <div className="mt-3 rounded-md border border-dashed hairline px-4 py-3 text-sm leading-6 text-[color:var(--ink-soft)]">
              Build a valid stack and expose at least one supported output before generating the formal proposal sheet.
            </div>
          ) : null}

          <div className="mt-4 rounded-md border hairline bg-[color:var(--panel)] px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <FileText className="h-4 w-4" />
              Delivery note
            </div>
            <p className="mt-2 text-[0.82rem] leading-5 text-[color:var(--ink-soft)]">
              Server PDF, browser print fallback, cover page, technical schedule, and citation appendix are all generated from the same packaged issue.
            </p>
          </div>
        </article>
      </div>
    </SurfacePanel>
  );
}
