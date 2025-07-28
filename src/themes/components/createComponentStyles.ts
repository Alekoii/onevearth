import { ComponentStyles, Theme } from "@/core/theming/types";

// Helper function to create consistent component styles
const createBaseStyle = (theme: Theme, backgroundColor = "primary") => ({
    backgroundColor: theme.colors
        .surface[backgroundColor as keyof typeof theme.colors.surface],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
});

export const createComponentStyles = (theme: Theme): ComponentStyles => ({
    // Screen layout
    Screen: {
        base: { flex: 1, backgroundColor: theme.colors.background.primary },
        content: {
            paddingHorizontal: theme.spacing.md,
            paddingBottom: theme.spacing.xl,
        },
        padding: { padding: theme.spacing.md },
        variants: {
            centered: { justifyContent: "center", alignItems: "center" },
            padded: { padding: theme.spacing.lg },
        },
    },

    // Card component
    Card: {
        base: { ...createBaseStyle(theme), marginBottom: theme.spacing.sm },
        shadow: theme.shadows.sm,
        border: { borderWidth: 1, borderColor: theme.colors.border.primary },
        variants: {
            elevated: theme.shadows.md,
            outlined: {
                borderWidth: 1,
                borderColor: theme.colors.border.primary,
                backgroundColor: "transparent",
            },
            filled: { backgroundColor: theme.colors.surface.secondary },
        },
        sizes: {
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
        },
        title: {
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.primary,
        },
        subtitle: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            fontFamily: theme.typography.fontFamily.primary,
        },
        actions: {
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
        },
        variants: {
            large: { paddingVertical: theme.spacing.md },
            transparent: {
                backgroundColor: "transparent",
                borderBottomWidth: 0,
            },
        },
    },

    // Button component with comprehensive styling
    Button: {
        base: {
            borderRadius: theme.borderRadius.md,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: theme.spacing.xs,
        },
        variants: {
            primary: { backgroundColor: theme.colors.primary[500] },
            secondary: { backgroundColor: theme.colors.secondary[500] },
            outline: {
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: theme.colors.border.primary,
            },
            ghost: { backgroundColor: "transparent" },
            danger: { backgroundColor: theme.colors.error[500] },
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
        },
        states: {
            disabled: { opacity: 0.6 },
            loading: { opacity: 0.8 },
        },
        text: {
            primary: {
                color: theme.colors.text.inverse,
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semibold,
            },
            secondary: {
                color: theme.colors.text.inverse,
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semibold,
            },
            outline: {
                color: theme.colors.text.primary,
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semibold,
            },
            ghost: {
                color: theme.colors.text.primary,
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semibold,
            },
            danger: {
                color: theme.colors.text.inverse,
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semibold,
            },
        },
        icon: { marginRight: theme.spacing.xs },
        loading: { position: "absolute" },
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
        },
        container: { marginBottom: theme.spacing.sm },
        label: {
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.xs,
            fontFamily: theme.typography.fontFamily.primary,
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
        states: {
            focused: { borderColor: theme.colors.border.focus, borderWidth: 2 },
            error: { borderColor: theme.colors.error[500] },
            disabled: {
                backgroundColor: theme.colors.surface.secondary,
                opacity: 0.6,
            },
        },
        variants: {
            outline: { backgroundColor: "transparent" },
            filled: {
                backgroundColor: theme.colors.surface.secondary,
                borderWidth: 0,
            },
        },
    },

    // Post Card component
    PostCard: {
        base: { ...createBaseStyle(theme), ...theme.shadows.sm },
        header: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: theme.spacing.sm,
        },
        content: { marginBottom: theme.spacing.md },
        actions: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        username: {
            fontSize: theme.typography.fontSize.md,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.primary,
        },
        timestamp: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            fontFamily: theme.typography.fontFamily.primary,
        },
        contentText: {
            fontSize: theme.typography.fontSize.md,
            lineHeight: theme.typography.lineHeight.relaxed *
                theme.typography.fontSize.md,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.primary,
        },
        variants: {
            compact: {
                padding: theme.spacing.sm,
                marginBottom: theme.spacing.sm,
            },
            featured: {
                borderWidth: 2,
                borderColor: theme.colors.primary[500],
            },
        },
    },

    // Post Creator component
    PostCreator: {
        base: createBaseStyle(theme),
        input: {
            minHeight: 80,
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.primary,
            padding: 0,
        },
        toolbar: {
            flexDirection: "row",
            alignItems: "center",
            paddingTop: theme.spacing.sm,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border.primary,
            marginTop: theme.spacing.sm,
        },
        actions: {
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: theme.spacing.sm,
            marginTop: theme.spacing.sm,
        },
    },

    // Tab Bar component
    TabBar: {
        base: {
            backgroundColor: theme.colors.surface.primary,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border.primary,
            paddingBottom: theme.spacing.sm,
            paddingTop: theme.spacing.xs,
        },
        tab: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: theme.spacing.xs,
        },
        label: {
            fontSize: theme.typography.fontSize.xs,
            fontWeight: theme.typography.fontWeight.medium,
            marginTop: theme.spacing.xs / 2,
            fontFamily: theme.typography.fontFamily.primary,
        },
        icon: { marginBottom: theme.spacing.xs / 2 },
        badge: {
            position: "absolute",
            top: -2,
            right: -2,
            backgroundColor: theme.colors.error[500],
            borderRadius: theme.borderRadius.full,
            minWidth: 16,
            height: 16,
            alignItems: "center",
            justifyContent: "center",
        },
    },
});
