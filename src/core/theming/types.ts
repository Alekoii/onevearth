export interface ColorScale {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
}

export interface Theme {
    name: string;
    dark: boolean;
    colors: {
        primary: ColorScale;
        secondary: ColorScale;
        background: {
            primary: string;
            secondary: string;
            tertiary: string;
        };
        surface: {
            primary: string;
            secondary: string;
            tertiary: string;
        };
        text: {
            primary: string;
            secondary: string;
            tertiary: string;
            inverse: string;
        };
        border: {
            primary: string;
            secondary: string;
            focus: string;
        };
        status: {
            success: string;
            warning: string;
            error: string;
            info: string;
        };
    };
    typography: {
        fontFamily: {
            regular: string;
            medium: string;
            semibold: string;
            bold: string;
        };
        fontSize: {
            xs: number;
            sm: number;
            md: number;
            lg: number;
            xl: number;
            "2xl": number;
            "3xl": number;
        };
        lineHeight: {
            tight: number;
            normal: number;
            relaxed: number;
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
    };
    borderRadius: {
        none: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        full: number;
    };
}

export type ThemeName = "light" | "dark" | "auto";
