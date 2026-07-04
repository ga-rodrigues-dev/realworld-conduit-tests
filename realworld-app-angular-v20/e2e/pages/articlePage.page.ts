import type { Page, Locator } from '@playwright/test';
import { expect } from '../fixtures';
import { routes } from '../support/routes';


export default class ArticlePage {
    readonly editBtn: Locator;
    readonly deleteBtn: Locator;
    readonly postCommentBtn: Locator;
    readonly commentInput: Locator;
    readonly commentSection: Locator;
    readonly commentCards: Locator;
    readonly followBtn: Locator;
    readonly favoriteBtn: Locator;

    constructor(private readonly page: Page) {
        this.editBtn = this.page.getByRole('button', { name: 'edit' });
        this.deleteBtn = this.page.getByRole('button', { name: 'delete' });
        this.postCommentBtn = this.page.getByRole('button', { name: 'Post Comment' });
        this.commentInput = this.page.getByPlaceholder('Write a comment');
        this.commentSection = this.page.locator('app-comment-list');
        this.commentCards = this.commentSection.locator('div > div');
        this.followBtn = this.page.getByRole('button', { name: 'Follow' });
        this.favoriteBtn = this.page.locator('button:has(i.ion-heart)');
    }

    async goto(articleTitle: string): Promise<void> {

        await this.page.goto(routes.article(articleTitle))

    }



    heading(title: string): Locator {

        return this.page.getByRole('heading', { name: title })

    }



    contentText(content: string): Locator {

        return this.page.getByText(content, { exact: true })

    }



    locateTag(tag: string): Locator {

        return this.page.locator('li').filter({ has: this.page.getByText(tag, { exact: true }) })

    }



    locateAuthorName(name: string): Locator {

        return this.page.getByRole('main').getByText(name, { exact: true })

    }



    deleteCommentBtn(comment: string, username?:string): Locator {

        let card: Locator = this.commentCards.filter({ has: this.page.getByText(comment, { exact: true }) })

        if (username) {

            card = card.filter({ has: this.page.getByText(username, { exact: true }) })

        }

        return card.getByTitle("Delete comment")

    }



    async postComment(comment: string):Promise<void> {

        await this.commentInput.fill(comment)

        await this.postCommentBtn.click()

        await this.page.waitForURL(routes.articlePattern)

    }



    

    async commentCount(): Promise<number> {
        await expect(this.commentSection).toBeVisible()
        return this.commentCards.count()

    }







}
