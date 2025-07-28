import { Theme, ThemeCustomization } from "./types";
import { customizeLightTheme, lightTheme } from "@/themes/presets/lightTheme";
import { customizeDarkTheme, darkTheme } from "@/themes/presets/darkTheme";

// Easy theme customization presets for developers
export class ThemeCustomizer {
    // Create a fully custom theme with easy options
    static createCustomTheme(options: {
        // Basic customization
        name: string;
        displayName: string;
        baseTheme: "light" | "dark";

        // Brand colors (hex strings)
        primaryColor?: string;
        secondaryColor?: string;
        accentColor?: string;

        // Typography
        fontFamily?: string;
        headingFontFamily?: string;

        // Layout
        borderRadius?: "sharp" | "rounded" | "pill" | number;
        spacing?: "compact" | "normal" | "spacious" | number;

        // Visual style
        shadowIntensity?: "none" | "subtle" | "normal" | "strong";

        // Dark theme specific
        backgroundIntensity?: "darker" | "normal" | "lighter";

        // Advanced customizations
        customColors?: Record<string, string>;
        customTypography?: Partial<Theme["typography"]>;
        customSpacing?: Partial<Theme["spacing"]>;
        customBorderRadius?: Partial<Theme["borderRadius"]>;
    }): Theme {
        const baseTheme = options.baseTheme === "dark" ? darkTheme : lightTheme;

        // Build customization object
        const customizations: any = {};

        // Colors
        if (options.primaryColor) {
            customizations.primaryColor = options.primaryColor;
        }
        if (options.secondaryColor) {
            customizations.secondaryColor = options.secondaryColor;
        }
        if (options.accentColor) {
            customizations.accentColor = options.accentColor;
        }

        // Typography
        if (options.fontFamily) customizations.fontFamily = options.fontFamily;

        // Layout
        if (options.borderRadius) {
            customizations.borderRadius = options.borderRadius;
        }
        if (options.spacing) customizations.spacing = options.spacing;

        // Dark theme specific
        if (options.baseTheme === "dark" && options.backgroundIntensity) {
            customizations.backgroundIntensity = options.backgroundIntensity;
        }

        // Apply customizations
        let customTheme: Theme;
        if (options.baseTheme === "dark") {
            customTheme = customizeDarkTheme(customizations);
        } else {
            customTheme = customizeLightTheme(customizations);
        }

        // Update meta information
        customTheme.meta = {
            ...customTheme.meta,
            name: options.name,
            displayName: options.displayName,
            description:
                `Custom ${options.baseTheme} theme: ${options.displayName}`,
            author: "Custom",
        };

        // Apply advanced customizations
        if (options.customColors) {
            customTheme.colors = {
                ...customTheme.colors,
                ...options.customColors as any,
            };
        }

        if (options.customTypography) {
            customTheme.typography = {
                ...customTheme.typography,
                ...options.customTypography,
            };
        }

        if (options.customSpacing) {
            customTheme.spacing = {
                ...customTheme.spacing,
                ...options.customSpacing,
            };
        }

        if (options.customBorderRadius) {
            customTheme.borderRadius = {
                ...customTheme.borderRadius,
                ...options.customBorderRadius,
            };
        }

        return customTheme;
    }

    // Pre-built theme presets for common use cases
    static getPresetThemes() {
        return {
            // Corporate themes
            corporate: this.createCustomTheme({
                name: "corporate",
                displayName: "Corporate",
                baseTheme: "light",
                primaryColor: "#1F2937",
                secondaryColor: "#6B7280",
                accentColor: "#3B82F6",
                borderRadius: "sharp",
                spacing: "normal",
            }),

            corporateDark: this.createCustomTheme({
                name: "corporate-dark",
                displayName: "Corporate Dark",
                baseTheme: "dark",
                primaryColor: "#60A5FA",
                secondaryColor: "#9CA3AF",
                accentColor: "#34D399",
                borderRadius: "sharp",
                spacing: "normal",
                backgroundIntensity: "darker",
            }),

            // Creative themes
            creative: this.createCustomTheme({
                name: "creative",
                displayName: "Creative",
                baseTheme: "light",
                primaryColor: "#8B5CF6",
                secondaryColor: "#A78BFA",
                accentColor: "#F59E0B",
                borderRadius: "pill",
                spacing: "spacious",
            }),

            // Minimal themes
            minimal: this.createCustomTheme({
                name: "minimal",
                displayName: "Minimal",
                baseTheme: "light",
                primaryColor: "#000000",
                secondaryColor: "#6B7280",
                accentColor: "#EF4444",
                borderRadius: "sharp",
                spacing: "compact",
            }),

            // Nature themes
            nature: this.createCustomTheme({
                name: "nature",
                displayName: "Nature",
                baseTheme: "light",
                primaryColor: "#059669",
                secondaryColor: "#6B7280",
                accentColor: "#92400E",
                borderRadius: "rounded",
                spacing: "normal",
            }),

            // Gaming themes
            gaming: this.createCustomTheme({
                name: "gaming",
                displayName: "Gaming",
                baseTheme: "dark",
                primaryColor: "#EF4444",
                secondaryColor: "#F97316",
                accentColor: "#10B981",
                borderRadius: "rounded",
                spacing: "normal",
                backgroundIntensity: "darker",
            }),

            // Professional themes
            professional: this.createCustomTheme({
                name: "professional",
                displayName: "Professional",
                baseTheme: "light",
                primaryColor: "#1E40AF",
                secondaryColor: "#64748B",
                accentColor: "#059669",
                borderRadius: "sharp",
                spacing: "normal",
            }),
        };
    }

