# Post-Calculator Productization Roadmap

Status: OPEN (authored 2026-04-23)

This document starts only after `good_calculator_final_audit_v1` has
made the calculator audit surface executable. It is intentionally not a
runtime widening plan. Calculator source-backed gaps remain in the
deferral ledger; productization work should not reopen them by inertia.

## Current Product Baseline

- The calculator runtime is test-backed by the focused calculator gate.
- Workbench editing remains browser-local first. A user can explicitly
  sync/load a server-backed project, but this is not shared multi-user
  editing yet.
- Auth exists as an app surface, but production multi-user project
  ownership, billing, persistence, and operational monitoring are not
  yet complete product systems.

## Productization Tracks

### 1. Server-Backed Projects

Goal: make saved work durable across browsers, devices, and users.

Initial scope:

- project records with owner/team scope
- scenario snapshots with versioned calculator inputs and outputs
- migration path from browser-local saved scenarios
- explicit import/export path so local-only users are not trapped
- audit trail for generated proposal/report outputs

Progress note 2026-04-23:

- `server_backed_project_storage_v1` is closed.
- Landed v1: shared project schemas, owner-scoped filesystem
  repository, `/api/projects` routes, browser-local scenario import,
  default workbench server sync/list/load, proposal export audit-event
  append, and focused app/API tests.
- Remaining future work in this track belongs to later database/team
  collaboration slices, not the v1 file-backed storage boundary.

Closed follow-up slice:
`project_access_authorization_v1`

Why next: project persistence now exists, so the next product risk is
making configured-auth, preview isolation, and cross-owner denial
explicitly test-backed before invitations, billing, or collaboration.

Progress note 2026-04-23:

- `project_access_authorization_v1` is closed.
- Landed v1: shared project/proposal route auth helpers, configured-auth
  route rejection tests, authenticated configured owner success,
  preview/configured project isolation, and cross-owner proposal audit
  denial.
- Remaining future work in this track belongs to auth-session hardening,
  team roles/invitations, database storage, and collaboration slices.

### 2. Auth And Multi-User Access

Goal: make project access explicit, reviewable, and supportable.

Initial scope:

- user/team ownership model
- role boundaries for owner, editor, reviewer, viewer
- invitation and revocation flow
- server-side authorization checks on every project and proposal route
- product-safe session handling and logout behavior

Progress note 2026-04-23:

- `project_access_authorization_v1` is closed.
- `auth_session_hardening_v1` is closed.
- `team_access_model_v1` is closed.
- Landed v1/v2/v3: shared project/proposal route auth helpers, owner
  isolation tests, signed session cookie tests, login route tests, and
  logout cookie-clearing tests, plus shared owner/editor/reviewer/viewer
  project-action vocabulary and a pure policy helper with stable denial
  reasons.
- Current productization work is
  `project_access_policy_route_integration_v1`. It should wire the
  policy into existing project/proposal routes through an owner-only
  adapter before invitations, billing, or database storage.
- 2026-04-27 resume note: productization route integration was deferred,
  not cancelled, and is now selected again after the calculator
  private/internal-use readiness chain closed at
  `ui_input_output_honesty_v1` Gate C. The calculator refocus slice
  `wall_formula_family_widening_v1` has since closed honestly no-runtime,
  `wall_resilient_bar_side_count_modeling_v1` has closed with explicit
  side-count exact imports, `floor_field_continuation_expansion_v1` has
  closed as a no-runtime audit, `floor_many_layer_stress_regression_v1`
  has closed as a no-runtime many-layer audit,
  `floor_layer_order_edit_stability_v1` has closed as a no-runtime
  layer-order audit, `all_caller_invalid_thickness_guard_v1` has closed
  as a no-runtime direct input-validity audit,
  `dynamic_airborne_split_refactor_v2` has closed C6, and the
  personal-use readiness chain has closed through heavy-core/concrete,
  timber stud + CLT, floor fallback, and UI/input/output honesty.

### 3. Billing

Goal: separate free/local trial behavior from paid project workflows
without affecting calculator correctness.

Initial scope:

- plan model and entitlement checks
- usage events for project creation, exports, and proposal generation
- billing-provider integration behind a narrow server-side boundary
- no calculator result changes based on plan tier

### 4. Proposal And Report Polish

Goal: turn correct calculator outputs into professional deliverables.

Initial scope:

- stable report templates for floor and wall studies
- clearer provenance summaries for exact, benchmark, formula,
  screening, and fail-closed outputs
- scenario comparison exports
- PDF/DOCX consistency checks
- visual QA against representative long labels and missing-field states

### 5. Deployment And Monitoring

Goal: make production failures visible before users report them.

Initial scope:

- environment validation for DOCX/PDF dependencies
- health checks that include calculator smoke paths
- structured error logging for estimate and proposal routes
- synthetic smoke runs after deploy
- alerting for failed proposal generation and unexpected calculator
  exceptions

### 6. Desktop Optionality

Goal: keep a future desktop app possible without distorting the web
product architecture today.

Initial scope:

- preserve a stable engine API boundary
- keep project persistence behind service interfaces
- avoid browser-only assumptions in report-generation core logic
- evaluate desktop only after server-backed project storage is stable

## Do Not Reopen During Productization

- `GDMTXA04A` direct exact import
- `C11c` exact import
- raw bare open-box/open-web impact
- reinforced-concrete reopening
- timber-stud formula widening
- wall-selector behavior widening

Those are calculator/source slices. Productization work may display
their current honesty notes better, but it must not change their
calculation posture without a selected source-backed slice and new
evidence.

## Completed And Selected Slices

- Completed first slice: `server_backed_project_storage_v1`
  (closed 2026-04-23).
- Completed follow-up slice: `project_access_authorization_v1`
  (closed 2026-04-23).
- Completed follow-up slice: `auth_session_hardening_v1`
  (closed 2026-04-23).
- Completed follow-up slice: `team_access_model_v1`
  (closed 2026-04-23).
- Current selected productization follow-up:
  `project_access_policy_route_integration_v1`.
- Calculator personal/internal-use readiness:
  closed with evidence-tier caveats by `ui_input_output_honesty_v1`
  Gate C.

Reasoning: server-backed persistence is the foundation for auth,
billing, proposal history, collaboration, monitoring context, and any
future desktop sync story. With explicit sync/list/load and the pure
access policy now landed, the next productization step is to make
existing project/proposal route authorization call that policy without
claiming team membership before a real membership source exists. That
work no longer waits behind an open calculator readiness slice, but it
must not alter calculator formulas, values, source posture, output
support, or confidence scores.
