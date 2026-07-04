import { test, expect } from './fixtures';

test.describe('settings', () => {
  test('logged-in user can open settings page', async ({ settings, page, loggedInUser }) => {
    await settings.goto();
    await expect(page.getByRole('heading', { name: 'Your Settings' })).toBeVisible();
    await expect(settings.emailInput).toHaveValue(loggedInUser.email);
  });

  test('published article is available from fixture', async ({ publishedArticle, articlePage, page }) => {
    const { articleUrl, articleData } = publishedArticle;
    await page.goto(articleUrl);
    await expect(articlePage.heading(articleData.title)).toBeVisible();
  });
});
