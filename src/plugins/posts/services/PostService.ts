import { supabase } from "@/core/api/SupabaseClient";
import { CreatePostData, Post, UpdatePostData } from "../types";

export class PostService {
    static async createPost(data: CreatePostData): Promise<Post> {
        const user = await supabase.auth.getUser();
        if (!user.data.user) throw new Error("User not authenticated");

        const postData = {
            user_id: user.data.user.id,
            content: data.content,
            emotion_id: data.emotion_id || null,
            visibility: data.visibility || "public",
            group_id: data.group_id || null,
        };

        const { data: post, error } = await supabase
            .from("posts")
            .insert(postData)
            .select(`
                *,
                profiles:user_id (
                    username,
                    avatar_url,
                    full_name
                ),
                media_attachments (*),
                _count:post_reactions(count)
            `)
            .single();

        if (error) throw error;
        return post;
    }

    static async fetchPosts(page = 0, limit = 20): Promise<Post[]> {
        const { data, error } = await supabase
            .from("posts")
            .select(`
                *,
                profiles:user_id (
                    username,
                    avatar_url,
                    full_name
                ),
                media_attachments (*),
                _count:post_reactions(count)
            `)
            .eq("visibility", "public")
            .order("created_at", { ascending: false })
            .range(page * limit, (page + 1) * limit - 1);

        if (error) throw error;
        return data || [];
    }

    static async fetchUserPosts(
        userId: string,
        page = 0,
        limit = 20,
    ): Promise<Post[]> {
        const { data, error } = await supabase
            .from("posts")
            .select(`
                *,
                profiles:user_id (
                    username,
                    avatar_url,
                    full_name
                ),
                media_attachments (*),
                _count:post_reactions(count)
            `)
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .range(page * limit, (page + 1) * limit - 1);

        if (error) throw error;
        return data || [];
    }

    static async getPost(postId: number): Promise<Post> {
        const { data, error } = await supabase
            .from("posts")
            .select(`
                *,
                profiles:user_id (
                    username,
                    avatar_url,
                    full_name
                ),
                media_attachments (*),
                _count:post_reactions(count)
            `)
            .eq("id", postId)
            .single();

        if (error) throw error;
        return data;
    }

    static async updatePost(
        postId: number,
        data: UpdatePostData,
    ): Promise<Post> {
        const { data: post, error } = await supabase
            .from("posts")
            .update(data)
            .eq("id", postId)
            .select(`
                *,
                profiles:user_id (
                    username,
                    avatar_url,
                    full_name
                ),
                media_attachments (*),
                _count:post_reactions(count)
            `)
            .single();

        if (error) throw error;
        return post;
    }

    static async deletePost(postId: number): Promise<void> {
        const { error } = await supabase
            .from("posts")
            .delete()
            .eq("id", postId);

        if (error) throw error;
    }

    static async searchPosts(query: string, limit = 20): Promise<Post[]> {
        const { data, error } = await supabase
            .from("posts")
            .select(`
                *,
                profiles:user_id (
                    username,
                    avatar_url,
                    full_name
                ),
                media_attachments (*),
                _count:post_reactions(count)
            `)
            .textSearch("content", query)
            .eq("visibility", "public")
            .limit(limit);

        if (error) throw error;
        return data || [];
    }

    healthCheck(): boolean {
        return !!supabase.auth.getUser();
    }
}
