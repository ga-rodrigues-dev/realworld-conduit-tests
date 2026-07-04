import { test, expect } from './fixtures';
import { createUser, createArticle } from './support/factories';
import { routes } from './support/routes';
import { nanoid } from 'nanoid';

/** Source: manual Tour Guiado (Tour guiado.csv) */
test.describe('Tour Guiado — exploratory manual tour', () => {

  test('user can sign up and publish first post', async ({
    signUpPage, articleEdit, articlePage, user, articleData,
  }) => {
    await signUpPage.goto();
    await signUpPage.signUp(user);
    await articleEdit.goto();
    await articleEdit.publishArticle(articleData);
    await expect(articlePage.heading(articleData.title)).toBeVisible();
  });

  test('global feed tab lists seeded articles', async ({ home }) => {
    await home.goto();
    await home.globalFeedTab.click();
    await expect(home.articleHeading('test')).toBeVisible();
  });

  test('user can open article from global feed by title', async ({ home, page }) => {
    await home.goto();
    await home.globalFeedTab.click();
    await home.previewLinkForTitle('test').click();
    await expect(page).toHaveURL(routes.article('test'));
    await expect(page.getByRole('heading', { name: 'test' })).toBeVisible();
  });

  test('user can favorite article on article page', async ({ signUpPage, articlePage }) => {
    const fan = createUser({ userType: 'guiadoFan' });
    await signUpPage.goto();
    await signUpPage.signUp(fan);
    await articlePage.goto('test');
    await articlePage.favoriteBtn.click();
    await expect(articlePage.favoriteBtn).toHaveClass(/bg-emerald-600/);
  });

  test('user can comment on an article', async ({ signUpPage, articlePage }) => {
    const commenter = createUser({ userType: 'guiadoCommenter' });
    const commentText = `guiado-comment-${nanoid(3)}`;
    await signUpPage.goto();
    await signUpPage.signUp(commenter);
    await articlePage.goto('test');
    await articlePage.postComment(commentText);
    await expect(articlePage.commentSection).toContainText(commentText);
  });

  test('author can delete own comment on own article', async ({
    signUpPage, articleEdit, articlePage, page,
  }) => {
    const author = createUser({ userType: 'guiadoOwner' });
    const article = createArticle({ articleType: 'guiadoOwn' });
    const commentText = `guiado-own-comment-${nanoid(3)}`;
    await signUpPage.goto();
    await signUpPage.signUp(author);
    await articleEdit.goto();
    await articleEdit.publishArticle(article);
    const slug = page.url().replace(/.*\/article\//, '');
    await articlePage.postComment(commentText);
    await articlePage.deleteCommentBtn(commentText, author.username).click();
    await expect(articlePage.commentSection).not.toContainText(commentText);
    await expect(page).toHaveURL(routes.article(slug));
  });

  test('user can access own profile', async ({ signUpPage, profile, page }) => {
    const user = createUser({ userType: 'guiadoProfile' });
    await signUpPage.goto();
    await signUpPage.signUp(user);
    await profile.goto(user.username);
    await expect(page.getByRole('heading', { name: user.username, level: 4 })).toBeVisible();
  });

  test('user can open favorited articles tab on profile', async ({ signUpPage, profile }) => {
    const user = createUser({ userType: 'guiadoFavTab' });
    await signUpPage.goto();
    await signUpPage.signUp(user);
    await profile.goto(user.username);
    await profile.showFavoritedArticles();
    await expect(profile.favoritedArticlesTab).toBeVisible();
  });

  test('user can submit profile bio update in settings', async ({ signUpPage, settings, page }) => {
    const user = createUser({ userType: 'guiadoBio' });
    const bio = `Bio do tour guiado ${nanoid(3)}`;
    await signUpPage.goto();
    await signUpPage.signUp(user);
    await settings.goto();
    await settings.updateBio(bio);
    await settings.submit();
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(settings.updateButton).toBeVisible();
  });

  test('tag filter narrows articles on home', async ({ home }) => {
    await home.goto();
    await home.clickTag('landmark-tag');
    await expect(home.articleHeading('landmark article tour')).toBeVisible();
  });

  test.describe.serial('follow author and your feed', () => {
    const author = createUser({ userType: 'guiadoAuthor' });
    const follower = createUser({ userType: 'guiadoFollower' });
    const article = createArticle({
      articleType: 'guiadoFeed',
      overrides: { tagList: ['guiado-feed-tag'] },
    });
    let articleSlug: string;

    test('author publishes article for feed scenario', async ({
      signUpPage, articleEdit, page,
    }) => {
      await signUpPage.goto();
      await signUpPage.signUp(author);
      await articleEdit.goto();
      await articleEdit.publishArticle(article);
      articleSlug = page.url().replace(/.*\/article\//, '');
      await expect(page.getByRole('heading', { name: article.title })).toBeVisible();
    });

    test('your feed stays empty after follow (known defect)', async ({
      signUpPage, articlePage, home, page,
    }) => {
      await signUpPage.goto();
      await signUpPage.signUp(follower);
      await articlePage.goto(articleSlug);
      await articlePage.followBtn.click();
      await page.goto(routes.home);
      await home.yourFeedTab.click();
      await expect(page.getByText(/No articles yet|Follow some authors/)).toBeVisible();
      await expect(home.articleHeading(article.title)).not.toBeVisible();
    });
  });
});
