import { useEffect } from "react";
import { useEnhancedPlugins } from "./PluginProvider";
import { useConfig } from "@/core/config/ConfigProvider";
import { PostsPlugin } from "@/plugins/posts";

const availablePlugins = {
    posts: PostsPlugin,
};

export const PluginLoader = () => {
    const { config } = useConfig();
    const { loadPlugin, plugins } = useEnhancedPlugins();

    useEffect(() => {
        const loadEnabledPlugins = async () => {
            const enabledPlugins = config.plugins?.enabled || [];

            for (const pluginId of enabledPlugins) {
                const plugin =
                    availablePlugins[pluginId as keyof typeof availablePlugins];

                if (plugin) {
                    const isAlreadyLoaded = plugins.some((p) =>
                        p.id === pluginId
                    );

                    if (!isAlreadyLoaded) {
                        try {
                            console.log(`Loading plugin: ${pluginId}`);
                            await loadPlugin(plugin);
                            console.log(
                                `Successfully loaded plugin: ${pluginId}`,
                            );
                        } catch (error) {
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
        };

        if (config.plugins?.enabled?.length > 0) {
            loadEnabledPlugins();
        }
    }, [config.plugins?.enabled, loadPlugin, plugins]);

    return null;
};
