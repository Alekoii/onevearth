import React, { useCallback } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useStyles } from "@/core/theming/useStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "@/core/theming/ThemeProvider";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/base/Button";
import { NotificationCard } from "./NotificationCard";
import { useNotifications } from "../hooks/useNotifications";
import { GroupedNotification, NotificationListProps } from "../types";

export const NotificationList: React.FC<NotificationListProps> = ({
    onNotificationPress,
    EmptyComponent,
    refreshing: externalRefreshing,
    onRefresh: externalOnRefresh,
}) => {
    const styles = useStyles("NotificationList");
    const { theme } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();

    const {
        notifications,
        unreadCount,
        loading,
        refreshing,
        error,
        hasMore,
        refresh,
        loadMore,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearError,
        hasUnreadNotifications,
    } = useNotifications();

    const handleNotificationPress = useCallback(
        (notification: GroupedNotification) => {
            // Handle navigation based on notification type
            if (notification.post_id) {
                // Navigate to post detail
                navigation.navigate(
                    "PostDetail" as never,
                    { postId: notification.post_id } as never,
                );
            }

            // Call custom handler if provided
            onNotificationPress?.(notification);
        },
        [navigation, onNotificationPress],
    );

    const handleMarkAsRead = useCallback((notificationIds: number[]) => {
        markAsRead(notificationIds);
    }, [markAsRead]);

    const handleDelete = useCallback((notificationId: number) => {
        deleteNotification(notificationId);
    }, [deleteNotification]);

    const handleRefresh = useCallback(() => {
        if (externalOnRefresh) {
            externalOnRefresh();
        } else {
            refresh();
        }
    }, [externalOnRefresh, refresh]);

    const handleLoadMore = useCallback(() => {
        if (hasMore && !loading) {
            loadMore();
        }
    }, [hasMore, loading, loadMore]);

    const handleMarkAllAsRead = useCallback(() => {
        markAllAsRead();
    }, [markAllAsRead]);

    const handleRetry = useCallback(() => {
        clearError();
        refresh();
    }, [clearError, refresh]);

    const renderNotificationCard = useCallback(
        ({ item }: { item: GroupedNotification }) => (
            <NotificationCard
                notification={item}
                onPress={handleNotificationPress}
                onMarkRead={handleMarkAsRead}
                onDelete={handleDelete}
            />
        ),
        [handleNotificationPress, handleMarkAsRead, handleDelete],
    );

    const renderHeader = () => {
        if (notifications.length === 0) return null;

        return (
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    {t("navigation.notifications")}
                </Text>

                {hasUnreadNotifications() && (
                    <TouchableOpacity
                        onPress={handleMarkAllAsRead}
                        style={styles.markAllButton}
                    >
                        <Text style={styles.markAllText}>
                            {t("notifications.markAllRead")}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const renderFooter = () => {
        if (!hasMore && notifications.length > 0) {
            return (
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        {t("notifications.noMoreNotifications")}
                    </Text>
                </View>
            );
        }

        if (hasMore && notifications.length > 0) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator
                        size="small"
                        color={theme.colors.primary[500]}
                    />
                </View>
            );
        }

        return null;
    };

    const renderEmpty = () => {
        if (loading) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator
                        size="large"
                        color={theme.colors.primary[500]}
                    />
                    <Text style={styles.loadingText}>
                        {t("notifications.loadingNotifications")}
                    </Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.centerContainer}>
                    <Icon name="alert-triangle" size={48} color="#ef4444" />
                    <Text style={styles.errorTitle}>
                        {t("notifications.errorTitle")}
                    </Text>
                    <Text style={styles.errorMessage}>
                        {error}
                    </Text>
                    <Button onPress={handleRetry} style={styles.retryButton}>
                        {t("common.retry")}
                    </Button>
                </View>
            );
        }

        if (EmptyComponent) {
            return <EmptyComponent />;
        }

        return (
            <View style={styles.centerContainer}>
                <Icon name="bell-off" size={64} color="#9ca3af" />
                <Text style={styles.emptyTitle}>
                    {t("notifications.noNotifications")}
                </Text>
                <Text style={styles.emptyMessage}>
                    {t("notifications.noNotificationsMessage")}
                </Text>
            </View>
        );
    };

    const renderSeparator = () => <View style={styles.separator} />;

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                renderItem={renderNotificationCard}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                ItemSeparatorComponent={renderSeparator}
                refreshControl={
                    <RefreshControl
                        refreshing={externalRefreshing ?? refreshing}
                        onRefresh={handleRefresh}
                        colors={[theme.colors.primary[500]]}
                        tintColor={theme.colors.primary[500]}
                    />
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.3}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={notifications.length === 0
                    ? styles.emptyContainer
                    : undefined}
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={10}
                initialNumToRender={8}
                getItemLayout={(data, index) => ({
                    length: 80, // Approximate height of notification card
                    offset: 80 * index,
                    index,
                })}
            />
        </View>
    );
};

// Default styles (will be enhanced by theme system)
const createNotificationListStyles = (theme: any) => ({
    container: {
        flex: 1,
        backgroundColor: theme?.colors?.surface?.primary || "#ffffff",
    },
    header: {
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,
        alignItems: "center" as const,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme?.colors?.border?.primary || "#e5e7eb",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600" as const,
        color: theme?.colors?.text?.primary || "#1f2937",
    },
    markAllButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: theme?.colors?.primary?.[50] || "#eff6ff",
    },
    markAllText: {
        fontSize: 14,
        fontWeight: "500" as const,
        color: theme?.colors?.primary?.[600] || "#2563eb",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center" as const,
        alignItems: "center" as const,
        paddingHorizontal: 32,
        paddingVertical: 48,
    },
    emptyContainer: {
        flexGrow: 1,
        justifyContent: "center" as const,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: theme?.colors?.text?.secondary || "#6b7280",
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: "600" as const,
        color: "#ef4444",
        marginTop: 16,
        marginBottom: 8,
        textAlign: "center" as const,
    },
    errorMessage: {
        fontSize: 14,
        color: theme?.colors?.text?.secondary || "#6b7280",
        textAlign: "center" as const,
        marginBottom: 24,
        lineHeight: 20,
    },
    retryButton: {
        minWidth: 120,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "600" as const,
        color: theme?.colors?.text?.primary || "#1f2937",
        marginTop: 16,
        marginBottom: 8,
        textAlign: "center" as const,
    },
    emptyMessage: {
        fontSize: 14,
        color: theme?.colors?.text?.secondary || "#6b7280",
        textAlign: "center" as const,
        lineHeight: 20,
    },
    footer: {
        paddingVertical: 16,
        alignItems: "center" as const,
    },
    footerText: {
        fontSize: 14,
        color: theme?.colors?.text?.secondary || "#6b7280",
    },
    separator: {
        height: 1,
        backgroundColor: "transparent",
    },
});
