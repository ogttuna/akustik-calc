import type {
  AssemblyCalculation,
  FloorSystemSourceType,
  FloorSystemTrustTier,
  ImpactProductCatalogMatchMode,
  ImpactProductCatalogSourceType,
  RequestedOutputId
} from "@dynecho/shared";

import { getConsultantDecisionTrail } from "./consultant-decision-trail";
import {
  getFieldAirborneProvenanceSummary,
  getFieldAirborneReportLines
} from "./field-airborne-provenance";
import {
  formatReinforcedConcreteLowConfidenceAdditionalRowsDetail,
  formatReinforcedConcreteLowConfidenceRankedRowLabel,
  REINFORCED_CONCRETE_LOW_CONFIDENCE_ADDITIONAL_ROWS_LABEL,
  REINFORCED_CONCRETE_LOW_CONFIDENCE_CANDIDATE_ROWS_DETAIL,
  isReinforcedConcreteLowConfidenceFloorLane,
  REINFORCED_CONCRETE_LOW_CONFIDENCE_EVIDENCE_DETAIL_PREFIX,
  REINFORCED_CONCRETE_LOW_CONFIDENCE_TRACE_CANDIDATE_DETAIL
} from "./reinforced-concrete-low-confidence-floor-lane";
import {
  describeAirborneSourcePosture,
  getAirborneBoundaryPosture
} from "./validation-regime";

export type SimpleWorkbenchProposalDecisionItem = {
  detail: string;
  label: string;
  tone: "accent" | "neutral" | "success" | "warning";
};

export type SimpleWorkbenchProposalCitation = {
  detail: string;
  href?: string;
  label: string;
  tone: "accent" | "neutral" | "success" | "warning";
};

export type SimpleWorkbenchEvidencePacket = {
  citations: readonly SimpleWorkbenchProposalCitation[];
  decisionTrailHeadline: string;
  decisionTrailItems: readonly SimpleWorkbenchProposalDecisionItem[];
};

function formatFloorSourceType(sourceType: FloorSystemSourceType): string {
  switch (sourceType) {
    case "official_manufacturer_system_table":
      return "Official manufacturer system table";
    case "official_open_component_library":
      return "Official open component library";
    case "open_measured_dataset":
      return "Open measured dataset";
  }
}

function formatTrustTier(trustTier: FloorSystemTrustTier): string {
  switch (trustTier) {
    case "official_manufacturer":
      return "Official manufacturer";
    case "peer_reviewed_open_access":
      return "Peer-reviewed open access";
  }
}

function formatCatalogSourceType(sourceType: ImpactProductCatalogSourceType): string {
  switch (sourceType) {
    case "official_manufacturer_catalog_pdf":
      return "Official manufacturer catalog PDF";
    case "official_manufacturer_technical_data_pdf":
      return "Official technical data PDF";
  }
}

function formatCatalogMatchMode(matchMode: ImpactProductCatalogMatchMode): string {
  switch (matchMode) {
    case "exact_system":
      return "Exact system row";
    case "lower_bound_support":
      return "Lower-bound support row";
    case "product_property_delta":
      return "Product-property DeltaLw row";
  }
}

function stripReportBulletPrefix(line: string): string {
  return line.replace(/^- /u, "").trim();
}

function buildDynamicImpactAnchorCitation(input: {
  dynamicImpactTrace: NonNullable<AssemblyCalculation["dynamicImpactTrace"]>;
  reinforcedConcreteLowConfidence: boolean;
}): SimpleWorkbenchProposalCitation {
  const { dynamicImpactTrace, reinforcedConcreteLowConfidence } = input;

  return {
    detail: reinforcedConcreteLowConfidence
      ? `${dynamicImpactTrace.selectedLabel} · ${dynamicImpactTrace.evidenceTierLabel} · ${REINFORCED_CONCRETE_LOW_CONFIDENCE_TRACE_CANDIDATE_DETAIL}`
      : `${dynamicImpactTrace.selectedLabel} · ${dynamicImpactTrace.evidenceTierLabel} · ${dynamicImpactTrace.impactBasisLabel}.`,
    label: "Dynamic impact anchor",
    tone:
      dynamicImpactTrace.evidenceTier === "exact"
        ? "success"
        : dynamicImpactTrace.evidenceTier === "estimate"
          ? "accent"
          : "warning"
  };
}

