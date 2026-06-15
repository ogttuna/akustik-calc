# Post-V1 Companion Metric Completeness Bug Plan - 2026-06-12

## Status

Implemented and locally validated on 2026-06-12 after the user
explicitly selected this bug plan.

Landed movement:

- compatible anchor-delta calculated lab companions now support the
  exact `["C", "Ctr"]` pair request for the already-owned Knauf `416889`
  paired and one-side exterior-board scopes;
- compatible anchor-delta calculated lab companions now keep their
  owner, runtime basis, `supportedMetrics`, and value pins when the same
  request also contains unsupported ASTM impact aliases such as `IIC`
  or `AIIC`; those impact aliases stay unsupported and do not turn the
  wall lab answer into a floor screening trace;
- `ResultAnswerChart` now chooses a primary airborne lane only from
  supported primary outputs (`Rw`, `R'w`, or `DnT,w`) instead of using
  finite helper values when only companion outputs are supported;
- `ResultSummary` now gates `Rw`, `R'w`, `Dn,w`, `Dn,A`, `DnT,w`,
  `DnT,A`, `DnT,A,k`, `STC`, `C`, and `Ctr` cards through
  `supportedTargetOutputs` instead of rendering every finite helper
  metric;
- a companion metric completeness audit contract now pins owned lab
  companion publication and field/building lab-alias boundaries;
- the current calculator gate runner now includes the new audit and
  ResultSummary support-gate regression tests.

Counters for this bug slice:

- `newCalculableRequestShapes: 2` (`C+Ctr` pair for paired and one-side
  compatible exterior-board scopes);
- `newCalculableTargetOutputs: 2` (`C`, `Ctr` together under the same
  request shape);
- `runtimeBasisPromotions: 1` request-shape admission under the existing
  `post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`
  basis;
- `runtimeValuesMoved: 4` request-shape values (`C -1.1`, `Ctr -6`,
  `C -0.6`, `Ctr -5.5`);
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 2`
  (`apps/web/features/workbench/result-answer-chart-model.ts` and
  `apps/web/features/workbench/result-summary.tsx` surface support
  gates).

Validation run:

- `pnpm vitest run packages/engine/src/post-v1-companion-metric-completeness-audit-contract.test.ts packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-owner-contract.test.ts`
- from `apps/web`: `pnpm exec vitest run features/workbench/result-summary-companion-support-gate.test.ts features/workbench/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-surface-parity.test.ts --maxWorkers=1`
- after coverage-refresh sync:
  `pnpm vitest run packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-coverage-refresh-contract.test.ts packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-owner-contract.test.ts packages/engine/src/post-v1-companion-metric-completeness-audit-contract.test.ts`
- detailed pass targeted suite: engine `3` files / `12` tests passed;
  web `6` files / `23` tests passed.
- broader scenario pass after the initial fix:
  - `pnpm vitest run packages/engine/src/post-v1-companion-metric-completeness-audit-contract.test.ts`
    passed `1` file / `5` tests;
  - `pnpm vitest run packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-owner-contract.test.ts packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-coverage-refresh-contract.test.ts`
    passed `2` files / `8` tests;
  - from `apps/web`:
    `pnpm exec vitest run features/workbench/result-answer-chart-model.test.ts features/workbench/result-summary-companion-support-gate.test.ts --maxWorkers=1`
    passed `2` files / `16` tests;
  - from `apps/web`:
    `pnpm exec vitest run features/workbench/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-surface-parity.test.ts --maxWorkers=1`
    passed `1` file / `4` tests.
- `pnpm calculator:gate:current` passed the focused test phases:
  engine `715` files / `3944` tests passed, web `127` files /
  `504` passed + `18` skipped. The first build pass caught a
  `ResultSummary` null-narrowing type error after the support-gate
  hardening; after fixing it, `pnpm build` passed with `5/5` tasks.
  The build kept the known optional `sharp/@img` warnings from the DOCX
  dependency path.
- `git diff --check`

Additional post-fix regression scenarios added after implementation
audit:

- engine: `STC+C`, `STC+Ctr`, and `STC+C+Ctr` compatible anchor-delta
  lab requests without `Rw` remain unsupported even though finite
  `STC`, `C`, and `Ctr` helper values exist internally;
- web summary: `Ctr`-only supported companion output renders the
  traffic-noise adaptation term without leaking unsupported `STC` or
  `C`.

Detailed scenario audit findings added after the broader post-fix pass:

- compatible anchor-delta lab companion request shapes are now tested as
  a matrix: singleton `STC`, singleton `C`, singleton `Ctr`, `C+Ctr`,
  `Rw+STC`, `Rw+C`, `Rw+Ctr`, `Rw+C+Ctr`, `Rw+STC+C`,
  `Rw+STC+Ctr`, and full `Rw+STC+C+Ctr` all stay on
  `wall.compatible_anchor_delta.calculated_lab_companions` only when the
  Knauf `416889` reduced-stack scope, element-lab basis, and compatible
  exterior-board delta are present.
- adjacent but unowned lab request shapes remain closed:
  `STC+C`, `STC+Ctr`, and `STC+C+Ctr` without `Rw` are unsupported,
  because the owner deliberately admits `STC` singleton, `C/Ctr`
  singleton/pair, or `Rw+companions`; it does not globally publish every
  arbitrary partial companion bundle.
- basis and scope guards remain closed: building-basis `C+Ctr` and
  non-Knauf `C+Ctr` do not use the Knauf calculated lab companion owner.
- the detailed surface audit found one broader support-gate leak in the
  same bug class: companion-only answers could make finite primary `Rw`
  chart/summary cards and ISO composite cards visible, and finite
  unsupported field/building helper metrics could make `R'w`, `Dn,w`,
  `Dn,A`, `DnT,w`, or `DnT,A` summary cards visible. Chart and summary
  now gate those cards through `supportedTargetOutputs`, matching the
  report/status ownership posture.
- the broader scenario pass found a second bug in the same class:
  adding unsupported impact aliases (`IIC`/`AIIC`) to an otherwise owned
  compatible anchor-delta lab request kept the numeric support buckets
  mostly correct but contaminated the selected resolver trace with the
  floor source-absent screening candidate. That could mislead reports,
  audits, or future adapters even though the visible values looked
  plausible. The fix keeps the active wall lab owner selected when the
  supported outputs are wall lab companions and the only extra outputs
  are unsupported ASTM impact aliases.
- the same pass also rechecked the inverse boundary: building-basis
  `R'w`/`Dn,w`/`DnT,w` plus lab aliases and `IIC` stays on the Gate AR
  building owner for the field/building metrics, keeps `STC`, `C`,
  `Ctr`, and `IIC` unsupported, and does not accidentally select the lab
  companion owner.

Detailed validation added in this pass:

