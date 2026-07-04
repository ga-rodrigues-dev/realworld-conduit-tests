## Why

The e2e suite keeps its per-test setup in `beforeEach` hooks and shares baseline data through module-level `let user` / `let articleData` variables. That mutable module state is only safe today because Playwright runs one file per worker serially; it becomes a flake source the moment the suite is split into multiple files or run with more workers. It also buries each test's real preconditions (a logged-in user, a seeded article with three role-bearing users) in setup blocks, so tests don't read as "ask for what you need, then act."

## What Changes

- Add **Tier 2 data fixtures** — `user` and `articleData` — that wrap the existing factories with fresh-per-test values, replacing the module-level `let` variables.
- Add **Tier 3 state fixtures** that express preconditions as dependencies on other fixtures:
  - `loggedInUser` — signs up a fresh user via `signUpPage` and returns the user (already logged in).
  - `seededArticle` — signs up three role-bearing users (`articleAuthor`, `commentAuthor`, `nonCommentAuthor`), publishes one article (using the `articleData` fixture), and returns `{ articleAuthor, commentAuthor, nonCommentAuthor, articleUrl, articleData }` with a **logged-out** postcondition. `articleData` is the same object used to publish, mirroring how `loggedInUser` returns the `user` it signed up.
- Remove all three `beforeEach` hooks in `tests.spec.ts`; tests declare the fixtures they need in their signatures instead.
- Keep scenario data in the specs: invalid-creation tests build a **local** scenario article and do not request the baseline `articleData` fixture.
- Keep the subject visible: `auth` tests still call `signUpPage.signUp(user)` / `signInPage.signIn(user)` explicitly rather than hiding signup/login behind a fixture.
- Out of scope for this change: splitting `tests.spec.ts` into per-feature spec files, and API-based seeding for `seededArticle` (both tracked as future north-star work).

## Capabilities

### New Capabilities
- `e2e-test-fixtures`: Defines the tiered Playwright fixture model (object / data / state), the rules for what earns a fixture, and the preconditions/postconditions each state fixture guarantees.

### Modified Capabilities
<!-- None: no existing spec's requirements change. -->

## Impact

- `realworld-app-angular-v20/e2e/fixtures.ts` — adds `user`, `articleData`, `loggedInUser`, `seededArticle` fixtures alongside the existing Tier 1 object fixtures.
- `realworld-app-angular-v20/e2e/tests.spec.ts` — three `beforeEach` hooks and the module-level `let user` / `let articleData` removed; tests migrated to fixture signatures.
- No production application code, dependencies, or APIs are affected — this is a test-architecture change and must preserve the current green/skip state of the suite.
