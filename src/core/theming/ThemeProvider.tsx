import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { Appearance, ColorSchemeName } from "react-native";
import { Theme, ThemeName } from "@/core/theming/types";
import { lightTheme } from "@/themes/light";
import { darkTheme } from "@/themes/dark";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ThemeContextType {
    theme: Theme;
    themeName: ThemeName;
    setTheme: (theme: ThemeName) => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
};

const themes = {
    light: lightTheme,
    dark: darkTheme,
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [themeName, setThemeName] = useState<ThemeName>("light");
    const [systemTheme, setSystemTheme] = useState<ColorSchemeName>("light");
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            try {
                const systemColorScheme = Appearance.getColorScheme();
                setSystemTheme(systemColorScheme);

                await loadThemePreference();
                setIsInitialized(true);
            } catch (error) {
                console.warn("Theme initialization failed:", error);
                setThemeName("light");
                setIsInitialized(true);
            }
        };

        initialize();

        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setSystemTheme(colorScheme);
        });

        return () => subscription?.remove();
    }, []);

    const loadThemePreference = async () => {
        try {
            const saved = await AsyncStorage.getItem("theme");
            if (saved && ["light", "dark", "auto"].includes(saved)) {
                setThemeName(saved as ThemeName);
            }
        } catch (error) {
            console.warn("Failed to load theme preference:", error);
        }
    };

    const setTheme = async (newTheme: ThemeName) => {
        setThemeName(newTheme);
        try {
            await AsyncStorage.setItem("theme", newTheme);
        } catch (error) {
            console.warn("Failed to save theme preference:", error);
        }
    };

    const getActiveTheme = (): Theme => {
        if (themeName === "auto") {
            return systemTheme === "dark" ? themes.dark : themes.light;
        }
        return themes[themeName] || themes.light;
    };

    if (!isInitialized) {
        return null;
    }

    const activeTheme = getActiveTheme();

    return (
        <ThemeContext.Provider
            value={{
                theme: activeTheme,
                themeName,
                setTheme,
                isDark: activeTheme.dark,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};
