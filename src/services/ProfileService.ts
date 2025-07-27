import { supabase } from "@/core/api/SupabaseClient";

interface CreateProfileData {
    id: string;
    username: string;
    fullName?: string;
    bio?: string;
}

interface UpdateProfileData {
    username?: string;
    fullName?: string;
    bio?: string;
    avatarUrl?: string;
    location?: string;
    website?: string;
}

export class ProfileService {
    static async createProfile(data: CreateProfileData) {
        const { data: profile, error } = await supabase
            .from("profiles")
            .insert(data)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return profile;
    }

    static async getProfile(userId: string) {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    static async updateProfile(userId: string, updates: UpdateProfileData) {
        const { data, error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", userId)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    static async checkUsernameAvailable(username: string) {
        const { data, error } = await supabase
            .from("profiles")
            .select("username")
            .eq("username", username)
            .single();

        if (error && error.code === "PGRST116") return true;
        if (error) throw new Error(error.message);
        return false;
    }
}
