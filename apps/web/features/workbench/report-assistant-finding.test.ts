import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  appendReportAssistantFindingRecord,
  prepareReportAssistantFindingRecord,
  readReportAssistantFindingRecords
} from "./report-assistant-finding";
import {
  buildReportAssistantContext,
  getReportAssistantMetricBasis,
  getReportAssistantMetricDirection,
  getReportAssistantMetricId
} from "./report-assistant-context";
import type { ReportAssistantContext } from "./report-assistant-context";
import type { SimpleWorkbenchProposalDocument } from "./simple-workbench-proposal";

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
  getAuthState: vi.fn(async () => mockAuthState.value)
}));

const RW_METRIC_ID = getReportAssistantMetricId("Rw");
let originalQueuePath: string | undefined;
let tempDirs: string[] = [];

function metadata() {
  return {
    engineDisplayValue: "61 dB",
    metricBasis: getReportAssistantMetricBasis("Rw"),
    metricDirection: getReportAssistantMetricDirection("Rw"),
    outputId: "Rw" as const,
    reportMetricId: RW_METRIC_ID
  };
}

const DOCUMENT: SimpleWorkbenchProposalDocument = {
  assemblyHeadline: "Rw 61 dB is packaged.",
  assumptionItems: [],
  approverTitle: "Lead Acoustic Consultant",
  briefNote: "Manual issue snapshot.",
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
      value: "59 dB",
      ...metadata()
    }
  ],
  decisionTrailHeadline: "Scoped estimate is active.",
  decisionTrailItems: [],
  dynamicBranchDetail: "Published family estimate is active.",
  dynamicBranchLabel: "Heavy floating floor",
  executiveSummary: "Riverside Residences currently reads Rw 59 dB.",
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
      value: "59 dB",
      ...metadata()
    }
  ],
  preparedBy: "O. Tuna",
  primaryMetricLabel: "Rw",
  primaryMetricValue: "59 dB",
  projectName: "Riverside Residences",
  proposalAttention: "Design Coordination Team",
  proposalIssuePurpose: "Client review and acoustic coordination",
  proposalRecipient: "Riverside Development Team",
  proposalReference: "MAC-2026-014",
  proposalRevision: "Rev 01",
  proposalSubject: "Riverside Residences floor acoustic proposal",
  proposalValidityNote: "Valid for 30 calendar days unless superseded by a later issue.",
  recommendationItems: [],
  reportProfile: "consultant",
  reportProfileLabel: "Consultant issue",
  serverProjectId: "project-1",
  serverProjectScenarioId: "scenario-1",
  studyContextLabel: "Pre-tender",
  studyModeLabel: "Floor",
  validationDetail: "Read this as a supported floor estimate.",
  validationLabel: "Scoped estimate",
  warnings: ["Manual report override is active."]
};

async function makeTempQueuePath() {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "dynecho-report-assistant-findings-"));
  tempDirs.push(tempDir);
  return path.join(tempDir, "findings.jsonl");
}

function buildContext(): ReportAssistantContext {
  return {
    ...buildReportAssistantContext({
      baseDocument: {
        ...DOCUMENT,
        coverageItems: DOCUMENT.coverageItems.map((item) => ({ ...item, value: "61 dB" })),
        metrics: DOCUMENT.metrics.map((metric) => ({ ...metric, value: "61 dB" })),
        primaryMetricValue: "61 dB"
      },
      createdAtIso: "2026-06-02T09:00:00.000Z",
      document: DOCUMENT,
      reportId: "finding-test"
    }),
    traceSummary: {
      basis: "predictor_gate",
      dynamicAirborneFamily: "heavy floor",
      dynamicImpactFamily: "reinforced concrete",
      missingPhysicalInputs: ["fieldKDb"],
      route: "floor",
      selectedCandidateId: "candidate.rw.test",
      selectedOrigin: "source_absent_predictor",
      unsupportedOutputs: [],
      warnings: DOCUMENT.warnings
    }
  };
}

function jsonRequest(payload: unknown) {
  return new Request("http://localhost/api/report-assistant/findings", {
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
  });
}

beforeEach(async () => {
  originalQueuePath = process.env.DYNECHO_REPORT_ASSISTANT_FINDINGS_PATH;
  process.env.DYNECHO_REPORT_ASSISTANT_FINDINGS_PATH = await makeTempQueuePath();
});

afterEach(async () => {
  if (originalQueuePath === undefined) {
    delete process.env.DYNECHO_REPORT_ASSISTANT_FINDINGS_PATH;
  } else {
    process.env.DYNECHO_REPORT_ASSISTANT_FINDINGS_PATH = originalQueuePath;
  }
  mockAuthState.value = {
    configured: false,
    missingKeys: [],
    session: {
      expiresAt: Number.MAX_SAFE_INTEGER,
      username: "Preview mode"
    }
  };
  await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })));
  tempDirs = [];
});

describe("report assistant review findings", () => {
  it("prepares and appends auditable records from the current report context", async () => {
    const context = buildContext();
    const prepared = prepareReportAssistantFindingRecord({
      context,
      draft: {
        metricId: RW_METRIC_ID,
        reason: "Rw looks too optimistic after manual report manipulation.",
        severity: "medium",
        sources: [
          {
            title: "Example acoustic reference",
            url: "https://example.com/acoustic-reference"
          }
        ],
        userInstruction: "Check this Rw later.",
        verdict: "suspicious"
      },
      idFactory: () => "finding-test-id",
      now: () => new Date("2026-06-02T09:30:00.000Z")
    });

    expect(prepared).toMatchObject({
      ok: true,
      record: {
        engineDisplayValue: "61 dB",
        id: "finding-test-id",
        metric: "Rw",
        metricId: RW_METRIC_ID,
        projectId: "project-1",
        reason: "Rw looks too optimistic after manual report manipulation.",
        reportDisplayValue: "59 dB",
        scenarioId: "scenario-1",
        source: "report_assistant",
        traceSummary: {
          selectedCandidateId: "candidate.rw.test",
          selectedOrigin: "source_absent_predictor"
        }
      }
    });

    if (prepared.ok) {
      await appendReportAssistantFindingRecord(prepared.record);
    }

    expect(await readReportAssistantFindingRecords()).toEqual([prepared.ok ? prepared.record : null]);
  });

  it("requires explicit confirmation before the API route writes JSONL", async () => {
    const { POST } = await import("../../app/api/report-assistant/findings/route");
    const context = buildContext();
    const finding = {
      metricId: RW_METRIC_ID,
      reason: "Rw should be reviewed.",
      severity: "medium",
      sources: [],
      verdict: "suspicious"
    };

    const rejected = await POST(jsonRequest({ context, finding }));
    expect(rejected.status).toBe(400);
    expect(await readReportAssistantFindingRecords()).toEqual([]);

    const accepted = await POST(jsonRequest({ confirmed: true, context, finding }));
    const payload = (await accepted.json()) as {
      ok: boolean;
      queuePath: string;
      record: {
        metricId: string;
        projectId?: string;
        traceSummary: {
          selectedCandidateId?: string;
        };
      };
    };

    expect(accepted.status).toBe(201);
    expect(payload).toMatchObject({
      ok: true,
      queuePath: ".dynecho/calculator-review-queue/report-assistant-findings.jsonl",
      record: {
        metricId: RW_METRIC_ID,
        projectId: "project-1",
        traceSummary: {
          selectedCandidateId: "candidate.rw.test"
        }
      }
    });
    expect((await readReportAssistantFindingRecords())[0]).toMatchObject({
      metricId: RW_METRIC_ID,
      reportDisplayValue: "59 dB"
    });
  });
});
