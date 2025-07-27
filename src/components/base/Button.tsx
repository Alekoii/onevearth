import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { ReactNode } from "react";
import { useTheme } from "@/core/theming/ThemeProvider";

interface ButtonProps {
    onPress: () => void;
    children: ReactNode;
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    loading?: boolean;
}

export const Button = ({
    onPress,
    children,
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
}: ButtonProps) => {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        button: {
            borderRadius: theme.borderRadius.md,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: theme.spacing[
                size === "sm"
                    ? "sm"
                    : size === "lg"
                    ? "lg"
                    : "md"
            ],
            paddingVertical: theme.spacing[size === "sm" ? "xs" : "sm"],
            backgroundColor: variant === "primary"
                ? theme.colors.primary[500]
                : variant === "secondary"
                ? theme.colors.surface.secondary
                : "transparent",
            borderWidth: variant === "ghost" ? 1 : 0,
            borderColor: theme.colors.border.primary,
            opacity: disabled ? 0.6 : 1,
        },
        text: {
            color: variant === "primary"
                ? theme.colors.text.inverse
                : theme.colors.text.primary,
            fontSize: theme.typography.fontSize[
                size === "sm"
                    ? "sm"
                    : size === "lg"
                    ? "lg"
                    : "md"
            ],
            fontWeight: "600",
        },
    });

    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                { opacity: pressed ? 0.8 : (disabled ? 0.6 : 1) },
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading
                ? <ActivityIndicator color={styles.text.color} />
                : <Text style={styles.text}>{children}</Text>}
        </Pressable>
    );
};
