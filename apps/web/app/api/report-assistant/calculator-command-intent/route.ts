import { NextResponse } from "next/server";

import {
  createWorkbenchV2AssistantNaturalLanguageCommandDecision
} from "@/features/workbench-rebuild/workbench-v2-assistant-natural-language-command";
import { getAuthState } from "@/lib/auth";
import type {
  MaterialDefinition,
  RequestedOutputId
} from "@dynecho/shared";
import type {
  WorkbenchV2DraftLayer,
  WorkbenchV2StudyMode
} from "@/features/workbench-rebuild/workbench-v2-project-snapshot";

export const runtime = "nodejs";

async function readRequestJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseMode(value: unknown): WorkbenchV2StudyMode | null {
  return value === "wall" || value === "floor" ? value : null;
}

function parseLayer(value: unknown): WorkbenchV2DraftLayer | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.id !== "string" ||
    typeof value.materialId !== "string" ||
    typeof value.role !== "string" ||
    typeof value.thicknessMm !== "string"
  ) {
    return null;
  }

  return {
    id: value.id,
    materialId: value.materialId,
    role: value.role,
    thicknessMm: value.thicknessMm
  };
}

function parseRequestedOutputs(value: unknown): RequestedOutputId[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is RequestedOutputId => typeof entry === "string")
    : [];
}

function parseMaterial(value: unknown): MaterialDefinition | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.category !== "string" ||
    typeof value.densityKgM3 !== "number" ||
    !Array.isArray(value.tags)
  ) {
    return null;
  }

  return {
    acoustic: isRecord(value.acoustic) ? value.acoustic as MaterialDefinition["acoustic"] : undefined,
    category: value.category as MaterialDefinition["category"],
    densityKgM3: value.densityKgM3,
    id: value.id,
    impact: isRecord(value.impact) ? value.impact as MaterialDefinition["impact"] : undefined,
    name: value.name,
    notes: typeof value.notes === "string" ? value.notes : undefined,
    tags: value.tags.filter((entry): entry is string => typeof entry === "string")
  };
}

function routeFailure(input: {
  code: string;
  errors: readonly string[];
  status: number;
  warnings?: readonly string[];
}) {
  return NextResponse.json(
    {
      code: input.code,
      errors: input.errors,
      mutates: false,
      ok: false,
      previewOnly: true,
      warnings: input.warnings ?? []
    },
    {
      status: input.status
    }
  );
}

export async function POST(request: Request) {
  const authState = await getAuthState();

  if (authState.configured && !authState.session) {
    return NextResponse.json(
      {
        error: "Authentication required.",
        ok: false
      },
      { status: 401 }
    );
  }

  const payload = await readRequestJson(request);
  if (!isRecord(payload) || typeof payload.instruction !== "string") {
    return routeFailure({
      code: "invalid_calculator_command_intent_payload",
      errors: ["Calculator command intent payload must include an instruction string."],
      status: 400
    });
  }

  const currentMode = parseMode(payload.currentMode);
  const currentLayers = Array.isArray(payload.currentLayers) ? payload.currentLayers.map(parseLayer) : [];
  const materials = Array.isArray(payload.materials) ? payload.materials.map(parseMaterial) : [];

  if (!currentMode || currentLayers.some((layer) => !layer) || materials.some((material) => !material)) {
    return routeFailure({
      code: "invalid_calculator_command_intent_context",
      errors: ["Calculator command intent payload has invalid calculator context."],
      status: 400
    });
  }

  const result = await createWorkbenchV2AssistantNaturalLanguageCommandDecision({
    currentLayers: currentLayers as WorkbenchV2DraftLayer[],
    currentMode,
    currentSelectedOutputs: parseRequestedOutputs(payload.currentSelectedOutputs),
    instruction: payload.instruction,
    materials: materials as MaterialDefinition[]
  });

  if (!result.ok) {
    return routeFailure({
      code: result.code,
      errors: result.errors,
      status: result.statusCode,
      warnings: result.warnings
    });
  }

  return NextResponse.json({
    decision: result.decision,
    mutates: false,
    ok: true,
    previewOnly: true,
    source: result.source
  });
}
