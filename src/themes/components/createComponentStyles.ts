import { ComponentStyles, Theme } from "@/core/theming/types";

// Helper function to create consistent component styles
const createBaseStyle = (theme: Theme, backgroundColor = "primary") => ({
    backgroundColor: theme.colors
        .surface[backgroundColor as keyof typeof theme.colors.surface],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
});

export const createComponentStyles = (theme: Theme): ComponentStyles => ({
    // Screen layout
    Screen: {
        base: { flex: 1, backgroundColor: theme.colors.background.primary },
        content: {
            paddingHorizontal: theme.spacing.md,
            paddingBottom: theme.spacing.xl,
        },
        padding: { padding: theme.spacing.md },
        variants: {
            centered: { justifyContent: "center", alignItems: "center" },
            padded: { padding: theme.spacing.lg },
        },
    },

    // Card component
    Card: {
        base: { ...createBaseStyle(theme), marginBottom: theme.spacing.sm },
        border: { borderWidth: 1, borderColor: theme.colors.border.primary },
        variants: {
            elevated: {},
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
            borderRadius: theme.borderRadius.md,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            backgroundColor: theme.colors.surface.primary,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.primary,
        },
        container: { marginBottom: theme.spacing.sm },
        label: {
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.xs,
            fontFamily: theme.typography.fontFamily.primary,
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
        states: {
            focused: { borderColor: theme.colors.border.focus, borderWidth: 2 },
            error: { borderColor: theme.colors.error[500] },
            disabled: {
                backgroundColor: theme.colors.surface.secondary,
                opacity: 0.6,
            },
        },
        variants: {
            outline: { backgroundColor: "transparent" },
            filled: {
                backgroundColor: theme.colors.surface.secondary,
                borderWidth: 0,
            },
        },
    },

    // Post Card component
    PostCard: {
        base: { ...createBaseStyle(theme) },
        ...createBaseStyle(theme),
        marginBottom: theme.spacing.sm,
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
            borderRadius: theme.borderRadius.md,
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
        base: createBaseStyle(theme),
        ...createBaseStyle(theme),
        inputContainer: {
            marginBottom: theme.spacing.md,
        },
        input: {
            minHeight: 100,
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.primary,
            padding: 0,
            textAlignVertical: "top",
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

    // Comment Item component styles
    CommentItem: {
        base: {
            marginBottom: theme.spacing.sm,
        },
        container: {
            marginBottom: theme.spacing.sm,
        },
        commentContainer: {
            backgroundColor: theme.colors.surface.primary,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.sm,
            borderLeftWidth: 2,
            borderLeftColor: theme.colors.border.primary,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: theme.spacing.xs,
        },
        avatar: {
            width: 32,
            height: 32,
            borderRadius: 16,
            marginRight: theme.spacing.sm,
        },
        avatarPlaceholder: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: theme.colors.surface.secondary,
            alignItems: "center",
            justifyContent: "center",
            marginRight: theme.spacing.sm,
        },
        userInfo: {
            flex: 1,
        },
        userDetails: {
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
        },
        username: {
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            marginRight: theme.spacing.xs,
        },
        timestamp: {
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.secondary,
        },
        content: {
            marginBottom: theme.spacing.sm,
        },
        contentText: {
            fontSize: theme.typography.fontSize.sm,
            lineHeight: theme.typography.lineHeight.normal *
                theme.typography.fontSize.sm,
            color: theme.colors.text.primary,
        },
        actions: {
            flexDirection: "row",
            alignItems: "center",
        },
        defaultActions: {
            flexDirection: "row",
            alignItems: "center",
        },
        actionButton: {
            flexDirection: "row",
            alignItems: "center",
            marginRight: theme.spacing.md,
            paddingVertical: theme.spacing.xs,
            paddingHorizontal: theme.spacing.sm,
            borderRadius: theme.borderRadius.sm,
            backgroundColor: "transparent",
        },
        actionText: {
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.secondary,
            marginLeft: theme.spacing.xs,
            fontWeight: theme.typography.fontWeight.medium,
        },
        replyForm: {
            marginTop: theme.spacing.sm,
            padding: theme.spacing.sm,
            backgroundColor: theme.colors.surface.secondary,
            borderRadius: theme.borderRadius.md,
            marginLeft: theme.spacing.lg,
        },
        replyFormText: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.xs,
        },
        cancelText: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.primary[500],
            fontWeight: theme.typography.fontWeight.medium,
        },
        repliesSection: {
            marginTop: theme.spacing.sm,
            marginLeft: theme.spacing.lg,
        },
        toggleReplies: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: theme.spacing.xs,
            marginBottom: theme.spacing.sm,
        },
        toggleText: {
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.secondary,
            marginLeft: theme.spacing.xs,
            fontWeight: theme.typography.fontWeight.medium,
        },
        nestedReplies: {
            borderLeftWidth: 1,
            borderLeftColor: theme.colors.border.secondary,
            paddingLeft: theme.spacing.md,
        },
        variants: {
            nested: {
                marginLeft: theme.spacing.md,
                borderLeftWidth: 1,
                borderLeftColor: theme.colors.border.secondary,
            },
        },
        sizes: {
            compact: {
                padding: theme.spacing.xs,
            },
        },
    },

    // Comment List component styles
    CommentList: {
        base: {
            flex: 1,
        },
        container: {
            padding: theme.spacing.md,
        },
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
        loadingContainer: {
            padding: theme.spacing.md,
            alignItems: "center",
        },
        loadingText: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            marginTop: theme.spacing.xs,
        },
        errorContainer: {
            padding: theme.spacing.md,
            backgroundColor: theme.colors.error[50],
            borderRadius: theme.borderRadius.md,
            borderWidth: 1,
            borderColor: theme.colors.error[200],
            margin: theme.spacing.sm,
        },
        errorText: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.error[700],
            textAlign: "center",
            marginBottom: theme.spacing.sm,
        },
        retryButton: {
            alignSelf: "center",
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.xs,
            backgroundColor: theme.colors.error[500],
            borderRadius: theme.borderRadius.sm,
        },
        retryButtonText: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.inverse,
            fontWeight: theme.typography.fontWeight.medium,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: theme.spacing.md,
            paddingBottom: theme.spacing.sm,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.primary,
        },
        headerTitle: {
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
        },
        commentCount: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
        },
    },

    // Comment Creator component styles
    // Add this to the CommentCreator section in createComponentStyles.ts

    CommentCreator: {
        base: {
            backgroundColor: theme.colors.surface.primary,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.md,
            marginBottom: theme.spacing.md,
        },
        container: {
            marginBottom: theme.spacing.md,
        },
        inputContainer: {
            marginBottom: theme.spacing.sm,
            position: "relative",
        },
        input: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.primary,
            padding: theme.spacing.sm,
            backgroundColor: theme.colors.background.secondary,
            borderRadius: theme.borderRadius.sm,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            textAlignVertical: "top",
            fontFamily: theme.typography.fontFamily.primary,
            minHeight: 80,
        },
        inputFocused: {
            borderColor: theme.colors.border.focus,
            borderWidth: 2,
        },
        inputError: {
            borderColor: theme.colors.error[500],
            borderWidth: 2,
        },
        inputFooter: {
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: theme.spacing.xs,
        },
        charCounter: {
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.secondary,
            fontFamily: theme.typography.fontFamily.primary,
        },
        charCount: {
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.secondary,
            fontFamily: theme.typography.fontFamily.primary,
        },
        toolbar: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: theme.spacing.sm,
        },
        cancelButton: {
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            borderRadius: theme.borderRadius.sm,
            backgroundColor: theme.colors.surface.secondary,
        },
        cancelButtonText: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.primary,
            fontWeight: theme.typography.fontWeight.medium,
            fontFamily: theme.typography.fontFamily.primary,
        },
        cancelText: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.primary,
            fontWeight: theme.typography.fontWeight.medium,
            fontFamily: theme.typography.fontFamily.primary,
        },
        submitButton: {
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            borderRadius: theme.borderRadius.sm,
            backgroundColor: theme.colors.primary[500],
            alignItems: "center",
            justifyContent: "center",
        },
        submitButtonText: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.inverse,
            fontWeight: theme.typography.fontWeight.semibold,
            fontFamily: theme.typography.fontFamily.primary,
        },
        submitText: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.inverse,
            fontWeight: theme.typography.fontWeight.semibold,
            fontFamily: theme.typography.fontFamily.primary,
        },
        errorContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: theme.spacing.sm,
            padding: theme.spacing.xs,
            backgroundColor: theme.colors.error[50] ||
                theme.colors.surface.secondary,
            borderRadius: theme.borderRadius.sm,
            borderWidth: 1,
            borderColor: theme.colors.error[200] || theme.colors.border.primary,
        },
        errorText: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.error[700] || theme.colors.text.primary,
            marginLeft: theme.spacing.xs,
            fontFamily: theme.typography.fontFamily.primary,
        },
        actions: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: theme.spacing.sm,
        },
        buttonGroup: {
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
        },
        variants: {
            footer: {
                backgroundColor: theme.colors.surface.primary,
                borderTopWidth: 1,
                borderTopColor: theme.colors.border.primary,
                borderRadius: 0,
                margin: 0,
                padding: theme.spacing.md,
            },
            default: {
                backgroundColor: theme.colors.surface.primary,
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.md,
                marginBottom: theme.spacing.md,
            },
            reply: {
                backgroundColor: theme.colors.background.secondary,
                borderRadius: theme.borderRadius.sm,
                padding: theme.spacing.sm,
                marginTop: theme.spacing.sm,
                marginLeft: theme.spacing.md,
            },
            inline: {
                backgroundColor: "transparent",
                padding: theme.spacing.xs,
                margin: 0,
            },
        },
        sizes: {
            compact: {
                padding: theme.spacing.sm,
            },
            normal: {
                padding: theme.spacing.md,
            },
            large: {
                padding: theme.spacing.lg,
            },
        },
        states: {
            focused: {
                borderColor: theme.colors.border.focus,
                borderWidth: 2,
            },
            error: {
                borderColor: theme.colors.error[500],
                borderWidth: 2,
            },
            disabled: {
                opacity: 0.6,
                backgroundColor: theme.colors.surface.tertiary,
            },
            loading: {
                opacity: 0.8,
            },
        },
    },
});
