import {
  REPORT_ASSISTANT_CAPABILITY_REGISTRY,
  type ReportAssistantCapabilityContract,
  type ReportAssistantCapabilityRendererKind,
  type ReportAssistantCapabilityResultKind,
  type ReportAssistantCapabilityStalePolicy
} from "./report-assistant-capabilities";

export type ReportAssistantResultAuthority =
  | "calculator_backed"
  | "deterministic_read"
  | "draft_only"
  | "error"
  | "needs_input"
  | "preview_only"
  | "provider_review"
  | "saved_project_state"
  | "unsupported"
  | "user_confirmed";

export type ReportAssistantResultRouteStatus =
  | "auth_failed"
  | "error"
  | "needs_input"
  | "provider_failed"
  | "ready"
  | "stale"
  | "unsupported"
  | "validation_failed";

export type ReportAssistantResultBasis = {
  basis: string;
  metricId: string;
  routeStatus: ReportAssistantResultRouteStatus;
  unit?: string;
  valueLabel?: string;
};

export type ReportAssistantResultTask = {
  code: string;
  message: string;
  severity: "error" | "info" | "warning";
};

export type ReportAssistantResultEvidence = {
  detail?: string;
  href?: string;
  label: string;
};

export type ReportAssistantResultSourceTrace = {
  detail?: string;
  kind:
    | "calculator_preview"
    | "deterministic"
    | "model_provider"
    | "project_read"
    | "provider_review"
    | "preset_read"
    | "user_confirmation";
  label: string;
};

export type ReportAssistantResultEnvelopeInput = {
  authority: ReportAssistantResultAuthority;
  basis?: readonly ReportAssistantResultBasis[];
  capabilityName: string;
  confidenceReason?: string;
  evidence?: readonly ReportAssistantResultEvidence[];
  routeStatus: ReportAssistantResultRouteStatus;
  sourceTrace?: readonly ReportAssistantResultSourceTrace[];
  tasks?: readonly ReportAssistantResultTask[];
  warnings?: readonly string[];
};

export type ReportAssistantResultEnvelope = {
  authority: ReportAssistantResultAuthority;
  basis: readonly ReportAssistantResultBasis[];
  capabilityName: string;
  confidenceReason?: string;
  evidence: readonly ReportAssistantResultEvidence[];
  mutates: boolean;
  previewOnly: boolean;
  rendererKind: ReportAssistantCapabilityRendererKind;
  requiresConfirmation: boolean;
  resultKind: ReportAssistantCapabilityResultKind;
  routeStatus: ReportAssistantResultRouteStatus;
  sourceTrace: readonly ReportAssistantResultSourceTrace[];
  stalePolicy: ReportAssistantCapabilityStalePolicy;
  tasks: readonly ReportAssistantResultTask[];
  warnings: readonly string[];
};

export type ReportAssistantResultEnvelopeValidation =
  | {
      envelope: ReportAssistantResultEnvelope;
      ok: true;
    }
  | {
      errors: readonly string[];
      ok: false;
    };

const NUMERIC_RESULT_AUTHORITIES: readonly ReportAssistantResultAuthority[] = [
  "calculator_backed",
  "provider_review",
  "saved_project_state",
  "user_confirmed"
];

const FINAL_NON_NUMERIC_AUTHORITIES: readonly ReportAssistantResultAuthority[] = [
  "error",
  "needs_input",
  "unsupported"
];

const ERROR_ROUTE_STATUSES: readonly ReportAssistantResultRouteStatus[] = [
  "auth_failed",
  "error",
  "provider_failed",
  "validation_failed"
];

const INCOMPLETE_ROUTE_STATUSES: readonly ReportAssistantResultRouteStatus[] = [
  "auth_failed",
  "error",
  "needs_input",
  "provider_failed",
  "unsupported",
  "validation_failed"
];

export function getReportAssistantResultCapability(
  capabilityName: string
): ReportAssistantCapabilityContract | undefined {
  return REPORT_ASSISTANT_CAPABILITY_REGISTRY.find((capability) => capability.name === capabilityName);
}

export function assertKnownReportAssistantCapability(capabilityName: string): ReportAssistantCapabilityContract {
  const capability = getReportAssistantResultCapability(capabilityName);

  if (!capability) {
    throw new Error(`Unknown report assistant capability "${capabilityName}".`);
  }

  return capability;
}

export function createReportAssistantResultEnvelope(
  input: ReportAssistantResultEnvelopeInput
): ReportAssistantResultEnvelope {
  const capability = assertKnownReportAssistantCapability(input.capabilityName);

  const envelope: ReportAssistantResultEnvelope = {
    authority: input.authority,
    basis: input.basis ?? [],
    capabilityName: input.capabilityName,
    evidence: input.evidence ?? [],
    mutates: capability.mutates,
    previewOnly: capability.previewOnly,
    rendererKind: capability.rendererKind,
    requiresConfirmation: capability.requiresConfirmation,
    resultKind: capability.resultKind,
    routeStatus: input.routeStatus,
    sourceTrace: input.sourceTrace ?? [],
    stalePolicy: capability.stalePolicy,
    tasks: input.tasks ?? [],
    warnings: input.warnings ?? []
  };

  if (input.confidenceReason !== undefined) {
    envelope.confidenceReason = input.confidenceReason;
  }

  const validation = validateReportAssistantResultEnvelope(envelope);
  if (!validation.ok) {
    throw new Error(validation.errors.join(" "));
  }

  return envelope;
}

