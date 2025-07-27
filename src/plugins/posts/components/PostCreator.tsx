import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useTheme } from "@/core/theming/ThemeProvider";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { addPost } from "@/store/slices/postsSlice";
import { Button } from "@/components/base/Button";
import { Card } from "@/components/base/Card";

interface PostCreatorProps {
    onSubmit?: (content: string) => void;
}

export const PostCreator = ({ onSubmit }: PostCreatorProps) => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const styles = StyleSheet.create({
        container: {
            marginBottom: theme.spacing.md,
        },
        input: {
            minHeight: 100,
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text.primary,
            textAlignVertical: "top",
            marginBottom: theme.spacing.md,
        },
        buttonContainer: {
            alignItems: "flex-end",
        },
    });

    const handleSubmit = async () => {
        if (!content.trim()) return;

        setLoading(true);

        try {
            // Create mock post for now
            const newPost = {
                id: Date.now().toString(),
                userId: "current-user",
                content: content.trim(),
                emotion: undefined,
                media: [],
                visibility: "public" as const,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                likeCount: 0,
                commentCount: 0,
            };

            dispatch(addPost(newPost));
            onSubmit?.(content.trim());
            setContent("");
        } catch (error) {
            console.error("Failed to create post:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={t("posts.whatsOnYourMind")}
                placeholderTextColor={theme.colors.text.tertiary}
                value={content}
                onChangeText={setContent}
                multiline
                maxLength={280}
                editable={!loading}
            />
            <View style={styles.buttonContainer}>
                <Button
                    onPress={handleSubmit}
                    disabled={!content.trim()}
                    loading={loading}
                    size="sm"
                >
                    {t("posts.publish")}
                </Button>
            </View>
        </Card>
    );
};
