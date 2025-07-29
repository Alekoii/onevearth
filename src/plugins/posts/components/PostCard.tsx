import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useStyles } from "@/core/theming/useStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { useConfig } from "@/core/config/ConfigProvider";
import { Icon } from "@/components/ui/Icon";
import { ExtensionPoint } from "@/core/plugins/ExtensionPoint";
import { Post } from "../types";

interface PostCardProps {
    post: Post;
    onPress?: () => void;
    onUserPress?: () => void;
    variant?: "default" | "compact";
    maxLines?: number;
}

export const PostCard = ({
    post,
    onPress,
    onUserPress,
    variant = "default",
    maxLines,
}: PostCardProps) => {
    const styles = useStyles("PostCard", { variant });
    const { t } = useTranslation();
    const { config } = useConfig();
    const [isExpanded, setIsExpanded] = useState(false);
    const [shouldShowButton, setShouldShowButton] = useState(false);

    const configMaxLines = config.plugins?.config?.posts?.maxLines ?? 4;
    const effectiveMaxLines = maxLines ?? configMaxLines;
    const shouldTruncate = effectiveMaxLines > 0;

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

    const handleUserPress = () => {
        if (onUserPress) {
            onUserPress();
        }
    };

    const handlePostPress = () => {
        if (onPress) {
            onPress();
        }
    };

    const handleTextLayout = (event: any) => {
        const { lines } = event.nativeEvent;
        if (shouldTruncate && lines.length > effectiveMaxLines) {
            setShouldShowButton(true);
        }
    };

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handlePostPress}
            activeOpacity={0.95}
        >
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.userInfo}
                    onPress={handleUserPress}
                >
                    {post.profiles?.avatar_url
                        ? (
                            <Image
                                source={{ uri: post.profiles.avatar_url }}
                                style={styles.avatar}
                            />
                        )
                        : (
                            <View style={styles.avatarPlaceholder}>
                                <Icon name="user" size={20} color="#6D6D6D" />
                            </View>
                        )}

                    <View style={styles.userDetails}>
                        <Text style={styles.username}>
                            {post.profiles?.full_name ||
                                post.profiles?.username || "Unknown User"}
                        </Text>
                        <Text style={styles.timestamp}>
                            {formatTimeAgo(post.created_at)}
                        </Text>
                    </View>
                </TouchableOpacity>

                <ExtensionPoint
                    name="post.header.actions"
                    post={post}
                    maxExtensions={3}
                />
            </View>

            {post.content && (
                <View style={styles.content}>
                    <Text
                        style={styles.contentText}
                        numberOfLines={shouldTruncate && !isExpanded
                            ? effectiveMaxLines
                            : undefined}
                        onTextLayout={handleTextLayout}
                    >
                        {post.content}
                    </Text>

                    {shouldShowButton && !isExpanded && (
                        <TouchableOpacity
                            onPress={toggleExpanded}
                            style={{ marginTop: 4 }}
                        >
                            <Text style={styles.expandText}>
                                Show more
                            </Text>
                        </TouchableOpacity>
                    )}

                    {shouldShowButton && isExpanded && (
                        <TouchableOpacity
                            onPress={toggleExpanded}
                            style={{ marginTop: 4 }}
                        >
                            <Text style={styles.expandText}>
                                Show less
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {post.media_attachments && post.media_attachments.length > 0 && (
                <View style={styles.mediaContainer}>
                    {post.media_attachments.slice(0, 4).map((media) => (
                        <Image
                            key={media.id}
                            source={{ uri: media.url }}
                            style={styles.mediaImage}
                            resizeMode="cover"
                        />
                    ))}
                </View>
            )}

            <ExtensionPoint
                name="post.content.extensions"
                post={post}
            />

            <View style={styles.actions}>
                <ExtensionPoint
                    name="post.actions"
                    post={post}
                    filterBy={{ tags: ["primary"] }}
                    maxExtensions={4}
                    fallback={() => (
                        <View style={styles.defaultActions}>
                            <TouchableOpacity style={styles.actionButton}>
                                <Icon name="heart" size={20} color="#6D6D6D" />
                                <Text style={styles.actionText}>
                                    {post._count?.reactions || 0}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton}>
                                <Icon
                                    name="comment"
                                    size={20}
                                    color="#6D6D6D"
                                />
                                <Text style={styles.actionText}>
                                    {post._count?.comments || 0}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton}>
                                <Icon name="share" size={20} color="#6D6D6D" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        </TouchableOpacity>
    );
};
