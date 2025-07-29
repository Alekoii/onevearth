import { Text, View } from "react-native";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useTheme } from "@/core/theming/ThemeProvider";
import { NotificationBadgeProps } from "../types";

const selectUnreadCount = (state: any) => state.notifications?.unreadCount || 0;

export const NotificationBadge = (
    { showZero = false, maxCount = 99 }: NotificationBadgeProps,
) => {
    const unreadCount = useAppSelector(selectUnreadCount);
    const { theme } = useTheme();

    if (!showZero && unreadCount === 0) {
        return null;
    }

    const displayCount = unreadCount > maxCount
        ? `${maxCount}+`
        : unreadCount.toString();

    return (
        <View
            style={{
                backgroundColor: theme.colors.error[500],
                borderRadius: theme.borderRadius.full,
                minWidth: 16,
                height: 16,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 4,
            }}
        >
            <Text
                style={{
                    color: theme.colors.text.inverse,
                    fontSize: 10,
                    fontWeight: "600",
                    textAlign: "center",
                }}
            >
                {displayCount}
            </Text>
        </View>
    );
};

// Re-exports for the plugin system
export * from "../types";

export const TabNotificationBadge = () => {
    const unreadCount = useAppSelector(selectUnreadCount);
    const { theme } = useTheme();

    if (unreadCount === 0) {
        return null;
    }

    const displayCount = unreadCount > 99 ? "99+" : unreadCount.toString();

    return (
        <View
            style={{
                position: "absolute",
                top: -2,
                right: -6,
                backgroundColor: theme.colors.error[500],
                borderRadius: theme.borderRadius.full,
                minWidth: 16,
                height: 16,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 4,
                borderWidth: 2,
                borderColor: theme.colors.surface.primary,
            }}
        >
            <Text
                style={{
                    color: theme.colors.text.inverse,
                    fontSize: 10,
                    fontWeight: "600",
                    textAlign: "center",
                    lineHeight: 12,
                }}
            >
                {displayCount}
            </Text>
        </View>
    );
};
