import { createStyles } from "@/core/theming/createStyledComponent";

export const postCardStyles = createStyles<{}>((theme) => ({
    container: {
        backgroundColor: theme.colors.surface.primary,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.md,
        padding: theme.spacing.md,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: theme.spacing.sm,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: theme.spacing.sm,
    },
    userInfo: {
        flex: 1,
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
    mediaContainer: {
        borderRadius: theme.borderRadius.md,
        overflow: "hidden",
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
    },
    actionIcon: {
        fontSize: 16,
    },
    actionText: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.secondary,
    },
}));
