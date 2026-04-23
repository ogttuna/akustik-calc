import {
  SERVER_PROJECT_ACCESS_ACTIONS,
  type ServerProjectAccessAction,
  type ServerProjectAccessRole
} from "@dynecho/shared";

import type { ProjectOwnerScope } from "./server-project-storage";

export type ProjectAccessProjectRef = {
  ownerId: string;
  teamId?: string | null;
};

export type ProjectAccessSubject =
  | {
      authenticated: false;
      authMode: "configured";
    }
  | {
      authenticated: true;
      membershipRole?: ServerProjectAccessRole | null;
      membershipTeamId?: string | null;
      scope: ProjectOwnerScope;
    };

export type ProjectAccessAllowReason = "owner" | "preview_owner" | "team_role";
export type ProjectAccessDenyReason =
  | "authentication_required"
  | "owner_scope_mismatch"
  | "preview_team_access_denied"
  | "project_required"
  | "role_not_permitted"
  | "team_membership_required";

export type ProjectAccessDecision =
  | {
      action: ServerProjectAccessAction;
      allowed: true;
      reason: ProjectAccessAllowReason;
      role: ServerProjectAccessRole;
    }
  | {
      action: ServerProjectAccessAction;
      allowed: false;
      reason: ProjectAccessDenyReason;
      role?: ServerProjectAccessRole;
    };

export const PROJECT_ACCESS_ROLE_ACTIONS = {
  owner: SERVER_PROJECT_ACCESS_ACTIONS,
  editor: ["list_projects", "read_project", "import_local_scenarios", "append_proposal_audit"],
  reviewer: ["list_projects", "read_project"],
  viewer: ["list_projects", "read_project"]
} satisfies Record<ServerProjectAccessRole, readonly ServerProjectAccessAction[]>;

const PROJECT_BOUND_ACTIONS = new Set<ServerProjectAccessAction>([
  "read_project",
  "import_local_scenarios",
  "append_proposal_audit",
  "manage_members"
]);

type ResolveProjectAccessDecisionInput = {
  action: ServerProjectAccessAction;
  project?: ProjectAccessProjectRef | null;
  subject: ProjectAccessSubject;
};

export function isProjectAccessActionAllowed(role: ServerProjectAccessRole, action: ServerProjectAccessAction): boolean {
  const allowedActions: readonly ServerProjectAccessAction[] = PROJECT_ACCESS_ROLE_ACTIONS[role];
  return allowedActions.includes(action);
}

export function resolveProjectAccessDecision(input: ResolveProjectAccessDecisionInput): ProjectAccessDecision {
  const { action, project, subject } = input;

  if (!subject.authenticated) {
    return deny(action, "authentication_required");
  }

  if (requiresProject(action) && !project) {
    return deny(action, "project_required");
  }

  if (subject.scope.authMode === "preview") {
    if (project?.teamId || subject.membershipRole || subject.membershipTeamId) {
      return deny(action, "preview_team_access_denied");
    }

    if (project && project.ownerId !== subject.scope.ownerId) {
      return deny(action, "owner_scope_mismatch");
    }

    return allow(action, "owner", "preview_owner");
  }

  if (!project) {
    if (subject.membershipRole) {
      return decideByRole(action, subject.membershipRole, "team_role");
    }

    return allow(action, "owner", "owner");
  }

  if (project.ownerId === subject.scope.ownerId) {
    return allow(action, "owner", "owner");
  }

  if (!project.teamId) {
    return deny(action, "owner_scope_mismatch");
  }

  if (!subject.membershipRole || subject.membershipTeamId !== project.teamId) {
    return deny(action, "team_membership_required");
  }

  return decideByRole(action, subject.membershipRole, "team_role");
}

function requiresProject(action: ServerProjectAccessAction): boolean {
  return PROJECT_BOUND_ACTIONS.has(action);
}

function decideByRole(
  action: ServerProjectAccessAction,
  role: ServerProjectAccessRole,
  reason: ProjectAccessAllowReason
): ProjectAccessDecision {
  if (!isProjectAccessActionAllowed(role, action)) {
    return deny(action, "role_not_permitted", role);
  }

  return allow(action, role, reason);
}

function allow(
  action: ServerProjectAccessAction,
  role: ServerProjectAccessRole,
  reason: ProjectAccessAllowReason
): ProjectAccessDecision {
  return {
    action,
    allowed: true,
    reason,
    role
  };
}

function deny(
  action: ServerProjectAccessAction,
  reason: ProjectAccessDenyReason,
  role?: ServerProjectAccessRole
): ProjectAccessDecision {
  return {
    action,
    allowed: false,
    reason,
    role
  };
}
