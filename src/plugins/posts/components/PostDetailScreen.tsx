import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useStyles } from "@/core/theming/useStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { ExtensionPoint } from "@/core/plugins/ExtensionPoint";
import { Button } from "@/components/base/Button";
import { RootStackParamList } from "@/types/navigation";
import { PostCard } from "./PostCard";
import { PostService } from "../services/PostService";
import { Post } from "../types";

type PostDetailRouteProp = RouteProp<RootStackParamList, "PostDetail">;

export const PostDetailScreen = () => {
    const route = useRoute<PostDetailRouteProp>();
    const { postId } = route.params;
    const styles = useStyles("Screen");
    const { t } = useTranslation();

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadPost();
    }, [postId]);

    const loadPost = async () => {
        try {
            setLoading(true);
            setError(null);
            const postData = await PostService.getPost(postId);
            setPost(postData);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        loadPost();
    };

    const handleUserPress = (userId: string) => {
        console.log("Navigate to user profile:", userId);
    };

    if (loading) {
        return (
            <View
                style={[styles.base, {
                    justifyContent: "center",
                    alignItems: "center",
                }]}
            >
                <ActivityIndicator size="large" color="#DB00FF" />
                <Text style={{ marginTop: 16, color: "#6D6D6D" }}>
                    {t("common.loading")}
                </Text>
            </View>
        );
    }

    if (error || !post) {
        return (
            <View
                style={[styles.base, {
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 24,
                }]}
            >
                <Text
                    style={{
                        color: "#ef4444",
                        textAlign: "center",
                        marginBottom: 16,
                        fontSize: 16,
                    }}
                >
                    {error || "Post not found"}
                </Text>
                <Button onPress={handleRetry}>
                    {t("common.retry")}
                </Button>
            </View>
        );
    }

    return (
        <View style={styles.base}>
            {/* Post Content Section - scrollable but contained */}
            <View
                style={{
                    backgroundColor: "#fff",
                    borderBottomWidth: 1,
                    borderBottomColor: "#e5e7eb",
                }}
            >
                <ScrollView
                    style={{ maxHeight: 400 }} // Reasonable max height, not 50%
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                >
                    <View style={{ padding: 16 }}>
                        <PostCard
                            post={post}
                            variant="default"
                            maxLines={0}
                            onUserPress={() => handleUserPress(post.user_id)}
                        />

                        <ExtensionPoint
                            name="post.detail.content"
                            post={post}
                            maxExtensions={5}
                        />
                    </View>
                </ScrollView>
            </View>

            {/* Comment Creation Section */}
            <View
                style={{
                    backgroundColor: "#fff",
                    borderBottomWidth: 1,
                    borderBottomColor: "#e5e7eb",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                }}
            >
                <ExtensionPoint
                    name="post.detail.actions"
                    post={post}
                    postId={post.id}
                    fallback={() => (
                        <View
                            style={{
                                backgroundColor: "#f9fafb",
                                borderRadius: 8,
                                padding: 12,
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    color: "#6D6D6D",
                                    fontSize: 14,
                                    textAlign: "center",
                                }}
                            >
                                Comment creation will appear here when comments
                                plugin is enabled
                            </Text>
                        </View>
                    )}
                />
            </View>

            {/* Comments List Section - independent FlatList area */}
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#f9fafb",
                }}
            >
                <ExtensionPoint
                    name="post.detail.comments"
                    post={post}
                    postId={post.id}
                    // Remove fallback since CommentList will handle empty state
                />
            </View>
        </View>
    );
};
