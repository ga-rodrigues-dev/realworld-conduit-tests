import type { Page, Locator } from '@playwright/test';
import { routes } from '../support/routes';

export default class SettingsPage {
  readonly emailInput: Locator;
  readonly bioInput: Locator;
  readonly updateButton: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = this.page.getByPlaceholder('Email');
    this.bioInput = this.page.getByPlaceholder('Short bio about you');
    this.updateButton = this.page.getByRole('button', { name: 'Update profile' });
  }

  async goto(): Promise<void> {
    await this.page.goto(routes.settings);
  }

  async updateBio(bio: string): Promise<void> {
    await this.bioInput.fill(bio);
  }

  async submit(): Promise<void> {
    await this.updateButton.click();
  }
}