- engine audit: 11 owned compatible anchor-delta lab request shapes,
  three owned lab request shapes with unsupported ASTM impact aliases,
  three adjacent unowned lab request shapes, building-basis `C+Ctr`,
  building-basis lab aliases plus `IIC`, and non-Knauf `C+Ctr`;
- web support gate: unsupported finite `STC/C/Ctr`, C-only, Ctr-only,
  STC-only, C+Ctr-only, supported A-weighted field/building outputs
  without leaking finite base metrics, unsupported finite field/building
  cards, and full companion rendering;
- chart regression: existing chart model/render tests plus
  companion-only airborne answers and unsupported finite field/building
  helper metrics remain gated after primary-lane support gating.

Workbench-v2 browser validation added after the user clarified the
active product surface:

- authoritative browser QA was limited to `/workbench-v2`; the older
  `/workbench` calculator surface is not used as product evidence for
  this bug class;
- the only `/workbench/...` path included in this browser pass is the
  report preview/editor opened by the current `/workbench-v2`
  `Open report` button, so it is treated as the V2 report surface rather
  than as the deprecated calculator workbench;
- V2 wall default request stayed clean: `Rw` selected alone produced
  `Rw 57 dB` as a calculated output;
- V2 wall full lab companion request with `Rw`, `STC`, `C`, and `Ctr`
  produced `Rw 57 dB`, `STC 57 dB`, `C -1.1 dB`, and `Ctr -6 dB`, and
  the V2-opened report preview showed the same measured/predicted
  indices;
- V2 wall companion-only request with `C` and `Ctr` selected but `Rw`
  unselected produced only `C -1.1 dB` and `Ctr -6 dB`; the primary
  report value became `C -1.1 dB`, and unsupported/unrequested `Rw` did
  not leak into the report table;
- V2 wall mixed field/building request with `Rw`, `R'w`, `DnT,w`,
  `STC`, `C`, and `Ctr` initially kept `R'w` and `DnT,w` parked behind
  missing route inputs while keeping owned lab companions visible; after
  entering field context inputs, it produced `Rw 55 dB`, `R'w 55 dB`,
  `DnT,w 59 dB`, `STC 55 dB`, `C -1.1 dB`, and `Ctr -5.8 dB`;
- the corresponding V2 API request carried
  `targetOutputs:["Rw","R'w","DnT,w","STC","C","Ctr"]` and the
  selected trace stayed on the wall field adapter
  `wall.airborne_field_context.field_apparent_adapter` with runtime
  basis `gate_i_airborne_field_apparent_context_adapter_runtime`, so no
  floor-route or unsupported-impact trace contaminated the wall answer;
- V2 floor mode switch did not retain stale wall answers: after
  switching from Wall to Floor, the selected output reset to `Ln,w`, the
  visible result became `Needs Load basis`, and the API request carried
  only the visible floor layer stack plus `targetOutputs:["Ln,w"]`;
- after entering `loadBasisKgM2: 200`, the V2 floor impact request for
  `Ln,w` and `DeltaLw` produced `Ln,w 52.5 dB` and `DeltaLw 22 dB`
  from `floor.heavy_concrete_floating_floor.lab_impact_formula`;
- adding V2 floor companion/boundary outputs `CI` and `CI,50` did not
  fabricate finite values: the API request carried
  `targetOutputs:["Ln,w","DeltaLw","CI","CI,50-2500"]`,
  `supportedTargetOutputs:["Ln,w","DeltaLw"]`, and
  `unsupportedTargetOutputs:["CI","CI,50-2500"]`; the UI showed `CI`
  and `CI,50-2500` as unsupported, and the V2-opened report preview
  measured/predicted table included only `Ln,w 52.5 dB` and
  `DeltaLw 22 dB`;
- V2 currently exposes ISO floor impact outputs such as `Ln,w`,
  `DeltaLw`, `CI`, and `CI,50`, but not the unsupported ASTM impact
  aliases `IIC` and `AIIC`; the ASTM alias contamination is therefore
  covered by engine/API contracts rather than by a user-clickable V2
  checkbox at this checkpoint.

This plan documents a bug class reported from user-visible behavior:
DynEcho can appear to provide `Rw`, `R'w`, `Dn,w`, or `DnT,w` while
related companion metrics such as `C`, `Ctr`, or `STC` are missing,
hidden, or inconsistently shown across surfaces.

This document does not override the current selected next calculator
handoff. As of this checkpoint, the active selected next remains the
floor user-material impact context dynamic-stiffness coverage refresh:

- `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_COVERAGE_REFRESH_PLAN_2026-06-12.md`
- `packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts`

This document still does not replace the active floor selected-next
handoff; it records an explicitly selected bug-fix slice and its
closeout.

## Goal

Make companion metric behavior correct and predictable without weakening
metric-basis ownership.

The goal is not "show every finite number". The goal is:

1. expose `C`, `Ctr`, `STC`, and similar companions when the selected
   route owns the curve, adapter, or measured value needed to derive
   them;
2. keep companions unsupported when the selected route owns only a
   scalar metric, exact single-number row, direct anchor-delta metric,
   field/building adapter, or missing physical input boundary;
3. make engine, API, workbench cards, chart, summary, saved replay, and
   reports agree on the same support buckets.

## Why This Matters

Companion metrics are not cosmetic. They are part of the acoustic answer
users rely on when comparing constructions, checking design targets, and
explaining a result to a client or reviewer.

If an owned route can derive `C`, `Ctr`, or `STC` but DynEcho hides
them, the calculator looks incomplete even though it has already done
the hard calculation. This damages scope: fewer requested output sets
look calculable than should.

If DynEcho displays `C`, `Ctr`, or `STC` only because finite internal
numbers exist, without proving metric ownership, the calculator
overclaims. This damages accuracy and trust: the result looks more
complete than the selected route actually supports.

Therefore this bug class sits directly in the product north star:
calculate more valid layer/output combinations, but only when the
physical route, metric basis, and adapter ownership are defensible.

## Position In The Whole Calculator Direction

This plan belongs under the long-range "Companion Metric Completeness"
and "Frequency-Band Solver Backbone" work streams in
`docs/calculator/INDUSTRY_GRADE_CALCULATOR_DIRECTION.md`.

It is not a broad UI polish item and not a source-row catalog task. It
is calculator behavior because it decides which target outputs are
actually owned answers for a user-entered layer stack.

The correct order is:

1. preserve the active selected next slice unless the user explicitly
   selects this bug;
2. audit companion gaps without moving values;
3. harden surfaces that display unsupported finite metrics;
4. promote only narrow, owned companions with trace and surface parity;
5. rerank broader owned-spectrum companion gaps after the narrow fix.

This keeps the work aligned with the current post-V1 process: every
value-moving step must name calculable request shapes, promoted target
outputs, runtime basis promotions, unchanged boundaries, and validation
tests.

## Bug Symptom

Users can see a route calculate an airborne answer such as `Rw` or
`R'w`, while expected companion metrics are absent or inconsistent.
Examples of the symptom class:

