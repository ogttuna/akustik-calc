import {
  getFloorSystemDerivedRwPlusCtr,
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
    estimatedCDb?: number | null;
    estimatedCtrDb?: number | null;
    estimatedRwDb?: number | null;
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
  if (isFiniteNumber(input.metrics?.estimatedRwDb)) {
    return input.metrics?.estimatedRwDb ?? null;
  }

  return isFiniteNumber(input.floorCarrier?.Rw) ? input.floorCarrier?.Rw ?? null : null;
}

function getCarrierCtr(input: TargetOutputSupportInput): number | null {
  if (isFiniteNumber(input.metrics?.estimatedCtrDb)) {
    return input.metrics?.estimatedCtrDb ?? null;
  }

  if (!input.floorCarrier) {
    return null;
  }

  const derivedRwPlusCtr = getFloorSystemDerivedRwPlusCtr(input.floorCarrier);

  if (!isFiniteNumber(derivedRwPlusCtr)) {
    return null;
  }

  return Number(derivedRwPlusCtr) - input.floorCarrier.Rw;
}

function isTargetOutputAvailable(
  output: RequestedOutputId,
  input: TargetOutputSupportInput
): boolean {
  const countBoundSupportAsSupported = input.countBoundSupportAsSupported ?? true;

  switch (output) {
    case "Rw":
      return isFiniteNumber(getCarrierRw(input));
    case "STC":
      return isFiniteNumber(input.metrics?.estimatedStc);
    case "C":
      return isFiniteNumber(input.metrics?.estimatedCDb);
    case "Ctr":
      return isFiniteNumber(getCarrierCtr(input));
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
      return hasAvailableImpactOutput(input.impact, output);
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
