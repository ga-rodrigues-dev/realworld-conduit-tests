import { test, expect } from './fixtures';

test.describe('profile', () => {
  test('profile is reachable via direct URL', async ({ profile, page }) => {
    await profile.goto('test');
    await expect(page.getByRole('heading', { name: 'test', level: 4 })).toBeVisible();
  });

  test('logged-in user sees own username on profile', async ({ profile, page, loggedInUser }) => {
    await profile.goto(loggedInUser.username);
    await expect(page.getByRole('heading', { name: loggedInUser.username, level: 4 })).toBeVisible();
  });
});
