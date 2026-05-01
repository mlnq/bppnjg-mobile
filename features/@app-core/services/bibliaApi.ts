import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { BIBLE_API_TAGS, BibleApiTag } from './bible.tags';

export const DEFAULT_BIBLE_TRANSLATION = 'bt' as const;

export type BibleTranslation = typeof DEFAULT_BIBLE_TRANSLATION | string;

export type BibliaTranslation = {
  name: string;
  abbreviation: string;
};

export type BibliaBook = {
  name: string;
  abbreviation: string;
};

export type BibliaVerse = {
  verse: string;
  text: string;
};

export type BibliaChapterResponse = {
  type: string;
  bible: BibliaTranslation;
  book: BibliaBook;
  chapter: number;
  verses_range: string;
  verses: BibliaVerse[];
};

export type BibliaBookWithPart = BibliaBook & {
  part: {
    name: string;
    abbreviation: string;
  };
};

export type BibliaTranslationInfo = {
  type: string;
  name: string;
  abbreviation: string;
  language: string;
  description?: string;
  books_length: number;
  books: BibliaBookWithPart[];
};

export type BibliaVersion = {
  timestamp: number;
  version: string;
};

export type GetChapterArgs = {
  bible?: BibleTranslation;
  book: string;
  chapter: number;
  escape?: boolean;
};

export type GetVersesArgs = GetChapterArgs & {
  verses: string;
};

export const bibliaApi = createApi({
  reducerPath: 'bibliaApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://www.biblia.info.pl/api',
  }),
  tagTypes: BIBLE_API_TAGS,
  endpoints: (builder) => ({
    getBibleInfo: builder.query<BibliaTranslationInfo, BibleTranslation | void>({
      query: (bible = DEFAULT_BIBLE_TRANSLATION) => `/info/biblie/${bible}`,
      providesTags: (_result, _error, bible) => {
        const translation = bible ?? DEFAULT_BIBLE_TRANSLATION;

        return [{ type: BibleApiTag.BibleInfo, id: translation }];
      },
    }),
    getChapter: builder.query<BibliaChapterResponse, GetChapterArgs>({
      query: ({ bible = DEFAULT_BIBLE_TRANSLATION, book, chapter, escape = true }) => ({
        url: `/biblia/${bible}/${book}/${chapter}`,
        params: { escape },
      }),
      providesTags: (_result, _error, { bible = DEFAULT_BIBLE_TRANSLATION, book, chapter }) => [
        { type: BibleApiTag.BibleText, id: `${bible}:${book}:${chapter}` },
      ],
    }),
    getVerses: builder.query<BibliaChapterResponse, GetVersesArgs>({
      query: ({ bible = DEFAULT_BIBLE_TRANSLATION, book, chapter, verses, escape = true }) => ({
        url: `/biblia/${bible}/${book}/${chapter}/${verses}`,
        params: { escape },
      }),
      providesTags: (_result, _error, { bible = DEFAULT_BIBLE_TRANSLATION, book, chapter, verses }) => [
        { type: BibleApiTag.BibleText, id: `${bible}:${book}:${chapter}:${verses}` },
      ],
    }),
    getVersion: builder.query<BibliaVersion, void>({
      query: () => '/version',
      providesTags: [BibleApiTag.BibleVersion],
    }),
  }),
});

export const {
  useGetBibleInfoQuery,
  useGetChapterQuery,
  useGetVersesQuery,
  useGetVersionQuery,
} = bibliaApi;
