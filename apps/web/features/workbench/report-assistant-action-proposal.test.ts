import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createReportAssistantActionProposal,
  type ReportAssistantActionProposalResult
} from "./report-assistant-action-proposal";
import {
  buildReportAssistantContext,
  getReportAssistantMetricBasis,
  getReportAssistantMetricDirection,
  getReportAssistantMetricId
} from "./report-assistant-context";
import type { ReportAssistantResultEnvelope } from "./report-assistant-result-contract";
import type { SimpleWorkbenchProposalDocument } from "./simple-workbench-proposal";
import { POST } from "../../app/api/report-assistant/action-proposal/route";

const mockAuthState = vi.hoisted(() => ({
  value: {
    configured: false,
    missingKeys: [],
    session: {
      expiresAt: Number.MAX_SAFE_INTEGER,
      username: "Preview mode"
    }
  } as
    | {
        configured: false;
        missingKeys: string[];
        session: {
          expiresAt: number;
          username: string;
        };
      }
    | {
        configured: true;
        session: {
          expiresAt: number;
          username: string;
        } | null;
      }
}));

vi.mock("@/lib/auth", () => ({
  PUBLIC_PREVIEW_USERNAME: "Preview mode",
  getAuthState: vi.fn(async () => mockAuthState.value)
}));

const PROJECT_ID = "11111111-1111-4111-8111-111111111111";
const ASSEMBLY_ID = "12121212-1212-4121-8121-121212121212";
const REPORT_ID = "22222222-2222-4222-8222-222222222222";
const REVISION_ID = "33333333-3333-4333-8333-333333333333";
const REPORT_UPDATED_AT_ISO = "2026-06-16T10:00:00.000Z";

const RW_METRIC_ID = getReportAssistantMetricId("Rw");

function metricMetadata() {
  return {
    engineDisplayValue: "61 dB",
    metricBasis: getReportAssistantMetricBasis("Rw"),
    metricDirection: getReportAssistantMetricDirection("Rw"),
    outputId: "Rw" as const,
    reportMetricId: RW_METRIC_ID
  };
}

function documentFixture(input?: {
  executiveSummary?: string;
  primaryMetricValue?: string;
}): SimpleWorkbenchProposalDocument {
  const value = input?.primaryMetricValue ?? "61 dB";

  return {
    assemblyHeadline: `Rw ${value} is packaged.`,
    assumptionItems: [],
    approverTitle: "Lead Acoustic Consultant",
    briefNote: "Action proposal route fixture.",
    citations: [],
    clientName: "Machinity Acoustics",
    consultantAddress: "Maslak District, Istanbul",
    consultantCompany: "Machinity Acoustic Consultants",
    consultantEmail: "offers@machinity-acoustics.com",
    consultantLogoDataUrl: "",
    consultantPhone: "+90 212 000 00 00",
    consultantWordmarkLine: "Building Acoustics",
    contextLabel: "Building prediction",
    corridorDossierCards: [],
    corridorDossierHeadline: "Validation corridor packaged.",
    coverageItems: [
      {
        detail: "Weighted airborne element rating.",
        label: "Rw",
        postureDetail: "Live value.",
        postureLabel: "Live",
        postureTone: "success",
        status: "live",
        value,
        ...metricMetadata()
      }
    ],
    decisionTrailHeadline: "Scoped estimate is active.",
    decisionTrailItems: [],
    dynamicBranchDetail: "Published family estimate is active.",
    dynamicBranchLabel: "Heavy floor",
    executiveSummary: input?.executiveSummary ?? `Action proposal fixture reads Rw ${value}.`,
    issuedOnIso: "2026-06-16T09:00:00.000Z",
    issuedOnLabel: "16 June 2026",
    issueBaseReference: "MAC-ACTION-001",
    issueCodePrefix: "MAC",
    issueNextReference: "MAC-ACTION-002",
    issueRegisterItems: [],
    layers: [
      {
        categoryLabel: "Structure",
        index: 1,
        label: "Concrete slab",
        roleLabel: "Base structure",
        surfaceMassLabel: "480 kg/m2",
        thicknessLabel: "200 mm"
      }
    ],
    methodDossierCards: [],
    methodDossierHeadline: "Solver rationale packaged.",
    methodTraceGroups: [],
    metrics: [
      {
        detail: "Weighted airborne element rating.",
        label: "Rw",
        value,
        ...metricMetadata()
      }
    ],
    preparedBy: "O. Tuna",
    primaryMetricLabel: "Rw",
    primaryMetricValue: value,
    projectName: "Action proposal project",
    proposalAttention: "Design Coordination Team",
    proposalIssuePurpose: "Client review",
    proposalRecipient: "Machinity Development Team",
    proposalReference: "MAC-ACTION-001",
    proposalRevision: "Rev 01",
    proposalSubject: "Action proposal acoustic report",
    proposalValidityNote: "Valid for 30 calendar days unless superseded.",
    recommendationItems: [],
    reportProfile: "consultant",
    reportProfileLabel: "Consultant issue",
    studyContextLabel: "Pre-tender",
    studyModeLabel: "Floor",
    validationDetail: "Read this as a supported floor estimate.",
    validationLabel: "Scoped estimate",
    warnings: []
  };
}

