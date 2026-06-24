type CalculatorValidationRoute = "estimate" | "impact-only";

type CalculatorValidationIssue = {
  message: string;
  path: Array<number | string>;
};

type CalculatorValidationNextField = {
  action: string;
  label: string;
  path: string;
};

export type CalculatorValidationErrorPayload = {
  errorKind?: "internal_error" | "request_validation" | "result_validation";
  error: string;
  issues: readonly CalculatorValidationIssue[];
  nextField: CalculatorValidationNextField;
  ok: false;
};

function issuePath(issue: CalculatorValidationIssue) {
  return issue.path.map(String).join(".");
}

function hasIssuePath(issues: readonly CalculatorValidationIssue[], path: string) {
  return issues.some((issue) => issuePath(issue) === path);
}

function hasIssueMessage(issues: readonly CalculatorValidationIssue[], pattern: RegExp) {
  return issues.some((issue) => pattern.test(issue.message));
}

function firstIssuePath(issues: readonly CalculatorValidationIssue[]) {
  const firstPath = issues[0] ? issuePath(issues[0]) : "";
  return firstPath.length > 0 ? firstPath : "payload";
}

function estimateGuidance(
  issues: readonly CalculatorValidationIssue[]
): Omit<CalculatorValidationErrorPayload, "issues" | "ok"> {
  if (hasIssuePath(issues, "layers")) {
    return {
      error: "Add at least one wall or floor layer before calculating.",
      nextField: {
        action: "Add one or more layers with material and thickness.",
        label: "Layer stack",
        path: "layers"
      }
    };
  }

  if (hasIssuePath(issues, "targetOutputs")) {
    return {
      error: "Select at least one requested output, or leave the output list empty to use defaults.",
      nextField: {
        action: "Choose a supported output such as Rw, DnT,w, Ln,w, or remove the custom output list.",
        label: "Requested outputs",
        path: "targetOutputs"
      }
    };
  }

  return {
    error: "Review the highlighted estimate inputs before calculating.",
    nextField: {
      action: "Correct the invalid estimate field and run the calculation again.",
      label: "Estimate input",
      path: firstIssuePath(issues)
    }
  };
}

function impactOnlyGuidance(
  issues: readonly CalculatorValidationIssue[]
): Omit<CalculatorValidationErrorPayload, "issues" | "ok"> {
  if (hasIssuePath(issues, "layers") && hasIssueMessage(issues, /at least one source/i)) {
    return {
      error:
        "Add an impact source before running impact-only: visible layers, source layers, exact bands, predictor input, or an official floor/impact source.",
      nextField: {
        action: "Add visible layers, source layers, exact impact bands, predictor input, or an official source id.",
        label: "Impact source",
        path: "layers"
      }
    };
  }

  if (hasIssuePath(issues, "targetOutputs")) {
    return {
      error: "Select at least one requested impact output, or leave the output list empty to use defaults.",
      nextField: {
        action: "Choose a supported output such as Ln,w, DeltaLw, L'n,w, or remove the custom output list.",
        label: "Requested outputs",
        path: "targetOutputs"
      }
    };
  }

  return {
    error: "Review the highlighted impact-only inputs before calculating.",
    nextField: {
      action: "Correct the invalid impact-only field and run the calculation again.",
      label: "Impact-only input",
      path: firstIssuePath(issues)
    }
  };
}

function resultValidationGuidance(
  issues: readonly CalculatorValidationIssue[],
  route: CalculatorValidationRoute
): Omit<CalculatorValidationErrorPayload, "issues" | "ok"> {
  if (hasIssuePath(issues, "ratings.field.partitionAreaM2")) {
    return {
      error: "The calculation needs valid panel area metadata before it can publish field or building outputs.",
      errorKind: "result_validation",
      nextField: {
        action: "Enter positive panel width and height, then run the calculation again.",
        label: "Panel area",
        path: "ratings.field.partitionAreaM2"
      }
    };
  }

  return {
    error:
      route === "estimate"
        ? "The estimate result could not be published safely. Review the highlighted calculator inputs and try again."
        : "The impact-only result could not be published safely. Review the highlighted calculator inputs and try again.",
    errorKind: "result_validation",
    nextField: {
      action: "Review the calculator input that produced the invalid result shape.",
      label: route === "estimate" ? "Estimate result" : "Impact-only result",
      path: firstIssuePath(issues)
    }
  };
}

function isIssueLike(value: unknown): value is CalculatorValidationIssue {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const issue = value as Record<string, unknown>;
  return typeof issue.message === "string" && Array.isArray(issue.path);
}

function extractValidationIssues(error: unknown): readonly CalculatorValidationIssue[] {
  if (typeof error !== "object" || error === null || !("issues" in error)) {
    return [];
  }

  const issues = (error as { issues?: unknown }).issues;
  if (!Array.isArray(issues)) {
    return [];
  }

  return issues.filter(isIssueLike).map((issue) => ({
    message: issue.message,
    path: issue.path
  }));
}

export function buildCalculatorValidationErrorPayload(input: {
  issues: readonly CalculatorValidationIssue[];
  route: CalculatorValidationRoute;
}): CalculatorValidationErrorPayload {
  const guidance = input.route === "estimate" ? estimateGuidance(input.issues) : impactOnlyGuidance(input.issues);

  return {
    ok: false,
    errorKind: "request_validation",
    ...guidance,
    issues: input.issues
  };
}

export function buildCalculatorExceptionErrorPayload(input: {
  error: unknown;
  fallbackError: string;
  route: CalculatorValidationRoute;
}): CalculatorValidationErrorPayload {
  const issues = extractValidationIssues(input.error);

  if (issues.length > 0) {
    return {
      ok: false,
      ...resultValidationGuidance(issues, input.route),
      issues
    };
  }

  return {
    ok: false,
    error: input.fallbackError,
    errorKind: "internal_error",
    issues: [],
    nextField: {
      action: "Review the calculator inputs and run the calculation again.",
      label: input.route === "estimate" ? "Estimate input" : "Impact-only input",
      path: "payload"
    }
  };
}
