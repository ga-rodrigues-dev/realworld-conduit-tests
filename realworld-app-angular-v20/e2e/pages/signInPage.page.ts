import type { Page, Locator } from '@playwright/test';
import { User } from '../support/factories';
import { routes } from '../support/routes';


export default class SignInPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInBtn: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = this.page.locator('#email');
    this.passwordInput = this.page.locator('#password');
    this.signInBtn = this.page.getByRole('button', { name: 'Sign in' });
  }

  async goto(): Promise<void> {

    await this.page.goto(routes.login)

  }



  async fillSignInForm(user: User): Promise<void> {

    await this.emailInput.fill(user.email)

    await this.passwordInput.fill(user.password)

  }

  async signIn(user: User): Promise<void> {

    await this.fillSignInForm(user)

    await this.signInBtn.click()

    await this.page.waitForURL(routes.home)

  }

}