- a route has an owned one-third-octave airborne curve and publishes
  `Rw`, but `C`, `Ctr`, or `STC` are not surfaced even though they are
  derivable from the same owned curve;
- a surface displays `C`, `Ctr`, or `STC` because finite metric values
  exist, even though the engine has placed those target outputs in
  `unsupportedTargetOutputs`;
- automatic output presets ask for some companions but not their paired
  companion, producing incomplete user-facing output sets;
- narrow owner request shapes support `C` alone and `Ctr` alone but not
  a `C+Ctr` pair request, even when both values come from the same
  already-owned adapter.

## Definitions

Use these terms consistently while implementing this plan.

- Finite metric: a numeric value exists in `metrics`, `ratings`,
  `impact`, or a carrier object. A finite metric is necessary but not
  sufficient for publication.
- Supported output: the requested output appears in
  `supportedTargetOutputs` after all route, basis, owner, and boundary
  filters run.
- Unsupported output: the requested output appears in
  `unsupportedTargetOutputs` because the route does not own that metric
  for the current basis, or because required inputs/evidence are absent.
- Owned companion: a companion metric whose source is an owned measured
  value, owned one-third-octave curve, owned rating adapter, or owned
  field/building conversion for that exact basis.
- Lab alias: a lab metric such as `Rw`, `STC`, `C`, or `Ctr` being
  treated as if it were a field or building metric, or vice versa.
  These aliases must remain blocked unless a specific adapter owns the
  conversion.
- Surface support gate: a UI/API/report path that checks
  `supportedTargetOutputs` before rendering a metric as a live answer.

## Expected Consequences

After the plan is implemented correctly:

- users should see a complete companion set when the route owns the
  curve/adapter needed for that set;
- users should see explicit `unsupported` or `needs_input` posture when
  a companion is not owned;
- the summary panel should no longer show `STC`, `C`, or `Ctr` merely
  because finite internal fields exist;
- engine trace, support buckets, cards, chart, status, API, saved
  replay, and reports should agree;
- exact measured rows and scalar-only routes should not become broader
  than their evidence;
- future companion work should have a repeatable audit pattern instead
  of relying on ad hoc route-specific memory.

## Implementation Alignment Audit - 2026-06-12

This section cross-checks the plan against the current implementation.
It is meant to prevent a future agent from applying a broad fix in the
wrong layer.

### Engine Support Pipeline

Current shape:

1. `packages/engine/src/target-output-support.ts` determines initial
   support from finite metrics and carrier semantics.
2. `packages/engine/src/calculate-assembly.ts` then repeatedly moves
   outputs between supported and unsupported buckets.
3. Exact source, anchor-delta, floor exact rows, field/building alias
   blocking, parked route-input boundaries, and post-V1 companion
   promotions all happen after initial support.
4. The final visible support is written to result fields such as
   `supportedTargetOutputs` and `unsupportedTargetOutputs`.

Implication:

- do not change `target-output-support.ts` as the first fix;
- do not make initial support stricter just to hide one surface bug;
- do not make initial support broader to publish companions globally;
- any runtime companion promotion belongs in the route-specific owner
  layer after exact/anchor/basis boundaries have run.

Concrete code anchors:

- `moveSupportedOutputsToUnsupported(...)` and
  `moveUnsupportedOutputsToSupported(...)` in
  `packages/engine/src/calculate-assembly.ts`;
- `getFiniteRequestedUnsupportedLabSpectrumOutputs(...)` in
  `packages/engine/src/calculate-assembly.ts`;
- exact measured metric scope and anchor-delta metric scope helpers in
  `packages/engine/src/calculate-assembly.ts`;
- floor carrier `C` / `Ctr` authority rules in
  `packages/engine/src/target-output-support.ts`.

### Surface Pipeline

Current shape:

- `result-answer-chart-model.ts` already uses
  `isSupportedAnswerOutput(...)` before rendering `STC`, `C`, or
  `Ctr` companions.
- `simple-workbench-output-model.ts` first checks
  `isExplicitlyUnsupportedOutput(...)`, so explicit unsupported outputs
  become "Not ready" cards before finite metric values are considered.
- `compose-workbench-report.ts` uses `isSupportedAnswerOutput(...)`
  before writing scoped airborne report lines.
- `target-output-status.ts` uses support buckets to mark live,
  unsupported, or needs-input posture.
- `result-summary.tsx` is the outlier: it renders `STC` and
  `C / Ctr` when an airborne answer is visible, without individually
  checking `isSupportedAnswerOutput(...)`.

Implication:

- Phase 2 should touch `result-summary.tsx` and a focused summary test
  only;
- do not rewrite card, chart, report, or status logic unless the audit
  finds a separate support-gate failure;
- use chart/report behavior as the model for summary behavior.

### Compatible Anchor-Delta C/Ctr Pair

Current shape:

- `post-v1-wall-compatible-anchor-delta.ts` has
  `isCOrCtrOnlyCalculatedLabCompanionRequest(...)`, which admits only a
  singleton `C` or singleton `Ctr` request.
- The mixed lab request path already admits requests containing `Rw`
  plus any calculated lab companions, as long as all outputs are in the
  lab companion set.
- Existing C/Ctr-only owner tests prove singleton `C` and singleton
  `Ctr` are supported for the Knauf `416889` paired and one-side
  exterior-board scope.
- The same tests currently pin the `["C", "Ctr"]` pair as unsupported.

Implication:

- a future C/Ctr pair owner should not create a new formula;
- a future C/Ctr pair owner should not create a new runtime basis method
  unless there is a specific reason;
- the likely code change is a narrow request-shape predicate widening
  that admits exactly `["C", "Ctr"]` under the existing calculated lab
  companion basis;
- existing singleton values and direct `Rw` behavior must remain byte
  stable.

### Resolver Trace And Owner Audit

Current shape:

- `dynamic-calculator-candidate-resolver-runtime.ts` maps the compatible
  anchor-delta lab companion runtime basis method to
  `wall.compatible_anchor_delta.calculated_lab_companions`.
- The rating adapter IDs already include the ISO 717 curve adapter for
  `C` and `Ctr`, and the ASTM E413 adapter for `STC`.
- `acoustic-answer-engine-v1-owner-audit.ts` detects supported outputs
  that are not owned by resolver trace `supportedMetrics`, except for
  explicitly allowed companion outputs.

Implication:

- every value-moving companion change must update or preserve
  `supportedMetrics`;
- `valuePins` should list the promoted companion values;
- an implementation that only changes cards or support arrays is
  incomplete if the trace still says the candidate owns different
  metrics;
- owner audit warnings should be treated as blockers, not hidden.

### Current Worktree And Parallel Agent Guard

The active selected calculator handoff is unrelated to this bug plan.
The worktree is also expected to be dirty because parallel agents may
touch calculator and workbench files.

Implementation rule:

- before starting any phase, run `git status --short` and re-read every
  file to be touched;
