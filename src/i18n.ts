export type Language = 'ko' | 'en';

export interface TranslationStrings {
  dialogue: {
    clickToContinue: string;
  };
  settings: {
    title: string;
    language: string;
    close: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  ko: {
    dialogue: {
      clickToContinue: '▼ 클릭하여 계속하기',
    },
    settings: {
      title: '게임 설정 (Settings)',
      language: '언어 선택 / Language',
      close: '설정 닫기',
    },
  },
  en: {
    dialogue: {
      clickToContinue: '▼ Click to continue',
    },
    settings: {
      title: 'Game Settings',
      language: 'Language',
      close: 'Close Settings',
    },
  },
};
