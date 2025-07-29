import { useCallback, useEffect, useRef, useState } from "react";
import { useEnhancedPlugins } from "./PluginProvider";
import { useConfig } from "@/core/config/ConfigProvider";
import { PostsPlugin } from "@/plugins/posts";
import { CommentsPlugin } from "@/plugins/comments";
import { NotificationsPlugin } from "@/plugins/notifications"; // Add this import

const availablePlugins = {
    posts: PostsPlugin,
    comments: CommentsPlugin,
    notifications: NotificationsPlugin, // Add the notifications plugin here
};

export const PluginLoader = () => {
    const { config } = useConfig();
    const { loadPlugin, plugins } = useEnhancedPlugins();
    const [isLoading, setIsLoading] = useState(false);
    const processedConfigRef = useRef<string>("");

    const loadEnabledPlugins = useCallback(async () => {
        const enabledPlugins = config.plugins?.enabled || [];
        const configKey = enabledPlugins.join(",");

        if (isLoading || processedConfigRef.current === configKey) {
            return;
        }

        setIsLoading(true);
        processedConfigRef.current = configKey;

        try {
            for (const pluginId of enabledPlugins) {
                const plugin =
                    availablePlugins[pluginId as keyof typeof availablePlugins];

                if (plugin) {
                    try {
                        await loadPlugin(plugin);
                        console.log(`Successfully loaded plugin: ${pluginId}`);
                    } catch (error) {
                        if (
                            !(error as Error).message.includes("already loaded")
                        ) {
                            console.error(
                                `Failed to load plugin ${pluginId}:`,
                                error,
                            );
                        }
                    }
                } else {
                    console.warn(
                        `Plugin ${pluginId} not found in available plugins`,
                    );
                }
            }
        } finally {
            setIsLoading(false);
        }
    }, [config.plugins?.enabled, loadPlugin, isLoading]);

    useEffect(() => {
        if (config.plugins?.enabled?.length > 0) {
            loadEnabledPlugins();
        }
    }, [loadEnabledPlugins]);

    // Debug logging
    useEffect(() => {
        if (plugins.length > 0) {
            console.log(
                "Loaded plugins:",
                plugins.map((p) => `${p.id} (${p.state})`),
            );
        }
    }, [plugins]);

    return null;
};
