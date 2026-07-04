const BASE_URL = 'http://localhost:4200'

export const routes = {
  home: `${BASE_URL}/`,
  register: `${BASE_URL}/register`,
  login: `${BASE_URL}/login`,
  editor: `${BASE_URL}/editor`,
  settings: `${BASE_URL}/settings`,
  article: (slug: string) => `${BASE_URL}/article/${encodeURIComponent(slug)}`,
  articlePattern: `${BASE_URL}/article/**`,
  profile: (username: string) => `${BASE_URL}/profile/${encodeURIComponent(username)}`,
  editorSlug: (slug: string) => `${BASE_URL}/editor/${encodeURIComponent(slug)}`,
} as const
