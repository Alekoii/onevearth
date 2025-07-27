import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserProfile {
    id: string;
    username: string;
    fullName?: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
    website?: string;
    followerCount: number;
    followingCount: number;
    postCount: number;
    isVerified: boolean;
    hasPremium: boolean;
    createdAt: string;
    lastActive: string;
}

interface UsersState {
    profiles: Record<string, UserProfile>;
    loading: boolean;
    error: string | null;
}

const initialState: UsersState = {
    profiles: {},
    loading: false,
    error: null,
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setProfile: (state, action: PayloadAction<UserProfile>) => {
            state.profiles[action.payload.id] = action.payload;
        },
        updateProfile: (
            state,
            action: PayloadAction<
                { id: string; updates: Partial<UserProfile> }
            >,
        ) => {
            const profile = state.profiles[action.payload.id];
            if (profile) {
                state.profiles[action.payload.id] = {
                    ...profile,
                    ...action.payload.updates,
                };
            }
        },
        setProfiles: (state, action: PayloadAction<UserProfile[]>) => {
            action.payload.forEach((profile) => {
                state.profiles[profile.id] = profile;
            });
        },
        removeProfile: (state, action: PayloadAction<string>) => {
            delete state.profiles[action.payload];
        },
    },
});

export const {
    setLoading,
    setError,
    setProfile,
    updateProfile,
    setProfiles,
    removeProfile,
} = usersSlice.actions;

export default usersSlice.reducer;
