import { NextResponse } from "next/server";

import { getAuthState } from "@/lib/auth";
import {
  projectOwnerScopeErrorResponse,
  projectStorageRouteErrorResponse,
  resolveProjectRouteOwner
} from "@/lib/project-route-auth";
import { createDefaultWorkbenchV2PresetRepository } from "@/lib/workbench-v2-preset-storage";

export const runtime = "nodejs";

type WorkbenchPresetRouteContext = {
  params: Promise<{
    presetId: string;
  }>;
};

type UpdatePresetPayload = {
  description?: string;
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

function parseUpdatePresetPayload(value: unknown): UpdatePresetPayload | null {
  if (!isRecord(value)) {
    return null;
  }
  if (value.name !== undefined && typeof value.name !== "string") {
    return null;
  }
  if (value.description !== undefined && typeof value.description !== "string") {
    return null;
  }
  if (value.name === undefined && value.description === undefined) {
    return null;
  }

  return {
    description: value.description,
    name: value.name
  };
}

export async function GET(_request: Request, context: WorkbenchPresetRouteContext) {
  const owner = resolveProjectRouteOwner(await getAuthState());
  if (!owner.ok) {
    return projectOwnerScopeErrorResponse(owner);
  }

  try {
    const { presetId } = await context.params;
    const repository = createDefaultWorkbenchV2PresetRepository();
    const preset = await repository.readPreset(owner.scope, presetId);

    if (!preset) {
      return NextResponse.json(
        {
          error: "Preset not found.",
          ok: false
        },
        {
          status: 404
        }
      );
    }

    return NextResponse.json({
      ok: true,
      preset
    });
  } catch (error) {
    return projectStorageRouteErrorResponse(error, "Unknown preset read failure.");
  }
}

export async function PATCH(request: Request, context: WorkbenchPresetRouteContext) {
  const owner = resolveProjectRouteOwner(await getAuthState());
  if (!owner.ok) {
    return projectOwnerScopeErrorResponse(owner);
  }

  const payload = parseUpdatePresetPayload(await readRequestJson(request));
  if (!payload) {
    return NextResponse.json(
      {
        error: "Invalid workbench preset update payload.",
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
    const preset = await repository.updatePreset(owner.scope, presetId, payload);

    return NextResponse.json({
      ok: true,
      preset
    });
  } catch (error) {
    return projectStorageRouteErrorResponse(error, "Unknown preset update failure.");
  }
}

export async function DELETE(_request: Request, context: WorkbenchPresetRouteContext) {
  const owner = resolveProjectRouteOwner(await getAuthState());
  if (!owner.ok) {
    return projectOwnerScopeErrorResponse(owner);
  }

  try {
    const { presetId } = await context.params;
    const repository = createDefaultWorkbenchV2PresetRepository();
    await repository.deletePreset(owner.scope, presetId);

    return NextResponse.json({
      ok: true
    });
  } catch (error) {
    return projectStorageRouteErrorResponse(error, "Unknown preset delete failure.");
  }
}