- do not overwrite unrelated changes in `calculate-assembly.ts`,
  workbench files, docs, project persistence, or material-editor files;
- if another agent has changed a target file, compare current behavior
  again before applying this plan.

## Current Implementation Findings

### 1. Metric Values And Metric Support Are Separate Data Planes

`calculateAssembly` computes finite metric fields early, then later
applies owner and basis boundaries to build the visible support buckets.
This separation is intentional and must be preserved.

Relevant implementation points:

- `packages/engine/src/calculate-assembly.ts`
  - `analyzeTargetOutputSupport(...)` receives finite `estimatedCDb`,
    `estimatedCtrDb`, `estimatedRwDb`, `estimatedRwPrimeDb`,
    `estimatedStc`, `Dn*`, and impact metrics.
  - later `moveSupportedOutputsToUnsupported(...)` and
    `moveUnsupportedOutputsToSupported(...)` repeatedly adjust
    `supportedTargetOutputs` and `unsupportedTargetOutputs`;
  - exact source, anchor-delta, floor exact row, field/building alias,
    and post-V1 companion promotions happen after the initial finite
    metric scan.

Consequence: a finite `estimatedCDb` or `estimatedCtrDb` does not by
itself mean `C` or `Ctr` is a supported answer.

Why this is correct:

- some formulas compute helper curves or fallback terms for internal
  ranking even when the selected candidate does not own publication of
  every derived rating;
- exact measured rows can coexist with finite calculated estimates, but
  exact-source ownership must win for publication;
- field/building adapters can produce direct building metrics while
  leaving lab companions separate.

How this can fail:

- a surface reads `metrics.estimatedCDb` directly and renders it as a
  live card;
- a new owner moves `supportedTargetOutputs` but forgets to update
  resolver trace `supportedMetrics` or value pins;
- a helper promotes `C` for one request shape but forgets equivalent
  `C+Ctr` or `Rw+STC+C+Ctr` shapes.

### 2. Some Existing Boundaries Are Correct And Must Not Be Weakened

The following are correct safety boundaries:

- Exact measured source rows only own the measured metric they actually
  carry. Do not infer unmeasured `C`, `Ctr`, or `STC` from nearby finite
  screening values.
- Compatible anchor-delta direct `Rw` owns direct `Rw` only unless a
  separate calculated companion owner is active.
- Exact floor/catalog rows can authoritatively declare no `C` or no
  `Ctr`; the calculator must not fabricate missing companions from an
  incidental curve estimate.
- Field and building adapters must not become lab alias shortcuts.
  `R'w`, `Dn,w`, `DnT,w`, `Dn,A`, and `DnT,A` are not proof that lab
  `Rw`, `STC`, `C`, or `Ctr` are owned for that same request.

Relevant implementation points:

- `packages/engine/src/calculate-assembly.ts`
  - exact measured source unsupported scope;
  - anchor-delta unsupported scope;
  - Gate AR building lab alias blocking.
- `packages/engine/src/target-output-support.ts`
  - floor carrier `C` / `Ctr` authority rules.
- `packages/engine/src/post-v1-wall-compatible-anchor-delta.ts`
  - direct anchor-delta warning and separate lab companion owner warning.

Why this is correct:

- acoustic ratings are basis-specific. A lab value, field apparent
  value, building normalized value, ASTM value, and A-weighted value are
  not interchangeable labels;
- measured evidence is only as broad as the measured metric and basis;
- calculated companions are acceptable only when the route owns the
  calculation path and states that ownership.

What would break if weakened:

- exact source rows would overstate their evidence;
- field/building outputs could be mistaken for lab ratings;
- compatible anchor-delta could silently publish calculated companions
  as if the manufacturer source measured them;
- owner audit warnings would either fire constantly or become useless.

### 3. Owned-Spectrum Companion Promotion Exists But Is Ad Hoc

The engine already has route-specific helpers that re-promote requested
companions when a route owns enough spectrum/adapter basis:

- framed calibration lab spectrum companion;
- source-absent building lab spectrum companion;
- heavy composite building lab spectrum companion;
- Gate AR building direct-curve lab companion;
- open-box finished-package floor airborne/impact companions;
- compatible anchor-delta calculated lab companions.

These helpers are value-protecting, but the pattern is scattered. That
increases the chance that a new route exposes `Rw` but forgets to expose
derivable `C`, `Ctr`, or `STC`, or exposes one request shape but not a
closely equivalent one.

Why this is a design smell:

- every new formula route must remember the same companion publication
  questions;
- surface tests can pass for one request shape while a closely related
  request shape stays unsupported;
- future agents can mistake an omission for a deliberate boundary, or a
  deliberate boundary for an omission.

This plan does not require immediate abstraction. The safer near-term
step is an audit contract that documents each route family and selected
request shape. A later cleanup can consolidate helper logic only after
the current behavior is pinned.

### 4. Workbench Surfaces Are Not Equally Support-Gated

Some web surfaces correctly gate companion display through
`supportedTargetOutputs`:

- `apps/web/features/workbench/result-answer-chart-model.ts`
- `apps/web/features/workbench/simple-workbench-output-model.ts`
- `apps/web/features/workbench/compose-workbench-report.ts`
- `apps/web/features/workbench/target-output-status.ts`

One high-visibility surface is suspect:

- `apps/web/features/workbench/result-summary.tsx`

`ResultSummary` currently shows `STC` and the `C / Ctr` spectrum
adaptation card when an airborne answer is visible, instead of checking
whether `STC`, `C`, and `Ctr` are individually supported. This can make
the surface display finite companion metrics that the engine has
explicitly parked as unsupported.

Why this is likely the most user-visible bug:

- the summary panel is high on the result page and can be interpreted as
  the authoritative answer;
- charts, cards, status rows, and reports may correctly hide a metric
  while the summary still shows it;
- this creates the impression that DynEcho is inconsistent or that some
  parts of the UI are "losing" calculated values.

Fixing this surface first is safe because it should not move engine
runtime values. It makes the UI obey the support contract already
produced by the engine.

### 5. Request Presets Can Hide Otherwise Derivable Companions

Wall lab presets request `Rw`, `STC`, `C`, and `Ctr`, but wall field and
building presets include `Ctr` without `C`:

- `apps/web/features/workbench/simple-workbench-constants.ts`

This might be intentional for some field/building contexts, but it
should be audited. If an owned route can derive both `C` and `Ctr` on
the same basis, automatic presets should not accidentally create an
incomplete companion set.

Do not change presets until the audit says which routes own the missing
companion. A preset change can expand user-visible unsupported rows and
affect saved scenario expectations. It is valid later, but it should
follow the audit rather than lead it.

### 6. Compatible Anchor-Delta C/Ctr Pair Is A Narrow Candidate Gap

The compatible anchor-delta C/Ctr-only owner currently supports
`C`-only and `Ctr`-only requests, but explicitly pins the `["C", "Ctr"]`
pair as unsupported.

