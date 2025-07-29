import { useCallback, useEffect, useMemo } from "react";
import { FlatList, ListRenderItem, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "@/core/theming/useStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { PostCard } from "./PostCard";
import {
    PaginationLoadingSkeleton,
    PostCardSkeleton,
    PostListSkeleton,
} from "./SkeletonComponents";
import {
    EmptyPostsState,
    NetworkError,
    PostListError,
    RefreshError,
} from "./ErrorComponents";
import { usePosts } from "../hooks/usePosts";
import { Post } from "../types";

interface PostListProps {
    variant?: "default" | "compact";
    userId?: string;
    emptyMessage?: string;
    prefetchThreshold?: number;
    autoRefresh?: boolean;
    autoRefreshInterval?: number;
}

export const PostList = ({
    variant = "default",
    userId,
    emptyMessage,
    prefetchThreshold = 3,
    autoRefresh = false,
    autoRefreshInterval,
}: PostListProps) => {
    const styles = useStyles("PostList", { variant });
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    const {
        posts,
        loading,
        refreshing,
        loadingMore,
        hasMore,
        error,
        paginationError,
        prefetching,
        refreshPosts,
        loadMorePosts,
        prefetchNextPage,
        retryPagination,
        retryInitialLoad,
        shouldPrefetch,
        isEmpty,
    } = usePosts({
        userId,
        prefetchThreshold,
        autoRefreshInterval: autoRefresh ? autoRefreshInterval : undefined,
    });

    const isNetworkError = useMemo(() => {
        return error?.includes("network") || error?.includes("offline") ||
            error?.includes("connection");
    }, [error]);

    const handleRefresh = useCallback(() => {
        refreshPosts();
    }, [refreshPosts]);

    const handleEndReached = useCallback(() => {
        if (hasMore && !loadingMore && !loading && !refreshing) {
            loadMorePosts();
        }
    }, [hasMore, loadingMore, loading, refreshing, loadMorePosts]);

    const handleViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            const lastVisibleIndex = viewableItems[viewableItems.length - 1]
                ?.index;
            if (
                typeof lastVisibleIndex === "number" &&
                shouldPrefetch(lastVisibleIndex)
            ) {
                prefetchNextPage();
            }
        }
    }, [shouldPrefetch, prefetchNextPage]);

    const renderPost: ListRenderItem<Post> = useCallback(
        ({ item, index }) => (
            <PostCard
                key={item.id}
                post={item}
                variant={variant}
                onPress={() => {
                    console.log("Post pressed:", item.id);
                }}
                onUserPress={() => {
                    console.log("User pressed:", item.user_id);
                }}
            />
        ),
        [variant],
    );

    const renderEmpty = useCallback(() => {
        if (loading) {
            return <PostListSkeleton count={5} />;
        }

        if (error) {
            return isNetworkError
                ? <NetworkError onRetry={retryInitialLoad} />
                : (
                    <PostListError
                        error={error}
                        onRetry={retryInitialLoad}
                        type="initial"
                    />
                );
        }

        if (isEmpty) {
            return <EmptyPostsState />;
        }

        return null;
    }, [loading, error, isEmpty, isNetworkError, retryInitialLoad]);

    const renderFooter = useCallback(() => {
        if (paginationError) {
            return (
                <PostListError
                    error={paginationError}
                    onRetry={retryPagination}
                    type="pagination"
                />
            );
        }

        if (loadingMore) {
            return <PaginationLoadingSkeleton />;
        }

        if (prefetching) {
            return (
                <View style={[styles.footerLoader, { opacity: 0.5 }]}>
                    <PostCardSkeleton variant={variant} />
                </View>
            );
        }

        return null;
    }, [
        paginationError,
        loadingMore,
        prefetching,
        styles.footerLoader,
        retryPagination,
        variant,
    ]);

    const renderHeader = useCallback(() => {
        if (error && !refreshing && posts.length > 0) {
            return <RefreshError onRetry={handleRefresh} />;
        }
        return null;
    }, [error, refreshing, posts.length, handleRefresh]);

    const keyExtractor = useCallback((item: Post) => `post-${item.id}`, []);

    const getItemLayout = useCallback((data: any, index: number) => ({
        length: 200,
        offset: 200 * index,
        index,
    }), []);

    return (
        <FlatList
            data={posts}
            renderItem={renderPost}
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
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 50,
                minimumViewTime: 300,
            }}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={[
                posts.length === 0 ? styles.emptyList : { flexGrow: 1 },
                { paddingBottom: insets.bottom + 70 },
            ]}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={8}
            getItemLayout={variant === "compact" ? getItemLayout : undefined}
            maintainVisibleContentPosition={{
                minIndexForVisible: 0,
                autoscrollToTopThreshold: 100,
            }}
        />
    );
};
