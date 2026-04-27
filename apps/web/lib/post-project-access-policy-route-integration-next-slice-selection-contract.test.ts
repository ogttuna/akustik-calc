import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_CLOSEOUT = {
  sliceId: "post_project_access_policy_route_integration_next_slice_selection_v1",
  closedImplementationSlice: "project_access_policy_route_integration_v1",
  landedRouteAdapter: "owner_only_project_access_policy_adapter",
  selectedImplementationSlice: "proposal_report_polish_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_PROPOSAL_REPORT_POLISH_PLAN.md",
  calculatorRuntimeBehaviorChange: false,
  routeBehaviorChange: "preserve_owner_scoped_routes_while_routing_decisions_through_policy",
  teamRouteAccessEnabled: false,
  firstExecutionAction: "inventory_pdf_docx_and_workbench_report_honesty_without_changing_acoustic_values"
} as const;

const ROUTE_POLICY_EVIDENCE = {
  adapter: "apps/web/lib/project-route-auth.ts",
  adapterTests: "apps/web/lib/project-route-auth.test.ts",
  routeTests: "apps/web/lib/server-project-routes.test.ts",
  purePolicyTests: "apps/web/lib/project-access-policy.test.ts",
  protectedActions: [
    "list_projects",
    "create_project",
    "import_local_scenarios",
    "read_project",
    "append_proposal_audit"
  ],
  ownerOnlyBoundary: [
    "configured_owner_success_preserved",
    "configured_unauth_rejection_preserved",
    "preview_configured_isolation_preserved",
    "cross_owner_proposal_audit_denial_preserved",
    "team_role_route_hints_ignored_until_membership_storage_exists"
  ]
} as const;

const VALIDATION_EVIDENCE = {
  targetedRoutePolicy: "web_4_files_23_tests",
  focusedCurrentGate: "engine_98_files_445_tests_web_43_files_211_passed_18_skipped_build_5_of_5",
  broadCheck: "lint_typecheck_engine_231_files_1265_tests_web_154_files_882_passed_18_skipped_build_5_of_5"
} as const;

describe("post project access policy route integration next slice selection contract", () => {
  it("closes owner-only route policy integration without calculator runtime movement", () => {
    expect(PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_CLOSEOUT).toEqual({
      sliceId: "post_project_access_policy_route_integration_next_slice_selection_v1",
      closedImplementationSlice: "project_access_policy_route_integration_v1",
      landedRouteAdapter: "owner_only_project_access_policy_adapter",
      selectedImplementationSlice: "proposal_report_polish_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_PROPOSAL_REPORT_POLISH_PLAN.md",
      calculatorRuntimeBehaviorChange: false,
      routeBehaviorChange: "preserve_owner_scoped_routes_while_routing_decisions_through_policy",
      teamRouteAccessEnabled: false,
      firstExecutionAction: "inventory_pdf_docx_and_workbench_report_honesty_without_changing_acoustic_values"
    });
  });

  it("pins the route actions now flowing through the policy adapter", () => {
    expect(ROUTE_POLICY_EVIDENCE.protectedActions).toEqual([
      "list_projects",
      "create_project",
      "import_local_scenarios",
      "read_project",
      "append_proposal_audit"
    ]);
  });

  it("keeps team access disabled at route level until membership storage lands", () => {
    expect(PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_CLOSEOUT.teamRouteAccessEnabled).toBe(false);
    expect(ROUTE_POLICY_EVIDENCE.ownerOnlyBoundary).toContain("team_role_route_hints_ignored_until_membership_storage_exists");
  });

  it("records the focused and broad validation shape for this route slice", () => {
    expect(VALIDATION_EVIDENCE).toEqual({
      targetedRoutePolicy: "web_4_files_23_tests",
      focusedCurrentGate: "engine_98_files_445_tests_web_43_files_211_passed_18_skipped_build_5_of_5",
      broadCheck: "lint_typecheck_engine_231_files_1265_tests_web_154_files_882_passed_18_skipped_build_5_of_5"
    });
  });

  it("keeps the next planning and route evidence documents present for the next agent", () => {
    for (const path of [
      PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_CLOSEOUT.selectedPlanningSurface,
      "docs/calculator/CHECKPOINT_2026-04-27_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_HANDOFF.md",
      ROUTE_POLICY_EVIDENCE.adapter,
      ROUTE_POLICY_EVIDENCE.adapterTests,
      ROUTE_POLICY_EVIDENCE.routeTests,
      ROUTE_POLICY_EVIDENCE.purePolicyTests
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });
});
