import { createStyles } from "@/core/theming/createStyledComponent";

export const postCreatorStyles = createStyles<{
    loading?: boolean;
}>((theme, props) => ({
    container: {
        marginBottom: theme.spacing.md,
        opacity: props.loading ? 0.7 : 1,
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
    },
    buttonContainer: {
        alignItems: "flex-end",
    },
}));
