import { useState } from "react";
import { FlatList, View } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";
import { useComponentStyles } from "@/core/theming/useComponentStyles";
import { Input } from "@/components/base/Input";
import { PostCard } from "@/plugins/posts/components/PostCard";
import { searchScreenStyles } from "./SearchScreen.styles";

export const SearchScreen = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const styles = useComponentStyles("SearchScreen", searchScreenStyles);

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
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Input
                    placeholder={t("navigation.search")}
                    value={query}
                    onChangeText={(text) => {
                        setQuery(text);
                        handleSearch(text);
                    }}
                    variant="ghost"
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
