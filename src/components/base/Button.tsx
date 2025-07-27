import { ActivityIndicator, Pressable, Text } from "react-native";
import { ReactNode } from "react";
import { useComponentStyles } from "@/core/theming/useComponentStyles";
import { buttonStyles } from "./Button.styles";

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
    const styles = useComponentStyles("Button", buttonStyles, {
        variant,
        size,
        disabled,
        loading,
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
