import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
    addPost,
    appendPosts,
    setError,
    setHasMore,
    setLoading,
    setPosts,
} from "@/store/slices/postsSlice";
import { PostService } from "@/services/PostService";
import { CreatePostData } from "@/types/posts";

export const usePosts = () => {
    const dispatch = useAppDispatch();
    const { items: posts, loading, hasMore, page } = useAppSelector((state) =>
        state.posts
    );

    const loadPosts = async (refresh = false) => {
        dispatch(setLoading(true));
        try {
            const currentPage = refresh ? 0 : page;
            const newPosts = await PostService.fetchPosts(currentPage);

            const validPosts = (newPosts || []).filter((post) =>
                post && post.id
            );

            if (refresh) {
                dispatch(setPosts(validPosts));
            } else {
                dispatch(appendPosts(validPosts));
            }

            dispatch(setHasMore(validPosts.length === 20));
        } catch (err) {
            const error = err as Error;
            dispatch(setError(error.message));
            console.error("Failed to load posts:", error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const createPost = async (postData: CreatePostData) => {
        try {
            const newPost = await PostService.createPost(postData);
            if (newPost && newPost.id) {
                dispatch(addPost(newPost));
            }
            return newPost;
        } catch (err) {
            const error = err as Error;
            dispatch(setError(error.message));
            throw error;
        }
    };

    const refreshPosts = () => loadPosts(true);
    const loadMorePosts = () => hasMore && !loading && loadPosts(false);

    useEffect(() => {
        loadPosts(true);
    }, []);

    return {
        posts: posts || [],
        loading,
        hasMore,
        createPost,
        refreshPosts,
        loadMorePosts,
    };
};
