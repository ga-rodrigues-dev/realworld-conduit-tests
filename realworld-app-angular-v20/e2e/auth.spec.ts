import { test, expect } from './fixtures';
import { createUser } from './support/factories';

test.describe("auth", () => {

  test("user can sign up", async ({ page, signUpPage, user }) => {
    await signUpPage.goto()
    await signUpPage.signUp(user)
    await expect(page.locator('nav')).toContainText(user.username)

  })

  test("unregistered user can't login", async ({ page, signInPage }) => {
    const unregisteredUser = createUser({
      overrides: { email: "non-existent@no.com", password: "nonexistentpassword" }
    })
    await signInPage.goto()
    await signInPage.fillSignInForm(unregisteredUser)
    await signInPage.signInBtn.click()
    await expect(page.getByRole("alert")).toContainText("Invalid credentials")
  })

  test("logged in user can logout", async ({ page, signUpPage, navBar, user }) => {
    await signUpPage.goto()
    await signUpPage.signUp(user)
    await navBar.signOutButton.click()
    await expect(page.locator('nav')).not.toContainText(user.username)

  })

  test("registered user can login", async ({ page, signInPage, signUpPage, navBar, user }) => {
    await signUpPage.goto()
    await signUpPage.signUp(user)
    await navBar.signOutButton.click()
    await signInPage.goto()
    await signInPage.signIn(user)
    await expect(page.locator('nav')).toContainText(user.username)
  })
})
