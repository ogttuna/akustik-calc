"use client";

import { SurfacePanel } from "@dynecho/ui";
import { Building2, Copy, Download, FileText, Printer, ScrollText } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  buildSimpleWorkbenchProposalText,
  type SimpleWorkbenchProposalCoverageItem,
  type SimpleWorkbenchProposalDocument,
  type SimpleWorkbenchProposalIssueRegisterItem,
  type SimpleWorkbenchProposalLayer,
  type SimpleWorkbenchProposalMetric
} from "./simple-workbench-proposal";
import type {
  SimpleWorkbenchProposalCitation,
  SimpleWorkbenchProposalDecisionItem
} from "./simple-workbench-evidence";
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
import { downloadSimpleWorkbenchProposalPdf } from "./simple-workbench-proposal-pdf";
import { storeSimpleWorkbenchProposalPreview } from "./simple-workbench-proposal-preview-storage";

type SimpleWorkbenchProposalPanelProps = {
  approverTitle: string;
  assemblyHeadline: string;
  briefNote: string;
  clientName: string;
  consultantAddress: string;
  citations: readonly SimpleWorkbenchProposalCitation[];
  consultantCompany: string;
  consultantEmail: string;
  consultantPhone: string;
  contextLabel: string;
  coverageItems: readonly SimpleWorkbenchProposalCoverageItem[];
  decisionTrailHeadline: string;
  decisionTrailItems: readonly SimpleWorkbenchProposalDecisionItem[];
  dynamicBranchDetail: string;
  dynamicBranchLabel: string;
  issuedOnLabel: string;
  issuedOnIso: string;
  layers: readonly SimpleWorkbenchProposalLayer[];
  metrics: readonly SimpleWorkbenchProposalMetric[];
  onApproverTitleChange: (value: string) => void;
  onBriefNoteChange: (value: string) => void;
  onClientNameChange: (value: string) => void;
  onConsultantAddressChange: (value: string) => void;
  onConsultantCompanyChange: (value: string) => void;
  onConsultantEmailChange: (value: string) => void;
  onConsultantPhoneChange: (value: string) => void;
  onPreparedByChange: (value: string) => void;
  onProposalAttentionChange: (value: string) => void;
  onProposalRecipientChange: (value: string) => void;
  onProjectNameChange: (value: string) => void;
  onProposalReferenceChange: (value: string) => void;
  onProposalRevisionChange: (value: string) => void;
  onProposalSubjectChange: (value: string) => void;
  preparedBy: string;
  proposalAttention: string;
  proposalRecipient: string;
  projectName: string;
  proposalReference: string;
  proposalRevision: string;
  proposalSubject: string;
  reportProfileLabel: string;
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
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">{label}</span>
      <p className="text-sm leading-6 text-[color:var(--ink-soft)]">{note}</p>
      {multiline ? (
        <textarea
          className="focus-ring min-h-28 rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3 text-sm leading-6 text-[color:var(--ink)]"
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          value={value}
        />
      ) : (
        <input
          className="focus-ring rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3 text-sm text-[color:var(--ink)]"
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
    <article className="rounded-[1rem] border hairline bg-[color:var(--paper)]/78 px-4 py-4">
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{label}</div>
      <div className="mt-2 text-lg font-semibold text-[color:var(--ink)]">{value}</div>
      <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{detail}</p>
    </article>
  );
}

function IssueMetaCard(props: { detail: string; label: string; value: string }) {
  const { detail, label, value } = props;

  return (
    <article className="rounded-[1rem] border hairline bg-[color:var(--paper)]/78 px-4 py-4">
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{label}</div>
      <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{value}</div>
      <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{detail}</p>
    </article>
  );
}

function DecisionTrailCard(props: SimpleWorkbenchProposalDecisionItem) {
  return <IssueMetaCard detail={props.detail} label={props.label} value={props.tone.replaceAll("_", " ")} />;
}

function CitationCard(props: SimpleWorkbenchProposalCitation) {
  const { detail, href, label, tone } = props;

  return (
    <article className="rounded-[1rem] border hairline bg-[color:var(--paper)]/78 px-4 py-4">
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

function CoverageCard(props: SimpleWorkbenchProposalCoverageItem) {
  const { detail, label, nextStep, status, value } = props;

  return (
    <article className="rounded-[1rem] border hairline bg-[color:var(--paper)]/78 px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="text-sm font-semibold text-[color:var(--ink)]">{label}</div>
        <div className={`inline-flex rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${coverageToneClass(status)}`}>
          {coverageStatusLabel(status)}
        </div>
      </div>
      <div className="mt-3 text-lg font-semibold text-[color:var(--ink)]">{value}</div>
      <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{detail}</p>
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
      : `${props.projectName.trim() || "Untitled project"} acoustic proposal`;

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
    consultantPhone: props.consultantPhone.trim() || "Contact phone not entered",
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
    issueNextReference: issueSequenceSnapshot.nextReference,
    issueRegisterItems: buildIssueRegisterItems({
      currentReference: proposalReference,
      currentRevision: proposalRevision,
      issueSequenceSnapshot,
      issuedOnLabel: props.issuedOnLabel
    }),
    layers: props.layers,
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
    proposalRecipient,
    proposalReference,
    proposalRevision,
    proposalSubject,
    recommendationItems: proposalBrief.recommendationItems,
    reportProfileLabel: props.reportProfileLabel,
    studyModeLabel: props.studyModeLabel,
    studyContextLabel: props.studyContextLabel,
    validationDetail: props.validationDetail,
    validationLabel: props.validationLabel,
    warnings: props.warnings
  };
}

export function SimpleWorkbenchProposalPanel(props: SimpleWorkbenchProposalPanelProps) {
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const proposalBrief = buildSimpleWorkbenchProposalBrief(buildProposalBriefInput(props));
  const suggestedIssue = proposalBrief.suggestedIssue;
  const [issueSequenceSnapshot, setIssueSequenceSnapshot] = useState<SimpleWorkbenchIssueSequenceSnapshot>(() =>
    readSimpleWorkbenchIssueSequence(suggestedIssue.reference)
  );
  const proposalDocument = buildProposalDocument(props, proposalBrief, suggestedIssue, issueSequenceSnapshot);
  const proposalText = buildSimpleWorkbenchProposalText(proposalDocument);
  const exportReady = props.layers.length > 0 && props.metrics.length > 0;
  const readyCoverageCount = props.coverageItems.filter((item) => item.status === "live" || item.status === "bound").length;
  const parkedCoverageCount = props.coverageItems.filter((item) => item.status === "needs_input").length;
  const unsupportedCoverageCount = props.coverageItems.filter((item) => item.status === "unsupported").length;
  const warningToneClass =
    props.warnings.length > 0
      ? "border-[color:color-mix(in_oklch,var(--warning)_30%,var(--line))] bg-[color:color-mix(in_oklch,var(--warning)_12%,var(--paper))] text-[color:var(--warning-ink)]"
      : "hairline bg-[color:var(--paper)]/74 text-[color:var(--ink-soft)]";

  useEffect(() => {
    setIssueSequenceSnapshot(readSimpleWorkbenchIssueSequence(suggestedIssue.reference));
  }, [suggestedIssue.reference]);

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

  async function handleDownloadPdf() {
    setIsDownloadingPdf(true);

    try {
      await downloadSimpleWorkbenchProposalPdf(proposalDocument);
      toast.success("Branded PDF downloaded", {
        description: "DynEcho prepared the formal proposal PDF on the server."
      });
    } catch (error) {
      toast.error("PDF generation failed", {
        description:
          error instanceof Error
            ? error.message
            : "DynEcho could not generate the branded PDF on the server. Use the print view as a fallback."
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

  return (
    <SurfacePanel className="px-5 py-6 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="eyebrow">Issue Sheet</div>
          <h2 className="mt-1 font-display text-[1.4rem] leading-none tracking-[-0.04em] text-[color:var(--ink)]">
            Package the proposal
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">
            Capture the client-facing identifiers, then export the live dynamic result as a print-ready offer sheet with
            the active layer structure, supported outputs, solver branch, and caution notes.
          </p>
        </div>
        <div
          className={`inline-flex items-center rounded-full border px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] ${warningToneClass}`}
        >
          {props.warnings.length > 0 ? `${props.warnings.length} live warning${props.warnings.length === 1 ? "" : "s"}` : "Ready for issue review"}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
        <div className="grid gap-4">
          <div className="rounded-[1.35rem] border hairline bg-[color:var(--paper)]/78 px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <Building2 className="h-4 w-4" />
              Issue register
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <ProposalField
                label="Consultant company"
                note="The issuing company that appears on the formal proposal sheet."
                onChange={props.onConsultantCompanyChange}
                placeholder="e.g. Machinity Acoustic Consultants"
                value={props.consultantCompany}
              />
              <ProposalField
                label="Prepared by"
                note="The responsible consultant or proposal owner."
                onChange={props.onPreparedByChange}
                placeholder="e.g. O. Tuna"
                value={props.preparedBy}
              />
              <ProposalField
                label="Proposal reference"
                note="Formal issue identifier used in transmittals and PDF filenames."
                onChange={props.onProposalReferenceChange}
                placeholder="e.g. MAC-2026-014"
                value={props.proposalReference}
              />
              <ProposalField
                label="Revision"
                note="Current issue status shown on the client-facing sheet."
                onChange={props.onProposalRevisionChange}
                placeholder="e.g. Rev 01"
                value={props.proposalRevision}
              />
            </div>
            <div className="mt-4 rounded-[1rem] border border-[color:color-mix(in_oklch,var(--accent)_26%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_10%,var(--paper))] px-4 py-4">
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
                  className="focus-ring inline-flex items-center rounded-full border hairline px-3 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-black/[0.03]"
                  onClick={handleApplySuggestedIssue}
                  type="button"
                >
                  Use base code
                </button>
              </div>
            </div>
            <div className="mt-4 rounded-[1rem] border border-[color:color-mix(in_oklch,var(--accent)_20%,var(--line))] bg-[color:var(--paper)] px-4 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                    Issue sequence register
                  </div>
                  <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">
                    {issueSequenceSnapshot.nextReference}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">
                    DynEcho keeps a browser-local running issue number for this consultant, project, and issue-date stem.
                    {issueSequenceSnapshot.lastIssuedReference
                      ? ` Last reserved on this browser: ${issueSequenceSnapshot.lastIssuedReference}.`
                      : " No issue number has been reserved on this browser yet."}
                  </p>
                </div>
                <button
                  className="focus-ring inline-flex items-center rounded-full border hairline px-3 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-black/[0.03]"
                  onClick={handleReserveIssueSequence}
                  type="button"
                >
                  Reserve next issue no
                </button>
              </div>
              <div className="mt-4 grid gap-2">
                {proposalDocument.issueRegisterItems.map((item) => (
                  <div
                    className="grid gap-2 rounded-[0.95rem] border hairline bg-[color:var(--paper)]/78 px-3 py-3 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)_auto]"
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

          <div className="rounded-[1.35rem] border hairline bg-[color:var(--paper)]/78 px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <Building2 className="h-4 w-4" />
              Consultant identity
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <ProposalField
                label="Approver title"
                note="Professional role shown on the signature-ready cover and issue authority block."
                onChange={props.onApproverTitleChange}
                placeholder="e.g. Lead Acoustic Consultant"
                value={props.approverTitle}
              />
              <ProposalField
                label="Contact email"
                note="Proposal contact shown on the branded PDF cover and appendix footer."
                onChange={props.onConsultantEmailChange}
                placeholder="e.g. proposals@machinity-acoustics.com"
                value={props.consultantEmail}
              />
              <ProposalField
                label="Contact phone"
                note="Primary company contact number carried on the issue sheet."
                onChange={props.onConsultantPhoneChange}
                placeholder="e.g. +90 212 000 00 00"
                value={props.consultantPhone}
              />
              <ProposalField
                label="Office address"
                note="Postal or office line printed as the company identity block."
                onChange={props.onConsultantAddressChange}
                placeholder="e.g. Maslak, Istanbul, Turkiye"
                value={props.consultantAddress}
              />
            </div>
          </div>

          <div className="rounded-[1.35rem] border hairline bg-[color:var(--paper)]/78 px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <ScrollText className="h-4 w-4" />
              Project information
            </div>
            <div className="mt-4 grid gap-4">
              <ProposalField
                label="Project name"
                note="This title is used on the proposal sheet and in the print file name."
                onChange={props.onProjectNameChange}
                placeholder="e.g. Riverside Residences acoustic study"
                value={props.projectName}
              />
              <ProposalField
                label="Client name"
                note="Client or recipient shown on the formal PDF/print issue."
                onChange={props.onClientNameChange}
                placeholder="e.g. Riverside Development"
                value={props.clientName}
              />
              <ProposalField
                label="Consultant note"
                multiline
                note="Record scope notes, exclusions, or delivery caveats that should travel with the estimate."
                onChange={props.onBriefNoteChange}
                placeholder="Summarize assumptions, exclusions, and next-step advice."
                value={props.briefNote}
              />
            </div>
          </div>

          <div className="rounded-[1.35rem] border hairline bg-[color:var(--paper)]/78 px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <FileText className="h-4 w-4" />
              Transmittal details
            </div>
            <div className="mt-4 grid gap-4">
              <ProposalField
                label="Issued to"
                note="Recipient line printed on the cover and transmittal summary."
                onChange={props.onProposalRecipientChange}
                placeholder="e.g. Riverside Development Team"
                value={props.proposalRecipient}
              />
              <ProposalField
                label="Attention"
                note="Named recipient, department, or reviewer line for the formal sheet."
                onChange={props.onProposalAttentionChange}
                placeholder="e.g. Attention: Design Coordination Team"
                value={props.proposalAttention}
              />
              <ProposalField
                label="Subject line"
                note="Document title shown as the cover subject and print summary."
                onChange={props.onProposalSubjectChange}
                placeholder="e.g. Riverside Residences floor acoustic proposal"
                value={props.proposalSubject}
              />
            </div>
          </div>

          <div className="rounded-[1.35rem] border hairline bg-black/[0.025] px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <ScrollText className="h-4 w-4" />
              What the sheet carries
            </div>
            <div className="mt-3 grid gap-2 text-sm leading-6 text-[color:var(--ink-soft)]">
              <div>Cover page with executive reading, issue authority, and signature-ready transmittal blocks</div>
              <div>Project, client, consultant, prepared-by, role, and company contact identity</div>
              <div>Issued-to, attention, and subject lines so the sheet reads like a formal transmittal</div>
              <div>Base document code plus browser-local proposal sequence for issue control</div>
              <div>Executive summary, technical schedule, and recommendation register for memo-grade reading</div>
              <div>Layer-by-layer schedule with role/category labels and live dynamic outputs</div>
              <div>Output coverage register with live, bound, parked, and unsupported posture kept separate</div>
              <div>Solver branch, validation posture, decision trail, source citation appendix, assumption register, warnings, and consultant notes</div>
            </div>
          </div>
        </div>

        <article className="rounded-[1.55rem] border hairline bg-[color:var(--panel-strong)] px-4 py-4 sm:px-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="eyebrow">Client Preview</div>
              <h3 className="mt-1 font-display text-[1.9rem] leading-none tracking-[-0.05em] text-[color:var(--ink)]">
                Formal acoustic offer sheet
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">
                The print layout stays closer to a consultant issue sheet than a raw calculator dump. It keeps the main
                metric prominent but still shows how the current dynamic route was chosen and what remains conditional.
              </p>
            </div>
            <div className="rounded-full border hairline bg-[color:var(--paper)]/74 px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-soft)]">
              {props.issuedOnLabel}
            </div>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="rounded-[1.2rem] border hairline bg-[color:var(--paper)]/8 px-4 py-4">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                Issue header
              </div>
              <div className="mt-2 text-xl font-semibold text-[color:var(--ink)]">{proposalDocument.projectName}</div>
              <div className="mt-1 text-sm text-[color:var(--ink-soft)]">{proposalDocument.clientName}</div>
              <div className="mt-2 text-sm text-[color:var(--ink-soft)]">{proposalDocument.consultantCompany}</div>
              <div className="mt-3 rounded-[0.95rem] border hairline bg-[color:var(--paper)]/68 px-3 py-3">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                  Issued to
                </div>
                <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{proposalDocument.proposalRecipient}</div>
                <div className="mt-1 text-sm text-[color:var(--ink-soft)]">{proposalDocument.proposalAttention}</div>
                <div className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{proposalDocument.proposalSubject}</div>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-[color:var(--ink-soft)] sm:grid-cols-2">
                <div>{proposalDocument.studyModeLabel}</div>
                <div>{proposalDocument.contextLabel}</div>
              </div>
              <p className="mt-4 text-sm leading-7 text-[color:var(--ink-soft)]">{props.assemblyHeadline}</p>
            </div>

            <div className="rounded-[1.2rem] border border-[color:color-mix(in_oklch,var(--accent)_30%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_10%,var(--paper))] px-4 py-4">
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
          </div>

          <div className="mt-4 rounded-[1rem] border border-[color:color-mix(in_oklch,var(--accent)_26%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_8%,var(--paper))] px-4 py-4">
            <div className="text-sm font-semibold text-[color:var(--ink)]">Issue authority</div>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-[color:var(--ink-soft)]">
              {proposalDocument.preparedBy}, {proposalDocument.approverTitle}, is issuing {proposalDocument.proposalReference}{" "}
              {proposalDocument.proposalRevision} on behalf of {proposalDocument.consultantCompany} for {proposalDocument.clientName}. The branded PDF now packages this on a dedicated cover page with signature-ready transmittal blocks.
            </p>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-[color:var(--ink-soft)]">
              Base stem {proposalDocument.issueBaseReference} remains visible, and the next browser-local issue number is {proposalDocument.issueNextReference}.
            </p>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-[color:var(--ink-soft)]">
              The current transmittal is addressed to {proposalDocument.proposalRecipient}. {proposalDocument.proposalAttention}. Subject: {proposalDocument.proposalSubject}.
            </p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <IssueMetaCard detail="Primary proposal contact email." label="Email" value={proposalDocument.consultantEmail} />
            <IssueMetaCard detail="Primary proposal contact number." label="Phone" value={proposalDocument.consultantPhone} />
            <IssueMetaCard detail="Office identity carried on the issue cover." label="Office" value={proposalDocument.consultantAddress} />
          </div>

          <div className="mt-4 rounded-[1rem] border hairline bg-[color:var(--paper)]/72 px-4 py-4">
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

          <div className="mt-4 rounded-[1rem] border border-[color:color-mix(in_oklch,var(--accent)_26%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_9%,var(--paper))] px-4 py-4">
            <div className="text-sm font-semibold text-[color:var(--ink)]">Executive summary</div>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-[color:var(--ink-soft)]">{proposalDocument.executiveSummary}</p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {proposalDocument.metrics.slice(0, 6).map((metric) => (
              <PreviewMetric detail={metric.detail} key={`${metric.label}-${metric.value}`} label={metric.label} value={metric.value} />
            ))}
          </div>

          <div className="mt-4 rounded-[1rem] border hairline bg-[color:var(--paper)]/72 px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold text-[color:var(--ink)]">Output coverage register</div>
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                {readyCoverageCount} ready · {parkedCoverageCount} parked · {unsupportedCoverageCount} unsupported
              </div>
            </div>
            <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">
              The issue sheet keeps active outputs separate from parked and unsupported lanes so a client-facing PDF does not hide solver limits.
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {proposalDocument.coverageItems.map((item) => (
                <CoverageCard
                  detail={item.detail}
                  key={`${item.label}-${item.status}-${item.value}`}
                  label={item.label}
                  nextStep={item.nextStep}
                  status={item.status}
                  value={item.value}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-[1rem] border hairline bg-[color:var(--paper)]/72 px-4 py-4">
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
            <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/76 px-4 py-4">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                Dynamic branch
              </div>
              <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{props.dynamicBranchLabel}</div>
              <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{props.dynamicBranchDetail}</p>
            </div>
            <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/76 px-4 py-4">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                Validation posture
              </div>
              <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{props.validationLabel}</div>
              <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{props.validationDetail}</p>
            </div>
          </div>

          <div className="mt-4 rounded-[1rem] border hairline bg-[color:var(--paper)]/72 px-4 py-4">
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

          <div className="mt-4 rounded-[1rem] border hairline bg-[color:var(--paper)]/72 px-4 py-4">
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

          <div className="mt-4 rounded-[1rem] border hairline bg-[color:var(--paper)]/72 px-4 py-4">
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

          <div className="mt-4 rounded-[1rem] border hairline bg-[color:var(--paper)]/72 px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold text-[color:var(--ink)]">Layer schedule preview</div>
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                {props.layers.length} visible row{props.layers.length === 1 ? "" : "s"}
              </div>
            </div>
            <div className="mt-3 grid gap-2">
              {props.layers.slice(0, 6).map((layer) => (
                <div
                  className="grid gap-2 rounded-[0.95rem] border hairline bg-[color:var(--paper)] px-3 py-3 sm:grid-cols-[auto_minmax(0,1fr)_auto]"
                  key={`${layer.index}-${layer.label}`}
                >
                  <div className="text-sm font-semibold text-[color:var(--ink)]">{String(layer.index).padStart(2, "0")}</div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[color:var(--ink)]">{layer.label}</div>
                    <div className="text-xs leading-5 text-[color:var(--ink-soft)]">{layer.roleLabel ?? layer.categoryLabel}</div>
                  </div>
                  <div className="text-sm text-[color:var(--ink-soft)]">{layer.thicknessLabel}</div>
                </div>
              ))}
              {props.layers.length > 6 ? (
                <div className="text-sm leading-6 text-[color:var(--ink-soft)]">
                  The printed sheet includes all {props.layers.length} rows, not only the preview slice.
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!exportReady}
              onClick={() => void handleCopySummary()}
              type="button"
            >
              <Copy className="h-4 w-4" />
              Copy proposal summary
            </button>
            <button
              className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!exportReady || isDownloadingPdf}
              onClick={() => void handleDownloadPdf()}
              type="button"
            >
              <Download className="h-4 w-4" />
              {isDownloadingPdf ? "Generating PDF..." : "Download branded PDF"}
            </button>
            <button
              className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!exportReady}
              onClick={() => openProposalPrintView(false)}
              type="button"
            >
              <FileText className="h-4 w-4" />
              Open print view
            </button>
            <button
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-[color:var(--ink)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!exportReady}
              onClick={() => openProposalPrintView(true)}
              type="button"
            >
              <Printer className="h-4 w-4" />
              Print / save PDF
            </button>
          </div>

          {!exportReady ? (
            <div className="mt-3 rounded-[1rem] border border-dashed hairline px-4 py-3 text-sm leading-6 text-[color:var(--ink-soft)]">
              Build a valid stack and expose at least one supported output before generating the formal proposal sheet.
            </div>
          ) : null}

          <div className="mt-4 rounded-[1rem] border hairline bg-black/[0.02] px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <FileText className="h-4 w-4" />
              Delivery note
            </div>
            <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">
              DynEcho can now generate a branded server-side PDF directly from the packaged proposal, while the dedicated print view remains available
              as a browser fallback. The export now carries a formal cover page, signature-ready issue blocks, a technical schedule page, and a citation appendix.
            </p>
          </div>
        </article>
      </div>
    </SurfacePanel>
  );
}
