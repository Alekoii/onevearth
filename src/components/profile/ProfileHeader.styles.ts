import { createStyles } from "@/core/theming/createStyledComponent";

export const profileHeaderStyles = createStyles((theme) => ({
    container: {
        padding: theme.spacing.lg,
        alignItems: "center",
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.surface.secondary,
        marginBottom: theme.spacing.md,
    },
    username: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: "600",
        color: theme.colors.text.primary,
    },
    bio: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text.secondary,
        textAlign: "center",
        marginTop: theme.spacing.sm,
    },
    stats: {
        flexDirection: "row",
        gap: theme.spacing.lg,
        marginTop: theme.spacing.md,
    },
    stat: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: "600",
        color: theme.colors.text.primary,
    },
    statLabel: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.secondary,
    },
}));
