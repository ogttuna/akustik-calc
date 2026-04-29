# Checkpoint - Calculator Source Gap Revalidation v4 Gate A Handoff

Date: 2026-04-29

Slice: `calculator_source_gap_revalidation_v4`

Gate: A

Status: LANDED / NO RUNTIME MOVEMENT

## Decision

Gate A re-ranks the current source and accuracy candidates after
`generated_floor_fallback_topology_delta_v1` closed no-runtime.

Landed contract:

`packages/engine/src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts`

Selected next slice:

`knauf_wall_systems_source_pack_extraction_v1`

Selected next file:

`packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts`

Selected planning surface:

[SLICE_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_PLAN.md](./SLICE_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_PLAN.md)

## Why No Runtime Slice Was Selected

No runtime-ready source pack exists. The generated floor topology-delta
found near misses only. CLT / mass-timber source extraction already
closed with metric-policy and tolerance blockers. Historical blocked
families still need their original blockers satisfied directly.

The Knauf UK/AU wall-system sources are concrete enough for no-runtime
source-pack extraction, but not for import or confidence promotion. The
next slice should extract table/row locators, topology metadata, metric
context, tolerance blockers, and positive/negative test requirements.

## Fresh Source Locator Recheck

Official source locators rechecked on 2026-04-29:

- Knauf UK Drywall Systems Performance Guide, April 2026:
  `https://knauf.com/api/download-center/v1/assets/0f399ff9-ae51-4916-b290-c5f5d270a2e4?country=gb&download=true&locale=en-GB`
- Knauf AU Systems+ page, October 2025 guide family:
  `https://knauf.com/en-AU/knauf-gypsum/services/training/systems-plus`
- Knauf AU Systems+ Section D Timber Stud Walls:
  `https://knauf.com/api/download-center/v1/assets/4e58706c-df9d-4579-8d5b-8e685cf29194?country=AU&download=true&locale=en-AU`
- Knauf AU Systems+ Section F Masonry Upgrades:
  `https://knauf.com/api/download-center/v1/assets/16b8f406-a9be-47bd-9e7a-7212d6f19a28?country=AU&download=true&locale=en-AU`

These are source locator inputs only. They do not approve runtime
imports, support promotion, confidence promotion, evidence promotion,
route-card movement, output-card movement, proposal/report copy, or
workbench input behavior.

## Frozen Surfaces

No runtime, support, confidence, evidence, API, route-card,
output-card, proposal/report, or workbench-input behavior changed.

No candidate was promoted for internal-pilot convenience.

## Preserved Boundaries

- Source locators are not runtime import approval.
- Knauf extraction must not promote timber double-board or lined-heavy
  routes without exact row mapping and metric context.
- Steel-stud rows do not become timber-stud truth.
- Masonry-upgrade, floor, or ceiling rows do not become lined-heavy wall
  truth without wall-specific mapping.
- Generated floor fallback remains low-confidence after topology near
  misses.
- `GDMTXA04A`, `C11c`, raw open-box/open-web, wall selector behavior,
  no-stud double-leaf, CLT wall, and generated floor fallback stay
  blocked until a later bounded slice satisfies their prerequisites.

## Validation

Completed before editing:

- `pnpm calculator:gate:current`: green, engine 144 files / 697 tests,
  web 45 files / 216 passed + 18 skipped, build 5/5 with known
  non-fatal `sharp/@img` warnings, whitespace guard clean.

Completed after Gate A landed:

- Targeted v4 Gate A contract:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts --maxWorkers=1`;
  green, 1 engine file / 7 tests.
- Targeted prior Gate C compatibility plus v4 Gate A:
  `pnpm --filter @dynecho/engine exec vitest run src/post-generated-floor-fallback-topology-delta-v1-next-slice-selection-contract.test.ts src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts --maxWorkers=1`;
  green, 2 engine files / 13 tests.
- `pnpm calculator:gate:current`: green, engine 145 files / 704 tests,
  web 45 files / 216 passed + 18 skipped, build 5/5 with known
  non-fatal `sharp/@img` warnings, whitespace guard clean.
- `pnpm check`: green, lint/typecheck green, engine 278 files / 1524
  tests, web 157 files / 890 passed + 18 skipped, build 5/5 with known
  non-fatal `sharp/@img` warnings.

## Next Action

Implement Gate A:

`packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts`

Gate A should extract source table locators and classify candidate
rows. It must stay no-runtime unless a later contract names exact
topology, metric owner, tolerance owner, protected negative boundaries,
and paired engine/web visible tests.
