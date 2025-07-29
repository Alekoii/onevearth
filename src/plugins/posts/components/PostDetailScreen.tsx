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
import { useColors, useStyles } from "@/core/theming/useStyles";
import { useTheme } from "@/core/theming/ThemeProvider";
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
    const colors = useColors();
    const { theme } = useTheme();
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
                style={[
                    styles.base,
                    {
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: colors.background.primary,
                    },
                ]}
            >
                <ActivityIndicator
                    size="large"
                    color={theme.colors.primary[500]}
                />
                <Text
                    style={{
                        marginTop: theme.spacing.md,
                        color: colors.text.secondary,
                        fontSize: theme.typography.fontSize.md,
                    }}
                >
                    {t("common.loading")}
                </Text>
            </View>
        );
    }

    if (error || !post) {
        return (
            <View
                style={[
                    styles.base,
                    {
                        justifyContent: "center",
                        alignItems: "center",
                        padding: theme.spacing.xl,
                        backgroundColor: colors.background.primary,
                    },
                ]}
            >
                <Text
                    style={{
                        color: colors.error(500),
                        textAlign: "center",
                        marginBottom: theme.spacing.md,
                        fontSize: theme.typography.fontSize.md,
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
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.background.primary,
                }}
            >
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: theme.spacing.lg }}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                >
                    {/* Post Content */}
                    <View
                        style={{
                            backgroundColor: colors.surface.primary,
                            borderBottomWidth: 1,
                            borderBottomColor: colors.border.primary,
                            padding: theme.spacing.md,
                        }}
                    >
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

                    {/* Comments Section */}
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: colors.background.secondary,
                        }}
                    >
                        <ExtensionPoint
                            name="post.detail.comments"
                            post={post}
                            maxExtensions={1}
                            fallback={() => (
                                <View
                                    style={{
                                        padding: theme.spacing.md,
                                        alignItems: "center",
                                        minHeight: 200,
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: colors.text.secondary,
                                            fontSize:
                                                theme.typography.fontSize.md,
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
                        backgroundColor: colors.surface.primary,
                        borderTopWidth: 1,
                        borderTopColor: colors.border.primary,
                        paddingHorizontal: theme.spacing.md,
                        paddingTop: theme.spacing.sm,
                        paddingBottom: insets.bottom + theme.spacing.sm,
                        ...theme.shadows.sm,
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
                                    backgroundColor:
                                        colors.background.secondary,
                                    borderRadius: theme.borderRadius.full,
                                    paddingHorizontal: theme.spacing.md,
                                    paddingVertical: theme.spacing.sm,
                                    minHeight: 44,
                                }}
                            >
                                <Text
                                    style={{
                                        flex: 1,
                                        color: colors.text.tertiary,
                                        fontSize: theme.typography.fontSize.md,
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
