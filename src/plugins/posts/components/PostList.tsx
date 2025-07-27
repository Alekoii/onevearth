import { useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/core/theming/ThemeProvider";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { Card } from "@/components/base/Card";
import { PostCard } from "./PostCard";

export const PostList = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { items: posts, loading } = useAppSelector((state) => state.posts);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = () => {
        // TODO: Implement actual post loading
        // For now, we'll just show empty state
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        title: {
            fontSize: theme.typography.fontSize.lg,
            fontWeight: "600",
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.md,
            paddingHorizontal: theme.spacing.md,
        },
        emptyContainer: {
            padding: theme.spacing.lg,
            alignItems: "center",
        },
        emptyText: {
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.secondary,
            textAlign: "center",
        },
        list: {
            paddingHorizontal: theme.spacing.md,
        },
    });

    const renderPost = ({ item }: { item: any }) => <PostCard post={item} />;

    if (posts.length === 0 && !loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{t("posts.posts")}</Text>
                <Card style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        No posts yet. Create your first post!
                    </Text>
                </Card>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t("posts.posts")}</Text>
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};
