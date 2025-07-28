import { Theme } from "@/core/theming/types";

// Base theme that other themes extend from
export const createBaseTheme = (isDark: boolean = false): Partial<Theme> => ({
    typography: {
        fontFamily: {
            primary: "System",
            secondary: "System",
            monospace: "Courier",
            display: "System",
        },

        fontSize: {
            xs: 12,
            sm: 14,
            md: 16,
            lg: 18,
            xl: 20,
            "2xl": 24,
            "3xl": 30,
            "4xl": 36,
            "5xl": 48,
        },

        fontWeight: {
            light: "300",
            normal: "400",
            medium: "500",
            semibold: "600",
            bold: "700",
            extrabold: "800",
        },

        lineHeight: {
            tight: 1.2,
            normal: 1.5,
            relaxed: 1.75,
            loose: 2.0,
        },

        letterSpacing: {
            tight: -0.5,
            normal: 0,
            wide: 0.5,
            wider: 1,
        },
    },

    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        "2xl": 48,
        "3xl": 64,
        "4xl": 96,
    },

    borderRadius: {
        none: 0,
        xs: 2,
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        "2xl": 24,
        full: 9999,
    },

    shadows: {
        none: {
            shadowColor: "transparent",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
        },
        xs: {
            shadowColor: isDark ? "#000000" : "#000000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: isDark ? 0.3 : 0.1,
            shadowRadius: 1,
            elevation: 1,
        },
        sm: {
            shadowColor: isDark ? "#000000" : "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.4 : 0.1,
            shadowRadius: 2,
            elevation: 2,
        },
        md: {
            shadowColor: isDark ? "#000000" : "#000000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.5 : 0.15,
            shadowRadius: 4,
            elevation: 4,
        },
        lg: {
            shadowColor: isDark ? "#000000" : "#000000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isDark ? 0.6 : 0.2,
            shadowRadius: 8,
            elevation: 8,
        },
        xl: {
            shadowColor: isDark ? "#000000" : "#000000",
            shadowOffset: { width: 0, height: 16 },
            shadowOpacity: isDark ? 0.7 : 0.25,
            shadowRadius: 16,
            elevation: 16,
        },
    },

    animations: {
        durations: {
            instant: 0,
            fast: 150,
            normal: 300,
            slow: 500,
            slower: 1000,
        },

        easings: {
            linear: "linear",
            easeIn: "ease-in",
            easeOut: "ease-out",
            easeInOut: "ease-in-out",
            bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        },
    },
});

// Helper function to create color scales
export const createColorScale = (baseColor: string): any => {
    // This is a simplified implementation
    // In a real app, you'd use a proper color manipulation library
    return {
        50: lighten(baseColor, 0.95),
        100: lighten(baseColor, 0.9),
        200: lighten(baseColor, 0.75),
        300: lighten(baseColor, 0.6),
        400: lighten(baseColor, 0.3),
        500: baseColor,
        600: darken(baseColor, 0.1),
        700: darken(baseColor, 0.2),
        800: darken(baseColor, 0.3),
        900: darken(baseColor, 0.4),
    };
};

// Simple color manipulation functions
function lighten(color: string, amount: number): string {
    // Simplified implementation - in production use a proper color library
    return color;
}

function darken(color: string, amount: number): string {
    // Simplified implementation - in production use a proper color library
    return color;
}
