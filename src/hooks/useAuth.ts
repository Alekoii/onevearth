import { useAppDispatch, useAppSelector } from "@/hooks";
import { setLoading, setUser } from "@/store/slices/authSlice";
import { AuthService } from "@/services/AuthService";

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { user, loading } = useAppSelector((state) => state.auth);

    const signIn = async (email: string, password: string) => {
        dispatch(setLoading(true));
        try {
            const { user } = await AuthService.signIn(email, password);
            dispatch(setUser(user));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const signOut = async () => {
        await AuthService.signOut();
        dispatch(setUser(null));
    };

    return { user, loading, signIn, signOut };
};
