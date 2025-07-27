export type Language = "en" | "es";

export interface LanguageOption {
    code: Language;
    name: string;
    nativeName: string;
}

export const availableLanguages: LanguageOption[] = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "es", name: "Spanish", nativeName: "Español" },
];
