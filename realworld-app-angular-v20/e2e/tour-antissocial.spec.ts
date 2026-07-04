import { test, expect } from './fixtures';
import { createUser, createArticle } from './support/factories';
import { routes } from './support/routes';
import { nanoid } from 'nanoid';

/** Source: manual Tour Antissocial (Tour antisocial.csv) — boundary and negative flows */
test.describe('Tour Antissocial — exploratory manual tour', () => {

  test('invalid email keeps sign up disabled', async ({ signUpPage }) => {
    await signUpPage.goto();
    await signUpPage.userNameInput.fill('valid_user');
    await signUpPage.emailInput.fill('not-an-email');
    await signUpPage.passwordInput.fill('password123');
    await signUpPage.passwordConfirmationInput.fill('password123');
    await signUpPage.emailInput.blur();
    await expect(signUpPage.signUpBtn).toBeDisabled();
  });

  test('empty password keeps sign up disabled', async ({ signUpPage }) => {
    await signUpPage.goto();
    await signUpPage.userNameInput.fill('user_empty_pw');
    await signUpPage.emailInput.fill('empty_pw@example.com');
    await expect(signUpPage.signUpBtn).toBeDisabled();
  });

  test('username with spaces can register', async ({ signUpPage, page }) => {
    const spacedUser = createUser({
      userType: 'space user',
      overrides: { username: `user with spaces ${nanoid(3)}` },
    });
    await signUpPage.goto();
    await signUpPage.signUp(spacedUser);
    await expect(page.locator('nav')).toContainText(spacedUser.username);
  });

  test.skip('duplicate email shows validation error', async ({ signUpPage, navBar, page }) => {
    const first = createUser({ userType: 'dupEmailA' });
    const second = createUser({
      userType: 'dupEmailB',
      overrides: { email: first.email, username: `other_${nanoid(3)}` },
    });
    await signUpPage.goto();
    await signUpPage.signUp(first);
    await navBar.signOutButton.click();
    await signUpPage.goto();
    await signUpPage.fillSignUpForm(second);
    await signUpPage.clickSignUp();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('duplicate username logs in as existing user', async ({ signUpPage, navBar, page }) => {
    const first = createUser({ userType: 'dupUserA' });
    const second = createUser({
      userType: 'dupUserB',
      overrides: { username: first.username, email: `other_${nanoid(3)}@example.com` },
    });
    await signUpPage.goto();
    await signUpPage.signUp(first);
    await navBar.signOutButton.click();
    await signUpPage.goto();
    await signUpPage.fillSignUpForm(second);
    await signUpPage.clickSignUp();
    await page.waitForURL(routes.home);
    await expect(page.locator('nav')).toContainText(first.username);
  });

  test('huge title shows generic error on publish', async ({ articleEdit, navBar, page }) => {
    const hugeTitle = 'x'.repeat(5000);
    const article = createArticle({ overrides: { title: hugeTitle } });
    await navBar.newArticleLink.click();
    await articleEdit.fillFormFields(article);
    await articleEdit.publishButton.click();
    await expect(page.getByText("Something went wrong").first()).toBeVisible();
  });

  test('huge subject shows generic error on publish', async ({ articleEdit, navBar, page }) => {
    const hugeSubject = 'x'.repeat(5000);
    const article = createArticle({ overrides: { subject: hugeSubject } });
    await navBar.newArticleLink.click();
    await articleEdit.fillFormFields(article);
    await articleEdit.publishButton.click();
    await expect(page.getByText("Something went wrong").first()).toBeVisible();
  });

  test('very long comment can be posted', async ({ page, signInPage, articlePage, seededArticle }) => {
    const { commentAuthor, articleUrl } = seededArticle;
    const longComment = `long-comment-${nanoid(3)}-${'y'.repeat(2000)}`;
    await signInPage.goto();
    await signInPage.signIn(commentAuthor);
    await page.goto(articleUrl);
    await articlePage.postComment(longComment);
    await expect(articlePage.commentSection).toContainText(longComment.slice(0, 40));
  });

  test('favorite without login redirects to login', async ({ home, page }) => {
    await home.goto();
    await home.feedFavoriteButton('test').click();
    await expect(page).toHaveURL(routes.login);
  });

  test('follow button reverts when logged out', async ({ articlePage }) => {
    await articlePage.goto('test');
    await articlePage.followBtn.click();
    await expect(articlePage.followBtn).toHaveText(/Follow/);
  });
});
