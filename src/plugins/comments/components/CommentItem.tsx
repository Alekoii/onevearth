import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useColors, useStyles } from "@/core/theming/useStyles";
import { useTheme } from "@/core/theming/ThemeProvider";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Icon } from "@/components/ui/Icon";
import { ExtensionPoint } from "@/core/plugins/ExtensionPoint";
import { Comment, CommentItemProps } from "../types";

export const CommentItem = ({
    comment,
    onReply,
    onEdit,
    onDelete,
    maxDepth = 3,
    currentDepth = 0,
    showReplies = true,
}: CommentItemProps) => {
    const styles = useStyles("CommentItem", { depth: currentDepth });
    const colors = useColors();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    const currentUser = useAppSelector((state) => state.auth.user);
    const isOwner = currentUser?.id === comment.user_id;
    const canReply = currentDepth < maxDepth;
    const hasReplies = comment.replies && comment.replies.length > 0;

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60),
        );

        if (diffInMinutes < 1) return "now";
        if (diffInMinutes < 60) return `${diffInMinutes}m`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
        return `${Math.floor(diffInMinutes / 1440)}d`;
    };

    const handleReplyPress = () => {
        if (onReply) {
            onReply(comment.id);
        }
        setShowReplyForm(!showReplyForm);
    };

    const handleEditPress = () => {
        if (onEdit) {
            onEdit(comment.id);
        }
    };

    const handleDeletePress = () => {
        if (onDelete) {
            onDelete(comment.id);
        }
    };

    const toggleReplies = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <View style={styles.container}>
            <View style={styles.commentContainer}>
                <View style={styles.header}>
                    {comment.profiles?.avatar_url
                        ? (
                            <Image
                                source={{ uri: comment.profiles.avatar_url }}
                                style={styles.avatar}
                            />
                        )
                        : (
                            <View style={styles.avatarPlaceholder}>
                                <Icon
                                    name="user"
                                    size={16}
                                    color={colors.text.secondary}
                                />
                            </View>
                        )}

                    <View style={styles.userInfo}>
                        <View style={styles.userDetails}>
                            <Text style={styles.username}>
                                {comment.profiles?.full_name ||
                                    comment.profiles?.username ||
                                    "Unknown User"}
                            </Text>
                            <Text style={styles.timestamp}>
                                {formatTimeAgo(comment.created_at)}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.content}>
                    <Text style={styles.contentText}>
                        {comment.content}
                    </Text>
                </View>

                <View style={styles.actions}>
                    <ExtensionPoint
                        name="comment.actions"
                        comment={comment}
                        isOwner={isOwner}
                        canReply={canReply}
                        fallback={() => (
                            <View style={styles.defaultActions}>
                                {canReply && (
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={handleReplyPress}
                                    >
                                        <Icon
                                            name="comment"
                                            size={14}
                                            color={colors.text.secondary}
                                        />
                                        <Text style={styles.actionText}>
                                            Reply
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                {isOwner && (
                                    <>
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={handleEditPress}
                                        >
                                            <Icon
                                                name="edit"
                                                size={14}
                                                color={colors.text.secondary}
                                            />
                                            <Text style={styles.actionText}>
                                                Edit
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={handleDeletePress}
                                        >
                                            <Icon
                                                name="trash"
                                                size={14}
                                                color={colors.error(500)}
                                            />
                                            <Text
                                                style={[
                                                    styles.actionText,
                                                    {
                                                        color: colors.error(
                                                            500,
                                                        ),
                                                    },
                                                ]}
                                            >
                                                Delete
                                            </Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        )}
                    />
                </View>
            </View>

            {showReplyForm && (
                <ExtensionPoint
                    name="comment.reply.form"
                    comment={comment}
                    onCancel={() => setShowReplyForm(false)}
                    fallback={() => (
                        <View style={styles.replyForm}>
                            <Text style={styles.replyFormText}>
                                Reply form would go here
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowReplyForm(false)}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}

            {showReplies && hasReplies && (
                <View style={styles.repliesSection}>
                    <TouchableOpacity
                        style={styles.toggleReplies}
                        onPress={toggleReplies}
                    >
                        <Icon
                            name={isExpanded ? "arrow-up" : "arrow-down"}
                            size={14}
                            color={colors.text.secondary}
                        />
                        <Text style={styles.toggleText}>
                            {isExpanded ? "Hide" : "Show"}{" "}
                            {comment.replies!.length}{" "}
                            {comment.replies!.length === 1
                                ? "reply"
                                : "replies"}
                        </Text>
                    </TouchableOpacity>

                    {isExpanded && (
                        <View style={styles.nestedReplies}>
                            {comment.replies!.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    onReply={onReply}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    maxDepth={maxDepth}
                                    currentDepth={currentDepth + 1}
                                    showReplies={showReplies}
                                />
                            ))}
                        </View>
                    )}
                </View>
            )}

            <ExtensionPoint
                name="comment.content.extensions"
                comment={comment}
                currentDepth={currentDepth}
            />
        </View>
    );
};
