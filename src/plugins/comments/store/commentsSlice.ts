import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Comment, CommentsState, PaginationResult } from "../types";

const initialState: CommentsState = {
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

const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        // Loading states for fetching comments
        setLoading: (
            state,
            action: PayloadAction<{ postId: number; loading: boolean }>,
        ) => {
            const { postId, loading } = action.payload;
            state.loadingByPost[postId] = loading;
            if (loading) {
                state.errorByPost[postId] = null;
            }
        },

        setRefreshing: (
            state,
            action: PayloadAction<{ postId: number; refreshing: boolean }>,
        ) => {
            const { postId, refreshing } = action.payload;
            state.refreshingByPost[postId] = refreshing;
            if (refreshing) {
                state.errorByPost[postId] = null;
                state.paginationErrorByPost[postId] = null;
            }
        },

        setLoadingMore: (
            state,
            action: PayloadAction<{ postId: number; loading: boolean }>,
        ) => {
            const { postId, loading } = action.payload;
            state.loadingMoreByPost[postId] = loading;
            if (loading) {
                state.paginationErrorByPost[postId] = null;
            }
        },

        // Loading states for replies
        setLoadingReplies: (
            state,
            action: PayloadAction<{ commentId: number; loading: boolean }>,
        ) => {
            const { commentId, loading } = action.payload;
            state.loadingReplies[commentId] = loading;
        },

        // Error states
        setError: (
            state,
            action: PayloadAction<{ postId: number; error: string | null }>,
        ) => {
            const { postId, error } = action.payload;
            state.errorByPost[postId] = error;
            state.loadingByPost[postId] = false;
            state.refreshingByPost[postId] = false;
        },

        setPaginationError: (
            state,
            action: PayloadAction<{ postId: number; error: string | null }>,
        ) => {
            const { postId, error } = action.payload;
            state.paginationErrorByPost[postId] = error;
            state.loadingMoreByPost[postId] = false;
        },

        // Set comments for a post (initial load or refresh)
        setComments: (
            state,
            action: PayloadAction<
                { postId: number; result: PaginationResult<Comment> }
            >,
        ) => {
            const { postId, result } = action.payload;
            const { items, hasMore, nextCursor } = result;

            state.commentsByPost[postId] = items;
            state.hasMoreByPost[postId] = hasMore;
            state.nextCursorByPost[postId] = nextCursor;
            state.errorByPost[postId] = null;
            state.paginationErrorByPost[postId] = null;
        },

        // Append comments (pagination)
        appendComments: (
            state,
            action: PayloadAction<
                { postId: number; result: PaginationResult<Comment> }
            >,
        ) => {
            const { postId, result } = action.payload;
            const { items, hasMore, nextCursor } = result;

            const existingComments = state.commentsByPost[postId] || [];
            const existingIds = new Set(
                existingComments.map((comment) => comment.id),
            );
            const newComments = items.filter((comment) =>
                !existingIds.has(comment.id)
            );

            state.commentsByPost[postId] = [
                ...existingComments,
                ...newComments,
            ];
            state.hasMoreByPost[postId] = hasMore;
            state.nextCursorByPost[postId] = nextCursor;
            state.paginationErrorByPost[postId] = null;
        },

        // Add a new comment (from creation)
        addComment: (state, action: PayloadAction<Comment>) => {
            const comment = action.payload;
            const postId = comment.post_id;

            // If it's a top-level comment, add to the post's comments
            if (!comment.parent_comment_id) {
                const existingComments = state.commentsByPost[postId] || [];
                state.commentsByPost[postId] = [...existingComments, comment];
            } else {
                // If it's a reply, find the parent comment and add it
                const comments = state.commentsByPost[postId] || [];
                const updatedComments = addReplyToComments(comments, comment);
                state.commentsByPost[postId] = updatedComments;
            }
        },

        // Update an existing comment
        updateComment: (state, action: PayloadAction<Comment>) => {
            const updatedComment = action.payload;
            const postId = updatedComment.post_id;

            const comments = state.commentsByPost[postId] || [];
            const updatedComments = updateCommentInList(
                comments,
                updatedComment,
            );
            state.commentsByPost[postId] = updatedComments;
        },

        // Remove a comment
        removeComment: (
            state,
            action: PayloadAction<{ postId: number; commentId: number }>,
        ) => {
            const { postId, commentId } = action.payload;

            const comments = state.commentsByPost[postId] || [];
            const filteredComments = removeCommentFromList(comments, commentId);
            state.commentsByPost[postId] = filteredComments;
        },

        // Add replies to a comment
        addReplies: (
            state,
            action: PayloadAction<{ parentId: number; replies: Comment[] }>,
        ) => {
            const { parentId, replies } = action.payload;

            // Find which post contains this comment and update it
            for (const postId in state.commentsByPost) {
                const comments = state.commentsByPost[postId];
                const updatedComments = addRepliesToComment(
                    comments,
                    parentId,
                    replies,
                );
                if (updatedComments !== comments) {
                    state.commentsByPost[postId] = updatedComments;
                    break;
                }
            }
        },

        // Creating comment states
        setCreating: (state, action: PayloadAction<boolean>) => {
            state.creating = action.payload;
            if (action.payload) {
                state.createError = null;
            }
        },

        setCreateError: (state, action: PayloadAction<string | null>) => {
            state.createError = action.payload;
            state.creating = false;
        },

        // Clear comments for a post
        clearCommentsForPost: (state, action: PayloadAction<number>) => {
            const postId = action.payload;
            delete state.commentsByPost[postId];
            delete state.loadingByPost[postId];
            delete state.refreshingByPost[postId];
            delete state.loadingMoreByPost[postId];
            delete state.errorByPost[postId];
            delete state.paginationErrorByPost[postId];
            delete state.hasMoreByPost[postId];
            delete state.nextCursorByPost[postId];
        },

        // Clear all errors
        clearErrors: (state) => {
            state.errorByPost = {};
            state.paginationErrorByPost = {};
            state.createError = null;
        },
    },
});