function contextFixture(document: SimpleWorkbenchProposalDocument = documentFixture()) {
  return buildReportAssistantContext({
    document,
    projectWorkspace: {
      availableReadTools: [],
      currentRevision: {
        createdAtIso: "2026-06-16T09:30:00.000Z",
        id: REVISION_ID,
        source: "manual"
      },
      project: {
        id: PROJECT_ID,
        name: "Action proposal project"
      },
      linkedAssembly: {
        displayCode: "ASM-0001",
        id: ASSEMBLY_ID,
        kind: "floor",
        name: "Saved action proposal assembly",
        version: 1
      },
      report: {
        assemblyId: ASSEMBLY_ID,
        currentRevisionId: REVISION_ID,
        displayCode: "RPT-0001",
        id: REPORT_ID,
        name: "Saved action proposal report",
        revisionCount: 1,
        status: "draft",
        updatedAtIso: REPORT_UPDATED_AT_ISO
      },
      revisionSummaries: [],
      scope: "project_report"
    }
  });
}

function projectAssemblyContextFixture(document: SimpleWorkbenchProposalDocument = documentFixture()) {
  return buildReportAssistantContext({
    document,
    projectWorkspace: {
      activeDraftState: {
        assemblyId: ASSEMBLY_ID,
        assemblyName: "Saved action proposal assembly",
        dirty: true,
        kind: "project_draft",
        projectId: PROJECT_ID,
        projectName: "Action proposal project"
      },
      availableReadTools: [],
      linkedAssembly: {
        displayCode: "ASM-0001",
        id: ASSEMBLY_ID,
        kind: "floor",
        name: "Saved action proposal assembly",
        version: 1
      },
      project: {
        id: PROJECT_ID,
        name: "Action proposal project"
      },
      revisionSummaries: [],
      scope: "project"
    }
  });
}

function routeRequest(body: unknown): Request {
  return new Request("http://localhost/api/report-assistant/action-proposal", {
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
  });
}

beforeEach(() => {
  mockAuthState.value = {
    configured: false,
    missingKeys: [],
    session: {
      expiresAt: Number.MAX_SAFE_INTEGER,
      username: "Preview mode"
    }
  };
});

