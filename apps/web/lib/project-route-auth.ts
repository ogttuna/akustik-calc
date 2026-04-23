import { NextResponse } from "next/server";

import type { getAuthState } from "./auth";
import { resolveProjectOwnerScope, type ProjectOwnerScopeResolution } from "./project-storage-auth";
import { ServerProjectStorageError } from "./server-project-storage";

type AuthState = Awaited<ReturnType<typeof getAuthState>>;
type ProjectOwnerScopeFailure = Extract<ProjectOwnerScopeResolution, { ok: false }>;

export function resolveProjectRouteOwner(authState: AuthState): ProjectOwnerScopeResolution {
  return resolveProjectOwnerScope(authState);
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
