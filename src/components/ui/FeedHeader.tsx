import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useComponentStyles } from "@/core/theming/useComponentStyles";
import { feedHeaderStyles } from "./FeedHeader.styles";

interface TabProps {
    title: string;
    isActive: boolean;
    onPress: () => void;
}

const tabs = ["Feed", "For You", "Location"];

export const FeedHeader = () => {
    const [activeTab, setActiveTab] = useState("Feed");

    const Tab = ({ title, isActive, onPress }: TabProps) => {
        const styles = useComponentStyles("FeedHeader", feedHeaderStyles, {
            isActive,
        });

        return (
            <TouchableOpacity style={styles.tab} onPress={onPress}>
                <Text style={styles.tabText}>{title}</Text>
            </TouchableOpacity>
        );
    };

    const containerStyles = useComponentStyles("FeedHeader", feedHeaderStyles);

    return (
        <View style={containerStyles.container}>
            {tabs.map((tab) => (
                <Tab
                    key={tab}
                    title={tab}
                    isActive={activeTab === tab}
                    onPress={() => setActiveTab(tab)}
                />
            ))}
        </View>
    );
};
