export class PostService {
    static async fetchPosts(page = 0, limit = 20) {
        const { data, error } = await supabase
            .from("posts")
            .select(`
        *,
        profiles:user_id (username, avatar_url),
        emotions (name, emoji)
      `)
            .eq("visibility", "public")
            .order("created_at", { ascending: false })
            .range(page * limit, (page + 1) * limit - 1);

        if (error) throw error;
        return data;
    }

    static async createPost(postData: CreatePostData) {
        // Pure service - no Redux dispatch
        const { data, error } = await supabase
            .from("posts")
            .insert(postData)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}
