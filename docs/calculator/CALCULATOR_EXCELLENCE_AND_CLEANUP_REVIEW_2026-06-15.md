# Calculator Excellence And Cleanup Review - 2026-06-15

## Purpose

This is an analysis-only checkpoint. It records the market bar for a
best-in-class acoustic calculator, reconciles that bar with the current
DynEcho implementation posture, and names cleanup guardrails for the
temporary local tooling work. It does not select a new runtime slice and
does not replace the active handoff.

Latest pushed calculator implementation checkpoint before this review:

`2637679 feat(engine): support low-density floating floor calculations`

Current selected calculator work remains:

`post_v1_floor_user_material_low_density_floating_floor_family_coverage_refresh_plan`
/
`packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_FLOATING_FLOOR_FAMILY_COVERAGE_REFRESH_PLAN_2026-06-15.md`

## External Market Bar

INSUL-like tools set the element-level bar: users expect quick
prediction for walls, floors, ceilings, impact noise, and one-third-
octave transmission-loss graphs, not just lookup rows. DynEcho must
match that calculator posture and exceed it for arbitrary user-entered
materials by asking for route-required physical inputs instead of
falling back to catalog names.

SONarchitect/BASTIAN-style tools set the building-level bar: the
calculator must eventually handle ISO 12354 direct and flanking
prediction for airborne, impact, facade, and whole-building contexts.
DynEcho cannot stop at lab `Rw` or `Ln,w`; room volume, element area,
junction/flanking data, receiving-room context, and metric basis have to
be first-class route inputs when building outputs are requested.

The standards landscape reinforces the same split:

- ISO 12354 is the building-prediction family, estimating building
  acoustic performance from element performance.
- ISO 10140 is laboratory measurement context for element performance.
- ISO 16283 is field measurement context.
- ISO 12999 is measurement uncertainty context.
- ASTM E90, E492, and E989 are separate airborne, impact, and IIC
  rating contexts; they must not be aliased from ISO values without an
  owned ASTM route.

Practical takeaway: the best DynEcho calculator is frequency-band
first, basis-strict, input-complete, and honest about `needs_input` or
`unsupported` when a physical route is not owned.

References used for this review:

- https://www.insul.co.nz/
- https://www.soundofnumbers.net/sonarchitect/index.php/en/sonarchitect-iso/isoen12354
- https://www.iso.org/standard/92742.html
- https://www.iso.org/standard/79487.html
- https://www.iso.org/standard/59747.html
- https://www.iso.org/standard/36492.html
- https://store.astm.org/e0090-23.html
- https://store.astm.org/e0492-09r16e01.html
- https://store.astm.org/e0989-21.html

## What Industry-Best Means For DynEcho

1. Frequency-band backbone. Route solvers should increasingly produce
   owned one-third-octave curves and derive `Rw`, `C`, `Ctr`, `STC`,
   `OITC`, `Ln,w`, `DeltaLw`, and IIC-family ratings only through owned
   rating adapters.
2. Element solver plus building solver. Lab element outputs and
   building outputs need separate owners, with room, area, flanking, and
   junction inputs captured explicitly.
3. User materials as physical inputs. Custom materials should calculate
   when density, surface mass, stiffness, flow resistivity, dynamic
   stiffness, load basis, topology, and role data are complete. Names
   should not drive physics when numeric inputs are complete.
4. Calibration and holdout discipline. Measured rows should be exact
   matches, bounded anchors, calibration rows, or holdouts. Source-
   absent formula values cannot validate themselves.
5. Metric and basis integrity. Lab, field, building, ISO, ASTM,
   A-weighted, and spectrum-adapter metrics need separate ownership.
6. Performance hygiene as calculator enabler. Tooling cleanup is useful
   only when it protects the ability to run calculator gates and does
   not change calculator semantics.

## Current Strengths

- The engine already separates exact/source rows, compatible
  anchor-deltas, owned formulas, `needs_input`, and `unsupported`
  outcomes.
- Custom double-leaf/framed wall user materials now calculate when
  explicit topology and physical inputs are supplied.
- Custom heavy floating-floor impact routes use dynamic stiffness and
  load basis instead of guessing.
- Field-only heavy floating-floor requests can calculate from the
  owned lab anchor plus field context.
- Custom low-density floating-floor requests now route through the
  lightweight-concrete family and publish `Rw 53`, `Ln,w 64.3`,
  `DeltaLw 24.3`, `L'n,w 66.3`, `L'nT,w 63.9`, and `L'nT,50 66.9`.
- Generic `IIC` / `AIIC` remains blocked instead of being aliased from
  ISO impact values.

## Current Strategic Gaps

- There is not yet a global one-third-octave backbone across airborne
  and impact routes.
- ISO 12354 building and flanking ownership is still narrow compared
  with the long-term product bar.
- ASTM impact rating ownership remains a boundary, not a solved route.
- User-material physical input capture still needs route-by-route
  completion.
- Formula calibration and holdout packets are uneven across families.
- Historical docs still contain older boundary statements that must be
  read as historical owner context, not current global posture.

## Analysis-Only Decision

Do not start a new runtime slice during the local cleanup window. The
next calculator action remains the low-density floating-floor coverage
refresh. That refresh should:

- re-probe `Rw 53`, `Ln,w 64.3`, `DeltaLw 24.3`, `L'n,w 66.3`,
  `L'nT,w 63.9`, and `L'nT,50 66.9`;
- keep generic `IIC` / `AIIC` unsupported;
- keep generic custom concrete without a low-density/lightweight signal
  on the reinforced/heavy boundary;
- keep heavy custom concrete on the heavy floating-floor basis;
- select the next high-ROI calculator gap only after the refresh lands.

## Cleanup Guardrails

1. Playwright cleanup is safe if it removes generated/cache/output
   state only. Do not remove committed specs, current-gate
   registrations, or calculator fixture evidence.
2. Playwright env cap is safe if it caps resources without skipping
   calculator coverage, weakening assertions, or changing test
   selection.
3. Narrow engine runtime export plus web route import migration is the
   highest-risk cleanup item. Stop if it changes API output shape,
   metric IDs, basis IDs, route selection, solver import order, saved
   replay behavior, report behavior, `/api/estimate`, `/api/impact-only`,
   or current-gate coverage.
4. Tsconfig cleanup is safe for generated `tsbuildinfo` and redundant
   generated Next/Playwright type globs. Stop if path aliases, module
   resolution, declaration output, or Next app type coverage changes
   without validation.
5. Stale `.next-*` cleanup is safe only for confirmed generated Next or
   Playwright build output.

Observed cleanup risk after this review: the local working tree changed
`apps/web/next-env.d.ts` from `./.next/types/routes.d.ts` to a
Playwright-specific generated path,
`./.next-playwright-3189/types/routes.d.ts`. Do not commit that state.
`next-env.d.ts` is generated project-wide Next typing glue and should
not be pinned to a transient Playwright dist. Restore or regenerate it
before committing tsconfig/Playwright cleanup.

Minimum validation after cleanup before calculator runtime work resumes:

- `git diff --check`;
- a focused command for the changed tool/config area;
- `pnpm calculator:gate:current` before any subsequent calculator
  runtime slice.
