# Slice Plan - Wall Formula Family Widening v1

Status: SELECTED (opened 2026-04-23)

## Objective

Improve wall airborne calculation coverage and numerical accuracy without
loosening the existing exact/catalog/benchmark precedence.

The first known target is the `timber_stud_wall` formula-owned gap:
current pinned output is Rw 31 dB / field R'w 24 dB, while similar
manufacturer field stacks are documented in prior project notes as
roughly 45-50 dB. This slice must not jump directly to that number. It
must first build an audit/anchor matrix that explains the current lane,
guards precedence, and defines a defended correction corridor.

## Non-Goals

- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web, or
  wall-selector blocked-source families.
- Do not replace exact/catalog/verified benchmark rows with formula
  outputs.
- Do not change plan tiers, auth, billing, invitations, or project/team
  collaboration behavior.
- Do not add a formula lane that cannot explain its applicability,
  negative cases, and provenance.
- Do not present any formula output as measured or exact.

## Current Baseline

- `good_calculator_final_audit_v1` is closed and the focused calculator
  gate is green.
- Productization slices through `team_access_model_v1` are closed.
- `project_access_policy_route_integration_v1` is deferred, not
  deleted, because it does not improve acoustic accuracy or coverage.
- Wall presets currently cover six defended archetypes and are pinned
  across lab/field/building surfaces.
- `wall_lsf_timber_stud_preset_benchmarks.test.ts` pins:
  - LSF benchmark behavior on the defended Knauf lane,
  - timber-stud formula-owned behavior as a drift guard, not a target.
- `wall_field_continuation_completeness_matrix.test.ts` and
  `wall_physical_invariants_matrix.test.ts` keep I1/I2/I3 green on the
  defended wall preset surface.
- The older
  `docs/archive/analysis/WALL_COVERAGE_EXPANSION_PLAN.md` remains
  backlog context. Its prerequisite guardrails largely landed already:
  wall hostile-input matrix, preset expansion, field continuation pins,
  wall reorder invariance, and 50-layer wall stress coverage.

## First Implementation Step

Start with a no-runtime-value-change audit/anchor pack:

1. Inspect the current wall formula path in:
   - `packages/engine/src/dynamic-airborne.ts`
   - `packages/engine/src/dynamic-airborne-framed-wall.ts`
   - `packages/engine/src/dynamic-airborne-cavity-topology.ts`
   - `packages/engine/src/airborne-calculator.ts`
2. Add an engine test matrix, tentatively
   `packages/engine/src/wall-formula-family-widening-audit.test.ts`,
   that pins current values and trace/provenance for:
   - `timber_stud_wall`
   - `light_steel_stud_wall`
   - representative double-leaf empty cavity
   - representative double-leaf mineral-wool cavity
   - representative single-leaf massive wall where exact/benchmark lanes
     already own the answer
3. In that matrix, prove:
   - exact/catalog/verified benchmark precedence wins over formula lanes,
   - single-leaf, direct-coupled, triple-leaf, missing-thickness, and
     unknown-material cases do not enter the new formula family,
   - existing physical invariants stay green,
   - current timber-stud low output is explicit before any correction.
4. Only after the audit matrix is green, decide whether the first
   runtime cut is:
   - a timber-stud framed-wall correction,
   - a double-leaf cavity-family correction,
   - or a no-runtime closeout with source/research requirements if the
     defended target corridor is still under-specified.

## Runtime Widening Rules

Any runtime correction inside this slice must:

- preserve exact > catalog > benchmark > bound > family/formula >
  low-confidence > unsupported precedence,
- add positive, negative, and precedence tests before implementation,
- update workbench route/card tests if a visible value, label,
  support bucket, provenance string, or warning changes,
- keep `R'w <= Rw`, `Dn,A ~= Dn,w + C`, and defensible
  `DnT,w - Dn,w` ranges green,
- document the formula lane as scoped, not measured.

## Validation

Minimum closeout validation:

- focused new audit/runtime tests,
- `pnpm calculator:gate:current`,
- `pnpm check`,
- `git diff --check`.

If any numeric wall value changes, also run the affected wall web
matrix tests directly before the broad gate.

## Completion Criteria

- The first audit matrix explains the current wall formula-family
  behavior and pins the known timber-stud gap.
- If runtime changes land, they improve a defended wall formula corridor
  without shadowing exact/catalog/benchmark rows.
- If runtime changes do not land, the no-runtime closeout names the
  missing evidence and the next executable test target.
- Docs continue to state that productization route integration is
  deferred, not abandoned.
