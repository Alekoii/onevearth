import React, { useCallback, useEffect } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useColors, useStyles } from "@/core/theming/useStyles";
import { useTheme } from "@/core/theming/ThemeProvider";
import { useTranslation } from "@/hooks/useTranslation";
import { useConfig } from "@/core/config/ConfigProvider";
import { Icon } from "@/components/ui/Icon";
import { ExtensionPoint } from "@/core/plugins/ExtensionPoint";
import { CommentItem } from "./CommentItem";
import { useComments } from "../hooks/useComments";
import { Comment, CommentListProps } from "../types";

export const CommentList = ({
    postId,
    maxDepth,
    autoRefresh = false,
    post,
    ...otherProps
}: CommentListProps & { post?: any }) => {
    const styles = useStyles("CommentList");
    const colors = useColors();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const { config } = useConfig();

    useEffect(() => {
        console.log("CommentList rendered with props:", {
            postId,
            maxDepth,
            autoRefresh,
            hasPost: !!post,
            otherProps: Object.keys(otherProps),
        });
    }, [postId, maxDepth, autoRefresh, post, otherProps]);

    const effectivePostId = postId || post?.id;

    if (!effectivePostId) {
        console.error("CommentList: No postId provided");
        return (
            <View
                style={[
                    styles.base,
                    {
                        padding: theme.spacing.md,
                        backgroundColor: colors.background.primary,
                    },
                ]}
            >
                <Text
                    style={{
                        color: colors.error(500),
                        textAlign: "center",
                        fontSize: theme.typography.fontSize.md,
                    }}
                >
                    Error: No post ID provided to CommentList
                </Text>
            </View>
        );
    }

    const effectiveMaxDepth = maxDepth ?? config.features.comments?.maxDepth ??
        3;

    const {
        topLevelComments,
        stats,
        loading,
        refreshing,
        loadingMore,
        hasMore,
        error,
        paginationError,
        isEmpty,
        canLoadMore,
        refreshComments,
        loadMoreComments,
        retryPagination,
        retryInitialLoad,
    } = useComments({
        postId: effectivePostId,
        maxDepth: effectiveMaxDepth,
        autoRefresh,
    });

    const renderComment = useCallback(
        ({ item }: { item: Comment }) => (
            <CommentItem
                comment={item}
                maxDepth={effectiveMaxDepth}
                currentDepth={0}
                showReplies={true}
                onReply={(commentId) => {
                    console.log("Reply to comment:", commentId);
                }}
                onEdit={(commentId) => {
                    console.log("Edit comment:", commentId);
                }}
                onDelete={(commentId) => {
                    console.log("Delete comment:", commentId);
                }}
            />
        ),
        [effectiveMaxDepth],
    );

    const renderSeparator = useCallback(
        () => (
            <View
                style={{
                    height: 1,
                    backgroundColor: colors.border.secondary,
                    marginVertical: theme.spacing.sm,
                }}
            />
        ),
        [colors, theme],
    );

    const renderHeader = useCallback(() => {
        if (!topLevelComments?.length) return null;

        return (
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    Comments
                </Text>
                <Text style={styles.commentCount}>
                    {stats.total} {stats.total === 1 ? "comment" : "comments"}
                </Text>
            </View>
        );
    }, [topLevelComments?.length, stats, styles]);

    const renderEmpty = useCallback(() => {
        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color={theme.colors.primary[500]}
                    />
                    <Text style={styles.loadingText}>
                        Loading comments...
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.emptyContainer}>
                <Icon
                    name="comment"
                    size={48}
                    color={colors.text.tertiary}
                />
                <Text
                    style={[styles.emptyText, { marginTop: theme.spacing.md }]}
                >
                    No comments yet
                </Text>
                <Text
                    style={[
                        styles.emptyText,
                        {
                            fontSize: theme.typography.fontSize.sm,
                            marginTop: theme.spacing.xs,
                        },
                    ]}
                >
                    Be the first to comment!
                </Text>
            </View>
        );
    }, [loading, styles, colors, theme]);

    const renderFooter = useCallback(() => {
        if (paginationError) {
            return (
                <View
                    style={[styles.errorContainer, {
                        margin: theme.spacing.sm,
                    }]}
                >
                    <Text style={styles.errorText}>
                        Failed to load more comments
                    </Text>
                    <TouchableOpacity
                        onPress={retryPagination}
                        style={styles.retryButton}
                    >
                        <Text style={styles.retryButtonText}>
                            Try Again
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (loadingMore) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="small"
                        color={theme.colors.primary[500]}
                    />
                    <Text style={styles.loadingText}>
                        Loading more comments...
                    </Text>
                </View>
            );
        }

        return null;
    }, [loadingMore, paginationError, retryPagination, styles, theme]);

    if (error && !topLevelComments?.length) {
        return (
            <View style={styles.errorContainer}>
                <Icon
                    name="comment"
                    size={24}
                    color={colors.error(500)}
                />
                <Text
                    style={[styles.errorText, { marginLeft: theme.spacing.sm }]}
                >
                    {error}
                </Text>
                <TouchableOpacity
                    onPress={retryInitialLoad}
                    style={styles.retryButton}
                >
                    <Text style={styles.retryButtonText}>
                        Try Again
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View
            style={[styles.base, {
                backgroundColor: colors.background.primary,
            }]}
        >
            <ExtensionPoint
                name="comments.list.header"
                postId={effectivePostId}
                commentCount={stats.total}
            />

            <FlatList
                data={topLevelComments || []}
                renderItem={renderComment}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
                ItemSeparatorComponent={renderSeparator}
                onEndReached={() => {
                    if (canLoadMore && !loadingMore) {
                        loadMoreComments();
                    }
                }}
                onEndReachedThreshold={0.1}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refreshComments}
                        tintColor={theme.colors.primary[500]}
                        colors={[theme.colors.primary[500]]}
                    />
                }
                bounces={true}
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                initialNumToRender={5}
                windowSize={10}
            />

            <ExtensionPoint
                name="comments.list.footer"
                postId={effectivePostId}
                commentCount={stats.total}
            />
        </View>
    );
};
