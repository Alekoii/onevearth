import { createStyles } from "@/core/theming/createStyledComponent";

export const profileScreenStyles = createStyles((theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: theme.spacing.md,
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.md,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: theme.spacing.lg,
    },
    errorText: {
        color: theme.colors.status.error,
        fontSize: theme.typography.fontSize.md,
        textAlign: "center",
        marginBottom: theme.spacing.md,
    },
}));
