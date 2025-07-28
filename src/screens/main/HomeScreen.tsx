import { FlatList, View } from "react-native";
import { useStyles } from "@/core/theming/useStyles";
import { usePosts } from "@/hooks/usePosts";
import { PostCreator } from "@/plugins/posts/components/PostCreator";
import { PostCard } from "@/plugins/posts/components/PostCard";

export const HomeScreen = () => {
    const { posts, loading, refreshPosts, loadMorePosts } = usePosts();
    const styles = useStyles("Screen");

    const renderPost = ({ item }: { item: any }) => <PostCard post={item} />;

    const ListHeaderComponent = () => <PostCreator />;

    return (
        <View style={styles.base}>
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
                ListHeaderComponent={ListHeaderComponent}
                onEndReached={loadMorePosts}
                onEndReachedThreshold={0.1}
                refreshing={loading}
                onRefresh={refreshPosts}
            />
        </View>
    );
};
