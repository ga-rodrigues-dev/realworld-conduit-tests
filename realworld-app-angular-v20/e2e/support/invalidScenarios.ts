import type { Article } from './factories';

export type ArticleInvalidScenario = {
  name: string;
  override: Partial<Article>;
};

export const articleInvalidScenarios: ArticleInvalidScenario[] = [
  {
    name: 'empty title',
    override: { title: '' },
  },
  {
    name: 'blank title',
    override: { title: '   ' },
  },
  {
    name: 'empty subject',
    override: { subject: '' },
  },
  {
    name: 'blank subject',
    override: { subject: '   ' },
  },
  {
    name: 'empty content',
    override: { content: '' },
  },
  {
    name: 'blank content',
    override: { content: '   ' },
  },
  {
    name: 'empty tags',
    override: { tagList: [] },
  },
  {
    name: 'blank tags',
    override: { tagList: [' '] },
  },
  {
    name: 'duplicate tags',
    override: { tagList: ['duplicate_tag', 'duplicate_tag'] },
  },
];

export type CommentInvalidScenario = {
  name: string;
  comment: string;
};

export const commentInvalidScenarios: CommentInvalidScenario[] = [
  {
    name: 'empty comment',
    comment: '',
  },
  {
    name: 'blank comment',
    comment: '   ',
  },
];
