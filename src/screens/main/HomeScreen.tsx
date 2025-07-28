import { FlatList, View } from "react-native";
import { useComponentStyles } from "@/core/theming/useComponentStyles";
import { usePosts } from "@/hooks/usePosts";
import { PostCreator } from "@/plugins/posts/components/PostCreator";
import { PostCard } from "@/plugins/posts/components/PostCard";
import { homeScreenStyles } from "./HomeScreen.styles";

export const HomeScreen = () => {
    const { posts, loading, refreshPosts, loadMorePosts } = usePosts();
    const styles = useComponentStyles("HomeScreen", homeScreenStyles);

    const renderPost = ({ item }: { item: any }) => <PostCard post={item} />;

    const ListHeaderComponent = () => <PostCreator />;

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
                refreshing={loading}
                onRefresh={refreshPosts}
            />
        </View>
    );
};
