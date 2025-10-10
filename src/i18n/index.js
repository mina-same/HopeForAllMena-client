import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    keySeparator: '.',
    nsSeparator: false,
    resources: {
      en: {},
      ar: {}
    }
  });

export default i18n;
