# Acoustic2 Import Note

- Date: 2026-03-12
- Upstream path: `/home/ogttuna/Dev/Machinity/Acoustic2`
- Upstream branch: `main`
- Upstream commit: `cdfad5936a48bc0228112d43e5ed5703f3227746`
- Upstream working tree dirty: yes

## Scope

- Import the upstream airborne benchmark corpus needed to validate the local `dynamic` calculator against official and holdout framed-wall references.
- Add a local benchmark/ranking harness that runs all current DynEcho airborne calculators against the imported corpora and reports MAE/RMSE/max-error rankings.

## Files Reviewed

- `/home/ogttuna/Dev/Machinity/Acoustic2/tools/benchmark-calculators.js`
- `/home/ogttuna/Dev/Machinity/Acoustic2/tools/reference-benchmarks-official-primary-2026.json`
- `/home/ogttuna/Dev/Machinity/Acoustic2/tools/reference-benchmarks-field-official-2026.json`
- `/home/ogttuna/Dev/Machinity/Acoustic2/tools/reference-benchmarks-rw-generic-holdout-2026.json`
- `/home/ogttuna/Dev/Machinity/Acoustic2/tools/reference-benchmarks-field-generic-holdout-2026.json`

## Behavior Added Or Changed

- Added `pnpm engine:benchmark-airborne` to benchmark local airborne calculators over imported upstream corpora.
- Added `packages/engine/src/airborne-benchmark.ts` so benchmark datasets can be normalized, inline custom-material rows can be evaluated locally, and calculator rankings can be summarized in a reusable way.
- Added fixture-backed tests that lock `dynamic` to first place on the imported official and holdout corpora while preserving the existing dynamic error thresholds.

## Known Deviations From Upstream

- DynEcho benchmarks only the currently supported local airborne calculators: `dynamic`, `ks_rw_calibrated`, `mass_law`, `sharp`, and `kurtovic`.
- Upstream benchmark JSON rows that rely on inline material definitions are normalized into local temporary catalog entries at import time because DynEcho layer inputs require `materialId`.
