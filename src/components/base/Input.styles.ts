import { createStyles } from "@/core/theming/createStyledComponent";

export const inputStyles = createStyles<{
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    hasError?: boolean;
}>((theme, props = {}) => {
    const {
        variant = "primary",
        size = "md",
        disabled = false,
        hasError = false,
    } = props;

    const sizeMap = {
        sm: "sm",
        md: "md",
        lg: "lg",
    } as const;

    return {
        container: {
            marginBottom: theme.spacing.sm,
        },
        label: {
            fontSize: theme.typography.fontSize.sm,
            fontWeight: "500",
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.xs,
        },
        required: {
            color: theme.colors.status.error,
        },
        input: {
            borderRadius: theme.borderRadius.md,
            paddingHorizontal: theme.spacing[sizeMap[size]],
            paddingVertical: theme.spacing[size === "sm" ? "xs" : "sm"],
            fontSize: theme.typography.fontSize[sizeMap[size]],
            color: theme.colors.text.primary,
            backgroundColor: variant === "ghost"
                ? "transparent"
                : theme.colors.surface.secondary,
            borderWidth: 1,
            borderColor: hasError
                ? theme.colors.status.error
                : variant === "ghost"
                ? theme.colors.border.primary
                : theme.colors.surface.secondary,
            opacity: disabled ? 0.6 : 1,
        },
        placeholder: {
            color: theme.colors.text.tertiary,
        },
        error: {
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.status.error,
            marginTop: theme.spacing.xs,
        },
    };
});
