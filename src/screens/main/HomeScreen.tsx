import { ScrollView, Text, View } from "react-native";
import { useStyles } from "@/core/theming/useStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { ExtensionPoint } from "@/core/plugins/ExtensionPoint";

export const HomeScreen = () => {
    const styles = useStyles("Screen");
    const { t } = useTranslation();

    return (
        <View style={styles.base}>
            <ExtensionPoint
                name="home.content"
                fallback={() => (
                    <ScrollView style={styles.base}>
                        <View style={styles.content}>
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
                                        color: "#6D6D6D",
                                        fontSize: 16,
                                    }}
                                >
                                    No posts available
                                </Text>
                                <Text
                                    style={{
                                        textAlign: "center",
                                        color: "#999",
                                        fontSize: 14,
                                        marginTop: 8,
                                    }}
                                >
                                    Enable the posts plugin to see content
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                )}
            />
        </View>
    );
};
