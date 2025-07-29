export interface Comment {
    id: number;
    post_id: number;
    user_id: string;
    content: string;
    parent_comment_id: number | null;
    created_at: string;

    // Joined data from profiles table
    profiles?: {
        username: string;
        avatar_url: string | null;
        full_name: string | null;
    };

    // Computed fields
    reply_count?: number;
    depth?: number;

    // Nested replies (for threaded display)
    replies?: Comment[];
}

export interface CreateCommentData {
    post_id: number;
    content: string;
    parent_comment_id?: number | null;
}

export interface UpdateCommentData {
    content: string;
}

export interface CommentsState {
    // Comments organized by post ID
    commentsByPost: Record<number, Comment[]>;

    // Loading states per post
    loadingByPost: Record<number, boolean>;
    refreshingByPost: Record<number, boolean>;
    loadingMoreByPost: Record<number, boolean>;

    // Error states per post
    errorByPost: Record<number, string | null>;
    paginationErrorByPost: Record<number, string | null>;

    // Pagination per post
    hasMoreByPost: Record<number, boolean>;
    nextCursorByPost: Record<number, string | null>;

    // Reply loading states (for nested comments)
    loadingReplies: Record<number, boolean>; // comment ID -> loading

    // Global loading for creating comments
    creating: boolean;
    createError: string | null;
}

export interface PaginationResult<T> {
    items: T[];
    hasMore: boolean;
    nextCursor: string | null;
    total: number;
}

export interface CommentWithChildren extends Comment {
    children: CommentWithChildren[];
    depth: number;
}

// Hook options
export interface UseCommentsOptions {
    postId: number;
    autoRefresh?: boolean;
    maxDepth?: number;
}

// Component props interfaces
export interface CommentItemProps {
    comment: Comment;
    onReply?: (commentId: number) => void;
    onEdit?: (commentId: number) => void;
    onDelete?: (commentId: number) => void;
    maxDepth?: number;
    currentDepth?: number;
    showReplies?: boolean;
}

export interface CommentListProps {
    postId: number;
    maxDepth?: number;
    autoRefresh?: boolean;
}

export interface CommentCreatorProps {
    postId: number;
    parentCommentId?: number | null;
    placeholder?: string;
    onCommentCreated?: (comment: Comment) => void;
    onCancel?: () => void;
    variant?: "default" | "reply" | "inline";
}
