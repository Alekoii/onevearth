import { Theme } from "@/core/theming/types";

export const createNavigationStyles = (theme: Theme) => ({
    // Tab Bar component
    TabBar: {
        base: {
            backgroundColor: theme.colors.surface.primary,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border.primary,
            paddingBottom: theme.spacing.sm,
            paddingTop: theme.spacing.xs,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            minHeight: 60,
        },
        tab: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: theme.spacing.xs,
            paddingHorizontal: theme.spacing.xs,
            borderRadius: theme.borderRadius.md,
        },
        activeTab: {
            backgroundColor: theme.colors.interactive.selected,
        },
        label: {
            fontSize: theme.typography.fontSize.xs,
            fontWeight: theme.typography.fontWeight.medium,
            marginTop: theme.spacing.xs / 2,
            fontFamily: theme.typography.fontFamily.primary,
            textAlign: "center",
        },
        activeLabel: {
            color: theme.colors.primary[500],
            fontWeight: theme.typography.fontWeight.semibold,
        },
        inactiveLabel: {
            color: theme.colors.text.secondary,
        },
        icon: {
            marginBottom: theme.spacing.xs / 2,
        },
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
        badgeText: {
            color: theme.colors.text.inverse,
            fontSize: theme.typography.fontSize.xs,
            fontWeight: theme.typography.fontWeight.bold,
        },
        variants: {
            floating: {
                backgroundColor: theme.colors.surface.elevated,
                marginHorizontal: theme.spacing.md,
                marginBottom: theme.spacing.sm,
                borderRadius: theme.borderRadius.xl,
                borderTopWidth: 0,
                ...theme.shadows.lg,
            },
            minimal: {
                backgroundColor: "transparent",
                borderTopWidth: 0,
            },
        },
    },

    // Navigation Header
    NavigationHeader: {
        base: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            backgroundColor: theme.colors.surface.primary,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.primary,
            minHeight: 56,
        },
        backButton: {
            padding: theme.spacing.xs,
            marginRight: theme.spacing.sm,
            borderRadius: theme.borderRadius.md,
        },
        title: {
            flex: 1,
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.primary,
        },
        rightActions: {
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.xs,
        },
    },

    // Drawer component
    Drawer: {
        base: {
            flex: 1,
            backgroundColor: theme.colors.surface.primary,
        },
        header: {
            padding: theme.spacing.lg,
            backgroundColor: theme.colors.primary[500],
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.primary,
        },
        headerTitle: {
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.inverse,
            fontFamily: theme.typography.fontFamily.primary,
        },
        content: {
            flex: 1,
            paddingVertical: theme.spacing.md,
        },
        item: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.md,
            borderRadius: 0,
        },
        activeItem: {
            backgroundColor: theme.colors.interactive.selected,
            borderRightWidth: 3,
            borderRightColor: theme.colors.primary[500],
        },
        itemIcon: {
            marginRight: theme.spacing.md,
        },
        itemLabel: {
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.primary,
        },
        activeItemLabel: {
            color: theme.colors.primary[500],
            fontWeight: theme.typography.fontWeight.semibold,
        },
        divider: {
            height: 1,
            backgroundColor: theme.colors.border.primary,
            marginVertical: theme.spacing.sm,
            marginHorizontal: theme.spacing.lg,
        },
    },

    // Breadcrumb component
    Breadcrumb: {
        base: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            backgroundColor: theme.colors.surface.secondary,
        },
        item: {
            flexDirection: "row",
            alignItems: "center",
        },
        text: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            fontFamily: theme.typography.fontFamily.primary,
        },
        activeText: {
            color: theme.colors.text.primary,
            fontWeight: theme.typography.fontWeight.medium,
        },
        separator: {
            marginHorizontal: theme.spacing.xs,
            color: theme.colors.text.tertiary,
        },
    },

    // Pagination component
    Pagination: {
        base: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: theme.spacing.md,
            gap: theme.spacing.xs,
        },
        button: {
            minWidth: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.borderRadius.md,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            backgroundColor: theme.colors.surface.primary,
        },
        activeButton: {
            backgroundColor: theme.colors.primary[500],
            borderColor: theme.colors.primary[500],
        },
        disabledButton: {
            opacity: 0.5,
        },
        buttonText: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.primary,
        },
        activeButtonText: {
            color: theme.colors.text.inverse,
            fontWeight: theme.typography.fontWeight.semibold,
        },
        ellipsis: {
            paddingHorizontal: theme.spacing.sm,
            color: theme.colors.text.secondary,
        },
    },
});
