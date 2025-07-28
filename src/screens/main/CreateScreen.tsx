import { useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "@/core/theming/ThemeProvider";
import { useStyles } from "@/core/theming/useStyles";
import { usePosts } from "@/hooks/usePosts";
import { Button } from "@/components/base/Button";
import { Card } from "@/components/base/Card";

export const CreateScreen = () => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const { theme } = useTheme();
    const { createPost } = usePosts();
    const styles = useStyles("Screen");
    const creatorStyles = useStyles("PostCreator", { loading });

    const handlePublish = async () => {
        if (!content.trim()) return;

        setLoading(true);
        try {
            await createPost({
                content: content.trim(),
                visibility: "public",
            });
            setContent("");
        } catch (error) {
            console.error("Failed to create post:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.base}>
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                <Card>
                    <TextInput
                        style={creatorStyles.input}
                        placeholder={t("posts.whatsOnYourMind")}
                        placeholderTextColor={theme.colors.text.tertiary}
                        value={content}
                        onChangeText={setContent}
                        multiline
                        maxLength={280}
                        editable={!loading}
                        autoFocus
                    />

                    <View style={creatorStyles.buttonContainer}>
                        <Button
                            onPress={handlePublish}
                            disabled={!content.trim()}
                            loading={loading}
                        >
                            {t("posts.publish")}
                        </Button>
                    </View>
                </Card>
            </ScrollView>
        </View>
    );
};
