import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { Appearance, ColorSchemeName } from "react-native";
import { Theme, ThemeCustomization, ThemeName } from "./types";
import { customizeLightTheme, lightTheme } from "@/themes/presets/lightTheme";
import { customizeDarkTheme, darkTheme } from "@/themes/presets/darkTheme";
import { useConfig } from "@/core/config/ConfigProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ThemeContextType {
    theme: Theme;
    themeName: ThemeName;
    setTheme: (theme: ThemeName, customizations?: ThemeCustomization) => void;
    isDark: boolean;
    isCustomized: boolean;
    resetTheme: () => void;
    customizeTheme: (customizations: ThemeCustomization) => void;
    availableThemes: { name: string; displayName: string; preview: Theme }[];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
};

// Built-in themes registry
const builtInThemes = {
    light: lightTheme,
    dark: darkTheme,
};

const THEME_STORAGE_KEY = "app_theme";
const THEME_CUSTOMIZATION_KEY = "theme_customization";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const { config } = useConfig();
    const [themeName, setThemeName] = useState<ThemeName>("auto");
    const [systemTheme, setSystemTheme] = useState<ColorSchemeName>("light");
    const [customizations, setCustomizations] = useState<ThemeCustomization>(
        {},
    );
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            try {
                // Get system color scheme
                const systemColorScheme = Appearance.getColorScheme();
                setSystemTheme(systemColorScheme);

                // Load saved theme preference and customizations
                await Promise.all([
                    loadThemePreference(),
                    loadThemeCustomizations(),
                ]);

                setIsInitialized(true);
            } catch (error) {
                console.warn("Theme initialization failed:", error);
                setThemeName("light");
                setIsInitialized(true);
            }
        };

        initialize();

        // Listen for system theme changes
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setSystemTheme(colorScheme);
        });

        return () => subscription?.remove();
    }, []);

    const loadThemePreference = async () => {
        try {
            const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (saved && isValidThemeName(saved)) {
                setThemeName(saved as ThemeName);
            } else {
                // Use config default
                setThemeName(
                    config.ui.theme.darkModeDefault ? "dark" : "light",
                );
            }
        } catch (error) {
            console.warn("Failed to load theme preference:", error);
        }
    };

    const loadThemeCustomizations = async () => {
        try {
            const saved = await AsyncStorage.getItem(THEME_CUSTOMIZATION_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                setCustomizations(parsed);
            }
        } catch (error) {
            console.warn("Failed to load theme customizations:", error);
        }
    };

    const setTheme = async (
        newTheme: ThemeName,
        newCustomizations?: ThemeCustomization,
    ) => {
        setThemeName(newTheme);

        if (newCustomizations) {
            setCustomizations(newCustomizations);
        }

        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
            if (newCustomizations) {
                await AsyncStorage.setItem(
                    THEME_CUSTOMIZATION_KEY,
                    JSON.stringify(newCustomizations),
                );
            }
        } catch (error) {
            console.warn("Failed to save theme preference:", error);
        }
    };

    const customizeTheme = async (newCustomizations: ThemeCustomization) => {
        const mergedCustomizations = {
            ...customizations,
            ...newCustomizations,
        };
        setCustomizations(mergedCustomizations);

        try {
            await AsyncStorage.setItem(
                THEME_CUSTOMIZATION_KEY,
                JSON.stringify(mergedCustomizations),
            );
        } catch (error) {
            console.warn("Failed to save theme customizations:", error);
        }
    };

    const resetTheme = async () => {
        setCustomizations({});
        try {
            await AsyncStorage.removeItem(THEME_CUSTOMIZATION_KEY);
        } catch (error) {
            console.warn("Failed to reset theme customizations:", error);
        }
    };

    const getActiveTheme = (): Theme => {
        // Determine base theme
        let baseTheme: Theme;

        if (themeName === "auto") {
            baseTheme = systemTheme === "dark"
                ? builtInThemes.dark
                : builtInThemes.light;
        } else if (builtInThemes[themeName as keyof typeof builtInThemes]) {
            baseTheme = builtInThemes[themeName as keyof typeof builtInThemes];
        } else {
            // Custom theme name - fallback to light
            baseTheme = builtInThemes.light;
        }

        // Apply customizations if any
        if (Object.keys(customizations).length > 0) {
            return applyCustomizations(baseTheme, customizations);
        }

        // Apply config-level customizations
        if (
            config.ui.theme.customColors &&
            Object.keys(config.ui.theme.customColors).length > 0
        ) {
            return applyConfigCustomizations(
                baseTheme,
                config.ui.theme.customColors,
            );
        }

        return baseTheme;
    };

    const applyCustomizations = (
        baseTheme: Theme,
        customizations: ThemeCustomization,
    ): Theme => {
        if (baseTheme.meta.dark) {
            return customizeDarkTheme({
                primaryColor: customizations.colors?.primary?.[500],
                secondaryColor: customizations.colors?.secondary?.[500],
                accentColor: customizations.colors?.accent?.[500],
                fontFamily: customizations.typography?.fontFamily?.primary,
                // Add more customization mappings as needed
            });
        } else {
            return customizeLightTheme({
                primaryColor: customizations.colors?.primary?.[500],
                secondaryColor: customizations.colors?.secondary?.[500],
                accentColor: customizations.colors?.accent?.[500],
                fontFamily: customizations.typography?.fontFamily?.primary,
                // Add more customization mappings as needed
            });
        }
    };

    const applyConfigCustomizations = (
        baseTheme: Theme,
        customColors: Record<string, string>,
    ): Theme => {
        const customizations: any = {};

        if (customColors.primary) {
            customizations.primaryColor = customColors.primary;
        }
        if (customColors.secondary) {
            customizations.secondaryColor = customColors.secondary;
        }
        if (customColors.accent) {
            customizations.accentColor = customColors.accent;
        }

        if (baseTheme.meta.dark) {
            return customizeDarkTheme(customizations);
        } else {
            return customizeLightTheme(customizations);
        }
    };

    // Don't render until initialized
    if (!isInitialized) {
        return null;
    }

    const activeTheme = getActiveTheme();
    const isCustomized = Object.keys(customizations).length > 0;

    // Available themes for theme picker
    const availableThemes = [
        {
            name: "light",
            displayName: "Light",
            preview: builtInThemes.light,
        },
        {
            name: "dark",
            displayName: "Dark",
            preview: builtInThemes.dark,
        },
        {
            name: "auto",
            displayName: "Auto",
            preview: systemTheme === "dark"
                ? builtInThemes.dark
                : builtInThemes.light,
        },
    ];

    const value: ThemeContextType = {
        theme: activeTheme,
        themeName,
        setTheme,
        isDark: activeTheme.meta.dark,
        isCustomized,
        resetTheme,
        customizeTheme,
        availableThemes,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// Helper functions
function isValidThemeName(name: string): boolean {
    return ["light", "dark", "auto"].includes(name) || name.length > 0;
}
