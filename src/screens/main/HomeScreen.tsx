import { FlatList, View } from "react-native";
import { useTheme } from "@/core/theming/ThemeProvider";
import { useComponentStyles } from "@/core/theming/useComponentStyles";
import { usePosts } from "@/hooks/usePosts";
import { PostCreator } from "@/plugins/posts/components/PostCreator";
import { PostCard } from "@/plugins/posts/components/PostCard";
import { createStyles } from "@/core/theming/createStyledComponent";

const homeScreenStyles = createStyles((theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    content: {
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.lg,
    },
}));

export const HomeScreen = () => {
    const { theme } = useTheme();
    const { posts, loading, refreshPosts, loadMorePosts } = usePosts();
    const styles = useComponentStyles("HomeScreen", homeScreenStyles);

    const renderPost = ({ item }: { item: any }) => <PostCard post={item} />;

    const ListHeaderComponent = () => (
        <View style={{ paddingTop: theme.spacing.md }}>
            <PostCreator />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
                ListHeaderComponent={ListHeaderComponent}
                onEndReached={loadMorePosts}
                onEndReachedThreshold={0.1}
            />
        </View>
    );
};