Relevant contracts:

- `packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-owner-contract.test.ts`
- `apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-surface-parity.test.ts`

This looks like a narrow request-shape gap, not a formula gap: the
paired and one-side values already come from the calculated lab
companion owner. It is a good candidate after the audit/hardening phase,
provided the owner trace, supported metrics, value pins, API, cards,
reports, and saved replay all move together.

Why this is a good narrow candidate:

- it does not require a new formula;
- it does not require a new source row;
- it uses an already-owned calculated direct curve and ISO 717 adapter;
- it affects a small, testable request shape;
- adjacent boundaries are already well documented and can stay pinned.

Why it should not be first:

- the surface support-gate issue can cause misleading display even for
  otherwise correct engine behavior;
- the audit should prove whether this is the highest-confidence
  companion bug after the current selected next closes.

## Root Cause Analysis

This bug class has three likely root causes:

1. Finite metric fields are globally present, while metric ownership is
   route-specific. Surfaces or helpers can accidentally read finite
   values without checking support ownership.
2. Companion promotion is implemented as many route-specific
   post-processing helpers rather than one explicit companion ownership
   ledger. That makes omissions easy.
3. Target output request shapes influence support. Some owners support
   narrow singleton or mixed requests but not equivalent paired
   companion requests.

There is also an architectural tension:

- calculator internals need broad finite metrics for screening,
  ranking, charting, warnings, and candidate comparison;
- user-facing publication must be narrower and evidence-owned.

That tension is healthy only if every publication surface obeys the
same support gate. The bug appears when a layer of the system treats
finite metrics as publishable metrics without checking the support
bucket and owner trace.

## Non-Goals

Do not implement any of the following as part of this bug fix:

- global rule: "if `Rw` is finite, publish `C`, `Ctr`, and `STC`";
- global rule: "if `R'w`, `Dn,w`, or `DnT,w` is finite, publish lab
  `C`, `Ctr`, or `STC`";
- fabricate `C` or `Ctr` for exact measured rows that do not own those
  terms;
- treat direct anchor-delta `Rw` as measured companion evidence;
- carry lab spectrum companions into field/building outputs without an
  owned basis conversion;
- change unrelated material-editor, auth/storage, report polish, or
  project persistence work.

Also do not use this bug plan to:

- rerank all source catalogs;
- import broad manufacturer tables;
- reduce or remove existing `needs_input` prompts;
- silently add engineering defaults for missing physical inputs;
- weaken thick-board, field/building, exact-source, floor-carrier, or
  anchor-delta boundaries to make companion counts look better.

## Design Principles And Best Practices

Use these rules while implementing any phase of this plan.

1. Support is owned, not inferred.
   A metric is live only when the selected route owns that metric for
   the requested basis.

2. A finite number is evidence to inspect, not permission to publish.
   Always ask why that number exists and whether the selected candidate
   owns it.

3. Companion promotion must move as a bundle.
   Move `supportedTargetOutputs`, resolver trace `supportedMetrics`,
   value pins, warnings, cards, chart, summary, report, API, and saved
   replay together.

4. Boundaries are product quality.
   `unsupported` and `needs_input` are correct outputs when ownership or
   physical inputs are absent.

5. Request-shape independence matters.
   If `C` and `Ctr` singleton requests are owned by the same route, an
   equivalent `C+Ctr` pair should either be supported or have an
   explicit documented reason for being unsupported.

6. Lab, field, building, ASTM, ISO, and A-weighted metrics are separate
   bases.
   Do not let one basis leak into another through shared display labels.

7. Surface parity is part of calculator correctness.
   A route is not fully landed until web/API/report surfaces show the
   same support posture as the engine.

8. Audit before widening.
   When the blast radius is unclear, first add no-runtime audit rows;
   then implement the narrowest value-moving owner.

9. Prefer route-owned helpers over generic magic.
   A generic helper is useful only if it still requires explicit route
   ownership and basis classification.

10. Preserve user-material and physical-input direction.
    Companion work should not distract from the broader dynamic
    calculator goal: more layer combinations become calculable through
    owned physical inputs and formulas.

## Risk Analysis

### Risk: False Companion Publication

Publishing companions from finite metrics without owner checks would
make the calculator look more complete while weakening correctness.
This is worse than returning unsupported.

Mitigation:

- every promoted companion must have a selected candidate, runtime
  basis, supported metric, and value pin or equivalent owned carrier;
- owner audit must stay green.

### Risk: Breaking Exact Source Semantics

Exact rows are high-trust evidence. If an exact measured row only owns
`Rw`, publishing `C` or `Ctr` would overclaim the source.

Mitigation:

- preserve exact measured metric unsupported tests;
- add representative audit rows for exact `Rw` only, exact `Rw+Ctr`,
  exact `C` only, and exact floor rows where applicable.

### Risk: Field/Building Basis Leakage

Users may request building outputs and lab companions together. A
building adapter can own `R'w` or `DnT,w` without owning lab `C` or
`Ctr` for that request.

Mitigation:

- keep Gate AR and field/building lab alias blocking unless a separate
  direct-curve lab companion basis is active;
- test mixed lab+building requests separately from building-only
  requests.

### Risk: Surface Parity Drift

Engine may be correct while web surfaces show unsupported finite values.

Mitigation:

- harden `ResultSummary` with the same `isSupportedAnswerOutput`
  semantics already used by chart/report/card paths;
- add a web test where metrics contain finite `STC`, `C`, and `Ctr` but
  only `Rw` is supported, and assert summary does not render unsupported
  companion cards.

### Risk: Current Selected Slice Interference

The repository is currently working through a floor dynamic-stiffness
coverage refresh and parallel agents may be touching workbench/project
files.

Mitigation:

- do not edit runtime files for this bug until the selected next closes
  or the user explicitly selects this bug;
- when implementation starts, re-read the current dirty files before
  applying patches and avoid unrelated parallel-agent files.

### Risk: Hidden Regression Through Saved Replay

Saved scenarios can carry old requested-output sets and result
snapshots. A support-gate or owner change can make replayed scenarios
look different even if calculation values are unchanged.

Mitigation:

- include saved replay and server snapshot replay in surface parity
  tests for any value-moving companion owner;
- for support-gate hardening, assert only unsupported companion display
  changes, not unrelated scenario persistence behavior.

### Risk: Overfitting To One Known Route

The compatible anchor-delta `C+Ctr` pair is an obvious narrow gap, but
the broader bug class may exist elsewhere.

Mitigation:

- Phase 1 must include a multi-route audit matrix before Phase 3 moves
  runtime values;
- the audit should classify other rows even if the first implementation
  target remains narrow.

### Risk: Abstraction Too Early

Consolidating all companion logic into a generic abstraction before
pinning behavior can make it harder to see which route owns which
metric.

Mitigation:

- first pin behavior with audit rows;
- only extract helper abstractions after route-specific expectations are
  explicit and green.

