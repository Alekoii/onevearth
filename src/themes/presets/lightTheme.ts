import { Theme } from "@/core/theming/types";
import { createBaseTheme } from "../base/baseTheme";
import { createComponentStyles } from "../components/createComponentStyles";

// Customizable brand colors - Change these to customize your app!
const BRAND_COLORS = {
    primary: "#DB00FF", // Your main brand color
    secondary: "#6D6D6D", // Secondary brand color
    accent: "#00DBFF", // Accent color for highlights
    success: "#10B981", // Success state color
    warning: "#F59E0B", // Warning state color
    error: "#EF4444", // Error state color
    info: "#3B82F6", // Info state color
};

// Color system generator
const createColors = () => ({
    // Primary brand colors
    primary: {
        50: "#FDF4FF",
        100: "#FAE8FF",
        200: "#F5D0FE",
        300: "#F0ABFC",
        400: "#E879F9",
        500: BRAND_COLORS.primary, // Main brand color
        600: "#C026D3",
        700: "#A21CAF",
        800: "#86198F",
        900: "#701A75",
    },

    secondary: {
        50: "#FAFAFA",
        100: "#F4F4F5",
        200: "#E4E4E7",
        300: "#D4D4D8",
        400: "#A1A1AA",
        500: BRAND_COLORS.secondary,
        600: "#52525B",
        700: "#3F3F46",
        800: "#27272A",
        900: "#18181B",
    },

    accent: {
        50: "#F0F9FF",
        100: "#E0F2FE",
        200: "#BAE6FD",
        300: "#7DD3FC",
        400: "#38BDF8",
        500: BRAND_COLORS.accent,
        600: "#0284C7",
        700: "#0369A1",
        800: "#075985",
        900: "#0C4A6E",
    },

    success: {
        50: "#ECFDF5",
        100: "#D1FAE5",
        200: "#A7F3D0",
        300: "#6EE7B7",
        400: "#34D399",
        500: BRAND_COLORS.success,
        600: "#059669",
        700: "#047857",
        800: "#065F46",
        900: "#064E3B",
    },

    warning: {
        50: "#FFFBEB",
        100: "#FEF3C7",
        200: "#FDE68A",
        300: "#FCD34D",
        400: "#FBBF24",
        500: BRAND_COLORS.warning,
        600: "#D97706",
        700: "#B45309",
        800: "#92400E",
        900: "#78350F",
    },

    error: {
        50: "#FEF2F2",
        100: "#FEE2E2",
        200: "#FECACA",
        300: "#FCA5A5",
        400: "#F87171",
        500: BRAND_COLORS.error,
        600: "#DC2626",
        700: "#B91C1C",
        800: "#991B1B",
        900: "#7F1D1D",
    },

    info: {
        50: "#EFF6FF",
        100: "#DBEAFE",
        200: "#BFDBFE",
        300: "#93C5FD",
        400: "#60A5FA",
        500: BRAND_COLORS.info,
        600: "#2563EB",
        700: "#1D4ED8",
        800: "#1E40AF",
        900: "#1E3A8A",
    },

    neutral: {
        50: "#FAFAFA",
        100: "#F5F5F5",
        200: "#E5E5E5",
        300: "#D4D4D4",
        400: "#A3A3A3",
        500: "#737373",
        600: "#525252",
        700: "#404040",
        800: "#262626",
        900: "#171717",
    },

    // Background colors
    background: {
        primary: "#FFFFFF",
        secondary: "#F9FAFB",
        tertiary: "#F3F4F6",
        overlay: "rgba(0, 0, 0, 0.5)",
        modal: "#FFFFFF",
        card: "#FFFFFF",
    },

    // Surface colors
    surface: {
        primary: "#FFFFFF",
        secondary: "#F9FAFB",
        tertiary: "#F3F4F6",
        elevated: "#FFFFFF",
        inverse: "#111827",
    },

    // Text colors
    text: {
        primary: "#111827",
        secondary: "#6B7280",
        tertiary: "#9CA3AF",
        inverse: "#FFFFFF",
        link: BRAND_COLORS.primary,
        disabled: "#D1D5DB",
        placeholder: "#9CA3AF",
    },

    // Border colors
    border: {
        primary: "#E5E7EB",
        secondary: "#D1D5DB",
        focus: BRAND_COLORS.primary,
        error: BRAND_COLORS.error,
        success: BRAND_COLORS.success,
        disabled: "#F3F4F6",
    },

    // Interactive states
    interactive: {
        hover: "rgba(0, 0, 0, 0.05)",
        pressed: "rgba(0, 0, 0, 0.1)",
        focus: "rgba(219, 0, 255, 0.1)",
        disabled: "rgba(0, 0, 0, 0.05)",
        selected: "rgba(219, 0, 255, 0.1)",
    },
});

// Create the complete light theme using proper type composition
const baseTheme = createBaseTheme(false);

export const lightTheme: Theme = {
    meta: {
        name: "light",
        displayName: "Light Theme",
        description: "Clean and bright theme perfect for daily use",
        author: "OneVEarth Team",
        version: "1.0.0",
        dark: false,
    },

    colors: createColors(),

    // Now we can safely spread the base theme since we know the types
    typography: baseTheme.typography,
    spacing: baseTheme.spacing,
    borderRadius: baseTheme.borderRadius,
    shadows: baseTheme.shadows,
    animations: baseTheme.animations,

    // Component styles will be added below
    components: {} as any,
};

// Add component styles to the theme
lightTheme.components = createComponentStyles(lightTheme);

// Theme customization helpers
export const customizeLightTheme = (customizations: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    fontFamily?: string;
    borderRadius?: "sharp" | "rounded" | "pill";
    spacing?: "compact" | "normal" | "spacious";
}): Theme => {
    const customTheme = { ...lightTheme };

    // Customize colors
    if (customizations.primaryColor) {
        customTheme.colors.primary = generateColorScale(
            customizations.primaryColor,
        );
        customTheme.colors.text.link = customizations.primaryColor;
        customTheme.colors.border.focus = customizations.primaryColor;
    }

    if (customizations.secondaryColor) {
        customTheme.colors.secondary = generateColorScale(
            customizations.secondaryColor,
        );
    }

    if (customizations.accentColor) {
        customTheme.colors.accent = generateColorScale(
            customizations.accentColor,
        );
    }

    // Customize typography
    if (customizations.fontFamily) {
        customTheme.typography.fontFamily.primary = customizations.fontFamily;
        customTheme.typography.fontFamily.secondary = customizations.fontFamily;
    }

    // Customize border radius
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

    // Customize spacing
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

// Helper function to generate color scales (simplified)
function generateColorScale(baseColor: string): any {
    // This is a simplified implementation
    // In production, use a proper color manipulation library like polished or color2k
    return {
        50: lightenColor(baseColor, 0.45),
        100: lightenColor(baseColor, 0.4),
        200: lightenColor(baseColor, 0.3),
        300: lightenColor(baseColor, 0.2),
        400: lightenColor(baseColor, 0.1),
        500: baseColor,
        600: darkenColor(baseColor, 0.1),
        700: darkenColor(baseColor, 0.2),
        800: darkenColor(baseColor, 0.3),
        900: darkenColor(baseColor, 0.4),
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
