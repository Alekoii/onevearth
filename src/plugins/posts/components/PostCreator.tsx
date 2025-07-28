import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { useStyles } from "@/core/theming/useStyles";
import { useTranslation } from "@/hooks/useTranslation";
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
    const { pluginManager } = useEnhancedPlugins();

    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);
    const [visibility, setVisibility] = useState<"public" | "private">(
        "public",
    );

    const user = useAppSelector((state) => state.auth.user);
    const store = pluginManager.getStore();

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

    const isValid = content.trim().length > 0 && content.length <= 280;
    const remainingChars = 280 - content.length;

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
                    maxLength={300}
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
                            name={visibility === "public" ? "user" : "home"}
                            size={16}
                            color="#6D6D6D"
                        />
                        <Text style={styles.visibilityText}>
                            {visibility === "public" ? "Public" : "Private"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <Button
                    onPress={handleSubmit}
                    disabled={!isValid || loading}
                    loading={loading}
                    variant="primary"
                    size="sm"
                >
                    {t("posts.publish")}
                </Button>
            </View>

            <ExtensionPoint
                name="post.creator.footer"
                content={content}
                visibility={visibility}
                selectedEmotion={selectedEmotion}
            />
        </View>
    );
};
