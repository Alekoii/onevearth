import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "@/types/posts";

interface PostsState {
    items: Post[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    page: number;
}

const initialState: PostsState = {
    items: [],
    loading: false,
    error: null,
    hasMore: true,
    page: 0,
};

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setPosts: (state, action: PayloadAction<Post[]>) => {
            state.items = action.payload;
        },
        addPost: (state, action: PayloadAction<Post>) => {
            state.items.unshift(action.payload);
        },
        updatePost: (
            state,
            action: PayloadAction<{ id: string; updates: Partial<Post> }>,
        ) => {
            const index = state.items.findIndex((post) =>
                post.id === action.payload.id
            );
            if (index !== -1) {
                state.items[index] = {
                    ...state.items[index],
                    ...action.payload.updates,
                };
            }
        },
        removePost: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((post) =>
                post.id !== action.payload
            );
        },
        appendPosts: (state, action: PayloadAction<Post[]>) => {
            state.items.push(...action.payload);
            state.page += 1;
        },
        setHasMore: (state, action: PayloadAction<boolean>) => {
            state.hasMore = action.payload;
        },
        incrementLikes: (state, action: PayloadAction<string>) => {
            const post = state.items.find((p) => p.id === action.payload);
            if (post) {
                post.likeCount += 1;
            }
        },
        incrementComments: (state, action: PayloadAction<string>) => {
            const post = state.items.find((p) => p.id === action.payload);
            if (post) {
                post.commentCount += 1;
            }
        },
    },
});

export const {
    setLoading,
    setError,
    setPosts,
    addPost,
    updatePost,
    removePost,
    appendPosts,
    setHasMore,
    incrementLikes,
    incrementComments,
} = postsSlice.actions;

export default postsSlice.reducer;
