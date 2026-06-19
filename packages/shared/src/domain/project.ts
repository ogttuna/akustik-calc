import { z } from "zod";

export const StudyContextSchema = z.enum(["concept", "coordination", "pre_tender"]);
export const ReportProfileSchema = z.enum(["developer", "consultant", "lab_ready"]);

export const STUDY_CONTEXT_IDS = StudyContextSchema.options;
export const REPORT_PROFILE_IDS = ReportProfileSchema.options;

export type StudyContext = z.infer<typeof StudyContextSchema>;
export type ReportProfile = z.infer<typeof ReportProfileSchema>;

export const SERVER_PROJECT_SCHEMA_VERSION = 1;
export const SERVER_PROJECT_CALCULATOR_SNAPSHOT_SCHEMA_VERSION = 1;

export type JsonValue =
  | boolean
  | null
  | number
  | string
  | JsonValue[]
  | {
      [key: string]: JsonValue;
    };

export const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([z.string(), z.number().finite(), z.boolean(), z.null(), z.array(JsonValueSchema), z.record(JsonValueSchema)])
);

function optionalTrimmedString(maxLength: number) {
  return z.preprocess(
    (value) => (typeof value === "string" && value.trim().length === 0 ? undefined : value),
    z.string().trim().max(maxLength).optional()
  );
}

const ProjectNameSchema = z.string().trim().min(1).max(160);
const ProjectOwnerIdSchema = z.string().trim().min(1).max(128);
const ProjectOwnerLabelSchema = z.string().trim().min(1).max(160);
const ProjectOptionalTextSchema = optionalTrimmedString(320);
const ProjectDisplayCodeSchema = optionalTrimmedString(48);

export const ServerProjectScenarioSourceSchema = z.enum(["browser_local_import", "server_created"]);
export const ServerProjectProposalOutputFormatSchema = z.enum(["pdf", "docx", "html", "markdown"]);
export const ServerProjectAccessRoleSchema = z.enum(["owner", "editor", "reviewer", "viewer"]);
export const ServerProjectAccessActionSchema = z.enum([
  "create_project",
  "list_projects",
  "read_project",
  "import_local_scenarios",
  "append_proposal_audit",
  "save_project_assembly",
  "delete_project_assembly",
  "save_project_report",
  "delete_project_report",
  "manage_project_materials",
  "manage_members"
]);

export const SERVER_PROJECT_ACCESS_ROLES = ServerProjectAccessRoleSchema.options;
export const SERVER_PROJECT_ACCESS_ACTIONS = ServerProjectAccessActionSchema.options;

export const ServerProjectCalculatorSnapshotSchema = z
  .object({
    payload: JsonValueSchema,
    schemaVersion: z.literal(SERVER_PROJECT_CALCULATOR_SNAPSHOT_SCHEMA_VERSION)
  })
  .strict();

export const ServerProjectScenarioSnapshotSchema = z
  .object({
    calculatorInput: ServerProjectCalculatorSnapshotSchema,
    calculatorOutput: ServerProjectCalculatorSnapshotSchema.nullable(),
    capturedAtIso: z.string().datetime(),
    checksumSha256: z.string().regex(/^[a-f0-9]{64}$/u),
    id: z.string().uuid(),
    importedLocalScenarioId: optionalTrimmedString(120),
    name: ProjectNameSchema,
    projectId: z.string().uuid(),
    savedAtIso: z.string().datetime(),
    source: ServerProjectScenarioSourceSchema,
    version: z.number().int().positive()
  })
  .strict();

export const ServerProjectProposalAuditEventSchema = z
  .object({
    createdAtIso: z.string().datetime(),
    format: ServerProjectProposalOutputFormatSchema,
    id: z.string().uuid(),
    projectId: z.string().uuid(),
    scenarioIds: z.array(z.string().uuid()).max(64),
    source: z.enum(["proposal_route", "manual_import"]),
    style: optionalTrimmedString(80)
  })
  .strict();

export const ServerProjectAssemblyKindSchema = z.enum(["floor", "wall"]);
export const ServerProjectAssemblySourceSchema = z.enum(["workbench_v2", "legacy_import"]);
export const ServerProjectChildStatusSchema = z.enum(["ready", "needs_input", "unsupported", "error"]);
export const ServerProjectReportStatusSchema = z.enum(["draft", "issued", "archived"]);
export const ServerProjectReportRevisionSourceSchema = z.enum(["generated", "manual", "assistant", "import"]);

export const ServerProjectAssemblyCalculationSummarySchema = z
  .object({
    primaryOutput: optionalTrimmedString(80),
    primaryValueLabel: optionalTrimmedString(80),
    selectedOutputs: z.array(z.string().trim().min(1).max(80)).max(32),
    status: ServerProjectChildStatusSchema
  })
  .strict();

