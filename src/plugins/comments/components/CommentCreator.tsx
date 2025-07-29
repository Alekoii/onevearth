import { useState } from "react";
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useStyles } from "@/core/theming/useStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Icon } from "@/components/ui/Icon";
import { ExtensionPoint } from "@/core/plugins/ExtensionPoint";
import { useComments } from "../hooks/useComments";
import { CommentCreatorProps } from "../types";

export const CommentCreator = ({
    postId,
    parentCommentId = null,
    placeholder,
    onCommentCreated,
    onCancel,
    variant = "default",
}: CommentCreatorProps) => {
    const styles = useStyles("CommentCreator", { variant });
    const { t } = useTranslation();
    const [content, setContent] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const user = useAppSelector((state) => state.auth.user);

    const {
        createComment,
        createReply,
        creating,
        createError,
    } = useComments({
        postId,
        autoRefresh: false,
    });

    const isReply = parentCommentId !== null;
    const isValid = content.trim().length > 0 && content.length <= 500;
    const remainingChars = 500 - content.length;

    const effectivePlaceholder = placeholder ||
        (isReply ? "Write a reply..." : "Write a comment...");

    const handleSubmit = async () => {
        if (!content.trim() || !user || creating) return;

        try {
            let newComment;

            if (isReply && parentCommentId) {
                newComment = await createReply(parentCommentId, content.trim());
            } else {
                newComment = await createComment({
                    post_id: postId,
                    content: content.trim(),
                    parent_comment_id: parentCommentId,
                });
            }

            // Clear the form
            setContent("");
            setIsFocused(false);

            // Notify parent component
            if (onCommentCreated) {
                onCommentCreated(newComment);
            }

            // Auto-cancel for reply forms
            if (isReply && onCancel) {
                onCancel();
            }
        } catch (error) {
            console.error("Failed to create comment:", error);
            // Error is handled by the hook and displayed in UI
        }
    };

    const handleCancel = () => {
        setContent("");
        setIsFocused(false);
        if (onCancel) {
            onCancel();
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        // Only blur if the input is empty and it's not a reply
        if (!content.trim() && !isReply) {
            setIsFocused(false);
        }
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <View style={[styles.inputContainer, { opacity: 0.6 }]}>
                    <Text style={styles.placeholder}>
                        Please log in to comment
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Extension point for comment creation header */}
            <ExtensionPoint
                name="comment.creator.header"
                postId={postId}
                parentCommentId={parentCommentId}
                isReply={isReply}
            />

            {/* Input container */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={[
                        styles.input,
                        isFocused && styles.inputFocused,
                        createError && styles.inputError,
                    ]}
                    placeholder={effectivePlaceholder}
                    placeholderTextColor={styles.placeholder?.color}
                    value={content}
                    onChangeText={setContent}
                    multiline
                    textAlignVertical="top"
                    maxLength={500}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    editable={!creating}
                />

                {/* Character counter (only show when focused or near limit) */}
                {(isFocused || remainingChars < 50) && (
                    <Text
                        style={[
                            styles.charCounter,
                            remainingChars < 20 && { color: "#F59E0B" },
                            remainingChars < 0 && { color: "#EF4444" },
                        ]}
                    >
                        {remainingChars}
                    </Text>
                )}
            </View>

            {/* Error message */}
            {createError && (
                <View style={styles.errorContainer}>
                    <Icon name="x" size={16} color="#EF4444" />
                    <Text style={styles.errorText}>
                        {createError}
                    </Text>
                </View>
            )}

            {/* Actions (only show when focused or has content) */}
            {(isFocused || content.trim()) && (
                <View style={styles.actions}>
                    {/* Extension point for additional actions */}
                    <ExtensionPoint
                        name="comment.creator.actions"
                        content={content}
                        isReply={isReply}
                        postId={postId}
                        parentCommentId={parentCommentId}
                    />

                    <View style={styles.buttonGroup}>
                        {/* Cancel button (show for replies or when focused) */}
                        {(isReply || isFocused) && (
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={handleCancel}
                                disabled={creating}
                            >
                                <Text style={styles.cancelButtonText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        )}

                        {/* Submit button */}
                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                (!isValid || creating) &&
                                styles.submitButtonDisabled,
                            ]}
                            onPress={handleSubmit}
                            disabled={!isValid || creating}
                        >
                            {creating
                                ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={styles.submitButtonText.color}
                                    />
                                )
                                : (
                                    <Text style={styles.submitButtonText}>
                                        {isReply ? "Reply" : "Comment"}
                                    </Text>
                                )}
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Extension point for comment creation footer */}
            <ExtensionPoint
                name="comment.creator.footer"
                content={content}
                isValid={isValid}
                creating={creating}
                isReply={isReply}
            />
        </View>
    );
};
