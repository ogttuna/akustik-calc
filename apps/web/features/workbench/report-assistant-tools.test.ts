import { describe, expect, it } from "vitest";

import {
  buildReportAssistantContext,
  getReportAssistantMetricBasis,
  getReportAssistantMetricDirection,
  getReportAssistantMetricId
} from "./report-assistant-context";
import {
  REPORT_ASSISTANT_MCP_TOOL_DEFINITIONS,
  resolveReportAssistantMetricReference,
  runReportAssistantTool
} from "./report-assistant-tools";
import type { SimpleWorkbenchProposalDocument } from "./simple-workbench-proposal";

const DN_METRIC_ID = getReportAssistantMetricId("Dn,w");
const DNT_METRIC_ID = getReportAssistantMetricId("DnT,w");
const RW_METRIC_ID = getReportAssistantMetricId("Rw");

function metadata(outputId: "Dn,w" | "DnT,w" | "Rw") {
  return {
    engineDisplayValue: outputId === "Rw" ? "61 dB" : outputId === "Dn,w" ? "49 dB" : "52 dB",
    metricBasis: getReportAssistantMetricBasis(outputId, { contextLabel: "Building prediction" }),
    metricDirection: getReportAssistantMetricDirection(outputId),
    outputId,
    reportMetricId: getReportAssistantMetricId(outputId)
  };
}

const DOCUMENT: SimpleWorkbenchProposalDocument = {
  assemblyHeadline: "Rw 61 dB, Dn,w 49 dB, and DnT,w 52 dB are packaged.",
  assumptionItems: [],
  approverTitle: "Lead Acoustic Consultant",
  briefNote: "Manual issue snapshot with 61 dB repeated.",
  citations: [],
  clientName: "Machinity Acoustics",
  consultantAddress: "Maslak District, Istanbul, Turkiye",
  consultantCompany: "Machinity Acoustic Consultants",
  consultantEmail: "offers@machinity-acoustics.com",
  consultantLogoDataUrl: "",
  consultantPhone: "+90 212 000 00 00",
  consultantWordmarkLine: "Building Acoustics and Vibration Control",
  contextLabel: "Building prediction",
  corridorDossierCards: [],
  corridorDossierHeadline: "Validation corridor packaged.",
  coverageItems: [
    {
      detail: "Weighted airborne element rating.",
      label: "Rw",
      postureDetail: "Benchmark-backed estimate.",
      postureLabel: "Benchmark-backed estimate",
      postureTone: "accent",
      status: "live",
      value: "61 dB",
      ...metadata("Rw")
    },
    {
      detail: "Field airborne normalized level difference.",
      label: "Dn,w",
      postureDetail: "Field continuation.",
      postureLabel: "Field continuation",
      postureTone: "success",
      status: "live",
      value: "49 dB",
      ...metadata("Dn,w")
    },
    {
      detail: "Standardized field airborne level difference.",
      label: "DnT,w",
      postureDetail: "Field continuation.",
      postureLabel: "Field continuation",
      postureTone: "success",
      status: "live",
      value: "52 dB",
      ...metadata("DnT,w")
    }
  ],
  decisionTrailHeadline: "Scoped estimate is active.",
  decisionTrailItems: [],
  dynamicBranchDetail: "Published family estimate is active.",
  dynamicBranchLabel: "Framed wall",
  executiveSummary: "Riverside Residences currently reads Rw 61 dB.",
  issuedOnIso: "2026-03-21T09:30:00.000Z",
  issuedOnLabel: "21 March 2026",
  issueBaseReference: "MAC-RR-20260321",
  issueCodePrefix: "MAC",
  issueNextReference: "MAC-RR-20260321-03",
  issueRegisterItems: [],
  layers: [
    {
      categoryLabel: "Structure",
      densityLabel: "2400 kg/m3",
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
      value: "61 dB",
      ...metadata("Rw")
    },
    {
      detail: "Field airborne normalized level difference.",
      label: "Dn,w",
      value: "49 dB",
      ...metadata("Dn,w")
    },
    {
      detail: "Standardized field airborne level difference.",
      label: "DnT,w",
      value: "52 dB",
      ...metadata("DnT,w")
    }
  ],
  preparedBy: "O. Tuna",
  primaryMetricLabel: "Rw",
  primaryMetricValue: "61 dB",
  projectName: "Riverside Residences",
  proposalAttention: "Design Coordination Team",
  proposalIssuePurpose: "Client review and acoustic coordination",
  proposalRecipient: "Riverside Development Team",
  proposalReference: "MAC-2026-014",
  proposalRevision: "Rev 01",
  proposalSubject: "Riverside Residences acoustic proposal",
  proposalValidityNote: "Valid for 30 calendar days unless superseded by a later issue.",
  recommendationItems: [],
  reportProfile: "consultant",
  reportProfileLabel: "Consultant issue",
  serverProjectId: "project-1",
  serverProjectScenarioId: "scenario-1",
  studyContextLabel: "Pre-tender",
  studyModeLabel: "Wall",
  validationDetail: "Read this as a supported wall estimate.",
  validationLabel: "Scoped estimate",
  warnings: []
};

