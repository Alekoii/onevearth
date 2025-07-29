import { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useEnhancedPlugins } from "@/core/plugins/PluginProvider";
import { PostService } from "../services/PostService";
import {
    selectHasMorePosts,
    selectLoadingMore,
    selectNextCursor,
    selectPaginationError,
    selectPosts,
    selectPostsError,
    selectPostsLoading,
    selectPostsRefreshing,
    selectPrefetching,
} from "../store/selectors";
import {
    addPost,
    appendPosts,
    clearErrors,
    optimisticAddPost,
    prefetchComplete,
    resetPosts,
    setError,
    setLoading,
    setLoadingMore,
    setPaginationError,
    setPosts,
    setPrefetching,
    setRefreshing,
} from "../store/postsSlice";
import { CreatePostData, Post } from "../types";

interface UsePostsOptions {
    userId?: string;
    prefetchThreshold?: number;
    autoRefreshInterval?: number;
}

export const usePosts = (options: UsePostsOptions = {}) => {
    const { userId, prefetchThreshold = 3, autoRefreshInterval } = options;
    const { pluginManager } = useEnhancedPlugins();

    const posts = useSelector(selectPosts) || [];
    const loading = useSelector(selectPostsLoading) || false;
    const refreshing = useSelector(selectPostsRefreshing) || false;
    const loadingMore = useSelector(selectLoadingMore) || false;
    const hasMore = useSelector(selectHasMorePosts) ?? true;
    const error = useSelector(selectPostsError) || null;
    const paginationError = useSelector(selectPaginationError) || null;
    const nextCursor = useSelector(selectNextCursor);
    const prefetching = useSelector(selectPrefetching) || false;

    const store = pluginManager.getStore();
    const isLoadingRef = useRef(false);
    const prefetchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const clearPrefetchTimeout = useCallback(() => {
        if (prefetchTimeoutRef.current) {
            clearTimeout(prefetchTimeoutRef.current);
            prefetchTimeoutRef.current = undefined;
        }
    }, []);

    const loadPosts = useCallback(async (refresh = false) => {
        if (!store || isLoadingRef.current) return;

        try {
            isLoadingRef.current = true;
            store.dispatch(refresh ? setRefreshing(true) : setLoading(true));
            store.dispatch(clearErrors());

            const cursor = refresh ? undefined : nextCursor;
            const result = userId
                ? await PostService.fetchUserPosts(userId, cursor || undefined)
                : await PostService.fetchPosts(cursor || undefined);

            if (refresh) {
                store.dispatch(setPosts(result));
            } else {
                store.dispatch(appendPosts(result));
            }
        } catch (err) {
            const errorMessage = (err as Error).message;
            if (refresh || !posts.length) {
                store.dispatch(setError(errorMessage));
            } else {
                store.dispatch(setPaginationError(errorMessage));
            }
        } finally {
            store.dispatch(setLoading(false));
            store.dispatch(setRefreshing(false));
            isLoadingRef.current = false;
        }
    }, [store, userId, nextCursor, posts.length]);

    const loadMorePosts = useCallback(async () => {
        if (
            !store || !hasMore || loadingMore || loading || refreshing ||
            !nextCursor
        ) {
            return;
        }

        try {
            store.dispatch(setLoadingMore(true));
            store.dispatch(clearErrors());

            const result = userId
                ? await PostService.fetchUserPosts(userId, nextCursor)
                : await PostService.fetchPosts(nextCursor);

            store.dispatch(appendPosts(result));
        } catch (err) {
            store.dispatch(setPaginationError((err as Error).message));
        } finally {
            store.dispatch(setLoadingMore(false));
        }
    }, [store, hasMore, loadingMore, loading, refreshing, nextCursor, userId]);

    const prefetchNextPage = useCallback(async () => {
        if (!store || !hasMore || prefetching || !nextCursor) return;

        clearPrefetchTimeout();
        prefetchTimeoutRef.current = setTimeout(async () => {
            try {
                store.dispatch(setPrefetching(true));

                const result = userId
                    ? await PostService.fetchUserPosts(userId, nextCursor)
                    : await PostService.fetchPosts(nextCursor);

                store.dispatch(prefetchComplete(result));
            } catch (err) {
                store.dispatch(setPrefetching(false));
            }
        }, 500);
    }, [store, hasMore, prefetching, nextCursor, userId, clearPrefetchTimeout]);

    const createPost = useCallback(
        async (postData: CreatePostData, optimistic = false): Promise<Post> => {
            if (!store) {
                throw new Error("Store not available for post creation");
            }

            if (optimistic) {
                store.dispatch(optimisticAddPost({
                    content: postData.content,
                    user_id: "",
                    emotion_id: postData.emotion_id || null,
                    available_actions: null,
                    created_at: new Date().toISOString(),
                    visibility: postData.visibility || "public",
                    group_id: postData.group_id || null,
                }));
            }

            try {
                const newPost = await PostService.createPost(postData);
                store.dispatch(addPost(newPost));
                return newPost;
            } catch (error) {
                if (optimistic) {
                    await loadPosts(true);
                }
                throw error;
            }
        },
        [store, loadPosts],
    );

    const refreshPosts = useCallback(() => {
        clearPrefetchTimeout();
        loadPosts(true);
    }, [loadPosts, clearPrefetchTimeout]);

    const retryPagination = useCallback(() => {
        if (paginationError) {
            loadMorePosts();
        }
    }, [paginationError, loadMorePosts]);

    const retryInitialLoad = useCallback(() => {
        if (error) {
            loadPosts(true);
        }
    }, [error, loadPosts]);

    const reset = useCallback(() => {
        if (!store) return;
        clearPrefetchTimeout();
        store.dispatch(resetPosts());
    }, [store, clearPrefetchTimeout]);

    const shouldPrefetch = useCallback((currentIndex: number) => {
        return hasMore && !prefetching && !loadingMore &&
            posts.length - currentIndex <= prefetchThreshold;
    }, [hasMore, prefetching, loadingMore, posts.length, prefetchThreshold]);

    useEffect(() => {
        if (posts.length === 0 && !loading && !error) {
            loadPosts(true);
        }
    }, [posts.length, loading, error, loadPosts]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (autoRefreshInterval && autoRefreshInterval > 0) {
            interval = setInterval(() => {
                if (!loading && !refreshing && !loadingMore) {
                    refreshPosts();
                }
            }, autoRefreshInterval);
        }

        return () => {
            if (interval) clearInterval(interval);
            clearPrefetchTimeout();
        };
    }, [
        autoRefreshInterval,
        loading,
        refreshing,
        loadingMore,
        refreshPosts,
        clearPrefetchTimeout,
    ]);

    return {
        posts,
        loading,
        refreshing,
        loadingMore,
        hasMore,
        error,
        paginationError,
        prefetching,
        createPost,
        refreshPosts,
        loadMorePosts,
        prefetchNextPage,
        retryPagination,
        retryInitialLoad,
        reset,
        shouldPrefetch,
        isEmpty: !loading && !error && posts.length === 0,
        isStale: false,
    };
};
