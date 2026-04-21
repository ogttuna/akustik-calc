import {
  getFloorSystemC,
  getFloorSystemCtr,
  type FloorSystemAirborneRatings,
  type ImpactBoundCalculation,
  type ImpactCalculation,
  type RequestedOutputId
} from "@dynecho/shared";

export type TargetOutputSupportInput = {
  countBoundSupportAsSupported?: boolean;
  floorCarrier?: FloorSystemAirborneRatings | null;
  impact: ImpactCalculation | null;
  lowerBoundImpact: ImpactBoundCalculation | null;
  targetOutputs: readonly RequestedOutputId[];
  metrics?: {
    airborneIsoDescriptor?: string | null;
    estimatedCDb?: number | null;
    estimatedCtrDb?: number | null;
    estimatedDnADb?: number | null;
    estimatedDnTADb?: number | null;
    estimatedDnTwDb?: number | null;
    estimatedDnWDb?: number | null;
    estimatedDnTAkDb?: number | null;
    estimatedRwDb?: number | null;
    estimatedRwPrimeDb?: number | null;
    estimatedStc?: number | null;
  };
};

export type TargetOutputSupportResult = {
  supportedImpactOutputs: RequestedOutputId[];
  supportedTargetOutputs: RequestedOutputId[];
  targetOutputs: RequestedOutputId[];
  unsupportedImpactOutputs: RequestedOutputId[];
  unsupportedTargetOutputs: RequestedOutputId[];
};

const IMPACT_OUTPUTS = new Set<RequestedOutputId>([
  "Ln,w",
  "L'n,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "DeltaLw",
  "L'nT,w",
  "L'nT,50",
  "LnT,A",
  "IIC",
  "AIIC",
  "NISR",
  "ISR",
  "LIIC",
  "LIR",
  "HIIC"
]);

function isFiniteNumber(value: number | null | undefined): boolean {
  return typeof value === "number" && Number.isFinite(value);
}

function hasAvailableImpactOutput(
  impact: ImpactCalculation | null,
  output: RequestedOutputId
): boolean {
  return Boolean(impact?.availableOutputs.includes(output));
}

function getCarrierRw(input: TargetOutputSupportInput): number | null {
  if (input.metrics?.airborneIsoDescriptor !== "R'w" && isFiniteNumber(input.metrics?.estimatedRwDb)) {
    return input.metrics?.estimatedRwDb ?? null;
  }

  return isFiniteNumber(input.floorCarrier?.Rw) ? input.floorCarrier?.Rw ?? null : null;
}

function getCarrierRwPrime(input: TargetOutputSupportInput): number | null {
  if (isFiniteNumber(input.metrics?.estimatedRwPrimeDb)) {
    return input.metrics?.estimatedRwPrimeDb ?? null;
  }

  if (input.metrics?.airborneIsoDescriptor === "R'w" && isFiniteNumber(input.metrics?.estimatedRwDb)) {
    return input.metrics?.estimatedRwDb ?? null;
  }

  return null;
}

function getCarrierCtr(input: TargetOutputSupportInput): number | null {
  if (input.floorCarrier) {
    const ctr = getFloorSystemCtr(input.floorCarrier);

    if (!isFiniteNumber(ctr)) {
      return null;
    }

    return ctr ?? null;
  }

  if (isFiniteNumber(input.metrics?.estimatedCtrDb)) {
    return input.metrics?.estimatedCtrDb ?? null;
  }

  return null;
}

function getCarrierC(input: TargetOutputSupportInput): number | null {
  if (input.floorCarrier) {
    const c = getFloorSystemC(input.floorCarrier);

    if (isFiniteNumber(c)) {
      return c ?? null;
    }

    // The floor carrier has no derivable C. Whether we fall through to the
    // curve-rating estimate depends on whether the carrier's declaration
    // of "no C" is authoritative or incidental:
    //
    //   * Curated catalog rows (exact / bound / official) declare their
    //     lab-measured companion semantic authoritatively. If such a row
    //     declares Rw+Ctr or Ctr-only, the lab did not measure C; we must
    //     respect that and NOT fabricate C from the curve rating — this
    //     is what the output-combination-sweep test enforces on UBIQ
    //     bound carpet rows (2026-04-21 regression guard).
    //   * Screening carriers (mass-law curve seed) are not authoritative;
    //     they are derived from the same curve that the metrics estimate
    //     uses. When a screening carrier has no derivable C, suppressing
    //     C would make the supported output set order-sensitive on
    //     asymmetric wall stacks, because the workbench's floor-role
    //     inference is order-sensitive while the underlying curve is not
    //     — the 2026-04-21 reorder-invariance bug.
    //
    // So: fall through to metrics only when the carrier is screening.
    // Otherwise respect the authoritative no-C declaration.
    const basis = (input.floorCarrier as { basis?: string }).basis;
    const isScreeningCarrier = typeof basis === "string" && basis.startsWith("screening_");

    if (!isScreeningCarrier) {
      return null;
    }
  }

  if (isFiniteNumber(input.metrics?.estimatedCDb)) {
    return input.metrics?.estimatedCDb ?? null;
  }

  return null;
}

