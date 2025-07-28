import { createSelector } from "@reduxjs/toolkit";
import { PostsState } from "../types";

interface RootState {
    posts: PostsState;
}

const selectPostsState = (state: RootState) => state.posts;

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

export const selectPostsError = createSelector(
    [selectPostsState],
    (postsState) => postsState.error,
);

export const selectHasMorePosts = createSelector(
    [selectPostsState],
    (postsState) => postsState.hasMore,
);

export const selectPostsPage = createSelector(
    [selectPostsState],
    (postsState) => postsState.page,
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
