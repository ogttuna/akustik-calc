# Source Repo Policy

## Scope

This document defines how this repository may use the upstream source repo:

- upstream repo: `/home/ogttuna/Dev/Machinity/Acoustic2`
- current repo: `/home/ogttuna/Dev/Machinity/AcousticUpgrade`

`Acoustic2` is still under active development, especially on the `Ln,w` side.

Because of that, `Acoustic2` is the upstream reference implementation, not the place where this project should work.

## Hard Rule

This project must not modify `Acoustic2`.

That means:

- no direct edits
- no refactors in place
- no moving files out of the repo manually and continuing work there
- no symlink-based sharing
- no importing code from the live upstream path at runtime

If upstream changes, this repo adapts by importing or porting changes here.

## Read-Only Inspection Exception

Developer tooling in this repo may inspect upstream in a strictly read-only way.

Allowed examples:

- reading upstream git status and commit SHA
- generating inventory reports from upstream files
- running one-off upstream CLI or Node inspection commands for parity analysis

Those inspection paths are for migration research only.

They must not:

- write files into `Acoustic2`
- make the web app depend on upstream at runtime
- make package builds or tests require live upstream code

## Why This Rule Exists

Reasons:

- upstream is still evolving
- `Ln,w` behavior is still changing
- mixing migration work with ongoing research/workbench work will create drift and break trust
- this repo needs stable product-oriented boundaries, while upstream is still exploratory

## Allowed Workflow

The allowed workflow is:

1. Upstream work continues in `Acoustic2`.
2. Upstream reaches a meaningful checkpoint or commit.
3. That checkpoint is recorded by date and commit SHA.
4. Required changes are manually imported or ported into this repo.
5. This repo re-tests and re-documents the migrated behavior.

## Recommended Import Pattern

When adopting upstream work:

1. Identify the exact upstream commit SHA.
2. Write a short import note describing what changed.
3. Copy only the needed source material into this repo.
4. Convert it into the target architecture here.
5. Preserve provenance in commit message and docs.

Recommended commit message pattern:

```text
port(engine): adopt Ln,w floor-system matching from Acoustic2 @ <sha>
```

Recommended note fields:

- upstream repo path
- upstream commit SHA
- import date
- files reviewed
- behavior added or changed
- known deviations from upstream

## Disallowed Integration Patterns

Do not use:

- git submodule to `Acoustic2`
- direct package import from `../Acoustic2/...`
- live file watchers across repos
- shared mutable catalog files between repos

Those patterns look fast but create long-term instability.

## Practical Meaning for Early Work

Early work in this repo should focus on:

- architecture
- package boundaries
- TypeScript scaffolding
- engine API design
- typed catalog shapes
- migration harnesses
- read-only parity tooling

Do not try to make this repo depend on unfinished upstream code paths.

## Conflict Rule

If the desired product behavior and the current upstream behavior diverge:

- upstream remains untouched
- the difference is resolved inside this repo
- any intentional divergence must be documented

## Summary

`Acoustic2` is upstream.

It is read-only from the perspective of this project.

All product work, migration work, cleanup, and architecture work happen here.
