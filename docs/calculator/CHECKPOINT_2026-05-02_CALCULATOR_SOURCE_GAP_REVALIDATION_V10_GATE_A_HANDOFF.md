# Checkpoint - Calculator Source Gap Revalidation v10 Gate A

Date: 2026-05-02

Slice: `calculator_source_gap_revalidation_v10`

Gate: `gate_a_revalidate_source_accuracy_gap_order_after_rockwool_source_pack_closeout`

## Result

Gate A lands no-runtime source-gap revalidation after ROCKWOOL Acoustic
Wall Assemblies source-pack extraction Gate C closed no-runtime. It
selects:

`usg_acoustical_assemblies_source_pack_extraction_v1`

Next file:

`packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-a-contract.test.ts`

Next action:

`gate_a_extract_usg_acoustical_assemblies_rows_without_runtime_import`

Selection status:

`selected_usg_acoustical_assemblies_source_pack_extraction_after_v10_rerank_found_official_floor_wall_stc_iic_rows_but_no_runtime_ready_import`

## What Landed

- Added `packages/engine/src/calculator-source-gap-revalidation-v10-gate-a-contract.test.ts`.
- Added
  `docs/calculator/SLICE_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md`.
- Re-ranked the post-ROCKWOOL source backlog and selected the official
  USG Acoustical Assemblies SA200 locator as the next extraction-only
  source slice.
- Kept ROCKWOOL `ISS-00`, `ISS-22`, `ISS-39`, `IWS-04`, and `ESS-05`
  source rows closed no-runtime.
- Kept the Uris 2006 triple-leaf source-packet lane paused on
  `paused_waiting_rights_safe_source_packet`.
- Kept the split-rockwool grouped stack on low-confidence
  `multileaf_screening_blend`, `Rw 41`; this is still not fixed,
  correct, or source-validated.

## USG Selection Boundary

The selected source locator is:

`https://www.usg.com/content/dam/USG_Marketing_Communications/united_states/product_promotional_materials/finished_assets/acoustical-assemblies-en-SA200.pdf`

Known row examples to extract next:

- `Levelrock_I_joist_SRM25_carpet_IIC77_STC65`
- `Levelrock_I_joist_SRB_wood_laminate_IIC61_STC65`
- `Levelrock_truss_SRM25_ceramic_tile_IIC56_STC61`

USG `STC` and `IIC` values are source context only. They are not direct
DynEcho `Rw`, `R'w`, `Ln,w`, `DnT,w`, `Dn,w`, or `DnT,A` imports until a
later mapping/tolerance gate proves exact topology, metric policy,
material mapping, tolerance ownership, negative boundaries, and paired
engine/web visible tests.

## Frozen Surfaces

No runtime movement happened. Runtime, support, confidence, evidence,
API, route-card, output-card, proposal/report, output support, and
workbench-input behavior remain frozen.

## Validation

Validation completed on 2026-05-02:

- focused v10 Gate A:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v10-gate-a-contract.test.ts --maxWorkers=1`
  passed 1 file / 8 tests.
- continuity with v10 / ROCKWOOL Gate C / ROCKWOOL Gate B / ROCKWOOL
  Gate A / post-British-Gypsum acquisition / v9 / route-source-risk
  register passed 7 files / 48 tests.
- `pnpm calculator:gate:current` passed engine 198 files / 1065 tests,
  web 47 files / 227 passed + 18 skipped, and build 5 / 5 with known
  non-fatal `sharp/@img` optional dependency warnings.
- `apps/web/next-env.d.ts` was restored to `.next-typecheck` after the
  build side-effect.
- `git diff --check` passed.
