import type { Page, Locator } from '@playwright/test';
import type { Article } from '../support/factories';
import { routes } from '../support/routes';



export default class ArticleEdit {
    readonly titleInput: Locator;
    readonly subjectInput: Locator;
    readonly contentInput: Locator;
    readonly tagsInput: Locator;
    readonly publishButton: Locator;

    constructor(private readonly page: Page) {
        this.titleInput = this.page.getByPlaceholder('Article Title');
        this.subjectInput = this.page.getByPlaceholder("What's this article about?");
        this.contentInput = this.page.getByPlaceholder('Write your article (in markdown)');
        this.tagsInput = this.page.getByPlaceholder('Enter tags (separated by spaces)');
        this.publishButton = this.page.getByRole('button', { name: 'Publish Article' });
    }

    async goto(): Promise<void> {

        await this.page.goto(routes.editor)

    }

    async gotoSlug(slug: string): Promise<void> {
        await this.page.goto(routes.editorSlug(slug))
    }

    async fillFormFields(article: Article):Promise<void> {

        await this.titleInput.fill(article.title)

        await this.subjectInput.fill(article.subject)

        await this.contentInput.fill(article.content)

        await this.tagsInput.fill(article.tagList.join(' '))
    }

    async publishArticle(article: Article):Promise<void> {

        await this.fillFormFields(article)

        await this.publishButton.click()

        await this.page.waitForURL(routes.articlePattern)

    }

    

}
