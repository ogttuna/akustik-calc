import type { ReportAssistantCapabilityRendererKind } from "./report-assistant-capabilities";
import type {
  ReportAssistantResultAuthority,
  ReportAssistantResultEnvelope,
  ReportAssistantResultRouteStatus
} from "./report-assistant-result-contract";

export type ReportAssistantResultCardTone = "error" | "neutral" | "success" | "warning";

export type ReportAssistantResultCardMetaRow = {
  label: string;
  value: string;
};

export type ReportAssistantResultRendererDefinition = {
  label: string;
  rendersCalculatorPreview: boolean;
};

export type ReportAssistantResultCardModel = {
  metaRows: readonly ReportAssistantResultCardMetaRow[];
  rendererKind: ReportAssistantCapabilityRendererKind;
  rendererLabel: string;
  rendersCalculatorPreview: boolean;
  routeStatusLabel: string;
  tone: ReportAssistantResultCardTone;
};

export const REPORT_ASSISTANT_RESULT_RENDERER_DEFINITIONS = {
  action_proposal_card: {
    label: "Action proposal",
    rendersCalculatorPreview: false
  },
  calculator_preview_card: {
    label: "Calculator preview",
    rendersCalculatorPreview: true
  },
  error_card: {
    label: "Error",
    rendersCalculatorPreview: false
  },
  finding_log_card: {
    label: "Finding log",
    rendersCalculatorPreview: false
  },
  patch_proposal_card: {
    label: "Patch proposal",
    rendersCalculatorPreview: false
  },
  project_read_card: {
    label: "Project read",
    rendersCalculatorPreview: false
  },
  query_answer_card: {
    label: "Query answer",
    rendersCalculatorPreview: false
  },
  research_review_card: {
    label: "Research review",
    rendersCalculatorPreview: false
  },
  runtime_status_card: {
    label: "Runtime status",
    rendersCalculatorPreview: false
  },
  tool_result_card: {
    label: "Tool result",
    rendersCalculatorPreview: false
  },
  wall_candidate_comparison_card: {
    label: "Wall comparison",
    rendersCalculatorPreview: false
  }
} as const satisfies Record<ReportAssistantCapabilityRendererKind, ReportAssistantResultRendererDefinition>;

export function formatReportAssistantResultToken(value: string): string {
  return value.replace(/_/gu, " ");
}

export function getReportAssistantResultCardTone(
  result: Pick<ReportAssistantResultEnvelope, "authority" | "requiresConfirmation" | "routeStatus">
): ReportAssistantResultCardTone {
  if (isErrorResult(result.authority, result.routeStatus)) {
    return "error";
  }

  if (isWarningResult(result.authority, result.requiresConfirmation, result.routeStatus)) {
    return "warning";
  }

  return result.authority === "calculator_backed" ||
    result.authority === "saved_project_state" ||
    result.authority === "user_confirmed"
    ? "success"
    : "neutral";
}

export function createReportAssistantResultCardModel(
  result: ReportAssistantResultEnvelope
): ReportAssistantResultCardModel {
  const renderer = REPORT_ASSISTANT_RESULT_RENDERER_DEFINITIONS[result.rendererKind];

  return {
    metaRows: [
      {
        label: "Authority",
        value: formatReportAssistantResultToken(result.authority)
      },
      {
        label: "Posture",
        value: result.previewOnly ? "Preview" : result.mutates ? "Mutates" : "Read"
      },
      {
        label: "Confirmation",
        value: result.requiresConfirmation ? "Required" : "Not required"
      },
      {
        label: "Stale policy",
        value: formatReportAssistantResultToken(result.stalePolicy)
      }
    ],
    rendererKind: result.rendererKind,
    rendererLabel: renderer.label,
    rendersCalculatorPreview:
      renderer.rendersCalculatorPreview &&
      result.authority === "calculator_backed" &&
      result.routeStatus === "ready",
    routeStatusLabel: formatReportAssistantResultToken(result.routeStatus),
    tone: getReportAssistantResultCardTone(result)
  };
}

function isErrorResult(
  authority: ReportAssistantResultAuthority,
  routeStatus: ReportAssistantResultRouteStatus
): boolean {
  return (
    authority === "error" ||
    routeStatus === "error" ||
    routeStatus === "auth_failed" ||
    routeStatus === "provider_failed" ||
    routeStatus === "validation_failed"
  );
}

function isWarningResult(
  authority: ReportAssistantResultAuthority,
  requiresConfirmation: boolean,
  routeStatus: ReportAssistantResultRouteStatus
): boolean {
  return (
    authority === "needs_input" ||
    authority === "unsupported" ||
    routeStatus === "needs_input" ||
    routeStatus === "unsupported" ||
    routeStatus === "stale" ||
    requiresConfirmation
  );
}
