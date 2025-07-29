import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors, useStyles } from "@/core/theming/useStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "@/core/theming/ThemeProvider";
import { ExtensionPoint } from "@/core/plugins/ExtensionPoint";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";

type NotificationsScreenNavigationProp = StackNavigationProp<
    RootStackParamList
>;

export const NotificationsScreen = () => {
    const styles = useStyles("Screen");
    const colors = useColors();
    const { t } = useTranslation();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NotificationsScreenNavigationProp>();

    const handleNotificationPress = (notification: any) => {
        if (notification.post_id) {
            navigation.navigate("PostDetail", { postId: notification.post_id });
        }
    };

    return (
        <View
            style={[
                {
                    flex: 1,
                    paddingTop: insets.top,
                    backgroundColor: colors.background.primary,
                },
            ]}
        >
            <ExtensionPoint
                name="notifications.content"
                autoRefresh={true}
                onNotificationPress={handleNotificationPress}
                fallback={() => (
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
                                textAlign: "center",
                                color: theme.colors.text.secondary,
                                fontSize: theme.typography.fontSize.lg,
                                fontWeight: "600",
                                marginBottom: theme.spacing.sm,
                            }}
                        >
                            Notifications Unavailable
                        </Text>
                        <Text
                            style={{
                                textAlign: "center",
                                color: theme.colors.text.tertiary,
                                fontSize: theme.typography.fontSize.sm,
                                lineHeight: 20,
                            }}
                        >
                            Enable the notifications plugin to see your
                            notifications
                        </Text>
                    </View>
                )}
            />
        </View>
    );
};