export const ServerProjectAssemblyRecordSchema = z
  .object({
    calculationSummary: ServerProjectAssemblyCalculationSummarySchema.optional(),
    createdAtIso: z.string().datetime(),
    description: ProjectOptionalTextSchema,
    displayCode: ProjectDisplayCodeSchema,
    id: z.string().uuid(),
    kind: ServerProjectAssemblyKindSchema,
    name: ProjectNameSchema,
    projectId: z.string().uuid(),
    snapshot: JsonValueSchema,
    source: ServerProjectAssemblySourceSchema,
    updatedAtIso: z.string().datetime(),
    version: z.number().int().positive()
  })
  .strict();

export const ServerProjectReportSourceMaterialSnapshotSchema = z
  .object({
    customMaterials: z.array(JsonValueSchema).max(256),
    materialVisualOverrides: z.array(JsonValueSchema).max(256)
  })
  .strict();

export const ServerProjectReportAssistantPatchSummarySchema = z
  .object({
    appliedAtIso: z.string().datetime(),
    instruction: optionalTrimmedString(500),
    operationCount: z.number().int().nonnegative().max(200),
    validationStatus: z.enum(["valid", "warning"])
  })
  .strict();

export const ServerProjectReportRevisionRecordSchema = z
  .object({
    assistantPatchSummary: ServerProjectReportAssistantPatchSummarySchema.optional(),
    changeSummary: optionalTrimmedString(500),
    createdAtIso: z.string().datetime(),
    createdByLabel: optionalTrimmedString(160),
    displayCode: ProjectDisplayCodeSchema,
    document: JsonValueSchema,
    id: z.string().uuid(),
    projectId: z.string().uuid(),
    reportId: z.string().uuid(),
    source: ServerProjectReportRevisionSourceSchema,
    sourceAssemblyId: z.string().uuid(),
    sourceAssemblyVersion: z.number().int().positive()
  })
  .strict();

export const ServerProjectReportRecordSchema = z
  .object({
    assemblyId: z.string().uuid(),
    createdAtIso: z.string().datetime(),
    currentRevisionId: z.string().uuid(),
    description: ProjectOptionalTextSchema,
    displayCode: ProjectDisplayCodeSchema,
    id: z.string().uuid(),
    name: ProjectNameSchema,
    projectId: z.string().uuid(),
    reportDocument: JsonValueSchema,
    revisions: z.array(ServerProjectReportRevisionRecordSchema).max(100),
    sourceAssemblySnapshot: JsonValueSchema,
    sourceAssemblyVersion: z.number().int().positive(),
    sourceCalculationOutput: JsonValueSchema.optional(),
    sourceMaterialSnapshot: ServerProjectReportSourceMaterialSnapshotSchema,
    status: ServerProjectReportStatusSchema,
    updatedAtIso: z.string().datetime()
  })
  .strict();

export const ServerProjectRecordSchema = z
  .object({
    assemblies: z.array(ServerProjectAssemblyRecordSchema).default([]),
    clientName: optionalTrimmedString(160),
    createdAtIso: z.string().datetime(),
    description: ProjectOptionalTextSchema,
    id: z.string().uuid(),
    name: ProjectNameSchema,
    ownerId: ProjectOwnerIdSchema,
    ownerLabel: ProjectOwnerLabelSchema,
    proposalAuditEvents: z.array(ServerProjectProposalAuditEventSchema),
    reports: z.array(ServerProjectReportRecordSchema).default([]),
    scenarioSnapshots: z.array(ServerProjectScenarioSnapshotSchema),
    schemaVersion: z.literal(SERVER_PROJECT_SCHEMA_VERSION),
    teamId: optionalTrimmedString(128),
    updatedAtIso: z.string().datetime()
  })
  .strict();

export const ServerProjectCreateRequestSchema = z
  .object({
    clientName: optionalTrimmedString(160),
    description: ProjectOptionalTextSchema,
    name: ProjectNameSchema,
    teamId: optionalTrimmedString(128)
  })
  .strict();

export const ServerProjectLocalScenarioImportSchema = z
  .object({
    inputSnapshot: JsonValueSchema,
    localScenarioId: optionalTrimmedString(120),
    name: optionalTrimmedString(160),
    outputSnapshot: JsonValueSchema.nullable().optional(),
    savedAtIso: z.string().datetime().optional()
  })
  .strict();

export const ServerProjectImportLocalRequestSchema = z
  .object({
    clientName: optionalTrimmedString(160),
    projectName: optionalTrimmedString(160),
    scenarios: z.array(ServerProjectLocalScenarioImportSchema).min(1).max(8)
  })
  .strict();

