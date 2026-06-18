import {
  createReportAssistantDocumentSignature,
  type ReportAssistantContext
} from "./report-assistant-context";
import type { SimpleWorkbenchProposalDocument } from "./simple-workbench-proposal";

export type ReportAssistantActionProposalName =
  | "create_project_report_from_current_draft"
  | "create_user_preset_from_current_stack"
  | "restore_report_revision_as_new_draft"
  | "save_current_stack_as_project_assembly"
  | "save_project_report_revision_from_current_draft";

export type ReportAssistantActionProposalDefinition = {
  description: string;
  mutates: false;
  name: ReportAssistantActionProposalName;
  previewOnly: true;
  requiresConfirmation: true;
};

export const REPORT_ASSISTANT_ACTION_PROPOSAL_DEFINITIONS: readonly ReportAssistantActionProposalDefinition[] = [
  {
    description: "Preview creating a project report from the current report editor draft.",
    mutates: false,
    name: "create_project_report_from_current_draft",
    previewOnly: true,
    requiresConfirmation: true
  },
  {
    description: "Preview creating an owner-scoped reusable preset from the current source stack.",
    mutates: false,
    name: "create_user_preset_from_current_stack",
    previewOnly: true,
    requiresConfirmation: true
  },
  {
    description: "Preview restoring a selected saved report revision as a new current project report revision.",
    mutates: false,
    name: "restore_report_revision_as_new_draft",
    previewOnly: true,
    requiresConfirmation: true
  },
  {
    description: "Preview saving the current source stack as a project assembly.",
    mutates: false,
    name: "save_current_stack_as_project_assembly",
    previewOnly: true,
    requiresConfirmation: true
  },
  {
    description: "Preview saving the current report editor draft as a new project report revision.",
    mutates: false,
    name: "save_project_report_revision_from_current_draft",
    previewOnly: true,
    requiresConfirmation: true
  }
];

export type ReportAssistantActionProposalTarget = {
  assemblyDisplayCode?: string;
  assemblyId?: string;
  assemblyName?: string;
  currentRevisionId?: string;
  expectedReportUpdatedAtIso?: string;
  projectId?: string;
  projectName?: string;
  reportDisplayCode?: string;
  reportId?: string;
  reportName?: string;
  restoreRevisionDisplayCode?: string;
  restoreRevisionId?: string;
};

export type ReportAssistantActionProposalApplyRoute = {
  bodyPreview: {
    assistantPatchSummary: "latest_assistant_patch_summary_if_present";
    assemblyId?: "selected_project_assembly";
    calculationSummary?: "current_project_calculation_summary_if_present";
    changeSummary: string;
    description?: "assistant_confirmed_source_stack_description";
    document: "current_report_document" | "selected_revision_document";
    expectedReportUpdatedAtIso?: string;
    kind?: "current_stack_kind";
    name?: "current_assembly_library_name" | "current_report_library_name";
    source: "assistant" | "manual";
    sourceAssemblySnapshot?: "selected_project_assembly_snapshot";
    sourceCalculationOutput?: "selected_project_calculation_output_if_present";
    sourceMaterialSnapshot?: "selected_project_material_snapshot";
    snapshot?: "current_source_assembly_snapshot";
  };
  method: "POST";
  pathname: string;
};

export type ReportAssistantActionProposal = {
  action: ReportAssistantActionProposalName;
  applyRoute: ReportAssistantActionProposalApplyRoute;
  assistantContextSignature: string;
  documentSignature: string;
  mutates: false;
  previewMutates: false;
  requiresConfirmation: true;
  summary: string;
  target: ReportAssistantActionProposalTarget;
  title: string;
  warnings: readonly string[];
};

export type ReportAssistantActionProposalResult =
  | {
      mutates: false;
      ok: true;
      proposal: ReportAssistantActionProposal;
      warnings: readonly string[];
    }
  | {
      code: string;
      errors: readonly string[];
      mutates: false;
      ok: false;
      statusCode: number;
      warnings: readonly string[];
    };

