import { createStyles } from "@/core/theming/createStyledComponent";

export const feedLayoutStyles = createStyles((theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.md,
    },
}));
