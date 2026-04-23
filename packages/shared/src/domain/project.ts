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

export const ServerProjectScenarioSourceSchema = z.enum(["browser_local_import", "server_created"]);
export const ServerProjectProposalOutputFormatSchema = z.enum(["pdf", "docx", "html", "markdown"]);
export const ServerProjectAccessRoleSchema = z.enum(["owner", "editor", "reviewer", "viewer"]);
export const ServerProjectAccessActionSchema = z.enum([
  "create_project",
  "list_projects",
  "read_project",
  "import_local_scenarios",
  "append_proposal_audit",
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

export const ServerProjectRecordSchema = z
  .object({
    clientName: optionalTrimmedString(160),
    createdAtIso: z.string().datetime(),
    description: ProjectOptionalTextSchema,
    id: z.string().uuid(),
    name: ProjectNameSchema,
    ownerId: ProjectOwnerIdSchema,
    ownerLabel: ProjectOwnerLabelSchema,
    proposalAuditEvents: z.array(ServerProjectProposalAuditEventSchema),
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

export type ServerProjectCreateRequest = z.infer<typeof ServerProjectCreateRequestSchema>;
export type ServerProjectAccessAction = z.infer<typeof ServerProjectAccessActionSchema>;
export type ServerProjectAccessRole = z.infer<typeof ServerProjectAccessRoleSchema>;
export type ServerProjectImportLocalRequest = z.infer<typeof ServerProjectImportLocalRequestSchema>;
export type ServerProjectLocalScenarioImport = z.infer<typeof ServerProjectLocalScenarioImportSchema>;
export type ServerProjectProposalAuditEvent = z.infer<typeof ServerProjectProposalAuditEventSchema>;
export type ServerProjectRecord = z.infer<typeof ServerProjectRecordSchema>;
export type ServerProjectScenarioSnapshot = z.infer<typeof ServerProjectScenarioSnapshotSchema>;
