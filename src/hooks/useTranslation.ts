import { useTranslation as useI18nTranslation } from "react-i18next";

export const useTranslation = () => {
    try {
        const { t, i18n } = useI18nTranslation();

        const changeLanguage = (language: string) => {
            i18n.changeLanguage(language);
        };

        const currentLanguage = i18n.language;

        return {
            t,
            changeLanguage,
            currentLanguage,
            isRTL: i18n.dir() === "rtl",
        };
    } catch (error) {
        console.error("Translation hook error:", error);
        return {
            t: (key: string) => key,
            changeLanguage: () => {},
            currentLanguage: "en",
            isRTL: false,
        };
    }
};
