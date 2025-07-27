import { useEffect, useState } from "react";
import { getLocales } from "expo-localization";
import { useTranslation } from "@/hooks/useTranslation";
import { Language } from "@/i18n/types";

export const useLocale = () => {
    const { changeLanguage, currentLanguage } = useTranslation();
    const [deviceLocale, setDeviceLocale] = useState<string>();

    useEffect(() => {
        const locales = getLocales();
        const locale = locales[0]?.languageCode || "en";
        setDeviceLocale(locale);
    }, []);

    const setLanguage = (language: Language) => {
        changeLanguage(language);
    };

    return {
        currentLanguage: currentLanguage as Language,
        deviceLocale,
        setLanguage,
    };
};
