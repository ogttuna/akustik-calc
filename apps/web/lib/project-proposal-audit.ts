import type { getAuthState } from "./auth";
import { resolveProjectRouteOwner } from "./project-route-auth";
import {
  ServerProjectStorageError,
  createDefaultServerProjectRepository
} from "./server-project-storage";

type AuthState = Awaited<ReturnType<typeof getAuthState>>;

export type ProposalAuditOutputFormat = "docx" | "pdf";
export type ProposalAuditOutputStyle = "branded" | "simple";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

export function getProposalAuditProjectId(requestUrl: string, documentProjectId?: string): string | null {
  const queryProjectId = new URL(requestUrl).searchParams.get("projectId")?.trim();
  const projectId = queryProjectId && queryProjectId.length > 0 ? queryProjectId : documentProjectId?.trim();

  return projectId && projectId.length > 0 ? projectId : null;
}

export function getProposalAuditScenarioIds(documentScenarioId?: string): string[] {
  const scenarioId = documentScenarioId?.trim();
  return scenarioId && UUID_RE.test(scenarioId) ? [scenarioId] : [];
}

export async function appendProposalAuditEventForProject(args: {
  authState: AuthState;
  format: ProposalAuditOutputFormat;
  projectId: string;
  scenarioIds: string[];
  style: ProposalAuditOutputStyle;
}): Promise<void> {
  const owner = resolveProjectRouteOwner(args.authState);
  if (!owner.ok) {
    throw new ServerProjectStorageError(owner.error, "authentication_required", owner.status);
  }

  const repository = createDefaultServerProjectRepository();
  await repository.appendProposalAuditEvent(owner.scope, args.projectId, {
    format: args.format,
    scenarioIds: args.scenarioIds,
    source: "proposal_route",
    style: args.style
  });
}
