import { createSelector } from "@reduxjs/toolkit";
import { Comment, CommentsState } from "../types";

interface RootState {
    comments?: CommentsState;
}

const defaultCommentsState: CommentsState = {
    commentsByPost: {},
    loadingByPost: {},
    refreshingByPost: {},
    loadingMoreByPost: {},
    errorByPost: {},
    paginationErrorByPost: {},
    hasMoreByPost: {},
    nextCursorByPost: {},
    loadingReplies: {},
    creating: false,
    createError: null,
};

// Base selector
const selectCommentsState = (state: RootState) =>
    state.comments || defaultCommentsState;

// Comments by post selectors
export const selectCommentsByPost = createSelector(
    [selectCommentsState, (_, postId: number) => postId],
    (commentsState, postId) => commentsState.commentsByPost[postId] || [],
);

export const selectTopLevelComments = createSelector(
    [selectCommentsByPost],
    (comments) => comments.filter((comment) => !comment.parent_comment_id),
);

export const selectCommentCount = createSelector(
    [selectCommentsByPost],
    (comments) => comments.length,
);

export const selectTopLevelCommentCount = createSelector(
    [selectTopLevelComments],
    (topLevelComments) => topLevelComments.length,
);

// Loading state selectors
export const selectCommentsLoading = createSelector(
    [selectCommentsState, (_, postId: number) => postId],
    (commentsState, postId) => commentsState.loadingByPost[postId] || false,
);

export const selectCommentsRefreshing = createSelector(
    [selectCommentsState, (_, postId: number) => postId],
    (commentsState, postId) => commentsState.refreshingByPost[postId] || false,
);

export const selectCommentsLoadingMore = createSelector(
    [selectCommentsState, (_, postId: number) => postId],
    (commentsState, postId) => commentsState.loadingMoreByPost[postId] || false,
);

export const selectRepliesLoading = createSelector(
    [selectCommentsState, (_, commentId: number) => commentId],
    (commentsState, commentId) =>
        commentsState.loadingReplies[commentId] || false,
);

export const selectCreatingComment = createSelector(
    [selectCommentsState],
    (commentsState) => commentsState.creating,
);

// Error state selectors
export const selectCommentsError = createSelector(
    [selectCommentsState, (_, postId: number) => postId],
    (commentsState, postId) => commentsState.errorByPost[postId],
);

export const selectCommentsPaginationError = createSelector(
    [selectCommentsState, (_, postId: number) => postId],
    (commentsState, postId) => commentsState.paginationErrorByPost[postId],
);

export const selectCreateCommentError = createSelector(
    [selectCommentsState],
    (commentsState) => commentsState.createError,
);

// Pagination selectors
export const selectCommentsHasMore = createSelector(
    [selectCommentsState, (_, postId: number) => postId],
    (commentsState, postId) => commentsState.hasMoreByPost[postId] ?? true,
);

export const selectCommentsNextCursor = createSelector(
    [selectCommentsState, (_, postId: number) => postId],
    (commentsState, postId) => commentsState.nextCursorByPost[postId],
);

// Individual comment selectors
export const selectCommentById = createSelector(
    [selectCommentsState, (_, commentId: number) => commentId],
    (commentsState, commentId) => {
        // Search through all posts to find the comment
        for (
            const postComments of Object.values(commentsState.commentsByPost)
        ) {
            const comment = findCommentInList(postComments, commentId);
            if (comment) return comment;
        }
        return null;
    },
);

export const selectRepliesForComment = createSelector(
    [selectCommentById],
    (comment) => comment?.replies || [],
);

// Combined state selectors
export const selectCommentsLoadingState = createSelector(
    [
        selectCommentsLoading,
        selectCommentsRefreshing,
        selectCommentsLoadingMore,
        selectCreatingComment,
    ],
    (loading, refreshing, loadingMore, creating) => ({
        loading,
        refreshing,
        loadingMore,
        creating,
        isLoading: loading || refreshing || loadingMore || creating,
    }),
);

export const selectCommentsWithErrors = createSelector(
    [
        selectCommentsError,
        selectCommentsPaginationError,
        selectCreateCommentError,
    ],
    (error, paginationError, createError) => ({
        error,
        paginationError,
        createError,
        hasError: !!(error || paginationError || createError),
    }),
);

// Threaded comments selector (with depth calculation)
export const selectThreadedComments = createSelector(
    [selectTopLevelComments, (_, __, maxDepth: number = 3) => maxDepth],
    (comments, maxDepth) => {
        return comments.map((comment) =>
            addDepthToComment(comment, 0, maxDepth)
        );
    },
);

// Comments statistics
export const selectCommentsStats = createSelector(
    [selectCommentsByPost],
    (comments) => {
        const totalComments = comments.length;
        const topLevelComments =
            comments.filter((c) => !c.parent_comment_id).length;
        const replies = totalComments - topLevelComments;

        return {
            total: totalComments,
            topLevel: topLevelComments,
            replies: replies,
        };
    },
);

// Check if comments are empty
export const selectCommentsEmpty = createSelector(
    [selectCommentsByPost, selectCommentsLoading, selectCommentsError],
    (comments, loading, error) => !loading && !error && comments.length === 0,
);

// Can load more comments
export const selectCanLoadMore = createSelector(
    [
        selectCommentsHasMore,
        selectCommentsLoadingMore,
        selectCommentsLoading,
        selectCommentsRefreshing,
    ],
    (hasMore, loadingMore, loading, refreshing) =>
        hasMore && !loadingMore && !loading && !refreshing,
);

// Helper functions
function findCommentInList(
    comments: Comment[],
    commentId: number,
): Comment | null {
    for (const comment of comments) {
        if (comment.id === commentId) {
            return comment;
        }
        if (comment.replies?.length) {
            const found = findCommentInList(comment.replies, commentId);
            if (found) return found;
        }
    }
    return null;
}

function addDepthToComment(
    comment: Comment,
    depth: number,
    maxDepth: number,
): Comment {
    const commentWithDepth = {
        ...comment,
        depth,
    };

    if (comment.replies?.length && depth < maxDepth) {
        commentWithDepth.replies = comment.replies.map((reply) =>
            addDepthToComment(reply, depth + 1, maxDepth)
        );
    } else if (depth >= maxDepth) {
        // Remove replies if we've reached max depth
        commentWithDepth.replies = [];
    }

    return commentWithDepth;
}
