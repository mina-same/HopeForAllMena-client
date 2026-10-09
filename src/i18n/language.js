// gatsby-plugin-react-i18next reads this localStorage key to decide the language of
// un-prefixed URLs: when it holds 'ar', a link to '/about' is redirected to '/ar/about'.
// Keeping it in sync with the page the visitor is on means any link that forgets the
// language prefix still lands on the right language.
export const LANGUAGE_STORAGE_KEY = 'gatsby-i18next-language';

const PREFIXED_LANGUAGES = ['ar'];

export const rememberLanguage = (language) => {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (e) {
    // Storage can be unavailable (private mode, blocked site data); links still work without it.
  }
};

export const languageFromPath = (pathname = '') => {
  const prefix = pathname.split('/')[1];
  return PREFIXED_LANGUAGES.includes(prefix) ? prefix : null;
};
