import { createStyles } from "@/core/theming/createStyledComponent";

export const notificationsScreenStyles = createStyles<{
    read?: boolean;
}>((theme, props = {}) => {
    const { read = false } = props;

    return {
        container: {
            flex: 1,
            backgroundColor: theme.colors.background.primary,
        },
        content: {
            padding: theme.spacing.md,
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
        notificationCard: {
            marginBottom: theme.spacing.sm,
            backgroundColor: read
                ? theme.colors.surface.primary
                : theme.colors.surface.secondary,
        },
        notificationContent: {
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
        icon: {
            color: theme.colors.primary[500],
        },
        textContainer: {
            flex: 1,
        },
        notificationText: {
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.primary,
            fontWeight: read ? "400" : "500",
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
    };
});
