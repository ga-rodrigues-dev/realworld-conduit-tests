## ADDED Requirements

### Requirement: publishedArticle state fixture

The suite SHALL provide a `publishedArticle` fixture that depends on `loggedInUser`, `navBar`, `articleEdit`, `page`, and `articleData`. It SHALL click the navbar new-article link, publish the baseline `articleData` article, and return `{ articleUrl, articleData }` where `articleUrl` is the browser URL after publish and `articleData` is the same object used to publish. The author SHALL remain logged in when the fixture hands control to the test.

#### Scenario: Test starts with a published article

- **WHEN** a test declares `publishedArticle`
- **THEN** it receives the published article URL and article data, with the author already signed in and no publish steps required in the test body

#### Scenario: Article data available from published state

- **WHEN** a test needs to assert on fields of the published article (e.g. title)
- **THEN** it destructures `articleData` from `publishedArticle` rather than also requesting the `articleData` fixture
