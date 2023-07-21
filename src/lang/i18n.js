import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: en,
    es: es,
    fr: fr,
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
