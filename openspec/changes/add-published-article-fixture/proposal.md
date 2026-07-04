## Why

The tiered fixture model already covers authenticated users (`loggedInUser`) and multi-user article seeding (`seededArticle`), but there was no lightweight state fixture for tests that need a single published article while the author remains logged in. Settings and article-detail tests had to repeat the new-article → publish flow inline. Adding `publishedArticle` expresses that precondition as a reusable Tier 3 fixture, and `settings.spec.ts` exercises both settings navigation and the new fixture.

## What Changes

- Add **`publishedArticle` state fixture** in `e2e/fixtures.ts` — depends on `loggedInUser`, `navBar`, `articleEdit`, `page`, and `articleData`; navigates to the new-article editor via the navbar, publishes the baseline article, and returns `{ articleUrl, articleData }` with the author still signed in.
- Add **`settings.spec.ts`** — a dedicated spec file with tests for opening the settings page as a logged-in user and verifying a published article is reachable via the `publishedArticle` fixture.

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `e2e-test-fixtures`: Adds the `publishedArticle` Tier 3 state fixture and its preconditions/postconditions.
- `e2e-spec-structure`: Extends the one-spec-per-feature layout to include `settings.spec.ts`.

## Impact

- `realworld-app-angular-v20/e2e/fixtures.ts` — new `PublishedArticle` type and `publishedArticle` fixture.
- `realworld-app-angular-v20/e2e/settings.spec.ts` — new feature spec file (2 tests).
- No production application code, dependencies, or existing fixture contracts are changed.
