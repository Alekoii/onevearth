import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useConfig } from "@/core/config/ConfigProvider";
import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "@/core/theming/ThemeProvider";
import { ExtensionPoint } from "@/core/plugins/ExtensionPoint";

export const HomeScreen = () => {
    const { config } = useConfig();
    const { t } = useTranslation();
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background.primary,
        },
        content: {
            padding: theme.spacing.md,
        },
        title: {
            fontSize: theme.typography.fontSize["2xl"],
            fontWeight: "bold",
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.lg,
            textAlign: "center",
        },
    });

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                <Text style={styles.title}>{config.app.name}</Text>

                <ExtensionPoint
                    name="home.creator"
                    onSubmit={(content: string) => {
                        console.log("Creating post:", content);
                    }}
                />

                <ExtensionPoint
                    name="home.content"
                    config={config}
                />
            </ScrollView>
        </View>
    );
};
