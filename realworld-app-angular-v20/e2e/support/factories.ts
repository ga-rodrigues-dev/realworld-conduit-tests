export type Article = {
    id: string
    title: string
    subject: string
    content: string
    tagList: string[]
}

interface ArticleOptions {
    articleType?:string
    uniqueId?:string
    overrides?:Partial<Article>
}

export function createArticle({articleType = "article", uniqueId = crypto.randomUUID(), overrides = {}}:ArticleOptions = {}): Article {
    return {
        id: uniqueId,
        title: `${articleType}-${uniqueId}`,
        subject: `${articleType}-subject-${uniqueId}`,
        content: `${articleType}-content-${uniqueId}`,
        tagList: [`${articleType}-tag1-${uniqueId}`, `${articleType}-tag2-${uniqueId}`, `${articleType}-tag3-${uniqueId}`],
        ...overrides,
    };
}

export type User = {
    id: string
    username: string
    password: string
    email: string
  }

interface UserOptions {
    userType?:string
    uniqueId?:string
    overrides?:Partial<User>
}

export function createUser({userType = "user", uniqueId = crypto.randomUUID(), overrides = {}}:UserOptions = {}): User {
    return {
        id: uniqueId,
        username: `${userType}-${uniqueId}`,
        password: `password-${uniqueId}`,
        email: `${userType}-${uniqueId}@example.com`,
        ...overrides,
    };
}