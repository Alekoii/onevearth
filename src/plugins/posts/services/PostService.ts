import { supabase } from "@/core/api/SupabaseClient";
import {
    CreatePostData,
    PaginationResult,
    Post,
    UpdatePostData,
} from "../types";

export class PostService {
    private static readonly PAGE_SIZE = 20;

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
                profiles:user_id (username, avatar_url, full_name),
                media_attachments (*)
            `)
            .single();

        if (error) throw error;

        // Get counts separately for better reliability
        const [reactionsResult, commentsResult] = await Promise.all([
            supabase
                .from("post_reactions")
                .select("*", { count: "exact", head: true })
                .eq("post_id", post.id),
            supabase
                .from("comments")
                .select("*", { count: "exact", head: true })
                .eq("post_id", post.id),
        ]);

        // Add counts to the post object
        const postWithCounts = {
            ...post,
            _count: {
                reactions: reactionsResult.count || 0,
                comments: commentsResult.count || 0,
            },
        };

        return postWithCounts;
    }

    static async fetchPosts(cursor?: string): Promise<PaginationResult<Post>> {
        let query = supabase
            .from("posts")
            .select(`
                *,
                profiles:user_id (username, avatar_url, full_name),
                media_attachments (*)
            `)
            .eq("visibility", "public")
            .order("created_at", { ascending: false })
            .limit(this.PAGE_SIZE + 1);

        if (cursor) {
            query = query.lt("created_at", cursor);
        }

        const { data, error } = await query;
        if (error) throw error;

        const posts = data || [];
        const hasMore = posts.length > this.PAGE_SIZE;
        const items = hasMore ? posts.slice(0, -1) : posts;
        const nextCursor = hasMore ? items[items.length - 1]?.created_at : null;

        // Get counts for all posts in parallel
        const postsWithCounts = await Promise.all(
            items.map(async (post) => {
                const [reactionsResult, commentsResult] = await Promise.all([
                    supabase
                        .from("post_reactions")
                        .select("*", { count: "exact", head: true })
                        .eq("post_id", post.id),
                    supabase
                        .from("comments")
                        .select("*", { count: "exact", head: true })
                        .eq("post_id", post.id),
                ]);

                return {
                    ...post,
                    _count: {
                        reactions: reactionsResult.count || 0,
                        comments: commentsResult.count || 0,
                    },
                };
            }),
        );

        return {
            items: postsWithCounts,
            hasMore,
            nextCursor,
            total: postsWithCounts.length,
        };
    }

    static async fetchUserPosts(
        userId: string,
        cursor?: string,
    ): Promise<PaginationResult<Post>> {
        let query = supabase
            .from("posts")
            .select(`
                *,
                profiles:user_id (username, avatar_url, full_name),
                media_attachments (*)
            `)
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(this.PAGE_SIZE + 1);

        if (cursor) {
            query = query.lt("created_at", cursor);
        }

        const { data, error } = await query;
        if (error) throw error;

        const posts = data || [];
        const hasMore = posts.length > this.PAGE_SIZE;
        const items = hasMore ? posts.slice(0, -1) : posts;
        const nextCursor = hasMore ? items[items.length - 1]?.created_at : null;

        // Get counts for all posts in parallel
        const postsWithCounts = await Promise.all(
            items.map(async (post) => {
                const [reactionsResult, commentsResult] = await Promise.all([
                    supabase
                        .from("post_reactions")
                        .select("*", { count: "exact", head: true })
                        .eq("post_id", post.id),
                    supabase
                        .from("comments")
                        .select("*", { count: "exact", head: true })
                        .eq("post_id", post.id),
                ]);

                return {
                    ...post,
                    _count: {
                        reactions: reactionsResult.count || 0,
                        comments: commentsResult.count || 0,
                    },
                };
            }),
        );

        return {
            items: postsWithCounts,
            hasMore,
            nextCursor,
            total: postsWithCounts.length,
        };
    }

    static async getPost(postId: number): Promise<Post> {
        const { data, error } = await supabase
            .from("posts")
            .select(`
                *,
                profiles:user_id (username, avatar_url, full_name),
                media_attachments (*)
            `)
            .eq("id", postId)
            .single();

        if (error) throw error;

        // Get counts separately
        const [reactionsResult, commentsResult] = await Promise.all([
            supabase
                .from("post_reactions")
                .select("*", { count: "exact", head: true })
                .eq("post_id", postId),
            supabase
                .from("comments")
                .select("*", { count: "exact", head: true })
                .eq("post_id", postId),
        ]);

        // Add counts to the post object
        const postWithCounts = {
            ...data,
            _count: {
                reactions: reactionsResult.count || 0,
                comments: commentsResult.count || 0,
            },
        };

        return postWithCounts;
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
                profiles:user_id (username, avatar_url, full_name),
                media_attachments (*)
            `)
            .single();

        if (error) throw error;

        // Get counts separately
        const [reactionsResult, commentsResult] = await Promise.all([
            supabase
                .from("post_reactions")
                .select("*", { count: "exact", head: true })
                .eq("post_id", postId),
            supabase
                .from("comments")
                .select("*", { count: "exact", head: true })
                .eq("post_id", postId),
        ]);

        // Add counts to the post object
        const postWithCounts = {
            ...post,
            _count: {
                reactions: reactionsResult.count || 0,
                comments: commentsResult.count || 0,
            },
        };

        return postWithCounts;
    }

    static async deletePost(postId: number): Promise<void> {
        const { error } = await supabase
            .from("posts")
            .delete()
            .eq("id", postId);

        if (error) throw error;
    }

    static async searchPosts(
        query: string,
        cursor?: string,
    ): Promise<PaginationResult<Post>> {
        let searchQuery = supabase
            .from("posts")
            .select(`
                *,
                profiles:user_id (username, avatar_url, full_name),
                media_attachments (*)
            `)
            .textSearch("content", query)
            .eq("visibility", "public")
            .order("created_at", { ascending: false })
            .limit(this.PAGE_SIZE + 1);

        if (cursor) {
            searchQuery = searchQuery.lt("created_at", cursor);
        }

        const { data, error } = await searchQuery;
        if (error) throw error;

        const posts = data || [];
        const hasMore = posts.length > this.PAGE_SIZE;
        const items = hasMore ? posts.slice(0, -1) : posts;
        const nextCursor = hasMore ? items[items.length - 1]?.created_at : null;

        // Get counts for all posts in parallel
        const postsWithCounts = await Promise.all(
            items.map(async (post) => {
                const [reactionsResult, commentsResult] = await Promise.all([
                    supabase
                        .from("post_reactions")
                        .select("*", { count: "exact", head: true })
                        .eq("post_id", post.id),
                    supabase
                        .from("comments")
                        .select("*", { count: "exact", head: true })
                        .eq("post_id", post.id),
                ]);

                return {
                    ...post,
                    _count: {
                        reactions: reactionsResult.count || 0,
                        comments: commentsResult.count || 0,
                    },
                };
            }),
        );

        return {
            items: postsWithCounts,
            hasMore,
            nextCursor,
            total: postsWithCounts.length,
        };
    }

    healthCheck(): boolean {
        return !!supabase.auth.getUser();
    }
}
