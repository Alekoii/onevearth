import { useState } from "react";
import { TextInput, View } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "@/core/theming/ThemeProvider";
import { usePosts } from "@/hooks/usePosts";
import { Button } from "@/components/base/Button";
import { Card } from "@/components/base/Card";
import { useStyles } from "@/core/theming/useStyles";

interface PostCreatorProps {
    onSubmit?: (content: string) => void;
}

export const PostCreator = ({ onSubmit }: PostCreatorProps) => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const { theme } = useTheme();
    const { createPost } = usePosts();
    const styles = useStyles("PostCreator", { loading });

    const handleSubmit = async () => {
        if (!content.trim()) return;

        setLoading(true);
        try {
            await createPost({
                content: content.trim(),
                visibility: "public",
            });

            onSubmit?.(content.trim());
            setContent("");
        } catch (error) {
            console.error("Failed to create post:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card style={styles.base}>
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
