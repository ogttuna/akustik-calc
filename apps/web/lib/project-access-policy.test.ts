import {
  SERVER_PROJECT_ACCESS_ACTIONS,
  SERVER_PROJECT_ACCESS_ROLES,
  type ServerProjectAccessAction,
  type ServerProjectAccessRole
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  PROJECT_ACCESS_ROLE_ACTIONS,
  isProjectAccessActionAllowed,
  resolveProjectAccessDecision,
  type ProjectAccessProjectRef
} from "./project-access-policy";
import type { ProjectOwnerScope } from "./server-project-storage";

const CONFIGURED_OWNER: ProjectOwnerScope = {
  authMode: "configured",
  ownerId: "configured_alice",
  ownerLabel: "Alice Consultant"
};

const CONFIGURED_OTHER_OWNER: ProjectOwnerScope = {
  authMode: "configured",
  ownerId: "configured_bob",
  ownerLabel: "Bob Consultant"
};

const PREVIEW_OWNER: ProjectOwnerScope = {
  authMode: "preview",
  ownerId: "preview_mode",
  ownerLabel: "Preview mode"
};

const TEAM_PROJECT: ProjectAccessProjectRef = {
  ownerId: CONFIGURED_OTHER_OWNER.ownerId,
  teamId: "team_acme"
};

const ROLE_ACTION_MATRIX: Record<ServerProjectAccessRole, readonly ServerProjectAccessAction[]> = {
  owner: [
    "create_project",
    "list_projects",
    "read_project",
    "import_local_scenarios",
    "append_proposal_audit",
    "manage_members"
  ],
  editor: ["list_projects", "read_project", "import_local_scenarios", "append_proposal_audit"],
  reviewer: ["list_projects", "read_project"],
  viewer: ["list_projects", "read_project"]
};

const PROJECT_BOUND_ACTIONS: readonly ServerProjectAccessAction[] = [
  "read_project",
  "import_local_scenarios",
  "append_proposal_audit",
  "manage_members"
];

describe("project access policy", () => {
  it("publishes the first team-access role/action matrix as executable shared vocabulary", () => {
    expect(SERVER_PROJECT_ACCESS_ROLES).toEqual(["owner", "editor", "reviewer", "viewer"]);
    expect(SERVER_PROJECT_ACCESS_ACTIONS).toEqual(ROLE_ACTION_MATRIX.owner);
    expect(PROJECT_ACCESS_ROLE_ACTIONS).toEqual(ROLE_ACTION_MATRIX);

    const observedMatrix = Object.fromEntries(
      SERVER_PROJECT_ACCESS_ROLES.map((role) => [
        role,
        SERVER_PROJECT_ACCESS_ACTIONS.filter((action) => isProjectAccessActionAllowed(role, action))
      ])
    );

    expect(observedMatrix).toEqual(ROLE_ACTION_MATRIX);
  });

  it("allows the configured project owner to perform every project action", () => {
    const ownedProject: ProjectAccessProjectRef = {
      ownerId: CONFIGURED_OWNER.ownerId,
      teamId: "team_acme"
    };

    for (const action of SERVER_PROJECT_ACCESS_ACTIONS) {
      expect(
        resolveProjectAccessDecision({
          action,
          project: ownedProject,
          subject: {
            authenticated: true,
            scope: CONFIGURED_OWNER
          }
        })
      ).toEqual({
        action,
        allowed: true,
        reason: "owner",
        role: "owner"
      });
    }
  });

  it("keeps editor, reviewer, and viewer team permissions narrower than project ownership", () => {
    const roleExpectations: Record<Exclude<ServerProjectAccessRole, "owner">, readonly ServerProjectAccessAction[]> = {
      editor: ["list_projects", "read_project", "import_local_scenarios", "append_proposal_audit"],
      reviewer: ["list_projects", "read_project"],
      viewer: ["list_projects", "read_project"]
    };

    for (const [role, allowedActions] of Object.entries(roleExpectations) as Array<
      [Exclude<ServerProjectAccessRole, "owner">, readonly ServerProjectAccessAction[]]
    >) {
      for (const action of SERVER_PROJECT_ACCESS_ACTIONS) {
        const decision = resolveProjectAccessDecision({
          action,
          project: TEAM_PROJECT,
          subject: {
            authenticated: true,
            membershipRole: role,
            membershipTeamId: TEAM_PROJECT.teamId,
            scope: CONFIGURED_OWNER
          }
        });

        if (allowedActions.includes(action)) {
          expect(decision).toEqual({
            action,
            allowed: true,
            reason: "team_role",
            role
          });
        } else {
          expect(decision).toEqual({
            action,
            allowed: false,
            reason: "role_not_permitted",
            role
          });
        }
      }
    }
  });

  it("uses stable denial reasons for missing auth, project refs, ownership, and team membership", () => {
    expect(
      resolveProjectAccessDecision({
        action: "read_project",
        project: {
          ownerId: CONFIGURED_OWNER.ownerId
        },
        subject: {
          authenticated: false,
          authMode: "configured"
        }
      })
    ).toEqual({
      action: "read_project",
      allowed: false,
      reason: "authentication_required"
    });

    for (const action of PROJECT_BOUND_ACTIONS) {
      expect(
        resolveProjectAccessDecision({
          action,
          subject: {
            authenticated: true,
            scope: CONFIGURED_OWNER
          }
        })
      ).toEqual({
        action,
        allowed: false,
        reason: "project_required"
      });
    }

    expect(
      resolveProjectAccessDecision({
        action: "read_project",
        project: {
          ownerId: CONFIGURED_OTHER_OWNER.ownerId
        },
        subject: {
          authenticated: true,
          scope: CONFIGURED_OWNER
        }
      })
    ).toEqual({
      action: "read_project",
      allowed: false,
      reason: "owner_scope_mismatch"
    });

    expect(
      resolveProjectAccessDecision({
        action: "read_project",
        project: TEAM_PROJECT,
        subject: {
          authenticated: true,
          membershipRole: "viewer",
          membershipTeamId: "team_other",
          scope: CONFIGURED_OWNER
        }
      })
    ).toEqual({
      action: "read_project",
      allowed: false,
      reason: "team_membership_required"
    });
  });

  it("keeps preview mode isolated from configured/team access while preserving preview-owner project actions", () => {
    expect(
      resolveProjectAccessDecision({
        action: "create_project",
        subject: {
          authenticated: true,
          scope: PREVIEW_OWNER
        }
      })
    ).toEqual({
      action: "create_project",
      allowed: true,
      reason: "preview_owner",
      role: "owner"
    });

    expect(
      resolveProjectAccessDecision({
        action: "read_project",
        project: {
          ownerId: PREVIEW_OWNER.ownerId
        },
        subject: {
          authenticated: true,
          scope: PREVIEW_OWNER
        }
      })
    ).toEqual({
      action: "read_project",
      allowed: true,
      reason: "preview_owner",
      role: "owner"
    });

    expect(
      resolveProjectAccessDecision({
        action: "read_project",
        project: TEAM_PROJECT,
        subject: {
          authenticated: true,
          membershipRole: "owner",
          membershipTeamId: TEAM_PROJECT.teamId,
          scope: PREVIEW_OWNER
        }
      })
    ).toEqual({
      action: "read_project",
      allowed: false,
      reason: "preview_team_access_denied"
    });
  });
});
