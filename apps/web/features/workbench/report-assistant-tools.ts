import {
  normalizeReportAssistantMetricLabel,
  type ReportAssistantContext,
  type ReportAssistantMetric
} from "./report-assistant-context";
import {
  findReportValueMentions,
  validateReportAssistantPatch,
  type ReportAssistantPatch,
  type ReportAssistantPatchValidationResult,
  type ReportAssistantValueMention
} from "./report-assistant-patch";
import {
  prepareReportAssistantFindingRecord,
  type ReportAssistantFindingDraft,
  type ReportAssistantFindingRecord
} from "./report-assistant-finding";
import {
  createReportAssistantPlausibilityReview,
  type ReportAssistantPlausibilityReviewProposalResult,
  type ReportAssistantPlausibilityResearchSettings
} from "./report-assistant-plausibility-research";
import type { ReportAssistantPlausibilityRequest } from "./report-assistant-plausibility";
import type { SimpleWorkbenchProposalDocument } from "./simple-workbench-proposal";

export type ReportAssistantToolName =
  | "find_report_value_mentions"
  | "prepare_calculator_finding"
  | "preview_report_patch"
  | "research_acoustic_reference"
  | "resolve_report_metric_reference";

export type ReportAssistantToolDefinition = {
  description: string;
  mutates: false;
  name: ReportAssistantToolName;
  requiredInputs: readonly string[];
};

export const REPORT_ASSISTANT_MCP_TOOL_DEFINITIONS: readonly ReportAssistantToolDefinition[] = [
  {
    description: "Resolve a user-facing metric phrase against the current report assistant context without guessing.",
    mutates: false,
    name: "resolve_report_metric_reference",
    requiredInputs: ["context", "phrase"]
  },
  {
    description: "Validate a proposed report patch and return a preview without applying it.",
    mutates: false,
    name: "preview_report_patch",
    requiredInputs: ["context", "document", "patch"]
  },
  {
    description: "Find stale literal report value mentions that may need user-approved text edits.",
    mutates: false,
    name: "find_report_value_mentions",
    requiredInputs: ["context", "document", "patch"]
  },
  {
    description: "Run context-only or configured source-bounded plausibility review for one current report metric.",
    mutates: false,
    name: "research_acoustic_reference",
    requiredInputs: ["context", "review"]
  },
  {
    description: "Prepare a calculator review finding record without writing it to the JSONL queue.",
    mutates: false,
    name: "prepare_calculator_finding",
    requiredInputs: ["context", "finding"]
  }
];

export type ReportAssistantMetricResolution = {
  matches: readonly ReportAssistantMetric[];
  status: "ambiguous" | "not_found" | "resolved";
};

export type ReportAssistantToolInvocation =
  | {
      context: ReportAssistantContext;
      name: "resolve_report_metric_reference";
      phrase: string;
    }
  | {
      context: ReportAssistantContext;
      document: SimpleWorkbenchProposalDocument;
      name: "preview_report_patch";
      patch: ReportAssistantPatch;
    }
  | {
      context: ReportAssistantContext;
      document: SimpleWorkbenchProposalDocument;
      name: "find_report_value_mentions";
      patch: ReportAssistantPatch;
    }
  | {
      context: ReportAssistantContext;
      name: "research_acoustic_reference";
      review: ReportAssistantPlausibilityRequest;
      settings?: ReportAssistantPlausibilityResearchSettings | null;
    }
  | {
      context: ReportAssistantContext;
      finding: ReportAssistantFindingDraft;
      name: "prepare_calculator_finding";
    };

export type ReportAssistantToolResult =
  | {
      mutates: false;
      name: "resolve_report_metric_reference";
      ok: true;
      resolution: ReportAssistantMetricResolution;
    }
  | {
      mutates: false;
      name: "preview_report_patch";
      ok: true;
      validation: ReportAssistantPatchValidationResult;
    }
  | {
      mentions: readonly (ReportAssistantValueMention & {
        label: string;
        metricId: string;
      })[];
      mutates: false;
      name: "find_report_value_mentions";
      ok: true;
      validation: ReportAssistantPatchValidationResult;
    }
  | ({
      mutates: false;
      name: "research_acoustic_reference";
    } & ReportAssistantPlausibilityReviewProposalResult)
  | {
      mutates: false;
      name: "prepare_calculator_finding";
      ok: true;
      record: ReportAssistantFindingRecord;
    }
  | {
      errors: readonly string[];
      mutates: false;
      name: ReportAssistantToolName;
      ok: false;
    };

