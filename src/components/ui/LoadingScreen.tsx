import { ActivityIndicator, Text, View } from "react-native";
import { useColors } from "@/core/theming/useStyles";
import { useTheme } from "@/core/theming/ThemeProvider";

export const LoadingScreen = () => {
    const colors = useColors();
    const { theme } = useTheme();

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.background.primary,
            }}
        >
            <ActivityIndicator
                size="large"
                color={theme.colors.primary[500]}
            />
            <Text
                style={{
                    marginTop: theme.spacing.md,
                    color: colors.text.secondary,
                    fontSize: theme.typography.fontSize.md,
                }}
            >
                Loading...
            </Text>
        </View>
    );
};
