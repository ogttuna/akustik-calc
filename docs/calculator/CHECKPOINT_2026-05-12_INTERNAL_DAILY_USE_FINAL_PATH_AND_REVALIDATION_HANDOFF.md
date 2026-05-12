# Internal Daily Use Final Path and Revalidation Handoff - 2026-05-12

## Purpose

This checkpoint answers the current company-internal readiness question
after the post-Gate-AP revalidation. It separates three bars that older
docs can otherwise blur:

- historical controlled internal pilot: already closed for a narrower
  supported/caveated corridor;
- current daily company-internal use: still open until airborne
  `building_prediction` can return defended `R'w` / `DnT,w` values or
  fail with precise inputs/basis;
- comprehensive industry-leading accuracy: longer source/calibration
  program after the daily-use bar.

The immediate product goal is the second bar. DynEcho should be usable
for regular internal estimating when it can calculate the common
supported wall/floor routes, including complete building-prediction
wall requests, while preserving honest uncertainty, exact-source
precedence, and strict lab/field/building separation.

## Current State

Implementation and docs are aligned at the post-Gate-AP checkpoint:

- Gate AP is landed as no-runtime room absorption / standardization
  owner.
- Gate AQ is the selected next action:
  `gate_aq_personal_use_mvp_airborne_building_prediction_uncertainty_budget_owner_contract_plan`.
- The selected Gate AQ file is intentionally absent until
  implementation:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aq-airborne-building-prediction-uncertainty-budget-owner-contract.test.ts`.
- Complete airborne `building_prediction` requests for `R'w` and
  `DnT,w` remain `unsupported`.
- Partial building requests remain `needs_input`.
- Gate I/J/K field-context outputs remain separate from building
  prediction.
- Gate O already defines a source-absent `+/-9 dB` design budget, but
  Gate AQ still needs to own that budget before runtime can be
  reconsidered.

This means DynEcho is usable for controlled internal/personal lanes
where the supported basis and budget are visible, but it is not yet at
the regular daily company-use bar for building prediction.

## Final Path To Daily Company Use

Projected closure path from the current Gate AP baseline:

1. **Gate AQ - uncertainty-budget owner**
   Define the source-absent building-prediction uncertainty budget owner
   for `R'w` and `DnT,w` without promoting runtime. It must own the
   `+/-9 dB` budget decomposition, same-building holdout absence, and
   apparent/standardized metric scope. This is the first task.
2. **Gate AR - all-owner runtime corridor**
   Promote complete building-prediction input only when direct curve,
   flanking path energy, junction vibration reduction, room
   standardization, and uncertainty budget owners are all executable.
   The output must carry a building-specific method, origin, budget,
   warnings, and rejected-candidate trace. Missing owners or fields
   must stay `needs_input` or `unsupported`.
3. **Gate AS - surface/API/report parity**
   Prove workbench cards, target-output status, saved replay, estimate
   API, Markdown/PDF/DOCX report payloads, and method/corridor dossiers
   show the same building basis, value, warnings, and `+/-9 dB`
   not-measured budget.
4. **Gate AT - acceptance matrix refresh**
   Refresh the executable wall/floor matrix with complete and partial
   building-prediction scenarios, hostile layer edits, field/lab alias
   negatives, exact-source precedence, opening/leak boundaries, and
   high-layer-count stability. The matrix must remain gap-free for the
   selected daily-use operating envelope.
5. **Gate AU - daily-use release handoff**
   Produce a concise company-internal usage envelope: supported,
   caveated, and unsupported routes; required inputs; tolerance/budget
   posture; manual acceptance scenarios; and residual risks. `pnpm
   calculator:gate:current`, broad `pnpm check`, and `git diff --check`
   must all pass after the handoff.

If Gate AR proves too large, split it into a runtime-readiness gate and
a runtime-promotion gate. Do not skip Gate AQ or surface parity to make
the schedule look shorter.

## Daily-Use Acceptance Bar

The daily company-use bar is met only when these are true:

- supported wall/floor element-lab, field, floor-impact, opening/leak,
  and building-prediction routes return defensible values with
  basis-compatible metrics;
- every defended output shows origin/support bucket and tolerance or
  error budget;
- building `R'w` / `DnT,w` complete input returns either a value with
  the building `+/-9 dB` budget or an explicit fail-closed reason;
- missing physical fields name exact inputs instead of guessing;
- exact measured/source rows still win only on true full-scope matches;
- `Rw`/`STC`, `Ln,w`/`IIC`, lab/field/building values, and opening/leak
  adapters are not aliased;
- route cards, output cards, APIs, saved replay, and reports agree;
- hostile cases cover many layers, duplicate/ambiguous roles, unsafe
  reorders, partial topology, and excessive openings;
- current-gate and full repository validation are green.

## Comprehensive Accuracy After Daily Use

The daily-use bar is not the final industry-leading accuracy bar.
After Gate AU, the next accuracy phase should target budget tightening
and calibration:

- source-owned same-building `R'w` / `DnT,w` holdouts;
- paired negative field/building boundaries;
- residual-policy decisions for building prediction;
- family-specific retune candidates only after enough measured
  holdouts exist;
- source-owned packet rights/locator metadata before measured values
  enter calibration.

Until that phase lands, building prediction can be suitable for internal
estimating only when the visible `+/-9 dB` source-absent design budget
is acceptable for the decision being made.

## First Action

Start with Gate AQ. Do not start broad source crawling, UI polish, or
runtime promotion before the uncertainty-budget owner contract exists
and passes focused validation.

## Validation

Validation passed before commit:

- Focused Gate AP doc-alignment contract:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-ap-airborne-building-prediction-room-standardization-owner-contract.test.ts --maxWorkers=1`
  passed with 1 file / 6 tests.
- Current gate:
  `pnpm calculator:gate:current` passed. Focused engine gate passed
  383 files / 2211 tests, focused web gate passed 74 files /
  318 passed + 18 skipped, repo build passed 5/5 packages, and the
  whitespace guard passed.
- Full repo:
  `pnpm check` passed with `pipefail` preserved while summarizing
  output. Lint passed 5/5 packages, typecheck passed 5/5 packages,
  engine Vitest passed 508 files / 3013 tests, web Vitest passed
  180 files / 993 passed + 18 skipped, and repo build passed
  5/5 packages.

Known non-fatal warnings remain unchanged: optional `sharp/@img`
resolution warnings in the DOCX/PDF build path and unavailable Zustand
test-storage warnings in workbench persistence tests.
