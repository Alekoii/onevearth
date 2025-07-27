import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";

export const ProfileScreen = () => {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t("navigation.profile")}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
});