export type ReportAssistantActionProposalInput = {
  action?: ReportAssistantActionProposalName;
  context: ReportAssistantContext;
  document: SimpleWorkbenchProposalDocument;
  instruction: string;
  selectedRevision?: {
    displayCode?: string;
    id: string;
  };
  sourceStackAvailable?: boolean;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

function normalizeInstruction(value: string): string {
  return value
    .replace(/[İIı]/gu, "i")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/gu, " ")
    .trim();
}

export function isReportAssistantActionProposalName(value: unknown): value is ReportAssistantActionProposalName {
  return (
    value === "create_project_report_from_current_draft" ||
    value === "create_user_preset_from_current_stack" ||
    value === "restore_report_revision_as_new_draft" ||
    value === "save_current_stack_as_project_assembly" ||
    value === "save_project_report_revision_from_current_draft"
  );
}

function fail(input: {
  code: string;
  errors: readonly string[];
  statusCode: number;
  warnings?: readonly string[];
}): ReportAssistantActionProposalResult {
  return {
    code: input.code,
    errors: input.errors,
    mutates: false,
    ok: false,
    statusCode: input.statusCode,
    warnings: input.warnings ?? []
  };
}

function inferActionName(instruction: string): ReportAssistantActionProposalName | null {
  const normalized = normalizeInstruction(instruction);
  const wantsCreate =
    /\b(?:create|new)\b/u.test(normalized) ||
    /\b(?:olustur|yeni)\b/u.test(normalized);
  const wantsSave =
    /\b(?:append|save|persist)\b/u.test(normalized) ||
    /\b(?:ekle|kaydet|sakla)\b/u.test(normalized);
  const wantsPreset =
    /\b(?:preset|template)\b/u.test(normalized) ||
    /\b(?:sablon|template)\b/u.test(normalized);
  const wantsAssembly =
    /\b(?:assembly|combination|layer combination|stack)\b/u.test(normalized) ||
    /\b(?:kombinasyon|katman|katman kombinasyonu)\b/u.test(normalized);
  const wantsRestore =
    /\b(?:restore|restored|rollback)\b/u.test(normalized) ||
    /\b(?:geri yukle|geri al|restore et)\b/u.test(normalized);
  const wantsReportRevision =
    /\b(?:project report|report|revision|revise|rapor|revizyon)\b/u.test(normalized);
  const unsupportedMutation =
    /\b(?:apply|archive|delete|download|export|update|write)\b/u.test(normalized) ||
    /\b(?:arsivle|disari aktar|guncelle|indir|sil|uygula|yaz)\b/u.test(normalized);

  if (wantsRestore && wantsReportRevision && !unsupportedMutation) {
    return "restore_report_revision_as_new_draft";
  }

  if (wantsCreate && wantsReportRevision && !unsupportedMutation) {
    return "create_project_report_from_current_draft";
  }

  if ((wantsCreate || wantsSave) && wantsPreset && !unsupportedMutation) {
    return "create_user_preset_from_current_stack";
  }

  if (wantsSave && wantsAssembly && !unsupportedMutation) {
    return "save_current_stack_as_project_assembly";
  }

  if (wantsSave && wantsReportRevision && !unsupportedMutation) {
    return "save_project_report_revision_from_current_draft";
  }

  return null;
}

function isValidIsoDateTime(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0 && !Number.isNaN(Date.parse(value));
}

function isValidUuid(value: string | undefined): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

function getRevisionTarget(context: ReportAssistantContext):
  | {
      currentRevisionId?: string;
      expectedReportUpdatedAtIso: string;
      projectId: string;
      projectName?: string;
      reportDisplayCode?: string;
      reportId: string;
      reportName?: string;
      reportStatus?: string;
    }
  | null {
  const workspace = context.projectWorkspace;
  const activeDraftState = workspace?.activeDraftState;
  const projectId = workspace?.project?.id ?? activeDraftState?.projectId;
  const reportId = workspace?.report?.id ?? activeDraftState?.reportId;
  const expectedReportUpdatedAtIso = workspace?.report?.updatedAtIso ?? activeDraftState?.reportUpdatedAtIso;

  if (!isValidUuid(projectId) || !isValidUuid(reportId) || !isValidIsoDateTime(expectedReportUpdatedAtIso)) {
    return null;
  }

  return {
    currentRevisionId: workspace?.report?.currentRevisionId,
    expectedReportUpdatedAtIso,
    projectId,
    projectName: workspace?.project?.name ?? activeDraftState?.projectName,
    reportDisplayCode: workspace?.report?.displayCode,
    reportId,
    reportName: workspace?.report?.name,
    reportStatus: workspace?.report?.status
  };
}

