## 1. Create auth spec

- [x] 1.1 Create `e2e/auth.spec.ts` with imports from `./fixtures` and `./support/factories`
- [x] 1.2 Move the `auth` `test.describe` block from `tests.spec.ts` into `auth.spec.ts` unchanged
- [x] 1.3 Run auth tests and confirm results are unchanged

## 2. Create article spec

- [x] 2.1 Create `e2e/article.spec.ts` with imports from `./fixtures` and `./support/factories`
- [x] 2.2 Move the `article` `test.describe` block (including `invalidScenarios` and the skipped edit test) into `article.spec.ts` unchanged
- [x] 2.3 Run article tests and confirm results (including the skip) are unchanged

## 3. Create comments spec

- [x] 3.1 Create `e2e/comments.spec.ts` with imports from `./fixtures`, `./support/factories`, and `nanoid`
- [x] 3.2 Move the `comments` `test.describe` block (including `invalidScenarios`) into `comments.spec.ts` unchanged
- [x] 3.3 Run comments tests and confirm results are unchanged

## 4. Remove monolith and verify

- [x] 4.1 Delete `e2e/tests.spec.ts`
- [x] 4.2 Run the full e2e suite and confirm 22 tests pass and 1 remains skipped (`valid article edit`)
