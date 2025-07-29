import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaginationResult, Post, PostsState } from "../types";

const initialState: PostsState = {
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

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
            if (action.payload) {
                state.error = null;
            }
        },

        setRefreshing: (state, action: PayloadAction<boolean>) => {
            state.refreshing = action.payload;
            if (action.payload) {
                state.error = null;
                state.paginationError = null;
            }
        },

        setLoadingMore: (state, action: PayloadAction<boolean>) => {
            state.loadingMore = action.payload;
            if (action.payload) {
                state.paginationError = null;
            }
        },

        setPrefetching: (state, action: PayloadAction<boolean>) => {
            state.prefetching = action.payload;
        },

        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
            state.refreshing = false;
        },

        setPaginationError: (state, action: PayloadAction<string | null>) => {
            state.paginationError = action.payload;
            state.loadingMore = false;
        },

        setPosts: (state, action: PayloadAction<PaginationResult<Post>>) => {
            const { items, hasMore, nextCursor } = action.payload;
            state.items = items;
            state.hasMore = hasMore;
            state.nextCursor = nextCursor;
            state.lastRefresh = Date.now();
            state.error = null;
            state.paginationError = null;
        },

        appendPosts: (state, action: PayloadAction<PaginationResult<Post>>) => {
            const { items, hasMore, nextCursor } = action.payload;

            const existingIds = new Set(state.items.map((post) => post.id));
            const newPosts = items.filter((post) => !existingIds.has(post.id));

            state.items.push(...newPosts);
            state.hasMore = hasMore;
            state.nextCursor = nextCursor;
            state.paginationError = null;
        },

        addPost: (state, action: PayloadAction<Post>) => {
            const existingIndex = state.items.findIndex(
                (post) => post.id === action.payload.id,
            );

            if (existingIndex >= 0) {
                state.items[existingIndex] = action.payload;
            } else {
                state.items.unshift(action.payload);
            }
        },

        updatePost: (state, action: PayloadAction<Post>) => {
            const index = state.items.findIndex(
                (post) => post.id === action.payload.id,
            );
            if (index >= 0) {
                state.items[index] = action.payload;
            }
        },

        removePost: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((post) =>
                post.id !== action.payload
            );
        },

        optimisticAddPost: (state, action: PayloadAction<Omit<Post, "id">>) => {
            const optimisticPost: Post = {
                ...action.payload,
                id: Date.now(),
                created_at: new Date().toISOString(),
            };
            state.items.unshift(optimisticPost);
        },

        resetPosts: (state) => {
            Object.assign(state, initialState);
        },

        clearErrors: (state) => {
            state.error = null;
            state.paginationError = null;
        },

        markStale: (state) => {
            const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
            if (!state.lastRefresh || state.lastRefresh < fiveMinutesAgo) {
                state.hasMore = true;
                state.nextCursor = null;
            }
        },

        prefetchComplete: (
            state,
            action: PayloadAction<PaginationResult<Post>>,
        ) => {
            if (state.prefetching) {
                const { items, hasMore, nextCursor } = action.payload;
                const existingIds = new Set(state.items.map((post) => post.id));
                const newPosts = items.filter((post) =>
                    !existingIds.has(post.id)
                );

                state.items.push(...newPosts);
                state.hasMore = hasMore;
                state.nextCursor = nextCursor;
                state.prefetching = false;
            }
        },
    },
});

export const {
    setLoading,
    setRefreshing,
    setLoadingMore,
    setPrefetching,
    setError,
    setPaginationError,
    setPosts,
    appendPosts,
    addPost,
    updatePost,
    removePost,
    optimisticAddPost,
    resetPosts,
    clearErrors,
    markStale,
    prefetchComplete,
} = postsSlice.actions;

export default postsSlice.reducer;
