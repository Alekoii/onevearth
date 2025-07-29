import { useState } from "react";
import {
    Alert,
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useColors, useStyles } from "@/core/theming/useStyles";
import { useTheme } from "@/core/theming/ThemeProvider";
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
    const colors = useColors();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const { config } = useConfig();
    const { pluginManager } = useEnhancedPlugins();

    const [content, setContent] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [loading, setLoading] = useState(false);

    const user = useAppSelector((state) => state.auth.user);
    const store = pluginManager.getStore();

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
                    backgroundColor: colors.surface.primary,
                    borderTopWidth: 1,
                    borderTopColor: colors.border.primary,
                    paddingHorizontal: theme.spacing.md,
                    paddingTop: theme.spacing.sm,
                    paddingBottom: theme.spacing.sm,
                }}
            >
                {/* Main Input Container */}
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        // Focus the TextInput when container is pressed
                        setIsFocused(true);
                    }}
                    style={{
                        flexDirection: "row",
                        alignItems: isFocused ? "flex-start" : "center",
                        backgroundColor: colors.background.secondary,
                        borderRadius: theme.borderRadius.xl,
                        paddingHorizontal: theme.spacing.md,
                        paddingVertical: theme.spacing.sm,
                        minHeight: 44,
                    }}
                >
                    <TextInput
                        ref={(ref) => {
                            if (isFocused && ref) {
                                ref.focus();
                            }
                        }}
                        style={{
                            flex: 1,
                            fontSize: theme.typography.fontSize.md,
                            color: colors.text.primary,
                            minHeight: isFocused ? 80 : 28,
                            maxHeight: 120,
                            textAlignVertical: isFocused ? "top" : "center",
                            paddingVertical: 0, // Remove default padding
                        }}
                        placeholder="Write a comment..."
                        placeholderTextColor={colors.text.tertiary}
                        value={content}
                        onChangeText={setContent}
                        multiline={true}
                        onFocus={() => setIsFocused(true)}
                        maxLength={maxLength}
                        blurOnSubmit={false}
                        editable={true}
                        autoCorrect={true}
                        autoCapitalize="sentences"
                        returnKeyType="default"
                        scrollEnabled={isFocused}
                    />

                    {/* Send Button - always visible but conditionally enabled */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={!isValid || loading}
                        style={{
                            marginLeft: theme.spacing.xs,
                            padding: theme.spacing.xs,
                            borderRadius: theme.borderRadius.full,
                            backgroundColor: isValid && !loading
                                ? theme.colors.primary[500]
                                : colors.neutral(300),
                            opacity: loading ? 0.6 : 1,
                        }}
                        activeOpacity={0.7}
                    >
                        {loading
                            ? (
                                <View
                                    style={{
                                        width: 20,
                                        height: 20,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 8,
                                            color: colors.text.inverse,
                                        }}
                                    >
                                        ...
                                    </Text>
                                </View>
                            )
                            : (
                                <Icon
                                    name="arrow-right"
                                    color={colors.text.inverse}
                                    size={20}
                                    strokeWidth={2}
                                />
                            )}
                    </TouchableOpacity>
                </TouchableOpacity>

                {/* Expanded Controls - only show when focused */}
                {isFocused && (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: theme.spacing.sm,
                            paddingHorizontal: theme.spacing.xs,
                        }}
                    >
                        {/* Cancel Button */}
                        <TouchableOpacity
                            onPress={handleCancel}
                            style={{
                                paddingVertical: theme.spacing.xs,
                                paddingHorizontal: theme.spacing.sm,
                            }}
                            disabled={loading}
                        >
                            <Text
                                style={{
                                    color: colors.text.secondary,
                                    fontSize: theme.typography.fontSize.sm,
                                    fontWeight:
                                        theme.typography.fontWeight.medium,
                                }}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        {/* Right Side Controls */}
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: theme.spacing.md,
                            }}
                        >
                            {/* Character Count */}
                            <Text
                                style={{
                                    fontSize: theme.typography.fontSize.xs,
                                    color: remainingChars < 50
                                        ? colors.error(500)
                                        : remainingChars < 100
                                        ? colors.warning(500)
                                        : colors.text.secondary,
                                    fontWeight:
                                        theme.typography.fontWeight.medium,
                                }}
                            >
                                {remainingChars}
                            </Text>

                            {/* Post Button */}
                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={!isValid || loading}
                                style={{
                                    backgroundColor: isValid && !loading
                                        ? theme.colors.primary[500]
                                        : colors.neutral(300),
                                    paddingHorizontal: theme.spacing.lg,
                                    paddingVertical: theme.spacing.xs,
                                    borderRadius: theme.borderRadius.md,
                                    minWidth: 60,
                                    alignItems: "center",
                                    opacity: loading ? 0.6 : 1,
                                }}
                            >
                                <Text
                                    style={{
                                        color: colors.text.inverse,
                                        fontSize: theme.typography.fontSize.sm,
                                        fontWeight:
                                            theme.typography.fontWeight
                                                .semibold,
                                    }}
                                >
                                    {loading ? "..." : "Post"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        );
    }

    // Default variant (non-sticky)
    return (
        <View
            style={{
                backgroundColor: colors.surface.primary,
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.md,
                marginBottom: theme.spacing.md,
            }}
        >
            <View
                style={{
                    marginBottom: theme.spacing.sm,
                    position: "relative",
                }}
            >
                <TextInput
                    style={{
                        fontSize: theme.typography.fontSize.sm,
                        color: colors.text.primary,
                        padding: theme.spacing.sm,
                        backgroundColor: colors.background.secondary,
                        borderRadius: theme.borderRadius.sm,
                        borderWidth: 1,
                        borderColor: isFocused
                            ? colors.primary(500)
                            : colors.border.primary,
                        textAlignVertical: "top",
                        minHeight: 80,
                        maxHeight: 150,
                    }}
                    placeholder="Write a comment..."
                    placeholderTextColor={colors.text.tertiary}
                    value={content}
                    onChangeText={setContent}
                    multiline={true}
                    textAlignVertical="top"
                    maxLength={maxLength}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    editable={true}
                    autoCorrect={true}
                    autoCapitalize="sentences"
                />

                {/* Character counter */}
                {(isFocused || remainingChars < 50) && (
                    <Text
                        style={{
                            position: "absolute",
                            bottom: theme.spacing.xs,
                            right: theme.spacing.xs,
                            fontSize: theme.typography.fontSize.xs,
                            color: remainingChars < 20
                                ? colors.error(500)
                                : remainingChars < 50
                                ? colors.warning(500)
                                : colors.text.secondary,
                            backgroundColor: colors.surface.primary,
                            paddingHorizontal: theme.spacing.xs,
                            borderRadius: theme.borderRadius.xs,
                        }}
                    >
                        {remainingChars}
                    </Text>
                )}
            </View>

            {/* Action buttons */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <TouchableOpacity
                    onPress={handleCancel}
                    style={{
                        paddingHorizontal: theme.spacing.md,
                        paddingVertical: theme.spacing.xs,
                        borderRadius: theme.borderRadius.sm,
                        borderWidth: 1,
                        borderColor: colors.border.primary,
                    }}
                    disabled={loading}
                >
                    <Text
                        style={{
                            fontSize: theme.typography.fontSize.sm,
                            color: colors.text.secondary,
                            fontWeight: theme.typography.fontWeight.medium,
                        }}
                    >
                        Cancel
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={!isValid || loading}
                    style={{
                        paddingHorizontal: theme.spacing.lg,
                        paddingVertical: theme.spacing.xs,
                        borderRadius: theme.borderRadius.sm,
                        backgroundColor: isValid && !loading
                            ? theme.colors.primary[500]
                            : colors.neutral(300),
                        minWidth: 80,
                        alignItems: "center",
                        opacity: loading ? 0.6 : 1,
                    }}
                >
                    <Text
                        style={{
                            fontSize: theme.typography.fontSize.sm,
                            color: colors.text.inverse,
                            fontWeight: theme.typography.fontWeight.medium,
                        }}
                    >
                        {loading ? "Posting..." : "Post Comment"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
