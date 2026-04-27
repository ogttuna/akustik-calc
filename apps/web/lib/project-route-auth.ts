import type { ServerProjectAccessAction } from "@dynecho/shared";
import { NextResponse } from "next/server";

import type { getAuthState } from "./auth";
import {
  resolveProjectAccessDecision,
  type ProjectAccessDecision,
  type ProjectAccessDenyReason,
  type ProjectAccessProjectRef,
  type ProjectAccessSubject
} from "./project-access-policy";
import { resolveProjectOwnerScope, type ProjectOwnerScopeResolution } from "./project-storage-auth";
import { ServerProjectStorageError, type ProjectOwnerScope } from "./server-project-storage";

type AuthState = Awaited<ReturnType<typeof getAuthState>>;
type ProjectOwnerScopeFailure = Extract<ProjectOwnerScopeResolution, { ok: false }>;
type ProjectOwnerScopeSuccess = Extract<ProjectOwnerScopeResolution, { ok: true }>;
type ProjectRouteAccessStatus = 400 | 401 | 403;
type ProjectRouteAccessDeniedDecision = Extract<ProjectAccessDecision, { allowed: false }>;
type ProjectRouteAccessAllowedDecision = Extract<ProjectAccessDecision, { allowed: true }>;

export type ProjectRouteAccessResolution =
  | {
      decision: ProjectRouteAccessAllowedDecision;
      ok: true;
      scope: ProjectOwnerScope;
    }
  | {
      decision: ProjectRouteAccessDeniedDecision;
      error: string;
      ok: false;
      status: ProjectRouteAccessStatus;
    };

const PROJECT_ROUTE_ACCESS_DENIAL_STATUS = {
  authentication_required: 401,
  owner_scope_mismatch: 403,
  preview_team_access_denied: 403,
  project_required: 400,
  role_not_permitted: 403,
  team_membership_required: 403
} satisfies Record<ProjectAccessDenyReason, ProjectRouteAccessStatus>;

const PROJECT_ROUTE_ACCESS_DENIAL_MESSAGE = {
  authentication_required: "Authentication required.",
  owner_scope_mismatch: "Project access denied.",
  preview_team_access_denied: "Preview project access cannot use team scope.",
  project_required: "Project access requires a project.",
  role_not_permitted: "Project access denied.",
  team_membership_required: "Project access denied."
} satisfies Record<ProjectAccessDenyReason, string>;

export function resolveProjectRouteOwner(authState: AuthState): ProjectOwnerScopeResolution {
  return resolveProjectOwnerScope(authState);
}

export function projectAccessRefForOwnerScope(scope: ProjectOwnerScope): ProjectAccessProjectRef {
  return {
    ownerId: scope.ownerId
  };
}

export function projectAccessRefFromRecord(project: { ownerId: string; teamId?: string | null }): ProjectAccessProjectRef {
  return {
    ownerId: project.ownerId,
    teamId: project.teamId ?? null
  };
}

export function toOwnerOnlyProjectAccessSubject(scope: ProjectOwnerScope): ProjectAccessSubject {
  return {
    authenticated: true,
    membershipRole: null,
    membershipTeamId: null,
    scope
  };
}

export function resolveProjectRouteAccess(input: {
  action: ServerProjectAccessAction;
  owner: ProjectOwnerScopeFailure;
  project?: ProjectAccessProjectRef | null;
}): Extract<ProjectRouteAccessResolution, { ok: false }>;
export function resolveProjectRouteAccess(input: {
  action: ServerProjectAccessAction;
  owner: ProjectOwnerScopeSuccess;
  project?: ProjectAccessProjectRef | null;
}): ProjectRouteAccessResolution;
export function resolveProjectRouteAccess(input: {
  action: ServerProjectAccessAction;
  owner: ProjectOwnerScopeResolution;
  project?: ProjectAccessProjectRef | null;
}): ProjectRouteAccessResolution;
export function resolveProjectRouteAccess(input: {
  action: ServerProjectAccessAction;
  owner: ProjectOwnerScopeResolution;
  project?: ProjectAccessProjectRef | null;
}): ProjectRouteAccessResolution {
  const { action, owner, project } = input;

  if (!owner.ok) {
    const decision = resolveProjectAccessDecision({
      action,
      project,
      subject: {
        authenticated: false,
        authMode: "configured"
      }
    });

    return projectRouteAccessFailure(decision, owner.error, owner.status);
  }

  const decision = resolveProjectAccessDecision({
    action,
    project,
    subject: toOwnerOnlyProjectAccessSubject(owner.scope)
  });

  if (!decision.allowed) {
    return projectRouteAccessFailure(decision);
  }

  return {
    decision,
    ok: true,
    scope: owner.scope
  };
}

export function projectRouteAccessErrorResponse(access: Extract<ProjectRouteAccessResolution, { ok: false }>) {
  return NextResponse.json(
    {
      error: access.error,
      ok: false
    },
    {
      status: access.status
    }
  );
}

export function projectOwnerScopeErrorResponse(owner: ProjectOwnerScopeFailure) {
  return NextResponse.json(
    {
      error: owner.error,
      ok: false
    },
    {
      status: owner.status
    }
  );
}

function projectRouteAccessFailure(
  decision: ProjectAccessDecision,
  error?: string,
  status?: ProjectRouteAccessStatus
): Extract<ProjectRouteAccessResolution, { ok: false }> {
  if (decision.allowed) {
    throw new Error("Project route access expected a denied policy decision.");
  }

  return {
    decision,
    error: error ?? PROJECT_ROUTE_ACCESS_DENIAL_MESSAGE[decision.reason],
    ok: false,
    status: status ?? PROJECT_ROUTE_ACCESS_DENIAL_STATUS[decision.reason]
  };
}

export function projectStorageRouteErrorResponse(
  error: unknown,
  fallbackMessage = "Unknown project storage failure."
) {
  if (error instanceof ServerProjectStorageError) {
    return NextResponse.json(
      {
        code: error.code,
        error: error.message,
        ok: false
      },
      {
        status: error.statusCode
      }
    );
  }

  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : fallbackMessage,
      ok: false
    },
    {
      status: 500
    }
  );
}