export function validateReportAssistantResultEnvelope(
  envelope: ReportAssistantResultEnvelope
): ReportAssistantResultEnvelopeValidation {
  const errors: string[] = [];
  const capability = getReportAssistantResultCapability(envelope.capabilityName);

  if (!capability) {
    errors.push(`Unknown report assistant capability "${envelope.capabilityName}".`);
  } else {
    collectCapabilityMismatchErrors(envelope, capability, errors);
  }

  collectAuthorityErrors(envelope, errors);
  collectBasisErrors(envelope, errors);
  collectRouteStatusErrors(envelope, errors);

  if (errors.length > 0) {
    return {
      errors,
      ok: false
    };
  }

  return {
    envelope,
    ok: true
  };
}

function collectCapabilityMismatchErrors(
  envelope: ReportAssistantResultEnvelope,
  capability: ReportAssistantCapabilityContract,
  errors: string[]
): void {
  if (envelope.resultKind !== capability.resultKind) {
    errors.push(
      `Envelope resultKind "${envelope.resultKind}" does not match capability "${capability.name}" value "${capability.resultKind}".`
    );
  }

  if (envelope.rendererKind !== capability.rendererKind) {
    errors.push(
      `Envelope rendererKind "${envelope.rendererKind}" does not match capability "${capability.name}" value "${capability.rendererKind}".`
    );
  }

  if (envelope.stalePolicy !== capability.stalePolicy) {
    errors.push(
      `Envelope stalePolicy "${envelope.stalePolicy}" does not match capability "${capability.name}" value "${capability.stalePolicy}".`
    );
  }

  if (envelope.mutates !== capability.mutates) {
    errors.push(
      `Envelope mutates ${String(envelope.mutates)} does not match capability "${capability.name}" value ${String(capability.mutates)}.`
    );
  }

  if (envelope.previewOnly !== capability.previewOnly) {
    errors.push(
      `Envelope previewOnly ${String(envelope.previewOnly)} does not match capability "${capability.name}" value ${String(capability.previewOnly)}.`
    );
  }

  if (envelope.requiresConfirmation !== capability.requiresConfirmation) {
    errors.push(
      `Envelope requiresConfirmation ${String(envelope.requiresConfirmation)} does not match capability "${capability.name}" value ${String(capability.requiresConfirmation)}.`
    );
  }

  if (envelope.mutates && !envelope.requiresConfirmation) {
    errors.push("Mutating assistant results require explicit user confirmation.");
  }
}

function collectAuthorityErrors(envelope: ReportAssistantResultEnvelope, errors: string[]): void {
  if (envelope.authority === "calculator_backed" && envelope.basis.length === 0) {
    errors.push("calculator_backed authority requires at least one metric basis row.");
  }

  if (envelope.basis.length > 0 && !NUMERIC_RESULT_AUTHORITIES.includes(envelope.authority)) {
    errors.push(
      "Metric basis rows require calculator_backed, saved_project_state, provider_review, or user_confirmed authority."
    );
  }

  if (FINAL_NON_NUMERIC_AUTHORITIES.includes(envelope.authority) && envelope.basis.length > 0) {
    errors.push(`${envelope.authority} results must not publish metric basis rows.`);
  }

  if (envelope.authority === "needs_input" && envelope.routeStatus !== "needs_input") {
    errors.push("needs_input authority requires needs_input routeStatus.");
  }

  if (envelope.authority === "unsupported" && envelope.routeStatus !== "unsupported") {
    errors.push("unsupported authority requires unsupported routeStatus.");
  }

  if (envelope.authority === "error" && !ERROR_ROUTE_STATUSES.includes(envelope.routeStatus)) {
    errors.push("error authority requires auth_failed, error, provider_failed, or validation_failed routeStatus.");
  }
}

function collectBasisErrors(envelope: ReportAssistantResultEnvelope, errors: string[]): void {
  for (const [index, basis] of envelope.basis.entries()) {
    const label = `Metric basis row ${String(index + 1)}`;

    if (basis.metricId.trim().length === 0) {
      errors.push(`${label} requires metricId.`);
    }

    if (basis.basis.trim().length === 0) {
      errors.push(`${label} requires basis.`);
    }

    if (INCOMPLETE_ROUTE_STATUSES.includes(basis.routeStatus)) {
      errors.push(`${label} must describe a published value, not ${basis.routeStatus}.`);
    }
  }
}

function collectRouteStatusErrors(envelope: ReportAssistantResultEnvelope, errors: string[]): void {
  if (
    (
      envelope.routeStatus === "auth_failed" ||
      envelope.routeStatus === "needs_input" ||
      envelope.routeStatus === "provider_failed" ||
      envelope.routeStatus === "unsupported" ||
      envelope.routeStatus === "validation_failed"
    ) &&
    envelope.tasks.length === 0
  ) {
    errors.push(`${envelope.routeStatus} results require at least one task explaining the next step or boundary.`);
  }

  if (envelope.routeStatus === "ready" && FINAL_NON_NUMERIC_AUTHORITIES.includes(envelope.authority)) {
    errors.push(`ready routeStatus cannot be paired with ${envelope.authority} authority.`);
  }
}
