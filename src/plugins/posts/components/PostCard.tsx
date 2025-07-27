import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/core/theming/ThemeProvider";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { incrementComments, incrementLikes } from "@/store/slices/postsSlice";
import { Card } from "@/components/base/Card";
import { Post } from "@/types/posts";

interface PostCardProps {
    post: Post;
    onComment?: () => void;
    onShare?: () => void;
}

export const PostCard = ({ post, onComment, onShare }: PostCardProps) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const styles = StyleSheet.create({
        container: {
            marginBottom: theme.spacing.md,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: theme.spacing.sm,
        },
        username: {
            fontSize: theme.typography.fontSize.md,
            fontWeight: "600",
            color: theme.colors.text.primary,
            marginRight: theme.spacing.sm,
        },
        timestamp: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.tertiary,
        },
        content: {
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.primary,
            lineHeight: theme.typography.lineHeight.normal *
                theme.typography.fontSize.md,
            marginBottom: theme.spacing.md,
        },
        actions: {
            flexDirection: "row",
            justifyContent: "space-around",
            paddingTop: theme.spacing.sm,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border.primary,
        },
        actionButton: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: theme.spacing.xs,
            paddingHorizontal: theme.spacing.sm,
            borderRadius: theme.borderRadius.sm,
        },
        actionText: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            marginLeft: theme.spacing.xs,
        },
    });

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

    const handleLike = () => {
        dispatch(incrementLikes(post.id));
    };

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
                    <Text style={styles.actionText}>
                        ❤️ {post.likeCount}
                    </Text>
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
                    <Text style={styles.actionText}>
                        📤 {t("posts.share")}
                    </Text>
                </TouchableOpacity>
            </View>
        </Card>
    );
};
