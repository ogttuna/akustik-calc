import { MATERIAL_CATALOG_SEED } from "@dynecho/catalogs";
import { calculateAssembly } from "@dynecho/engine";
import { EstimateRequestSchema } from "@dynecho/shared";
import { NextResponse } from "next/server";

import { getAuthState } from "@/lib/auth";
import { buildCalculatorValidationErrorPayload } from "@/lib/calculator-api-validation";

const SEED_MATERIAL_IDS = new Set(MATERIAL_CATALOG_SEED.map((material) => material.id));

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

    const result = calculateAssembly(payload.layers, {
      airborneContext: payload.airborneContext ?? null,
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
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown estimate failure."
      },
      { status: 500 }
    );
  }
}
