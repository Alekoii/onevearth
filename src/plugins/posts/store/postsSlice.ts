import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post, PostsState } from "../types";

const initialState: PostsState = {
    items: [],
    loading: false,
    error: null,
    hasMore: true,
    page: 0,
    refreshing: false,
};

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        setRefreshing: (state, action: PayloadAction<boolean>) => {
            state.refreshing = action.payload;
        },

        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        setPosts: (state, action: PayloadAction<Post[]>) => {
            state.items = action.payload;
            state.page = 0;
            state.error = null;
        },

        appendPosts: (state, action: PayloadAction<Post[]>) => {
            const newPosts = action.payload.filter(
                (newPost) =>
                    !state.items.some((post) => post.id === newPost.id),
            );
            state.items.push(...newPosts);
            state.page += 1;
            state.hasMore = action.payload.length === 20;
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
            state.items = state.items.filter(
                (post) => post.id !== action.payload,
            );
        },

        setHasMore: (state, action: PayloadAction<boolean>) => {
            state.hasMore = action.payload;
        },

        incrementPage: (state) => {
            state.page += 1;
        },

        resetPosts: (state) => {
            state.items = [];
            state.page = 0;
            state.hasMore = true;
            state.error = null;
        },
    },
});

export const {
    setLoading,
    setRefreshing,
    setError,
    setPosts,
    appendPosts,
    addPost,
    updatePost,
    removePost,
    setHasMore,
    incrementPage,
    resetPosts,
} = postsSlice.actions;

export default postsSlice.reducer;
