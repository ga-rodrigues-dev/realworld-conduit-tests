import type { Page, Locator } from '@playwright/test';

export default class ArticlePage {
    constructor(private readonly page: Page) {

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
        return this.page.getByText(name)
    }
    
    get editBtn(): Locator {
        return this.page.getByRole("button", {name:"edit"})
    }

    get deleteBtn(): Locator {
        return this.page.getByRole("button", {name:"delete"})
    }

    get postComment(): Locator {
        return this.page.getByRole("button", {name:"Post Comment"})
    }

    get commentInput(): Locator {
        return this.page.getByPlaceholder("Write a comment")
    }

    get commentSection(): Locator {
        return this.page.locator('app-comment-list')
    }

    get commentCards(): Locator {
        return this.commentSection.locator('div > div')
    }

    async commentCount(): Promise<number> {
        return this.commentCards.count()
    }

    deleteCommentBtn(comment: string, username?:string): Locator {
        let card: Locator = this.commentCards.filter({ has: this.page.getByText(comment, { exact: true }) })
        if (username) {
            card = card.filter({ has: this.page.getByText(username, { exact: true }) })
        }
        return card.getByTitle("Delete comment")
    }

    get followBtn(): Locator {
        return this.page.getByRole("button", {name:"Follow"})
    }



}