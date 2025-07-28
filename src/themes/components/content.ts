import { Theme } from "@/core/theming/types";

export const createContentStyles = (theme: Theme) => ({
    // Post Card component
    PostCard: {
        base: {
            backgroundColor: theme.colors.surface.primary,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.md,
            marginBottom: theme.spacing.md,
            ...theme.shadows.sm,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: theme.spacing.sm,
            justifyContent: "space-between",
        },
        userInfo: {
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: theme.spacing.sm,
            backgroundColor: theme.colors.surface.secondary,
        },
        content: {
            marginBottom: theme.spacing.md,
        },
        actions: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: theme.spacing.sm,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border.primary,
        },
        actionButton: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xs,
            borderRadius: theme.borderRadius.md,
            gap: theme.spacing.xs,
        },
        actionText: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            fontFamily: theme.typography.fontFamily.primary,
        },
        username: {
            fontSize: theme.typography.fontSize.md,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.primary,
        },
        timestamp: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            fontFamily: theme.typography.fontFamily.primary,
        },
        contentText: {
            fontSize: theme.typography.fontSize.md,
            lineHeight: theme.typography.lineHeight.relaxed *
                theme.typography.fontSize.md,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.primary,
        },
        moreButton: {
            padding: theme.spacing.xs,
            borderRadius: theme.borderRadius.md,
        },
        variants: {
            compact: {
                padding: theme.spacing.sm,
                marginBottom: theme.spacing.sm,
            },
            featured: {
                borderWidth: 2,
                borderColor: theme.colors.primary[500],
            },
            pinned: {
                backgroundColor: theme.colors.warning[50],
                borderLeftWidth: 4,
                borderLeftColor: theme.colors.warning[500],
            },
        },
    },

    // Post Creator component
    PostCreator: {
        base: {
            backgroundColor: theme.colors.surface.primary,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.md,
            marginBottom: theme.spacing.md,
            ...theme.shadows.sm,
        },
        input: {
            minHeight: 80,
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.primary,
            padding: 0,
            textAlignVertical: "top",
        },
        placeholder: {
            color: theme.colors.text.placeholder,
        },
        toolbar: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: theme.spacing.sm,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border.primary,
            marginTop: theme.spacing.sm,
        },
        toolbarLeft: {
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
        },
        toolbarRight: {
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
        },
        toolButton: {
            padding: theme.spacing.xs,
            borderRadius: theme.borderRadius.md,
        },
        characterCount: {
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.tertiary,
            fontFamily: theme.typography.fontFamily.primary,
        },
        characterCountWarning: {
            color: theme.colors.warning[500],
        },
        characterCountError: {
            color: theme.colors.error[500],
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: theme.spacing.sm,
            marginTop: theme.spacing.sm,
        },
        states: {
            disabled: {
                opacity: 0.6,
            },
            loading: {
                opacity: 0.8,
            },
        },
    },

    // Comment component
    Comment: {
        base: {
            backgroundColor: theme.colors.surface.primary,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.sm,
            marginBottom: theme.spacing.xs,
            marginLeft: theme.spacing.md,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: theme.spacing.xs,
        },
        userInfo: {
            flexDirection: "row",
            alignItems: "center",
        },
        avatar: {
            width: 24,
            height: 24,
            borderRadius: 12,
            marginRight: theme.spacing.xs,
            backgroundColor: theme.colors.surface.secondary,
        },
        username: {
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.primary,
        },
        timestamp: {
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.secondary,
            fontFamily: theme.typography.fontFamily.primary,
        },
        content: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.primary,
            lineHeight: theme.typography.lineHeight.normal *
                theme.typography.fontSize.sm,
        },
        actions: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: theme.spacing.xs,
            gap: theme.spacing.sm,
        },
        actionButton: {
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.xs / 2,
        },
        actionText: {
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.secondary,
            fontFamily: theme.typography.fontFamily.primary,
        },
        nested: {
            marginLeft: theme.spacing.lg,
            borderLeftWidth: 2,
            borderLeftColor: theme.colors.border.primary,
            paddingLeft: theme.spacing.sm,
        },
    },

    // Media component
    Media: {
        base: {
            borderRadius: theme.borderRadius.md,
            overflow: "hidden",
            marginVertical: theme.spacing.sm,
        },
        image: {
            width: "100%",
            aspectRatio: 16 / 9,
            backgroundColor: theme.colors.surface.secondary,
        },
        video: {
            width: "100%",
            aspectRatio: 16 / 9,
            backgroundColor: theme.colors.surface.secondary,
        },
        gallery: {
            flexDirection: "row",
            gap: theme.spacing.xs,
        },
        galleryItem: {
            flex: 1,
            aspectRatio: 1,
            borderRadius: theme.borderRadius.sm,
            overflow: "hidden",
        },
        playButton: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: [{ translateX: -25 }, { translateY: -25 }],
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            alignItems: "center",
            justifyContent: "center",
        },
    },

    // Notification Item component
    NotificationItem: {
        base: {
            backgroundColor: theme.colors.surface.primary,
            padding: theme.spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.primary,
        },
        content: {
            flexDirection: "row",
            alignItems: "flex-start",
            gap: theme.spacing.sm,
        },
        iconContainer: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: theme.colors.primary[100],
            alignItems: "center",
            justifyContent: "center",
        },
        textContainer: {
            flex: 1,
        },
        text: {
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.primary,
            lineHeight: theme.typography.lineHeight.normal *
                theme.typography.fontSize.md,
        },
        timestamp: {
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.secondary,
            fontFamily: theme.typography.fontFamily.primary,
            marginTop: theme.spacing.xs / 2,
        },
        unreadDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.colors.primary[500],
        },
        states: {
            read: {
                opacity: 0.7,
            },
            unread: {
                backgroundColor: theme.colors.primary[50],
            },
        },
    },
});
