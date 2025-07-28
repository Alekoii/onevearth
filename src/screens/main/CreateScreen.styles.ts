import { createStyles } from "@/core/theming/createStyledComponent";

export const createScreenStyles = createStyles<{
    loading?: boolean;
}>((theme, props = {}) => {
    const { loading = false } = props;

    return {
        container: {
            flex: 1,
            backgroundColor: theme.colors.background.primary,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing.md,
        },
        postContainer: {
            flex: 1,
            minHeight: 200,
            opacity: loading ? 0.7 : 1,
        },
        textInput: {
            flex: 1,
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.primary,
            textAlignVertical: "top",
            marginBottom: theme.spacing.lg,
        },
        actions: {
            alignItems: "flex-end",
        },
    };
});
