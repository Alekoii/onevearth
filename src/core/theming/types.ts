import { TextStyle, ViewStyle } from "react-native";

// React Native compatible font weight type
type FontWeight = TextStyle["fontWeight"];

export interface ColorScale {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string; // Primary shade
    600: string;
    700: string;
    800: string;
    900: string;
}

export interface Theme {
    meta: {
        name: string;
        displayName: string;
        description: string;
        author: string;
        version: string;
        dark: boolean;
    };

    colors: {
        // Brand colors
        primary: ColorScale;
        secondary: ColorScale;
        accent: ColorScale;

        // Semantic colors
        success: ColorScale;
        warning: ColorScale;
        error: ColorScale;
        info: ColorScale;

        // Neutral colors
        neutral: ColorScale;

        // Background colors
        background: {
            primary: string;
            secondary: string;
            tertiary: string;
            overlay: string;
            modal: string;
            card: string;
        };

        // Surface colors
        surface: {
            primary: string;
            secondary: string;
            tertiary: string;
            elevated: string;
            inverse: string;
        };

        // Text colors
        text: {
            primary: string;
            secondary: string;
            tertiary: string;
            inverse: string;
            link: string;
            disabled: string;
            placeholder: string;
        };

        // Border colors
        border: {
            primary: string;
            secondary: string;
            focus: string;
            error: string;
            success: string;
            disabled: string;
        };

        // Interactive states
        interactive: {
            hover: string;
            pressed: string;
            focus: string;
            disabled: string;
            selected: string;
        };
    };

    typography: {
        fontFamily: {
            primary: string;
            secondary: string;
            monospace: string;
            display: string;
        };

        fontSize: {
            xs: number;
            sm: number;
            md: number;
            lg: number;
            xl: number;
            "2xl": number;
            "3xl": number;
            "4xl": number;
            "5xl": number;
        };

        fontWeight: {
            light: FontWeight;
            normal: FontWeight;
            medium: FontWeight;
            semibold: FontWeight;
            bold: FontWeight;
            extrabold: FontWeight;
        };

        lineHeight: {
            tight: number;
            normal: number;
            relaxed: number;
            loose: number;
        };

        letterSpacing: {
            tight: number;
            normal: number;
            wide: number;
            wider: number;
        };
    };

    spacing: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        "2xl": number;
        "3xl": number;
        "4xl": number;
    };

    borderRadius: {
        none: number;
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        "2xl": number;
        full: number;
    };

    shadows: {
        none: ShadowStyle;
        xs: ShadowStyle;
        sm: ShadowStyle;
        md: ShadowStyle;
        lg: ShadowStyle;
        xl: ShadowStyle;
    };

    animations: {
        durations: {
            instant: number;
            fast: number;
            normal: number;
            slow: number;
            slower: number;
        };

        easings: {
            linear: string;
            easeIn: string;
            easeOut: string;
            easeInOut: string;
            bounce: string;
            elastic: string;
        };
    };

    // Component-specific styles
    components: ComponentStyles;
}

export interface ShadowStyle {
    shadowColor: string;
    shadowOffset: {
        width: number;
        height: number;
    };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
}

// More flexible component styles interface
export interface ComponentStyles {
    [componentName: string]: ComponentStyleDefinition;
}

export interface ComponentStyleDefinition {
    base: ViewStyle | TextStyle; // Make base required
    variants?: Record<string, ViewStyle | TextStyle>;
    sizes?: Record<string, ViewStyle | TextStyle>;
    states?: Record<string, ViewStyle | TextStyle>;
    [key: string]: any; // Allow arbitrary additional styles
}

// Specific component style interfaces for better typing where needed
export interface BaseComponentStyle {
    base: ViewStyle | TextStyle;
    variants?: Record<string, ViewStyle | TextStyle>;
    sizes?: Record<string, ViewStyle | TextStyle>;
    states?: Record<string, ViewStyle | TextStyle>;
}

export interface ScreenStyles extends BaseComponentStyle {
    content: ViewStyle;
    padding: ViewStyle;
}

export interface CardStyles extends BaseComponentStyle {
    shadow: ViewStyle;
    border: ViewStyle;
}

export interface HeaderStyles extends BaseComponentStyle {
    title: TextStyle;
    subtitle: TextStyle;
    actions: ViewStyle;
}

export interface ButtonStyles extends BaseComponentStyle {
    text: Record<string, TextStyle>;
    icon: ViewStyle;
    loading: ViewStyle;
}

export interface InputStyles extends BaseComponentStyle {
    label: TextStyle;
    error: TextStyle;
    helper: TextStyle;
    container: ViewStyle;
}

export interface PostCardStyles extends BaseComponentStyle {
    header: ViewStyle;
    content: ViewStyle;
    actions: ViewStyle;
    username: TextStyle;
    timestamp: TextStyle;
    contentText: TextStyle;
}

export interface PostCreatorStyles extends BaseComponentStyle {
    input: ViewStyle;
    toolbar: ViewStyle;
    actions: ViewStyle;
}

export interface TabBarStyles extends BaseComponentStyle {
    tab: ViewStyle;
    label: TextStyle;
    icon: ViewStyle;
    badge: ViewStyle;
}

// Theme customization types
export interface ThemeCustomization {
    colors?: Partial<Theme["colors"]>;
    typography?: Partial<Theme["typography"]>;
    spacing?: Partial<Theme["spacing"]>;
    borderRadius?: Partial<Theme["borderRadius"]>;
    components?: Partial<ComponentStyles>;
}

export type ThemeName = "light" | "dark" | "auto" | string;
