import { Theme } from "@/core/theming/types";
import { createBaseTheme } from "../base/baseTheme";
import { createComponentStyles } from "../components/createComponentStyles";

// Dark theme brand colors (same as light but with different context)
const BRAND_COLORS = {
    primary: "#E879F9", // Lighter version for dark backgrounds
    secondary: "#9CA3AF", // Lighter secondary for better contrast
    accent: "#38BDF8", // Lighter accent color
    success: "#34D399", // Lighter success color
    warning: "#FBBF24", // Lighter warning color
    error: "#F87171", // Lighter error color
    info: "#60A5FA", // Lighter info color
};

const createDarkColors = () => ({
    // Primary brand colors (inverted scale for dark theme)
    primary: {
        50: "#701A75",
        100: "#86198F",
        200: "#A21CAF",
        300: "#C026D3",
        400: "#D946EF",
        500: BRAND_COLORS.primary,
        600: "#F0ABFC",
        700: "#F5D0FE",
        800: "#FAE8FF",
        900: "#FDF4FF",
    },

    secondary: {
        50: "#18181B",
        100: "#27272A",
        200: "#3F3F46",
        300: "#52525B",
        400: "#71717A",
        500: BRAND_COLORS.secondary,
        600: "#D4D4D8",
        700: "#E4E4E7",
        800: "#F4F4F5",
        900: "#FAFAFA",
    },

    accent: {
        50: "#0C4A6E",
        100: "#075985",
        200: "#0369A1",
        300: "#0284C7",
        400: "#0EA5E9",
        500: BRAND_COLORS.accent,
        600: "#7DD3FC",
        700: "#BAE6FD",
        800: "#E0F2FE",
        900: "#F0F9FF",
    },

    success: {
        50: "#064E3B",
        100: "#065F46",
        200: "#047857",
        300: "#059669",
        400: "#10B981",
        500: BRAND_COLORS.success,
        600: "#6EE7B7",
        700: "#A7F3D0",
        800: "#D1FAE5",
        900: "#ECFDF5",
    },

    warning: {
        50: "#78350F",
        100: "#92400E",
        200: "#B45309",
        300: "#D97706",
        400: "#F59E0B",
        500: BRAND_COLORS.warning,
        600: "#FCD34D",
        700: "#FDE68A",
        800: "#FEF3C7",
        900: "#FFFBEB",
    },

    error: {
        50: "#7F1D1D",
        100: "#991B1B",
        200: "#B91C1C",
        300: "#DC2626",
        400: "#EF4444",
        500: BRAND_COLORS.error,
        600: "#FCA5A5",
        700: "#FECACA",
        800: "#FEE2E2",
        900: "#FEF2F2",
    },

    info: {
        50: "#1E3A8A",
        100: "#1E40AF",
        200: "#1D4ED8",
        300: "#2563EB",
        400: "#3B82F6",
        500: BRAND_COLORS.info,
        600: "#93C5FD",
        700: "#BFDBFE",
        800: "#DBEAFE",
        900: "#EFF6FF",
    },

    neutral: {
        50: "#171717",
        100: "#262626",
        200: "#404040",
        300: "#525252",
        400: "#737373",
        500: "#A3A3A3",
        600: "#D4D4D4",
        700: "#E5E5E5",
        800: "#F5F5F5",
        900: "#FAFAFA",
    },

    // Dark theme backgrounds
    background: {
        primary: "#111111",
        secondary: "#1F2937",
        tertiary: "#374151",
        overlay: "rgba(0, 0, 0, 0.7)",
        modal: "#1F2937",
        card: "#111111",
    },

    // Dark theme surfaces
    surface: {
        primary: "#111111",
        secondary: "#374151",
        tertiary: "#4B5563",
        elevated: "#374151",
        inverse: "#F9FAFB",
    },

    // Dark theme text colors
    text: {
        primary: "#F9FAFB",
        secondary: "#D1D5DB",
        tertiary: "#9CA3AF",
        inverse: "#111827",
        link: BRAND_COLORS.primary,
        disabled: "#6B7280",
        placeholder: "#6B7280",
    },

    // Dark theme borders
    border: {
        primary: "#2C2E32",
        secondary: "#2C2E32",
        focus: BRAND_COLORS.primary,
        error: BRAND_COLORS.error,
        success: BRAND_COLORS.success,
        disabled: "#374151",
    },

    // Dark theme interactive states
    interactive: {
        hover: "rgba(255, 255, 255, 0.05)",
        pressed: "rgba(255, 255, 255, 0.1)",
        focus: "rgba(232, 121, 249, 0.2)",
        disabled: "rgba(255, 255, 255, 0.05)",
        selected: "rgba(232, 121, 249, 0.2)",
    },
});

// Create the complete dark theme using proper type composition
const baseTheme = createBaseTheme(true);

