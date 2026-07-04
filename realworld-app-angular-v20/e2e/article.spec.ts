import { test, expect } from './fixtures';
import { createArticle } from './support/factories';
import type { Article } from './support/factories';

test.describe("article", () => {

  test("valid article creation", async ({ articlePage, articleEdit, navBar, loggedInUser, articleData }) => {
    const { title, content, tagList } = articleData
    await navBar.newArticleLink.click()
    await articleEdit.publishArticle(articleData)
    await expect(articlePage.locateAuthorName(loggedInUser.username)).toBeVisible()
    await expect(articlePage.heading(title)).toBeVisible();
    await expect(articlePage.contentText(content)).toBeVisible()
    for (const tag of tagList) {
      await expect(articlePage.locateTag(tag)).toBeVisible()
    }
  })

  test.skip("valid article edit", async ({ articlePage, articleEdit, navBar, loggedInUser, articleData }) => {
    const { title, subject, content, tagList } = articleData
    await navBar.newArticleLink.click()
    await articleEdit.publishArticle(articleData)
    await articlePage.editBtn.click()
    await expect(articleEdit.titleInput).toHaveValue(title)
    await expect(articleEdit.subjectInput).toHaveValue(subject)
    await expect(articleEdit.contentInput).toHaveValue(content)
    
    const trimFilterAndSort = (tags: string[]): string[] => tags.map(x => x.trim()).filter(x => x.length > 0).sort()
    const filteredTagList = trimFilterAndSort(tagList)
    const inputTagsValue = await articleEdit.tagsInput.inputValue()
    const filteredInputTags = trimFilterAndSort(inputTagsValue.split(" "))
    expect(JSON.stringify(filteredInputTags)).toBe(JSON.stringify(filteredTagList))
  })

  const invalidScenarios: Array<{
    name: string,
    override: Partial<Article>
  }> = [
      {
        name: 'empty title',
        override: { title: '' }
      },
      {
        name: 'blank title',
        override: { title: '   ' }
      },
      {
        name: 'empty subject',
        override: { subject: '' }
      },
      {
        name: 'blank subject',
        override: { subject: '   ' }
      },
      {
        name: 'empty content',
        override: { content: '' }
      },
      {
        name: 'blank content',
        override: { content: '   ' }
      },
      {
        name: 'empty tags',
        override: { tagList: [] }
      },
      {
        name: 'blank tags',
        override: { tagList: [' '] }
      },

      {
        name: 'duplicate tags',
        override: { tagList: ['duplicate_tag', 'duplicate_tag'] }
      }
    ]

  for (const scenario of invalidScenarios) {
    test(`invalid article creation: ${scenario.name}`, async ({ page, articleEdit, navBar, loggedInUser }) => {
      const scenarioArticle = createArticle({ overrides: scenario.override })
      await navBar.newArticleLink.click();
      await articleEdit.fillFormFields(scenarioArticle)
      if (await articleEdit.publishButton.isEnabled()) {
        const editorUrl = page.url()
        const { title, subject, content, tagList } = scenarioArticle
        await articleEdit.publishButton.click()
        await expect(page).toHaveURL(editorUrl)
        await expect(articleEdit.publishButton).toBeVisible()
        await expect(articleEdit.titleInput).toHaveValue(title)
        await expect(articleEdit.subjectInput).toHaveValue(subject)
        await expect(articleEdit.contentInput).toHaveValue(content)
        
        const trimFilterAndSort = (tags: string[]): string[] => tags.map(x => x.trim()).filter(x => x.length > 0).sort()
        const filteredTagList = trimFilterAndSort(tagList)
        const inputTagsValue = await articleEdit.tagsInput.inputValue()
        const filteredInputTags = trimFilterAndSort(inputTagsValue.split(" "))
        expect(JSON.stringify(filteredInputTags)).toBe(JSON.stringify(filteredTagList))

      }
      else {
        await expect(articleEdit.publishButton).toBeDisabled()
      }

    })
  }

})
