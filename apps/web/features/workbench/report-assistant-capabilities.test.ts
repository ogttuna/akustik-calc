import { existsSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { REPORT_ASSISTANT_ACTION_PROPOSAL_DEFINITIONS } from "./report-assistant-action-proposal";
import {
  getReportAssistantActionProposalCapabilities,
  getReportAssistantRouteCapabilities,
  getReportAssistantRuntimeToolCapabilities,
  hasReportAssistantMutatingModelTool,
  REPORT_ASSISTANT_CAPABILITY_REGISTRY
} from "./report-assistant-capabilities";
import { REPORT_ASSISTANT_PRESET_READ_TOOL_DEFINITIONS } from "./report-assistant-preset-library";
import { REPORT_ASSISTANT_PROJECT_READ_TOOL_DEFINITIONS } from "./report-assistant-project-read-contract";
import { REPORT_ASSISTANT_MCP_TOOL_DEFINITIONS } from "./report-assistant-tools";
import { WORKBENCH_V2_CALCULATOR_ASSISTANT_TOOL_DEFINITIONS } from "../workbench-rebuild/workbench-v2-calculator-assistant";

const ROUTE_DIR = new URL("../../app/api/report-assistant/", import.meta.url);

function actualReportAssistantRoutePathnames(): string[] {
  return readdirSync(ROUTE_DIR)
    .filter((entry) => existsSync(new URL(`${entry}/route.ts`, ROUTE_DIR)))
    .map((entry) => `/api/report-assistant/${entry}`)
    .sort();
}

describe("report assistant capability registry", () => {
  it("has a complete route capability for every report-assistant route", () => {
    const routeCapabilities = getReportAssistantRouteCapabilities();

    expect(routeCapabilities.map((capability) => capability.route?.pathname).sort()).toEqual(
      actualReportAssistantRoutePathnames()
    );
    expect(routeCapabilities.every((capability) => capability.category === "route")).toBe(true);
    expect(routeCapabilities.every((capability) => Boolean(capability.route?.method))).toBe(true);
    expect(routeCapabilities.every((capability) => capability.requiredInputs !== undefined)).toBe(true);
  });

  it("keeps mutating capabilities out of model-exposed tools", () => {
    expect(hasReportAssistantMutatingModelTool()).toBe(false);

    const findingsRoute = REPORT_ASSISTANT_CAPABILITY_REGISTRY.find((capability) =>
      capability.route?.pathname === "/api/report-assistant/findings"
    );

    expect(findingsRoute).toMatchObject({
      exposedToModel: false,
      mutates: true,
      requiresConfirmation: true,
      resultKind: "finding_log"
    });
  });

  it("derives runtime tool capabilities from existing local tool declarations", () => {
    const expectedToolNames = [
      ...REPORT_ASSISTANT_MCP_TOOL_DEFINITIONS,
      ...REPORT_ASSISTANT_PROJECT_READ_TOOL_DEFINITIONS,
      ...REPORT_ASSISTANT_PRESET_READ_TOOL_DEFINITIONS,
      ...WORKBENCH_V2_CALCULATOR_ASSISTANT_TOOL_DEFINITIONS
    ].map((tool) => tool.name);

    const toolCapabilities = getReportAssistantRuntimeToolCapabilities();

    expect(toolCapabilities.map((tool) => tool.name)).toEqual(expectedToolNames);
    expect(toolCapabilities.every((tool) => tool.mutates === false)).toBe(true);
    expect(toolCapabilities.every((tool) => tool.exposedToModel === true)).toBe(true);
    expect(toolCapabilities.map((tool) => tool.name)).not.toContain("apply_report_patch");
  });

  it("derives action proposal capabilities from existing action definitions", () => {
    const actionCapabilities = getReportAssistantActionProposalCapabilities();

    expect(actionCapabilities.map((action) => action.name)).toEqual(
      REPORT_ASSISTANT_ACTION_PROPOSAL_DEFINITIONS.map((action) => action.name)
    );
    expect(actionCapabilities.every((action) => action.mutates === false)).toBe(true);
    expect(actionCapabilities.every((action) => action.previewOnly === true)).toBe(true);
    expect(actionCapabilities.every((action) => action.requiresConfirmation === true)).toBe(true);
    expect(actionCapabilities.every((action) => action.rendererKind === "action_proposal_card")).toBe(true);
  });

  it("declares renderer and stale policy for every capability", () => {
    const names = REPORT_ASSISTANT_CAPABILITY_REGISTRY.map((capability) => capability.name);

    expect(new Set(names).size).toBe(names.length);
    expect(REPORT_ASSISTANT_CAPABILITY_REGISTRY.every((capability) => capability.rendererKind.length > 0)).toBe(true);
    expect(REPORT_ASSISTANT_CAPABILITY_REGISTRY.every((capability) => capability.stalePolicy.length > 0)).toBe(true);
    expect(REPORT_ASSISTANT_CAPABILITY_REGISTRY.every((capability) => capability.authPolicy.length > 0)).toBe(true);
    expect(REPORT_ASSISTANT_CAPABILITY_REGISTRY.every((capability) => capability.providerPolicy.length > 0)).toBe(true);
  });

  it("marks calculator preview as preview-only with no apply affordance", () => {
    const calculatorCapabilities = REPORT_ASSISTANT_CAPABILITY_REGISTRY.filter((capability) =>
      capability.resultKind === "calculator_preview"
    );

    expect(calculatorCapabilities.length).toBeGreaterThan(0);
    expect(calculatorCapabilities.every((capability) => capability.mutates === false)).toBe(true);
    expect(calculatorCapabilities.every((capability) => capability.previewOnly === true)).toBe(true);
    expect(calculatorCapabilities.every((capability) => capability.requiresConfirmation === false)).toBe(true);
    expect(calculatorCapabilities.every((capability) => capability.rendererKind === "calculator_preview_card")).toBe(true);
  });
});
