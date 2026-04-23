import { createHash } from "node:crypto";

import { PUBLIC_PREVIEW_USERNAME, type AuthSession } from "./auth";
import type { ProjectOwnerScope } from "./server-project-storage";

type ProjectStorageAuthState =
  | {
      configured: false;
      missingKeys: string[];
      session: AuthSession;
    }
  | {
      configured: true;
      session: AuthSession | null;
    };

export type ProjectOwnerScopeResolution =
  | {
      ok: true;
      scope: ProjectOwnerScope;
    }
  | {
      error: string;
      ok: false;
      status: 401;
    };

export function buildProjectOwnerId(authMode: ProjectOwnerScope["authMode"], username: string): string {
  const normalizedUsername = username.trim().toLocaleLowerCase("en-US");
  const digest = createHash("sha256").update(`${authMode}:${normalizedUsername}`).digest("hex").slice(0, 24);
  return `${authMode}_${digest}`;
}

export function resolveProjectOwnerScope(authState: ProjectStorageAuthState): ProjectOwnerScopeResolution {
  if (authState.configured && !authState.session) {
    return {
      error: "Authentication required.",
      ok: false,
      status: 401
    };
  }

  const authMode = authState.configured ? "configured" : "preview";
  const username = authState.session?.username ?? PUBLIC_PREVIEW_USERNAME;

  return {
    ok: true,
    scope: {
      authMode,
      ownerId: buildProjectOwnerId(authMode, username),
      ownerLabel: username
    }
  };
}
