import { useEffect } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useComponentStyles } from "@/core/theming/useComponentStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { Button } from "@/components/base/Button";
import { profileScreenStyles } from "./ProfileScreen.styles";

export const ProfileScreen = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { profile, loading, loadProfile } = useProfile();
    const styles = useComponentStyles("ProfileScreen", profileScreenStyles);

    useEffect(() => {
        if (user?.id) {
            loadProfile(user.id);
        }
    }, [user?.id]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>{t("common.loading")}</Text>
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Profile not found</Text>
                <Button onPress={() => user?.id && loadProfile(user.id)}>
                    {t("common.retry")}
                </Button>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <ProfileHeader profile={profile} />
        </ScrollView>
    );
};