function isTargetOutputAvailable(
  output: RequestedOutputId,
  input: TargetOutputSupportInput
): boolean {
  const countBoundSupportAsSupported = input.countBoundSupportAsSupported ?? true;

  switch (output) {
    case "Rw":
      return isFiniteNumber(getCarrierRw(input));
    case "R'w":
      return isFiniteNumber(getCarrierRwPrime(input));
    case "STC":
      return isFiniteNumber(input.metrics?.estimatedStc);
    case "C":
      return isFiniteNumber(getCarrierC(input));
    case "Ctr":
      return isFiniteNumber(getCarrierCtr(input));
    case "DnT,w":
      return isFiniteNumber(input.metrics?.estimatedDnTwDb);
    case "DnT,A":
      return isFiniteNumber(input.metrics?.estimatedDnTADb);
    case "DnT,A,k":
      return isFiniteNumber(input.metrics?.estimatedDnTAkDb);
    case "Dn,w":
      return isFiniteNumber(input.metrics?.estimatedDnWDb);
    case "Dn,A":
      return isFiniteNumber(input.metrics?.estimatedDnADb);
    case "Ln,w":
      return (
        hasAvailableImpactOutput(input.impact, output) ||
        (countBoundSupportAsSupported && isFiniteNumber(input.lowerBoundImpact?.LnWUpperBound))
      );
    case "L'n,w":
      return (
        hasAvailableImpactOutput(input.impact, output) ||
        (countBoundSupportAsSupported && isFiniteNumber(input.lowerBoundImpact?.LPrimeNWUpperBound))
      );
    case "CI":
      return hasAvailableImpactOutput(input.impact, output);
    case "CI,50-2500":
      return hasAvailableImpactOutput(input.impact, output);
    case "Ln,w+CI":
      return (
        hasAvailableImpactOutput(input.impact, output) ||
        (countBoundSupportAsSupported && isFiniteNumber(input.lowerBoundImpact?.LnWPlusCIUpperBound))
      );
    case "DeltaLw":
      return (
        hasAvailableImpactOutput(input.impact, output) ||
        (countBoundSupportAsSupported && isFiniteNumber(input.lowerBoundImpact?.DeltaLwLowerBound))
      );
    case "L'nT,w":
      return (
        hasAvailableImpactOutput(input.impact, output) ||
        (countBoundSupportAsSupported && isFiniteNumber(input.lowerBoundImpact?.LPrimeNTwUpperBound))
      );
    case "L'nT,50":
      return hasAvailableImpactOutput(input.impact, output);
    case "LnT,A":
      return hasAvailableImpactOutput(input.impact, output);
    case "IIC":
    case "AIIC":
    case "NISR":
    case "ISR":
    case "LIIC":
    case "LIR":
    case "HIIC":
      return false;
  }
}

export function analyzeTargetOutputSupport(input: TargetOutputSupportInput): TargetOutputSupportResult {
  const targetOutputs = Array.from(new Set(input.targetOutputs));
  const supportedTargetOutputs = targetOutputs.filter((output) => isTargetOutputAvailable(output, input));
  const unsupportedTargetOutputs = targetOutputs.filter(
    (output) => !supportedTargetOutputs.includes(output)
  );
  const supportedImpactOutputs = supportedTargetOutputs.filter((output) => IMPACT_OUTPUTS.has(output));
  const unsupportedImpactOutputs = unsupportedTargetOutputs.filter((output) => IMPACT_OUTPUTS.has(output));

  return {
    supportedImpactOutputs,
    supportedTargetOutputs,
    targetOutputs,
    unsupportedImpactOutputs,
    unsupportedTargetOutputs
  };
}

export function buildTargetOutputWarnings(info: TargetOutputSupportResult): string[] {
  const warnings: string[] = [];

  if (info.unsupportedImpactOutputs.length > 0) {
    warnings.push(
      info.supportedImpactOutputs.length > 0
        ? `Some requested impact sound outputs are still unavailable for the current input/path: ${info.unsupportedImpactOutputs.join(", ")}. DynEcho kept those outputs explicit instead of fabricating unsupported ratings.`
        : `Impact sound outputs are not available for the current input/path: ${info.unsupportedImpactOutputs.join(", ")}. DynEcho kept those outputs explicit instead of fabricating unsupported ratings.`
    );
  }

  const genericUnsupported = info.unsupportedTargetOutputs.filter(
    (output) => !info.unsupportedImpactOutputs.includes(output)
  );

  if (genericUnsupported.length > 0) {
    warnings.push(
      `Unsupported target outputs: ${genericUnsupported.join(", ")}. These outputs were requested but not calculated.`
    );
  }

  return warnings;
}
