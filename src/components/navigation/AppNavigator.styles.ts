import { createStyles } from "@/core/theming/createStyledComponent";

export const appNavigatorStyles = createStyles((theme) => ({
    tabBar: {
        backgroundColor: theme.colors.background.secondary,
        borderTopWidth: 0,
        height: 80,
        paddingBottom: theme.spacing.sm,
        paddingTop: theme.spacing.xs,
    },
}));
