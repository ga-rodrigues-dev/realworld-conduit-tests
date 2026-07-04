import type { Page, Locator } from '@playwright/test';

export default class NavBar {
  readonly signInButton: Locator;
  readonly signUpButton: Locator;
  readonly signOutButton: Locator;
  readonly newArticleLink: Locator;
  readonly settingsLink: Locator;

  constructor(private readonly page: Page) {
    this.signInButton = this.page.getByRole('link', { name: 'Sign in' });
    this.signUpButton = this.page.getByRole('link', { name: 'Sign up' });
    this.signOutButton = this.page.getByRole('button', { name: 'Sign out' });
    this.newArticleLink = this.page.locator('a[href="/editor"]');
    this.settingsLink = this.page.getByRole('link', { name: 'Settings' });
  }
}
