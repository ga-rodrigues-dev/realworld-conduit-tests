## Why

The e2e suite now has tiered fixtures (`loggedInUser`, `seededArticle`, etc.) and a green baseline, but all 23 tests still live in a single `tests.spec.ts`. That was intentional during the fixture migration to keep failures attributable to one change. With fixtures stable, splitting into one spec per feature improves readability, aligns with Playwright's file-level parallelism, and makes each area's tests easier to find and extend.

## What Changes

- Split `e2e/tests.spec.ts` into three feature spec files:
  - `auth.spec.ts` — signup, login, logout tests
  - `article.spec.ts` — article creation, edit (skipped), and invalid-creation scenarios
  - `comments.spec.ts` — comment creation, deletion permissions, and invalid-comment scenarios
- Each new spec imports `test` and `expect` from `./fixtures` (unchanged fixture entry point).
- Move each `test.describe` block verbatim into its file; invalid-scenario tables stay co-located with the tests they drive.
- Delete `tests.spec.ts` after the split.
- Preserve the current pass/skip baseline (22 passed, 1 skipped).

## Capabilities

### New Capabilities
- `e2e-spec-structure`: Defines the one-spec-per-feature file layout, naming conventions, and import rules for the Conduit e2e suite.

### Modified Capabilities
<!-- None: fixture requirements in e2e-test-fixtures are unchanged. -->

## Impact

- `realworld-app-angular-v20/e2e/` — three new `*.spec.ts` files; `tests.spec.ts` removed.
- `fixtures.ts`, page objects, factories, and `support/routes.ts` — unchanged.
- No production application code or dependencies affected.
