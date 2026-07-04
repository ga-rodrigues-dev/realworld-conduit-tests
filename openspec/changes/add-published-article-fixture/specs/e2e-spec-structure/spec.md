## MODIFIED Requirements

### Requirement: One spec file per feature

The e2e suite SHALL organize tests into separate spec files under `e2e/`, one per feature area: `auth.spec.ts`, `article.spec.ts`, `comments.spec.ts`, and `settings.spec.ts`. The monolithic `tests.spec.ts` SHALL be removed after the split.

#### Scenario: Feature tests live in dedicated files

- **WHEN** a developer looks for auth, article, comment, or settings tests
- **THEN** they find them in `auth.spec.ts`, `article.spec.ts`, `comments.spec.ts`, or `settings.spec.ts` respectively, not in a single combined file

#### Scenario: Monolith removed

- **WHEN** the split is complete
- **THEN** `e2e/tests.spec.ts` does not exist

#### Scenario: Settings tests live in dedicated file

- **WHEN** a developer looks for settings-page tests
- **THEN** they find them in `settings.spec.ts`, including coverage that uses the `publishedArticle` fixture
