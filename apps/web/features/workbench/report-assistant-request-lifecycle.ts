import {
  createReportAssistantRequestId,
  type ReportAssistantRequestKind,
  type ReportAssistantRequestResult
} from "./report-assistant-request-client";

export type ReportAssistantActiveRequest = {
  documentSignature: string;
  requestId: string;
};

export type ReportAssistantActiveRequestRegistry = Record<ReportAssistantRequestKind, ReportAssistantActiveRequest | null>;

export function createReportAssistantActiveRequestRegistry(): ReportAssistantActiveRequestRegistry {
  return {
    assembly_alternatives_research: null,
    finding_log: null,
    patch_proposal: null,
    plausibility_research: null
  };
}

export function startReportAssistantRequest(input: {
  documentSignature: string;
  kind: ReportAssistantRequestKind;
  registry: ReportAssistantActiveRequestRegistry;
}): ReportAssistantActiveRequest {
  const activeRequest = {
    documentSignature: input.documentSignature,
    requestId: createReportAssistantRequestId(input.kind)
  };
  input.registry[input.kind] = activeRequest;
  return activeRequest;
}

export function isReportAssistantRequestResultActive(input: {
  currentDocumentSignature: string;
  registry: ReportAssistantActiveRequestRegistry;
  result: ReportAssistantRequestResult;
}): boolean {
  const activeRequest = input.registry[input.result.meta.kind];
  return (
    activeRequest?.requestId === input.result.meta.requestId &&
    activeRequest.documentSignature === input.result.meta.documentSignature &&
    input.currentDocumentSignature === input.result.meta.documentSignature
  );
}

export function isReportAssistantRequestRecordActive(input: {
  currentDocumentSignature: string;
  kind: ReportAssistantRequestKind;
  registry: ReportAssistantActiveRequestRegistry;
  request: ReportAssistantActiveRequest;
}): boolean {
  const activeRequest = input.registry[input.kind];
  return (
    activeRequest?.requestId === input.request.requestId &&
    activeRequest.documentSignature === input.request.documentSignature &&
    input.currentDocumentSignature === input.request.documentSignature
  );
}

export function finishReportAssistantRequest(input: {
  kind: ReportAssistantRequestKind;
  registry: ReportAssistantActiveRequestRegistry;
  requestId: string;
}) {
  if (input.registry[input.kind]?.requestId === input.requestId) {
    input.registry[input.kind] = null;
  }
}
