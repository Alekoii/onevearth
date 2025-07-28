import { supabase } from "@/core/api/SupabaseClient";
import { User } from "@supabase/supabase-js";

export class AuthService {
    static async signUp(email: string, password: string, username: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username },
            },
        });

        if (error) throw error;
        return data;
    }

    static async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data;
    }

    static async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }

    static async getCurrentUser(): Promise<User | null> {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    }

    static async initializeUserProfile(user: User, username: string) {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (error && error.code === "PGRST116") {
            // Profile doesn't exist, create it
            const { data: newProfile, error: createError } = await supabase
                .from("profiles")
                .insert({
                    id: user.id,
                    username,
                    full_name: user.user_metadata?.full_name,
                })
                .select()
                .single();

            if (createError) throw createError;
            return newProfile;
        }

        if (error) throw error;
        return data;
    }
}
