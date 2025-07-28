import { ScrollView, Text, View } from "react-native";
import { useStyles } from "@/core/theming/useStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { ExtensionPoint } from "@/core/plugins/ExtensionPoint";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const CreateScreen = () => {
    const styles = useStyles("Screen");
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    return (
        <ScrollView style={styles.base}>
            <View style={[styles.base, { paddingTop: insets.top }]}>
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
                                    color: "#6D6D6D",
                                    fontSize: 16,
                                }}
                            >
                                No create extensions available
                            </Text>
                            <Text
                                style={{
                                    textAlign: "center",
                                    color: "#999",
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
