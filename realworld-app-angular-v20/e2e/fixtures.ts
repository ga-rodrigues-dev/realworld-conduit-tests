import { test as base, expect } from '@playwright/test'
import SignInPage from './pages/signInPage.page';
import SignUpPage from './pages/signUpPage.page';
import ArticlePage from './pages/articlePage.page';
import ArticleEdit from './pages/articleEdit.page';
import NavBar from './components/navBar.component';
import HomePage from './pages/home.page';
import ProfilePage from './pages/profile.page';
import SettingsPage from './pages/settings.page';
import { createUser, createArticle } from './support/factories';
import type { User, Article } from './support/factories';

export type SeededArticle = {
  articleAuthor: User
  commentAuthor: User
  nonCommentAuthor: User
  articleUrl: string
  articleData: Article
}

type Fixtures = {
  signInPage: SignInPage
  signUpPage: SignUpPage
  articlePage: ArticlePage
  articleEdit: ArticleEdit
  navBar: NavBar
  home: HomePage
  profile: ProfilePage
  settings: SettingsPage
  user: User
  articleData: Article
  loggedInUser: User
  seededArticle: SeededArticle
}

async function registerUser(signUpPage: SignUpPage, user: User) {
    await signUpPage.goto()
    await signUpPage.signUp(user)
}

export const test = base.extend<Fixtures>({
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page))
  },

  signUpPage: async ({ page }, use) => {
    await use(new SignUpPage(page))
  },

  articlePage: async ({ page }, use) => {
    await use(new ArticlePage(page))
  },

  articleEdit: async ({ page }, use) => {
    await use(new ArticleEdit(page))
  },

  navBar: async ({ page }, use) => {
    await use(new NavBar(page))
  },

  home: async ({ page }, use) => {
    await use(new HomePage(page))
  },

  profile: async ({ page }, use) => {
    await use(new ProfilePage(page))
  },

  settings: async ({ page }, use) => {
    await use(new SettingsPage(page))
  },

  user: async ({}, use) => {
    await use(createUser())
  },

  articleData: async ({}, use) => {
    await use(createArticle())
  },

  loggedInUser: async ({ signUpPage, user }, use) => {
    await registerUser(signUpPage, user)
    await use(user)
  },

  seededArticle: async ({ signUpPage, navBar, articleEdit, page, articleData }, use) => {
    const articleAuthor = createUser({ userType: 'articleAuthor' })
    const commentAuthor = createUser({ userType: 'commentAuthor' })
    const nonCommentAuthor = createUser({ userType: 'nonCommentAuthor' })

    await registerUser(signUpPage, nonCommentAuthor)
    await navBar.signOutButton.click()

    await registerUser(signUpPage, commentAuthor)
    await navBar.signOutButton.click()

    await registerUser(signUpPage, articleAuthor)

    await articleEdit.goto()
    await articleEdit.publishArticle(articleData)
    const articleUrl = page.url()
    await navBar.signOutButton.click()

    await use({ articleAuthor, commentAuthor, nonCommentAuthor, articleUrl, articleData })
  },
})

export { expect }