describe("report assistant action proposal", () => {
  it("previews creating a project report from the current draft without mutating", () => {
    const document = documentFixture();
    const context = projectAssemblyContextFixture(document);

    const result = createReportAssistantActionProposal({
      context,
      document,
      instruction: "Create a new project report from this draft"
    });

    expect(result.ok).toBe(true);
    expect(result.mutates).toBe(false);
    const proposal = (result as Extract<ReportAssistantActionProposalResult, { ok: true }>).proposal;
    expect(proposal).toMatchObject({
      action: "create_project_report_from_current_draft",
      applyRoute: {
        bodyPreview: {
          assemblyId: "selected_project_assembly",
          document: "current_report_document",
          name: "current_report_library_name",
          source: "assistant",
          sourceAssemblySnapshot: "selected_project_assembly_snapshot",
          sourceCalculationOutput: "selected_project_calculation_output_if_present",
          sourceMaterialSnapshot: "selected_project_material_snapshot"
        },
        method: "POST",
        pathname: `/api/projects/${PROJECT_ID}/reports`
      },
      documentSignature: context.documentSignature,
      mutates: false,
      previewMutates: false,
      requiresConfirmation: true,
      target: {
        assemblyDisplayCode: "ASM-0001",
        assemblyId: ASSEMBLY_ID,
        projectId: PROJECT_ID
      }
    });
    expect(JSON.stringify(proposal)).not.toContain("Action proposal fixture reads");
  });

  it("does not imply export or download proposals from preview-only wording", () => {
    const document = documentFixture();

    const result = createReportAssistantActionProposal({
      context: contextFixture(document),
      document,
      instruction: "Preview this report"
    });

    expect(result).toMatchObject({
      code: "unsupported_report_assistant_action_proposal",
      mutates: false,
      ok: false,
      statusCode: 400
    });
  });

  it("does not imply export or download proposals from bare PDF wording", () => {
    const document = documentFixture();

    const result = createReportAssistantActionProposal({
      context: contextFixture(document),
      document,
      instruction: "Explain the PDF report format"
    });

    expect(result).toMatchObject({
      code: "unsupported_report_assistant_action_proposal",
      mutates: false,
      ok: false,
      statusCode: 400
    });
  });

  it("previews explicit PDF export from the current calculator/report snapshot without downloading", () => {
    const document = documentFixture();
    const context = contextFixture(document);

    const result = createReportAssistantActionProposal({
      context,
      document,
      instruction: "Calculate and download PDF"
    });

    expect(result.ok).toBe(true);
    expect(result.mutates).toBe(false);
    const proposal = (result as Extract<ReportAssistantActionProposalResult, { ok: true }>).proposal;
    expect(proposal).toMatchObject({
      action: "export_current_report_snapshot_as_pdf",
      applyRoute: {
        bodyPreview: {
          document: "current_report_document",
          exportContentSummary: "current_export_content_summary",
          exportFormat: "pdf",
          exportSnapshotSignature: "current_assistant_context_signature",
          selectedOutputs: "current_selected_output_set",
          source: "assistant"
        },
        method: "POST",
        pathname: "/api/proposal-pdf"
      },
      documentSignature: context.documentSignature,
      mutates: false,
      previewMutates: false,
      requiresConfirmation: true,
      target: {
        exportCalculatorBackedRowCount: 1,
        exportContentKinds: ["calculator_backed_rows"],
        exportFormat: "pdf",
        exportSnapshotSignature: context.assistantContextSignature,
        selectedOutputs: ["Rw"]
      }
    });
    expect(proposal.summary).toContain(context.assistantContextSignature);
    expect(proposal.summary).toContain("selected outputs: Rw");
    expect(proposal.summary).toContain("calculator-backed rows");
    expect(proposal.warnings).toEqual([]);
    expect(JSON.stringify(proposal)).not.toContain("Action proposal fixture reads");
  });

  it("blocks stale calculator rows from calculator-result labeling in export proposals", () => {
    const document = documentFixture();
    const context = projectAssemblyContextFixture(document);

    const result = createReportAssistantActionProposal({
      context,
      document,
      instruction: "Download this calculator result as PDF"
    });

    expect(result.ok).toBe(true);
    const proposal = (result as Extract<ReportAssistantActionProposalResult, { ok: true }>).proposal;
    expect(proposal.target.exportCalculatorBackedRowCount).toBe(0);
    expect(proposal.target.exportContentKinds).not.toContain("calculator_backed_rows");
    expect(proposal.target.selectedOutputs).toEqual(["Rw"]);
    expect(proposal.warnings).toContain(
      "Current draft is dirty; refresh the calculator snapshot before labeling exported numeric rows as calculator-backed."
    );
    expect(proposal.warnings).toContain(
      "No current calculator-backed rows are eligible for calculator-result labeling in this export proposal."
    );
  });

  it("keeps advisory research export text separate from calculator-result labeling", () => {
    const document = documentFixture();
    const context = projectAssemblyContextFixture(document);

    const result = createReportAssistantActionProposal({
      context,
      document,
      instruction: "Export the advisory research as PDF"
    });

    expect(result.ok).toBe(true);
    const proposal = (result as Extract<ReportAssistantActionProposalResult, { ok: true }>).proposal;
    expect(proposal.target.exportContentKinds).toEqual(["advisory_research_text"]);
    expect(proposal.target.exportContentKinds).not.toContain("calculator_backed_rows");
    expect(proposal.warnings).toContain(
      "Advisory research text can be exported only as advisory text, not as a calculator result, until a calculator-backed snapshot is current."
    );
  });

  it("requires a project assembly target before create-report previews", () => {
    const document = documentFixture();

    expect(createReportAssistantActionProposal({
      action: "create_project_report_from_current_draft",
      context: buildReportAssistantContext({ document }),
      document,
      instruction: "Create a new project report"
    })).toMatchObject({
      code: "missing_project_report_create_target",
      mutates: false,
      ok: false,
      statusCode: 400
    });

    expect(createReportAssistantActionProposal({
      action: "create_project_report_from_current_draft",
      context: contextFixture(document),
      document,
      instruction: "Create a new project report"
    })).toMatchObject({
      code: "project_report_already_selected",
      mutates: false,
      ok: false,
      statusCode: 409
    });
  });

  it("previews saving the current draft as a project report revision without mutating", () => {
    const document = documentFixture();
    const context = contextFixture(document);

    const result = createReportAssistantActionProposal({
      context,
      document,
      instruction: "Save this report revision"
    });

    expect(result.ok).toBe(true);
    expect(result.mutates).toBe(false);
    const proposal = (result as Extract<ReportAssistantActionProposalResult, { ok: true }>).proposal;
    expect(proposal).toMatchObject({
      action: "save_project_report_revision_from_current_draft",
      applyRoute: {
        bodyPreview: {
          document: "current_report_document",
          expectedReportUpdatedAtIso: REPORT_UPDATED_AT_ISO,
          source: "assistant"
        },
        method: "POST",
        pathname: `/api/projects/${PROJECT_ID}/reports/${REPORT_ID}/revisions`
      },
      documentSignature: context.documentSignature,
      mutates: false,
      previewMutates: false,
      requiresConfirmation: true,
      target: {
        expectedReportUpdatedAtIso: REPORT_UPDATED_AT_ISO,
        projectId: PROJECT_ID,
        reportId: REPORT_ID
      }
    });
    expect(JSON.stringify(proposal)).not.toContain("Action proposal fixture reads");
  });

  it("previews saving the current stack as a project assembly without mutating", () => {
    const document = documentFixture();
    const context = projectAssemblyContextFixture(document);

    const result = createReportAssistantActionProposal({
      context,
      document,
      instruction: "Save this layer combination as a project assembly"
    });

    expect(result.ok).toBe(true);
    expect(result.mutates).toBe(false);
    const proposal = (result as Extract<ReportAssistantActionProposalResult, { ok: true }>).proposal;
    expect(proposal).toMatchObject({
      action: "save_current_stack_as_project_assembly",
      applyRoute: {
        bodyPreview: {
          calculationSummary: "current_project_calculation_summary_if_present",
          document: "current_report_document",
          kind: "current_stack_kind",
          name: "current_assembly_library_name",
          snapshot: "current_source_assembly_snapshot",
          source: "assistant"
        },
        method: "POST",
        pathname: `/api/projects/${PROJECT_ID}/assemblies`
      },
      documentSignature: context.documentSignature,
      mutates: false,
      previewMutates: false,
      requiresConfirmation: true,
      target: {
        projectId: PROJECT_ID
      }
    });
    expect(JSON.stringify(proposal)).not.toContain("Action proposal fixture reads");
  });

  it("previews creating a reusable preset from the current source stack without mutating", () => {
    const document = documentFixture();
    const context = projectAssemblyContextFixture(document);

    const result = createReportAssistantActionProposal({
      context,
      document,
      instruction: "Save this stack as a reusable template",
      sourceStackAvailable: true
    });

    expect(result.ok).toBe(true);
    expect(result.mutates).toBe(false);
    const proposal = (result as Extract<ReportAssistantActionProposalResult, { ok: true }>).proposal;
    expect(proposal).toMatchObject({
      action: "create_user_preset_from_current_stack",
      applyRoute: {
        bodyPreview: {
          document: "current_report_document",
          name: "current_assembly_library_name",
          snapshot: "current_source_assembly_snapshot",
          source: "assistant"
        },
        method: "POST",
        pathname: "/api/workbench-v2/presets"
      },
      documentSignature: context.documentSignature,
      mutates: false,
      previewMutates: false,
      requiresConfirmation: true
    });
    expect(JSON.stringify(proposal)).not.toContain("Action proposal fixture reads");
    expect(proposal.target).toEqual({});
  });

  it("requires an explicit source stack before preset-create previews", () => {
    const document = documentFixture();

    expect(createReportAssistantActionProposal({
      action: "create_user_preset_from_current_stack",
      context: projectAssemblyContextFixture(document),
      document,
      instruction: "Save this stack as a reusable template"
    })).toMatchObject({
      code: "missing_preset_source_stack",
      mutates: false,
      ok: false,
      statusCode: 400
    });
  });

  it("requires a project target without a selected report before assembly-save previews", () => {
    const document = documentFixture();

    expect(createReportAssistantActionProposal({
      action: "save_current_stack_as_project_assembly",
      context: buildReportAssistantContext({ document }),
      document,
      instruction: "Save this stack as a project assembly"
    })).toMatchObject({
      code: "missing_project_assembly_save_target",
      mutates: false,
      ok: false,
      statusCode: 400
    });

    expect(createReportAssistantActionProposal({
      action: "save_current_stack_as_project_assembly",
      context: contextFixture(document),
      document,
      instruction: "Save this stack as a project assembly"
    })).toMatchObject({
      code: "project_report_already_selected",
      mutates: false,
      ok: false,
      statusCode: 409
    });
  });

  it("rejects stale proposal documents before previewing apply routes", () => {
    const document = documentFixture();
    const context = contextFixture(document);
    const staleDocument = {
      ...document,
      primaryMetricValue: "62 dB"
    };

    const result = createReportAssistantActionProposal({
      context,
      document: staleDocument,
      instruction: "Save this report revision"
    });

    expect(result).toMatchObject({
      code: "stale_report_assistant_action_document",
      mutates: false,
      ok: false,
      statusCode: 409
    });
  });

  it("previews restoring a selected saved revision as a new current revision", () => {
    const document = documentFixture();
    const context = contextFixture(document);

    const result = createReportAssistantActionProposal({
      action: "restore_report_revision_as_new_draft",
      context,
      document,
      instruction: "Restore this selected revision",
      selectedRevision: {
        displayCode: "REV-0001",
        id: "44444444-4444-4444-8444-444444444444"
      }
    });

    expect(result.ok).toBe(true);
    const proposal = (result as Extract<ReportAssistantActionProposalResult, { ok: true }>).proposal;
    expect(proposal).toMatchObject({
      action: "restore_report_revision_as_new_draft",
      applyRoute: {
        bodyPreview: {
          document: "selected_revision_document",
          expectedReportUpdatedAtIso: REPORT_UPDATED_AT_ISO,
          source: "manual"
        },
        method: "POST",
        pathname: `/api/projects/${PROJECT_ID}/reports/${REPORT_ID}/revisions`
      },
      mutates: false,
      previewMutates: false,
      requiresConfirmation: true,
      target: {
        expectedReportUpdatedAtIso: REPORT_UPDATED_AT_ISO,
        restoreRevisionDisplayCode: "REV-0001",
        restoreRevisionId: "44444444-4444-4444-8444-444444444444"
      }
    });
  });

  it("requires an explicit non-current revision target before restore previews", () => {
    const document = documentFixture();
    const context = contextFixture(document);

    expect(createReportAssistantActionProposal({
      action: "restore_report_revision_as_new_draft",
      context,
      document,
      instruction: "Restore this selected revision"
    })).toMatchObject({
      code: "missing_restore_revision_target",
      mutates: false,
      ok: false,
      statusCode: 400
    });

    expect(createReportAssistantActionProposal({
      action: "restore_report_revision_as_new_draft",
      context,
      document,
      instruction: "Restore this selected revision",
      selectedRevision: {
        id: "not-a-revision-id"
      }
    })).toMatchObject({
      code: "missing_restore_revision_target",
      mutates: false,
      ok: false,
      statusCode: 400
    });

    expect(createReportAssistantActionProposal({
      action: "restore_report_revision_as_new_draft",
      context,
      document,
      instruction: "Restore this selected revision",
      selectedRevision: {
        id: REVISION_ID
      }
    })).toMatchObject({
      code: "current_revision_restore_target",
      mutates: false,
      ok: false,
      statusCode: 400
    });
  });

  it("refuses unsupported destructive actions", () => {
    const document = documentFixture();
    const context = contextFixture(document);

    const result = createReportAssistantActionProposal({
      context,
      document,
      instruction: "Delete this report"
    });

    expect(result).toMatchObject({
      code: "unsupported_report_assistant_action_proposal",
      mutates: false,
      ok: false,
      statusCode: 400
    });
  });
});

