## ADDED Requirements

### Requirement: Tiered fixture model

The e2e suite SHALL organize fixtures into three tiers within the single extended `test` (`e2e/fixtures.ts`): Tier 1 object fixtures (page objects and components), Tier 2 data fixtures (baseline data), and Tier 3 state fixtures (preconditions expressed as dependencies on other fixtures). Every spec SHALL import `test` and `expect` from this single module and never from `@playwright/test` directly.

#### Scenario: Specs import from the extended test

- **WHEN** a spec file needs `test` or `expect`
- **THEN** it imports them from `./fixtures` (the extended test), not from `@playwright/test`

#### Scenario: Fixtures are test-scoped

- **WHEN** two tests run
- **THEN** each receives its own fresh instance of every requested data and state fixture, so tests remain independent under parallel execution

### Requirement: Baseline data fixtures

The suite SHALL provide `user` and `articleData` fixtures that wrap the existing factories (`createUser`, `createArticle`) with fresh-per-test values, replacing module-level mutable variables. A data fixture SHALL be consumed only by tests that use the baseline value unmodified.

#### Scenario: Fresh baseline user per test

- **WHEN** a test declares the `user` fixture
- **THEN** it receives a freshly created `User` unique to that test

#### Scenario: Scenario data stays local to the spec

- **WHEN** a test needs data that overrides the baseline (e.g. an invalid-article scenario or an unregistered-login user)
- **THEN** it builds that data locally with the factory and does NOT request the `articleData` / `user` fixture for it

### Requirement: loggedInUser state fixture

The suite SHALL provide a `loggedInUser` fixture that depends on `signUpPage` and `user`, signs the user up, and returns that user already logged in. Tests requiring an authenticated user SHALL declare `loggedInUser` instead of performing signup in a `beforeEach`.

#### Scenario: Test starts authenticated

- **WHEN** a test declares `loggedInUser`
- **THEN** the browser is already signed in as that user and the test receives the user object for assertions (e.g. `loggedInUser.username`)

#### Scenario: Authentication behavior is not hidden where it is the subject

- **WHEN** a test's subject is signup or login itself (the `auth` describe)
- **THEN** it calls `signUpPage.signUp(user)` / `signInPage.signIn(user)` explicitly rather than relying on `loggedInUser`

### Requirement: seededArticle state fixture

The suite SHALL provide a `seededArticle` fixture that signs up three role-bearing users (`articleAuthor`, `commentAuthor`, `nonCommentAuthor`), publishes one article using the `articleData` fixture, and returns `{ articleAuthor, commentAuthor, nonCommentAuthor, articleUrl, articleData }`. The returned `articleData` SHALL be the same object used to publish. The fixture SHALL create its own role-bearing users and SHALL NOT reuse the baseline `user` fixture.

#### Scenario: Comment test starts from a seeded article

- **WHEN** a comment test declares `seededArticle`
- **THEN** it receives the three users, the published article URL, and the article data, with no signup/publish steps in the test body

#### Scenario: Article data available from seeded state

- **WHEN** a comment test needs to assert on article fields (e.g. title)
- **THEN** it destructures `articleData` from `seededArticle` rather than also requesting the `articleData` fixture

#### Scenario: Logged-out postcondition

- **WHEN** `seededArticle` completes setup and hands control to the test
- **THEN** no user is logged in, so the test can begin by signing in the relevant user

### Requirement: No setup hooks or business assertions in fixtures

The migrated suite SHALL remove the `beforeEach` hooks and module-level `let user` / `let articleData` declarations from `tests.spec.ts`. Fixtures SHALL only construct and prepare state; they SHALL NOT contain business-behavior `expect` assertions (a synchronous `waitFor` inside a page-object method used during setup is permitted).

#### Scenario: beforeEach hooks are gone

- **WHEN** the migration is complete
- **THEN** `tests.spec.ts` contains no `test.beforeEach` hooks and no module-level `let user` / `let articleData`

#### Scenario: Fixtures contain no business expectations

- **WHEN** a fixture prepares state
- **THEN** it performs no `expect` on business behavior; verification happens in the test body

### Requirement: Behavior-preserving migration

The migration SHALL preserve the existing behavior and pass/skip status of every test in the suite.

#### Scenario: Suite result is unchanged

- **WHEN** the suite is run after migration
- **THEN** the same tests pass and the same tests remain skipped as before the change
