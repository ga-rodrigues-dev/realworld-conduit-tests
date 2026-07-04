import type { Page, Locator } from '@playwright/test';
import { routes } from '../support/routes';

export default class HomePage {
  readonly globalFeedTab: Locator;
  readonly yourFeedTab: Locator;

  constructor(private readonly page: Page) {
    this.globalFeedTab = this.page.getByRole('button', { name: 'Global Feed' });
    this.yourFeedTab = this.page.getByRole('button', { name: 'Your Feed' });
  }

  async goto(): Promise<void> {
    await this.page.goto(routes.home);
  }

  tagLink(tag: string): Locator {
    return this.page.getByRole('link', { name: tag, exact: true });
  }

  async clickTag(tag: string): Promise<void> {
    await this.tagLink(tag).click();
  }

  articleHeading(title: string): Locator {
    return this.page.getByRole('heading', { name: title });
  }

  previewForTitle(title: string): Locator {
    return this.page.locator('app-article-preview').filter({
      has: this.page.getByRole('heading', { name: title }),
    });
  }

  previewLinkForTitle(title: string): Locator {
    return this.previewForTitle(title).locator('a[href^="/article/"]');
  }

  feedFavoriteButton(title: string): Locator {
    return this.previewForTitle(title).getByRole('button', { name: /Toggle favorite/ });
  }
}
