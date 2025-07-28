import { FlatList, RefreshControl, Text, View } from "react-native";
import { useTheme } from "@/core/theming/ThemeProvider";
import { useTranslation } from "@/hooks/useTranslation";
import { useStyles } from "@/core/theming/useStyles";
import { usePosts } from "@/hooks/usePosts";
import { Card } from "@/components/base/Card";
import { PostCard } from "./PostCard";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

export const PostList = () => {
    try {
        const { theme } = useTheme();
        const { t } = useTranslation();
        const { posts, loading, refreshPosts, loadMorePosts } = usePosts();
        const styles = useStyles("PostList");

        const renderPost = ({ item }: { item: any }) => (
            <PostCard post={item} />
        );

        const ListHeaderComponent = () => (
            <Text style={styles.title}>{t("posts.posts")}</Text>
        );

        const ListEmptyComponent = () => (
            <Card style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                    No posts yet. Create your first post!
                </Text>
            </Card>
        );

        return (
            <View style={styles.container}>
                <FlatList
                    data={posts}
                    renderItem={renderPost}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.list}
                    ListHeaderComponent={ListHeaderComponent}
                    ListEmptyComponent={!loading ? ListEmptyComponent : null}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={refreshPosts}
                            tintColor={theme.colors.primary[500]}
                        />
                    }
                    onEndReached={loadMorePosts}
                    onEndReachedThreshold={0.1}
                />
            </View>
        );
    } catch (error) {
        console.error("PostList error:", error);
        return <LoadingScreen />;
    }
};
