import { MATERIAL_CATALOG_SEED } from "@dynecho/catalogs";
import { calculateAssembly } from "@dynecho/engine/runtime";
import {
  EstimateRequestSchema,
  ProjectUserVerifiedCalculatedAnchorRequestContextSchema,
  type EstimateRequest,
  type ProjectUserMeasuredWallRwAnchor,
  type ProjectUserVerifiedCalculatedAnchorRequestContext
} from "@dynecho/shared";
import { NextResponse } from "next/server";

import { getAuthState } from "@/lib/auth";
import {
  buildCalculatorExceptionErrorPayload,
  buildCalculatorValidationErrorPayload
} from "@/lib/calculator-api-validation";
import { resolveProjectRouteOwner } from "@/lib/project-route-auth";
import { createDefaultWorkbenchV2MeasuredWallRwAnchorRepository } from "@/lib/workbench-v2-measured-wall-rw-anchor-storage";
import { createDefaultWorkbenchV2VerifiedCalculatedAnchorRepository } from "@/lib/workbench-v2-verified-calculated-anchor-storage";

const SEED_MATERIAL_IDS = new Set(MATERIAL_CATALOG_SEED.map((material) => material.id));
const VERIFIED_CALCULATED_WALL_LAB_EXACT_OUTPUTS = new Set(["Rw", "STC", "C", "Ctr"]);

// Agent coordination, 2026-06-22:
// Workbench presets are templates, not evidence. Estimate source loading has
// separate lanes for measured Rw anchors and user-verified calculated exact
// references; do not merge those lanes or enable delta matching here.
function mergeMeasuredWallRwAnchors(input: {
  payloadAnchors: readonly ProjectUserMeasuredWallRwAnchor[];
  storedAnchors: readonly ProjectUserMeasuredWallRwAnchor[];
}): ProjectUserMeasuredWallRwAnchor[] {
  const seenIds = new Set<string>();
  const seenFingerprints = new Set<string>();
  const merged: ProjectUserMeasuredWallRwAnchor[] = [];

  for (const anchor of [...input.storedAnchors, ...input.payloadAnchors]) {
    if (seenIds.has(anchor.id) || seenFingerprints.has(anchor.fingerprint)) {
      continue;
    }

    seenIds.add(anchor.id);
    seenFingerprints.add(anchor.fingerprint);
    merged.push(anchor);
  }

  return merged;
}

// Agent coordination, 2026-06-22:
// This derives only the current D1 exact wall/lab user-verified-calculated
// request context. Do not widen this to floor, opening, impact, field,
// building, or delta matching here.
function buildVerifiedCalculatedEstimateRequestContext(
  payload: EstimateRequest
): ProjectUserVerifiedCalculatedAnchorRequestContext | null {
  const targetOutputs = payload.targetOutputs ?? [];
  const contextMode = payload.airborneContext?.contextMode ?? "element_lab";

  if (
    payload.calculator !== "dynamic" ||
    payload.mode !== "wall" ||
    contextMode !== "element_lab" ||
    targetOutputs.length === 0 ||
    !targetOutputs.every((output) => VERIFIED_CALCULATED_WALL_LAB_EXACT_OUTPUTS.has(output)) ||
    payload.exactImpactSource ||
    payload.floorImpactContext ||
    payload.impactFieldContext ||
    payload.impactPredictorInput ||
    payload.steelFloorFormulaSurface
  ) {
    return null;
  }

  const parsed = ProjectUserVerifiedCalculatedAnchorRequestContextSchema.safeParse({
    airborneContext: payload.airborneContext,
    calculator: payload.calculator,
    layers: payload.layers,
    materialCatalog: payload.materialCatalog ?? [],
    mode: payload.mode,
    targetOutputs
  });

  return parsed.success ? parsed.data : null;
}

export async function POST(request: Request) {
  const authState = await getAuthState();

  if (authState.configured && !authState.session) {
    return NextResponse.json(
      {
        ok: false,
        error: "Authentication required."
      },
      { status: 401 }
    );
  }

  try {
    const parsed = EstimateRequestSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        buildCalculatorValidationErrorPayload({
          issues: parsed.error.issues,
          route: "estimate"
        }),
        { status: 400 }
      );
    }

    const payload = parsed.data;
    const owner = resolveProjectRouteOwner(authState);
    const seedCollision = payload.materialCatalog?.find((material) => SEED_MATERIAL_IDS.has(material.id));

    if (seedCollision) {
      return NextResponse.json(
        buildCalculatorValidationErrorPayload({
          issues: [
            {
              message: `Project material catalog cannot override built-in material id "${seedCollision.id}". Create a project copy with a custom id instead.`,
              path: ["materialCatalog", payload.materialCatalog?.findIndex((material) => material.id === seedCollision.id) ?? 0, "id"]
            }
          ],
          route: "estimate"
        }),
        { status: 400 }
      );
    }

    const verifiedCalculatedRequestContext = buildVerifiedCalculatedEstimateRequestContext(payload);
    const [storedMeasuredWallRwAnchors, storedVerifiedCalculatedAnchors] = owner.ok
      ? await Promise.all([
          createDefaultWorkbenchV2MeasuredWallRwAnchorRepository().listActiveWallRwAnchors(owner.scope),
          verifiedCalculatedRequestContext
            ? createDefaultWorkbenchV2VerifiedCalculatedAnchorRepository().listActiveVerifiedCalculatedAnchors(owner.scope)
            : []
        ])
      : [[], []];
    const airborneMeasuredSourceAnchors = mergeMeasuredWallRwAnchors({
      payloadAnchors: payload.airborneMeasuredSourceAnchors ?? [],
      storedAnchors: storedMeasuredWallRwAnchors
    });

    const result = calculateAssembly(payload.layers, {
      airborneContext: payload.airborneContext ?? null,
      airborneMeasuredFrequencySourceAnchors: payload.airborneMeasuredFrequencySourceAnchors ?? null,
      airborneMeasuredSourceAnchors: airborneMeasuredSourceAnchors.length ? airborneMeasuredSourceAnchors : null,
      airborneUserVerifiedCalculatedAnchors:
        verifiedCalculatedRequestContext && storedVerifiedCalculatedAnchors.length ? storedVerifiedCalculatedAnchors : null,
      airborneUserVerifiedCalculatedRequestContext: verifiedCalculatedRequestContext,
      calculator: payload.calculator ?? undefined,
      catalog: payload.materialCatalog ?? [],
      exactImpactSource: payload.exactImpactSource ?? null,
      floorImpactContext: payload.floorImpactContext ?? null,
      impactFieldContext: payload.impactFieldContext ?? null,
      impactPredictorInput: payload.impactPredictorInput ?? null,
      steelFloorFormulaSurface: payload.steelFloorFormulaSurface ?? null,
      targetOutputs: payload.targetOutputs ?? []
    });

    return NextResponse.json({
      ok: true,
      result
    });
  } catch (error) {
    // AGENT COORDINATION 2026-06-24 (Codex): result-shape/Zod errors
    // must return user-safe calculator guidance; raw exception JSON stays
    // in structured issues, not the primary Workbench error string.
    return NextResponse.json(
      buildCalculatorExceptionErrorPayload({
        error,
        fallbackError: "Estimate failed while calculating. Review the calculator inputs and try again.",
        route: "estimate"
      }),
      { status: 500 }
    );
  }
}
