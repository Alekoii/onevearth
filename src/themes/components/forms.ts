import { Theme } from "@/core/theming/types";

export const createFormStyles = (theme: Theme) => ({
    // Button component with comprehensive styling
    Button: {
        base: {
            borderRadius: theme.borderRadius.md,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: theme.spacing.xs,
            borderWidth: 0,
        },
        variants: {
            primary: {
                backgroundColor: theme.colors.primary[500],
            },
            secondary: {
                backgroundColor: theme.colors.secondary[500],
            },
            outline: {
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: theme.colors.border.primary,
            },
            ghost: {
                backgroundColor: "transparent",
            },
            danger: {
                backgroundColor: theme.colors.error[500],
            },
            success: {
                backgroundColor: theme.colors.success[500],
            },
            warning: {
                backgroundColor: theme.colors.warning[500],
            },
        },
        sizes: {
            xs: {
                paddingHorizontal: theme.spacing.xs,
                paddingVertical: theme.spacing.xs / 2,
                minHeight: 28,
            },
            sm: {
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: theme.spacing.xs,
                minHeight: 32,
            },
            md: {
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
                minHeight: 40,
            },
            lg: {
                paddingHorizontal: theme.spacing.lg,
                paddingVertical: theme.spacing.md,
                minHeight: 48,
            },
            xl: {
                paddingHorizontal: theme.spacing.xl,
                paddingVertical: theme.spacing.lg,
                minHeight: 56,
            },
        },
        states: {
            disabled: {
                opacity: 0.6,
            },
            loading: {
                opacity: 0.8,
            },
            pressed: {
                opacity: 0.9,
                transform: [{ scale: 0.98 }],
            },
        },
        text: {
            primary: {
                color: theme.colors.text.inverse,
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semibold,
                fontFamily: theme.typography.fontFamily.primary,
            },
            secondary: {
                color: theme.colors.text.inverse,
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semibold,
                fontFamily: theme.typography.fontFamily.primary,
            },
            outline: {
                color: theme.colors.text.primary,
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semibold,
                fontFamily: theme.typography.fontFamily.primary,
            },
            ghost: {
                color: theme.colors.text.primary,
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semibold,
                fontFamily: theme.typography.fontFamily.primary,
            },
            danger: {
                color: theme.colors.text.inverse,
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semibold,
                fontFamily: theme.typography.fontFamily.primary,
            },
            success: {
                color: theme.colors.text.inverse,
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semibold,
                fontFamily: theme.typography.fontFamily.primary,
            },
            warning: {
                color: theme.colors.text.inverse,
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semibold,
                fontFamily: theme.typography.fontFamily.primary,
            },
        },
        icon: {
            marginRight: theme.spacing.xs,
        },
        iconOnly: {
            paddingHorizontal: theme.spacing.sm,
            width: 40,
            height: 40,
        },
        loading: {
            position: "absolute",
        },
    },

    // Input component
    Input: {
        base: {
            borderRadius: theme.borderRadius.md,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            backgroundColor: theme.colors.surface.primary,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.primary,
            minHeight: 40,
        },
        container: {
            marginBottom: theme.spacing.sm,
        },
        label: {
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.xs,
            fontFamily: theme.typography.fontFamily.primary,
        },
        required: {
            color: theme.colors.error[500],
            marginLeft: 2,
        },
        error: {
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.error[500],
            marginTop: theme.spacing.xs,
            fontFamily: theme.typography.fontFamily.primary,
        },
        helper: {
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.secondary,
            marginTop: theme.spacing.xs,
            fontFamily: theme.typography.fontFamily.primary,
        },
        placeholder: {
            color: theme.colors.text.placeholder,
        },
        states: {
            focused: {
                borderColor: theme.colors.border.focus,
                borderWidth: 2,
            },
            error: {
                borderColor: theme.colors.error[500],
            },
            disabled: {
                backgroundColor: theme.colors.surface.secondary,
                opacity: 0.6,
            },
            readonly: {
                backgroundColor: theme.colors.surface.secondary,
            },
        },
        variants: {
            outline: {
                backgroundColor: "transparent",
            },
            filled: {
                backgroundColor: theme.colors.surface.secondary,
                borderWidth: 0,
            },
            underline: {
                backgroundColor: "transparent",
                borderWidth: 0,
                borderBottomWidth: 1,
                borderRadius: 0,
                paddingHorizontal: 0,
            },
        },
        sizes: {
            sm: {
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: theme.spacing.xs,
                fontSize: theme.typography.fontSize.sm,
                minHeight: 32,
            },
            md: {
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
                fontSize: theme.typography.fontSize.md,
                minHeight: 40,
            },
            lg: {
                paddingHorizontal: theme.spacing.lg,
                paddingVertical: theme.spacing.md,
                fontSize: theme.typography.fontSize.lg,
                minHeight: 48,
            },
        },
    },

    // Textarea component
    Textarea: {
        base: {
            borderRadius: theme.borderRadius.md,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            backgroundColor: theme.colors.surface.primary,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.primary,
            minHeight: 80,
            textAlignVertical: "top",
        },
        variants: {
            filled: {
                backgroundColor: theme.colors.surface.secondary,
                borderWidth: 0,
            },
            outline: {
                backgroundColor: "transparent",
            },
        },
        states: {
            focused: {
                borderColor: theme.colors.border.focus,
                borderWidth: 2,
            },
            error: {
                borderColor: theme.colors.error[500],
            },
        },
    },

    // Checkbox component
    Checkbox: {
        base: {
            width: 20,
            height: 20,
            borderRadius: theme.borderRadius.xs,
            borderWidth: 2,
            borderColor: theme.colors.border.primary,
            backgroundColor: "transparent",
            alignItems: "center",
            justifyContent: "center",
        },
        checked: {
            backgroundColor: theme.colors.primary[500],
            borderColor: theme.colors.primary[500],
        },
        container: {
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
        },
        label: {
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.primary,
        },
    },
});
