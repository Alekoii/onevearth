import { View, ViewStyle } from "react-native";
import { ReactNode } from "react";
import { useStyles } from "@/core/theming/useStyles";

interface CardProps {
    children: ReactNode;
    style?: ViewStyle;
    variant?: "default" | "elevated" | "outlined";
    padding?: "sm" | "md" | "lg";
}

export const Card = ({
    children,
    style,
    variant = "default",
    padding = "md",
}: CardProps) => {
    const styles = useStyles("Card", { variant, padding });

    return (
        <View style={[styles.container, style]}>
            {children}
        </View>
    );
};
