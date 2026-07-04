import { test, expect } from './fixtures';
import { nanoid } from 'nanoid';
import { commentInvalidScenarios } from './support/invalidScenarios';

test.describe("comments", () => {

  for (const userType of ['commentAuthor', 'articleAuthor']) {
    test(`logged in ${userType} valid comment creation`, async ({ page, signInPage, articlePage, seededArticle }) => {
      const { articleAuthor, commentAuthor, articleUrl } = seededArticle
      const user = userType === 'commentAuthor' ? commentAuthor : articleAuthor
      const uniqueCommentId = nanoid(3)
      await signInPage.goto()
      await signInPage.signIn(user)
      await page.goto(articleUrl)
      await articlePage.postComment(uniqueCommentId)
      await expect(articlePage.commentSection).toContainText(uniqueCommentId)
    })
  }

  test("author valid comment deletion", async ({ page, signInPage, articlePage, seededArticle }) => {
    const { articleAuthor, articleUrl } = seededArticle
    const uniqueCommentId = nanoid(3)
    await signInPage.goto()
    await signInPage.signIn(articleAuthor)
    await expect(page.locator('nav')).toContainText(articleAuthor.username)
    await page.goto(articleUrl)
    await articlePage.postComment(uniqueCommentId)
    await articlePage.deleteCommentBtn(uniqueCommentId, articleAuthor.username).click()
    await expect(articlePage.commentSection).not.toContainText(uniqueCommentId)
  })

  test("non article author shouldn't get to delete own comment", async ({ page, signInPage, articlePage, seededArticle }) => {
    const { commentAuthor, articleUrl } = seededArticle
    const uniqueCommentId = nanoid(3)
    await signInPage.goto()
    await signInPage.signIn(commentAuthor)
    await expect(page.locator('nav')).toContainText(commentAuthor.username)
    await page.goto(articleUrl)
    await articlePage.postComment(uniqueCommentId)
    await expect(articlePage.deleteCommentBtn(uniqueCommentId, commentAuthor.username)).not.toBeVisible()
  })

  test("article author shouldn't get to delete other user's comment", async ({ page, signInPage, articlePage, navBar, seededArticle }) => {
    const { articleAuthor, commentAuthor, articleUrl } = seededArticle
    const uniqueCommentId = nanoid(3)
    await signInPage.goto()
    await signInPage.signIn(commentAuthor)
    await expect(page.locator('nav')).toContainText(commentAuthor.username)
    await page.goto(articleUrl)
    await articlePage.postComment(uniqueCommentId)
    await navBar.signOutButton.click()
    await signInPage.goto()
    await signInPage.signIn(articleAuthor)
    await expect(page.locator('nav')).toContainText(articleAuthor.username)
    await page.goto(articleUrl)
    await expect(articlePage.deleteCommentBtn(uniqueCommentId, commentAuthor.username)).not.toBeVisible()
  })

  test("user shouldn't get to delete comment they didn't post from other user's article", async ({ page, signInPage, articlePage, navBar, seededArticle }) => {
    const { articleAuthor, commentAuthor, nonCommentAuthor, articleUrl } = seededArticle
    const uniqueCommentId = nanoid(3)
    await signInPage.goto()
    await signInPage.signIn(commentAuthor)
    await expect(page.locator('nav')).toContainText(commentAuthor.username)
    await page.goto(articleUrl)
    await articlePage.postComment(uniqueCommentId)
    await navBar.signOutButton.click()
    await signInPage.goto()
    await signInPage.signIn(nonCommentAuthor)
    await expect(page.locator('nav')).toContainText(nonCommentAuthor.username)
    await page.goto(articleUrl)
    await expect(articlePage.deleteCommentBtn(uniqueCommentId, commentAuthor.username)).not.toBeVisible()
  })

  for (const scenario of commentInvalidScenarios) {
    test(`invalid comment creation: ${scenario.name}`, async ({ page, signInPage, articlePage, seededArticle }) => {
      const { commentAuthor, articleUrl } = seededArticle
      await signInPage.goto()
      await signInPage.signIn(commentAuthor)
      await page.goto(articleUrl)
      const initialCommentCount = await articlePage.commentCount()
      await articlePage.commentInput.fill(scenario.comment)
      if (await articlePage.postCommentBtn.isEnabled()) {
        await articlePage.postCommentBtn.click()
        expect(await articlePage.commentCount()).toBe(initialCommentCount)
      }
      else {
        await expect(articlePage.postCommentBtn).toBeDisabled()
      }
    })
  }
})
