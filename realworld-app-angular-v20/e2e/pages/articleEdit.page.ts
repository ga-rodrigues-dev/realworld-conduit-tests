import type { Page, Locator } from '@playwright/test';

export default class ArticleEdit {
    constructor(private readonly page: Page) {

    }

    get titleInput(): Locator {
        return this.page.getByPlaceholder('Article Title')
    }

    get subjectInput(): Locator {
        return this.page.getByPlaceholder("What's this article about?")
    }

    get contentInput(): Locator {
        return this.page.getByPlaceholder('Write your article (in markdown)')
    }

    get tagsInput(): Locator {
        return this.page.getByPlaceholder('Enter tags (separated by spaces)')
    }

    get publishButton(): Locator {
        return this.page.getByRole('button', { name: 'Publish Article' })
    }
}