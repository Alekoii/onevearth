import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useEnhancedPlugins } from "@/core/plugins/PluginProvider";
import { CommentService } from "../services/CommentService";
import {
    selectCanLoadMore,
    selectCommentsByPost,
    selectCommentsEmpty,
    selectCommentsError,
    selectCommentsHasMore,
    selectCommentsLoading,
    selectCommentsLoadingMore,
    selectCommentsNextCursor,
    selectCommentsPaginationError,
    selectCommentsRefreshing,
    selectCommentsStats,
    selectCreateCommentError,
    selectCreatingComment,
    selectTopLevelComments,
} from "../store/selectors";
import {
    addComment,
    appendComments,
    clearCommentsForPost,
    clearErrors,
    setComments,
    setCreateError,
    setCreating,
    setError,
    setLoading,
    setLoadingMore,
    setPaginationError,
    setRefreshing,
} from "../store/commentsSlice";
import { Comment, CreateCommentData, UseCommentsOptions } from "../types";

export const useComments = (options: UseCommentsOptions) => {
    const { postId, autoRefresh = false, maxDepth = 3 } = options;
    const { pluginManager } = useEnhancedPlugins();

    // Redux selectors
    const comments =
        useSelector((state) => selectCommentsByPost(state, postId)) || [];
    const topLevelComments =
        useSelector((state) => selectTopLevelComments(state, postId)) || [];
    const loading =
        useSelector((state) => selectCommentsLoading(state, postId)) || false;
    const refreshing =
        useSelector((state) => selectCommentsRefreshing(state, postId)) ||
        false;
    const loadingMore =
        useSelector((state) => selectCommentsLoadingMore(state, postId)) ||
        false;
    const hasMore =
        useSelector((state) => selectCommentsHasMore(state, postId)) ?? true;
    const error = useSelector((state) => selectCommentsError(state, postId)) ||
        null;
    const paginationError =
        useSelector((state) => selectCommentsPaginationError(state, postId)) ||
        null;
    const nextCursor = useSelector((state) =>
        selectCommentsNextCursor(state, postId)
    );
    const creating = useSelector(selectCreatingComment) || false;
    const createError = useSelector(selectCreateCommentError) || null;
    const canLoadMore =
        useSelector((state) => selectCanLoadMore(state, postId)) || false;
    const isEmpty =
        useSelector((state) => selectCommentsEmpty(state, postId)) || false;
    const stats = useSelector((state) => selectCommentsStats(state, postId));

    const store = pluginManager.getStore();

    /**
     * Load comments for the post
     */
    const loadComments = useCallback(async (refresh = false) => {
        if (!store) return;

        try {
            store.dispatch(
                refresh
                    ? setRefreshing({ postId, refreshing: true })
                    : setLoading({ postId, loading: true }),
            );
            store.dispatch(clearErrors());

            const cursor = refresh ? undefined : nextCursor;
            const result = await CommentService.fetchComments(
                postId,
                cursor || undefined,
            );

            if (refresh) {
                store.dispatch(setComments({ postId, result }));
            } else {
                store.dispatch(appendComments({ postId, result }));
            }
        } catch (err) {
            const errorMessage = (err as Error).message;
            if (refresh || !comments.length) {
                store.dispatch(setError({ postId, error: errorMessage }));
            } else {
                store.dispatch(
                    setPaginationError({ postId, error: errorMessage }),
                );
            }
        } finally {
            store.dispatch(setLoading({ postId, loading: false }));
            store.dispatch(setRefreshing({ postId, refreshing: false }));
        }
    }, [store, postId, nextCursor, comments.length]);

    /**
     * Load more comments (pagination)
     */
    const loadMoreComments = useCallback(async () => {
        if (!store || !canLoadMore || !nextCursor) return;

        try {
            store.dispatch(setLoadingMore({ postId, loading: true }));
            store.dispatch(clearErrors());

            const result = await CommentService.fetchComments(
                postId,
                nextCursor,
            );
            store.dispatch(appendComments({ postId, result }));
        } catch (err) {
            store.dispatch(
                setPaginationError({ postId, error: (err as Error).message }),
            );
        } finally {
            store.dispatch(setLoadingMore({ postId, loading: false }));
        }
    }, [store, postId, canLoadMore, nextCursor]);

    /**
     * Create a new comment
     */
    const createComment = useCallback(
        async (commentData: CreateCommentData): Promise<Comment> => {
            if (!store) {
                throw new Error("Store not available for comment creation");
            }

            try {
                store.dispatch(setCreating(true));
                store.dispatch(clearErrors());

                const newComment = await CommentService.createComment(
                    commentData,
                );
                store.dispatch(addComment(newComment));

                return newComment;
            } catch (error) {
                store.dispatch(setCreateError((error as Error).message));
                throw error;
            } finally {
                store.dispatch(setCreating(false));
            }
        },
        [store],
    );

    /**
     * Refresh comments
     */
    const refreshComments = useCallback(() => {
        loadComments(true);
    }, [loadComments]);

    /**
     * Retry pagination after error
     */
    const retryPagination = useCallback(() => {
        if (paginationError) {
            loadMoreComments();
        }
    }, [paginationError, loadMoreComments]);

    /**
     * Retry initial load after error
     */
    const retryInitialLoad = useCallback(() => {
        if (error) {
            loadComments(true);
        }
    }, [error, loadComments]);

    /**
     * Clear comments for this post
     */
    const clearComments = useCallback(() => {
        if (!store) return;
        store.dispatch(clearCommentsForPost(postId));
    }, [store, postId]);

    /**
     * Create a reply to a comment
     */
    const createReply = useCallback(
        async (parentCommentId: number, content: string): Promise<Comment> => {
            return createComment({
                post_id: postId,
                content,
                parent_comment_id: parentCommentId,
            });
        },
        [createComment, postId],
    );

    // Auto-load comments on mount if empty
    useEffect(() => {
        if (comments.length === 0 && !loading && !error) {
            loadComments(true);
        }
    }, [comments.length, loading, error, loadComments]);

    // Auto-refresh functionality
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            if (!loading && !refreshing && !loadingMore) {
                refreshComments();
            }
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, [autoRefresh, loading, refreshing, loadingMore, refreshComments]);

    return {
        // Data
        comments,
        topLevelComments,
        stats,

        // Loading states
        loading,
        refreshing,
        loadingMore,
        creating,
        hasMore,
        isEmpty,
        canLoadMore,

        // Error states
        error,
        paginationError,
        createError,

        // Actions
        loadComments,
        loadMoreComments,
        refreshComments,
        createComment,
        createReply,
        clearComments,

        // Retry actions
        retryPagination,
        retryInitialLoad,

        // Configuration
        maxDepth,
        postId,
    };
};
