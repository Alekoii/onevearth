import { Theme } from "@/core/theming/types";

export const createComponentStyles = (theme: Theme) => ({
    Button: {
        base: {
            borderRadius: theme.borderRadius.md,
            alignItems: "center",
            justifyContent: "center",
        },
        variants: {
            primary: {
                backgroundColor: theme.colors.primary[500],
            },
            secondary: {
                backgroundColor: theme.colors.surface.secondary,
                borderWidth: 1,
                borderColor: theme.colors.border.primary,
            },
            ghost: {
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: theme.colors.border.primary,
            },
        },
        sizes: {
            sm: {
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: theme.spacing.xs,
            },
            md: {
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
            },
            lg: {
                paddingHorizontal: theme.spacing.lg,
                paddingVertical: theme.spacing.md,
            },
        },
        text: {
            primary: { color: theme.colors.text.inverse, fontWeight: "600" },
            secondary: { color: theme.colors.text.primary, fontWeight: "600" },
            ghost: { color: theme.colors.text.primary, fontWeight: "600" },
        },
    },

    Card: {
        base: {
            backgroundColor: theme.colors.surface.primary,
            borderRadius: theme.borderRadius.lg,
        },
        variants: {
            default: {},
            elevated: {
                borderWidth: 1,
                borderColor: theme.colors.border.primary,
            },
            outlined: {
                borderWidth: 1,
                borderColor: theme.colors.border.primary,
            },
        },
        padding: {
            sm: { padding: theme.spacing.sm },
            md: { padding: theme.spacing.md },
            lg: { padding: theme.spacing.lg },
        },
    },

    Input: {
        base: {
            borderRadius: theme.borderRadius.md,
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.primary,
            borderWidth: 1,
            backgroundColor: theme.colors.surface.secondary,
            borderColor: theme.colors.surface.secondary,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
        },
        states: {
            error: { borderColor: theme.colors.status.error },
            disabled: { opacity: 0.6 },
        },
        label: {
            fontSize: theme.typography.fontSize.sm,
            fontWeight: "500",
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.xs,
        },
        required: { color: theme.colors.status.error },
        error: {
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.status.error,
            marginTop: theme.spacing.xs,
        },
        placeholder: { color: theme.colors.text.tertiary },
        container: { marginBottom: theme.spacing.sm },
    },

    PostCard: {
        base: {
            marginBottom: theme.spacing.md,
            padding: theme.spacing.md,
            backgroundColor: theme.colors.surface.primary,
            borderRadius: theme.borderRadius.lg,
        },
        variants: {
            default: {},
            featured: {
                borderWidth: 1,
                borderColor: theme.colors.primary[500],
            },
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing.sm,
        },
        username: {
            fontSize: theme.typography.fontSize.md,
            fontWeight: "600",
            color: theme.colors.text.primary,
        },
        timestamp: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
        },
        content: {
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.primary,
            lineHeight: theme.typography.lineHeight.relaxed *
                theme.typography.fontSize.md,
            marginBottom: theme.spacing.md,
        },
        actions: {
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.lg,
        },
        actionButton: {
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.xs,
            paddingVertical: theme.spacing.xs,
            paddingHorizontal: theme.spacing.sm,
            borderRadius: theme.borderRadius.sm,
        },
        actionText: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            fontWeight: "500",
        },
    },

    PostCreator: {
        base: {
            marginBottom: theme.spacing.md,
        },
        input: {
            minHeight: 100,
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.primary,
            textAlignVertical: "top",
            marginBottom: theme.spacing.md,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.sm,
            backgroundColor: theme.colors.surface.secondary,
        },
        buttonContainer: { alignItems: "flex-end" },
    },

    PostList: {
        container: { flex: 1 },
        title: {
            fontSize: theme.typography.fontSize.lg,
            fontWeight: "600",
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.md,
        },
        emptyContainer: {
            padding: theme.spacing.lg,
            alignItems: "center",
        },
        emptyText: {
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.secondary,
            textAlign: "center",
        },
        list: { paddingBottom: theme.spacing.lg },
    },

    Screen: {
        base: {
            flex: 1,
            backgroundColor: theme.colors.background.primary,
        },
        content: {
            paddingHorizontal: theme.spacing.md,
            paddingBottom: theme.spacing.xl,
        },
    },

    AppNavigator: {
        tabBar: {
            backgroundColor: theme.colors.background.secondary,
            borderTopWidth: 0,
            height: 80,
            paddingBottom: theme.spacing.sm,
            paddingTop: theme.spacing.xs,
        },
    },

    ProfileHeader: {
        container: {
            padding: theme.spacing.lg,
            alignItems: "center",
        },
        avatar: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.colors.surface.secondary,
            marginBottom: theme.spacing.md,
        },
        username: {
            fontSize: theme.typography.fontSize.xl,
            fontWeight: "600",
            color: theme.colors.text.primary,
        },
        bio: {
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.secondary,
            textAlign: "center",
            marginTop: theme.spacing.sm,
        },
        stats: {
            flexDirection: "row",
            gap: theme.spacing.lg,
            marginTop: theme.spacing.md,
        },
        stat: { alignItems: "center" },
        statNumber: {
            fontSize: theme.typography.fontSize.lg,
            fontWeight: "600",
            color: theme.colors.text.primary,
        },
        statLabel: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
        },
    },

    NotificationItem: {
        container: {
            marginBottom: theme.spacing.sm,
        },
        content: {
            flexDirection: "row",
            alignItems: "center",
        },
        iconContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.primary[100],
            alignItems: "center",
            justifyContent: "center",
            marginRight: theme.spacing.sm,
        },
        textContainer: { flex: 1 },
        text: {
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.primary,
        },
        timestamp: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            marginTop: theme.spacing.xs,
        },
        unreadDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.colors.primary[500],
        },
        states: {
            read: { fontWeight: "400" },
            unread: { fontWeight: "500" },
        },
    },
});
