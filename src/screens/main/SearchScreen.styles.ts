import { createStyles } from "@/core/theming/createStyledComponent";

export const searchScreenStyles = createStyles((theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    searchContainer: {
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.sm,
    },
    content: {
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.xl,
    },
}));