export function buildSimpleWorkbenchEvidencePacket(input: {
  briefNote?: string;
  outputs: readonly RequestedOutputId[];
  result: AssemblyCalculation | null;
  warnings?: readonly string[];
}): SimpleWorkbenchEvidencePacket {
  const { briefNote, outputs, result, warnings = [] } = input;
  const decisionTrail = getConsultantDecisionTrail({
    briefNote,
    guideResult: null,
    outputs,
    result,
    warnings
  });
  const citations: SimpleWorkbenchProposalCitation[] = [];
  const fieldAirborneProvenance = getFieldAirborneProvenanceSummary(result);
  const fieldAirborneLines = getFieldAirborneReportLines(result).map(stripReportBulletPrefix);
  const reinforcedConcreteLowConfidence = isReinforcedConcreteLowConfidenceFloorLane(result);

  if (result?.floorSystemMatch) {
    citations.push({
      detail:
        `${result.floorSystemMatch.system.sourceLabel} · ${formatFloorSourceType(result.floorSystemMatch.system.sourceType)} · ` +
        `${formatTrustTier(result.floorSystemMatch.system.trustTier)} · system id ${result.floorSystemMatch.system.id}.`,
      href: result.floorSystemMatch.system.sourceUrl,
      label: `Exact floor family: ${result.floorSystemMatch.system.label}`,
      tone: "success"
    });
  }

  if (result?.boundFloorSystemMatch) {
    citations.push({
      detail:
        `${result.boundFloorSystemMatch.system.sourceLabel} · ${formatFloorSourceType(result.boundFloorSystemMatch.system.sourceType)} · ` +
        `${formatTrustTier(result.boundFloorSystemMatch.system.trustTier)} · bound system id ${result.boundFloorSystemMatch.system.id}.`,
      href: result.boundFloorSystemMatch.system.sourceUrl,
      label: `Bound floor family: ${result.boundFloorSystemMatch.system.label}`,
      tone: "warning"
    });
  }

  if (reinforcedConcreteLowConfidence && result?.dynamicImpactTrace) {
    citations.push(
      buildDynamicImpactAnchorCitation({
        dynamicImpactTrace: result.dynamicImpactTrace,
        reinforcedConcreteLowConfidence
      })
    );
    citations.push({
      detail: REINFORCED_CONCRETE_LOW_CONFIDENCE_CANDIDATE_ROWS_DETAIL,
      label: "Nearby-row fallback rationale",
      tone: "warning"
    });
  }

  if (result?.floorSystemEstimate) {
    for (const [index, system] of result.floorSystemEstimate.sourceSystems.slice(0, 3).entries()) {
      citations.push({
        detail:
          `${reinforcedConcreteLowConfidence ? REINFORCED_CONCRETE_LOW_CONFIDENCE_EVIDENCE_DETAIL_PREFIX : `${result.floorSystemEstimate.kind.replaceAll("_", " ")} estimate at ${Math.round(result.floorSystemEstimate.fitPercent)}% fit.`} ` +
          `${system.sourceLabel} · ${formatFloorSourceType(system.sourceType)} · ${formatTrustTier(system.trustTier)} · system id ${system.id}.`,
        href: system.sourceUrl,
        label: reinforcedConcreteLowConfidence
          ? `${formatReinforcedConcreteLowConfidenceRankedRowLabel(index)}: ${system.label}`
          : `Estimate anchor ${index + 1}: ${system.label}`,
        tone: result.floorSystemEstimate.kind === "low_confidence" ? "warning" : "accent"
      });
    }

    if (result.floorSystemEstimate.sourceSystems.length > 3) {
      const hiddenRowCount = result.floorSystemEstimate.sourceSystems.length - 3;

      citations.push({
        detail: reinforcedConcreteLowConfidence
          ? formatReinforcedConcreteLowConfidenceAdditionalRowsDetail(hiddenRowCount)
          : `${hiddenRowCount} more estimate anchor rows remain in the current family corridor.`,
        label: reinforcedConcreteLowConfidence
          ? REINFORCED_CONCRETE_LOW_CONFIDENCE_ADDITIONAL_ROWS_LABEL
          : "Additional estimate anchors",
        tone: result.floorSystemEstimate.kind === "low_confidence" ? "warning" : "neutral"
      });
    }
  }

  if (result?.boundFloorSystemEstimate) {
    for (const [index, system] of result.boundFloorSystemEstimate.sourceSystems.slice(0, 2).entries()) {
      citations.push({
        detail:
          `${result.boundFloorSystemEstimate.kind.replaceAll("_", " ")} support at ${Math.round(result.boundFloorSystemEstimate.fitPercent)}% fit. ` +
          `${system.sourceLabel} · ${formatFloorSourceType(system.sourceType)} · ${formatTrustTier(system.trustTier)} · system id ${system.id}.`,
        href: system.sourceUrl,
        label: `Bound estimate anchor ${index + 1}: ${system.label}`,
        tone: "warning"
      });
    }
  }

  if (result?.impactCatalogMatch) {
    citations.push({
      detail:
        `${formatCatalogMatchMode(result.impactCatalogMatch.catalog.matchMode)} · ${formatCatalogSourceType(result.impactCatalogMatch.catalog.sourceType)} · ` +
        `${result.impactCatalogMatch.catalog.referenceFloorType}.`,
      href: result.impactCatalogMatch.catalog.source,
      label: `Official impact product: ${result.impactCatalogMatch.catalog.label}`,
      tone: result.impactCatalogMatch.impact ? "success" : "warning"
    });
  }

  if (fieldAirborneProvenance) {
    citations.push({
      detail: `${fieldAirborneProvenance.detail} ${fieldAirborneProvenance.modeLabel} is the active route label.`,
      label: `Field airborne provenance: ${fieldAirborneProvenance.label}`,
      tone: "accent"
    });
  }

  if (fieldAirborneLines.length > 1) {
    citations.push({
      detail: fieldAirborneLines.slice(1).join(" "),
      label: "Field airborne derivation lines",
      tone: "neutral"
    });
  }

  if (result?.dynamicAirborneTrace) {
    const boundaryPosture = getAirborneBoundaryPosture(result.dynamicAirborneTrace);
    const sourcePosture = describeAirborneSourcePosture(result);

    citations.push({
      detail:
        `${result.dynamicAirborneTrace.detectedFamilyLabel} · ${result.dynamicAirborneTrace.selectedLabel} · ` +
        `${Math.round(result.dynamicAirborneTrace.confidenceScore * 100)}% confidence.` +
        ` ${sourcePosture.label}. ${sourcePosture.detail}` +
        (boundaryPosture ? ` ${boundaryPosture.label}.` : ""),
      label: "Dynamic airborne anchor",
      tone:
        result.dynamicAirborneTrace.confidenceClass === "high"
          ? "success"
          : result.dynamicAirborneTrace.confidenceClass === "medium"
            ? "accent"
            : "warning"
    });
  }

  if (result?.dynamicImpactTrace) {
    if (!reinforcedConcreteLowConfidence) {
      citations.push(
        buildDynamicImpactAnchorCitation({
          dynamicImpactTrace: result.dynamicImpactTrace,
          reinforcedConcreteLowConfidence
        })
      );
    }
  }

  if (citations.length === 0) {
    citations.push({
      detail:
        "No exact family row, product catalog row, or explicit field provenance citation is active yet. Keep the result framed as a scoped dynamic screening route.",
      label: "Source posture",
      tone: "warning"
    });
  }

  return {
    citations,
    decisionTrailHeadline: decisionTrail.headline,
    decisionTrailItems: decisionTrail.items
  };
}
