import type { ReportAssistantPatchProposalSource } from "./report-assistant-model";
import type {
  ReportAssistantPatch,
  ReportAssistantPatchValidationResult
} from "./report-assistant-patch";
import {
  createReportAssistantResultEnvelope,
  type ReportAssistantResultEnvelope,
  type ReportAssistantResultEvidence,
  type ReportAssistantResultSourceTrace,
  type ReportAssistantResultTask
} from "./report-assistant-result-contract";

function patchEvidence(input: {
  patch: ReportAssistantPatch;
  source: ReportAssistantPatchProposalSource;
  validation: ReportAssistantPatchValidationResult;
}): readonly ReportAssistantResultEvidence[] {
  const metricIds = new Set<string>();
  const operationTypes = new Set<string>();

  for (const operation of input.validation.operations) {
    operationTypes.add(operation.type);
    if ("metricId" in operation) {
      metricIds.add(operation.metricId);
    }
  }

  const evidence: ReportAssistantResultEvidence[] = [
    {
      detail: input.patch.summary,
      label: "Patch summary"
    },
    {
      detail: input.source,
      label: "Patch source"
    },
    {
      detail: input.validation.status,
      label: "Patch validation status"
    },
    {
      detail: String(input.validation.operations.length),
      label: "Validated operation count"
    }
  ];

  if (operationTypes.size > 0) {
    evidence.push({
      detail: Array.from(operationTypes).join(", "),
      label: "Operation types"
    });
  }

  if (metricIds.size > 0) {
    evidence.push({
      detail: Array.from(metricIds).join(", "),
      label: "Metric ids"
    });
  }

  if (input.validation.documentSignature) {
    evidence.push({
      detail: input.validation.documentSignature,
      label: "Document stale guard"
    });
  }

  return evidence;
}

function sourceTrace(source: ReportAssistantPatchProposalSource): ReportAssistantResultSourceTrace {
  return source === "model"
    ? {
        detail: "A model-provider patch proposal was normalized and validated by host code before being returned.",
        kind: "model_provider",
        label: "report_assistant_patch_route"
      }
    : {
        detail: "The deterministic patch parser produced a typed proposal that was validated by host code.",
        kind: "deterministic",
        label: "report_assistant_patch_route"
      };
}

function errorTasks(input: {
  code: string;
  errors: readonly string[];
  severity?: "error" | "warning";
}): readonly ReportAssistantResultTask[] {
  const severity = input.severity ?? "error";

  return input.errors.length > 0
    ? input.errors.map((message) => ({
        code: input.code,
        message,
        severity
      }))
    : [
        {
          code: input.code,
          message: input.code,
          severity
        }
      ];
}

export function patchProposalToAssistantResult(input: {
  patch: ReportAssistantPatch;
  source: ReportAssistantPatchProposalSource;
  validation: ReportAssistantPatchValidationResult;
  warnings?: readonly string[];
}): ReportAssistantResultEnvelope {
  return createReportAssistantResultEnvelope({
    authority: "draft_only",
    capabilityName: "report_assistant_patch_route",
    confidenceReason: "This is a non-mutating report patch proposal. The app validator and explicit user confirmation own any later apply step.",
    evidence: patchEvidence(input),
    routeStatus: "ready",
    sourceTrace: [sourceTrace(input.source)],
    warnings: input.warnings ?? []
  });
}

export function patchProposalValidationFailureToAssistantResult(input: {
  errors: readonly string[];
  patch: ReportAssistantPatch;
  source: ReportAssistantPatchProposalSource;
  validation: ReportAssistantPatchValidationResult;
  warnings?: readonly string[];
}): ReportAssistantResultEnvelope {
  return createReportAssistantResultEnvelope({
    authority: "draft_only",
    capabilityName: "report_assistant_patch_route",
    confidenceReason: "The patch proposal was rejected by deterministic validation and must not be applied or described as a successful report edit.",
    evidence: patchEvidence(input),
    routeStatus: "validation_failed",
    sourceTrace: [sourceTrace(input.source)],
    tasks: errorTasks({
      code: "patch_validation_failed",
      errors: input.errors
    }),
    warnings: input.warnings ?? []
  });
}

export function patchProposalGenerationFailureToAssistantResult(input: {
  errors: readonly string[];
  source: ReportAssistantPatchProposalSource;
  warnings?: readonly string[];
}): ReportAssistantResultEnvelope {
  return createReportAssistantResultEnvelope({
    authority: "error",
    capabilityName: "report_assistant_patch_route",
    confidenceReason: "No validated report patch proposal was produced, so the assistant has no patch authority for this request.",
    routeStatus: "error",
    sourceTrace: [sourceTrace(input.source)],
    tasks: errorTasks({
      code: "patch_generation_failed",
      errors: input.errors
    }),
    warnings: input.warnings ?? []
  });
}
