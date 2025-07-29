import { createSelector } from "@reduxjs/toolkit";
import { PostsState } from "../types";

interface RootState {
    posts?: PostsState;
}

const defaultPostsState: PostsState = {
    items: [],
    loading: false,
    refreshing: false,
    loadingMore: false,
    error: null,
    paginationError: null,
    hasMore: true,
    nextCursor: null,
    lastRefresh: null,
    prefetching: false,
};

const selectPostsState = (state: RootState) => state.posts || defaultPostsState;

export const selectPosts = createSelector(
    [selectPostsState],
    (postsState) => postsState.items,
);

export const selectPostsLoading = createSelector(
    [selectPostsState],
    (postsState) => postsState.loading,
);

export const selectPostsRefreshing = createSelector(
    [selectPostsState],
    (postsState) => postsState.refreshing,
);

export const selectLoadingMore = createSelector(
    [selectPostsState],
    (postsState) => postsState.loadingMore,
);

export const selectPostsError = createSelector(
    [selectPostsState],
    (postsState) => postsState.error,
);

export const selectPaginationError = createSelector(
    [selectPostsState],
    (postsState) => postsState.paginationError,
);

export const selectHasMorePosts = createSelector(
    [selectPostsState],
    (postsState) => postsState.hasMore,
);

export const selectNextCursor = createSelector(
    [selectPostsState],
    (postsState) => postsState.nextCursor,
);

export const selectLastRefresh = createSelector(
    [selectPostsState],
    (postsState) => postsState.lastRefresh,
);

export const selectPrefetching = createSelector(
    [selectPostsState],
    (postsState) => postsState.prefetching,
);

export const selectPostById = createSelector(
    [selectPosts, (_, postId: number) => postId],
    (posts, postId) => posts.find((post) => post.id === postId),
);

export const selectPostsByUser = createSelector(
    [selectPosts, (_, userId: string) => userId],
    (posts, userId) => posts.filter((post) => post.user_id === userId),
);

export const selectPublicPosts = createSelector(
    [selectPosts],
    (posts) => posts.filter((post) => post.visibility === "public"),
);

export const selectPostsWithMedia = createSelector(
    [selectPosts],
    (posts) =>
        posts.filter((post) =>
            post.media_attachments && post.media_attachments.length > 0
        ),
);

export const selectIsLoading = createSelector(
    [selectPostsLoading, selectPostsRefreshing, selectLoadingMore],
    (loading, refreshing, loadingMore) => loading || refreshing || loadingMore,
);

export const selectHasError = createSelector(
    [selectPostsError, selectPaginationError],
    (error, paginationError) => !!(error || paginationError),
);

export const selectLoadingState = createSelector(
    [
        selectPostsLoading,
        selectPostsRefreshing,
        selectLoadingMore,
        selectPrefetching,
    ],
    (loading, refreshing, loadingMore, prefetching) => ({
        initial: loading,
        refresh: refreshing,
        pagination: loadingMore,
        prefetch: prefetching,
    }),
);

export const selectPaginationMeta = createSelector(
    [selectPostsState],
    (postsState) => ({
        hasMore: postsState.hasMore,
        nextCursor: postsState.nextCursor,
        lastRefresh: postsState.lastRefresh,
        total: postsState.items.length,
    }),
);

export const selectCanLoadMore = createSelector(
    [
        selectHasMorePosts,
        selectLoadingMore,
        selectPostsLoading,
        selectPostsRefreshing,
    ],
    (hasMore, loadingMore, loading, refreshing) =>
        hasMore && !loadingMore && !loading && !refreshing,
);

export const selectIsEmpty = createSelector(
    [selectPosts, selectPostsLoading, selectPostsError],
    (posts, loading, error) => !loading && !error && posts.length === 0,
);

export const selectRecentPosts = createSelector(
    [selectPosts],
    (posts) => {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return posts.filter((post) => new Date(post.created_at) > oneHourAgo);
    },
);

export const selectPostsStats = createSelector(
    [selectPosts],
    (posts) => ({
        total: posts.length,
        withMedia: posts.filter((p) => p.media_attachments?.length).length,
        public: posts.filter((p) => p.visibility === "public").length,
        private: posts.filter((p) => p.visibility === "private").length,
        group: posts.filter((p) => p.visibility === "group").length,
    }),
);
