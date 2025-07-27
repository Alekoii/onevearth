import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "@/core/theming/ThemeProvider";

export const NotificationsScreen = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.background.primary,
        },
        title: {
            fontSize: theme.typography.fontSize["2xl"],
            fontWeight: "bold",
            color: theme.colors.text.primary,
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t("navigation.notifications")}</Text>
        </View>
    );
};
