import { describe, expect, it } from "vitest";

import type { ProjectOwnerScopeResolution } from "./project-storage-auth";
import {
  projectAccessRefForOwnerScope,
  resolveProjectRouteAccess,
  toOwnerOnlyProjectAccessSubject
} from "./project-route-auth";
import type { ProjectOwnerScope } from "./server-project-storage";

const CONFIGURED_OWNER: ProjectOwnerScope = {
  authMode: "configured",
  ownerId: "configured_alice",
  ownerLabel: "Alice Consultant"
};

const PREVIEW_OWNER: ProjectOwnerScope = {
  authMode: "preview",
  ownerId: "preview_mode",
  ownerLabel: "Preview mode"
};

const CONFIGURED_OWNER_RESOLUTION: ProjectOwnerScopeResolution = {
  ok: true,
  scope: CONFIGURED_OWNER
};

const PREVIEW_OWNER_RESOLUTION: ProjectOwnerScopeResolution = {
  ok: true,
  scope: PREVIEW_OWNER
};

const MISSING_CONFIGURED_SESSION: ProjectOwnerScopeResolution = {
  error: "Authentication required.",
  ok: false,
  status: 401
};

describe("project route access adapter", () => {
  it("adapts the current owner scope into an owner-only policy subject", () => {
    expect(toOwnerOnlyProjectAccessSubject(CONFIGURED_OWNER)).toEqual({
      authenticated: true,
      membershipRole: null,
      membershipTeamId: null,
      scope: CONFIGURED_OWNER
    });

    expect(resolveProjectRouteAccess({ action: "list_projects", owner: CONFIGURED_OWNER_RESOLUTION })).toEqual({
      decision: {
        action: "list_projects",
        allowed: true,
        reason: "owner",
        role: "owner"
      },
      ok: true,
      scope: CONFIGURED_OWNER
    });

    expect(resolveProjectRouteAccess({ action: "create_project", owner: CONFIGURED_OWNER_RESOLUTION })).toEqual({
      decision: {
        action: "create_project",
        allowed: true,
        reason: "owner",
        role: "owner"
      },
      ok: true,
      scope: CONFIGURED_OWNER
    });
  });

  it("keeps configured authentication failures on the policy path with the existing route shape", () => {
    expect(resolveProjectRouteAccess({ action: "list_projects", owner: MISSING_CONFIGURED_SESSION })).toEqual({
      decision: {
        action: "list_projects",
        allowed: false,
        reason: "authentication_required"
      },
      error: "Authentication required.",
      ok: false,
      status: 401
    });
  });

  it("requires an explicit owner project ref for project-bound local imports", () => {
    expect(resolveProjectRouteAccess({ action: "import_local_scenarios", owner: CONFIGURED_OWNER_RESOLUTION })).toEqual({
      decision: {
        action: "import_local_scenarios",
        allowed: false,
        reason: "project_required"
      },
      error: "Project access requires a project.",
      ok: false,
      status: 400
    });

    expect(
      resolveProjectRouteAccess({
        action: "import_local_scenarios",
        owner: CONFIGURED_OWNER_RESOLUTION,
        project: projectAccessRefForOwnerScope(CONFIGURED_OWNER)
      })
    ).toEqual({
      decision: {
        action: "import_local_scenarios",
        allowed: true,
        reason: "owner",
        role: "owner"
      },
      ok: true,
      scope: CONFIGURED_OWNER
    });
  });

  it("does not route-enable team roles until a real membership source exists", () => {
    expect(
      resolveProjectRouteAccess({
        action: "read_project",
        owner: CONFIGURED_OWNER_RESOLUTION,
        project: {
          ownerId: "configured_bob",
          teamId: "team_acme"
        }
      })
    ).toEqual({
      decision: {
        action: "read_project",
        allowed: false,
        reason: "team_membership_required"
      },
      error: "Project access denied.",
      ok: false,
      status: 403
    });
  });

  it("keeps preview routes isolated from team-scoped project refs", () => {
    expect(
      resolveProjectRouteAccess({
        action: "read_project",
        owner: PREVIEW_OWNER_RESOLUTION,
        project: {
          ownerId: PREVIEW_OWNER.ownerId,
          teamId: "team_acme"
        }
      })
    ).toEqual({
      decision: {
        action: "read_project",
        allowed: false,
        reason: "preview_team_access_denied"
      },
      error: "Preview project access cannot use team scope.",
      ok: false,
      status: 403
    });
  });
});
