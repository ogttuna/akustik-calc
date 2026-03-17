import { calculateAssembly } from "@dynecho/engine";
import { EstimateRequestSchema } from "@dynecho/shared";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const parsed = EstimateRequestSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid estimate payload.",
          issues: parsed.error.issues
        },
        { status: 400 }
      );
    }

    const payload = parsed.data;
    const result = calculateAssembly(payload.layers, {
      airborneContext: payload.airborneContext ?? null,
      calculator: payload.calculator ?? undefined,
      exactImpactSource: payload.exactImpactSource ?? null,
      impactFieldContext: payload.impactFieldContext ?? null,
      impactPredictorInput: payload.impactPredictorInput ?? null,
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
