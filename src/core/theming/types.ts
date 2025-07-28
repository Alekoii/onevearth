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
            display: string; // For headings
        };

        fontSize: {
            xs: number; // 12
            sm: number; // 14
            md: number; // 16
            lg: number; // 18
            xl: number; // 20
            "2xl": number; // 24
            "3xl": number; // 30
            "4xl": number; // 36
            "5xl": number; // 48
        };

        // Fixed: Use React Native compatible font weights
        fontWeight: {
            light: FontWeight; // '300'
            normal: FontWeight; // 'normal' or '400'
            medium: FontWeight; // '500'
            semibold: FontWeight; // '600'
            bold: FontWeight; // 'bold' or '700'
            extrabold: FontWeight; // '800'
        };

        lineHeight: {
            tight: number; // 1.2
            normal: number; // 1.5
            relaxed: number; // 1.75
            loose: number; // 2.0
        };

        letterSpacing: {
            tight: number; // -0.5
            normal: number; // 0
            wide: number; // 0.5
            wider: number; // 1
        };
    };

    spacing: {
        xs: number; // 4
        sm: number; // 8
        md: number; // 16
        lg: number; // 24
        xl: number; // 32
        "2xl": number; // 48
        "3xl": number; // 64
        "4xl": number; // 96
    };

    borderRadius: {
        none: number; // 0
        xs: number; // 2
        sm: number; // 4
        md: number; // 8
        lg: number; // 12
        xl: number; // 16
        "2xl": number; // 24
        full: number; // 9999
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
            instant: number; // 0
            fast: number; // 150
            normal: number; // 300
            slow: number; // 500
            slower: number; // 1000
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
    elevation: number; // Android
}

export interface ComponentStyles {
    // Layout components
    Screen: ScreenStyles;
    Card: CardStyles;
    Header: HeaderStyles;

    // Form components
    Button: ButtonStyles;
    Input: InputStyles;

    // Content components
    PostCard: PostCardStyles;
    PostCreator: PostCreatorStyles;

    // Navigation
    TabBar: TabBarStyles;

    // Additional components can be added here
    [componentName: string]: any;
}

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
