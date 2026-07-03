import type { Page, Locator } from '@playwright/test';

export default class SignInPage {
  constructor(private readonly page: Page) {}

  get emailInput(): Locator {
    return this.page.locator("#email")
  }
  
  get passwordInput(): Locator {
    return this.page.locator("#password")
  }
  
  get signInBtn(): Locator {
    return this.page.getByRole("button", {name:"Sign in"})
  }
}