import { useMemo } from "react";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { useTheme } from "./ThemeProvider";
import { useConfig } from "@/core/config/ConfigProvider";
import { ComponentStyleDefinition, Theme } from "./types";

interface UseStylesProps {
    variant?: string;
    size?: string;
    state?: string;
    disabled?: boolean;
    focused?: boolean;
    pressed?: boolean;
    selected?: boolean;
    error?: boolean;
    loading?: boolean;
    color?: string;
    weight?: keyof Theme["typography"]["fontWeight"];
    [key: string]: any;
}

// Better type definition for component styles result
interface ComponentStylesResult {
    container: ViewStyle | TextStyle;
    [key: string]: ViewStyle | TextStyle | any;
}

// Type guard to check if component styles are valid
function isValidComponentStyle(
    styles: any,
): styles is ComponentStyleDefinition {
    return styles && typeof styles === "object" && styles.base;
}

export const useStyles = (
    componentName: string,
    props: UseStylesProps = {},
): ComponentStylesResult => {
    const { theme } = useTheme();
    const { config } = useConfig();

    return useMemo(() => {
        // Get component styles with proper type checking
        const componentStyles = theme.components?.[componentName];

        if (!isValidComponentStyle(componentStyles)) {
            console.warn(
                `No valid styles found for component: ${componentName}`,
            );
            return { container: {} as ViewStyle };
        }

        // Start with base styles (now TypeScript knows componentStyles.base exists)
        let computedStyles: ViewStyle | TextStyle = { ...componentStyles.base };

        // Apply variant styles
        if (props.variant && componentStyles.variants?.[props.variant]) {
            computedStyles = {
                ...computedStyles,
                ...componentStyles.variants[props.variant],
            };
        }

        // Apply size styles
        if (props.size && componentStyles.sizes?.[props.size]) {
            computedStyles = {
                ...computedStyles,
                ...componentStyles.sizes[props.size],
            };
        }

        // Apply state styles
        if (componentStyles.states) {
            if (props.disabled && componentStyles.states.disabled) {
                computedStyles = {
                    ...computedStyles,
                    ...componentStyles.states.disabled,
                };
            }

            if (props.error && componentStyles.states.error) {
                computedStyles = {
                    ...computedStyles,
                    ...componentStyles.states.error,
                };
            }

            if (props.focused && componentStyles.states.focused) {
                computedStyles = {
                    ...computedStyles,
                    ...componentStyles.states.focused,
                };
            }

            if (props.loading && componentStyles.states.loading) {
                computedStyles = {
                    ...computedStyles,
                    ...componentStyles.states.loading,
                };
            }

            if (props.state && componentStyles.states[props.state]) {
                computedStyles = {
                    ...computedStyles,
                    ...componentStyles.states[props.state],
                };
            }
        }

        // Apply accessibility overrides
        if (config.ui.accessibility) {
            computedStyles = applyAccessibilityStyles(
                computedStyles,
                config.ui.accessibility,
            );
        }

        // Create the result object with proper typing
        const result: ComponentStylesResult = {
            container: computedStyles,
        };

        // Add other component-specific styles with safe access
        const styleKeys = Object.keys(componentStyles).filter((key) =>
            !["base", "variants", "sizes", "states"].includes(key)
        );

        styleKeys.forEach((key) => {
            result[key] = componentStyles[key];
        });

        // Special handling for text styles in buttons
        if (componentName === "Button" && componentStyles.text) {
            const textVariant = props.variant || "primary";
            result.text = componentStyles.text[textVariant] ||
                componentStyles.text.primary;

            if (config.ui.accessibility) {
                result.text = applyAccessibilityStyles(
                    result.text,
                    config.ui.accessibility,
                );
            }
        }

        return result;
    }, [theme, componentName, props, config]);
};