## Things To Consider Before Implementation

Before editing runtime or surface code for this plan, answer these
questions in the selected slice plan or test comments:

- Which route owns the primary metric?
- Does the route own a one-third-octave curve, only a scalar, an exact
  source metric, an anchor-delta metric, or a field/building adapter?
- Which target outputs are requested?
- Which requested outputs have finite internal values?
- Which requested outputs are supported after owner filtering?
- Which requested outputs are unsupported, and why?
- Does resolver trace `supportedMetrics` match published support?
- Are value pins present for promoted companions?
- Is this lab, field, building, ISO, ASTM, A-weighted, or impact basis?
- Are any companions being shown by a surface without support-gate
  checks?
- Are there saved replay or report paths that need explicit parity?
- Does the change touch files modified by other agents?
- Does the active selected next allow this work, or does the user need
  to select this bug first?

## How This Avoids Breaking Existing Behavior

The plan is intentionally staged:

- Phase 1 observes and classifies current behavior only. It should not
  change runtime output.
- Phase 2 changes display gating, not calculation. It removes misleading
  unsupported companion display and should not create new values.
- Phase 3 moves one narrow owned request shape only after the audit and
  surface gate are pinned.
- Phase 4 reranks broader work after the narrow path proves safe.

The breakage controls are:

- exact-source rows stay pinned before and after each phase;
- field/building lab aliases stay pinned before and after each phase;
- floor carrier `C` / `Ctr` authority stays pinned;
- direct anchor-delta `Rw` stays direct-only unless a separate companion
  owner is active;
- owner audit must not report ownerless supported outputs;
- `pnpm calculator:gate:current` is required for runtime movement.

## Implementation Plan

### Phase 0 - Preflight And Scope Lock

Do this before creating tests or editing implementation.

Steps:

1. Read the current handoff docs:
   `docs/calculator/DOCUMENTATION_MAP.md`,
   `docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`,
   `docs/calculator/NEXT_AGENT_BRIEF.md`, and `AGENTS.md`.
2. Confirm whether this bug plan has actually been selected. If not,
   stop after documentation/audit work unless the user explicitly
   selects companion metric completeness.
3. Run `git status --short` and list files that are already modified by
   other agents.
4. Re-read these implementation files before touching them:
   - `packages/engine/src/calculate-assembly.ts`
   - `packages/engine/src/target-output-support.ts`
   - `packages/engine/src/post-v1-wall-compatible-anchor-delta.ts`
   - `packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts`
   - `packages/engine/src/acoustic-answer-engine-v1-owner-audit.ts`
   - `apps/web/features/workbench/result-summary.tsx`
   - `apps/web/features/workbench/result-answer-chart-model.ts`
   - `apps/web/features/workbench/simple-workbench-output-model.ts`
   - `apps/web/features/workbench/compose-workbench-report.ts`
5. Write down the exact request shapes and boundaries that must remain
   pinned before changing code.

Acceptance:

- the phase names the active selected next status;
- it names which files are safe to touch;
- it identifies any parallel-agent conflict before patches are applied.

### Phase 1 - No-Runtime Audit Contract

Create a focused engine contract that enumerates representative
companion-metric situations and classifies each row. The contract should
not move runtime values.

Suggested file:

`packages/engine/src/post-v1-companion-metric-completeness-audit-contract.test.ts`

Classifications:

- `owned_spectrum_promotable`
- `scalar_only_boundary_expected`
- `exact_measured_source_expected`
- `anchor_delta_needs_companion_owner`
- `field_building_lab_alias_blocked`
- `surface_request_gap`
- `surface_support_gate_gap`

Representative rows should include:

- owned source-absent double-leaf/framed lab route with `Rw/STC/C/Ctr`;
- source-absent field/building route with building outputs and explicit
  lab companion boundaries;
- exact measured wall `Rw` row with missing measured companions;
- compatible anchor-delta direct `Rw`;
- compatible anchor-delta calculated lab companion mixed request;
- compatible anchor-delta `C` only, `Ctr` only, and `C+Ctr` pair;
- floor exact/catalog row with authoritative missing `C` or `Ctr`;
- floor screening or calculated-spectrum carrier that owns derivable
  companions.

Acceptance for Phase 1:

- the test produces no runtime movement;
- each row states why a missing companion is a bug or an expected
  boundary;
- the selected next value-moving candidate is explicitly named but not
  implemented.

Implementation notes:

- keep the audit contract data-driven enough that each row records
  requested outputs, supported outputs, unsupported outputs, selected
  candidate, basis, and classification;
- include expected warnings or boundary text where they explain why a
  companion is blocked;
- do not update production code to make the audit pass by widening
  support. If a current row is surprising, document it as a candidate
  gap in the audit.

Concrete contract shape:

- define an `AuditRow` object with:
  - `id`;
  - `classification`;
  - `layers`;
  - `airborneContext`;
  - `targetOutputs`;
  - `expectedSupported`;
  - `expectedUnsupported`;
  - `expectedSelectedCandidateId` when a resolver trace should exist;
  - `expectedRuntimeBasisId` when a runtime basis should exist;
  - `expectedSupportedMetrics` when trace ownership is relevant;
  - `expectedValuePins` when promoted companions are relevant;
  - `why`.
- run `calculateAssembly(...)` for each row;
- assert support buckets first;
- assert trace ownership second;
- assert finite metric values only after support ownership is proven;
- include at least one row where finite `C`, `Ctr`, or `STC` exists but
  the output remains unsupported.

Full audit rows to keep in view for broader companion-completeness work:

1. `owned-spectrum-wall-lab-complete`:
   a source-absent or route-input wall lab row that supports
   `Rw/STC/C/Ctr`.
2. `exact-wall-rw-only-boundary`:
   an exact measured source row that keeps unowned companions
   unsupported.
3. `compatible-anchor-delta-rw-only-boundary`:
   direct compatible anchor-delta `Rw` remains direct-only.
4. `compatible-anchor-delta-c-singleton-owned`:
   singleton `C` is owned by calculated lab companions.
5. `compatible-anchor-delta-ctr-singleton-owned`:
   singleton `Ctr` is owned by calculated lab companions.
6. `compatible-anchor-delta-c-ctr-pair-gap`:
   pair `["C", "Ctr"]` was the narrow request-shape gap candidate and
   is now promoted by the 2026-06-12 closeout under the existing
   calculated lab companion basis.
7. `gate-ar-building-lab-alias-blocked`:
   building/field outputs remain supported while lab aliases stay
   unsupported when no separate direct-curve lab companion basis applies.
8. `floor-exact-authoritative-no-c`:
   floor carrier does not fabricate missing `C`.
9. `floor-calculated-spectrum-companion-owned`:
   calculated or screening floor carrier can support owned companions
   when its basis allows it.

The 2026-06-12 narrow bug closeout did not duplicate every existing
exact/floor boundary row in the new audit file. It added a focused audit
for the rows needed to make this fix safe:

