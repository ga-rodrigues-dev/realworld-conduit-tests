## Context

The Conduit e2e suite (`realworld-app-angular-v20/e2e`) has tiered fixtures in `fixtures.ts` and all tests in a single `tests.spec.ts` with three `test.describe` blocks: `auth`, `article`, and `comments`. The fixture migration (`e2e-fixture-tiers`) removed `beforeEach` hooks and module-level mutable state, making file-level parallelism safe. Playwright's `testDir` is `./e2e` and `fullyParallel: true`.

## Goals / Non-Goals

**Goals:**
- One spec file per feature area: `auth.spec.ts`, `article.spec.ts`, `comments.spec.ts`.
- Mechanical split — move each `test.describe` block into its file with no test logic changes.
- Every spec imports `test`/`expect` from `./fixtures`.
- Preserve pass/skip baseline after the split.

**Non-Goals:**
- Renaming or restructuring tests inside each describe.
- Moving `fixtures.ts` to `fixtures/test.ts` (can be a follow-up).
- API-based seeding, new fixtures, or page-object changes.
- Adding new test coverage.

## Decisions

**Decision: Three files named `<feature>.spec.ts` in `e2e/`.**
Matches the north-star layout from fixture planning and Playwright convention (`*.spec.ts` under `testDir`).
- *Alternative considered:* subfolder `e2e/tests/auth.spec.ts`. Rejected — unnecessary nesting for three files; `testDir` already points at `e2e/`.

**Decision: Keep `test.describe("<feature>")` inside each file.**
Preserves Playwright report grouping and makes the split a pure move with no assertion or fixture changes.
- *Alternative considered:* drop the outer describe since the filename implies the feature. Rejected — extra diff noise for no functional gain.

**Decision: Co-locate invalid-scenario tables with their tests.**
`invalidScenarios` arrays for article and comment tests stay inside `article.spec.ts` and `comments.spec.ts` respectively — scenario data remains visible in the spec.
- *Alternative considered:* shared scenario data module. Rejected — violates "scenario data in the spec" discipline from fixture tiers.

**Decision: Delete `tests.spec.ts` after split (no re-export shim).**
A leftover monolith file would confuse discovery. Playwright picks up all `*.spec.ts` under `testDir`.
- *Alternative considered:* keep `tests.spec.ts` as a barrel. Rejected — Playwright doesn't use barrels; dead file risk.

**Decision: Import paths stay `./fixtures`, `./support/factories`, etc.**
All new spec files live alongside `fixtures.ts` in `e2e/` — same relative imports as today.

## Risks / Trade-offs

- **[Missed test during copy]** → Split one describe at a time; run that file's tests before moving to the next; final full-suite run before deleting `tests.spec.ts`.
- **[Parallelism exposes hidden coupling]** → Unlikely after fixture tiers, but if flakes appear, they're real bugs surfaced by file parallelism — fix or document, don't re-merge files.
- **[Slightly longer total CI time]** → Three files may run in parallel (faster wall-clock); `seededArticle` setup cost per comment test is unchanged.

## Migration Plan

1. Create `auth.spec.ts` — move auth describe; run auth tests.
2. Create `article.spec.ts` — move article describe; run article tests.
3. Create `comments.spec.ts` — move comments describe; run comments tests.
4. Delete `tests.spec.ts`.
5. Run full suite — confirm 22 passed, 1 skipped.

Rollback: restore `tests.spec.ts` from git and delete the three new files.
