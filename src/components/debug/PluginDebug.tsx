import { ScrollView, Text, View } from "react-native";
import { useEnhancedPlugins } from "@/core/plugins/PluginProvider";
import { useStyles } from "@/core/theming/useStyles";
import { useTheme } from "@/core/theming/ThemeProvider";

export const PluginDebug = () => {
    const { plugins, enabledPlugins, getExtensions } = useEnhancedPlugins();
    const { theme } = useTheme();
    const styles = useStyles("Screen");

    const notificationExtensions = getExtensions("notifications.content");

    return (
        <ScrollView style={styles.base}>
            <View style={{ padding: 16 }}>
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: theme.colors.text.primary,
                        marginBottom: 16,
                    }}
                >
                    Plugin Debug Info
                </Text>

                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: theme.colors.text.primary,
                        marginBottom: 8,
                    }}
                >
                    All Plugins ({plugins.length}):
                </Text>
                {plugins.map((plugin) => (
                    <Text
                        key={plugin.id}
                        style={{
                            color: theme.colors.text.secondary,
                            marginLeft: 16,
                            marginBottom: 4,
                        }}
                    >
                        • {plugin.id}: {plugin.state}
                    </Text>
                ))}

                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: theme.colors.text.primary,
                        marginTop: 16,
                        marginBottom: 8,
                    }}
                >
                    Enabled Plugins ({enabledPlugins.length}):
                </Text>
                {enabledPlugins.map((plugin) => (
                    <Text
                        key={plugin.id}
                        style={{
                            color: theme.colors.success[500],
                            marginLeft: 16,
                            marginBottom: 4,
                        }}
                    >
                        • {plugin.id}: {plugin.state}
                    </Text>
                ))}

                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: theme.colors.text.primary,
                        marginTop: 16,
                        marginBottom: 8,
                    }}
                >
                    Notification Extensions ({notificationExtensions.length}):
                </Text>
                {notificationExtensions.length > 0
                    ? (
                        notificationExtensions.map((ext) => (
                            <Text
                                key={ext.id}
                                style={{
                                    color: theme.colors.primary[500],
                                    marginLeft: 16,
                                    marginBottom: 4,
                                }}
                            >
                                • {ext.id} (priority: {ext.priority})
                            </Text>
                        ))
                    )
                    : (
                        <Text
                            style={{
                                color: theme.colors.error[500],
                                marginLeft: 16,
                                fontStyle: "italic",
                            }}
                        >
                            No extensions found for "notifications.content"
                        </Text>
                    )}
            </View>
        </ScrollView>
    );
};
