import { ReactNode, useEffect, useState } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en-KE.json';
import sw from './locales/sw-KE.json';

const supported = (import.meta.env.VITE_SUPPORTED_LOCALES ?? 'en-KE,sw-KE').split(',');
const fallback = import.meta.env.VITE_DEFAULT_LOCALE ?? 'en-KE';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'en-KE': { translation: en },
      'sw-KE': { translation: sw },
    },
    fallbackLng: fallback,
    supportedLngs: supported,
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator'], lookupLocalStorage: 'nexora.lang' },
  })
  .then(() => {
    document.documentElement.lang = i18n.language || fallback;
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

export { i18n };

export function I18nGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(i18n.isInitialized);
  useEffect(() => {
    if (i18n.isInitialized) return;
    const fn = () => setReady(true);
    i18n.on('initialized', fn);
    return () => {
      i18n.off('initialized', fn);
    };
  }, []);
  if (!ready) return null;
  return <>{children}</>;
}
