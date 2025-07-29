import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "@/core/theming/useStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { ExtensionPoint } from "@/core/plugins/ExtensionPoint";

export const NotificationsScreen = () => {
    const styles = useStyles("Screen");
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.base, { paddingTop: insets.top }]}>
            <ExtensionPoint
                name="notifications.content"
                fallback={() => (
                    <View
                        style={[styles.base, {
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 24,
                        }]}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                color: "#6D6D6D",
                                fontSize: 16,
                                marginBottom: 8,
                            }}
                        >
                            {t("navigation.notifications")}
                        </Text>
                        <Text
                            style={{
                                textAlign: "center",
                                color: "#999",
                                fontSize: 14,
                            }}
                        >
                            Enable notifications plugin to see your
                            notifications
                        </Text>
                    </View>
                )}
            />
        </View>
    );
};