function getCreateReportTarget(context: ReportAssistantContext):
  | {
      assemblyDisplayCode?: string;
      assemblyId: string;
      assemblyName?: string;
      projectId: string;
      projectName?: string;
      reportId?: string;
    }
  | null {
  const workspace = context.projectWorkspace;
  const activeDraftState = workspace?.activeDraftState;
  const projectId = workspace?.project?.id ?? activeDraftState?.projectId;
  const assemblyId = workspace?.linkedAssembly?.id ?? activeDraftState?.assemblyId;

  if (!isValidUuid(projectId) || !isValidUuid(assemblyId)) {
    return null;
  }

  return {
    assemblyDisplayCode: workspace?.linkedAssembly?.displayCode,
    assemblyId,
    assemblyName: workspace?.linkedAssembly?.name ?? activeDraftState?.assemblyName,
    projectId,
    projectName: workspace?.project?.name ?? activeDraftState?.projectName,
    reportId: workspace?.report?.id ?? activeDraftState?.reportId
  };
}

function getAssemblySaveTarget(context: ReportAssistantContext):
  | {
      projectId: string;
      projectName?: string;
      reportId?: string;
    }
  | null {
  const workspace = context.projectWorkspace;
  const activeDraftState = workspace?.activeDraftState;
  const projectId = workspace?.project?.id ?? activeDraftState?.projectId;

  if (!isValidUuid(projectId)) {
    return null;
  }

  return {
    projectId,
    projectName: workspace?.project?.name ?? activeDraftState?.projectName,
    reportId: workspace?.report?.id ?? activeDraftState?.reportId
  };
}

function encodeRouteSegment(value: string): string {
  return encodeURIComponent(value);
}

