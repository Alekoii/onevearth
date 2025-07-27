import { createStyles } from "@/core/theming/createStyledComponent";

export const cardStyles = createStyles<{
    padding?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    variant?: "default" | "elevated" | "outlined";
}>((theme, props) => ({
    card: {
        backgroundColor: theme.colors.surface.primary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing[props.padding || "md"],
        borderWidth: props.variant === "outlined" ? 1 : 0,
        borderColor: theme.colors.border.primary,
        shadowColor: props.variant === "elevated"
            ? theme.colors.text.primary
            : "transparent",
        shadowOffset: props.variant === "elevated"
            ? { width: 0, height: 2 }
            : { width: 0, height: 0 },
        shadowOpacity: props.variant === "elevated" ? 0.1 : 0,
        shadowRadius: props.variant === "elevated" ? 4 : 0,
        elevation: props.variant === "elevated" ? 2 : 0,
    },
}));