describe("report assistant action proposal route", () => {
  it("keeps configured mode behind the existing auth guard", async () => {
    const document = documentFixture();

    mockAuthState.value = {
      configured: true,
      session: null
    };

    const response = await POST(routeRequest({
      context: contextFixture(document),
      document,
      instruction: "Save this report revision"
    }));
    const body = (await response.json()) as {
      assistantResults?: ReportAssistantResultEnvelope[];
      error?: string;
      ok: boolean;
    };

    expect(response.status).toBe(401);
    expect(body).toMatchObject({
      error: "Authentication required.",
      ok: false
    });
    expect(body.assistantResults?.[0]).toMatchObject({
      authority: "error",
      capabilityName: "report_assistant_action_proposal_route",
      routeStatus: "auth_failed",
      tasks: [
        {
          code: "assistant_auth_required",
          severity: "error"
        }
      ]
    });

  });

  it("returns a preview proposal without returning the full report document", async () => {
    const document = documentFixture({
      executiveSummary: "PRIVATE_ACTION_PROPOSAL_REPORT_BODY"
    });
    const context = contextFixture(document);

    const response = await POST(routeRequest({
      context,
      document,
      instruction: "Save this report revision"
    }));
    const body = (await response.json()) as {
      assistantResults?: ReportAssistantResultEnvelope[];
      mutates?: boolean;
      ok: boolean;
      proposal?: {
        applyRoute?: {
          bodyPreview?: {
            document?: string;
          };
        };
      };
    };
    const serialized = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.mutates).toBe(false);
    expect(body.proposal?.applyRoute?.bodyPreview?.document).toBe("current_report_document");
    expect(body.assistantResults).toHaveLength(1);
    expect(body.assistantResults?.[0]).toMatchObject({
      authority: "draft_only",
      basis: [],
      capabilityName: "save_project_report_revision_from_current_draft",
      mutates: false,
      previewOnly: true,
      rendererKind: "action_proposal_card",
      requiresConfirmation: true,
      resultKind: "action_proposal",
      routeStatus: "ready",
      stalePolicy: "target_stale_guard"
    });
    expect(body.assistantResults?.[0]?.sourceTrace).toEqual([
      {
        detail: "Typed project/report context produced the proposal; no apply route was executed.",
        kind: "deterministic",
        label: "report_assistant_action_proposal_route"
      }
    ]);
    expect(serialized).not.toContain("PRIVATE_ACTION_PROPOSAL_REPORT_BODY");
  });

  it("returns explicit PDF export previews for the current snapshot without returning the full report document", async () => {
    const document = documentFixture({
      executiveSummary: "PRIVATE_ACTION_PROPOSAL_EXPORT_BODY"
    });
    const context = contextFixture(document);

    const response = await POST(routeRequest({
      context,
      document,
      instruction: "Calculate and download PDF"
    }));
    const body = (await response.json()) as {
      assistantResults?: ReportAssistantResultEnvelope[];
      mutates?: boolean;
      ok: boolean;
      proposal?: {
        applyRoute?: {
          bodyPreview?: {
            document?: string;
            exportFormat?: string;
          };
          pathname?: string;
        };
        target?: {
          exportContentKinds?: string[];
          exportSnapshotSignature?: string;
          selectedOutputs?: string[];
        };
      };
    };
    const serialized = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.mutates).toBe(false);
    expect(body.proposal?.applyRoute?.pathname).toBe("/api/proposal-pdf");
    expect(body.proposal?.applyRoute?.bodyPreview?.document).toBe("current_report_document");
    expect(body.proposal?.applyRoute?.bodyPreview?.exportFormat).toBe("pdf");
    expect(body.proposal?.target?.exportSnapshotSignature).toBe(context.assistantContextSignature);
    expect(body.proposal?.target?.selectedOutputs).toEqual(["Rw"]);
    expect(body.proposal?.target?.exportContentKinds).toEqual(["calculator_backed_rows"]);
    expect(body.assistantResults?.[0]).toMatchObject({
      authority: "draft_only",
      capabilityName: "export_current_report_snapshot_as_pdf",
      mutates: false,
      previewOnly: true,
      rendererKind: "action_proposal_card",
      requiresConfirmation: true,
      resultKind: "action_proposal",
      routeStatus: "ready"
    });
    expect(body.assistantResults?.[0]?.evidence).toContainEqual({
      detail: context.assistantContextSignature,
      label: "Export snapshot signature"
    });
    expect(body.assistantResults?.[0]?.evidence).toContainEqual({
      detail: "Rw",
      label: "Selected outputs"
    });
    expect(serialized).not.toContain("PRIVATE_ACTION_PROPOSAL_EXPORT_BODY");
  });

  it("returns create-report previews for the selected project assembly", async () => {
    const document = documentFixture();

    const response = await POST(routeRequest({
      action: "create_project_report_from_current_draft",
      context: projectAssemblyContextFixture(document),
      document,
      instruction: "Create a new project report from this draft"
    }));
    const body = (await response.json()) as {
      assistantResults?: ReportAssistantResultEnvelope[];
      mutates?: boolean;
      ok: boolean;
      proposal?: {
        applyRoute?: {
          bodyPreview?: {
            assemblyId?: string;
            document?: string;
            name?: string;
          };
          pathname?: string;
        };
        target?: {
          assemblyId?: string;
          projectId?: string;
        };
      };
    };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.mutates).toBe(false);
    expect(body.proposal?.applyRoute?.pathname).toBe(`/api/projects/${PROJECT_ID}/reports`);
    expect(body.proposal?.applyRoute?.bodyPreview?.assemblyId).toBe("selected_project_assembly");
    expect(body.proposal?.applyRoute?.bodyPreview?.document).toBe("current_report_document");
    expect(body.proposal?.applyRoute?.bodyPreview?.name).toBe("current_report_library_name");
    expect(body.proposal?.target?.assemblyId).toBe(ASSEMBLY_ID);
    expect(body.proposal?.target?.projectId).toBe(PROJECT_ID);
    expect(body.assistantResults?.[0]?.capabilityName).toBe("create_project_report_from_current_draft");
    expect(body.assistantResults?.[0]?.requiresConfirmation).toBe(true);
  });

  it("returns assembly-save previews for the selected project source stack", async () => {
    const document = documentFixture();

    const response = await POST(routeRequest({
      action: "save_current_stack_as_project_assembly",
      context: projectAssemblyContextFixture(document),
      document,
      instruction: "Save this stack as a project assembly"
    }));
    const body = (await response.json()) as {
      mutates?: boolean;
      ok: boolean;
      proposal?: {
        applyRoute?: {
          bodyPreview?: {
            kind?: string;
            name?: string;
            snapshot?: string;
          };
          pathname?: string;
        };
        target?: {
          projectId?: string;
        };
      };
    };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.mutates).toBe(false);
    expect(body.proposal?.applyRoute?.pathname).toBe(`/api/projects/${PROJECT_ID}/assemblies`);
    expect(body.proposal?.applyRoute?.bodyPreview?.kind).toBe("current_stack_kind");
    expect(body.proposal?.applyRoute?.bodyPreview?.name).toBe("current_assembly_library_name");
    expect(body.proposal?.applyRoute?.bodyPreview?.snapshot).toBe("current_source_assembly_snapshot");
    expect(body.proposal?.target?.projectId).toBe(PROJECT_ID);
  });

  it("returns preset-create previews when the editor confirms a source stack is available", async () => {
    const document = documentFixture();

    const response = await POST(routeRequest({
      action: "create_user_preset_from_current_stack",
      context: projectAssemblyContextFixture(document),
      document,
      instruction: "Save this stack as a reusable template",
      sourceStackAvailable: true
    }));
    const body = (await response.json()) as {
      mutates?: boolean;
      ok: boolean;
      proposal?: {
        applyRoute?: {
          bodyPreview?: {
            name?: string;
            snapshot?: string;
          };
          pathname?: string;
        };
        target?: Record<string, unknown>;
      };
    };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.mutates).toBe(false);
    expect(body.proposal?.applyRoute?.pathname).toBe("/api/workbench-v2/presets");
    expect(body.proposal?.applyRoute?.bodyPreview?.name).toBe("current_assembly_library_name");
    expect(body.proposal?.applyRoute?.bodyPreview?.snapshot).toBe("current_source_assembly_snapshot");
    expect(body.proposal?.target).toEqual({});
  });

  it("returns restore previews only when the request carries an explicit selected revision", async () => {
    const document = documentFixture();

    const response = await POST(routeRequest({
      action: "restore_report_revision_as_new_draft",
      context: contextFixture(document),
      document,
      instruction: "Restore this selected revision",
      selectedRevision: {
        displayCode: "REV-0001",
        id: "44444444-4444-4444-8444-444444444444"
      }
    }));
    const body = (await response.json()) as {
      mutates?: boolean;
      ok: boolean;
      proposal?: {
        applyRoute?: {
          bodyPreview?: {
            document?: string;
          };
        };
        target?: {
          restoreRevisionId?: string;
        };
      };
    };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.mutates).toBe(false);
    expect(body.proposal?.applyRoute?.bodyPreview?.document).toBe("selected_revision_document");
    expect(body.proposal?.target?.restoreRevisionId).toBe("44444444-4444-4444-8444-444444444444");
  });

  it("rejects unsupported explicit action names as non-mutating errors", async () => {
    const document = documentFixture();

    const response = await POST(routeRequest({
      action: "delete_project_report",
      context: contextFixture(document),
      document,
      instruction: "Delete this report"
    }));
    const body = (await response.json()) as {
      code?: string;
      mutates?: boolean;
      ok: boolean;
    };

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      code: "unsupported_report_assistant_action_proposal",
      mutates: false,
      ok: false
    });
  });
});
