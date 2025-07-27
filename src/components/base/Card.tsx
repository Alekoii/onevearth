import { View, ViewStyle } from "react-native";
import { ReactNode } from "react";
import { useComponentStyles } from "@/core/theming/useComponentStyles";
import { cardStyles } from "./Card.styles";

interface CardProps {
    children: ReactNode;
    style?: ViewStyle;
    padding?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    variant?: "default" | "elevated" | "outlined";
}

export const Card = ({
    children,
    style,
    padding = "md",
    variant = "default",
}: CardProps) => {
    const styles = useComponentStyles("Card", cardStyles, {
        padding,
        variant,
    });

    return (
        <View style={[styles.card, style]}>
            {children}
        </View>
    );
};
