import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors, useStyles } from "@/core/theming/useStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "@/core/theming/ThemeProvider";
import { useConfig } from "@/core/config/ConfigProvider";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/base/Card";
import { Button } from "@/components/base/Button";
import { Icon } from "@/components/ui/Icon";

export const SettingsScreen = () => {
    const styles = useStyles("Screen");
    const colors = useColors();
    const { t } = useTranslation();
    const { theme, themeName, setTheme, availableThemes } = useTheme();
    const { config, updateConfig } = useConfig();
    const { signOut } = useAuth();
    const insets = useSafeAreaInsets();

    const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
        setTheme(newTheme);
    };

    const handleTextSizeChange = (increase: boolean) => {
        const currentLargeText = config.ui?.accessibility?.largeText || false;
        updateConfig({
            ui: {
                ...config.ui,
                accessibility: {
                    ...config.ui?.accessibility,
                    largeText: increase
                        ? true
                        : currentLargeText
                        ? false
                        : false,
                },
            },
        });
    };

    const isLargeText = config.ui?.accessibility?.largeText || false;

    return (
        <ScrollView
            style={[
                styles.base,
                {
                    paddingTop: insets.top + 20,
                    backgroundColor: colors.background.primary,
                },
            ]}
        >
            <View style={styles.content}>
                <Text
                    style={{
                        fontSize: 24,
                        fontWeight: "bold",
                        color: theme.colors.text.primary,
                        marginBottom: 24,
                        paddingHorizontal: 4,
                    }}
                >
                    {t("settings.title")}
                </Text>

                <Card style={{ marginBottom: 16 }}>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "600",
                            color: theme.colors.text.primary,
                            marginBottom: 16,
                        }}
                    >
                        {t("settings.appearance")}
                    </Text>

                    <View style={{ marginBottom: 20 }}>
                        <Text
                            style={{
                                fontSize: 16,
                                color: theme.colors.text.secondary,
                                marginBottom: 12,
                            }}
                        >
                            Theme
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                gap: 12,
                            }}
                        >
                            {availableThemes.map((themeOption) => (
                                <TouchableOpacity
                                    key={themeOption.name}
                                    style={{
                                        flex: 1,
                                        padding: 12,
                                        borderRadius: 8,
                                        borderWidth: 2,
                                        borderColor:
                                            themeName === themeOption.name
                                                ? theme.colors.primary[500]
                                                : theme.colors.border.primary,
                                        backgroundColor:
                                            themeName === themeOption.name
                                                ? theme.colors.primary[50]
                                                : theme.colors.surface
                                                    .secondary,
                                        alignItems: "center",
                                    }}
                                    onPress={() =>
                                        handleThemeChange(
                                            themeOption.name as any,
                                        )}
                                >
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight:
                                                themeName === themeOption.name
                                                    ? "600"
                                                    : "normal",
                                            color:
                                                themeName === themeOption.name
                                                    ? theme.colors.primary[700]
                                                    : theme.colors.text.primary,
                                        }}
                                    >
                                        {themeOption.displayName}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View>
                        <Text
                            style={{
                                fontSize: 16,
                                color: theme.colors.text.secondary,
                                marginBottom: 12,
                            }}
                        >
                            Text Size
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                gap: 12,
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    padding: 12,
                                    borderRadius: 8,
                                    borderWidth: 2,
                                    borderColor: !isLargeText
                                        ? theme.colors.primary[500]
                                        : theme.colors.border.primary,
                                    backgroundColor: !isLargeText
                                        ? theme.colors.primary[50]
                                        : theme.colors.surface.secondary,
                                    alignItems: "center",
                                }}
                                onPress={() => handleTextSizeChange(false)}
                            >
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: !isLargeText
                                            ? "600"
                                            : "normal",
                                        color: !isLargeText
                                            ? theme.colors.primary[700]
                                            : theme.colors.text.primary,
                                    }}
                                >
                                    Normal
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    padding: 12,
                                    borderRadius: 8,
                                    borderWidth: 2,
                                    borderColor: isLargeText
                                        ? theme.colors.primary[500]
                                        : theme.colors.border.primary,
                                    backgroundColor: isLargeText
                                        ? theme.colors.primary[50]
                                        : theme.colors.surface.secondary,
                                    alignItems: "center",
                                }}
                                onPress={() => handleTextSizeChange(true)}
                            >
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: isLargeText
                                            ? "600"
                                            : "normal",
                                        color: isLargeText
                                            ? theme.colors.primary[700]
                                            : theme.colors.text.primary,
                                    }}
                                >
                                    Large
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Card>

                <Card style={{ marginBottom: 16 }}>
                    <Button onPress={signOut} variant="ghost">
                        {t("auth.logout")}
                    </Button>
                </Card>
            </View>
        </ScrollView>
    );
};
