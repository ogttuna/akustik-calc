# Company-Internal Calculation-Grade Review

Date: 2026-05-14

Document role: review of docs, plan, and implementation against the
current company-internal goal. This is not a runtime implementation
gate. It sharpens the readiness bar before the next Gate BI work.

## Goal Clarification

The target is stronger than the older caveated daily-use release
language. The goal is not merely to label uncertain output as
low-confidence. The goal is to remove live low-confidence/screening
lanes from company-internal calculation paths by replacing them with
owned source-absent physics/formula corridors when physical inputs are
complete.

Allowed final states for a requested output:

- exact/source-backed result when topology, metric, and basis truly
  match;
- calibrated or family-physics prediction with named method, required
  inputs, and bounded uncertainty;
- `needs_input` only when a required physical field is missing or
  ambiguous;
- `unsupported` only when the metric/basis family genuinely has no
  adapter or owner yet.

Not acceptable as a company-internal calculation-grade final state:

- live `low_confidence` fallback for common company scenarios;
- `screening_fallback` selected for a route that has enough physical
  data to run a family solver;
- nearby-row proxy values presented as the best available answer when a
  source-absent physics corridor can be owned;
- lab values or lab budgets reused as field/building values.

## Implementation Review

The engine has the correct structural spine:

- exact/source precedence is explicit;
- source-absent formula corridors exist for steel, timber/CLT,
  heavy-concrete combined floor impact, opening/leak lab Rw/STC,
  advanced walls, and airborne building prediction;
- missing physical inputs are represented as `needs_input`;
- unsupported metric/basis boundaries are represented separately;
- web/API/report surfaces already carry origin, support, and budget
  information.

The remaining problem is not UI honesty. The remaining problem is that
some common routes still have live screening or low-confidence lanes.

Current high-risk live lanes found in implementation and tests:

1. `floor.steel_fallback_low_confidence.field`
   - current basis: `predictor_floor_system_low_confidence_estimate`;
   - current evidence tier: `screening`;
   - current support: partial field support with `L'nT,50` unsupported;
   - risk: common floor path can still return nearby-row fallback
     values instead of a fully owned source-absent steel/open-web
     physics corridor.
2. Reinforced-concrete low-confidence combined fallback
   - current basis: `predictor_floor_system_low_confidence_estimate`;
   - current posture: proxy airborne companions from mixed nearby rows;
   - risk: nearby-row fallback remains live for a realistic floor
     family.
3. `wall.concrete_heavy_core_screening.field`
   - current evidence tier: `screening`;
   - current support: finite field outputs;
   - risk: common lined/heavy-core wall path still depends on screening
     rather than a closed family-physics corridor.
4. `wall.heavy_composite_screening.field`
   - current evidence tier: `screening`;
   - current support: finite field outputs;
   - risk: double-leaf/heavy composite path is still value-pinned, not
     calculation-grade.
5. Historical grouped/split Rockwool `multileaf_screening_blend`
   - many older guards intentionally keep `Rw 41` screening frozen;
   - current newer grouped topology lanes are stronger, but stale
     screening guards remain a known doc/test hazard and should not be
     confused with calculation-grade readiness.

## Documentation Review

Docs contain two readiness meanings:

1. Older caveated internal/daily-use readiness:
   values can be used by knowledgeable users if evidence labels and
   fail-closed prompts are respected.
2. Current calculation-grade internal readiness:
   common source-absent routes must calculate through owned physics
   corridors, leaving no live low-confidence/screening final answers for
   company scenarios.

The active plan must use the second meaning. Any older
`companyInternalDailyUseReady: true` wording should be treated as a
caveated release envelope, not as the current calculation-grade target.

## Gate BI Assessment

Gate BH selected:

`gate_bi_personal_use_mvp_floor_impact_field_building_adapter_contract_plan`

Gate BI is still valid, because basis-safe floor field/building
ownership is required before floor field/building runtime promotion.
However, Gate BI alone does not satisfy today's company-internal
calculation-grade goal if it remains only a no-runtime contract and then
selects another broad planning gate.

Gate BI should be closed quickly as an owner/input contract, then select
a runtime-producing lane that removes a live low-confidence/screening
path.

## Recommended Order

1. Finish Gate BI as a minimal no-runtime floor-impact field/building
   owner contract.
   - Preserve current field values while separating field-apparent and
     building-prediction owners.
   - Keep `IIC` / `AIIC` unsupported.
   - Keep lab budgets out of field/building metrics.
   - Select a runtime lane, not another broad cartography lane, unless
     Gate BI exposes an owner blocker that makes runtime unsafe.
2. Promote floor-impact field/building runtime corridor for complete
   ISO field context.
   - Own separating area, receiving-room volume, RT60/absorption,
     normalization basis, field correction, flanking/junction/coupling,
     and field uncertainty budget.
   - Target `L'n,w` and `L'nT,w` first.
   - Keep `L'nT,50` blocked until low-frequency owner exists.
3. Replace `floor.steel_fallback_low_confidence.field`.
   - Use the existing Gate AD steel formula corridor as the lab anchor.
   - Require explicit steel/open-web support form, carrier
     depth/spacing, load basis, dynamic stiffness, upper package, and
     lower isolation inputs.
   - If those are missing, return `needs_input`; do not return
     low-confidence nearby-row fallback.
4. Replace reinforced-concrete low-confidence combined fallback.
   - Promote the mixed nearby-row proxy into either a complete
     heavy-concrete family-physics corridor or a `needs_input` contract.
   - Reuse the Gate BD/BF heavy-concrete combined upper/lower formula
     where topology matches.
5. Replace wall heavy-core and heavy-composite screening lanes.
   - Convert common complete lined/heavy-core field routes from
     `screening` to named family-physics predictions.
   - Require missing lining, cavity, coupling, density/surface-mass, and
     field geometry inputs explicitly.
6. Refresh the company-internal calculation-grade matrix.
   - Matrix should fail if any common company scenario resolves to
     `low_confidence`, `screening_fallback`, or
     `predictor_floor_system_low_confidence_estimate`.
   - Allowed exceptions must be named as non-company scenarios or
     historical guards.

## Acceptance Bar

The calculation-grade internal bar is met when:

- the company scenario matrix has zero live `low_confidence` rows;
- the company scenario matrix has zero selected `screening_fallback`
  rows for complete physical input;
- every common wall/floor route is exact/source, calibrated/family
  physics, bounded formula, `needs_input`, or truly `unsupported`;
- field/building outputs are not aliases of lab outputs;
- exact/source precedence still wins;
- `pnpm calculator:gate:current` and the targeted company-grade matrix
  pass.

## Immediate Plan Adjustment

Keep the selected Gate BI file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bi-floor-impact-field-building-adapter-contract.test.ts`

But Gate BI should now explicitly select the next runtime-removal lane:

`gate_bj_personal_use_mvp_floor_impact_field_building_runtime_corridor_plan`

If Gate BI proves runtime is still unsafe, the selected next lane should
be the smallest missing owner gate, not a broad source crawl or another
visibility-only review.
