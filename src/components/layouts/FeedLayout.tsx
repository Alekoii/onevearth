import { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { useComponentStyles } from "@/core/theming/useComponentStyles";
import { feedLayoutStyles } from "./FeedLayout.styles";

interface FeedLayoutProps {
    children: ReactNode;
}

export const FeedLayout = ({ children }: FeedLayoutProps) => {
    const styles = useComponentStyles("FeedLayout", feedLayoutStyles);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                {children}
            </ScrollView>
        </View>
    );
};
