import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors, useStyles } from "@/core/theming/useStyles";
import { useTheme } from "@/core/theming/ThemeProvider";
import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { Card } from "@/components/base/Card";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";

export const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signIn, loading } = useAuth();
    const { t } = useTranslation();
    const styles = useStyles("Screen");
    const colors = useColors();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    const handleSignIn = () => signIn(email, password);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                padding: 16,
                paddingTop: insets.top + 16,
                paddingBottom: insets.bottom + 16,
                backgroundColor: colors.background.primary,
            }}
        >
            <Card>
                <Input
                    label={t("auth.email")}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Input
                    label={t("auth.password")}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <Button
                    onPress={handleSignIn}
                    loading={loading}
                    disabled={!email || !password}
                >
                    {t("auth.login")}
                </Button>
            </Card>
        </View>
    );
};
