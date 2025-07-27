import { createStyles } from "@/core/theming/createStyledComponent";

export const inputStyles = createStyles<{
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    hasError?: boolean;
}>((theme, props) => ({
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
        paddingHorizontal: theme.spacing[
            props.size === "sm" ? "sm" : props.size === "lg" ? "lg" : "md"
        ],
        paddingVertical: theme.spacing[props.size === "sm" ? "xs" : "sm"],
        fontSize: theme.typography.fontSize[
            props.size === "sm" ? "sm" : props.size === "lg" ? "lg" : "md"
        ],
        color: theme.colors.text.primary,
        backgroundColor: props.variant === "ghost"
            ? "transparent"
            : theme.colors.surface.secondary,
        borderWidth: 1,
        borderColor: props.hasError
            ? theme.colors.status.error
            : props.variant === "ghost"
            ? theme.colors.border.primary
            : theme.colors.surface.secondary,
        opacity: props.disabled ? 0.6 : 1,
    },
    placeholder: {
        color: theme.colors.text.tertiary,
    },
    error: {
        fontSize: theme.typography.fontSize.xs,
        color: theme.colors.status.error,
        marginTop: theme.spacing.xs,
    },
}));
