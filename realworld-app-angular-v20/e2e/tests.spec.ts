import { test, expect } from '@playwright/test';
import { createUser, createArticle } from './support/factories';
import type { User, Article } from './support/factories';

import Home from './pages/home.page'
import SignInPage from './pages/signInPage.page';
import SignUpPage from './pages/signUpPage.page';
import ArticlePage from './pages/articlePage.page';
import ArticleEdit from './pages/articleEdit.page';
const signUpUrl = "http://localhost:4200/register"
const signInUrl = "http://localhost:4200/login"
let user: User
let articleData: Article
let home: Home
let signInPage: SignInPage
let signUpPage: SignUpPage

test.describe("auth", () => {

  test.beforeEach(async ({ page }) => {
    user = createUser();
    home = new Home(page)
    signUpPage = new SignUpPage(page)
    signInPage = new SignInPage(page)
  })

  test("user can sign up", async ({ page }) => {
    await page.goto(signUpUrl)
    await signUpPage.userNameInput.fill(user.username)
    await signUpPage.emailInput.fill(user.email)
    await signUpPage.passwordInput.fill(user.password)
    await signUpPage.passwordConfirmationInput.fill(user.password)
    await signUpPage.signUpBtn.click()
    await expect(page.locator('nav')).toContainText(user.username)

  })


  test("unregistered user can't login", async ({ page }) => {
    await page.goto(signInUrl)
    await signInPage.emailInput.fill("non-existent@no.com")
    await signInPage.passwordInput.fill("nonexistentpassword")
    await signInPage.signInBtn.click()
    await expect(page.getByRole("alert")).toContainText("Invalid credentials")
  })

  test("logged in user can logout", async ({ page }) => {
    await page.goto(signUpUrl)
    await signUpPage.userNameInput.fill(user.username)
    await signUpPage.emailInput.fill(user.email)
    await signUpPage.passwordInput.fill(user.password)
    await signUpPage.passwordConfirmationInput.fill(user.password)
    await signUpPage.signUpBtn.click()
    await home.signOutButton.click()
    await expect(page.locator('nav')).not.toContainText(user.username)

  })

  test("registered user can login", async ({ page }) => {
    await page.goto(signUpUrl)
    await signUpPage.userNameInput.fill(user.username)
    await signUpPage.emailInput.fill(user.email)
    await signUpPage.passwordInput.fill(user.password)
    await signUpPage.passwordConfirmationInput.fill(user.password)
    await signUpPage.signUpBtn.click()
    await home.signOutButton.click()
    await signInPage.emailInput.fill(user.email)
    await signInPage.passwordInput.fill(user.password)
    await signInPage.signInBtn.click()
    await expect(page.locator('nav')).toContainText(user.username)
  })
})

let articleEdit: ArticleEdit
let articlePage: ArticlePage

