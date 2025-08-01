import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useColors, useStyles } from "@/core/theming/useStyles";
import { useTheme } from "@/core/theming/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { ExtensionPoint } from "@/core/plugins/ExtensionPoint";
import { Icon } from "@/components/ui/Icon";

export const HomeScreen = () => {
    const styles = useStyles("Screen");
    const colors = useColors();
    const { theme } = useTheme();
    const { user } = useAuth();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const handleProfilePress = () => {
        navigation.navigate("Profile" as never);
    };

    return (
        <View
            style={[
                styles.base,
                {
                    paddingTop: insets.top,
                    backgroundColor: colors.background.primary,
                },
            ]}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: theme.colors.surface.primary,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border.primary,
                }}
            >
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: theme.colors.text.primary,
                    }}
                >
                    OneVEarth
                </Text>

                <TouchableOpacity
                    onPress={handleProfilePress}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 4,
                        borderRadius: 20,
                    }}
                    activeOpacity={0.7}
                >
                    {user?.user_metadata?.avatar_url
                        ? (
                            <Image
                                source={{ uri: user.user_metadata.avatar_url }}
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 16,
                                    borderWidth: 2,
                                    borderColor: theme.colors.border.secondary,
                                }}
                            />
                        )
                        : (
                            <View
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 16,
                                    backgroundColor:
                                        theme.colors.surface.secondary,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderWidth: 2,
                                    borderColor: theme.colors.border.secondary,
                                }}
                            >
                                <Icon
                                    name="user"
                                    size={16}
                                    color={theme.colors.text.secondary}
                                />
                            </View>
                        )}
                </TouchableOpacity>
            </View>

            <ExtensionPoint
                name="home.content"
                autoRefresh={true}
                autoRefreshInterval={300000}
                prefetchThreshold={3}
            />
        </View>
    );
};
