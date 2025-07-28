import { useCallback, useEffect, useRef, useState } from "react";
import { useEnhancedPlugins } from "./PluginProvider";
import { useConfig } from "@/core/config/ConfigProvider";
import { PostsPlugin } from "@/plugins/posts";

const availablePlugins = {
    posts: PostsPlugin,
};

export const PluginLoader = () => {
    const { config } = useConfig();
    const { loadPlugin, plugins } = useEnhancedPlugins();
    const [isLoading, setIsLoading] = useState(false);
    const processedConfigRef = useRef<string>("");

    const loadEnabledPlugins = useCallback(async () => {
        const enabledPlugins = config.plugins?.enabled || [];
        const configKey = enabledPlugins.join(",");

        // Skip if we're already loading or have processed this exact config
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
                        console.log(`Loading plugin: ${pluginId}`);
                        await loadPlugin(plugin);
                        console.log(
                            `Successfully loaded plugin: ${pluginId}`,
                        );
                    } catch (error) {
                        // Only log if it's not an "already loaded" error
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

    return null;
};