    // Generate a theme from a single brand color
    static generateFromBrandColor(brandColor: string, options: {
        name: string;
        displayName: string;
        baseTheme?: "light" | "dark";
        style?: "modern" | "classic" | "playful";
    }): Theme {
        const baseTheme = options.baseTheme || "light";
        const style = options.style || "modern";

        // Generate complementary colors based on brand color
        const colors = this.generateColorPalette(brandColor);

        // Style-specific adjustments
        let borderRadius: "sharp" | "rounded" | "pill" = "rounded";
        let spacing: "compact" | "normal" | "spacious" = "normal";

        switch (style) {
            case "classic":
                borderRadius = "sharp";
                spacing = "normal";
                break;
            case "playful":
                borderRadius = "pill";
                spacing = "spacious";
                break;
            case "modern":
            default:
                borderRadius = "rounded";
                spacing = "normal";
                break;
        }

        return this.createCustomTheme({
            name: options.name,
            displayName: options.displayName,
            baseTheme,
            primaryColor: brandColor,
            secondaryColor: colors.secondary,
            accentColor: colors.accent,
            borderRadius,
            spacing,
        });
    }

    // Helper to generate a color palette from a single color
    private static generateColorPalette(primaryColor: string) {
        // This is a simplified implementation
        // In production, use a proper color manipulation library
        return {
            secondary: "#6B7280", // Default neutral
            accent: "#F59E0B", // Default accent
            success: "#10B981",
            warning: "#F59E0B",
            error: "#EF4444",
            info: "#3B82F6",
        };
    }

    // Validate theme configuration
    static validateTheme(theme: Theme): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Check required meta fields
        if (!theme.meta.name) errors.push("Theme name is required");
        if (!theme.meta.displayName) {
            errors.push("Theme display name is required");
        }

        // Check color scales
        const requiredColorScales = ["primary", "secondary", "accent"];
        requiredColorScales.forEach((scale) => {
            const colorScale = theme.colors[scale as keyof typeof theme.colors];
            if (!colorScale || typeof colorScale !== "object") {
                errors.push(`Missing or invalid ${scale} color scale`);
            } else {
                const requiredShades = [
                    50,
                    100,
                    200,
                    300,
                    400,
                    500,
                    600,
                    700,
                    800,
                    900,
                ];
                requiredShades.forEach((shade) => {
                    if (!(shade in colorScale)) {
                        errors.push(`Missing ${scale}.${shade} color`);
                    }
                });
            }
        });

        // Check typography
        if (!theme.typography.fontFamily.primary) {
            errors.push("Primary font family is required");
        }

        // Check spacing
        const requiredSpacing = ["xs", "sm", "md", "lg", "xl"];
        requiredSpacing.forEach((size) => {
            if (
                typeof theme.spacing[size as keyof typeof theme.spacing] !==
                    "number"
            ) {
                errors.push(`Invalid spacing.${size} value`);
            }
        });

        return {
            valid: errors.length === 0,
            errors,
        };
    }

    // Export theme to JSON for sharing
    static exportTheme(theme: Theme): string {
        return JSON.stringify(theme, null, 2);
    }

    // Import theme from JSON
    static importTheme(themeJson: string): Theme {
        try {
            const theme = JSON.parse(themeJson);
            const validation = this.validateTheme(theme);

            if (!validation.valid) {
                throw new Error(
                    `Invalid theme: ${validation.errors.join(", ")}`,
                );
            }

            return theme;
        } catch (error) {
            throw new Error(
                `Failed to import theme: ${(error as Error).message}`,
            );
        }
    }
}
