import { test, expect } from './fixtures';
import { createUser, createArticle } from './support/factories';
import { routes } from './support/routes';
import type { Article, User } from './support/factories';

/** Source: Playwright MCP exploratory tours 2026-07-04 — Landmark, Garbage Collector, Saboteur */
test.describe.serial('MCP exploratory tours 202607040158', () => {
  const landmarkTag = 'landmark-tag';
  let author: User;
  let authorArticle: Article;
  let articleSlug: string;

  test('tag filter shows matching articles on home', async ({ home }) => {
    await home.goto();
    await home.clickTag(landmarkTag);
    await expect(home.articleHeading('landmark article tour')).toBeVisible();
  });

  test('author creates article for permission checks', async ({ signUpPage, articleEdit, page }) => {
    author = createUser({ userType: 'mcpAuthor' });
    authorArticle = createArticle({
      articleType: 'mcpArticle',
      overrides: { tagList: ['mcp-tag-a', 'mcp-tag-b'] },
    });
    await signUpPage.goto();
    await signUpPage.signUp(author);
    await articleEdit.goto();
    await articleEdit.publishArticle(authorArticle);
    articleSlug = page.url().replace(/.*\/article\//, '');
    await expect(page.getByRole('heading', { name: authorArticle.title })).toBeVisible();
  });

  test('cross-user cannot edit another authors article', async ({ signUpPage, articleEdit, page }) => {
    const intruder = createUser({ userType: 'mcpIntruder' });
    await signUpPage.goto();
    await signUpPage.signUp(intruder);
    await articleEdit.gotoSlug(articleSlug);
    await expect(page).toHaveURL(routes.home);
  });

  test('logged-in user can favorite an article', async ({ signUpPage, articlePage, page }) => {
    const fan = createUser({ userType: 'mcpFan' });
    await signUpPage.goto();
    await signUpPage.signUp(fan);
    await articlePage.goto('test');
    await articlePage.favoriteBtn.click();
    await expect(articlePage.favoriteBtn).toHaveClass(/bg-emerald-600/);
    await expect(page.getByRole('heading', { name: 'test' })).toBeVisible();
  });

  test('logged-in user can open settings page', async ({ signUpPage, settings, page }) => {
    const settingsUser = createUser({ userType: 'mcpSettings' });
    await signUpPage.goto();
    await signUpPage.signUp(settingsUser);
    await settings.goto();
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(settings.updateButton).toBeVisible();
  });

  test('profile is reachable via direct URL', async ({ profile, page }) => {
    await profile.goto('test');
    await expect(page.getByRole('heading', { name: 'test', level: 4 })).toBeVisible();
  });
});
