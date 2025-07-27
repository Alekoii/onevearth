import { ReactNode } from "react";
import { View } from "react-native";
import { useComponentStyles } from "@/core/theming/useComponentStyles";
import { feedLayoutStyles } from "./FeedLayout.styles";

interface FeedLayoutProps {
    children: ReactNode;
    scrollable?: boolean;
}

export const FeedLayout = (
    { children, scrollable = false }: FeedLayoutProps,
) => {
    const styles = useComponentStyles("FeedLayout", feedLayoutStyles);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};
