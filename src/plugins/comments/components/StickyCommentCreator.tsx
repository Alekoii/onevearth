import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useColors, useStyles } from "@/core/theming/useStyles";
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
    post?: { id: number; [key: string]: any };
    postId?: number;
    parentCommentId?: number | null;
    onCommentCreated?: () => void;
    variant?: "footer" | "default";
}

export const StickyCommentCreator = ({
    post,
    postId,
    parentCommentId = null,
    onCommentCreated,
    variant = "footer",
}: StickyCommentCreatorProps) => {
    const styles = useStyles("CommentCreator", { variant });
    const colors = useColors();
    const { t } = useTranslation();
    const { config } = useConfig();
    const { pluginManager } = useEnhancedPlugins();

    const [content, setContent] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [loading, setLoading] = useState(false);

    const user = useAppSelector((state) => state.auth.user);
    const store = pluginManager.getStore();

    // Handle both prop patterns: direct postId or post object
    const effectivePostId = postId || post?.id;

    if (!effectivePostId) {
        console.error("StickyCommentCreator: No postId provided");
        return null;
    }

    // Get maxLength from configuration
    const maxLength = config.plugins?.config?.comments?.maxLength || 500;

    const handleSubmit = async () => {
        if (!content.trim() || !user || loading) return;

        try {
            setLoading(true);
            store.dispatch(setCreating(true));

            const commentData: CreateCommentData = {
                post_id: effectivePostId,
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

    const handleFocus = () => {
        setIsFocused(true);
    };

    const isValid = content.trim().length > 0 && content.length <= maxLength;
    const remainingChars = maxLength - content.length;
    const isNearLimit = remainingChars < 20;
    const isOverLimit = remainingChars < 0;

    if (variant === "footer") {
        return (
            <View
                style={[
                    styles.container,
                    {
                        flexDirection: isFocused ? "column" : "row",
                        alignItems: isFocused ? "stretch" : "center",
                        backgroundColor: colors.surface.primary,
                        borderTopWidth: 1,
                        borderTopColor: colors.border.primary,
                        padding: 16,
                        gap: isFocused ? 12 : 8,
                    },
                ]}
            >
                {/* Input Section */}
                <View
                    style={[
                        styles.inputContainer,
                        {
                            flexDirection: "row",
                            alignItems: isFocused ? "flex-start" : "center",
                            backgroundColor: colors.background.secondary,
                            borderRadius: 20,
                            paddingHorizontal: 16,
                            paddingVertical: isFocused ? 12 : 8,
                            minHeight: 44,
                            flex: 1,
                            borderWidth: isFocused ? 2 : 1,
                            borderColor: isFocused
                                ? colors.border.focus
                                : colors.border.primary,
                        },
                    ]}
                >
                    <TextInput
                        style={[
                            styles.input,
                            {
                                flex: 1,
                                fontSize: 16,
                                color: colors.text.primary,
                                minHeight: isFocused ? 80 : 28,
                                textAlignVertical: isFocused ? "top" : "center",
                                paddingVertical: 0,
                                paddingHorizontal: 0,
                                borderWidth: 0,
                                backgroundColor: "transparent",
                            },
                        ]}
                        placeholder="Write a comment..."
                        placeholderTextColor={colors.text.secondary}
                        value={content}
                        onChangeText={setContent}
                        multiline={isFocused}
                        onFocus={handleFocus}
                        maxLength={maxLength + 50} // Allow some buffer for validation
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
                                backgroundColor: isValid && !loading
                                    ? colors.primary(500)
                                    : colors.surface.secondary,
                                opacity: !isValid || loading ? 0.6 : 1,
                            }}
                        >
                            {loading
                                ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={colors.text.inverse}
                                    />
                                )
                                : (
                                    <Icon
                                        name="comment"
                                        size={16}
                                        color={isValid
                                            ? colors.text.inverse
                                            : colors.text.secondary}
                                    />
                                )}
                        </TouchableOpacity>
                    )}
                </View>

                {/* Character Counter and Actions (when focused) */}
                {isFocused && (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        {/* Character counter */}
                        <Text
                            style={[
                                styles.charCounter,
                                {
                                    fontSize: 12,
                                    color: isOverLimit
                                        ? colors.error(500)
                                        : isNearLimit
                                        ? colors.warning(500)
                                        : colors.text.secondary,
                                },
                            ]}
                        >
                            {remainingChars} characters remaining
                        </Text>

                        {/* Action buttons */}
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 12,
                            }}
                        >
                            <TouchableOpacity
                                onPress={handleCancel}
                                disabled={loading}
                                style={[
                                    styles.cancelButton,
                                    {
                                        paddingHorizontal: 16,
                                        paddingVertical: 8,
                                        borderRadius: 16,
                                        backgroundColor:
                                            colors.surface.secondary,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.cancelButtonText,
                                        { color: colors.text.primary },
                                    ]}
                                >
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={!isValid || loading}
                                style={[
                                    styles.submitButton,
                                    {
                                        paddingHorizontal: 16,
                                        paddingVertical: 8,
                                        borderRadius: 16,
                                        backgroundColor: isValid && !loading
                                            ? colors.primary(500)
                                            : colors.surface.secondary,
                                        opacity: !isValid || loading ? 0.6 : 1,
                                    },
                                ]}
                            >
                                {loading
                                    ? (
                                        <ActivityIndicator
                                            size="small"
                                            color={colors.text.inverse}
                                        />
                                    )
                                    : (
                                        <Text
                                            style={[
                                                styles.submitButtonText,
                                                {
                                                    color: isValid
                                                        ? colors.text.inverse
                                                        : colors.text.secondary,
                                                },
                                            ]}
                                        >
                                            Post
                                        </Text>
                                    )}
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
                    style={[
                        styles.input,
                        {
                            backgroundColor: colors.background.secondary,
                            borderColor: isFocused
                                ? colors.border.focus
                                : colors.border.primary,
                            color: colors.text.primary,
                        },
                    ]}
                    placeholder="Write a comment..."
                    placeholderTextColor={colors.text.secondary}
                    value={content}
                    onChangeText={setContent}
                    onFocus={handleFocus}
                    multiline
                    textAlignVertical="top"
                    maxLength={maxLength}
                />

                <View style={styles.inputFooter}>
                    <Text
                        style={[
                            styles.charCount,
                            {
                                color: isOverLimit
                                    ? colors.error(500)
                                    : isNearLimit
                                    ? colors.warning(500)
                                    : colors.text.secondary,
                            },
                        ]}
                    >
                        {remainingChars}
                    </Text>
                </View>
            </View>

            <View style={styles.toolbar}>
                <TouchableOpacity
                    onPress={handleCancel}
                    style={[
                        styles.cancelButton,
                        { backgroundColor: colors.surface.secondary },
                    ]}
                >
                    <Text
                        style={[
                            styles.cancelText,
                            { color: colors.text.primary },
                        ]}
                    >
                        Cancel
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={!isValid || loading}
                    style={[
                        styles.submitButton,
                        {
                            backgroundColor: isValid && !loading
                                ? colors.primary(500)
                                : colors.surface.secondary,
                            opacity: !isValid || loading ? 0.6 : 1,
                        },
                    ]}
                >
                    {loading
                        ? (
                            <ActivityIndicator
                                size="small"
                                color={colors.text.inverse}
                            />
                        )
                        : (
                            <Text
                                style={[
                                    styles.submitText,
                                    {
                                        color: isValid
                                            ? colors.text.inverse
                                            : colors.text.secondary,
                                    },
                                ]}
                            >
                                Post Comment
                            </Text>
                        )}
                </TouchableOpacity>
            </View>
        </View>
    );
};
