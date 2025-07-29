import { useCallback } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useStyles } from "@/core/theming/useStyles";
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
}: CommentListProps) => {
    const styles = useStyles("CommentList");
    const { t } = useTranslation();
    const { config } = useConfig();

    // Get maxDepth from config if not provided
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
        postId,
        autoRefresh,
        maxDepth: effectiveMaxDepth,
    });

    const handleRefresh = useCallback(() => {
        refreshComments();
    }, [refreshComments]);

    const handleEndReached = useCallback(() => {
        if (canLoadMore) {
            loadMoreComments();
        }
    }, [canLoadMore, loadMoreComments]);

    const handleReply = useCallback((commentId: number) => {
        console.log("Reply to comment:", commentId);
        // This would typically open a reply form
    }, []);

    const handleEdit = useCallback((commentId: number) => {
        console.log("Edit comment:", commentId);
        // This would typically open an edit form
    }, []);

    const handleDelete = useCallback((commentId: number) => {
        console.log("Delete comment:", commentId);
        // This would typically show a confirmation dialog
    }, []);

    const renderComment = useCallback(
        ({ item }: { item: Comment }) => (
            <CommentItem
                comment={item}
                onReply={handleReply}
                onEdit={handleEdit}
                onDelete={handleDelete}
                maxDepth={effectiveMaxDepth}
                currentDepth={0}
                showReplies={true}
            />
        ),
        [handleReply, handleEdit, handleDelete, effectiveMaxDepth],
    );

    const renderHeader = useCallback(() => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>
                Comments
            </Text>
            <Text style={styles.commentCount}>
                {stats.total} {stats.total === 1 ? "comment" : "comments"}
            </Text>
        </View>
    ), [styles.header, styles.headerTitle, styles.commentCount, stats.total]);

    const renderEmpty = useCallback(() => {
        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#DB00FF" />
                    <Text style={styles.loadingText}>
                        Loading comments...
                    </Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.errorContainer}>
                    <Icon name="x" size={24} color="#EF4444" />
                    <Text style={styles.errorText}>
                        {error}
                    </Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={retryInitialLoad}
                    >
                        <Text style={styles.retryButtonText}>
                            {t("common.retry")}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (isEmpty) {
            return (
                <View style={styles.emptyContainer}>
                    <Icon name="comment" size={48} color="#9CA3AF" />
                    <Text style={styles.emptyText}>
                        No comments yet. Be the first to comment!
                    </Text>
                </View>
            );
        }

        return null;
    }, [
        loading,
        error,
        isEmpty,
        styles.loadingContainer,
        styles.loadingText,
        styles.errorContainer,
        styles.errorText,
        styles.retryButton,
        styles.retryButtonText,
        styles.emptyContainer,
        styles.emptyText,
        retryInitialLoad,
        t,
    ]);

    const renderFooter = useCallback(() => {
        if (paginationError) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        Failed to load more comments
                    </Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={retryPagination}
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
                    <ActivityIndicator size="small" color="#DB00FF" />
                    <Text style={styles.loadingText}>
                        Loading more comments...
                    </Text>
                </View>
            );
        }

        return null;
    }, [
        paginationError,
        loadingMore,
        styles.errorContainer,
        styles.errorText,
        styles.retryButton,
        styles.retryButtonText,
        styles.loadingContainer,
        styles.loadingText,
        retryPagination,
    ]);

    const keyExtractor = useCallback(
        (item: Comment) => `comment-${item.id}`,
        [],
    );

    return (
        <View style={styles.base}>
            <ExtensionPoint
                name="comment.list.header"
                postId={postId}
                stats={stats}
                fallback={() => renderHeader()}
            />

            <FlatList
                data={topLevelComments}
                renderItem={renderComment}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor="#DB00FF"
                        colors={["#DB00FF"]}
                    />
                }
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.3}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
                contentContainerStyle={[
                    styles.container,
                    topLevelComments.length === 0 && { flex: 1 },
                ]}
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={10}
                initialNumToRender={8}
            />

            <ExtensionPoint
                name="comment.list.footer"
                postId={postId}
                canLoadMore={canLoadMore}
                hasMore={hasMore}
            />
        </View>
    );
};