- owned user-material double-leaf/framed lab route supports
  `Rw/STC/C/Ctr` with trace value pins;
- compatible anchor-delta `C+Ctr` pair is promoted under the existing
  calculated lab companion basis;
- compatible anchor-delta building/field route keeps lab aliases
  unsupported even though finite C/Ctr carrier values exist.

The broader exact-source, floor-carrier, and target-output support
boundaries remain covered by existing current-gate contracts such as
`target-output-support-contract.test.ts`, floor companion gate tests,
and exact-source mixed companion contracts.

### Phase 2 - Surface Support-Gate Hardening

Harden high-visibility workbench summary behavior so it never renders
unsupported companions just because finite metric fields exist.

Likely file:

`apps/web/features/workbench/result-summary.tsx`

Likely test target:

`apps/web/features/workbench/result-summary-companion-support-gate.test.ts`

Use the existing React surface-test style in this directory:
`renderToStaticMarkup(...)` with `React.createElement(...)`, as seen in
other `ResultSummary` tests.

Acceptance:

- `STC` card renders only when `isSupportedAnswerOutput(result, "STC")`
  is true;
- `C / Ctr` card renders `C`, `Ctr`, or `C / Ctr` only for individually
  supported terms;
- if finite metrics exist but `supportedTargetOutputs` includes only
  `Rw`, summary shows the primary airborne answer but does not show
  unsupported `STC`, `C`, or `Ctr`;
- existing card, chart, report, saved replay, and API behavior are
  unchanged.

This phase moves no calculator runtime values, but it improves
calculator honesty and prevents a visible bug.

Implementation notes:

- reuse `isSupportedAnswerOutput` rather than adding another support
  predicate;
- render no `STC` summary card when `STC` is unsupported;
- render no adaptation summary card when both `C` and `Ctr` are
  unsupported;
- when only one of `C` or `Ctr` is supported, render only that one and
  label it accurately;
- keep primary airborne cards visible when `Rw`, `R'w`, `Dn,w`, or
  `DnT,w` is supported.

This phase is intentionally high confidence because it aligns the
summary with engine support instead of changing engine support.

Concrete implementation steps:

1. Import `isSupportedAnswerOutput` from
   `./result-answer-chart-model` in `result-summary.tsx`.
2. Compute booleans:
   - `const stcSupported = isSupportedAnswerOutput(result, "STC")`
   - `const cSupported = isSupportedAnswerOutput(result, "C")`
   - `const ctrSupported = isSupportedAnswerOutput(result, "Ctr")`
   while preserving null-safe behavior when `result` is null.
3. Render the summary `STC` card only when `airborneAnswerVisible` and
   `stcSupported` are both true.
4. Build adaptation terms from supported terms only:
   - if both `C` and `Ctr` are supported, value is `C / Ctr`;
   - if only `C` is supported, value contains only `C`;
   - if only `Ctr` is supported, value contains only `Ctr`;
   - if neither is supported, render no adaptation card.
5. Keep primary airborne, `R'w`, `DnT,w`, `DnT,A`, `DnT,A,k`, `Dn,w`,
   and `Dn,A` summary cards unchanged in this phase unless the audit
   proves they have the same support-gate bug.

Concrete test cases:

1. target-scoped result with finite `estimatedStc`, `estimatedCDb`, and
   `estimatedCtrDb`, but `supportedTargetOutputs: ["Rw"]` and
   `unsupportedTargetOutputs: ["STC", "C", "Ctr"]`:
   - summary contains the primary airborne answer;
   - summary does not contain an `STC` metric card;
   - summary does not contain a `Spectrum adaptation` card;
   - chart/report/card behavior is unchanged.
2. target-scoped result with `supportedTargetOutputs: ["Rw", "C"]`:
   - summary renders only `C`, not `Ctr`;
   - label/detail text must not claim `C / Ctr`.
3. target-scoped result with `supportedTargetOutputs: ["Rw", "Ctr"]`:
   - summary renders only `Ctr`, not `C`;
   - label/detail text must not claim `C / Ctr`.
4. target-scoped result with `supportedTargetOutputs:
   ["Rw", "STC", "C", "Ctr"]`:
   - summary keeps the existing complete companion display.

Important: include `targetOutputs` in these fixtures. Without
`targetOutputs`, `isSupportedAnswerOutput(...)` treats the result as
unscoped legacy behavior and returns broad support.

### Phase 3 - Narrow Runtime Owner Candidate

After Phase 1 and Phase 2, implement the highest-confidence
value-moving companion gap. The 2026-06-12 closeout implemented this
candidate:

`wall.compatible_anchor_delta.c_ctr_pair_lab_companion_owner`

Reason:

- paired and one-side compatible anchor-delta `C` and `Ctr` singleton
  requests are already owned by the calculated lab companion route;
- `C+Ctr` pair uses the same underlying shifted direct curve and ISO 717
  adapter terms;
- expected runtime movement was narrow: paired and one-side `C+Ctr`
  request shapes, two target outputs, no formula retune, no source rows.

Required acceptance:

- paired exterior-board `["C", "Ctr"]` supports both terms with existing
  values;
- one-side exterior-board `["C", "Ctr"]` supports both terms with
  existing values;
- direct `Rw`, STC-only, mixed `Rw/STC/C/Ctr`, field/building,
  A-weighted, ASTM/IIC/AIIC, and non-Knauf boundaries remain as
  currently owned;
- resolver trace uses
  `wall.compatible_anchor_delta.calculated_lab_companions`;
- `supportedMetrics` and `valuePins` include exactly the promoted pair;
- API, cards, chart, summary, report, saved replay, and server snapshot
  replay agree.

Implementation notes:

- update the compatible anchor-delta request-shape predicate so
  `["C", "Ctr"]` is admitted only for the already-owned Knauf `416889`
  paired/one-side exterior-board scope;
- do not admit `STC+C`, `STC+Ctr`, field/building mixed requests,
  A-weighted outputs, ASTM/IIC/AIIC outputs, or non-Knauf stacks unless
  separately planned;
- keep direct `Rw` owner behavior unchanged;
- keep `C` only and `Ctr` only values unchanged;
- add a coverage refresh after owner + surface parity if this becomes
  the selected next chain.

Concrete implementation steps:

1. Add a new owner contract or extend the selected owner contract for
   `C+Ctr` pair behavior. Prefer a new contract if the selected-next
   chain needs traceable handoff; update existing C/Ctr-only tests that
   currently pin the pair as unsupported.
2. In `post-v1-wall-compatible-anchor-delta.ts`, add a predicate such
   as `isCAndCtrPairCalculatedLabCompanionRequest(...)`:
   - exact length `2`;
   - contains `C`;
   - contains `Ctr`;
   - contains no other output.
3. Include that predicate in `isCalculatedLabCompanionRequest(...)`.
4. Do not modify `isRwPlusCalculatedLabCompanionRequest(...)` unless a
   failing test proves it is necessary.
