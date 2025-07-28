import { useCallback, useEffect } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "@/core/theming/useStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { useEnhancedPlugins } from "@/core/plugins/PluginProvider";
import { PostCard } from "./PostCard";
import { PostService } from "../services/PostService";
import {
    selectHasMorePosts,
    selectPosts,
    selectPostsLoading,
    selectPostsRefreshing,
} from "../store/selectors";
import {
    appendPosts,
    setError,
    setLoading,
    setPosts,
    setRefreshing,
} from "../store/postsSlice";
import { Post } from "../types";

interface PostListProps {
    variant?: "default" | "compact";
    userId?: string;
    emptyMessage?: string;
}

export const PostList = ({
    variant = "default",
    userId,
    emptyMessage,
}: PostListProps) => {
    const styles = useStyles("PostList", { variant });
    const { t } = useTranslation();
    const { pluginManager } = useEnhancedPlugins();
    const insets = useSafeAreaInsets();

    const posts = useSelector(selectPosts);
    const loading = useSelector(selectPostsLoading);
    const refreshing = useSelector(selectPostsRefreshing);
    const hasMore = useSelector(selectHasMorePosts);

    const store = pluginManager.getStore();

    const loadPosts = useCallback(async (refresh = false) => {
        try {
            store.dispatch(refresh ? setRefreshing(true) : setLoading(true));

            const page = refresh ? 0 : Math.floor(posts.length / 20);
            const newPosts = userId
                ? await PostService.fetchUserPosts(userId, page)
                : await PostService.fetchPosts(page);

            if (refresh) {
                store.dispatch(setPosts(newPosts));
            } else {
                store.dispatch(appendPosts(newPosts));
            }
        } catch (error) {
            store.dispatch(setError((error as Error).message));
        } finally {
            store.dispatch(setLoading(false));
            store.dispatch(setRefreshing(false));
        }
    }, [posts.length, userId, store]);

    useEffect(() => {
        if (posts.length === 0) {
            loadPosts(true);
        }
    }, [loadPosts, posts.length]);

    const handleRefresh = () => {
        loadPosts(true);
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            loadPosts(false);
        }
    };

    const renderPost = useCallback(({ item }: { item: Post }) => (
        <PostCard
            post={item}
            variant={variant}
            onPress={() => {
                console.log("Post pressed:", item.id);
            }}
            onUserPress={() => {
                console.log("User pressed:", item.user_id);
            }}
        />
    ), [variant]);

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
                {emptyMessage || t("posts.noPosts")}
            </Text>
        </View>
    );

    const renderFooter = () => {
        if (!loading || refreshing) return null;

        return (
            <View style={styles.footerLoader}>
                <Text style={styles.loadingText}>
                    {t("common.loading")}
                </Text>
            </View>
        );
    };

    return (
        <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            ListEmptyComponent={!loading ? renderEmpty : null}
            ListFooterComponent={renderFooter}
            contentContainerStyle={[
                posts.length === 0 ? styles.emptyList : { flexGrow: 1 },
                { paddingBottom: insets.bottom + 70 },
            ]}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={10}
        />
    );
};
