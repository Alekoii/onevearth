import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Comment {
    id: string;
    postId: string;
    userId: string;
    content: string;
    parentCommentId?: string;
    createdAt: string;
    updatedAt: string;
    likeCount: number;
    replyCount: number;
}

interface CommentsState {
    items: Record<string, Comment[]>;
    loading: boolean;
    error: string | null;
}

const initialState: CommentsState = {
    items: {},
    loading: false,
    error: null,
};

const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setComments: (
            state,
            action: PayloadAction<{ postId: string; comments: Comment[] }>,
        ) => {
            state.items[action.payload.postId] = action.payload.comments;
        },
        addComment: (state, action: PayloadAction<Comment>) => {
            const postId = action.payload.postId;
            if (!state.items[postId]) {
                state.items[postId] = [];
            }
            state.items[postId].push(action.payload);
        },
        updateComment: (
            state,
            action: PayloadAction<{ id: string; updates: Partial<Comment> }>,
        ) => {
            Object.keys(state.items).forEach((postId) => {
                const index = state.items[postId].findIndex((comment) =>
                    comment.id === action.payload.id
                );
                if (index !== -1) {
                    state.items[postId][index] = {
                        ...state.items[postId][index],
                        ...action.payload.updates,
                    };
                }
            });
        },
        removeComment: (state, action: PayloadAction<string>) => {
            Object.keys(state.items).forEach((postId) => {
                state.items[postId] = state.items[postId].filter((comment) =>
                    comment.id !== action.payload
                );
            });
        },
    },
});

export const {
    setLoading,
    setError,
    setComments,
    addComment,
    updateComment,
    removeComment,
} = commentsSlice.actions;

export default commentsSlice.reducer;