function normalizePhrase(value: string): string {
  return value
    .replace(/[İIı]/gu, "i")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function normalizeLoosePhrase(value: string): string {
  return normalizeReportAssistantMetricLabel(normalizePhrase(value)).replace(/[^a-z0-9]/gu, "");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function metricAliases(metric: ReportAssistantMetric): string[] {
  return [
    metric.id,
    metric.id.replace(/^output:/u, ""),
    metric.label,
    metric.metric,
    metric.outputId
  ].filter((entry): entry is string => Boolean(entry));
}

function phraseContainsAlias(input: {
  alias: string;
  phrase: string;
}): boolean {
  const alias = normalizePhrase(input.alias);
  if (alias.length === 0) {
    return false;
  }

  return new RegExp(`(^|[^a-z0-9'])${escapeRegExp(alias)}([^a-z0-9']|$)`, "u").test(input.phrase);
}

export function resolveReportAssistantMetricReference(input: {
  context: ReportAssistantContext;
  phrase: string;
}): ReportAssistantMetricResolution {
  const phrase = normalizePhrase(input.phrase);
  if (phrase.length === 0) {
    return {
      matches: [],
      status: "not_found"
    };
  }

  const exactMatches = input.context.metrics.filter((metric) =>
    metricAliases(metric).some((alias) => phraseContainsAlias({ alias, phrase }))
  );

  if (exactMatches.length === 1) {
    return {
      matches: exactMatches,
      status: "resolved"
    };
  }

  if (exactMatches.length > 1) {
    return {
      matches: exactMatches,
      status: "ambiguous"
    };
  }

  const loosePhrase = normalizeLoosePhrase(phrase);
  const looseMatches = input.context.metrics.filter((metric) =>
    metricAliases(metric).some((alias) => {
      const looseAlias = normalizeLoosePhrase(alias);
      return looseAlias.length > 1 && (loosePhrase.includes(looseAlias) || looseAlias.includes(loosePhrase));
    })
  );

  if (looseMatches.length === 1) {
    return {
      matches: looseMatches,
      status: "resolved"
    };
  }

  return {
    matches: looseMatches,
    status: looseMatches.length > 1 ? "ambiguous" : "not_found"
  };
}

function metricValueMentions(input: {
  document: SimpleWorkbenchProposalDocument;
  validation: ReportAssistantPatchValidationResult;
}) {
  return input.validation.operations.flatMap((operation) => {
    if (operation.type !== "metric_value") {
      return [];
    }

    return findReportValueMentions(input.document, operation.beforeValue).map((mention) => ({
      ...mention,
      label: operation.label,
      metricId: operation.metricId
    }));
  });
}

export async function runReportAssistantTool(
  invocation: ReportAssistantToolInvocation,
  options?: {
    idFactory?: () => string;
    now?: () => Date;
  }
): Promise<ReportAssistantToolResult> {
  switch (invocation.name) {
    case "resolve_report_metric_reference":
      return {
        mutates: false,
        name: invocation.name,
        ok: true,
        resolution: resolveReportAssistantMetricReference(invocation)
      };

    case "preview_report_patch":
      return {
        mutates: false,
        name: invocation.name,
        ok: true,
        validation: validateReportAssistantPatch(invocation)
      };

    case "find_report_value_mentions": {
      const validation = validateReportAssistantPatch(invocation);
      return {
        mentions: validation.status === "rejected"
          ? []
          : metricValueMentions({
              document: invocation.document,
              validation
            }),
        mutates: false,
        name: invocation.name,
        ok: true,
        validation
      };
    }

    case "research_acoustic_reference": {
      const review = await createReportAssistantPlausibilityReview({
        context: invocation.context,
        request: invocation.review,
        settings: invocation.settings
      });

      return {
        ...review,
        mutates: false,
        name: invocation.name
      };
    }

    case "prepare_calculator_finding": {
      const prepared = prepareReportAssistantFindingRecord({
        context: invocation.context,
        draft: invocation.finding,
        idFactory: options?.idFactory,
        now: options?.now
      });

      return prepared.ok
        ? {
            mutates: false,
            name: invocation.name,
            ok: true,
            record: prepared.record
          }
        : {
            errors: prepared.errors,
            mutates: false,
            name: invocation.name,
            ok: false
          };
    }
  }
}
