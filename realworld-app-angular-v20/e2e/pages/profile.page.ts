import type { Page, Locator } from '@playwright/test';
import { routes } from '../support/routes';

export default class ProfilePage {
  readonly myArticlesTab: Locator;
  readonly favoritedArticlesTab: Locator;
  readonly followButton: Locator;

  constructor(private readonly page: Page) {
    this.myArticlesTab = this.page.getByText('My Articles', { exact: true });
    this.favoritedArticlesTab = this.page.getByText('Favorited Articles', { exact: true });
    this.followButton = this.page.getByRole('button', { name: /Follow/ });
  }

  async goto(username: string): Promise<void> {
    await this.page.goto(routes.profile(username));
  }

  async showFavoritedArticles(): Promise<void> {
    await this.favoritedArticlesTab.click();
  }

  bioParagraph(bio: string): Locator {
    return this.page.getByText(bio, { exact: true });
  }

  loadingState(): Locator {
    return this.page.getByText('Loading...');
  }
}
