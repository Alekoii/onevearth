import { createStyles } from "@/core/theming/createStyledComponent";

export const buttonStyles = createStyles<{
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    loading?: boolean;
}>((theme, props = {}) => {
    const { variant = "primary", size = "md" } = props;

    const sizeMap = {
        sm: "sm",
        md: "md",
        lg: "lg",
    } as const;

    return {
        button: {
            borderRadius: theme.borderRadius.md,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: theme.spacing[sizeMap[size]],
            paddingVertical: theme.spacing[size === "sm" ? "xs" : "sm"],
            backgroundColor: variant === "primary"
                ? theme.colors.primary[500]
                : variant === "secondary"
                ? theme.colors.surface.secondary
                : "transparent",
            borderWidth: variant === "ghost" ? 1 : 0,
            borderColor: theme.colors.border.primary,
        },
        text: {
            color: variant === "primary"
                ? theme.colors.text.inverse
                : theme.colors.text.primary,
            fontSize: theme.typography.fontSize[sizeMap[size]],
            fontWeight: "600",
        },
    };
});
