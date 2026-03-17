import { calculateImpactOnly } from "@dynecho/engine";
import { ImpactOnlyRequestSchema } from "@dynecho/shared";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const parsed = ImpactOnlyRequestSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid impact-only payload.",
          issues: parsed.error.issues
        },
        { status: 400 }
      );
    }

    const payload = parsed.data;
    const result = calculateImpactOnly(payload.layers, {
      exactImpactSource: payload.exactImpactSource ?? null,
      impactFieldContext: payload.impactFieldContext ?? null,
      impactPredictorInput: payload.impactPredictorInput ?? null,
      officialFloorSystemId: payload.officialFloorSystemId ?? null,
      officialImpactCatalogId: payload.officialImpactCatalogId ?? null,
      sourceLayers: payload.sourceLayers,
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
        error: error instanceof Error ? error.message : "Unknown impact-only failure."
      },
      { status: 500 }
    );
  }
}
