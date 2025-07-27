import { StyleSheet, View, ViewStyle } from "react-native";
import { ReactNode } from "react";
import { useTheme } from "@/core/theming/ThemeProvider";

interface CardProps {
    children: ReactNode;
    style?: ViewStyle;
    padding?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

export const Card = ({ children, style, padding = "md" }: CardProps) => {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        card: {
            backgroundColor: theme.colors.surface.primary,
            borderRadius: theme.borderRadius.lg,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            padding: theme.spacing[padding],
        },
    });

    return (
        <View style={[styles.card, style]}>
            {children}
        </View>
    );
};
