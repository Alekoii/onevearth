import { createStyles } from "@/core/theming/createStyledComponent";

export const postListStyles = createStyles((theme) => ({
    container: {
        flex: 1,
    },
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
    list: {
        paddingBottom: theme.spacing.lg,
    },
}));