function context() {
  return {
    ...buildReportAssistantContext({
      createdAtIso: "2026-06-02T09:00:00.000Z",
      document: DOCUMENT,
      reportId: "tool-test"
    }),
    traceSummary: {
      basis: "predictor_gate",
      dynamicAirborneFamily: "framed wall",
      missingPhysicalInputs: [],
      route: "wall" as const,
      selectedCandidateId: "candidate.rw.test",
      selectedOrigin: "source_absent_predictor",
      unsupportedOutputs: [],
      warnings: []
    }
  };
}

describe("report assistant MCP-compatible tool adapter", () => {
  it("declares only read-only or proposal-only tools", () => {
    expect(REPORT_ASSISTANT_MCP_TOOL_DEFINITIONS.every((tool) => tool.mutates === false)).toBe(true);
    expect(REPORT_ASSISTANT_MCP_TOOL_DEFINITIONS.map((tool) => tool.name)).toEqual([
      "resolve_report_metric_reference",
      "preview_report_patch",
      "find_report_value_mentions",
      "research_acoustic_reference",
      "prepare_calculator_finding"
    ]);
    expect(REPORT_ASSISTANT_MCP_TOOL_DEFINITIONS.map((tool) => tool.name)).not.toContain("apply_report_patch");
  });

  it("resolves clear metric phrases and reports ambiguous shorthand without guessing", () => {
    expect(resolveReportAssistantMetricReference({ context: context(), phrase: "Rw" })).toMatchObject({
      matches: [
        {
          id: RW_METRIC_ID
        }
      ],
      status: "resolved"
    });
    expect(resolveReportAssistantMetricReference({ context: context(), phrase: "dn" })).toMatchObject({
      matches: [
        {
          id: DN_METRIC_ID
        },
        {
          id: DNT_METRIC_ID
        }
      ],
      status: "ambiguous"
    });
  });

  it("previews report patches and finds stale value mentions without applying changes", async () => {
    const patch = {
      documentSignature: context().documentSignature,
      operations: [
        {
          displayValue: "58 dB",
          metricId: RW_METRIC_ID,
          reason: "MCP preview only.",
          type: "set_metric_display_value" as const
        }
      ],
      summary: "Preview Rw report movement."
    };
    const preview = await runReportAssistantTool({
      context: context(),
      document: DOCUMENT,
      name: "preview_report_patch",
      patch
    });
    const mentions = await runReportAssistantTool({
      context: context(),
      document: DOCUMENT,
      name: "find_report_value_mentions",
      patch
    });

    expect(preview).toMatchObject({
      mutates: false,
      ok: true,
      validation: {
        status: "valid"
      }
    });
    expect(mentions).toMatchObject({
      mutates: false,
      ok: true
    });
    expect(mentions).toEqual(expect.objectContaining({
      mentions: expect.arrayContaining([
        expect.objectContaining({
          label: "Rw",
          metricId: RW_METRIC_ID,
          path: "assemblyHeadline"
        }),
        expect.objectContaining({
          label: "Rw",
          metricId: RW_METRIC_ID,
          path: "executiveSummary"
        }),
        expect.objectContaining({
          label: "Rw",
          metricId: RW_METRIC_ID,
          path: "briefNote"
        })
      ])
    }));
    expect(DOCUMENT.primaryMetricValue).toBe("61 dB");
  });

  it("prepares finding records and plausibility reviews without writing or mutating", async () => {
    const prepared = await runReportAssistantTool(
      {
        context: context(),
        finding: {
          metricId: RW_METRIC_ID,
          reason: "Rw should be reviewed later.",
          severity: "medium",
          sources: [],
          verdict: "suspicious"
        },
        name: "prepare_calculator_finding"
      },
      {
        idFactory: () => "tool-finding-id",
        now: () => new Date("2026-06-02T09:30:00.000Z")
      }
    );
    const review = await runReportAssistantTool({
      context: context(),
      name: "research_acoustic_reference",
      review: {
        metricId: RW_METRIC_ID,
        research: true
      },
      settings: null
    });

    expect(prepared).toMatchObject({
      mutates: false,
      ok: true,
      record: {
        id: "tool-finding-id",
        metricId: RW_METRIC_ID,
        projectId: "project-1"
      }
    });
    expect(review).toMatchObject({
      mutates: false,
      ok: true,
      source: "context"
    });
    expect(DOCUMENT.primaryMetricValue).toBe("61 dB");
  });
});