// Apply accessibility modifications to styles
function applyAccessibilityStyles(
    styles: ViewStyle | TextStyle,
    accessibility: any,
): ViewStyle | TextStyle {
    const modifiedStyles = { ...styles };

    // Large text scaling
    if (accessibility.largeText && "fontSize" in modifiedStyles) {
        const fontSize = modifiedStyles.fontSize;
        if (typeof fontSize === "number") {
            modifiedStyles.fontSize = fontSize * 1.2;
        }
    }

    // High contrast enhancements
    if (accessibility.highContrast) {
        if ("borderWidth" in modifiedStyles) {
            const borderWidth = modifiedStyles.borderWidth;
            if (typeof borderWidth === "number") {
                modifiedStyles.borderWidth = Math.max(borderWidth, 2);
            }
        }

        if ("opacity" in modifiedStyles) {
            const opacity = modifiedStyles.opacity;
            if (typeof opacity === "number") {
                modifiedStyles.opacity = Math.max(opacity, 0.8);
            }
        }
    }

    // Reduced motion
    if (accessibility.reducedMotion) {
        delete modifiedStyles.transform;
    }

    return modifiedStyles;
}

// Hook for text styles with proper font weight handling
export const useTextStyles = (
    variant: string = "body",
    props: UseStylesProps = {},
): TextStyle => {
    const { theme } = useTheme();
    const { config } = useConfig();

    return useMemo(() => {
        const textStyles: TextStyle = {
            fontSize: theme.typography.fontSize.md,
            lineHeight: theme.typography.lineHeight.normal *
                theme.typography.fontSize.md,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.primary,
            fontWeight: theme.typography.fontWeight.normal,
        };

        // Apply variant-specific styles
        switch (variant) {
            case "h1":
                textStyles.fontSize = theme.typography.fontSize["4xl"];
                textStyles.fontWeight = theme.typography.fontWeight.bold;
                textStyles.lineHeight = theme.typography.lineHeight.tight *
                    theme.typography.fontSize["4xl"];
                break;
            case "h2":
                textStyles.fontSize = theme.typography.fontSize["3xl"];
                textStyles.fontWeight = theme.typography.fontWeight.bold;
                textStyles.lineHeight = theme.typography.lineHeight.tight *
                    theme.typography.fontSize["3xl"];
                break;
            case "h3":
                textStyles.fontSize = theme.typography.fontSize["2xl"];
                textStyles.fontWeight = theme.typography.fontWeight.semibold;
                textStyles.lineHeight = theme.typography.lineHeight.normal *
                    theme.typography.fontSize["2xl"];
                break;
            case "h4":
                textStyles.fontSize = theme.typography.fontSize.xl;
                textStyles.fontWeight = theme.typography.fontWeight.semibold;
                break;
            case "h5":
                textStyles.fontSize = theme.typography.fontSize.lg;
                textStyles.fontWeight = theme.typography.fontWeight.medium;
                break;
            case "h6":
                textStyles.fontSize = theme.typography.fontSize.md;
                textStyles.fontWeight = theme.typography.fontWeight.medium;
                break;
            case "body":
                break;
            case "bodySmall":
                textStyles.fontSize = theme.typography.fontSize.sm;
                break;
            case "caption":
                textStyles.fontSize = theme.typography.fontSize.xs;
                textStyles.color = theme.colors.text.secondary;
                break;
            case "label":
                textStyles.fontSize = theme.typography.fontSize.sm;
                textStyles.fontWeight = theme.typography.fontWeight.medium;
                break;
            case "link":
                textStyles.color = theme.colors.text.link;
                textStyles.textDecorationLine = "underline";
                break;
        }

        // Apply prop-based modifications
        if (props.color) {
            textStyles.color = props.color;
        }

        if (props.size) {
            const sizeKey = props
                .size as keyof typeof theme.typography.fontSize;
            if (theme.typography.fontSize[sizeKey]) {
                textStyles.fontSize = theme.typography.fontSize[sizeKey];
            }
        }

        if (props.weight) {
            const weightKey = props
                .weight as keyof typeof theme.typography.fontWeight;
            if (theme.typography.fontWeight[weightKey]) {
                textStyles.fontWeight = theme.typography.fontWeight[weightKey];
            }
        }

        // Apply accessibility modifications
        if (config.ui.accessibility) {
            return applyAccessibilityStyles(
                textStyles,
                config.ui.accessibility,
            ) as TextStyle;
        }

        return textStyles;
    }, [theme, variant, props, config]);
};

