import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { incrementComments, incrementLikes } from "@/store/slices/postsSlice";
import { Card } from "@/components/base/Card";
import { Post } from "@/types/posts";
import { useComponentStyles } from "@/core/theming/useComponentStyles";
import { postCardStyles } from "../styles/PostCard.styles";

interface PostCardProps {
    post: Post;
    onComment?: () => void;
    onShare?: () => void;
    compactMode?: boolean;
    variant?: "default" | "featured";
}

export const PostCard = ({
    post,
    onComment,
    onShare,
    compactMode = false,
    variant = "default",
}: PostCardProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const styles = useComponentStyles(
        "PostCard",
        postCardStyles,
        { compactMode, variant },
    );

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60 * 60),
        );

        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return date.toLocaleDateString();
    };

    const handleLike = () => dispatch(incrementLikes(post.id));
    const handleComment = () => {
        dispatch(incrementComments(post.id));
        onComment?.();
    };

    return (
        <Card style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.username}>
                    @user{post.userId.slice(0, 8)}
                </Text>
                <Text style={styles.timestamp}>
                    {formatTimestamp(post.createdAt)}
                </Text>
            </View>

            <Text style={styles.content}>{post.content}</Text>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleLike}
                >
                    <Text style={styles.actionText}>❤️ {post.likeCount}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleComment}
                >
                    <Text style={styles.actionText}>
                        💬 {post.commentCount}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={onShare}>
                    <Text style={styles.actionText}>📤 {t("posts.share")}</Text>
                </TouchableOpacity>
            </View>
        </Card>
    );
};
