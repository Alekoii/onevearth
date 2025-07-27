import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/core/theming/ThemeProvider";
import { useTranslation } from "@/hooks/useTranslation";

export const LoadingScreen = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.background.primary,
        },
        text: {
            marginTop: theme.spacing.md,
            color: theme.colors.text.secondary,
            fontSize: theme.typography.fontSize.md,
        },
    });

    return (
        <View style={styles.container}>
            <ActivityIndicator
                size="large"
                color={theme.colors.primary[500]}
            />
            <Text style={styles.text}>{t("common.loading")}</Text>
        </View>
    );
};
