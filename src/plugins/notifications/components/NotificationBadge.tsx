import React from "react";
import { Text, View } from "react-native";
import { useStyles } from "@/core/theming/useStyles";
import { useTheme } from "@/core/theming/ThemeProvider";
import { useNotifications } from "../hooks/useNotifications";

interface NotificationBadgeProps {
    /** Maximum number to display before showing "99+" */
    maxCount?: number;
    /** Custom positioning style */
    style?: any;
    /** Whether to show badge when count is 0 */
    showZero?: boolean;
    /** Custom color for the badge */
    color?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
    maxCount = 99,
    style,
    showZero = false,
    color,
}) => {
    const styles = useStyles("NotificationBadge");
    const { theme } = useTheme();
    const { unreadCount } = useNotifications(true);

    // Don't render if no unread notifications and showZero is false
    if (unreadCount === 0 && !showZero) {
        return null;
    }

    // Format the count display
    const getDisplayCount = (count: number): string => {
        if (count === 0) return "0";
        if (count <= maxCount) return count.toString();
        return `${maxCount}+`;
    };

    // Determine if we need compact styling for large numbers
    const displayText = getDisplayCount(unreadCount);
    const isCompact = displayText.length > 2;

    return (
        <View
            style={[
                styles.container,
                isCompact && styles.containerCompact,
                { backgroundColor: color || theme.colors.primary[500] },
                style,
            ]}
        >
            <Text
                style={[
                    styles.text,
                    isCompact && styles.textCompact,
                ]}
                numberOfLines={1}
            >
                {displayText}
            </Text>
        </View>
    );
};

// Component for tab navigation integration
export const TabNotificationBadge: React.FC = () => {
    return (
        <NotificationBadge
            style={{
                position: "absolute",
                top: -8,
                right: -8,
                minWidth: 18,
                height: 18,
            }}
            maxCount={99}
        />
    );
};

// Default styles
const createNotificationBadgeStyles = (theme: any) => ({
    container: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: theme?.colors?.primary?.[500] || "#ef4444",
        alignItems: "center" as const,
        justifyContent: "center" as const,
        paddingHorizontal: 6,
        borderWidth: 2,
        borderColor: theme?.colors?.surface?.primary || "#ffffff",
    },
    containerCompact: {
        minWidth: 24,
        height: 18,
        borderRadius: 9,
        paddingHorizontal: 4,
    },
    text: {
        fontSize: 11,
        fontWeight: "600" as const,
        color: "#ffffff",
        textAlign: "center" as const,
        includeFontPadding: false,
        textAlignVertical: "center" as const,
    },
    textCompact: {
        fontSize: 10,
        fontWeight: "700" as const,
    },
});

// Hook for getting badge props (useful for custom implementations)
export const useNotificationBadge = (maxCount: number = 99) => {
    const { unreadCount, hasUnreadNotifications } = useNotifications(true);

    const getDisplayCount = (count: number): string => {
        if (count === 0) return "0";
        if (count <= maxCount) return count.toString();
        return `${maxCount}+`;
    };

    return {
        count: unreadCount,
        displayCount: getDisplayCount(unreadCount),
        hasUnread: hasUnreadNotifications(),
        shouldShow: unreadCount > 0,
    };
};
