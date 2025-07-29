export interface Post {
    id: number;
    user_id: string;
    content: string | null;
    emotion_id: number | null;
    available_actions: number[] | null;
    created_at: string;
    visibility: "public" | "private" | "group";
    group_id: number | null;
    profiles?: {
        username: string;
        avatar_url: string | null;
        full_name: string | null;
    };
    media_attachments?: MediaAttachment[];
    _count?: {
        reactions: number;
        comments: number;
    };
}

export interface MediaAttachment {
    id: number;
    type: "image" | "video" | "audio" | "document";
    url: string;
    thumbnail_url: string | null;
    alt_text: string | null;
    width: number | null;
    height: number | null;
}

export interface CreatePostData {
    content: string;
    emotion_id?: number | null;
    visibility?: "public" | "private" | "group";
    group_id?: number;
    media_urls?: string[];
}

export interface UpdatePostData {
    content?: string;
    emotion_id?: number;
    visibility?: "public" | "private" | "group";
}

export interface PaginationResult<T> {
    items: T[];
    hasMore: boolean;
    nextCursor: string | null;
    total: number;
}

export interface PostsState {
    items: Post[];
    loading: boolean;
    refreshing: boolean;
    loadingMore: boolean;
    error: string | null;
    paginationError: string | null;
    hasMore: boolean;
    nextCursor: string | null;
    lastRefresh: number | null;
    prefetching: boolean;
}

export interface PostCardSkeletonProps {
    variant?: "default" | "compact";
}

export interface PostListErrorProps {
    error: string;
    onRetry: () => void;
    type: "initial" | "pagination";
}

export interface LoadingState {
    initial: boolean;
    refresh: boolean;
    pagination: boolean;
    prefetch: boolean;
}
