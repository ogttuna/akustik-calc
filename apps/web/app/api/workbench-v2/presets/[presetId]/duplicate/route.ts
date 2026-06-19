import { NextResponse } from "next/server";

import { getAuthState } from "@/lib/auth";
import {
  projectOwnerScopeErrorResponse,
  projectStorageRouteErrorResponse,
  resolveProjectRouteOwner
} from "@/lib/project-route-auth";
import { createDefaultWorkbenchV2PresetRepository } from "@/lib/workbench-v2-preset-storage";

export const runtime = "nodejs";

type WorkbenchPresetDuplicateRouteContext = {
  params: Promise<{
    presetId: string;
  }>;
};

type DuplicatePresetPayload = {
  name?: string;
};

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

function parseDuplicatePresetPayload(value: unknown): DuplicatePresetPayload | null {
  if (value === null || value === undefined) {
    return {};
  }
  if (!isRecord(value) || (value.name !== undefined && typeof value.name !== "string")) {
    return null;
  }

  return {
    name: value.name
  };
}

export async function POST(request: Request, context: WorkbenchPresetDuplicateRouteContext) {
  const owner = resolveProjectRouteOwner(await getAuthState());
  if (!owner.ok) {
    return projectOwnerScopeErrorResponse(owner);
  }

  const payload = parseDuplicatePresetPayload(await readRequestJson(request));
  if (!payload) {
    return NextResponse.json(
      {
        error: "Invalid workbench preset duplicate payload.",
        ok: false
      },
      {
        status: 400
      }
    );
  }

  try {
    const { presetId } = await context.params;
    const repository = createDefaultWorkbenchV2PresetRepository();
    const preset = await repository.duplicatePreset(owner.scope, presetId, payload);

    return NextResponse.json(
      {
        ok: true,
        preset
      },
      {
        status: 201
      }
    );
  } catch (error) {
    return projectStorageRouteErrorResponse(error, "Unknown preset duplicate failure.");
  }
}
