import type { Page, Locator } from '@playwright/test';

export default class Home {
  constructor(private readonly page: Page) {}

  get signInButton(): Locator {
    return this.page.getByRole('link', { name: 'Sign in' });
  }

  get signUpButton(): Locator {
    return this.page.getByRole('link', { name: 'Sign up' });
  }

  get signOutButton(): Locator {
    return this.page.getByRole('button', { name: 'Sign out' });
  }

  get newArticleLink(): Locator {
      return this.page.locator('a[href="/editor"]')
  }

}