import { createStyles } from "@/core/theming/createStyledComponent";

export const feedLayoutStyles = createStyles((theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    content: {
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.md,
    },
}));
