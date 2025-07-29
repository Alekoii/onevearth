import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors, useStyles } from "@/core/theming/useStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "@/core/theming/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { ExtensionPoint } from "@/core/plugins/ExtensionPoint";
import { Button } from "@/components/base/Button";
import { Card } from "@/components/base/Card";
import { Icon } from "@/components/ui/Icon";

export const ProfileScreen = () => {
    const styles = useStyles("Screen");
    const colors = useColors();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const { user, signOut } = useAuth();
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            style={[
                styles.base,
                {
                    paddingTop: insets.top,
                    backgroundColor: colors.background.primary,
                },
            ]}
        >
            <ExtensionPoint
                name="profile.header"
                user={user}
                fallback={() => (
                    <Card style={{ margin: 16 }}>
                        <View style={{ alignItems: "center", padding: 16 }}>
                            <View
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 40,
                                    backgroundColor: colors.surface.secondary,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: 16,
                                }}
                            >
                                <Icon
                                    name="user"
                                    size={40}
                                    color={colors.text.secondary}
                                />
                            </View>
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: "600",
                                    marginBottom: 4,
                                    color: colors.text.primary,
                                }}
                            >
                                {user?.email || "User"}
                            </Text>
                            <Text
                                style={{
                                    color: colors.text.secondary,
                                    fontSize: 14,
                                }}
                            >
                                Enable profile plugin for full profile features
                            </Text>
                        </View>
                    </Card>
                )}
            />

            <ExtensionPoint
                name="profile.content"
                user={user}
            />

            <View style={styles.content}>
                <Card>
                    <Button onPress={signOut} variant="ghost">
                        {t("auth.logout")}
                    </Button>
                </Card>
            </View>
        </ScrollView>
    );
};
