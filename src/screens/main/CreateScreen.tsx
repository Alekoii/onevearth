import { useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "@/core/theming/ThemeProvider";
import { useComponentStyles } from "@/core/theming/useComponentStyles";
import { usePosts } from "@/hooks/usePosts";
import { Button } from "@/components/base/Button";
import { Card } from "@/components/base/Card";
import { createScreenStyles } from "./CreateScreen.styles";

export const CreateScreen = () => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const { theme } = useTheme();
    const { createPost } = usePosts();
    const styles = useComponentStyles("CreateScreen", createScreenStyles, {
        loading,
    });

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
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                <Card style={styles.postContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder={t("posts.whatsOnYourMind")}
                        placeholderTextColor={theme.colors.text.tertiary}
                        value={content}
                        onChangeText={setContent}
                        multiline
                        maxLength={280}
                        editable={!loading}
                        autoFocus
                    />

                    <View style={styles.actions}>
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
