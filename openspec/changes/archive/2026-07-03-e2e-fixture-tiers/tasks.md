## 1. Tier 2 data fixtures

- [x] 1.1 Add a `user` fixture to `e2e/fixtures.ts` that returns `createUser()` (fresh per test)
- [x] 1.2 Add an `articleData` fixture to `e2e/fixtures.ts` that returns `createArticle()` (fresh per test)
- [x] 1.3 Extend the `Fixtures` type with `user: User` and `articleData: Article`

## 2. Tier 3 state fixtures

- [x] 2.1 Add a `loggedInUser` fixture depending on `{ signUpPage, user }` that signs the user up and returns the user
- [x] 2.2 Add a `seededArticle` fixture depending on `{ signUpPage, navBar, articleEdit, page, articleData }` that signs up `articleAuthor` / `commentAuthor` / `nonCommentAuthor`, publishes an article from `articleData`, captures `articleUrl`, signs out, and returns `{ articleAuthor, commentAuthor, nonCommentAuthor, articleUrl, articleData }` (same `articleData` reference used to publish)
- [x] 2.3 Add types for the `seededArticle` return value and extend the `Fixtures` type with `loggedInUser` and `seededArticle`

## 3. Migrate the auth describe

- [x] 3.1 Remove the `auth` `beforeEach` and replace `user` usage with the `user` fixture in each auth test signature
- [x] 3.2 Keep `signUpPage.signUp(user)` / `signInPage.signIn(user)` explicit in auth tests (subject stays visible)
- [x] 3.3 Run the auth describe and confirm results are unchanged

## 4. Migrate the article describe

- [x] 4.1 Remove the `article` `beforeEach`
- [x] 4.2 Migrate `valid article creation` (and the skipped `valid article edit`) to `{ loggedInUser, articleData, ... }`, asserting on `loggedInUser.username`
- [x] 4.3 Migrate the invalid-creation loop to `{ loggedInUser, articleEdit, navBar, page }` with a local scenario article (no `articleData` fixture)
- [x] 4.4 Run the article describe and confirm results (including the skip) are unchanged

## 5. Migrate the comments describe

- [x] 5.1 Remove the `comments` `beforeEach` and its module-level `let` role variables
- [x] 5.2 Migrate every comment test to destructure from `seededArticle` (at minimum `{ articleAuthor, commentAuthor, nonCommentAuthor, articleUrl }`; `articleData` is available but unused by current tests)
- [x] 5.3 Confirm each comment test still begins by signing in the relevant user (relies on the logged-out postcondition)
- [x] 5.4 Run the comments describe and confirm results are unchanged

## 6. Cleanup and verification

- [x] 6.1 Remove the module-level `let user` / `let articleData` declarations from `tests.spec.ts`
- [x] 6.2 Confirm no `test.beforeEach` hooks remain in `tests.spec.ts`
- [x] 6.3 Run the full e2e suite and confirm the same tests pass and the same tests remain skipped as before the change
