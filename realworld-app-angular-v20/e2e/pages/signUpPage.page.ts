import type { Page, Locator } from '@playwright/test';

export default class SignUpPage {
  constructor(private readonly page: Page) { }

  get userNameInput(): Locator {
    return this.page.locator("#username")
  }
  get emailInput(): Locator {
    return this.page.locator("#email")
  }
  get passwordInput(): Locator {
    return this.page.locator("#password")
  }

  get passwordConfirmationInput(): Locator {
    return this.page.locator("#passwordConfirmation")
  }

  get signUpBtn(): Locator {
    return this.page.getByRole("button", { name: "Sign up" })
  }
}