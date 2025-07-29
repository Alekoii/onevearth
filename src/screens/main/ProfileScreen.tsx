import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "@/core/theming/useStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";
import { ExtensionPoint } from "@/core/plugins/ExtensionPoint";
import { Button } from "@/components/base/Button";
import { Card } from "@/components/base/Card";
import { Icon } from "@/components/ui/Icon";

export const ProfileScreen = () => {
    const styles = useStyles("Screen");
    const { t } = useTranslation();
    const { user, signOut } = useAuth();
    const insets = useSafeAreaInsets();

    return (
        <ScrollView style={[styles.base, { paddingTop: insets.top }]}>
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
                                    backgroundColor: "#f3f4f6",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: 16,
                                }}
                            >
                                <Icon name="user" size={40} color="#6D6D6D" />
                            </View>
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: "600",
                                    marginBottom: 4,
                                }}
                            >
                                {user?.email || "User"}
                            </Text>
                            <Text style={{ color: "#6D6D6D", fontSize: 14 }}>
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