// Helper functions for managing nested comments
function addReplyToComments(comments: Comment[], reply: Comment): Comment[] {
    return comments.map((comment) => {
        if (comment.id === reply.parent_comment_id) {
            return {
                ...comment,
                replies: [...(comment.replies || []), reply],
            };
        }
        if (comment.replies?.length) {
            return {
                ...comment,
                replies: addReplyToComments(comment.replies, reply),
            };
        }
        return comment;
    });
}

function updateCommentInList(
    comments: Comment[],
    updatedComment: Comment,
): Comment[] {
    return comments.map((comment) => {
        if (comment.id === updatedComment.id) {
            return updatedComment;
        }
        if (comment.replies?.length) {
            return {
                ...comment,
                replies: updateCommentInList(comment.replies, updatedComment),
            };
        }
        return comment;
    });
}

function removeCommentFromList(
    comments: Comment[],
    commentId: number,
): Comment[] {
    return comments
        .filter((comment) => comment.id !== commentId)
        .map((comment) => {
            if (comment.replies?.length) {
                return {
                    ...comment,
                    replies: removeCommentFromList(comment.replies, commentId),
                };
            }
            return comment;
        });
}

function addRepliesToComment(
    comments: Comment[],
    parentId: number,
    replies: Comment[],
): Comment[] {
    return comments.map((comment) => {
        if (comment.id === parentId) {
            return {
                ...comment,
                replies: [...(comment.replies || []), ...replies],
            };
        }
        if (comment.replies?.length) {
            return {
                ...comment,
                replies: addRepliesToComment(
                    comment.replies,
                    parentId,
                    replies,
                ),
            };
        }
        return comment;
    });
}

export const {
    setLoading,
    setRefreshing,
    setLoadingMore,
    setLoadingReplies,
    setError,
    setPaginationError,
    setComments,
    appendComments,
    addComment,
    updateComment,
    removeComment,
    addReplies,
    setCreating,
    setCreateError,
    clearCommentsForPost,
    clearErrors,
} = commentsSlice.actions;

export default commentsSlice.reducer;
