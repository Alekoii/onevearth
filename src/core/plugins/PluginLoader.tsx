import { useEffect } from "react";
import { usePlugins } from "@/core/plugins/PluginProvider";
import { defaultPlugins } from "@/core/plugins/defaultPlugins";

export const PluginLoader = () => {
    const { loadPlugin } = usePlugins();

    useEffect(() => {
        defaultPlugins.forEach((plugin) => {
            loadPlugin(plugin);
        });
    }, [loadPlugin]);

    return null;
};
