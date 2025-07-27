import { createStyles } from "@/core/theming/createStyledComponent";

export const postCardStyles = createStyles<{
    compactMode?: boolean;
    variant?: "default" | "featured";
}>((theme, props) => ({
    container: {
        marginBottom: theme.spacing.md,
        opacity: props.compactMode ? 0.8 : 1,
        borderWidth: props.variant === "featured" ? 2 : 1,
        borderColor: props.variant === "featured"
            ? theme.colors.primary[500]
            : theme.colors.border.primary,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: theme.spacing.sm,
    },
    username: {
        fontSize: props.compactMode
            ? theme.typography.fontSize.sm
            : theme.typography.fontSize.md,
        fontWeight: "600",
        color: theme.colors.text.primary,
        marginRight: theme.spacing.sm,
    },
    timestamp: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.tertiary,
    },
    content: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text.primary,
        lineHeight: theme.typography.lineHeight.normal *
            theme.typography.fontSize.md,
        marginBottom: theme.spacing.md,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingTop: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border.primary,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
    },
    actionText: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.xs,
    },
}));
