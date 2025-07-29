import { useState } from "react";
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors, useStyles } from "@/core/theming/useStyles";
import { useTheme } from "@/core/theming/ThemeProvider";
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
    const colors = useColors();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const { config } = useConfig();
    const { pluginManager } = useEnhancedPlugins();
    const insets = useSafeAreaInsets();
    const { height: screenHeight } = Dimensions.get("window");

    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);
    const [visibility, setVisibility] = useState<"public" | "private">(
        "public",
    );

    const user = useAppSelector((state) => state.auth.user);
    const store = pluginManager.getStore();

    // Get maxLength from configuration, fallback to 5000 if not configured
    const maxLength = config.plugins?.config?.posts?.maxLength ||
        config.features?.posts?.maxLength ||
        5000;

    const isValid = content.trim().length > 0 && content.length <= maxLength;
    const remainingChars = maxLength - content.length;
    const isNearLimit = remainingChars < 50;
    const isOverLimit = remainingChars < 0;

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
        } catch (err) {
            store.dispatch(setError((err as Error).message));
        } finally {
            setLoading(false);
        }
    };

    // Calculate available height for text input
    const toolbarHeight = 60;
    const headerPadding = 20;
    const availableHeight = screenHeight - insets.top - insets.bottom -
        toolbarHeight - headerPadding;
    const inputHeight = Math.max(200, availableHeight * 0.6);

    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
                backgroundColor: colors.background.primary,
            }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={insets.top}
        >
            <View
                style={[
                    styles.base,
                    {
                        flex: 1,
                        paddingTop: insets.top + 10,
                        paddingHorizontal: 16,
                    },
                ]}
            >
                {/* Main content area */}
                <View style={{ flex: 1 }}>
                    {/* Text input area */}
                    <View style={[styles.inputContainer, { flex: 1 }]}>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    height: inputHeight,
                                    fontSize: 18,
                                    lineHeight: 24,
                                    color: colors.text.primary,
                                },
                            ]}
                            value={content}
                            onChangeText={setContent}
                            placeholder={placeholder ||
                                t("posts.whatsOnYourMind")}
                            placeholderTextColor={colors.text.placeholder}
                            multiline
                            textAlignVertical="top"
                            maxLength={maxLength}
                            returnKeyType="default"
                            blurOnSubmit={false}
                        />
                    </View>

                    {/* Character count */}
                    <View style={styles.inputFooter}>
                        <Text
                            style={[
                                styles.charCount,
                                isNearLimit && styles.charCountWarning,
                                isOverLimit && styles.charCountError,
                            ]}
                        >
                            {remainingChars}
                        </Text>
                    </View>
                </View>

                {/* Bottom toolbar */}
                <View
                    style={[styles.toolbar, {
                        paddingBottom: insets.bottom + 8,
                        marginBottom: 0,
                    }]}
                >
                    <View style={styles.toolbarLeft}>
                        <ExtensionPoint
                            name="create.toolbar"
                            fallback={() => (
                                <View style={styles.defaultToolbar}>
                                    <TouchableOpacity
                                        style={styles.toolbarButton}
                                    >
                                        <Icon
                                            name="image"
                                            size={20}
                                            color={colors.text.secondary}
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.toolbarButton}
                                    >
                                        <Icon
                                            name="camera"
                                            size={20}
                                            color={colors.text.secondary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                        />

                        <TouchableOpacity
                            style={styles.visibilityButton}
                            onPress={() => setVisibility(
                                visibility === "public" ? "private" : "public",
                            )}
                        >
                            <Icon
                                name={visibility === "public"
                                    ? "globe"
                                    : "lock"}
                                size={16}
                                color={colors.text.secondary}
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
        </KeyboardAvoidingView>
    );
};