export function createReportAssistantActionProposal(
  input: ReportAssistantActionProposalInput
): ReportAssistantActionProposalResult {
  const action = input.action ?? inferActionName(input.instruction);
  if (!action) {
    return fail({
      code: "unsupported_report_assistant_action_proposal",
      errors: ["This action proposal route only previews supported project report actions."],
      statusCode: 400
    });
  }

  if (!isReportAssistantActionProposalName(action)) {
    return fail({
      code: "unsupported_report_assistant_action_proposal",
      errors: [`Unsupported assistant action proposal: ${String(action)}.`],
      statusCode: 400
    });
  }

  const actualDocumentSignature = createReportAssistantDocumentSignature(input.document);
  if (actualDocumentSignature !== input.context.documentSignature) {
    return fail({
      code: "stale_report_assistant_action_document",
      errors: ["The current report document no longer matches the assistant context signature."],
      statusCode: 409
    });
  }

  if (action === "create_project_report_from_current_draft") {
    const createTarget = getCreateReportTarget(input.context);
    if (!createTarget) {
      return fail({
        code: "missing_project_report_create_target",
        errors: ["Select a saved project layer combination before previewing a new project report action."],
        statusCode: 400
      });
    }
    if (createTarget.reportId) {
      return fail({
        code: "project_report_already_selected",
        errors: ["The current draft is already linked to a project report. Save a new revision instead."],
        statusCode: 409
      });
    }

    const title = "Create a project report from the current draft";
    const assemblyLabel = createTarget.assemblyDisplayCode
      ? `${createTarget.assemblyDisplayCode}${createTarget.assemblyName ? ` ${createTarget.assemblyName}` : ""}`
      : createTarget.assemblyName ?? "selected project assembly";

    return {
      mutates: false,
      ok: true,
      proposal: {
        action,
        applyRoute: {
          bodyPreview: {
            assemblyId: "selected_project_assembly",
            assistantPatchSummary: "latest_assistant_patch_summary_if_present",
            changeSummary: "Assistant-confirmed project report creation from current draft.",
            document: "current_report_document",
            name: "current_report_library_name",
            source: "assistant",
            sourceAssemblySnapshot: "selected_project_assembly_snapshot",
            sourceCalculationOutput: "selected_project_calculation_output_if_present",
            sourceMaterialSnapshot: "selected_project_material_snapshot"
          },
          method: "POST",
          pathname: `/api/projects/${encodeRouteSegment(createTarget.projectId)}/reports`
        },
        assistantContextSignature: input.context.assistantContextSignature,
        documentSignature: input.context.documentSignature,
        mutates: false,
        previewMutates: false,
        requiresConfirmation: true,
        summary: `Preview only. On confirmation, the app should create a new project report from the current draft under ${assemblyLabel}.`,
        target: {
          assemblyDisplayCode: createTarget.assemblyDisplayCode,
          assemblyId: createTarget.assemblyId,
          assemblyName: createTarget.assemblyName,
          projectId: createTarget.projectId,
          projectName: createTarget.projectName
        },
        title,
        warnings: []
      },
      warnings: []
    };
  }

  if (action === "create_user_preset_from_current_stack") {
    if (input.sourceStackAvailable !== true) {
      return fail({
        code: "missing_preset_source_stack",
        errors: ["Open a report draft with a source stack before previewing a preset create action."],
        statusCode: 400
      });
    }

    const title = "Create a reusable preset from the current stack";

    return {
      mutates: false,
      ok: true,
      proposal: {
        action,
        applyRoute: {
          bodyPreview: {
            assistantPatchSummary: "latest_assistant_patch_summary_if_present",
            changeSummary: "Assistant-confirmed preset creation from current source stack.",
            description: "assistant_confirmed_source_stack_description",
            document: "current_report_document",
            name: "current_assembly_library_name",
            snapshot: "current_source_assembly_snapshot",
            source: "assistant"
          },
          method: "POST",
          pathname: "/api/workbench-v2/presets"
        },
        assistantContextSignature: input.context.assistantContextSignature,
        documentSignature: input.context.documentSignature,
        mutates: false,
        previewMutates: false,
        requiresConfirmation: true,
        summary: "Preview only. On confirmation, the app should create an owner-scoped reusable preset from the current source stack.",
        target: {},
        title,
        warnings: []
      },
      warnings: []
    };
  }

  if (action === "save_current_stack_as_project_assembly") {
    const assemblyTarget = getAssemblySaveTarget(input.context);
    if (!assemblyTarget) {
      return fail({
        code: "missing_project_assembly_save_target",
        errors: ["Select a saved project before previewing a layer-combination save action."],
        statusCode: 400
      });
    }
    if (assemblyTarget.reportId) {
      return fail({
        code: "project_report_already_selected",
        errors: ["The current draft is already linked to a project report. Save a report revision instead."],
        statusCode: 409
      });
    }

    const title = "Save current stack as a project assembly";
    const projectLabel = assemblyTarget.projectName ?? "selected project";

    return {
      mutates: false,
      ok: true,
      proposal: {
        action,
        applyRoute: {
          bodyPreview: {
            assistantPatchSummary: "latest_assistant_patch_summary_if_present",
            calculationSummary: "current_project_calculation_summary_if_present",
            changeSummary: "Assistant-confirmed project assembly creation from current source stack.",
            description: "assistant_confirmed_source_stack_description",
            document: "current_report_document",
            kind: "current_stack_kind",
            name: "current_assembly_library_name",
            snapshot: "current_source_assembly_snapshot",
            source: "assistant"
          },
          method: "POST",
          pathname: `/api/projects/${encodeRouteSegment(assemblyTarget.projectId)}/assemblies`
        },
        assistantContextSignature: input.context.assistantContextSignature,
        documentSignature: input.context.documentSignature,
        mutates: false,
        previewMutates: false,
        requiresConfirmation: true,
        summary: `Preview only. On confirmation, the app should save the current source stack as a new assembly in ${projectLabel}.`,
        target: {
          projectId: assemblyTarget.projectId,
          projectName: assemblyTarget.projectName
        },
        title,
        warnings: []
      },
      warnings: []
    };
  }

  const target = getRevisionTarget(input.context);
  if (!target) {
    return fail({
      code: "missing_project_report_revision_target",
      errors: ["Open a saved project report with a current updated timestamp before previewing a revision save action."],
      statusCode: 400
    });
  }

  if (target.reportStatus === "archived") {
    return fail({
      code: "archived_project_report_revision_target",
      errors: ["Archived project reports must be restored before a new revision can be saved."],
      statusCode: 409
    });
  }

  if (action === "restore_report_revision_as_new_draft") {
    if (!isValidUuid(input.selectedRevision?.id)) {
      return fail({
        code: "missing_restore_revision_target",
        errors: ["Select and preview a saved report revision before asking the assistant to restore it."],
        statusCode: 400
      });
    }
    if (input.selectedRevision.id === target.currentRevisionId) {
      return fail({
        code: "current_revision_restore_target",
        errors: ["The selected revision is already current."],
        statusCode: 400
      });
    }

    const restoreLabel = input.selectedRevision.displayCode ?? "selected revision";
    const title = "Restore selected revision as a new current revision";
    const changeSummary = `Assistant-confirmed restore from ${restoreLabel}.`;

    return {
      mutates: false,
      ok: true,
      proposal: {
        action,
        applyRoute: {
          bodyPreview: {
            assistantPatchSummary: "latest_assistant_patch_summary_if_present",
            changeSummary,
            document: "selected_revision_document",
            expectedReportUpdatedAtIso: target.expectedReportUpdatedAtIso,
            source: "manual"
          },
          method: "POST",
          pathname: `/api/projects/${encodeRouteSegment(target.projectId)}/reports/${encodeRouteSegment(target.reportId)}/revisions`
        },
        assistantContextSignature: input.context.assistantContextSignature,
        documentSignature: input.context.documentSignature,
        mutates: false,
        previewMutates: false,
        requiresConfirmation: true,
        summary: `Preview only. On confirmation, the app should append ${restoreLabel} as a new current revision with a stale guard of ${target.expectedReportUpdatedAtIso}.`,
        target: {
          currentRevisionId: target.currentRevisionId,
          expectedReportUpdatedAtIso: target.expectedReportUpdatedAtIso,
          projectId: target.projectId,
          projectName: target.projectName,
          reportDisplayCode: target.reportDisplayCode,
          reportId: target.reportId,
          reportName: target.reportName,
          restoreRevisionDisplayCode: input.selectedRevision.displayCode,
          restoreRevisionId: input.selectedRevision.id
        },
        title,
        warnings: []
      },
      warnings: []
    };
  }

  const title = "Save current draft as a new project report revision";
  const targetLabel = target.reportDisplayCode
    ? `${target.reportDisplayCode}${target.reportName ? ` ${target.reportName}` : ""}`
    : target.reportName ?? "selected project report";
  const changeSummary = "Assistant-proposed report editor draft.";

  return {
    mutates: false,
    ok: true,
    proposal: {
      action,
      applyRoute: {
        bodyPreview: {
          assistantPatchSummary: "latest_assistant_patch_summary_if_present",
          changeSummary,
          document: "current_report_document",
          expectedReportUpdatedAtIso: target.expectedReportUpdatedAtIso,
          source: "assistant"
        },
        method: "POST",
        pathname: `/api/projects/${encodeRouteSegment(target.projectId)}/reports/${encodeRouteSegment(target.reportId)}/revisions`
      },
      assistantContextSignature: input.context.assistantContextSignature,
      documentSignature: input.context.documentSignature,
      mutates: false,
      previewMutates: false,
      requiresConfirmation: true,
      summary: `Preview only. On confirmation, the app should append the current draft to ${targetLabel} with a stale guard of ${target.expectedReportUpdatedAtIso}.`,
      target: {
        currentRevisionId: target.currentRevisionId,
        expectedReportUpdatedAtIso: target.expectedReportUpdatedAtIso,
        projectId: target.projectId,
        projectName: target.projectName,
        reportDisplayCode: target.reportDisplayCode,
        reportId: target.reportId,
        reportName: target.reportName
      },
      title,
      warnings: []
    },
    warnings: []
  };
}
