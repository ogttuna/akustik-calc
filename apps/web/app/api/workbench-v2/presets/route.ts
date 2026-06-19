import { JsonValueSchema, type JsonValue } from "@dynecho/shared";
import { NextResponse } from "next/server";

import {
  parseWorkbenchV2ProjectSnapshot,
  type WorkbenchV2ProjectSnapshot
} from "@/features/workbench-rebuild/workbench-v2-project-snapshot";
import { getAuthState } from "@/lib/auth";
import {
  projectOwnerScopeErrorResponse,
  projectStorageRouteErrorResponse,
  resolveProjectRouteOwner
} from "@/lib/project-route-auth";
import { createDefaultWorkbenchV2PresetRepository } from "@/lib/workbench-v2-preset-storage";

export const runtime = "nodejs";

type CreatePresetPayload = {
  description?: string;
  name: string;
  snapshot: JsonValue;
  parsedSnapshot: WorkbenchV2ProjectSnapshot;
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

function parseCreatePresetPayload(value: unknown): CreatePresetPayload | null {
  if (!isRecord(value) || typeof value.name !== "string" || (value.description !== undefined && typeof value.description !== "string")) {
    return null;
  }

  const snapshot = JsonValueSchema.safeParse(value.snapshot);
  if (!snapshot.success) {
    return null;
  }

  const parsedSnapshot = parseWorkbenchV2ProjectSnapshot(snapshot.data).snapshot;
  if (!parsedSnapshot) {
    return null;
  }

  return {
    description: value.description,
    name: value.name,
    parsedSnapshot,
    snapshot: snapshot.data
  };
}

export async function GET() {
  const owner = resolveProjectRouteOwner(await getAuthState());
  if (!owner.ok) {
    return projectOwnerScopeErrorResponse(owner);
  }

  try {
    const repository = createDefaultWorkbenchV2PresetRepository();
    const presets = await repository.listPresets(owner.scope);

    return NextResponse.json({
      ok: true,
      presets
    });
  } catch (error) {
    return projectStorageRouteErrorResponse(error, "Unknown preset storage failure.");
  }
}

export async function POST(request: Request) {
  const owner = resolveProjectRouteOwner(await getAuthState());
  if (!owner.ok) {
    return projectOwnerScopeErrorResponse(owner);
  }

  const payload = parseCreatePresetPayload(await readRequestJson(request));
  if (!payload) {
    return invalidPayload("Invalid workbench preset payload.");
  }

  try {
    const repository = createDefaultWorkbenchV2PresetRepository();
    const preset = await repository.createPreset(owner.scope, {
      description: payload.description,
      kind: payload.parsedSnapshot.mode,
      layerCount: payload.parsedSnapshot.layers.length,
      name: payload.name,
      snapshot: payload.snapshot
    });

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
    return projectStorageRouteErrorResponse(error, "Unknown preset create failure.");
  }
}