test.describe("article", () => {
  test.beforeEach(async ({ page }) => {
    articleData = createArticle();

    home = new Home(page)
    signInPage = new SignInPage(page)
    signUpPage = new SignUpPage(page)
    articlePage = new ArticlePage(page)
    articleEdit = new ArticleEdit(page)
    user = createUser()

    await page.goto(signUpUrl)
    await signUpPage.userNameInput.fill(user.username)
    await signUpPage.emailInput.fill(user.email)
    await signUpPage.passwordInput.fill(user.password)
    await signUpPage.passwordConfirmationInput.fill(user.password)
    await signUpPage.signUpBtn.click()

  })

  test.only("valid article creation", async ({ page }) => {
    const { title, subject, content, tagList } = articleData
    const tags = tagList.join(' ')
    await home.newArticleLink.click();
    await articleEdit.titleInput.fill(title);
    await articleEdit.subjectInput.fill(subject);
    await articleEdit.contentInput.fill(content);
    await articleEdit.tagsInput.fill(tags);
    await articleEdit.publishButton.click();
    await expect(articlePage.locateAuthorName(user.username)).toBeVisible()
    await expect(articlePage.heading(title)).toBeVisible();
    await expect(articlePage.contentText(content)).toBeVisible()
    for (const tag of tags.split(' ')) {
      await expect(articlePage.locateTag(tag)).toBeVisible()
    }
  })

  test.skip("valid article edit", async ({ page }) => {
    const { title, subject, content, tagList } = articleData
    const tags = tagList.join(' ')
    await home.newArticleLink.click();
    await articleEdit.titleInput.fill(title);
    await articleEdit.subjectInput.fill(subject);
    await articleEdit.contentInput.fill(content);
    await articleEdit.tagsInput.fill(tags)
    await articleEdit.publishButton.click();
    await articlePage.editBtn.click()
    await expect(articleEdit.titleInput).toHaveValue(title)
    await expect(articleEdit.subjectInput).toHaveValue(subject)
    await expect(articleEdit.contentInput).toHaveValue(content)
    const inputTags = (await articleEdit.tagsInput.inputValue()).split(" ")
    tags.split(" ").map(tag => { expect(inputTags.map(x => x.trim())).toContain(tag) })
  })

  const invalidScenarios: Array<{
    name: string,
    override: Partial<Article>
  }> = [
      {
        name: 'empty title',
        override: { title: '' }
      },
      {
        name: 'blank title',
        override: { title: '   ' }
      },
      {
        name: 'empty subject',
        override: { subject: '' }
      },
      {
        name: 'blank subject',
        override: { subject: '   ' }
      },
      {
        name: 'empty content',
        override: { content: '' }
      },
      {
        name: 'blank content',
        override: { content: '   ' }
      },
      {
        name: 'empty tags',
        override: { tagList: [] }
      },
      {
        name: 'blank tags',
        override: { tagList: [' '] }
      },

      {
        name: 'duplicate tags',
        override: { tagList: ['duplicate_tag', 'duplicate_tag'] }
      }
    ]

  for (const scenario of invalidScenarios) {
    test(`invalid article creation: ${scenario.name}`, async ({ page }) => {
      const { title, subject, content, tagList } = createArticle({ overrides: scenario.override })
      const tags = tagList.join(' ')
      await home.newArticleLink.click();
      await articleEdit.titleInput.fill(title);
      await articleEdit.subjectInput.fill(subject);
      await articleEdit.contentInput.fill(content);
      await articleEdit.tagsInput.fill(tags);
      const editorUrl = page.url()
      if (await articleEdit.publishButton.isEnabled()) {
        await articleEdit.publishButton.click()
        await expect(page).toHaveURL(editorUrl)
        await expect(articleEdit.publishButton).toBeVisible()
        await expect(articleEdit.titleInput).toHaveValue(title)
        await expect(articleEdit.subjectInput).toHaveValue(subject)
        await expect(articleEdit.contentInput).toHaveValue(content)
        const inputTags = (await articleEdit.tagsInput.inputValue()).split(" ")
        tags.split(" ").map(tag => { expect(inputTags.map(x => x.trim())).toContain(tag) })
      }
      else {
        await expect(articleEdit.publishButton).toBeDisabled()
      }

    })
  }

})



