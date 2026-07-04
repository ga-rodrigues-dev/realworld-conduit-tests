## Context

The Playwright e2e suite (`realworld-app-angular-v20/e2e`) already has Tier 1 in place: an extended `test` in `fixtures.ts` exposes object fixtures for the five page objects / components (`signUpPage`, `signInPage`, `articlePage`, `articleEdit`, `navBar`), and every spec imports `test`/`expect` from there. Factories (`support/factories.ts`) produce fresh `User` / `Article` data.

What remains lives in `tests.spec.ts`:
- Baseline data is held in **module-level `let user` / `let articleData`**, reassigned inside `beforeEach` (and reassigned again inside the invalid-scenario loops).
- Each `describe` has a `beforeEach` that performs its preconditions: `auth` creates a user; `article` creates data and signs up; `comments` signs up three role-bearing users, publishes an article, captures its URL, and signs out.

This is only worker-safe because Playwright runs one file per worker serially. It also hides each test's real preconditions in setup.

## Goals / Non-Goals

**Goals:**
- Replace module-level mutable data with fresh-per-test **data fixtures** (`user`, `articleData`).
- Express preconditions as **state fixtures** (`loggedInUser`, `seededArticle`) that depend on object + data fixtures.
- Delete all three `beforeEach` hooks; make each test's signature its dependency list.
- Preserve the exact current behavior and pass/skip status of the suite (behavior-preserving refactor).

**Non-Goals:**
- Splitting `tests.spec.ts` into `auth.spec.ts` / `article.spec.ts` / `comments.spec.ts` (future change).
- API-based seeding to replace UI signup/publish inside `seededArticle` (future north-star change).
- Enriching page objects (e.g. `navBar.expectSignedIn(user)`) to absorb repeated `expect(page.locator('nav'))` assertions.

## Decisions

**Decision: Four new fixtures — `user`, `articleData` (Tier 2), `loggedInUser`, `seededArticle` (Tier 3).**
All test-scoped (fresh per test) so parallelism holds. `loggedInUser` depends on `{ signUpPage, user }`, signs up, and returns the `user` so tests can assert on `loggedInUser.username`. `seededArticle` depends on `{ signUpPage, navBar, articleEdit, page, articleData }`.
- *Alternative considered:* worker-scoped fixtures for speed. Rejected — shared users/articles across tests reintroduce the coupling we're removing.

**Decision: `seededArticle` consumes the `articleData` fixture for its article content and returns it.**
The fixture publishes `articleData` and returns `{ articleAuthor, commentAuthor, nonCommentAuthor, articleUrl, articleData }`. This gives `articleData` a second consumer beyond the single happy-path `article` test, so it earns its place independent of the currently-skipped `valid article edit` test. Returning `articleData` mirrors `loggedInUser` returning `user` — the state fixture hands back the data it used, so comment tests that need to assert on article fields can destructure from `seededArticle` rather than also requesting the `articleData` fixture.
- *Alternative considered:* `seededArticle` calling `createArticle()` internally. Rejected — needlessly duplicates factory usage and leaves `articleData` looking like a single-consumer fixture.
- *Alternative considered:* returning only users and `articleUrl`. Rejected — hides the published article data and forces tests to either request `articleData` separately (accidental coupling) or parse content back out of the URL.

**Decision: `seededArticle` creates its own three role-bearing users; it does NOT reuse the `user` fixture.**
`articleAuthor` / `commentAuthor` / `nonCommentAuthor` carry roles; the `user` fixture is role-less baseline. Role-bearing data belongs to the scenario/state fixture.

**Decision: `seededArticle` guarantees a logged-out postcondition.**
Current comment tests open with `signInPage.goto()` then sign in, so they assume nobody is logged in. The fixture must end by signing the article author out to preserve that contract.

**Decision: Keep the subject visible in `auth`.**
`user can sign up`, `logged in user can logout`, and `registered user can login` still call `signUpPage.signUp(user)` / `signInPage.signIn(user)` explicitly. Signup/login is the behavior under test there, so it stays in the spec rather than moving into a fixture.

**Decision: Scenario data stays local in the spec.**
Invalid-creation tests build a local `createArticle({ overrides })` and do not request the `articleData` fixture. `unregistered user can't login` keeps its local override user. A data fixture is consumed only where the baseline is used unmodified.

**Decision: No teardown blocks.**
All four fixtures are "set up, then `use()`" — no external resource to release. This keeps assertions out of fixtures by construction (no `after use()` block exists to smuggle one into). A synchronous `waitForURL` inside a page-object method used during setup is acceptable; a business `expect` is not.

## Risks / Trade-offs

- **[Behavior drift during migration]** → Migrate incrementally and re-run the suite after each `describe`; the green/skip baseline must be unchanged. Keep each step the smallest diff that moves one `describe`.
- **[`seededArticle` cost unchanged]** → It still performs 3 UI signups + 1 UI publish per test; the fixture doesn't make it faster, only clearer. Speeding it up via API seeding is deliberately deferred.
- **[Fixture signature bloat]** → If a test needs 7+ fixtures, treat it as a signal a state fixture is missing rather than adding more object fixtures. Current tests stay well under that after `seededArticle` collapses the comments setup.
- **[Shared `articleData` reference]** → Within a test, `seededArticle` returns the same `articleData` object it published (resolved once by Playwright). Comment tests that need article fields destructure `articleData` from `seededArticle`; they do not also request the `articleData` fixture. Invalid-scenario article tests still build local override data and do not request the baseline fixture.