5. Do not change the compatible added-board physical boundary,
   source-id boundary, element-lab context boundary, non-Knauf boundary,
   field/building boundary, A-weighted boundary, or ASTM/IIC/AIIC
   boundary.
6. Assert paired exterior-board output:
   - supported `["C", "Ctr"]`;
   - values `C -1.1`, `Ctr -6`;
   - selected candidate
     `wall.compatible_anchor_delta.calculated_lab_companions`;
   - runtime basis
     `post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`;
   - supported metrics `["C", "Ctr"]`;
   - value pins for both terms.
7. Assert one-side exterior-board output:
   - supported `["C", "Ctr"]`;
   - values `C -0.6`, `Ctr -5.5`;
   - same selected candidate and runtime basis;
   - supported metrics and value pins for both terms.
8. Update web surface parity for the same request shape:
   - live calculation;
   - calculator API;
   - output cards;
   - target-output status;
   - chart companion;
   - `ResultSummary`;
   - report;
   - saved replay;
   - server snapshot replay.
9. Add a no-runtime coverage refresh after owner + surface parity if
   this becomes the selected next chain.

Tests that must be updated or rechecked:

- `packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-owner-contract.test.ts`
- `apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-surface-parity.test.ts`
- any current-gate registration if these files are in
  `pnpm calculator:gate:current`.

### Phase 4 - Broader Companion Completeness Rerank

Only after the narrow bug fix is stable, run a rerank over remaining
companion gaps.

Candidates to compare:

- broaden owned-spectrum companion promotion for source-absent wall
  routes;
- add missing `C` to automatic wall field/building presets when owned
  routes support it and unsupported boundaries remain explicit;
- consolidate route-specific companion helper rules into a clearer
  owner table;
- extend floor airborne companion audit rows where exact/catalog
  authority and calculated-spectrum carriers differ.

Do not select broad widening until the audit identifies concrete rows
with owned curve/adapter evidence.

Rerank criteria:

- immediate runtime values moved;
- number of new calculable request shapes;
- number of target outputs made supported;
- quality of owned curve/adapter evidence;
- size of regression surface;
- whether the change improves user-material/dynamic formula coverage;
- whether it preserves exact-source, field/building, and floor-carrier
  boundaries.

Prefer a narrow value-moving owner over broad helper refactors unless
the audit shows repeated identical omissions across several owned
spectrum routes.

## Validation Plan

For Phase 0:

- no tests required;
- record current selected next and dirty worktree considerations in the
  phase notes;
- run no formatter that could touch unrelated files.

For Phase 1:

- run the new focused engine audit test;
- run any nearby target-output support and owner-audit tests touched by
  the contract;
- run `git diff --check`.

For Phase 2:

- run the new result summary support-gate test;
- run existing card/chart/report support parity tests if touched;
- run `git diff --check`.

For Phase 3:

- run the new owner contract;
- run compatible anchor-delta C/Ctr-only owner and surface parity tests;
- run layer-combination resolver owner audit tests touched by trace
  changes;
- run `pnpm calculator:gate:current`;
- run `git diff --check`.

Suggested targeted command pattern:

- Phase 1:
  `pnpm vitest run packages/engine/src/post-v1-companion-metric-completeness-audit-contract.test.ts`
- Phase 2:
  `cd apps/web && pnpm exec vitest run features/workbench/result-summary-companion-support-gate.test.ts --maxWorkers=1`
- Phase 3:
  `pnpm vitest run packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-owner-contract.test.ts`
  and
  `cd apps/web && pnpm exec vitest run features/workbench/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-surface-parity.test.ts --maxWorkers=1`

Adjust commands to the repo's current Vitest/Turbo conventions if the
current gate runner uses a different wrapper.

For Phase 4:

- run the rerank/audit contract;
- run all tests for the selected owner family;
- run relevant web surface parity tests if any surface behavior moves;
- run `pnpm calculator:gate:current` for runtime behavior movement;
- run `git diff --check`.

Minimum acceptance matrix for any value-moving companion owner:

- engine support buckets are correct;
- unsupported adjacent requests remain explicit;
- resolver trace names the expected candidate and basis;
- `supportedMetrics` matches supported companion outputs;
- value pins or equivalent owned carrier values are present;
- warnings describe calculated vs measured ownership honestly;
- API result matches engine result;
- workbench cards, chart, summary, status, and report match support;
- saved replay and server snapshot replay preserve the selected owner.

## Documentation Sync

If this bug plan becomes the selected next slice, update only the live
handoff docs needed by the current calculator documentation map:

- `docs/calculator/DOCUMENTATION_MAP.md`
- `docs/calculator/NEXT_AGENT_BRIEF.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `AGENTS.md`
- current-gate runner if new tests enter the active calculator gate.

Do not rewrite historical plan docs except to fix directly misleading
current handoff text.

When updating docs after implementation, record:

- exact request shapes newly calculable;
- target outputs promoted;
- runtime basis promotions;
- runtime values moved;
- formula retunes, if any;
- source rows imported, if any;
- unchanged unsupported boundaries;
- tests run and any tests intentionally not run.

## Decision Rule

Promote a companion metric only when all are true:

1. the requested output is present in `targetOutputs`;
2. the selected route owns the curve, measured value, or adapter basis
   needed for that exact companion;
3. the companion has finite value evidence;
4. `supportedTargetOutputs`, resolver trace `supportedMetrics`, value
   pins, warnings, API, cards, chart, summary, and report can all be
   kept consistent;
5. adjacent basis aliases remain unsupported with explicit boundaries.

If any condition is false, keep the companion unsupported or
`needs_input`.

## Reviewer Checklist

Use this checklist before accepting implementation under this plan.

- Did the change improve calculator scope, accuracy, or honesty?
- Does the selected route own the companion metric basis?
- Are exact measured rows still exact-only unless the source owns the
  companion?
- Are anchor-delta direct metrics still separate from calculated
  companions?
- Are field/building outputs still not lab aliases?
- Are floor carrier missing `C` / `Ctr` semantics preserved?
- Are unsupported companions still visible as unsupported when
  requested?
- Are no unrequested companion values being presented as requested
  answers?
- Does `ResultSummary` obey the same support gate as cards, chart, and
  report?
- Does resolver trace ownership match published support?
- Do saved replay and reports agree with live API output?
- Did the patch avoid unrelated UI, auth/storage, project, report
  polish, and parallel-agent files?
- Were the targeted tests and required current gate run for the kind of
  change made?

## Stop Conditions

Stop and rerank instead of continuing if:

- the route only has scalar `Rw` without owned spectrum or adapter
  evidence;
- a proposed fix needs broad source crawling to justify one companion;
- field/building lab alias boundaries would need to be weakened;
- owner audit reports ownerless supported outputs;
- test changes require rewriting unrelated snapshots;
- current dirty worktree changes from other agents make it unclear which
  behavior is current.
