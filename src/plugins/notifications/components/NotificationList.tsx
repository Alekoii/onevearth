import { useEffect } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { useTheme } from "@/core/theming/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/base/Button";
import { NotificationItem } from "./NotificationItem";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationListProps } from "../types";

export const NotificationList = ({
    autoRefresh = true,
    onNotificationPress,
}: NotificationListProps) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const {
        notifications,
        loading,
        refreshing,
        loadingMore,
        error,
        hasMore,
        unreadCount,
        fetchNotifications,
        refreshNotifications,
        loadMoreNotifications,
        markAsRead,
        markAllAsRead,
    } = useNotifications({ autoRefresh });

    useEffect(() => {
        if (user?.id && notifications.length === 0 && !loading) {
            fetchNotifications();
        }
    }, [user?.id]);

    const handleLoadMore = () => {
        if (!loadingMore && hasMore && user?.id) {
            loadMoreNotifications();
        }
    };

    const handleRefresh = () => {
        if (user?.id) {
            refreshNotifications();
        }
    };

    const handleMarkAllAsRead = () => {
        if (user?.id && unreadCount > 0) {
            markAllAsRead();
        }
    };

    const renderNotification = ({ item }: { item: any }) => (
        <NotificationItem
            notification={item}
            onPress={onNotificationPress}
            onMarkAsRead={markAsRead}
        />
    );

    const renderEmpty = () => (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 32,
                minHeight: 400, // Ensure it takes enough space to be visible
            }}
        >
            <View
                style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: theme.colors.surface.secondary,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: theme.spacing.md,
                }}
            >
                <Text style={{ fontSize: 24 }}>🔔</Text>
            </View>
            <Text
                style={{
                    color: theme.colors.text.secondary,
                    fontSize: theme.typography.fontSize.lg,
                    textAlign: "center",
                    fontWeight: "600",
                    marginBottom: theme.spacing.xs,
                }}
            >
                No notifications yet
            </Text>
            <Text
                style={{
                    color: theme.colors.text.tertiary,
                    fontSize: theme.typography.fontSize.sm,
                    textAlign: "center",
                    lineHeight: 20,
                    maxWidth: 280,
                }}
            >
                When people like, comment, or follow you, you'll see those
                notifications here
            </Text>
        </View>
    );

    const renderError = () => (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 32,
            }}
        >
            <Text
                style={{
                    color: theme.colors.error[500],
                    fontSize: theme.typography.fontSize.lg,
                    textAlign: "center",
                    marginBottom: theme.spacing.md,
                }}
            >
                Failed to load notifications
            </Text>
            <Button
                onPress={fetchNotifications}
            >
                Try Again
            </Button>
        </View>
    );

    const renderFooter = () => {
        if (!loadingMore) return null;

        return (
            <View
                style={{
                    padding: theme.spacing.md,
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        color: theme.colors.text.secondary,
                        fontSize: theme.typography.fontSize.sm,
                    }}
                >
                    Loading more...
                </Text>
            </View>
        );
    };

    const renderHeader = () => {
        if (unreadCount === 0) return null;

        return (
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: theme.spacing.md,
                    backgroundColor: theme.colors.surface.secondary,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border.primary,
                }}
            >
                <Text
                    style={{
                        color: theme.colors.text.primary,
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: "600",
                    }}
                >
                    {unreadCount} unread
                </Text>
                <Button
                    onPress={handleMarkAllAsRead}
                    variant="ghost"
                    size="sm"
                >
                    Mark all as read
                </Button>
            </View>
        );
    };

    if (error && notifications.length === 0) {
        return renderError();
    }

    return (
        <>
            {renderHeader()}
            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[theme.colors.primary[500]]}
                        tintColor={theme.colors.primary[500]}
                    />
                }
                ListEmptyComponent={!loading ? renderEmpty : null}
                ListFooterComponent={renderFooter}
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </>
    );
};

// Re-exports
export * from "../types";
