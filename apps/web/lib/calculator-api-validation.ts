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

export function buildCalculatorValidationErrorPayload(input: {
  issues: readonly CalculatorValidationIssue[];
  route: CalculatorValidationRoute;
}): CalculatorValidationErrorPayload {
  const guidance = input.route === "estimate" ? estimateGuidance(input.issues) : impactOnlyGuidance(input.issues);

  return {
    ok: false,
    ...guidance,
    issues: input.issues
  };
}