// Hook for spacing utilities
export const useSpacing = () => {
    const { theme } = useTheme();

    return useMemo(() => ({
        // Margin utilities
        m: (size: keyof typeof theme.spacing) => ({
            margin: theme.spacing[size],
        }),
        mt: (size: keyof typeof theme.spacing) => ({
            marginTop: theme.spacing[size],
        }),
        mb: (size: keyof typeof theme.spacing) => ({
            marginBottom: theme.spacing[size],
        }),
        ml: (size: keyof typeof theme.spacing) => ({
            marginLeft: theme.spacing[size],
        }),
        mr: (size: keyof typeof theme.spacing) => ({
            marginRight: theme.spacing[size],
        }),
        mx: (size: keyof typeof theme.spacing) => ({
            marginLeft: theme.spacing[size],
            marginRight: theme.spacing[size],
        }),
        my: (size: keyof typeof theme.spacing) => ({
            marginTop: theme.spacing[size],
            marginBottom: theme.spacing[size],
        }),

        // Padding utilities
        p: (size: keyof typeof theme.spacing) => ({
            padding: theme.spacing[size],
        }),
        pt: (size: keyof typeof theme.spacing) => ({
            paddingTop: theme.spacing[size],
        }),
        pb: (size: keyof typeof theme.spacing) => ({
            paddingBottom: theme.spacing[size],
        }),
        pl: (size: keyof typeof theme.spacing) => ({
            paddingLeft: theme.spacing[size],
        }),
        pr: (size: keyof typeof theme.spacing) => ({
            paddingRight: theme.spacing[size],
        }),
        px: (size: keyof typeof theme.spacing) => ({
            paddingLeft: theme.spacing[size],
            paddingRight: theme.spacing[size],
        }),
        py: (size: keyof typeof theme.spacing) => ({
            paddingTop: theme.spacing[size],
            paddingBottom: theme.spacing[size],
        }),

        // Gap utility
        gap: (size: keyof typeof theme.spacing) => ({
            gap: theme.spacing[size],
        }),

        // Raw spacing values
        spacing: theme.spacing,
    }), [theme]);
};

// Hook for color utilities
export const useColors = () => {
    const { theme } = useTheme();

    return useMemo(() => ({
        // Color getters with proper typing
        primary: (shade: keyof typeof theme.colors.primary = 500) =>
            theme.colors.primary[shade],
        secondary: (shade: keyof typeof theme.colors.secondary = 500) =>
            theme.colors.secondary[shade],
        accent: (shade: keyof typeof theme.colors.accent = 500) =>
            theme.colors.accent[shade],
        success: (shade: keyof typeof theme.colors.success = 500) =>
            theme.colors.success[shade],
        warning: (shade: keyof typeof theme.colors.warning = 500) =>
            theme.colors.warning[shade],
        error: (shade: keyof typeof theme.colors.error = 500) =>
            theme.colors.error[shade],
        info: (shade: keyof typeof theme.colors.info = 500) =>
            theme.colors.info[shade],
        neutral: (shade: keyof typeof theme.colors.neutral = 500) =>
            theme.colors.neutral[shade],

        // Semantic colors
        text: theme.colors.text,
        background: theme.colors.background,
        surface: theme.colors.surface,
        border: theme.colors.border,
        interactive: theme.colors.interactive,

        // Full color palette
        colors: theme.colors,
    }), [theme]);
};
