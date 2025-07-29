import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useStyles } from "@/core/theming/useStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/base/Card";
import { GroupedNotification, NotificationCardProps } from "../types";

export const NotificationCard: React.FC<NotificationCardProps> = ({
    notification,
    onPress,
    onMarkRead,
    onDelete,
}) => {
    const styles = useStyles("NotificationCard");
    const { t } = useTranslation();

    const handlePress = () => {
        if (!notification.read && onMarkRead) {
            // Mark as read when pressed
            const notificationIds = [notification.id].filter((id) =>
                typeof id === "number"
            ) as number[];
            onMarkRead(notificationIds);
        }

        onPress?.(notification);
    };

    const handleDelete = () => {
        Alert.alert(
            t("notifications.deleteTitle"),
            t("notifications.deleteMessage"),
            [
                {
                    text: t("common.cancel"),
                    style: "cancel",
                },
                {
                    text: t("common.delete"),
                    style: "destructive",
                    onPress: () => {
                        if (typeof notification.id === "number") {
                            onDelete?.(notification.id);
                        }
                    },
                },
            ],
        );
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "new_reaction":
                return "heart";
            case "new_comment":
                return "message-circle";
            case "new_mention":
                return "at-sign";
            case "new_follower":
                return "user-plus";
            default:
                return "bell";
        }
    };

    const getNotificationMessage = (
        notification: GroupedNotification,
    ): string => {
        const { type, actors, count, post, comment } = notification;
        const actorNames = actors.slice(0, 2).map((actor) =>
            actor.full_name || actor.username
        );

        const othersCount = Math.max(0, count - 2);

        let message = "";

        if (count === 1) {
            const actor = actorNames[0];
            switch (type) {
                case "new_reaction":
                    message = t("notifications.singleReaction", { actor });
                    break;
                case "new_comment":
                    message = t("notifications.singleComment", { actor });
                    break;
                case "new_mention":
                    message = t("notifications.singleMention", { actor });
                    break;
                case "new_follower":
                    message = t("notifications.singleFollow", { actor });
                    break;
                default:
                    message = t("notifications.singleGeneric", { actor });
            }
        } else {
            const actors_text = othersCount > 0
                ? t("notifications.actorsWithOthers", {
                    actors: actorNames.join(", "),
                    count: othersCount,
                })
                : actorNames.join(" and ");

            switch (type) {
                case "new_reaction":
                    message = t("notifications.multipleReactions", {
                        actors: actors_text,
                    });
                    break;
                case "new_comment":
                    message = t("notifications.multipleComments", {
                        actors: actors_text,
                    });
                    break;
                case "new_mention":
                    message = t("notifications.multipleMentions", {
                        actors: actors_text,
                    });
                    break;
                case "new_follower":
                    message = t("notifications.multipleFollows", {
                        actors: actors_text,
                    });
                    break;
                default:
                    message = t("notifications.multipleGeneric", {
                        actors: actors_text,
                    });
            }
        }

        return message;
    };

    const getTimeAgo = (dateString: string): string => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInHours = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60 * 60),
        );

        if (diffInHours < 1) return t("notifications.justNow");
        if (diffInHours < 24) {
            return t("notifications.hoursAgo", { count: diffInHours });
        }

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) {
            return t("notifications.daysAgo", { count: diffInDays });
        }

        return date.toLocaleDateString();
    };

    const renderAvatars = () => {
        const { actors } = notification;
        const displayActors = actors.slice(0, 3); // Show max 3 avatars

        return (
            <View style={styles.avatarContainer}>
                {displayActors.map((actor, index) => (
                    <View
                        key={actor.id}
                        style={[
                            styles.avatar,
                            {
                                marginLeft: index > 0 ? -8 : 0,
                                zIndex: displayActors.length - index,
                            },
                        ]}
                    >
                        {actor.avatar_url
                            ? (
                                <View
                                    style={[
                                        styles.avatar,
                                        styles.avatarWithImage,
                                    ]}
                                >
                                    <Text style={styles.avatarText}>
                                        {(actor.full_name || actor.username)
                                            .charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                            )
                            : (
                                <View
                                    style={[
                                        styles.avatar,
                                        styles.avatarPlaceholder,
                                    ]}
                                >
                                    <Text style={styles.avatarText}>
                                        {(actor.full_name || actor.username)
                                            .charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                            )}
                    </View>
                ))}
            </View>
        );
    };

    return (
        <Card style={[styles.container, !notification.read && styles.unread]}>
            <TouchableOpacity onPress={handlePress} style={styles.content}>
                <View style={styles.leftSection}>
                    {renderAvatars()}

                    <View style={styles.iconContainer}>
                        <Icon
                            name={getNotificationIcon(notification.type)}
                            size={16}
                            color={notification.read ? "#6D6D6D" : "#DB00FF"}
                        />
                    </View>
                </View>

                <View style={styles.middleSection}>
                    <Text
                        style={[
                            styles.message,
                            !notification.read && styles.unreadText,
                        ]}
                    >
                        {getNotificationMessage(notification)}
                    </Text>

                    {notification.post?.content && (
                        <Text style={styles.postPreview} numberOfLines={1}>
                            "{notification.post.content}"
                        </Text>
                    )}

                    <Text style={styles.timestamp}>
                        {getTimeAgo(notification.latest_created_at)}
                    </Text>
                </View>

                <View style={styles.rightSection}>
                    {!notification.read && <View style={styles.unreadDot} />}

                    <TouchableOpacity
                        onPress={handleDelete}
                        style={styles.deleteButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Icon name="x" size={16} color="#6D6D6D" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Card>
    );
};

// Create default styles (will be overridden by theme system)
const createNotificationCardStyles = (theme: any) => ({
    container: {
        marginVertical: 4,
        marginHorizontal: 16,
    },
    unread: {
        borderLeftWidth: 3,
        borderLeftColor: theme?.colors?.primary?.[500] || "#DB00FF",
    },
    content: {
        flexDirection: "row" as const,
        padding: 12,
        alignItems: "flex-start" as const,
    },
    leftSection: {
        marginRight: 12,
        alignItems: "center" as const,
    },
    avatarContainer: {
        flexDirection: "row" as const,
        marginBottom: 4,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: "#fff",
    },
    avatarWithImage: {
        backgroundColor: "#f3f4f6",
    },
    avatarPlaceholder: {
        backgroundColor: "#e5e7eb",
        alignItems: "center" as const,
        justifyContent: "center" as const,
    },
    avatarText: {
        fontSize: 12,
        fontWeight: "600" as const,
        color: "#374151",
    },
    iconContainer: {
        alignItems: "center" as const,
        justifyContent: "center" as const,
    },
    middleSection: {
        flex: 1,
        marginRight: 8,
    },
    message: {
        fontSize: 14,
        color: "#374151",
        lineHeight: 20,
        marginBottom: 2,
    },
    unreadText: {
        fontWeight: "600" as const,
        color: "#1f2937",
    },
    postPreview: {
        fontSize: 12,
        color: "#6b7280",
        fontStyle: "italic" as const,
        marginBottom: 4,
    },
    timestamp: {
        fontSize: 12,
        color: "#9ca3af",
    },
    rightSection: {
        alignItems: "center" as const,
        justifyContent: "flex-start" as const,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#DB00FF",
        marginBottom: 8,
    },
    deleteButton: {
        padding: 4,
    },
});
