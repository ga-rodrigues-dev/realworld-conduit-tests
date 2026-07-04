import type { Page, Locator } from '@playwright/test';
import type { User } from '../support/factories';
import { routes } from '../support/routes';


export default class SignUpPage {
  readonly userNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordConfirmationInput: Locator;
  readonly signUpBtn: Locator;

  constructor(private readonly page: Page) {
    this.userNameInput = this.page.locator('#username');
    this.emailInput = this.page.locator('#email');
    this.passwordInput = this.page.locator('#password');
    this.passwordConfirmationInput = this.page.locator('#passwordConfirmation');
    this.signUpBtn = this.page.getByRole('button', { name: 'Sign up' });
  }

  async goto(): Promise<void> {

    await this.page.goto(routes.register)

  }

  async fillSignUpForm(user: User): Promise<void> {

    await this.userNameInput.fill(user.username)

    await this.emailInput.fill(user.email)

    await this.passwordInput.fill(user.password)

    await this.passwordConfirmationInput.fill(user.password)

  }

  async clickSignUp(): Promise<void> {
    await this.signUpBtn.click()
  }

  async signUp(user: User): Promise<void> {

    await this.fillSignUpForm(user)

    await this.clickSignUp()

    await this.page.waitForURL(routes.home)

  }

}
