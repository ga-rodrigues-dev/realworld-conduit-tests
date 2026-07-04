import { nanoid } from 'nanoid';

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

export function createArticle({articleType = "article", uniqueId = nanoid(3), overrides = {}}:ArticleOptions = {}): Article {
    return {
        id: uniqueId,
        title: `${articleType} ${uniqueId}`,
        subject: `${articleType} subject ${uniqueId}`,
        content: `${articleType} content ${uniqueId}`,
        tagList: [`${articleType}tag1_${uniqueId}`, `${articleType}tag2_${uniqueId}`, `${articleType}_tag3_${uniqueId}`],
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

export function createUser({userType = "user", uniqueId = nanoid(3), overrides = {}}:UserOptions = {}): User {
    return {
        id: uniqueId,
        username: `${userType}_${uniqueId}`,
        password: `password_${uniqueId}`,
        email: `${userType}_${uniqueId}@example.com`,
        ...overrides,
    };
}