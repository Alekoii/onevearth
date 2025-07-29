import { useState } from "react";
import { FlatList, View } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";
import { useColors, useStyles } from "@/core/theming/useStyles";
import { useTheme } from "@/core/theming/ThemeProvider";
import { Input } from "@/components/base/Input";
import { PostCard } from "@/plugins/posts/components/PostCard";

export const SearchScreen = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const styles = useStyles("Screen");
    const colors = useColors();
    const { theme } = useTheme();

    const handleSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            setResults([]);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderResult = ({ item }: { item: any }) => <PostCard post={item} />;

    return (
        <View
            style={[
                styles.base,
                { backgroundColor: colors.background.primary },
            ]}
        >
            <View style={styles.content}>
                <Input
                    placeholder={t("navigation.search")}
                    value={query}
                    onChangeText={(text) => {
                        setQuery(text);
                        handleSearch(text);
                    }}
                />
            </View>

            <FlatList
                data={results}
                renderItem={renderResult}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            />
        </View>
    );
};
