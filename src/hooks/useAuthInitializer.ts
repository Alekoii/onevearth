import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setLoading, setUser } from "@/store/slices/authSlice";
import { AuthService } from "@/services/AuthService";
import { supabase } from "@/core/api/SupabaseClient";

export const useAuthInitializer = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const initializeAuth = async () => {
            dispatch(setLoading(true));
            try {
                const user = await AuthService.getCurrentUser();
                dispatch(setUser(user));
            } catch (err) {
                console.error("Auth initialization failed:", err);
            } finally {
                dispatch(setLoading(false));
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                dispatch(setUser(session?.user ?? null));
            },
        );

        return () => subscription.unsubscribe();
    }, [dispatch]);
};
