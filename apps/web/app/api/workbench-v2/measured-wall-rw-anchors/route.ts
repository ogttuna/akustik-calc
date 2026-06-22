import { NextResponse } from "next/server";

import { getAuthState } from "@/lib/auth";
import {
  projectOwnerScopeErrorResponse,
  projectStorageRouteErrorResponse,
  resolveProjectRouteOwner
} from "@/lib/project-route-auth";
import { createDefaultWorkbenchV2MeasuredWallRwAnchorRepository } from "@/lib/workbench-v2-measured-wall-rw-anchor-storage";
import { createDefaultWorkbenchV2PresetRepository } from "@/lib/workbench-v2-preset-storage";

export const runtime = "nodejs";

type CreateMeasuredWallRwAnchorPayload = {
  measurementMethodStandard?: "ISO 10140-2" | "ASTM E90" | "source_report_unknown";
  presetId: string;
  ratingStandard?: "ISO 717-1" | "ASTM E413" | "source_report_unknown";
  sourceDescription?: string;
  sourceLabel?: string;
  toleranceDb?: number;
  valueDb: number;
};

const MEASUREMENT_METHOD_STANDARDS = new Set(["ISO 10140-2", "ASTM E90", "source_report_unknown"]);
const RATING_STANDARDS = new Set(["ISO 717-1", "ASTM E413", "source_report_unknown"]);

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

function parseOptionalNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const numeric = typeof value === "number" ? value : typeof value === "string" ? Number(value.trim()) : Number.NaN;
  return Number.isFinite(numeric) ? numeric : undefined;
}

function parseCreatePayload(value: unknown): CreateMeasuredWallRwAnchorPayload | null {
  if (!isRecord(value) || typeof value.presetId !== "string") {
    return null;
  }

  const valueDb = parseOptionalNumber(value.valueDb);
  const toleranceDb = parseOptionalNumber(value.toleranceDb);

  if (valueDb === undefined) {
    return null;
  }
  if (
    value.sourceLabel !== undefined && typeof value.sourceLabel !== "string" ||
    value.sourceDescription !== undefined && typeof value.sourceDescription !== "string" ||
    value.measurementMethodStandard !== undefined &&
      (typeof value.measurementMethodStandard !== "string" || !MEASUREMENT_METHOD_STANDARDS.has(value.measurementMethodStandard)) ||
    value.ratingStandard !== undefined &&
      (typeof value.ratingStandard !== "string" || !RATING_STANDARDS.has(value.ratingStandard))
  ) {
    return null;
  }

  return {
    measurementMethodStandard: value.measurementMethodStandard as CreateMeasuredWallRwAnchorPayload["measurementMethodStandard"],
    presetId: value.presetId,
    ratingStandard: value.ratingStandard as CreateMeasuredWallRwAnchorPayload["ratingStandard"],
    sourceDescription: value.sourceDescription,
    sourceLabel: value.sourceLabel,
    toleranceDb,
    valueDb
  };
}

export async function GET() {
  const owner = resolveProjectRouteOwner(await getAuthState());
  if (!owner.ok) {
    return projectOwnerScopeErrorResponse(owner);
  }

  try {
    const repository = createDefaultWorkbenchV2MeasuredWallRwAnchorRepository();
    const anchors = await repository.listWallRwAnchorSummaries(owner.scope);

    return NextResponse.json({
      anchors,
      ok: true
    });
  } catch (error) {
    return projectStorageRouteErrorResponse(error, "Unknown measured wall Rw anchor storage failure.");
  }
}

export async function POST(request: Request) {
  const owner = resolveProjectRouteOwner(await getAuthState());
  if (!owner.ok) {
    return projectOwnerScopeErrorResponse(owner);
  }

  const payload = parseCreatePayload(await readRequestJson(request));
  if (!payload) {
    return invalidPayload("Invalid measured wall Rw anchor payload.");
  }

  try {
    const presetRepository = createDefaultWorkbenchV2PresetRepository();
    const preset = await presetRepository.readPreset(owner.scope, payload.presetId);

    if (!preset) {
      return invalidPayload("Preset not found.", 404);
    }

    const anchorRepository = createDefaultWorkbenchV2MeasuredWallRwAnchorRepository();
    const anchor = await anchorRepository.createWallRwAnchorFromPreset(owner.scope, {
      measurementMethodStandard: payload.measurementMethodStandard,
      preset,
      ratingStandard: payload.ratingStandard,
      sourceDescription: payload.sourceDescription,
      sourceLabel: payload.sourceLabel,
      toleranceDb: payload.toleranceDb,
      valueDb: payload.valueDb
    });

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
    return projectStorageRouteErrorResponse(error, "Unknown measured wall Rw anchor create failure.");
  }
}
