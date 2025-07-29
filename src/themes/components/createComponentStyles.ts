import { ComponentStyles, Theme } from "@/core/theming/types";

// Helper function to create consistent component styles
const createBaseStyle = (theme: Theme, backgroundColor = "primary") => ({
    backgroundColor: theme.colors
        .surface[backgroundColor as keyof typeof theme.colors.surface],
    borderRadius: 0,
    padding: theme.spacing.md,
});

export const createComponentStyles = (theme: Theme): ComponentStyles => ({
    // Screen layout
    Screen: {
        base: {
            flex: 1,
            backgroundColor: theme.colors.background.primary,
        },
        content: {
            paddingHorizontal: theme.spacing.md,
            paddingBottom: theme.spacing.xl,
        },
        padding: { padding: theme.spacing.md },
        variants: {
            centered: { justifyContent: "center", alignItems: "center" },
            padded: { padding: theme.spacing.lg },
            safe: { flex: 1 }, // For screens that handle their own safe area
        },
    },

    // Card component
    Card: {
        base: { ...createBaseStyle(theme), marginBottom: theme.spacing.sm },
        border: { borderWidth: 1, borderColor: theme.colors.border.primary },
        variants: {
            elevated: theme.shadows.md,
            outlined: {
                borderWidth: 1,
                borderColor: theme.colors.border.primary,
                backgroundColor: "transparent",
            },
            filled: { backgroundColor: theme.colors.surface.secondary },
        },
        sizes: {
            sm: {
                padding: theme.spacing.sm,
                borderRadius: theme.borderRadius.md,
            },
            md: {
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.lg,
            },
            lg: {
                padding: theme.spacing.lg,
                borderRadius: theme.borderRadius.xl,
            },
        },
    },

    // Header component
    Header: {
        base: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            backgroundColor: theme.colors.surface.primary,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.primary,
        },
        title: {
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.primary,
        },
        subtitle: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            fontFamily: theme.typography.fontFamily.primary,
        },
        actions: {
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
        },
        variants: {
            large: { paddingVertical: theme.spacing.md },
            transparent: {
                backgroundColor: "transparent",
                borderBottomWidth: 0,
            },
        },
    },

    // Button component with comprehensive styling
    Button: {
        base: {
            borderRadius: theme.borderRadius.md,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: theme.spacing.xs,
        },
        variants: {
            primary: { backgroundColor: theme.colors.primary[500] },
            secondary: { backgroundColor: theme.colors.secondary[500] },
            outline: {
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: theme.colors.border.primary,
            },
            ghost: { backgroundColor: "transparent" },
            danger: { backgroundColor: theme.colors.error[500] },
        },
        sizes: {
            xs: {
                paddingHorizontal: theme.spacing.xs,
                paddingVertical: theme.spacing.xs / 2,
                minHeight: 28,
            },
            sm: {
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: theme.spacing.xs,
                minHeight: 32,
            },
            md: {
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
                minHeight: 40,
            },
            lg: {
                paddingHorizontal: theme.spacing.lg,
                paddingVertical: theme.spacing.md,
                minHeight: 48,
            },
        },
        states: {
            disabled: { opacity: 0.6 },
            loading: { opacity: 0.8 },
        },
        text: {
            primary: {
                color: theme.colors.text.inverse,
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semibold,
            },
            secondary: {
                color: theme.colors.text.inverse,
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semibold,
            },
            outline: {
                color: theme.colors.text.primary,
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semibold,
            },
            ghost: {
                color: theme.colors.text.primary,
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semibold,
            },
            danger: {
                color: theme.colors.text.inverse,
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semibold,
            },
        },
        icon: { marginRight: theme.spacing.xs },
        loading: { position: "absolute" },
    },

    // Input component
    Input: {
        base: {
            marginBottom: theme.spacing.sm,
        },
        container: { 
            marginBottom: theme.spacing.sm,
        },
        input: {
            borderRadius: theme.borderRadius.md,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            backgroundColor: theme.colors.surface.primary,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.primary,
            minHeight: 44,
            textAlignVertical: "center",
        },
        label: {
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.xs,
            fontFamily: theme.typography.fontFamily.primary,
        },
        required: {
            color: theme.colors.error[500],
            marginLeft: 2,
        },
        error: {
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.error[500],
            marginTop: theme.spacing.xs,
            fontFamily: theme.typography.fontFamily.primary,
        },
        helper: {
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.secondary,
            marginTop: theme.spacing.xs,
            fontFamily: theme.typography.fontFamily.primary,
        },
        placeholder: {
            color: theme.colors.text.placeholder,
        },
        states: {
            focused: { 
                borderColor: theme.colors.border.focus, 
                borderWidth: 2,
            },
            error: { 
                borderColor: theme.colors.error[500],
            },
            disabled: {
                backgroundColor: theme.colors.surface.secondary,
                opacity: 0.6,
            },
        },
        variants: {
            outline: { 
                backgroundColor: "transparent",
            },
            filled: {
                backgroundColor: theme.colors.surface.secondary,
                borderWidth: 0,
            },
        },
    },

    // Post Card component
    PostCard: {
        base: { ...createBaseStyle(theme)},
        ...createBaseStyle(theme),
        header: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: theme.spacing.sm,
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
        },
        avatarPlaceholder: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.surface.secondary,
            alignItems: "center",
            justifyContent: "center",
            marginRight: theme.spacing.sm,
        },
        userDetails: {
            flex: 1,
        },
        username: {
            fontSize: theme.typography.fontSize.md,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
        },
        timestamp: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
        },
        content: {
            marginBottom: theme.spacing.md,
        },
        contentText: {
            fontSize: theme.typography.fontSize.md,
            lineHeight: theme.typography.lineHeight.relaxed *
                theme.typography.fontSize.md,
            color: theme.colors.text.primary,
        },
        mediaContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
            marginBottom: theme.spacing.md,
            overflow: "hidden",
        },
        mediaImage: {
            width: "50%",
            aspectRatio: 1,
        },
        actions: {
            flexDirection: "row",
            alignItems: "center",
            paddingTop: theme.spacing.sm,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border.primary,
        },
        defaultActions: {
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
        },
        actionButton: {
            flexDirection: "row",
            alignItems: "center",
            marginRight: theme.spacing.lg,
        },
        actionText: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            marginLeft: theme.spacing.xs,
        },
        variants: {
            compact: {
                padding: theme.spacing.sm,
                marginBottom: theme.spacing.xs,
            },
        },
    },

    PostList: {
        base: { flex: 1 },
        emptyContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: theme.spacing.xl,
        },
        emptyText: {
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.secondary,
            textAlign: "center",
        },
        emptyList: {
            flex: 1,
            justifyContent: "center",
        },
        footerLoader: {
            padding: theme.spacing.md,
            alignItems: "center",
        },
        loadingText: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
        },
    },

    // Post Creator component

    PostCreator: {
        base: {
            backgroundColor: theme.colors.surface.primary,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.md,
            flex: 1,
        },
        inputContainer: {
            marginBottom: theme.spacing.md,
            flex: 1,
        },
        input: {
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.primary,
            padding: theme.spacing.sm,
            backgroundColor: theme.colors.background.secondary,
            borderRadius: theme.borderRadius.md,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            textAlignVertical: "top",
            fontFamily: theme.typography.fontFamily.primary,
        },
        inputFooter: {
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: theme.spacing.xs,
        },
        charCount: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
        },
        charCountWarning: {
            color: theme.colors.warning[500],
        },
        charCountError: {
            color: theme.colors.error[500],
        },
        toolbar: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: theme.spacing.sm,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border.primary,
            marginTop: "auto",
        },
        toolbarLeft: {
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
        },
        defaultToolbar: {
            flexDirection: "row",
            alignItems: "center",
        },
        toolbarButton: {
            padding: theme.spacing.xs,
            marginRight: theme.spacing.sm,
            borderRadius: theme.borderRadius.md,
            backgroundColor: theme.colors.surface.secondary,
        },
        visibilityButton: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xs,
            borderRadius: theme.borderRadius.md,
            backgroundColor: theme.colors.surface.secondary,
            marginLeft: theme.spacing.md,
        },
        visibilityText: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            marginLeft: theme.spacing.xs,
        },
        placeholder: {
            color: theme.colors.text.placeholder,
        },
    },

    // Tab Bar component
    TabBar: {
        base: {
            backgroundColor: theme.colors.surface.primary,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border.primary,
            paddingBottom: theme.spacing.sm,
            paddingTop: theme.spacing.xs,
        },
        tab: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: theme.spacing.xs,
        },
        label: {
            fontSize: theme.typography.fontSize.xs,
            fontWeight: theme.typography.fontWeight.medium,
            marginTop: theme.spacing.xs / 2,
            fontFamily: theme.typography.fontFamily.primary,
        },
        icon: { marginBottom: theme.spacing.xs / 2 },
        badge: {
            position: "absolute",
            top: -2,
            right: -2,
            backgroundColor: theme.colors.error[500],
            borderRadius: theme.borderRadius.full,
            minWidth: 16,
            height: 16,
            alignItems: "center",
            justifyContent: "center",
        },
    },

    AppNavigator: {
        base: { flex: 1 },
        tabBar: {
            backgroundColor: theme.colors.surface.primary,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border.primary,
            paddingBottom: theme.spacing.sm,
            paddingTop: theme.spacing.xs,
            height: 60,
        },
        tabBarLabel: {
            fontSize: theme.typography.fontSize.xs,
            fontWeight: theme.typography.fontWeight.medium,
            fontFamily: theme.typography.fontFamily.primary,
        },
        tabBarIcon: {
            marginBottom: 2,
        },
        variants: {
            floating: {
                position: "absolute",
                bottom: theme.spacing.md,
                left: theme.spacing.md,
                right: theme.spacing.md,
                borderRadius: theme.borderRadius.xl,
                ...theme.shadows.lg,
            },
        },
    },

    ProfileHeader: {
        base: {
            backgroundColor: theme.colors.surface.primary,
            padding: theme.spacing.md,
        },
        container: {
            padding: theme.spacing.md,
        },
        avatarSection: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: theme.spacing.md,
        },
        avatar: {
            width: 80,
            height: 80,
            borderRadius: 40,
            marginRight: theme.spacing.md,
        },
        avatarPlaceholder: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.colors.surface.secondary,
            alignItems: "center",
            justifyContent: "center",
            marginRight: theme.spacing.md,
        },
        userInfo: {
            flex: 1,
        },
        nameContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: theme.spacing.xs,
        },
        displayName: {
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary,
            marginRight: theme.spacing.xs,
        },
        username: {
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.secondary,
        },
        bio: {
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.primary,
            lineHeight: theme.typography.lineHeight.relaxed *
                theme.typography.fontSize.md,
            marginBottom: theme.spacing.md,
        },
        metadata: {
            flexDirection: "row",
            flexWrap: "wrap",
            marginBottom: theme.spacing.md,
        },
        metadataItem: {
            flexDirection: "row",
            alignItems: "center",
            marginRight: theme.spacing.lg,
            marginBottom: theme.spacing.xs,
        },
        metadataText: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            marginLeft: theme.spacing.xs,
        },
        stats: {
            flexDirection: "row",
            justifyContent: "space-around",
            paddingTop: theme.spacing.md,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border.primary,
        },
        statItem: {
            alignItems: "center",
        },
        statNumber: {
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary,
        },
        statLabel: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            marginTop: theme.spacing.xs,
        },
    },
});
