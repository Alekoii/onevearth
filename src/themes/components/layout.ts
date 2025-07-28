import { Theme } from "@/core/theming/types";

export const createLayoutStyles = (theme: Theme) => ({
    // Screen layout
    Screen: {
        base: {
            flex: 1,
            backgroundColor: theme.colors.background.primary,
        },
        content: {
            paddingHorizontal: theme.spacing.md,
            paddingBottom: theme.spacing.xl,
        },
        padding: {
            padding: theme.spacing.md,
        },
        variants: {
            centered: {
                justifyContent: "center",
                alignItems: "center",
            },
            padded: {
                padding: theme.spacing.lg,
            },
            fullWidth: {
                paddingHorizontal: 0,
            },
        },
    },

    // Card component
    Card: {
        base: {
            backgroundColor: theme.colors.surface.primary,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.md,
            marginBottom: theme.spacing.sm,
        },
        shadow: theme.shadows.sm,
        border: {
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
        },
        variants: {
            elevated: theme.shadows.md,
            outlined: {
                borderWidth: 1,
                borderColor: theme.colors.border.primary,
                backgroundColor: "transparent",
            },
            filled: {
                backgroundColor: theme.colors.surface.secondary,
            },
            flat: {
                backgroundColor: "transparent",
                elevation: 0,
                shadowOpacity: 0,
            },
        },
        sizes: {
            xs: {
                padding: theme.spacing.xs,
                borderRadius: theme.borderRadius.sm,
            },
            sm: {
                padding: theme.spacing.sm,
                borderRadius: theme.borderRadius.md,
            },
            md: {
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.lg,
            },
            lg: {
                padding: theme.spacing.lg,
                borderRadius: theme.borderRadius.xl,
            },
            xl: {
                padding: theme.spacing.xl,
                borderRadius: theme.borderRadius["2xl"],
            },
        },
    },

    // Header component
    Header: {
        base: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            backgroundColor: theme.colors.surface.primary,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.primary,
            minHeight: 56,
        },
        title: {
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.primary,
            flex: 1,
            textAlign: "center",
        },
        subtitle: {
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.normal,
            color: theme.colors.text.secondary,
            fontFamily: theme.typography.fontFamily.primary,
            textAlign: "center",
        },
        leftAction: {
            minWidth: 40,
            alignItems: "flex-start",
        },
        rightAction: {
            minWidth: 40,
            alignItems: "flex-end",
        },
        actions: {
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
        },
        variants: {
            large: {
                paddingVertical: theme.spacing.md,
                minHeight: 72,
            },
            transparent: {
                backgroundColor: "transparent",
                borderBottomWidth: 0,
            },
            sticky: {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
            },
        },
    },
});
