import { supabase } from "@/core/api/SupabaseClient";
import { CreatePostData } from "@/types/posts";

export class PostService {
    static async createPost(postData: CreatePostData) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from("posts")
            .insert({
                user_id: user.id,
                content: postData.content,
                emotion_id: postData.emotion,
                visibility: postData.visibility || "public",
                group_id: postData.groupId,
            })
            .select(`
        *,
        profiles:user_id (username, avatar_url, full_name),
        emotions (name, emoji)
      `)
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    static async fetchPosts(page = 0, limit = 20) {
        const { data, error } = await supabase
            .from("posts")
            .select(`
        *,
        profiles:user_id (username, avatar_url, full_name),
        emotions (name, emoji)
      `)
            .eq("visibility", "public")
            .order("created_at", { ascending: false })
            .range(page * limit, (page + 1) * limit - 1);

        if (error) throw new Error(error.message);
        return data;
    }

    static async deletePost(postId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { error } = await supabase
            .from("posts")
            .delete()
            .eq("id", postId)
            .eq("user_id", user.id);

        if (error) throw new Error(error.message);
    }

    static async toggleReaction(postId: string, actionId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data: existing } = await supabase
            .from("post_reactions")
            .select("id")
            .eq("post_id", postId)
            .eq("user_id", user.id)
            .single();

        if (existing) {
            const { error } = await supabase
                .from("post_reactions")
                .delete()
                .eq("id", existing.id);

            if (error) throw new Error(error.message);
            return false;
        } else {
            const { error } = await supabase
                .from("post_reactions")
                .insert({
                    post_id: postId,
                    user_id: user.id,
                    action_id: actionId,
                });

            if (error) throw new Error(error.message);
            return true;
        }
    }
}