export const ServerProjectCreateAssemblyRequestSchema = z
  .object({
    calculationSummary: ServerProjectAssemblyCalculationSummarySchema.optional(),
    description: ProjectOptionalTextSchema,
    kind: ServerProjectAssemblyKindSchema,
    name: ProjectNameSchema,
    snapshot: JsonValueSchema
  })
  .strict();

export const ServerProjectUpdateAssemblyRequestSchema = z
  .object({
    calculationSummary: ServerProjectAssemblyCalculationSummarySchema.optional(),
    description: ProjectOptionalTextSchema,
    kind: ServerProjectAssemblyKindSchema.optional(),
    snapshot: JsonValueSchema.optional(),
    name: ProjectNameSchema.optional()
  })
  .strict()
  .refine(
    (value) =>
      value.name !== undefined ||
      value.description !== undefined ||
      value.kind !== undefined ||
      value.snapshot !== undefined ||
      value.calculationSummary !== undefined,
    {
      message: "At least one assembly field must be provided."
    }
  );

export const ServerProjectDuplicateAssemblyRequestSchema = z
  .object({
    name: ProjectNameSchema.optional()
  })
  .strict();

export const ServerProjectCreateReportRequestSchema = z
  .object({
    assemblyId: z.string().uuid(),
    description: ProjectOptionalTextSchema,
    name: ProjectNameSchema,
    reportDocument: JsonValueSchema,
    sourceAssemblySnapshot: JsonValueSchema,
    sourceCalculationOutput: JsonValueSchema.optional(),
    sourceMaterialSnapshot: ServerProjectReportSourceMaterialSnapshotSchema
  })
  .strict();

export const ServerProjectUpdateReportRequestSchema = z
  .object({
    description: ProjectOptionalTextSchema,
    expectedReportUpdatedAtIso: z.string().datetime().optional(),
    name: ProjectNameSchema.optional(),
    status: ServerProjectReportStatusSchema.optional()
  })
  .strict()
  .refine((value) => value.name !== undefined || value.description !== undefined || value.status !== undefined, {
    message: "At least one report field must be provided."
  });

export const ServerProjectDuplicateReportRequestSchema = z
  .object({
    name: ProjectNameSchema.optional()
  })
  .strict();

export const ServerProjectCreateReportRevisionRequestSchema = z
  .object({
    assistantPatchSummary: ServerProjectReportAssistantPatchSummarySchema.optional(),
    changeSummary: optionalTrimmedString(500),
    document: JsonValueSchema,
    expectedReportUpdatedAtIso: z.string().datetime().optional(),
    source: ServerProjectReportRevisionSourceSchema
  })
  .strict();

export type ServerProjectAssemblyRecord = z.infer<typeof ServerProjectAssemblyRecordSchema>;
export type ServerProjectCreateAssemblyRequest = z.infer<typeof ServerProjectCreateAssemblyRequestSchema>;
export type ServerProjectDuplicateAssemblyRequest = z.infer<typeof ServerProjectDuplicateAssemblyRequestSchema>;
export type ServerProjectUpdateAssemblyRequest = z.infer<typeof ServerProjectUpdateAssemblyRequestSchema>;
export type ServerProjectCreateRequest = z.infer<typeof ServerProjectCreateRequestSchema>;
export type ServerProjectAccessAction = z.infer<typeof ServerProjectAccessActionSchema>;
export type ServerProjectAccessRole = z.infer<typeof ServerProjectAccessRoleSchema>;
export type ServerProjectDuplicateReportRequest = z.infer<typeof ServerProjectDuplicateReportRequestSchema>;
export type ServerProjectCreateReportRequest = z.infer<typeof ServerProjectCreateReportRequestSchema>;
export type ServerProjectCreateReportRevisionRequest = z.infer<typeof ServerProjectCreateReportRevisionRequestSchema>;
export type ServerProjectImportLocalRequest = z.infer<typeof ServerProjectImportLocalRequestSchema>;
export type ServerProjectLocalScenarioImport = z.infer<typeof ServerProjectLocalScenarioImportSchema>;
export type ServerProjectProposalAuditEvent = z.infer<typeof ServerProjectProposalAuditEventSchema>;
export type ServerProjectRecord = z.infer<typeof ServerProjectRecordSchema>;
export type ServerProjectReportRecord = z.infer<typeof ServerProjectReportRecordSchema>;
export type ServerProjectReportRevisionRecord = z.infer<typeof ServerProjectReportRevisionRecordSchema>;
export type ServerProjectScenarioSnapshot = z.infer<typeof ServerProjectScenarioSnapshotSchema>;
export type ServerProjectUpdateReportRequest = z.infer<typeof ServerProjectUpdateReportRequestSchema>;
