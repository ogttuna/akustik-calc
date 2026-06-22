import { NextResponse } from "next/server";

import {
  JsonValueSchema,
  ProjectUserVerifiedCalculatedAnchorRequestContextSchema,
  ProjectUserVerifiedCalculatedAnchorResultBasisTraceSchema,
  ProjectUserVerifiedCalculatedAnchorScopeSchema,
  ProjectUserVerifiedCalculatedAnchorValuesSchema,
  type JsonValue
} from "@dynecho/shared";

import { getAuthState } from "@/lib/auth";
import {
  projectOwnerScopeErrorResponse,
  projectStorageRouteErrorResponse,
  resolveProjectRouteOwner
} from "@/lib/project-route-auth";
import {
  createDefaultWorkbenchV2VerifiedCalculatedAnchorRepository,
  type WorkbenchV2VerifiedCalculatedAnchorCreateInput
} from "@/lib/workbench-v2-verified-calculated-anchor-storage";

export const runtime = "nodejs";

// Agent coordination, 2026-06-22:
// This route only stores explicit verified-calculated references. It does not
// feed /api/estimate or engine runtime matching.

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function readRequestJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function invalidPayload(error: string, status = 400) {
  return NextResponse.json(
    {
      error,
      ok: false
    },
    {
      status
    }
  );
}

function parseOptionalText(value: unknown): string | undefined | null {
  if (value === undefined || value === null) {
    return undefined;
  }

  return typeof value === "string" ? value : null;
}

function parseWorkbenchSnapshot(value: unknown): Record<string, JsonValue> | undefined | null {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (!isRecord(value)) {
    return null;
  }

  const parsedEntries: Record<string, JsonValue> = {};
  for (const [key, entryValue] of Object.entries(value)) {
    const parsedEntry = JsonValueSchema.safeParse(entryValue);
    if (!parsedEntry.success) {
      return null;
    }
    parsedEntries[key] = parsedEntry.data;
  }

  return parsedEntries;
}

function parseCreatePayload(value: unknown): WorkbenchV2VerifiedCalculatedAnchorCreateInput | null {
  if (!isRecord(value) || typeof value.name !== "string") {
    return null;
  }

  const createdFromPresetId = parseOptionalText(value.createdFromPresetId);
  const createdFromProjectId = parseOptionalText(value.createdFromProjectId);
  const description = parseOptionalText(value.description);
  if (createdFromPresetId === null || createdFromProjectId === null || description === null) {
    return null;
  }

  const requestContext = ProjectUserVerifiedCalculatedAnchorRequestContextSchema.safeParse(value.requestContext);
  const resultBasisTrace = ProjectUserVerifiedCalculatedAnchorResultBasisTraceSchema.safeParse(value.resultBasisTrace);
  const values = ProjectUserVerifiedCalculatedAnchorValuesSchema.safeParse(value.values);
  const scope =
    value.scope === undefined || value.scope === null
      ? undefined
      : ProjectUserVerifiedCalculatedAnchorScopeSchema.safeParse(value.scope);
  const workbenchSnapshot = parseWorkbenchSnapshot(value.workbenchSnapshot);

  if (
    !requestContext.success ||
    !resultBasisTrace.success ||
    !values.success ||
    scope === null ||
    scope?.success === false ||
    workbenchSnapshot === null
  ) {
    return null;
  }

  return {
    createdFromPresetId,
    createdFromProjectId,
    description,
    name: value.name,
    requestContext: requestContext.data,
    resultBasisTrace: resultBasisTrace.data,
    scope: scope?.data,
    values: values.data,
    workbenchSnapshot
  };
}

export async function GET() {
  const owner = resolveProjectRouteOwner(await getAuthState());
  if (!owner.ok) {
    return projectOwnerScopeErrorResponse(owner);
  }

  try {
    const repository = createDefaultWorkbenchV2VerifiedCalculatedAnchorRepository();
    const anchors = await repository.listVerifiedCalculatedAnchorSummaries(owner.scope);

    return NextResponse.json({
      anchors,
      ok: true
    });
  } catch (error) {
    return projectStorageRouteErrorResponse(error, "Unknown verified calculated anchor storage failure.");
  }
}

export async function POST(request: Request) {
  const owner = resolveProjectRouteOwner(await getAuthState());
  if (!owner.ok) {
    return projectOwnerScopeErrorResponse(owner);
  }

  const payload = parseCreatePayload(await readRequestJson(request));
  if (!payload) {
    return invalidPayload("Invalid verified calculated anchor payload.");
  }

  try {
    const repository = createDefaultWorkbenchV2VerifiedCalculatedAnchorRepository();
    const anchor = await repository.createVerifiedCalculatedAnchor(owner.scope, payload);

    return NextResponse.json(
      {
        anchor,
        ok: true
      },
      {
        status: 201
      }
    );
  } catch (error) {
    return projectStorageRouteErrorResponse(error, "Unknown verified calculated anchor create failure.");
  }
}
