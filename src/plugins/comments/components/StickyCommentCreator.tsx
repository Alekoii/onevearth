import { useState } from "react";
import {
    Alert,
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useStyles } from "@/core/theming/useStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { useConfig } from "@/core/config/ConfigProvider";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useEnhancedPlugins } from "@/core/plugins/PluginProvider";
import { Icon } from "@/components/ui/Icon";
import { CommentService } from "../services/CommentService";
import {
    addComment,
    setCreateError,
    setCreating,
} from "../store/commentsSlice";
import { CreateCommentData } from "../types";

interface StickyCommentCreatorProps {
    post: {
        id: number;
    };
    parentCommentId?: number | null;
    onCommentCreated?: () => void;
    variant?: "footer" | "default";
}

export const StickyCommentCreator = ({
    post,
    parentCommentId = null,
    onCommentCreated,
    variant = "footer",
}: StickyCommentCreatorProps) => {
    const styles = useStyles("CommentCreator", { variant });
    const { t } = useTranslation();
    const { config } = useConfig();
    const { pluginManager } = useEnhancedPlugins();

    const [content, setContent] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [loading, setLoading] = useState(false);

    const user = useAppSelector((state) => state.auth.user);
    const store = pluginManager.getStore();

    // Get maxLength from configuration
    const maxLength = config.plugins?.config?.comments?.maxLength || 500;

    const handleSubmit = async () => {
        if (!content.trim() || !user || loading) return;

        try {
            setLoading(true);
            store.dispatch(setCreating(true));

            const commentData: CreateCommentData = {
                post_id: post.id,
                content: content.trim(),
                parent_comment_id: parentCommentId,
            };

            const newComment = await CommentService.createComment(commentData);
            store.dispatch(addComment(newComment));

            // Clear the input and dismiss keyboard
            setContent("");
            setIsFocused(false);
            Keyboard.dismiss();
            onCommentCreated?.();
        } catch (error) {
            console.error("Failed to create comment:", error);
            store.dispatch(setCreateError((error as Error).message));
            Alert.alert("Error", "Failed to post comment. Please try again.");
        } finally {
            setLoading(false);
            store.dispatch(setCreating(false));
        }
    };

    const handleCancel = () => {
        setContent("");
        setIsFocused(false);
        Keyboard.dismiss();
    };

    const isValid = content.trim().length > 0 && content.length <= maxLength;
    const remainingChars = maxLength - content.length;

    if (variant === "footer") {
        return (
            <View
                style={{
                    flexDirection: isFocused ? "column" : "row",
                    alignItems: isFocused ? "stretch" : "center",
                }}
            >
                {/* Input Row */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#f3f4f6",
                        borderRadius: 20,
                        paddingHorizontal: 16,
                        paddingVertical: isFocused ? 12 : 8,
                        minHeight: 44,
                        flex: 1,
                    }}
                >
                    <TextInput
                        style={{
                            flex: 1,
                            fontSize: 16,
                            color: "#1f2937",
                            minHeight: isFocused ? 80 : 28,
                            textAlignVertical: isFocused ? "top" : "center",
                        }}
                        placeholder="Write a comment..."
                        placeholderTextColor="#9ca3af"
                        value={content}
                        onChangeText={setContent}
                        multiline={isFocused}
                        onFocus={() => setIsFocused(true)}
                        maxLength={maxLength + 50} // Allow some buffer
                        blurOnSubmit={false}
                    />

                    {/* Send Button - only show when there's content */}
                    {content.trim().length > 0 && (
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={!isValid || loading}
                            style={{
                                marginLeft: 8,
                                padding: 8,
                                borderRadius: 16,
                                backgroundColor: isValid
                                    ? "#DB00FF"
                                    : "#d1d5db",
                            }}
                        >
                            <Icon
                                name="arrow-right"
                                color="#fff"
                                size={16}
                                strokeWidth={2}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Expanded controls when focused */}
                {isFocused && (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 8,
                            paddingHorizontal: 4,
                        }}
                    >
                        <TouchableOpacity
                            onPress={handleCancel}
                            style={{
                                padding: 8,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#6b7280",
                                    fontSize: 14,
                                    fontWeight: "500",
                                }}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            {/* Character count */}
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: remainingChars < 50
                                        ? "#ef4444"
                                        : "#6b7280",
                                }}
                            >
                                {remainingChars}
                            </Text>

                            {/* Post button */}
                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={!isValid || loading}
                                style={{
                                    backgroundColor: isValid
                                        ? "#DB00FF"
                                        : "#d1d5db",
                                    paddingHorizontal: 16,
                                    paddingVertical: 8,
                                    borderRadius: 16,
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#fff",
                                        fontSize: 14,
                                        fontWeight: "600",
                                    }}
                                >
                                    {loading ? "Posting..." : "Post"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        );
    }

    // Default variant (original CommentCreator)
    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Write a comment..."
                    placeholderTextColor="#9ca3af"
                    value={content}
                    onChangeText={setContent}
                    multiline
                    textAlignVertical="top"
                    maxLength={maxLength}
                />

                <View style={styles.inputFooter}>
                    <Text
                        style={[
                            styles.charCount,
                            remainingChars < 20 && styles.charCountWarning,
                            remainingChars < 0 && styles.charCountError,
                        ]}
                    >
                        {remainingChars}
                    </Text>
                </View>
            </View>

            <View style={styles.toolbar}>
                <TouchableOpacity
                    onPress={handleCancel}
                    style={styles.cancelButton}
                >
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={!isValid || loading}
                    style={[
                        styles.submitButton,
                        (!isValid || loading) && styles.submitButtonDisabled,
                    ]}
                >
                    <Text style={styles.submitText}>
                        {loading ? "Posting..." : "Post Comment"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
