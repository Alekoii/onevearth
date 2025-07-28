import { useAppDispatch, useAppSelector } from "@/hooks";
import { setError, setLoading, setProfile } from "@/store/slices/usersSlice";
import { supabase } from "@/core/api/SupabaseClient";

export const useProfile = (userId?: string) => {
    const dispatch = useAppDispatch();
    const { profiles, loading } = useAppSelector((state) => state.users);
    const currentUserId = useAppSelector((state) => state.auth.user?.id);

    const targetUserId = userId || currentUserId;
    const profile = targetUserId ? profiles[targetUserId] : null;

    const loadProfile = async (id: string) => {
        dispatch(setLoading(true));
        try {
            const { data: profileData, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;
            dispatch(setProfile(profileData));
        } catch (err) {
            const error = err as Error;
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const updateProfile = async (updates: any) => {
        if (!targetUserId) return;

        try {
            const { data: updated, error } = await supabase
                .from("profiles")
                .update(updates)
                .eq("id", targetUserId)
                .select()
                .single();

            if (error) throw error;
            dispatch(setProfile(updated));
        } catch (err) {
            const error = err as Error;
            dispatch(setError(error.message));
        }
    };

    return { profile, loading, loadProfile, updateProfile };
};
