import { ScrollView, Text, View } from "react-native";
import { useColors, useStyles } from "@/core/theming/useStyles";
import { useTheme } from "@/core/theming/ThemeProvider";
import { useTranslation } from "@/hooks/useTranslation";
import { ExtensionPoint } from "@/core/plugins/ExtensionPoint";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const CreateScreen = () => {
    const styles = useStyles("Screen");
    const colors = useColors();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            style={[
                styles.base,
                { backgroundColor: colors.background.primary },
            ]}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View
                style={[
                    styles.base,
                    {
                        paddingTop: insets.top,
                        backgroundColor: colors.background.primary,
                    },
                ]}
            >
                <ExtensionPoint
                    name="create.content"
                    fallback={() => (
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 24,
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: "center",
                                    color: colors.text.secondary,
                                    fontSize: 16,
                                }}
                            >
                                No create extensions available
                            </Text>
                            <Text
                                style={{
                                    textAlign: "center",
                                    color: colors.text.tertiary,
                                    fontSize: 14,
                                    marginTop: 8,
                                }}
                            >
                                Enable plugins to create content
                            </Text>
                        </View>
                    )}
                />
            </View>
        </ScrollView>
    );
};
