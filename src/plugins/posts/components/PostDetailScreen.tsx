import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
    const insets = useSafeAreaInsets();

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
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                {/* Main Content - Scrollable */}
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                >
                    {/* Post Content */}
                    <View
                        style={{
                            backgroundColor: "#fff",
                            borderBottomWidth: 1,
                            borderBottomColor: "#e5e7eb",
                            padding: 16,
                        }}
                    >
                        <PostCard
                            post={post}
                            variant="default"
                            maxLines={0} // No line limit in detail view
                            onUserPress={() => handleUserPress(post.user_id)}
                        />

                        <ExtensionPoint
                            name="post.detail.content"
                            post={post}
                            maxExtensions={5}
                        />
                    </View>

                    {/* Comments Section */}
                    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
                        <ExtensionPoint
                            name="post.detail.comments"
                            post={post}
                            maxExtensions={1}
                            fallback={() => (
                                <View
                                    style={{
                                        padding: 16,
                                        alignItems: "center",
                                        minHeight: 200,
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#6D6D6D",
                                            fontSize: 16,
                                            textAlign: "center",
                                        }}
                                    >
                                        No comments yet. Be the first to
                                        comment!
                                    </Text>
                                </View>
                            )}
                        />
                    </View>
                </ScrollView>

                {/* Sticky Comment Creator Footer */}
                <View
                    style={{
                        backgroundColor: "#fff",
                        borderTopWidth: 1,
                        borderTopColor: "#e5e7eb",
                        paddingHorizontal: 16,
                        paddingTop: 12,
                        paddingBottom: insets.bottom + 12,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: -2,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 3,
                        elevation: 5,
                    }}
                >
                    <ExtensionPoint
                        name="post.detail.comment-creator"
                        post={post}
                        maxExtensions={1}
                        fallback={() => (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: "#f3f4f6",
                                    borderRadius: 20,
                                    paddingHorizontal: 16,
                                    paddingVertical: 12,
                                    minHeight: 44,
                                }}
                            >
                                <Text
                                    style={{
                                        flex: 1,
                                        color: "#9ca3af",
                                        fontSize: 16,
                                    }}
                                >
                                    Write a comment...
                                </Text>
                            </View>
                        )}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};
