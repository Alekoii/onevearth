import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";
import { useComponentStyles } from "@/core/theming/useComponentStyles";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Card } from "@/components/base/Card";
import { Icon } from "@/components/ui/Icon";
import { notificationsScreenStyles } from "./NotificationsScreen.styles";

interface NotificationItemProps {
    notification: {
        id: string;
        type: string;
        read: boolean;
        createdAt: string;
        actorId: string;
    };
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
    const styles = useComponentStyles(
        "NotificationItem",
        notificationsScreenStyles,
        {
            read: notification.read,
        },
    );

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "new_reaction":
                return "heart";
            case "new_comment":
                return "comment";
            case "new_follower":
                return "user";
            case "new_mention":
                return "bell";
            default:
                return "bell";
        }
    };

    const getNotificationText = (type: string) => {
        switch (type) {
            case "new_reaction":
                return "liked your post";
            case "new_comment":
                return "commented on your post";
            case "new_follower":
                return "started following you";
            case "new_mention":
                return "mentioned you";
            default:
                return "sent you a notification";
        }
    };

    return (
        <TouchableOpacity>
            <Card style={styles.notificationCard}>
                <View style={styles.notificationContent}>
                    <View style={styles.iconContainer}>
                        <Icon
                            name={getNotificationIcon(notification.type)}
                            color={styles.icon.color}
                            size={20}
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.notificationText}>
                            {getNotificationText(notification.type)}
                        </Text>
                        <Text style={styles.timestamp}>
                            {new Date(notification.createdAt)
                                .toLocaleDateString()}
                        </Text>
                    </View>
                    {!notification.read && <View style={styles.unreadDot} />}
                </View>
            </Card>
        </TouchableOpacity>
    );
};

export const NotificationsScreen = () => {
    const { t } = useTranslation();
    const { items: notifications } = useAppSelector((state) =>
        state.notifications
    );
    const styles = useComponentStyles(
        "NotificationsScreen",
        notificationsScreenStyles,
    );

    const renderNotification = ({ item }: { item: any }) => (
        <NotificationItem notification={item} />
    );

    const ListEmptyComponent = () => (
        <Card style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications yet</Text>
        </Card>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
                ListEmptyComponent={ListEmptyComponent}
            />
        </View>
    );
};
