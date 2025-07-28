import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useSelector, useStore } from "react-redux";
import { RootState } from "@/store";
import {
    EnhancedPlugin,
    ExtensionRegistration,
    PluginManager,
    PluginState,
} from "./PluginManager";
import {
    ExtensionRegistration as LegacyExtensionRegistration,
    Plugin,
} from "./types";

interface EnhancedPluginContextType {
    plugins: { id: string; state: PluginState }[];
    enabledPlugins: { id: string; state: PluginState }[];

    loadPlugin: (plugin: EnhancedPlugin) => Promise<void>;
    unloadPlugin: (pluginId: string) => Promise<void>;

    getExtensions: (pointName: string) => ExtensionRegistration[];
    getService: <T = any>(name: string) => T | null;

    pluginManager: PluginManager;

    loadLegacyPlugin: (plugin: Plugin) => Promise<void>;
    unloadLegacyPlugin: (pluginId: string) => Promise<void>;
    getLegacyExtensions: (pointName: string) => LegacyExtensionRegistration[];
}

const EnhancedPluginContext = createContext<EnhancedPluginContextType | null>(
    null,
);

export const useEnhancedPlugins = () => {
    const context = useContext(EnhancedPluginContext);
    if (!context) {
        throw new Error(
            "useEnhancedPlugins must be used within EnhancedPluginProvider",
        );
    }
    return context;
};

export const usePlugins = () => {
    const context = useContext(EnhancedPluginContext);
    if (!context) {
        throw new Error(
            "usePlugins must be used within EnhancedPluginProvider",
        );
    }
    return {
        plugins: context.plugins.map((p) => ({ id: p.id, name: p.id })),
        enabledPlugins: context.enabledPlugins.map((p) => ({
            id: p.id,
            name: p.id,
        })),
        loadPlugin: context.loadLegacyPlugin,
        unloadPlugin: context.unloadLegacyPlugin,
        getExtensions: context.getLegacyExtensions,
        api: {
            registerExtension: () => {},
            unregisterExtension: () => {},
            emitEvent: () => {},
            subscribeToEvent: () => {},
        },
    };
};

export const EnhancedPluginProvider = (
    { children }: { children: ReactNode },
) => {
    const [pluginManager] = useState(() => new PluginManager());
    const [plugins, setPlugins] = useState<
        { id: string; state: PluginState }[]
    >([]);
    const [legacyExtensions, setLegacyExtensions] = useState<
        Map<string, LegacyExtensionRegistration[]>
    >(new Map());

    const store = useStore();
    const config = useSelector((state: RootState) => state.config?.config);

    useEffect(() => {
        if (store) {
            pluginManager.setStore(store);
            console.log("PluginManager store set");
        }
    }, [store, pluginManager]);

    useEffect(() => {
        if (config) {
            pluginManager.setConfig(config);
            console.log("PluginManager config set");
        }
    }, [config, pluginManager]);

    const loadPlugin = async (plugin: EnhancedPlugin) => {
        // Ensure store is set on pluginManager before loading
        if (store) {
            pluginManager.setStore(store);
        }

        if (config) {
            pluginManager.setConfig(config);
        }

        try {
            await pluginManager.loadPlugin(plugin);
            setPlugins(pluginManager.getLoadedPlugins());
        } catch (error) {
            console.error(`Failed to load plugin ${plugin.id}:`, error);
            throw error;
        }
    };

    const unloadPlugin = async (pluginId: string) => {
        try {
            await pluginManager.unloadPlugin(pluginId);
            setPlugins(pluginManager.getLoadedPlugins());
        } catch (error) {
            console.error(`Failed to unload plugin ${pluginId}:`, error);
            throw error;
        }
    };

    const loadLegacyPlugin = async (plugin: Plugin) => {
        const enhancedPlugin: EnhancedPlugin = {
            id: plugin.id,
            name: plugin.name,
            version: plugin.version,
            description: plugin.description,
            author: plugin.author,
            components: plugin.components,
            install: plugin.install as any,
            uninstall: plugin.uninstall as any,
            activate: plugin.activate as any,
            deactivate: plugin.deactivate as any,
        };

        await loadPlugin(enhancedPlugin);
    };

    const unloadLegacyPlugin = async (pluginId: string) => {
        await unloadPlugin(pluginId);
    };

    const getExtensions = (pointName: string): ExtensionRegistration[] => {
        return pluginManager.getExtensions(pointName);
    };

    const getLegacyExtensions = (
        pointName: string,
    ): LegacyExtensionRegistration[] => {
        const extensions = legacyExtensions.get(pointName) || [];
        return extensions.sort((a, b) => b.priority - a.priority);
    };

    const getService = <T = any>(name: string): T | null => {
        return pluginManager.getService<T>(name);
    };

    const enabledPlugins = useMemo(() => {
        return plugins.filter((p) => p.state === "activated");
    }, [plugins]);

    const value: EnhancedPluginContextType = {
        plugins,
        enabledPlugins,
        loadPlugin,
        unloadPlugin,
        getExtensions,
        getService,
        pluginManager,
        loadLegacyPlugin,
        unloadLegacyPlugin,
        getLegacyExtensions,
    };

    return (
        <EnhancedPluginContext.Provider value={value}>
            {children}
        </EnhancedPluginContext.Provider>
    );
};

export { EnhancedPluginProvider as PluginProvider };