test.describe("comments", () => {
  let articleAuthor: User
  let nonCommentAuthor: User
  let commentAuthor: User
  let articleUrl: string
  let uniqueCommentId: string

  test.beforeEach(async ({ page}) => {
    articleData = createArticle()
    articleAuthor = createUser({userType: 'articleAuthor'})
    commentAuthor = createUser({userType: 'commentAuthor'})
    nonCommentAuthor = createUser({userType: 'nonCommentAuthor'})
    uniqueCommentId = crypto.randomUUID()
    
    home = new Home(page)
    signInPage = new SignInPage(page)
    articlePage = new ArticlePage(page)
    articleEdit = new ArticleEdit(page)
    signUpPage = new SignUpPage(page)

    // sign up non-author
    await page.goto(signUpUrl)
    await signUpPage.userNameInput.fill(nonCommentAuthor.username)
    await signUpPage.emailInput.fill(nonCommentAuthor.email)
    await signUpPage.passwordInput.fill(nonCommentAuthor.password)
    await signUpPage.passwordConfirmationInput.fill(nonCommentAuthor.password)
    await signUpPage.signUpBtn.click()
    await home.signOutButton.click()

    // sign up non-author
    await page.goto(signUpUrl)
    await signUpPage.userNameInput.fill(commentAuthor.username)
    await signUpPage.emailInput.fill(commentAuthor.email)
    await signUpPage.passwordInput.fill(commentAuthor.password)
    await signUpPage.passwordConfirmationInput.fill(commentAuthor.password)
    await signUpPage.signUpBtn.click()
    await home.signOutButton.click()

    // sign up author
    await page.goto(signUpUrl)
    await signUpPage.userNameInput.fill(articleAuthor.username)
    await signUpPage.emailInput.fill(articleAuthor.email)
    await signUpPage.passwordInput.fill(articleAuthor.password)
    await signUpPage.passwordConfirmationInput.fill(articleAuthor.password)
    await signUpPage.signUpBtn.click()

    // create article
    const { title, subject, content, tagList } = articleData
    const tags = tagList.join(' ')
    await home.newArticleLink.click()
    await articleEdit.titleInput.fill(title)
    await articleEdit.subjectInput.fill(subject)
    await articleEdit.contentInput.fill(content)
    await articleEdit.tagsInput.fill(tags)
    await articleEdit.publishButton.click()
    await articlePage.heading(title).waitFor({ state: 'visible' })
    articleUrl = page.url()
    await home.signOutButton.click()
  })


  for (const userType of ['commentAuthor', 'articleAuthor']) {
    test(`logged in ${userType} valid comment creation`, async({ page }) => {
      user = userType === 'commentAuthor' ? commentAuthor : articleAuthor
      await page.goto(signInUrl)
      await signInPage.emailInput.fill(user.email)
      await signInPage.passwordInput.fill(user.password)
      await signInPage.signInBtn.click()
      await expect(page.locator('nav')).toContainText(user.username)
      await page.goto(articleUrl)
      await articlePage.commentInput.fill(uniqueCommentId)
      await articlePage.postComment.click()
      await expect(articlePage.commentSection).toContainText(uniqueCommentId)
    })
  }

  test("author valid comment deletion", async({ page }) => {
    await page.goto(signInUrl)
    await signInPage.emailInput.fill(articleAuthor.email)
    await signInPage.passwordInput.fill(articleAuthor.password)
    await signInPage.signInBtn.click()
    await expect(page.locator('nav')).toContainText(articleAuthor.username)
    await page.goto(articleUrl)
    await articlePage.commentInput.fill(uniqueCommentId)
    await articlePage.postComment.click()
    await articlePage.deleteCommentBtn(uniqueCommentId, articleAuthor.username).click()
    await expect(articlePage.commentSection).not.toContainText(uniqueCommentId)
  })

  test("non article author shouldn't get to delete own comment", async({ page }) => {
    await page.goto(signInUrl)
    await signInPage.emailInput.fill(commentAuthor.email)
    await signInPage.passwordInput.fill(commentAuthor.password)
    await signInPage.signInBtn.click()
    await expect(page.locator('nav')).toContainText(commentAuthor.username)
    await page.goto(articleUrl)
    await articlePage.commentInput.fill(uniqueCommentId)
    await articlePage.postComment.click()
    await expect(articlePage.deleteCommentBtn(uniqueCommentId, commentAuthor.username)).not.toBeVisible()
  })

  test("article author shouldn't get to delete other user's comment", async({ page }) => {
    await page.goto(signInUrl)
    await signInPage.emailInput.fill(commentAuthor.email)
    await signInPage.passwordInput.fill(commentAuthor.password)
    await signInPage.signInBtn.click()
    await expect(page.locator('nav')).toContainText(commentAuthor.username)
    await page.goto(articleUrl)
    await articlePage.commentInput.fill(uniqueCommentId)
    await articlePage.postComment.click()
    await home.signOutButton.click()
    await page.goto(signInUrl)
    await signInPage.emailInput.fill(articleAuthor.email)
    await signInPage.passwordInput.fill(articleAuthor.password)
    await signInPage.signInBtn.click()
    await expect(page.locator('nav')).toContainText(articleAuthor.username)
    await page.goto(articleUrl)
    await expect(articlePage.deleteCommentBtn(uniqueCommentId, commentAuthor.username)).not.toBeVisible()
  })

  test("user shouldn't get to delete comment they didn't post from other user's article", async({ page }) => {
    await page.goto(signInUrl)
    await signInPage.emailInput.fill(commentAuthor.email)
    await signInPage.passwordInput.fill(commentAuthor.password)
    await signInPage.signInBtn.click()
    await expect(page.locator('nav')).toContainText(commentAuthor.username)
    await page.goto(articleUrl)
    await articlePage.commentInput.fill(uniqueCommentId)
    await articlePage.postComment.click()
    await home.signOutButton.click()
    await page.goto(signInUrl)
    await signInPage.emailInput.fill(nonCommentAuthor.email)
    await signInPage.passwordInput.fill(nonCommentAuthor.password)
    await signInPage.signInBtn.click()
    await expect(page.locator('nav')).toContainText(nonCommentAuthor.username)
    await page.goto(articleUrl)
    await expect(articlePage.deleteCommentBtn(uniqueCommentId, commentAuthor.username)).not.toBeVisible()
  })

  const invalidScenarios = [
      {
        name: 'empty comment',
        comment: ''
      },
      {
        name: 'blank comment',
        comment: '   '
      }
    ]

  for (const scenario of invalidScenarios) {
    test(`invalid comment creation: ${scenario.name}`, async({ page }) => {
      await page.goto(signInUrl)
      await signInPage.emailInput.fill(commentAuthor.email)
      await signInPage.passwordInput.fill(commentAuthor.password)
      await signInPage.signInBtn.click()
      await expect(page.locator('nav')).toContainText(commentAuthor.username)
      await page.goto(articleUrl)
      await articlePage.commentInput.fill(scenario.comment)
      const initialCommentCount = await articlePage.commentCount()
      if (await articlePage.postComment.isEnabled()) {
        await articlePage.postComment.click()
        expect(await articlePage.commentCount()).toBe(initialCommentCount)
      }
      else {
        await expect(articlePage.postComment).toBeDisabled()
      }
    })
  }
})
