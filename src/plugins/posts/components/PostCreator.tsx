import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { useStyles } from "@/core/theming/useStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { useConfig } from "@/core/config/ConfigProvider";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useEnhancedPlugins } from "@/core/plugins/PluginProvider";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/base/Button";
import { ExtensionPoint } from "@/core/plugins/ExtensionPoint";
import { PostService } from "../services/PostService";
import { addPost, setError } from "../store/postsSlice";
import { CreatePostData } from "../types";

interface PostCreatorProps {
    onPostCreated?: () => void;
    placeholder?: string;
    variant?: "default" | "modal" | "inline";
}

export const PostCreator = ({
    onPostCreated,
    placeholder,
    variant = "default",
}: PostCreatorProps) => {
    const styles = useStyles("PostCreator", { variant });
    const { t } = useTranslation();
    const { config } = useConfig();
    const { pluginManager } = useEnhancedPlugins();

    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);
    const [visibility, setVisibility] = useState<"public" | "private">(
        "public",
    );

    const user = useAppSelector((state) => state.auth.user);
    const store = pluginManager.getStore();

    // Get maxLength from configuration, fallback to 280 if not configured
    const maxLength = config.plugins?.config?.posts?.maxLength ||
        config.features?.posts?.maxLength ||
        280;

    const handleSubmit = async () => {
        if (!content.trim() || !user) return;

        try {
            setLoading(true);

            const postData: CreatePostData = {
                content: content.trim(),
                emotion_id: selectedEmotion,
                visibility,
            };

            const newPost = await PostService.createPost(postData);
            store.dispatch(addPost(newPost));

            setContent("");
            setSelectedEmotion(null);
            onPostCreated?.();
        } catch (error) {
            store.dispatch(setError((error as Error).message));
        } finally {
            setLoading(false);
        }
    };

    // Use configured maxLength instead of hardcoded values
    const isValid = content.trim().length > 0 && content.length <= maxLength;
    const remainingChars = maxLength - content.length;

    // Add some buffer to TextInput maxLength (e.g., 10% more)
    const textInputMaxLength = Math.ceil(maxLength * 1.1);

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder || t("posts.whatsOnYourMind")}
                    placeholderTextColor={styles.placeholder?.color}
                    value={content}
                    onChangeText={setContent}
                    multiline
                    textAlignVertical="top"
                    maxLength={textInputMaxLength}
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

            <ExtensionPoint
                name="post.creator.content"
                content={content}
                setContent={setContent}
                selectedEmotion={selectedEmotion}
                setSelectedEmotion={setSelectedEmotion}
            />

            <View style={styles.toolbar}>
                <View style={styles.toolbarLeft}>
                    <ExtensionPoint
                        name="post.creator.toolbar"
                        filterBy={{ tags: ["media"] }}
                        maxExtensions={3}
                        fallback={() => (
                            <View style={styles.defaultToolbar}>
                                <TouchableOpacity style={styles.toolbarButton}>
                                    <Icon
                                        name="image"
                                        size={20}
                                        color="#6D6D6D"
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.toolbarButton}>
                                    <Icon
                                        name="camera"
                                        size={20}
                                        color="#6D6D6D"
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                    />

                    <TouchableOpacity
                        style={styles.visibilityButton}
                        onPress={() =>
                            setVisibility(
                                visibility === "public" ? "private" : "public",
                            )}
                    >
                        <Icon
                            name={visibility === "public" ? "globe" : "lock"}
                            size={16}
                            color="#6D6D6D"
                        />
                        <Text style={styles.visibilityText}>
                            {t(`posts.visibility.${visibility}`)}
                        </Text>
                    </TouchableOpacity>
                </View>

                <Button
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={!isValid || loading}
                    variant="primary"
                    size="sm"
                >
                    {t("posts.post")}
                </Button>
            </View>
        </View>
    );
};
