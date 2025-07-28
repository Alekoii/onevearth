import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useEnhancedPlugins } from "@/core/plugins/PluginProvider";
import { PostService } from "../services/PostService";
import {
    selectHasMorePosts,
    selectPosts,
    selectPostsError,
    selectPostsLoading,
    selectPostsRefreshing,
} from "../store/selectors";
import {
    addPost,
    appendPosts,
    setError,
    setLoading,
    setPosts,
    setRefreshing,
} from "../store/postsSlice";
import { CreatePostData, Post } from "../types";

export const usePosts = () => {
    const { pluginManager } = useEnhancedPlugins();
    const store = pluginManager.pluginManager.getStore();

    const posts = useSelector(selectPosts);
    const loading = useSelector(selectPostsLoading);
    const refreshing = useSelector(selectPostsRefreshing);
    const hasMore = useSelector(selectHasMorePosts);
    const error = useSelector(selectPostsError);

    const loadPosts = useCallback(async (refresh = false) => {
        try {
            store.dispatch(refresh ? setRefreshing(true) : setLoading(true));

            const page = refresh ? 0 : Math.floor(posts.length / 20);
            const newPosts = await PostService.fetchPosts(page);

            if (refresh) {
                store.dispatch(setPosts(newPosts));
            } else {
                store.dispatch(appendPosts(newPosts));
            }
        } catch (err) {
            store.dispatch(setError((err as Error).message));
        } finally {
            store.dispatch(setLoading(false));
            store.dispatch(setRefreshing(false));
        }
    }, [posts.length, store]);

    const createPost = useCallback(
        async (postData: CreatePostData): Promise<Post> => {
            const newPost = await PostService.createPost(postData);
            store.dispatch(addPost(newPost));
            return newPost;
        },
        [store],
    );

    const refreshPosts = useCallback(() => {
        loadPosts(true);
    }, [loadPosts]);

    const loadMorePosts = useCallback(() => {
        if (!loading && hasMore) {
            loadPosts(false);
        }
    }, [loading, hasMore, loadPosts]);

    return {
        posts,
        loading,
        refreshing,
        hasMore,
        error,
        loadPosts,
        createPost,
        refreshPosts,
        loadMorePosts,
    };
};
