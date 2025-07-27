import { createStyles } from "@/core/theming/createStyledComponent";

export const feedHeaderStyles = createStyles<{
    isActive?: boolean;
}>((theme, props = {}) => {
    const { isActive = false } = props;

    return {
        container: {
            flexDirection: "row",
            justifyContent: "space-around",
            paddingVertical: theme.spacing.sm,
            marginBottom: theme.spacing.md,
        },
        tab: {
            paddingVertical: theme.spacing.xs,
            paddingHorizontal: theme.spacing.md,
            borderRadius: theme.borderRadius.full,
            backgroundColor: isActive
                ? theme.colors.primary[500]
                : "transparent",
        },
        tabText: {
            fontSize: theme.typography.fontSize.sm,
            fontWeight: "500",
            color: isActive
                ? theme.colors.text.inverse
                : theme.colors.text.secondary,
        },
    };
});
