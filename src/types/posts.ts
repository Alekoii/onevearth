export interface Post {
    id: string;
    userId: string;
    content: string;
    emotion?: string;
    media: string[];
    visibility: "public" | "private" | "group";
    groupId?: string;
    createdAt: string;
    updatedAt: string;
    likeCount: number;
    commentCount: number;
}

export interface CreatePostData {
    content: string;
    emotion?: string;
    media?: string[];
    visibility?: "public" | "private" | "group";
    groupId?: string;
}

export interface UpdatePostData {
    content?: string;
    emotion?: string;
    visibility?: "public" | "private" | "group";
    groupId?: string;
}
