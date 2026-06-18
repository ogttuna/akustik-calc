import { NextResponse } from "next/server";

import {
  previewDescribedLayerConfiguration,
  previewWorkbenchV2CalculatorSnapshot
} from "@/features/workbench-rebuild/workbench-v2-calculator-assistant";
import { calculatorPreviewToAssistantResult } from "@/features/workbench/report-assistant-calculator-preview-result";
import { routeFailureToAssistantResult } from "@/features/workbench/report-assistant-route-failure-result";
import { getAuthState } from "@/lib/auth";

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

function routeFailure(input: {
  code: string;
  errors: readonly string[];
  routeStatus?: "error" | "needs_input" | "unsupported";
  status: number;
}) {
  const routeStatus = input.routeStatus ?? (input.code.startsWith("unsupported_") ? "unsupported" : "needs_input");

  return NextResponse.json(
    {
      assistantResults: [
        routeFailureToAssistantResult({
          capabilityName: "report_assistant_calculator_preview_route",
          code: input.code,
          errors: input.errors,
          routeStatus
        })
      ],
      code: input.code,
      errors: input.errors,
      mutates: false,
      ok: false,
      previewOnly: true
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
        assistantResults: [
          routeFailureToAssistantResult({
            capabilityName: "report_assistant_calculator_preview_route",
            code: "assistant_auth_required",
            errors: ["Authentication required."],
            routeStatus: "auth_failed"
          })
        ],
        error: "Authentication required.",
        ok: false
      },
      { status: 401 }
    );
  }

  const payload = await readRequestJson(request);
  if (!isRecord(payload)) {
    return routeFailure({
      code: "invalid_calculator_preview_payload",
      errors: ["Assistant calculator preview payload must be a JSON object."],
      status: 400
    });
  }

  const result = payload.snapshot === undefined
    ? previewDescribedLayerConfiguration({
      description: payload.description ?? payload.layerConfiguration,
      mode: payload.mode,
      targetOutputs: payload.targetOutputs
    })
    : previewWorkbenchV2CalculatorSnapshot({
      snapshot: payload.snapshot,
      targetOutputs: payload.targetOutputs
    });

  if (!result.ok) {
    return NextResponse.json(
      {
        code: result.code,
        errors: result.errors,
        mutates: false,
        name: result.name,
        ok: false,
        previewOnly: true,
        assistantResults: [
          routeFailureToAssistantResult({
            capabilityName: "report_assistant_calculator_preview_route",
            code: result.code,
            errors: result.errors,
            routeStatus: result.code.startsWith("unsupported_") ? "unsupported" : result.statusCode === 400 ? "needs_input" : "error"
          })
        ]
      },
      {
        status: result.statusCode
      }
    );
  }

  return NextResponse.json({
    assistantResults: [
      calculatorPreviewToAssistantResult({
        name: result.name,
        preview: result.preview
      })
    ],
    mutates: false,
    name: result.name,
    ok: true,
    preview: result.preview,
    previewOnly: true
  });
}
