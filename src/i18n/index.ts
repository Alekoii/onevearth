import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

import en from "@/locales/en.json";
import es from "@/locales/es.json";

const resources = {
    en: { translation: en },
    es: { translation: es },
};

const deviceLanguage = getLocales()[0]?.languageCode || "en";

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: "v4",
        resources,
        lng: deviceLanguage,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });

export default i18n;
