## ADDED Requirements

### Requirement: One spec file per feature

The e2e suite SHALL organize tests into separate spec files under `e2e/`, one per feature area: `auth.spec.ts`, `article.spec.ts`, and `comments.spec.ts`. The monolithic `tests.spec.ts` SHALL be removed after the split.

#### Scenario: Feature tests live in dedicated files

- **WHEN** a developer looks for auth, article, or comment tests
- **THEN** they find them in `auth.spec.ts`, `article.spec.ts`, or `comments.spec.ts` respectively, not in a single combined file

#### Scenario: Monolith removed

- **WHEN** the split is complete
- **THEN** `e2e/tests.spec.ts` does not exist

### Requirement: Fixture import unchanged

Every spec file SHALL import `test` and `expect` from `./fixtures`, consistent with the `e2e-test-fixtures` capability.

#### Scenario: Spec imports from fixtures

- **WHEN** any feature spec file is opened
- **THEN** it imports `test` and `expect` from `./fixtures`, not from `@playwright/test`

### Requirement: Scenario data stays in spec files

Invalid-scenario tables and local factory overrides SHALL remain inside the spec file that uses them, not extracted to shared modules.

#### Scenario: Article invalid scenarios co-located

- **WHEN** article invalid-creation tests run
- **THEN** their `invalidScenarios` table lives in `article.spec.ts`

#### Scenario: Comment invalid scenarios co-located

- **WHEN** comment invalid-creation tests run
- **THEN** their `invalidScenarios` table lives in `comments.spec.ts`

### Requirement: Behavior-preserving split

The split SHALL be a mechanical move of existing tests with no changes to test logic, fixtures, or assertions. The suite SHALL preserve its current pass/skip status.

#### Scenario: Suite result unchanged

- **WHEN** the full e2e suite runs after the split
- **THEN** the same tests pass and the same tests remain skipped as before the change
