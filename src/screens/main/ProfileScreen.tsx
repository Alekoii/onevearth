import { useEffect } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useStyles } from "@/core/theming/useStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { Button } from "@/components/base/Button";
import { Card } from "@/components/base/Card";

export const ProfileScreen = () => {
    const { t } = useTranslation();
    const { user, signOut } = useAuth();
    const { profile, loading, loadProfile } = useProfile();
    const styles = useStyles("Screen");

    useEffect(() => {
        if (user?.id) {
            loadProfile(user.id);
        }
    }, [user?.id]);

    if (loading) {
        return (
            <View
                style={[styles.base, {
                    justifyContent: "center",
                    alignItems: "center",
                }]}
            >
                <ActivityIndicator size="large" />
                <Text style={{ marginTop: 16, color: "#6D6D6D" }}>
                    {t("common.loading")}
                </Text>
            </View>
        );
    }

    if (!profile) {
        return (
            <View
                style={[styles.base, {
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 24,
                }]}
            >
                <Text
                    style={{
                        color: "#ef4444",
                        textAlign: "center",
                        marginBottom: 16,
                    }}
                >
                    Profile not found
                </Text>
                <Button onPress={() => user?.id && loadProfile(user.id)}>
                    {t("common.retry")}
                </Button>
            </View>
        );
    }

    return (
        <ScrollView style={styles.base}>
            <ProfileHeader profile={profile} />

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
