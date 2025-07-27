import { createStyles } from "@/core/theming/createStyledComponent";

export const buttonStyles = createStyles<{
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    loading?: boolean;
}>((theme, props) => ({
    button: {
        borderRadius: theme.borderRadius.md,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: theme.spacing[
            props.size === "sm" ? "sm" : props.size === "lg" ? "lg" : "md"
        ],
        paddingVertical: theme.spacing[props.size === "sm" ? "xs" : "sm"],
        backgroundColor: props.variant === "primary"
            ? theme.colors.primary[500]
            : props.variant === "secondary"
            ? theme.colors.surface.secondary
            : "transparent",
        borderWidth: props.variant === "ghost" ? 1 : 0,
        borderColor: theme.colors.border.primary,
        opacity: props.disabled ? 0.6 : 1,
    },
    text: {
        color: props.variant === "primary"
            ? theme.colors.text.inverse
            : theme.colors.text.primary,
        fontSize: theme.typography.fontSize[
            props.size === "sm" ? "sm" : props.size === "lg" ? "lg" : "md"
        ],
        fontWeight: "600",
    },
}));
