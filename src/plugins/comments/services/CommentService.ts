import { supabase } from "@/core/api/SupabaseClient";
import {
    Comment,
    CreateCommentData,
    PaginationResult,
    UpdateCommentData,
} from "../types";

export class CommentService {
    private static readonly PAGE_SIZE = 20;

    /**
     * Fetch comments for a specific post
     */
    static async fetchComments(
        postId: number,
        cursor?: string,
    ): Promise<PaginationResult<Comment>> {
        let query = supabase
            .from("comments")
            .select(`
                *,
                profiles:user_id (username, avatar_url, full_name)
            `)
            .eq("post_id", postId)
            .is("parent_comment_id", null) // Only top-level comments
            .order("created_at", { ascending: true }) // Oldest first for comments
            .limit(this.PAGE_SIZE + 1);

        if (cursor) {
            query = query.gt("created_at", cursor);
        }

        const { data, error } = await query;
        if (error) throw error;

        const comments = data || [];
        const hasMore = comments.length > this.PAGE_SIZE;
        const items = hasMore ? comments.slice(0, -1) : comments;
        const nextCursor = hasMore ? items[items.length - 1]?.created_at : null;

        return {
            items,
            hasMore,
            nextCursor,
            total: items.length,
        };
    }

    /**
     * Fetch replies for a specific comment
     */
    static async fetchReplies(
        commentId: number,
        cursor?: string,
    ): Promise<PaginationResult<Comment>> {
        let query = supabase
            .from("comments")
            .select(`
                *,
                profiles:user_id (username, avatar_url, full_name)
            `)
            .eq("parent_comment_id", commentId)
            .order("created_at", { ascending: true })
            .limit(this.PAGE_SIZE + 1);

        if (cursor) {
            query = query.gt("created_at", cursor);
        }

        const { data, error } = await query;
        if (error) throw error;

        const replies = data || [];
        const hasMore = replies.length > this.PAGE_SIZE;
        const items = hasMore ? replies.slice(0, -1) : replies;
        const nextCursor = hasMore ? items[items.length - 1]?.created_at : null;

        return {
            items,
            hasMore,
            nextCursor,
            total: items.length,
        };
    }

    /**
     * Create a new comment or reply
     */
    static async createComment(data: CreateCommentData): Promise<Comment> {
        const user = await supabase.auth.getUser();
        if (!user.data.user) throw new Error("User not authenticated");

        const commentData = {
            post_id: data.post_id,
            user_id: user.data.user.id,
            content: data.content,
            parent_comment_id: data.parent_comment_id || null,
        };

        const { data: comment, error } = await supabase
            .from("comments")
            .insert(commentData)
            .select(`
                *,
                profiles:user_id (username, avatar_url, full_name)
            `)
            .single();

        if (error) throw error;
        return comment;
    }

    /**
     * Update an existing comment
     */
    static async updateComment(
        commentId: number,
        data: UpdateCommentData,
    ): Promise<Comment> {
        const { data: comment, error } = await supabase
            .from("comments")
            .update({ content: data.content })
            .eq("id", commentId)
            .select(`
                *,
                profiles:user_id (username, avatar_url, full_name)
            `)
            .single();

        if (error) throw error;
        return comment;
    }

    /**
     * Delete a comment
     */
    static async deleteComment(commentId: number): Promise<void> {
        const { error } = await supabase
            .from("comments")
            .delete()
            .eq("id", commentId);

        if (error) throw error;
    }

    /**
     * Get a single comment by ID
     */
    static async getComment(commentId: number): Promise<Comment> {
        const { data, error } = await supabase
            .from("comments")
            .select(`
                *,
                profiles:user_id (username, avatar_url, full_name)
            `)
            .eq("id", commentId)
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Get comment count for a post
     */
    static async getCommentCount(postId: number): Promise<number> {
        const { count, error } = await supabase
            .from("comments")
            .select("*", { count: "exact", head: true })
            .eq("post_id", postId);

        if (error) throw error;
        return count || 0;
    }

    /**
     * Health check method for service registry
     */
    healthCheck(): boolean {
        return !!supabase.auth.getUser();
    }
}
