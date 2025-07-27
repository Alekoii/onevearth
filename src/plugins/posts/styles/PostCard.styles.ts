import { createStyles } from "@/core/theming/createStyledComponent";

export const postCardStyles = createStyles<{
    compactMode?: boolean;
    variant?: "default" | "featured";
}>((theme, props = {}) => {
    const { compactMode = false } = props;

    return {
        container: {
            backgroundColor: theme.colors.surface.primary,
            borderRadius: theme.borderRadius.lg,
            marginBottom: theme.spacing.md,
            padding: compactMode ? theme.spacing.sm : theme.spacing.md,
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
        },
        actionText: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
        },
    };
});
