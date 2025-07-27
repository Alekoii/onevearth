import { createStyles } from "@/core/theming/createStyledComponent";

export const cardStyles = createStyles<{
    padding?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    variant?: "default" | "elevated" | "outlined";
}>((theme, props = {}) => {
    const { padding = "md", variant = "default" } = props;

    return {
        card: {
            backgroundColor: theme.colors.surface.primary,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing[padding],
            borderWidth: variant === "outlined" ? 1 : 0,
            borderColor: theme.colors.border.primary,
            shadowColor: variant === "elevated"
                ? theme.colors.text.primary
                : "transparent",
            shadowOffset: variant === "elevated"
                ? { width: 0, height: 2 }
                : { width: 0, height: 0 },
            shadowOpacity: variant === "elevated" ? 0.1 : 0,
            shadowRadius: variant === "elevated" ? 4 : 0,
            elevation: variant === "elevated" ? 2 : 0,
        },
    };
});