export const darkTheme: Theme = {
    meta: {
        name: "dark",
        displayName: "Dark Theme",
        description: "Sleek dark theme that's easy on the eyes",
        author: "OneVEarth Team",
        version: "1.0.0",
        dark: true,
    },

    colors: createDarkColors(),

    // Now we can safely use the base theme properties
    typography: baseTheme.typography,
    spacing: baseTheme.spacing,
    borderRadius: baseTheme.borderRadius,
    shadows: baseTheme.shadows,
    animations: baseTheme.animations,

    // Component styles will be added below
    components: {} as any,
};

// Add component styles to the theme
darkTheme.components = createComponentStyles(darkTheme);

// Dark theme customization helpers
export const customizeDarkTheme = (customizations: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    backgroundIntensity?: "darker" | "normal" | "lighter";
    fontFamily?: string;
    borderRadius?: "sharp" | "rounded" | "pill";
    spacing?: "compact" | "normal" | "spacious";
}): Theme => {
    const customTheme = { ...darkTheme };

    // Customize colors
    if (customizations.primaryColor) {
        customTheme.colors.primary = generateDarkColorScale(
            customizations.primaryColor,
        );
        customTheme.colors.text.link = customizations.primaryColor;
        customTheme.colors.border.focus = customizations.primaryColor;
    }

    if (customizations.secondaryColor) {
        customTheme.colors.secondary = generateDarkColorScale(
            customizations.secondaryColor,
        );
    }

    if (customizations.accentColor) {
        customTheme.colors.accent = generateDarkColorScale(
            customizations.accentColor,
        );
    }

    // Customize background intensity
    if (customizations.backgroundIntensity) {
        switch (customizations.backgroundIntensity) {
            case "darker":
                customTheme.colors.background = {
                    primary: "#0F172A",
                    secondary: "#1E293B",
                    tertiary: "#334155",
                    overlay: "rgba(0, 0, 0, 0.8)",
                    modal: "#1E293B",
                    card: "#1E293B",
                };
                customTheme.colors.surface = {
                    primary: "#1E293B",
                    secondary: "#334155",
                    tertiary: "#475569",
                    elevated: "#334155",
                    inverse: "#F9FAFB",
                };
                break;
            case "lighter":
                customTheme.colors.background = {
                    primary: "#1F2937",
                    secondary: "#374151",
                    tertiary: "#4B5563",
                    overlay: "rgba(0, 0, 0, 0.6)",
                    modal: "#374151",
                    card: "#374151",
                };
                customTheme.colors.surface = {
                    primary: "#374151",
                    secondary: "#4B5563",
                    tertiary: "#6B7280",
                    elevated: "#4B5563",
                    inverse: "#F9FAFB",
                };
                break;
        }
    }

    // Apply typography, border radius, and spacing customizations
    if (customizations.fontFamily) {
        customTheme.typography.fontFamily.primary = customizations.fontFamily;
        customTheme.typography.fontFamily.secondary = customizations.fontFamily;
    }

    if (customizations.borderRadius) {
        switch (customizations.borderRadius) {
            case "sharp":
                customTheme.borderRadius = {
                    ...customTheme.borderRadius,
                    sm: 2,
                    md: 4,
                    lg: 6,
                    xl: 8,
                };
                break;
            case "rounded":
                customTheme.borderRadius = {
                    ...customTheme.borderRadius,
                    sm: 6,
                    md: 12,
                    lg: 18,
                    xl: 24,
                };
                break;
            case "pill":
                customTheme.borderRadius = {
                    ...customTheme.borderRadius,
                    sm: 20,
                    md: 25,
                    lg: 30,
                    xl: 35,
                };
                break;
        }
    }

    if (customizations.spacing) {
        const multiplier = customizations.spacing === "compact"
            ? 0.75
            : customizations.spacing === "spacious"
            ? 1.25
            : 1;

        Object.keys(customTheme.spacing).forEach((key) => {
            customTheme.spacing[key as keyof typeof customTheme.spacing] *=
                multiplier;
        });
    }

    // Regenerate component styles with new theme values
    customTheme.components = createComponentStyles(customTheme);

    return customTheme;
};

// Helper function for dark theme color scales
function generateDarkColorScale(baseColor: string): any {
    // In dark themes, we want the lighter shades to be more prominent
    return {
        50: darkenColor(baseColor, 0.4),
        100: darkenColor(baseColor, 0.3),
        200: darkenColor(baseColor, 0.2),
        300: darkenColor(baseColor, 0.1),
        400: baseColor,
        500: lightenColor(baseColor, 0.1),
        600: lightenColor(baseColor, 0.2),
        700: lightenColor(baseColor, 0.3),
        800: lightenColor(baseColor, 0.4),
        900: lightenColor(baseColor, 0.45),
    };
}

function lightenColor(color: string, amount: number): string {
    // Simplified - in production use a proper color library
    return color;
}

function darkenColor(color: string, amount: number): string {
    // Simplified - in production use a proper color library
    return color;
}
