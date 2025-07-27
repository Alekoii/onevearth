import { createStyles } from "@/core/theming/createStyledComponent";

export const postCreatorStyles = createStyles<{
    loading?: boolean;
}>((theme, props = {}) => {
    const { loading = false } = props;

    return {
        container: {
            marginBottom: theme.spacing.md,
            opacity: loading ? 0.7 : 1,
        },
        input: {
            minHeight: 100,
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.primary,
            textAlignVertical: "top",
            marginBottom: theme.spacing.md,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.sm,
            backgroundColor: theme.colors.surface.secondary,
        },
        buttonContainer: {
            alignItems: "flex-end",
        },
    };
});
